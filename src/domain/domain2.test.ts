import type { StateFormat, Unit } from '../db/content/types';
import { canOpenPaywall, freePracticePool, fullCheckOpen, lessonOpen, unitOwned } from './access';
import { formatCitation, isPlaceholderLocator, lastCheckedLine, sourceLine } from './citations';
import { dueLabel, daysBetween, monthYear } from './dates';
import { formatClaims } from './formatClaims';
import { samplePlacement, scorePlacement } from './placement';
import { drawQuestions, metPassMark, scoreRun } from './testRun';
import { contentStateFor, initialRoute, unitsForGoal } from './track';

const row = (over: Partial<StateFormat> = {}): StateFormat => ({
  state: 'NAT',
  section: 'AIR_BRAKES',
  required_for: ['A'],
  order: 2,
  question_count: 25,
  pass_pct: 80,
  options_per_q: 4,
  test_language: 'en_only',
  manual_edition: '[VERIFY]',
  manual_model: 'unknown',
  source_url: '',
  last_checked: '',
  verified_by: '',
  verified: false,
  ...over,
});
const verified = (over: Partial<StateFormat> = {}) =>
  row({ verified: true, verified_by: 'Sean', last_checked: '2026-10-28', ...over });

describe('formatClaims (what the app may claim about a test)', () => {
  it('unverified row: a practice test, no pass mark, no tick, no state or language claim', () => {
    const c = formatClaims(row());
    expect(c).toEqual({
      verified: false,
      testKind: 'practice',
      questionCount: 25,
      passPct: undefined,
      tick: undefined,
      onStateTest: false,
      languageEnglishOnly: false,
    });
  });

  it('verified: needs verified:true AND a named verifier', () => {
    expect(formatClaims(row({ verified: true, verified_by: '' })).verified).toBe(false);
    expect(formatClaims(row({ verified: false, verified_by: 'Sean' })).verified).toBe(false);
    const c = formatClaims(verified());
    expect(c).toMatchObject({
      verified: true,
      testKind: 'real',
      questionCount: 25,
      passPct: 80,
      tick: 0.8,
      onStateTest: true,
      languageEnglishOnly: true,
    });
  });

  it('the pass tick comes from the row, never hard-coded', () => {
    expect(formatClaims(verified({ pass_pct: 75 })).tick).toBe(0.75);
  });

  it('language rule only when the row says en_only', () => {
    expect(formatClaims(verified({ test_language: 'en_plus' })).languageEnglishOnly).toBe(false);
  });

  it('verified but the bank is short: runs shorter and is NOT called "like the real test"', () => {
    const c = formatClaims(verified(), { available: 5 });
    expect(c).toMatchObject({ testKind: 'practice', questionCount: 5, verified: true });
    // The pass mark is still the state's, but the length claim is gone.
    expect(c.passPct).toBe(80);
  });

  it('unverified and a short bank: practice test of what exists', () => {
    expect(formatClaims(row(), { available: 5 })).toMatchObject({
      testKind: 'practice',
      questionCount: 5,
    });
  });

  it('no row: falls back to the unit length, never claims anything', () => {
    expect(formatClaims(null, { fallbackCount: 20, available: 50 })).toMatchObject({
      verified: false,
      testKind: 'practice',
      questionCount: 20,
      passPct: undefined,
    });
    expect(formatClaims(undefined).questionCount).toBe(0);
  });
});

const unit = (entitlement: Unit['entitlement'], section: Unit['section'] = 'AIR_BRAKES'): Unit => ({
  id: `NAT-${section}`,
  section,
  state: 'NAT',
  title: section,
  order: 1,
  lesson_ids: [],
  unit_check_count: 25,
  entitlement,
});

