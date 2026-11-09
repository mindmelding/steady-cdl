// What the learner is doing right now, so the paywall can refuse to open mid-anything
// (CLAUDE.md S9: never mid-lesson, mid-test, mid-Review or in Cab Mode).
import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { track } from '../analytics';
import { canOpenPaywall, type Activity, type PaywallSource } from '../domain/access';

interface ActivityState {
  activity: Activity;
  /** Which screen set it, so a screen unmounting late cannot clear a newer screen's activity. */
  owner: symbol | null;
  enter: (activity: Activity, owner: symbol) => void;
  leave: (owner: symbol) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activity: 'idle',
  owner: null,
  enter: (activity, owner) => set({ activity, owner }),
  leave: (owner) => {
    if (get().owner === owner) set({ activity: 'idle', owner: null });
  },
}));

/** Mark the screen as an activity (lesson, test, review, cab) for as long as it is mounted. */
export function useActivityScope(activity: Activity): void {
  const token = useRef(Symbol('activity'));
  useEffect(() => {
    const t = token.current;
    useActivityStore.getState().enter(activity, t);
    return () => useActivityStore.getState().leave(t);
  }, [activity]);
}

export interface PaywallParams {
  source: PaywallSource;
  /** Unit title for the "You finished the free {unit} lesson." line. */
  unit?: string;
}

/**
 * The only way to open the paywall from code. Refuses (returns false, opens nothing) unless the
 * learner is idle. Callers pass the router's push so this stays testable.
 */
export function openPaywall(
  push: (href: { pathname: '/paywall'; params: Record<string, string> }) => void,
  p: PaywallParams,
): boolean {
  if (!canOpenPaywall(useActivityStore.getState().activity)) return false;
  push({ pathname: '/paywall', params: { source: p.source, ...(p.unit ? { unit: p.unit } : {}) } });
  return true;
}

/** Called once by the paywall screen when it is shown. mid_test must always be false. */
export function trackPaywallViewed(source: string): boolean {
  const mid = !canOpenPaywall(useActivityStore.getState().activity);
  if (mid) return false; // never shown, never counted as a view
  track('paywall_viewed', { mid_test: false, source });
  return true;
}
