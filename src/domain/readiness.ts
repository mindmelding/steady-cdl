// Readiness, CLAUDE.md §4.4 (unchanged formula):
//   per unit (0-100): 0.5 x mastered + 0.3 x avg(last 3 unit checks / sims) + 0.2 x seen
//   overall = weighted by StateFormat.question_count.
// "Likely ready" at >= 85; below that "Almost there" / "Getting started". Never a pass rate.

export interface UnitReadinessInput {
  /** StateFormat.question_count, the weight in the overall score. */
  weight: number;
  /** Fraction (0-1) of the unit's questions mastered (last answer right and not in Review). */
  mastered: number;
  /** Fraction (0-1) of the unit's questions seen at least once. */
  seen: number;
  /** Scores (0-1) of unit checks / sims, oldest first. Only the last 3 count; none counts as 0. */
  recentChecks: number[];
}

const clamp01 = (v: number) => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);

export const READY_AT = 85;
/** Assumption (the brief gives only the 85 line): below 50 reads "Getting started". */
export const ALMOST_THERE_AT = 50;

export function unitReadiness(u: UnitReadinessInput): number {
  const last3 = u.recentChecks.slice(-3).map(clamp01);
  const avg = last3.length ? last3.reduce((a, b) => a + b, 0) / last3.length : 0;
  return Math.round(100 * (0.5 * clamp01(u.mastered) + 0.3 * avg + 0.2 * clamp01(u.seen)));
}

export function overallReadiness(units: UnitReadinessInput[]): number {
  const total = units.reduce((n, u) => n + Math.max(0, u.weight), 0);
  if (total === 0) return 0;
  const sum = units.reduce((n, u) => n + Math.max(0, u.weight) * unitReadiness(u), 0);
  return Math.round(sum / total);
}

export type ReadinessLabel = 'likely_ready' | 'almost_there' | 'getting_started';

export function readinessLabel(score: number): ReadinessLabel {
  if (score >= READY_AT) return 'likely_ready';
  if (score >= ALMOST_THERE_AT) return 'almost_there';
  return 'getting_started';
}