describe('free tier and locks [DECIDED 3]', () => {
  const none = new Set<never>();
  it('the first lesson of every unit is free; lessons 2+ need the entitlement', () => {
    expect(lessonOpen(unit('permit'), 0, none)).toBe(true);
    expect(lessonOpen(unit('permit'), 1, none)).toBe(false);
    expect(lessonOpen(unit('permit'), 5, new Set(['permit']))).toBe(true);
    expect(lessonOpen(unit('hazmat', 'HAZMAT'), 1, new Set(['permit']))).toBe(false);
    expect(lessonOpen(unit('hazmat', 'HAZMAT'), 1, new Set(['hazmat']))).toBe(true);
  });
  it('units marked free are always open', () => {
    expect(unitOwned(unit('free'), none)).toBe(true);
    expect(fullCheckOpen(unit('free'), none)).toBe(true);
  });
  it('the full unit check is locked without the entitlement', () => {
    expect(fullCheckOpen(unit('permit'), none)).toBe(false);
    expect(fullCheckOpen(unit('permit'), new Set(['permit']))).toBe(true);
  });
  it('the free practice pool is the free lesson plus free_tier questions', () => {
    const lessons = [{ step_ids: ['a', 'b'] }, { step_ids: ['c', 'd'] }];
    const qs = ['a', 'b', 'c', 'd'].map((id) => ({ id, freeTier: id === 'd' }));
    expect(freePracticePool(lessons, qs).map((q) => q.id)).toEqual(['a', 'b', 'd']);
  });
});

describe('paywall guard (never mid-lesson / mid-test / mid-review / in Cab Mode)', () => {
  it.each(['lesson', 'test', 'review', 'cab'] as const)('refuses while %s', (a) => {
    expect(canOpenPaywall(a)).toBe(false);
  });
  it('opens when idle', () => expect(canOpenPaywall('idle')).toBe(true));
});

describe('placement check', () => {
  const rng =
    (seed = 1) =>
    () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
  const cands = ['U1', 'U2', 'U3'].flatMap((u) =>
    [1, 2, 3, 4].map((n) => ({
      lessonId: `${u}-L${n}`,
      unitId: u,
      questionIds: [`${u}-L${n}-q1`, `${u}-L${n}-q2`],
    })),
  );
  it('samples at most 10, one per lesson, spread across units', () => {
    const s = samplePlacement(cands, 10, rng());
    expect(s).toHaveLength(10);
    expect(new Set(s.map((x) => x.lessonId)).size).toBe(10);
    const perUnit = (u: string) => s.filter((x) => x.lessonId.startsWith(u)).length;
    expect([perUnit('U1'), perUnit('U2'), perUnit('U3')].sort()).toEqual([3, 3, 4]);
    for (const x of s) expect(x.questionId.startsWith(x.lessonId)).toBe(true);
  });
  it('samples fewer when the track is small and skips lessons without questions', () => {
    const s = samplePlacement(
      [
        { lessonId: 'a', unitId: 'u', questionIds: ['a1'] },
        { lessonId: 'b', unitId: 'u', questionIds: [] },
      ],
      10,
    );
    expect(s).toEqual([{ lessonId: 'a', questionId: 'a1' }]);
    expect(samplePlacement([], 10)).toEqual([]);
  });
  it('a lesson is tested out only when all of its sampled questions were right', () => {
    const r = scorePlacement([
      { lessonId: 'A', questionId: 'a1', correct: true },
      { lessonId: 'B', questionId: 'b1', correct: false },
      { lessonId: 'C', questionId: 'c1', correct: true },
      { lessonId: 'C', questionId: 'c2', correct: false },
    ]);
    expect(r.testedOut).toEqual(['A']);
    expect(r.misses).toEqual(['b1', 'c2']);
    expect(r).toMatchObject({ right: 2, total: 4 });
  });
});

