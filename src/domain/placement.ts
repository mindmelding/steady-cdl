// The 2-minute placement check (CLAUDE.md S1, [DECIDED 4]).
// Up to 10 questions sampled across the track's lessons, spread over units. A lesson is
// "tested out" when every question sampled from it was answered right.
export type Rng = () => number;

export interface PlacementCandidate {
  lessonId: string;
  unitId: string;
  questionIds: string[];
}
export interface PlacementSample {
  lessonId: string;
  questionId: string;
}
export interface PlacementAnswer extends PlacementSample {
  correct: boolean;
}

export const PLACEMENT_MAX = 10;

function shuffle<T>(items: T[], rng: Rng): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Round-robin over units so the check covers the whole track, one random question per lesson. */
export function samplePlacement(
  candidates: PlacementCandidate[],
  max = PLACEMENT_MAX,
  rng: Rng = Math.random,
): PlacementSample[] {
  const unitOrder: string[] = [];
  const byUnit = new Map<string, PlacementCandidate[]>();
  for (const c of candidates) {
    if (c.questionIds.length === 0) continue;
    if (!byUnit.has(c.unitId)) {
      byUnit.set(c.unitId, []);
      unitOrder.push(c.unitId);
    }
    byUnit.get(c.unitId)!.push(c);
  }
  for (const [u, list] of byUnit) byUnit.set(u, shuffle(list, rng));
  const out: PlacementSample[] = [];
  while (out.length < max && [...byUnit.values()].some((l) => l.length > 0)) {
    for (const u of unitOrder) {
      const next = byUnit.get(u)!.shift();
      if (!next) continue;
      const qid = next.questionIds[Math.floor(rng() * next.questionIds.length)];
      out.push({ lessonId: next.lessonId, questionId: qid });
      if (out.length >= max) break;
    }
  }
  return out;
}

export interface PlacementResult {
  /** Lessons where every sampled question was right. */
  testedOut: string[];
  /** Question ids answered wrong (they go to Review). */
  misses: string[];
  right: number;
  total: number;
}

export function scorePlacement(answers: PlacementAnswer[]): PlacementResult {
  const byLesson = new Map<string, boolean>();
  for (const a of answers)
    byLesson.set(a.lessonId, (byLesson.get(a.lessonId) ?? true) && a.correct);
  return {
    testedOut: [...byLesson.entries()].filter(([, ok]) => ok).map(([id]) => id),
    misses: answers.filter((a) => !a.correct).map((a) => a.questionId),
    right: answers.filter((a) => a.correct).length,
    total: answers.length,
  };
}
