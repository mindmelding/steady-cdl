import { create } from 'zustand';
import type { Question } from '../db/content/types';
import type { LessonProgress } from '../db/user/repos';
import { recordAnswer } from './answers';
import { track } from '../analytics';
import { clock, getUserRepo } from './runtime';
import { useReviewStore } from './reviewStore';

// Time on a lesson: seconds between taps, each gap capped so a backgrounded app is not counted.
const MAX_GAP_SECONDS = 120;
let lastTs = 0;
function addSeconds(current: number): number {
  const now = clock.now();
  const gap = lastTs > 0 ? Math.min(MAX_GAP_SECONDS, Math.max(0, (now - lastTs) / 1000)) : 0;
  lastTs = now;
  return current + Math.round(gap);
}

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
    const next: LessonProgress = {
      ...p,
      checked: true,
      score: p.score + (correct ? 1 : 0),
      seconds: addSeconds(p.seconds),
    };
    set({ progress: next });
    await repo.transaction(async () => {
      await recordAnswer(repo, question, p.pendingPick!, mode);
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
      seconds: addSeconds(p.seconds),
    };
    set({ progress: next });
    const repo = getUserRepo();
    await repo.saveProgress(next, clock.now());
    if (next.done) {
      // Remembered even if the lesson is replayed later (a replay resets progress, not this).
      await repo.markLessonDone(p.lessonId, 'completed', clock.now());
      track('lesson_completed', { lesson_id: p.lessonId, score: p.score });
    }
  },

  restart: async (lessonId) => {
    lastTs = clock.now();
    const p = fresh(lessonId);
    await getUserRepo().saveProgress(p, clock.now());
    set({ progress: p });
    track('lesson_started', { lesson_id: lessonId });
    return p;
  },
}));
