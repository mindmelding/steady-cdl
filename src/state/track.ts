import type { Jurisdiction } from '../db/content/types';
import { contentStateFor, type Goal } from '../domain/track';
import { getContentRepo } from './runtime';
import { useSettingsStore } from './settingsStore';

export interface TrackInfo {
  /** What the learner picked (any of the 51 jurisdictions, or NAT). */
  picked: Jurisdiction;
  /** Whose content they study: the picked state if it has units, otherwise NAT. */
  contentState: Jurisdiction;
  goal: Goal;
}

/**
 * The saved track, or null before onboarding finishes. Pass `requireOnboarded: false` to read the
 * choices made so far (the placement check runs before the last onboarding screen).
 */
export async function loadTrack(requireOnboarded = true): Promise<TrackInfo | null> {
  const s = useSettingsStore.getState().settings;
  if ((requireOnboarded && !s.onboarded) || !s.trackState) return null;
  const have = await getContentRepo().statesWithUnits();
  const picked = s.trackState as Jurisdiction;
  return { picked, contentState: contentStateFor(picked, have), goal: s.goal ?? 'permit' };
}
