// One answer = one attempt row + the matching Review queue change (CLAUDE.md section 4.3).
// Shared by lessons, Review replays, unit checks and the placement check. Callers wrap it in
// repo.transaction() together with whatever else must be atomic.
import type { Question } from '../db/content/types';
import type { UserRepo } from '../db/user/repos';
import { applyAnswer } from '../domain/review';
import { clock } from './runtime';

export async function recordAnswer(
  repo: UserRepo,
  question: Question,
  pick: number,
  mode: string,
): Promise<boolean> {
  const correct = pick === question.answer_index;
  await repo.recordAttempt({
    questionId: question.id,
    correct,
    chosenIndex: pick,
    ts: clock.now(),
    mode,
  });
  const change = applyAnswer(
    question.id,
    await repo.getReviewItem(question.id),
    correct,
    clock.today(),
  );
  if (change.kind === 'upsert') await repo.upsertReviewItem(change.item);
  if (change.kind === 'remove') await repo.removeReviewItem(question.id);
  return correct;
}
