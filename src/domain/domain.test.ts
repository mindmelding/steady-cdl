import { addDays, localDateString } from './dates';
import {
  BOX_INTERVAL_DAYS,
  applyAnswer,
  dueLabelParts,
  isDue,
  onCorrect,
  onMiss,
  type ReviewItem,
} from './review';
import { overallReadiness, readinessLabel, unitReadiness } from './readiness';

describe('dates', () => {
  it('adds days across month and year ends and leap days', () => {
    expect(addDays('2026-10-28', 1)).toBe('2026-10-29');
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
  it('formats the local date', () => {
    expect(localDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('review scheduling (§4.3)', () => {
  const today = '2026-10-28';

  it('intervals are 1, 2, 4 days', () => {
    expect(BOX_INTERVAL_DAYS).toEqual({ 1: 1, 2: 2, 3: 4 });
  });

  it('a miss enters box 1, due tomorrow, streak 0', () => {
    expect(onMiss('q1', today)).toEqual({
      questionId: 'q1',
      box: 1,
      dueDate: '2026-10-29',
      streakCorrect: 0,
    });
    expect(applyAnswer('q1', null, false, today)).toEqual({
      kind: 'upsert',
      item: { questionId: 'q1', box: 1, dueDate: '2026-10-29', streakCorrect: 0 },
    });
  });

  it('first correct moves to box 2 (+2 days), streak 1', () => {
    const c = onCorrect(onMiss('q1', today), '2026-10-29');
    expect(c).toEqual({
      kind: 'upsert',
      item: { questionId: 'q1', box: 2, dueDate: '2026-10-31', streakCorrect: 1 },
    });
  });

  it('second correct in a row removes it', () => {
    const second = onCorrect(
      { questionId: 'q1', box: 2, dueDate: '2026-10-31', streakCorrect: 1 },
      '2026-10-31',
    );
    expect(second).toEqual({ kind: 'remove' });
  });

  it('a miss anywhere resets to box 1 with streak 0', () => {
    const item: ReviewItem = { questionId: 'q1', box: 3, dueDate: '2026-11-04', streakCorrect: 1 };
    expect(applyAnswer('q1', item, false, '2026-11-04')).toEqual({
      kind: 'upsert',
      item: { questionId: 'q1', box: 1, dueDate: '2026-11-05', streakCorrect: 0 },
    });
  });

  it('wrong between rights breaks the streak (needs two in a row again)', () => {
    let item = onMiss('q', today);
    const c1 = applyAnswer('q', item, true, '2026-10-29');
    expect(c1.kind).toBe('upsert');
    item = (c1 as { item: ReviewItem }).item;
    const m = applyAnswer('q', item, false, '2026-10-31');
    item = (m as { item: ReviewItem }).item;
    expect(item).toMatchObject({ box: 1, streakCorrect: 0 });
    const c2 = applyAnswer('q', item, true, '2026-11-01');
    expect(c2.kind).toBe('upsert');
    expect(applyAnswer('q', (c2 as { item: ReviewItem }).item, true, '2026-11-03')).toEqual({
      kind: 'remove',
    });
  });

  it('a correct answer to a question not in the queue changes nothing', () => {
    expect(applyAnswer('q9', null, true, today)).toEqual({ kind: 'none' });
  });

  it('box never exceeds 3', () => {
    const c = onCorrect({ questionId: 'q', box: 3, dueDate: today, streakCorrect: 0 }, today);
    expect(c).toMatchObject({ kind: 'upsert', item: { box: 3, dueDate: '2026-11-01' } });
  });

  it('due today means due_date <= today', () => {
    const item: ReviewItem = { questionId: 'q', box: 1, dueDate: '2026-10-28', streakCorrect: 0 };
    expect(isDue(item, '2026-10-28')).toBe(true);
    expect(isDue(item, '2026-10-29')).toBe(true);
    expect(isDue(item, '2026-10-27')).toBe(false);
    expect(dueLabelParts({ ...item, dueDate: '2026-10-30' }, '2026-10-28')).toEqual({
      due: false,
      days: 2,
    });
    expect(dueLabelParts(item, '2026-10-28')).toEqual({ due: true, days: 0 });
  });
});

describe('readiness (§4.4)', () => {
  it('unit formula: 0.5 mastered + 0.3 avg(last 3 checks) + 0.2 seen', () => {
    expect(unitReadiness({ weight: 25, mastered: 1, seen: 1, recentChecks: [1, 1, 1] })).toBe(100);
    expect(unitReadiness({ weight: 25, mastered: 0, seen: 0, recentChecks: [] })).toBe(0);
    // 0.5*0.6 + 0.3*0.8 + 0.2*1 = 0.3 + 0.24 + 0.2 = 0.74
    expect(unitReadiness({ weight: 25, mastered: 0.6, seen: 1, recentChecks: [0.8] })).toBe(74);
  });

  it('only the last 3 checks count', () => {
    const a = unitReadiness({
      weight: 1,
      mastered: 0,
      seen: 0,
      recentChecks: [0, 0, 0.9, 0.9, 0.9],
    });
    expect(a).toBe(27); // 0.3 * 0.9
  });

  it('clamps out-of-range inputs', () => {
    expect(unitReadiness({ weight: 1, mastered: 5, seen: -1, recentChecks: [2] })).toBe(80);
    expect(unitReadiness({ weight: 1, mastered: NaN, seen: 0, recentChecks: [] })).toBe(0);
  });

  it('overall is weighted by question_count', () => {
    const units = [
      { weight: 50, mastered: 1, seen: 1, recentChecks: [1] }, // 100
      { weight: 25, mastered: 0, seen: 0, recentChecks: [] }, // 0
    ];
    expect(overallReadiness(units)).toBe(67); // (50*100 + 25*0) / 75
    expect(overallReadiness([])).toBe(0);
    expect(overallReadiness([{ weight: 0, mastered: 1, seen: 1, recentChecks: [1] }])).toBe(0);
  });

  it('labels: likely ready at >= 85 only', () => {
    expect(readinessLabel(85)).toBe('likely_ready');
    expect(readinessLabel(84)).toBe('almost_there');
    expect(readinessLabel(50)).toBe('almost_there');
    expect(readinessLabel(49)).toBe('getting_started');
  });
});
