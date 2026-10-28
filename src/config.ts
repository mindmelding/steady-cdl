// App-wide constants. APP_NAME lives only here so a rename is a one-line change (CLAUDE.md §12, decision 6).
export const APP_NAME = 'Steady CDL';
export const BUNDLE_ID = 'dev.mindmelding.steadycdl';

// PostHog is not wired yet (no SDK installed). A later PR uses these once a key exists.
export const POSTHOG_KEY: string = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '';
export const POSTHOG_HOST = 'https://us.i.posthog.com';

// Test traffic must be tagged on every event (Manager PostHog rule).
export const IS_TEST_TRAFFIC: boolean =
  process.env.EXPO_PUBLIC_IS_TEST === '1' || process.env.NODE_ENV === 'test';
