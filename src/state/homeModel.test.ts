import type { QuestionRef } from '../db/content/repo';
import type { Lesson, StateFormat, Unit } from '../db/content/types';
import { buildUnitModel, type LessonNode, type TestNode } from './homeModel';

const unit: Unit = {
  id: 'NAT-AIR_BRAKES',
  section: 'AIR_BRAKES',
  state: 'NAT',
  title: 'Air Brakes',
  order: 1,
  lesson_ids: [],
  unit_check_count: 25,
  entitlement: 'permit',
};
const lessons = [1, 2, 3].map((n) => ({
  id: `L${n}`,
  unit_id: unit.id,
  order: n,
  title: `Lesson ${n}`,
  minutes: 4,
  why: '',
  key_facts: [],
  step_ids: [`q${n}a`, `q${n}b`],
  free: n === 1,
})) as Lesson[];
const refs: QuestionRef[] = lessons.flatMap((l) =>
  l.step_ids.map((id) => ({ id, lessonId: l.id, freeTier: false, topic: 't' })),
);
const fmt = (over: Partial<StateFormat> = {}): StateFormat =>
  ({
    state: 'NAT',
    section: 'AIR_BRAKES',
    question_count: 25,
    pass_pct: 80,
    test_language: 'en_plus',
    verified: false,
    verified_by: '',
    ...over,
  }) as StateFormat;

const build = (over: Partial<Parameters<typeof buildUnitModel>[0]> = {}) =>
  buildUnitModel({
    unit,
    number: 1,
    total: 1,
    lessons,
    refs,
    format: fmt(),
    done: new Map(),
    progress: new Map(),
    owned: new Set(),
    ...over,
  });
const lessonNodes = (m: ReturnType<typeof build>) =>
  m.nodes.filter((n): n is LessonNode => n.kind === 'lesson');
const testNodes = (m: ReturnType<typeof build>) =>
  m.nodes.filter((n): n is TestNode => n.kind === 'test');

describe('Home path model', () => {
  it('fresh, nothing owned: lesson 1 is current, 2+ locked, free practice test + locked full check', () => {
    const m = build();
    expect(lessonNodes(m).map((n) => n.status)).toEqual(['current', 'locked', 'locked']);
    expect(testNodes(m).map((n) => [n.variant, n.locked, n.testKind])).toEqual([
      ['practice', false, 'practice'],
      ['full_locked', true, 'practice'],
    ]);
    // The free practice test draws only from the free lesson: 2 questions.
    expect(testNodes(m)[0].count).toBe(2);
    expect(testNodes(m)[1].count).toBe(6);
  });

  it('owned: lessons open in order and one unit check node replaces the two', () => {
    const m = build({ owned: new Set(['permit']) });
    expect(lessonNodes(m).map((n) => n.status)).toEqual(['current', 'upcoming', 'upcoming']);
    expect(testNodes(m).map((n) => n.variant)).toEqual(['unit_check']);
    expect(testNodes(m)[0]).toMatchObject({ count: 6, locked: false, testKind: 'practice' });
  });

  it('finishing the free lesson leaves nothing current until the unit is unlocked', () => {
    const m = build({ done: new Map([['L1', 'completed']]) });
    expect(lessonNodes(m).map((n) => n.status)).toEqual(['done', 'locked', 'locked']);
    expect(m.lessonsDone).toBe(1);
  });

  it('tested-out lessons: done when open, still locked when locked', () => {
    const m = build({
      done: new Map([
        ['L1', 'tested_out'],
        ['L2', 'tested_out'],
      ]),
    });
    expect(lessonNodes(m).map((n) => n.status)).toEqual(['tested_out', 'locked', 'locked']);
    const owned = build({
      done: new Map([['L2', 'tested_out']]),
      owned: new Set(['permit']),
    });
    expect(lessonNodes(owned).map((n) => n.status)).toEqual(['current', 'tested_out', 'upcoming']);
    expect(owned.lessonsDone).toBe(1);
  });

  it('a started lesson is flagged inProgress so the button can say Resume', () => {
    const m = build({
      progress: new Map([
        [
          'L1',
          {
            lessonId: 'L1',
            stepIndex: 2,
            done: false,
            score: 1,
            seconds: 5,
            pendingPick: null,
            checked: false,
          },
        ],
      ]),
    });
    expect(lessonNodes(m)[0].inProgress).toBe(true);
  });

  it('unverified row: format line says still being confirmed; nothing claims the real test', () => {
    const m = build({
      owned: new Set(['permit']),
      refs: Array.from({ length: 30 }, (_, i) => ({
        id: `x${i}`,
        lessonId: null,
        freeTier: false,
        topic: 't',
      })),
    });
    expect(m.formatLine).toBe('Test format still being confirmed');
    expect(m.claims.tick).toBeUndefined();
    expect(testNodes(m)[0]).toMatchObject({ count: 25, testKind: 'practice' });
  });

  it('verified row and a full bank: the real-test claim and the state format line appear', () => {
    const m = build({
      owned: new Set(['permit']),
      format: fmt({ verified: true, verified_by: 'Sean' }),
      refs: Array.from({ length: 30 }, (_, i) => ({
        id: `x${i}`,
        lessonId: null,
        freeTier: false,
        topic: 't',
      })),
    });
    expect(m.formatLine).toBe('National test: 25 questions · 80% to pass');
    expect(testNodes(m)[0]).toMatchObject({ count: 25, testKind: 'real' });
    expect(m.claims.tick).toBe(0.8);
  });

  it('free units are open to everyone', () => {
    const m = build({ unit: { ...unit, entitlement: 'free' } });
    expect(lessonNodes(m).map((n) => n.status)).toEqual(['current', 'upcoming', 'upcoming']);
    expect(testNodes(m).map((n) => n.variant)).toEqual(['unit_check']);
  });

  it('a unit with no questions has no test node', () => {
    const m = build({
      refs: [],
      owned: new Set(['permit']),
      unit: { ...unit, unit_check_count: 0 },
      format: null,
    });
    expect(testNodes(m)).toEqual([]);
  });
});
