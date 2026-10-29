// Free tier and locks, CLAUDE.md S9 and [DECIDED 3]:
//   free = the FIRST lesson of every unit + ONE practice test per section.
//   Everything else (lessons 2+, the full-length unit check) needs the unit's entitlement.
// "Never lose anything": nothing here hides content the user already has; it only says what is open.
import type { Lesson, Unit } from '../db/content/types';
import type { PaidEntitlement } from '../purchases/types';

export type Owned = ReadonlySet<PaidEntitlement>;

/** The unit's entitlement is held (units marked 'free' are always open). */
export function unitOwned(unit: Pick<Unit, 'entitlement'>, owned: Owned): boolean {
  return unit.entitlement === 'free' || owned.has(unit.entitlement);
}

/** Lessons must be passed in unit order. Lesson `index` 0 is the free one. */
export function lessonOpen(unit: Pick<Unit, 'entitlement'>, index: number, owned: Owned): boolean {
  return index === 0 || unitOwned(unit, owned);
}

/** The full-length unit check needs the entitlement. The free practice test is separate. */
export function fullCheckOpen(unit: Pick<Unit, 'entitlement'>, owned: Owned): boolean {
  return unitOwned(unit, owned);
}

/**
 * Questions the free practice test may draw from: questions of the unit's free lesson plus any
 * question flagged `free_tier`. `lessons` are the unit's lessons in order.
 */
export function freePracticePool<Q extends { id: string; freeTier: boolean }>(
  lessons: Pick<Lesson, 'step_ids'>[],
  questions: Q[],
): Q[] {
  const freeLesson = lessons[0];
  const freeIds = new Set(freeLesson ? freeLesson.step_ids : []);
  return questions.filter((q) => q.freeTier || freeIds.has(q.id));
}

/** Where a paywall may be opened from. S9: only these two, and never mid-anything. */
export type PaywallSource = 'locked_item' | 'unit_boundary';
export type Activity = 'idle' | 'lesson' | 'test' | 'review' | 'cab';

/** The paywall guard: opens only when the user is not in the middle of a lesson/test/review/cab. */
export function canOpenPaywall(activity: Activity): boolean {
  return activity === 'idle';
}
