// What the Home path shows, built from content + the learner's progress. The builder is pure
// (tested in homeModel.test.ts); loadHome() gathers the inputs from the two databases.
import { copy, stateName } from '../copy';
import type { QuestionRef } from '../db/content/repo';
import type { Lesson, StateFormat, Unit } from '../db/content/types';
import type { DoneHow, LessonProgress } from '../db/user/repos';
import {
  freePracticePool,
  fullCheckOpen,
  lessonOpen,
  unitOwned,
  type Owned,
} from '../domain/access';
import { formatClaims, type FormatClaims } from '../domain/formatClaims';
import { runMinutes } from '../domain/testRun';
import { unitsForGoal } from '../domain/track';
import { usePurchasesStore } from './purchasesStore';
import { getContentRepo, getUserRepo } from './runtime';
import { loadTrack, type TrackInfo } from './track';

export type LessonStatus = 'done' | 'tested_out' | 'current' | 'upcoming' | 'locked';

export interface LessonNode {
  kind: 'lesson';
  lessonId: string;
  number: number;
  title: string;
  minutes: number;
  questions: number;
  status: LessonStatus;
  /** Started but not finished. */
  inProgress: boolean;
  /** Steps done / steps (0 to 1), for the current node's ring. */
  fraction: number;
}

export type TestVariant = 'practice' | 'unit_check' | 'full_locked';
export interface TestNode {
  kind: 'test';
  variant: TestVariant;
  unitId: string;
  /** Questions it will ask (0 only for a locked node that has nothing to show). */
  count: number;
  minutes: number;
  /** 'real' only when the format row is verified and the bank can fill it. */
  testKind: 'real' | 'practice';
  locked: boolean;
}

export interface UnitModel {
  unit: Unit;
  number: number;
  total: number;
  owned: boolean;
  lessonsDone: number;
  lessonsTotal: number;
  claims: FormatClaims;
  formatLine: string;
  nodes: (LessonNode | TestNode)[];
}

export interface BuildUnitInput {
  unit: Unit;
  number: number;
  total: number;
  lessons: Lesson[];
  refs: QuestionRef[];
  format: StateFormat | null;
  done: ReadonlyMap<string, DoneHow>;
  progress: ReadonlyMap<string, LessonProgress | null>;
  owned: Owned;
}

export function buildUnitModel(i: BuildUnitInput): UnitModel {
  const { unit, lessons, owned } = i;
  const unitHas = unitOwned(unit, owned);
  const nodes: (LessonNode | TestNode)[] = [];
  let currentTaken = false;
  let lessonsDone = 0;

  lessons.forEach((lesson, idx) => {
    const open = lessonOpen(unit, idx, owned);
    const how =
      i.done.get(lesson.id) ?? (i.progress.get(lesson.id)?.done ? 'completed' : undefined);
    let status: LessonStatus;
    if (how === 'completed') status = 'done';
    else if (!open)
      status = 'locked'; // tested-out lessons that are locked stay locked
    else if (how === 'tested_out') status = 'tested_out';
    else if (!currentTaken) {
      status = 'current';
      currentTaken = true;
    } else status = 'upcoming';
    if (status === 'done' || status === 'tested_out') lessonsDone += 1;
    const p = i.progress.get(lesson.id);
    nodes.push({
      kind: 'lesson',
      lessonId: lesson.id,
      number: idx + 1,
      title: lesson.title,
      minutes: lesson.minutes,
      questions: lesson.step_ids.length,
      status,
      inProgress: !!p && !p.done && (p.stepIndex > 0 || p.pendingPick !== null),
      fraction:
        p && !p.done && lesson.step_ids.length > 0 ? p.stepIndex / lesson.step_ids.length : 0,
    });
  });

  const fullCount = i.refs.length;
  const freeCount = freePracticePool(lessons, i.refs).length;
  if (fullCheckOpen(unit, owned)) {
    const c = formatClaims(i.format, {
      available: fullCount,
      fallbackCount: unit.unit_check_count,
    });
    if (c.questionCount > 0) {
      nodes.push({
        kind: 'test',
        variant: 'unit_check',
        unitId: unit.id,
        count: c.questionCount,
        minutes: runMinutes(c.questionCount),
        testKind: c.testKind,
        locked: false,
      });
    }
  } else {
    // One free practice test per section, then the full-length check behind the unlock.
    const c = formatClaims(i.format, {
      available: freeCount,
      fallbackCount: unit.unit_check_count,
    });
    if (c.questionCount > 0) {
      nodes.push({
        kind: 'test',
        variant: 'practice',
        unitId: unit.id,
        count: c.questionCount,
        minutes: runMinutes(c.questionCount),
        testKind: c.testKind,
        locked: false,
      });
    }
    const full = formatClaims(i.format, {
      available: fullCount,
      fallbackCount: unit.unit_check_count,
    });
    if (full.questionCount > 0) {
      nodes.push({
        kind: 'test',
        variant: 'full_locked',
        unitId: unit.id,
        count: full.questionCount,
        minutes: runMinutes(full.questionCount),
        testKind: full.testKind,
        locked: true,
      });
    }
  }

  const claims = formatClaims(i.format, { fallbackCount: unit.unit_check_count });
  return {
    unit,
    number: i.number,
    total: i.total,
    owned: unitHas,
    lessonsDone,
    lessonsTotal: lessons.length,
    claims,
    formatLine:
      claims.verified && i.format
        ? copy.home.formatReal(
            i.format.state === 'NAT'
              ? copy.onboarding.stateNameNational
              : stateName(i.format.state),
            i.format.question_count,
            i.format.pass_pct,
          )
        : copy.home.formatUnverified,
    nodes,
  };
}

export interface HomeModel {
  track: TrackInfo;
  units: UnitModel[];
}

export async function loadHome(
  owned: Owned = usePurchasesStore.getState().owned,
): Promise<HomeModel | null> {
  const track = await loadTrack();
  if (!track) return null;
  const content = getContentRepo();
  const user = getUserRepo();
  const units = unitsForGoal(await content.listUnits(track.contentState), track.goal);
  const done = await user.listDoneLessons();
  const out: UnitModel[] = [];
  for (const [idx, unit] of units.entries()) {
    const lessons = await content.listLessons(unit.id);
    const progress = new Map<string, LessonProgress | null>();
    for (const l of lessons) progress.set(l.id, await user.getProgress(l.id));
    out.push(
      buildUnitModel({
        unit,
        number: idx + 1,
        total: units.length,
        lessons,
        refs: await content.unitQuestionRefs(unit.id),
        format: await content.getStateFormat(track.contentState, unit.section),
        done,
        progress,
        owned,
      }),
    );
  }
  return { track, units: out };
}
