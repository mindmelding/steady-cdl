// Review scheduling, CLAUDE.md §4.3 [DECIDED 5].
// A missed question comes back after 1 day, then 2, then 4; it leaves Review once it has been
// answered right twice in a row. A miss anywhere resets it to the 1-day box.
//   Box 1 -> due +1 day, box 2 -> +2, box 3 -> +4.
//   Correct: move up a box (max 3) and streak_correct += 1; at streak_correct == 2 remove it.
//   Wrong:   box 1, streak_correct = 0, due +1 day.
// Note for the reviewer: taken literally, a question that starts in box 1 is removed on its second
// correct answer, so box 3 (+4 days) is reachable only if REQUIRED_STREAK is raised. The brief
// defines it this way; see the M1 report.
import { addDays } from './dates';

export type Box = 1 | 2 | 3;
export const BOX_INTERVAL_DAYS: Record<Box, number> = { 1: 1, 2: 2, 3: 4 };
export const REQUIRED_STREAK = 2;

export interface ReviewItem {
  questionId: string;
  box: Box;
  dueDate: string; // YYYY-MM-DD, device local
  streakCorrect: number;
}

export type ReviewChange =
  { kind: 'upsert'; item: ReviewItem } | { kind: 'remove' } | { kind: 'none' };

export function onMiss(questionId: string, today: string): ReviewItem {
  return { questionId, box: 1, dueDate: addDays(today, BOX_INTERVAL_DAYS[1]), streakCorrect: 0 };
}

export function onCorrect(item: ReviewItem, today: string): ReviewChange {
  const streak = item.streakCorrect + 1;
  if (streak >= REQUIRED_STREAK) return { kind: 'remove' };
  const box = Math.min(3, item.box + 1) as Box;
  return {
    kind: 'upsert',
    item: {
      questionId: item.questionId,
      box,
      dueDate: addDays(today, BOX_INTERVAL_DAYS[box]),
      streakCorrect: streak,
    },
  };
}

/**
 * The one entry point: given the question's current queue entry (or null) and the answer,
 * say what to do with the queue. A correct answer to a question that is not queued does nothing.
 */
export function applyAnswer(
  questionId: string,
  existing: ReviewItem | null,
  correct: boolean,
  today: string,
): ReviewChange {
  if (!correct) return { kind: 'upsert', item: onMiss(questionId, today) };
  if (!existing) return { kind: 'none' };
  return onCorrect(existing, today);
}

export const isDue = (item: ReviewItem, today: string): boolean => item.dueDate <= today;

/** The label for a review row: "Due today", "In 1 day", "In 2 days". */
export function dueLabelParts(item: ReviewItem, today: string): { due: boolean; days: number } {
  if (isDue(item, today)) return { due: true, days: 0 };
  const a = Date.parse(item.dueDate + 'T00:00:00Z');
  const b = Date.parse(today + 'T00:00:00Z');
  return { due: false, days: Math.round((a - b) / 86400000) };
}
