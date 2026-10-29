// Unit check / practice test helpers (CLAUDE.md S14). Pure, so they are easy to test.
import type { Rng } from './placement';

/** A random draw with no repeats (CLAUDE.md section 8: no repeats within a draw). */
export function drawQuestions<T>(pool: T[], count: number, rng: Rng = Math.random): T[] {
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.max(0, count));
}

export interface RunAnswer {
  questionId: string;
  topic: string;
  /** null = left unanswered (counts as missed). */
  correct: boolean | null;
}

export interface TopicScore {
  topic: string;
  right: number;
  total: number;
}

export interface RunScore {
  right: number;
  total: number;
  /** 0 to 1 */
  fraction: number;
  percent: number;
  missedIds: string[];
  topics: TopicScore[];
}

export function scoreRun(answers: RunAnswer[]): RunScore {
  const right = answers.filter((a) => a.correct === true).length;
  const total = answers.length;
  const topics = new Map<string, TopicScore>();
  for (const a of answers) {
    const t = topics.get(a.topic) ?? { topic: a.topic, right: 0, total: 0 };
    t.total += 1;
    if (a.correct === true) t.right += 1;
    topics.set(a.topic, t);
  }
  return {
    right,
    total,
    fraction: total === 0 ? 0 : right / total,
    percent: total === 0 ? 0 : Math.round((100 * right) / total),
    missedIds: answers.filter((a) => a.correct !== true).map((a) => a.questionId),
    // Weakest topics first, so the list leads with what to work on.
    topics: [...topics.values()].sort((a, b) => a.right / a.total - b.right / b.total),
  };
}

/** Pass/fail is only ever computed when a pass mark exists (a verified format). */
export function metPassMark(fraction: number, passPct: number | undefined): boolean | undefined {
  return passPct === undefined ? undefined : fraction * 100 >= passPct - 1e-9;
}

/** Rough minutes for a run: half a minute a question, at least 1. */
export function runMinutes(questions: number): number {
  return Math.max(1, Math.ceil(questions * 0.5));
}

/** Rough minutes for a Review replay: a little over a minute a question. */
export function reviewMinutes(questions: number): number {
  return Math.max(1, Math.ceil(questions * 1.25));
}
