import { buildEvent, track } from './analytics';

describe('analytics', () => {
  it('track is a no-op that never throws', () => {
    expect(track('lesson_started', { lesson_id: 'AB-L01' })).toBeUndefined();
    expect(() => track('question_answered')).not.toThrow();
  });

  it('events carry is_test, defaulting to true under test', () => {
    expect(buildEvent('lesson_started', { lesson_id: 'x' }).properties).toEqual({
      lesson_id: 'x',
      is_test: true,
    });
    expect(buildEvent('lesson_started', {}, { is_test: false }).properties.is_test).toBe(false);
  });

  it('is disabled without a key and targets the US PostHog host', () => {
    const e = buildEvent('x');
    expect(e.enabled).toBe(false);
    expect(e.host).toBe('https://us.i.posthog.com');
  });
});