describe('test run scoring', () => {
  it('draws without repeats', () => {
    const d = drawQuestions([1, 2, 3, 4, 5], 5);
    expect([...d].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(drawQuestions([1, 2], 10)).toHaveLength(2);
  });
  it('scores, lists misses (unanswered counts as missed) and weakest topic first', () => {
    const s = scoreRun([
      { questionId: 'a', topic: 'T1', correct: true },
      { questionId: 'b', topic: 'T2', correct: false },
      { questionId: 'c', topic: 'T2', correct: null },
      { questionId: 'd', topic: 'T1', correct: true },
    ]);
    expect(s).toMatchObject({ right: 2, total: 4, percent: 50, missedIds: ['b', 'c'] });
    expect(s.topics.map((t) => t.topic)).toEqual(['T2', 'T1']);
  });
  it('pass/fail exists only with a pass mark', () => {
    expect(metPassMark(0.8, 80)).toBe(true);
    expect(metPassMark(0.79, 80)).toBe(false);
    expect(metPassMark(1, undefined)).toBeUndefined();
  });
});

describe('dates and citations', () => {
  it('due labels', () => {
    expect(dueLabel('2026-10-28', '2026-10-28')).toEqual({ kind: 'today' });
    expect(dueLabel('2026-10-20', '2026-10-28')).toEqual({ kind: 'today' });
    expect(dueLabel('2026-10-29', '2026-10-28')).toEqual({ kind: 'tomorrow' });
    expect(dueLabel('2026-11-01', '2026-10-28')).toEqual({ kind: 'days', n: 4 });
    expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2);
  });
  it('month and year', () => {
    expect(monthYear('2026-10-28')).toBe('Oct 2026');
    expect(monthYear('')).toBe('');
    expect(monthYear('2026-13-01')).toBe('');
  });
  it('placeholder locators never render as a fake section number', () => {
    for (const l of ['[VERIFY]', '§5.x', '', '[VERIFY section]'])
      expect(isPlaceholderLocator(l)).toBe(true);
    for (const l of ['393.51', '§5.4.2', '5.1']) expect(isPlaceholderLocator(l)).toBe(false);
    expect(formatCitation({ doc: 'State CDL manual', locator: '[VERIFY]' })).toBe(
      'State CDL manual · Section to be confirmed',
    );
    expect(formatCitation({ doc: '49 CFR', locator: '393.51' })).toBe('49 CFR 393.51');
  });
  it('source line joins manual and regulation without repeating', () => {
    expect(
      sourceLine({
        manual_citation: { doc: 'State CDL manual', locator: '[VERIFY]' },
        regulation_ref: '49 CFR 393.51',
      }),
    ).toBe('State CDL manual · Section to be confirmed · 49 CFR 393.51');
    expect(
      sourceLine({
        manual_citation: { doc: '49 CFR', locator: '393.51' },
        regulation_ref: '49 CFR 393.51',
      }),
    ).toBe('49 CFR 393.51');
  });
  it('last checked line', () => {
    expect(lastCheckedLine('2026-10-28')).toBe('Last checked Oct 2026');
  });
});

describe('track', () => {
  const u = (section: Unit['section'], order: number): Unit => ({
    ...unit('permit', section),
    order,
  });
  const all = [u('GK', 1), u('AIR_BRAKES', 2), u('TANKER', 5), u('HAZMAT', 4), u('PASSENGER', 7)];
  it('permit goal: permit units in StateFormat order, no endorsements', () => {
    expect(unitsForGoal(all, 'permit').map((x) => x.section)).toEqual(['GK', 'AIR_BRAKES']);
    expect(unitsForGoal(all, null).map((x) => x.section)).toEqual(['GK', 'AIR_BRAKES']);
  });
  it('endorsement goal: only endorsements, HazMat first', () => {
    expect(unitsForGoal(all, 'endorsement').map((x) => x.section)).toEqual([
      'HAZMAT',
      'TANKER',
      'PASSENGER',
    ]);
    expect(
      unitsForGoal([u('TANKER', 1), u('HAZMAT', 9)], 'endorsement').map((x) => x.section),
    ).toEqual(['HAZMAT', 'TANKER']);
  });
  it('hazmat renewal: the HazMat unit only', () => {
    expect(unitsForGoal(all, 'hazmat_renewal').map((x) => x.section)).toEqual(['HAZMAT']);
  });
  it('states without their own units use national content', () => {
    const have = new Set(['NAT', 'TX']);
    expect(contentStateFor('TX', have)).toBe('TX');
    expect(contentStateFor('OH', have)).toBe('NAT');
    expect(contentStateFor('CA', have)).toBe('NAT');
  });
  it('opens onboarding only while no track is saved', () => {
    expect(initialRoute({ onboarded: false, trackState: null })).toBe('/onboarding');
    expect(initialRoute({ onboarded: false, trackState: 'TX' })).toBe('/onboarding');
    expect(initialRoute({ onboarded: true, trackState: 'TX' })).toBe('/learn');
  });
});
