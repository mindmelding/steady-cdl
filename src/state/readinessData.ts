import type { ContentRepo } from '../db/content/repo';
import type { Jurisdiction, Unit } from '../db/content/types';
import type { UserRepo } from '../db/user/repos';
import { formatClaims } from '../domain/formatClaims';
import { overallReadiness, unitReadiness, type UnitReadinessInput } from '../domain/readiness';

export interface UnitReadiness {
  unit: Unit;
  score: number;
  /** Pass mark as a fraction; only from a verified format row. */
  tick?: number;
}

export interface ReadinessSummary {
  score: number;
  /** Pass mark as a fraction, only when a StateFormat row is verified; otherwise undefined. */
  tick?: number;
  units: UnitReadiness[];
}

/**
 * Readiness from real attempts and sims (CLAUDE.md section 4.4) over the given units (the goal's
 * units, in order). The pass-mark tick only ever comes from a verified row (formatClaims).
 */
export async function computeReadiness(
  content: ContentRepo,
  user: UserRepo,
  state: Jurisdiction,
  units?: Unit[],
): Promise<ReadinessSummary> {
  const list = units ?? (await content.listUnits(state));
  const latest = await user.latestAttempts();
  const queued = new Set((await user.listReviewItems()).map((i) => i.questionId));
  const inputs: UnitReadinessInput[] = [];
  const perUnit: UnitReadiness[] = [];
  let tick: number | undefined;
  for (const unit of list) {
    const lessons = await content.listLessons(unit.id);
    const ids = lessons.flatMap((l) => l.step_ids);
    const total = ids.length || 1;
    const seen = ids.filter((id) => latest.has(id)).length / total;
    const mastered = ids.filter((id) => latest.get(id) === true && !queued.has(id)).length / total;
    const input: UnitReadinessInput = {
      weight: unit.unit_check_count,
      seen,
      mastered,
      recentChecks: await user.recentSimScores(unit.id),
    };
    inputs.push(input);
    const unitTick = formatClaims(await content.getStateFormat(state, unit.section)).tick;
    perUnit.push({ unit, score: unitReadiness(input), tick: unitTick });
    if (unitTick !== undefined && tick === undefined) tick = unitTick;
  }
  return { score: overallReadiness(inputs), tick, units: perUnit };
}
