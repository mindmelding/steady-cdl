// Unit checks, free practice tests and the placement check (CLAUDE.md S14, S1).
// A run is drawn once and saved (test_runs), answered with no feedback, then finished in one
// transaction: attempts, Review changes, the sims row (tests) or tested-out lessons (placement).
import { track } from '../analytics';
import { freePracticePool } from '../domain/access';
import { formatClaims } from '../domain/formatClaims';
import { onMiss } from '../domain/review';
import { samplePlacement, scorePlacement, type PlacementCandidate } from '../domain/placement';
import { unitsForGoal } from '../domain/track';
import { drawQuestions, metPassMark, scoreRun, type RunScore } from '../domain/testRun';
import type { Question } from '../db/content/types';
import type { RunKind, TestRun } from '../db/user/repos';
import { recordAnswer } from './answers';
import { useReviewStore } from './reviewStore';
import { clock, getContentRepo, getUserRepo } from './runtime';
import { loadTrack } from './track';

/** Start (or resume) a free practice test or a full unit check. Null when there is nothing to ask. */
export async function startTest(
  unitId: string,
  kind: Exclude<RunKind, 'placement'>,
): Promise<number | null> {
  const user = getUserRepo();
  const content = getContentRepo();
  const active = await user.getActiveRun(kind, unitId);
  if (active) return active.id;
  const unit = await content.getUnit(unitId);
  if (!unit) return null;
  const refs = await content.unitQuestionRefs(unitId);
  const pool =
    kind === 'practice' ? freePracticePool(await content.listLessons(unitId), refs) : refs;
  const format = await content.getStateFormat(unit.state, unit.section);
  const claims = formatClaims(format, {
    available: pool.length,
    fallbackCount: unit.unit_check_count,
  });
  if (claims.questionCount === 0) return null;
  const drawn = drawQuestions(pool, claims.questionCount);
  return user.createRun(
    kind,
    unitId,
    drawn.map((r) => r.id),
    claims.passPct ?? null,
    clock.now(),
  );
}

/** Start a fresh placement check over the saved track's units. Null when there are no questions. */
export async function startPlacement(): Promise<number | null> {
  const track_ = await loadTrack(false);
  if (!track_) return null;
  const content = getContentRepo();
  const user = getUserRepo();
  const units = unitsForGoal(await content.listUnits(track_.contentState), track_.goal);
  const candidates: PlacementCandidate[] = [];
  for (const unit of units) {
    const refs = new Set((await content.unitQuestionRefs(unit.id)).map((r) => r.id));
    for (const lesson of await content.listLessons(unit.id)) {
      candidates.push({
        lessonId: lesson.id,
        unitId: unit.id,
        questionIds: lesson.step_ids.filter((id) => refs.has(id)),
      });
    }
  }
  const sample = samplePlacement(candidates);
  if (sample.length === 0) return null;
  await user.discardActiveRuns('placement', null);
  return user.createRun(
    'placement',
    null,
    sample.map((s) => s.questionId),
    null,
    clock.now(),
  );
}

export interface RunItem {
  question: Question;
  pick: number | null;
  correct: boolean | null;
}

export interface RunSummary {
  run: TestRun;
  items: RunItem[];
  score: RunScore;
  /** undefined unless the run carries a verified pass mark. */
  metPassMark?: boolean;
  /** Placement only: lessons tested out by this check. */
  testedOutLessonIds: string[];
}

async function loadItems(run: TestRun): Promise<RunItem[]> {
  const questions = await getContentRepo().getQuestions(run.questionIds);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const items: RunItem[] = [];
  run.questionIds.forEach((id, i) => {
    const question = byId.get(id);
    if (!question) return;
    const pick = run.answers[i] ?? null;
    items.push({ question, pick, correct: pick === null ? null : pick === question.answer_index });
  });
  return items;
}

function summarise(run: TestRun, items: RunItem[]): RunSummary {
  const score = scoreRun(
    items.map((it) => ({
      questionId: it.question.id,
      topic: it.question.topic,
      correct: it.correct,
    })),
  );
  const testedOut =
    run.kind === 'placement'
      ? scorePlacement(
          items
            .filter((it) => it.question.lesson_id)
            .map((it) => ({
              lessonId: it.question.lesson_id!,
              questionId: it.question.id,
              correct: it.correct === true,
            })),
        ).testedOut
      : [];
  return {
    run,
    items,
    score,
    metPassMark:
      run.kind === 'placement' ? undefined : metPassMark(score.fraction, run.passPct ?? undefined),
    testedOutLessonIds: testedOut,
  };
}

/** Read-only summary of a run (finished or not). */
export async function getRunSummary(runId: number): Promise<RunSummary | null> {
  const run = await getUserRepo().getRun(runId);
  if (!run) return null;
  return summarise(run, await loadItems(run));
}

/**
 * Finish a run: one transaction writes attempts + Review changes, then the sims row (tests) or
 * the tested-out lessons (placement). Calling it again on a finished run only returns the summary.
 */
export async function finishRun(runId: number): Promise<RunSummary | null> {
  const repo = getUserRepo();
  const run = await repo.getRun(runId);
  if (!run) return null;
  const items = await loadItems(run);
  const summary = summarise(run, items);
  if (run.finished) return summary;
  await repo.transaction(async () => {
    for (const it of items) {
      if (it.pick === null) {
        // Left blank counts as a miss, but there is no attempt to record.
        await repo.upsertReviewItem(onMiss(it.question.id, clock.today()));
      } else {
        await recordAnswer(repo, it.question, it.pick, run.kind);
      }
    }
    if (run.kind === 'placement') {
      for (const id of summary.testedOutLessonIds)
        await repo.markLessonDone(id, 'tested_out', clock.now());
    } else if (run.unitId) {
      await repo.recordSim(
        run.unitId,
        summary.score.fraction,
        summary.metPassMark === true,
        clock.now(),
      );
    }
    await repo.finishRun(runId, clock.now());
  });
  await useReviewStore.getState().refresh();
  if (run.kind === 'placement') {
    track('placement_completed', { tested_out_n: summary.testedOutLessonIds.length });
  } else {
    track('practice_test_completed', { unit_id: run.unitId ?? '', score: summary.score.percent });
  }
  return { ...summary, run: { ...run, finished: true } };
}
