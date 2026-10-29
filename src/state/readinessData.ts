import type { ContentRepo } from '../db/content/repo';
import { isSimulatorEligible } from '../db/content/repo';
import type { Jurisdiction } from '../db/content/types';
import type { UserRepo } from '../db/user/repos';
import { overallReadiness, type UnitReadinessInput } from '../domain/readiness';

export interface ReadinessSummary {
  score: number;
  /** Pass mark as a fraction, only when the StateFormat row is verified; otherwise undefined. */
  tick?: number;
}

/** Overall readiness over a state's units. Pass-mark tick only comes from a verified row. */
export async function computeReadiness(
  content: ContentRepo,
  user: UserRepo,
  state: Jurisdiction,
): Promise<ReadinessSummary> {
  const units = await content.listUnits(state);
  const latest = await user.latestAttempts();
  const queued = new Set((await user.listReviewItems()).map((i) => i.questionId));
  const inputs: UnitReadinessInput[] = [];
  let tick: number | undefined;
  for (const unit of units) {
    const lessons = await content.listLessons(unit.id);
    const ids = lessons.flatMap((l) => l.step_ids);
    const total = ids.length || 1;
    const seen = ids.filter((id) => latest.has(id)).length / total;
    const mastered = ids.filter((id) => latest.get(id) === true && !queued.has(id)).length / total;
    inputs.push({
      weight: unit.unit_check_count,
      seen,
      mastered,
      recentChecks: await user.recentSimScores(unit.id),
    });
    const fmt = await content.getStateFormat(state, unit.section);
    if (isSimulatorEligible(fmt) && tick === undefined) tick = fmt.pass_pct / 100;
  }
  return { score: overallReadiness(inputs), tick };
}
