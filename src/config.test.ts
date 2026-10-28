import { APP_NAME, BUNDLE_ID, POSTHOG_HOST } from './config';

describe('config', () => {
  it('has the app name and bundle id from the brief', () => {
    expect(APP_NAME).toBe('Steady CDL');
    expect(BUNDLE_ID).toBe('dev.mindmelding.steadycdl');
    expect(POSTHOG_HOST).toBe('https://us.i.posthog.com');
  });
});
