import { create } from 'zustand';
import type { Settings } from '../db/user/repos';
import { getUserRepo } from './runtime';

export const DEFAULT_SETTINGS: Settings = {
  textSize: 1,
  sunMode: false,
  haptics: true,
  voice: null,
  speed: 1,
  dailyMinutesGoal: null,
  trackState: null,
  goal: null,
  onboarded: false,
};

interface SettingsState {
  settings: Settings;
  loaded: boolean;
  load: () => Promise<void>;
  update: (patch: Partial<Settings>) => Promise<void>;
}

// Persisted to the user DB (settings table): every update is written immediately.
export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  load: async () => {
    set({ settings: await getUserRepo().getSettings(), loaded: true });
  },
  update: async (patch) => {
    const next = { ...get().settings, ...patch };
    set({ settings: next });
    await getUserRepo().saveSettings(next);
  },
}));
