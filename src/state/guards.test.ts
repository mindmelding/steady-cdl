import * as analytics from '../analytics';
import { memoryDriver } from '../db/nodeDriver';
import { migrate } from '../db/migrate';
import { USER_MIGRATIONS } from '../db/user/migrations';
import { openPaywall, trackPaywallViewed, useActivityStore } from './activity';
import { usePurchasesStore } from './purchasesStore';
import { setDatabases } from './runtime';

const sym = () => Symbol('t');
afterEach(() => {
  jest.restoreAllMocks();
  useActivityStore.setState({ activity: 'idle', owner: null });
});

describe('paywall guard (S9: never mid-lesson, mid-test, mid-Review or in Cab Mode)', () => {
  it('opens only when idle', () => {
    const push = jest.fn();
    expect(openPaywall(push, { source: 'locked_item' })).toBe(true);
    expect(push).toHaveBeenCalledWith({ pathname: '/paywall', params: { source: 'locked_item' } });
  });

  it.each(['lesson', 'test', 'review', 'cab'] as const)(
    'refuses and tracks nothing during %s',
    (activity) => {
      const spy = jest.spyOn(analytics, 'track');
      useActivityStore.getState().enter(activity, sym());
      const push = jest.fn();
      expect(openPaywall(push, { source: 'unit_boundary', unit: 'Air Brakes' })).toBe(false);
      expect(push).not.toHaveBeenCalled();
      expect(trackPaywallViewed('unit_boundary')).toBe(false);
      expect(spy).not.toHaveBeenCalled();
    },
  );

  it('paywall_viewed is only ever sent with mid_test false', () => {
    const spy = jest.spyOn(analytics, 'track');
    expect(trackPaywallViewed('locked_item')).toBe(true);
    useActivityStore.getState().enter('test', sym());
    trackPaywallViewed('locked_item');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('paywall_viewed', { mid_test: false, source: 'locked_item' });
  });

  it('a screen unmounting late cannot clear a newer screen activity', () => {
    const a = sym();
    const b = sym();
    useActivityStore.getState().enter('lesson', a);
    useActivityStore.getState().enter('test', b);
    useActivityStore.getState().leave(a);
    expect(useActivityStore.getState().activity).toBe('test');
    useActivityStore.getState().leave(b);
    expect(useActivityStore.getState().activity).toBe('idle');
  });
});

describe('analytics is_test flag', () => {
  it('tags test traffic when asked and defaults from the env flag', () => {
    expect(analytics.buildEvent('x', {}, { is_test: true }).properties.is_test).toBe(true);
    expect(analytics.buildEvent('x', {}, { is_test: false }).properties.is_test).toBe(false);
    expect(typeof analytics.buildEvent('x').properties.is_test).toBe('boolean');
  });
});

describe('purchases store (mock provider)', () => {
  it('grant unlocks, caches in the user DB, and a reload keeps it offline', async () => {
    const user = memoryDriver();
    await migrate(user, USER_MIGRATIONS);
    setDatabases(user, memoryDriver());
    usePurchasesStore.setState({ owned: new Set() });
    await usePurchasesStore.getState().grant('permit_pack');
    expect(usePurchasesStore.getState().owned.has('permit')).toBe(true);
    usePurchasesStore.setState({ owned: new Set() });
    await usePurchasesStore.getState().load();
    expect(usePurchasesStore.getState().owned.has('permit')).toBe(true);
    expect(usePurchasesStore.getState().owned.has('hazmat')).toBe(false);
  });
});
