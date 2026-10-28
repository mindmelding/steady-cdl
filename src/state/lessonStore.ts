import { create } from 'zustand';
import type { Question } from '../db/content/types';
import type { LessonProgress } from '../db/user/repos';
import { applyAnswer } from '../domain/review';
import { track } from '../analytics';
import { clock, getUserRepo } from './runtime';
import { useReviewStore } from './reviewStore';

const fresh = (lessonId: string): LessonProgress => ({
  lessonId,
  stepIndex: 0,
  done: false,
  score: 0,
  seconds: 0,
  pendingPick: null,
  checked: false,
});

interface LessonState {
  progress: LessonProgress | null;
  /** Load (or create) progress for a lesson. Resumes exactly where the user left off. */
  load: (lessonId: string) => Promise<LessonProgress>;
  /** Autosave a pick immediately. Ignored once the step is checked. */
  select: (index: number) => Promise<void>;
  /** Check the pick: writes the attempt, progress and any review change atomically. */
  check: (question: Question, mode?: string) => Promise<boolean>;
  /** Move to the next step (or finish the lesson when `total` steps are done). */
  advance: (total: number) => Promise<void>;
  restart: (lessonId: string) => Promise<LessonProgress>;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  progress: null,

  load: async (lessonId) => {
    const repo = getUserRepo();
    let p = await repo.getProgress(lessonId);
    if (!p) {
      p = fresh(lessonId);
      await repo.saveProgress(p, clock.now());
      track('lesson_started', { lesson_id: lessonId });
    }
    set({ progress: p });
    return p;
  },

  select: async (index) => {
    const p = get().progress;
    if (!p || p.checked || p.done) return;
    const next = { ...p, pendingPick: index };
    set({ progress: next });
    await getUserRepo().saveProgress(next, clock.now());
  },

  check: async (question, mode = 'lesson') => {
    const p = get().progress;
    if (!p || p.checked || p.pendingPick === null) throw new Error('Nothing to check');
    const repo = getUserRepo();
    const correct = p.pendingPick === question.answer_index;
    const next: LessonProgress = { ...p, checked: true, score: p.score + (correct ? 1 : 0) };
    set({ progress: next });
    await repo.transaction(async () => {
      await repo.recordAttempt({
        questionId: question.id,
        correct,
        chosenIndex: p.pendingPick!,
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
      await repo.saveProgress(next, clock.now());
    });
    await useReviewStore.getState().refresh();
    track('question_answered', { question_id: question.id, lesson_id: p.lessonId, correct });
    return correct;
  },

  advance: async (total) => {
    const p = get().progress;
    if (!p) return;
    const stepIndex = p.stepIndex + 1;
    const next: LessonProgress = {
      ...p,
      stepIndex,
      pendingPick: null,
      checked: false,
      done: stepIndex >= total,
    };
    set({ progress: next });
    await getUserRepo().saveProgress(next, clock.now());
    if (next.done) track('lesson_completed', { lesson_id: p.lessonId, score: p.score });
  },

  restart: async (lessonId) => {
    const p = fresh(lessonId);
    await getUserRepo().saveProgress(p, clock.now());
    set({ progress: p });
    return p;
  },
}));
