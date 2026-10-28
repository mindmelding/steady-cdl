import { create } from 'zustand';
import { clock, getUserRepo } from './runtime';

interface ReviewState {
  total: number;
  due: number;
  refresh: () => Promise<void>;
}

/** Counts for the "Review · N" tab badge (N = total in queue, CLAUDE.md S7). */
export const useReviewStore = create<ReviewState>((set) => ({
  total: 0,
  due: 0,
  refresh: async () => {
    set(await getUserRepo().countReview(clock.today()));
  },
}));
