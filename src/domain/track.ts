// Track = state + goal (CLAUDE.md section 3.2). Pure helpers for onboarding and Home.
import type { Jurisdiction, Section, Unit } from '../db/content/types';

export type Goal = 'permit' | 'endorsement' | 'hazmat_renewal';
export const GOALS: Goal[] = ['permit', 'endorsement', 'hazmat_renewal'];

export const PERMIT_SECTIONS: Section[] = [
  'TX_COMMERCIAL_RULES',
  'GK',
  'AIR_BRAKES',
  'COMBINATION',
];
export const ENDORSEMENT_SECTIONS: Section[] = [
  'HAZMAT',
  'TANKER',
  'DOUBLES_TRIPLES',
  'PASSENGER',
  'SCHOOL_BUS',
];

/** States with their own pinned spot at the top of the picker. */
export const PINNED_STATES: Jurisdiction[] = ['TX', 'CA', 'FL'];

/**
 * Units a goal sees, in order. Permit: the permit units in StateFormat order (units.order).
 * Endorsement: only endorsement units, HazMat first. HazMat renewal: the HazMat unit only
 * (a renewal-specific mode is reserved for Gate 1).
 */
export function unitsForGoal(units: Unit[], goal: Goal | null): Unit[] {
  const byOrder = (a: Unit, b: Unit) => a.order - b.order;
  if (goal === 'endorsement') {
    return units
      .filter((u) => ENDORSEMENT_SECTIONS.includes(u.section))
      .sort((a, b) => {
        if (a.section === 'HAZMAT') return -1;
        if (b.section === 'HAZMAT') return 1;
        return byOrder(a, b);
      });
  }
  if (goal === 'hazmat_renewal') return units.filter((u) => u.section === 'HAZMAT');
  return units.filter((u) => PERMIT_SECTIONS.includes(u.section)).sort(byOrder);
}

/**
 * Content for a state exists only for states that have their own units; every other state uses
 * the national (NAT) content with a note.
 */
export function contentStateFor(
  code: Jurisdiction,
  statesWithUnits: ReadonlySet<string>,
): Jurisdiction {
  return statesWithUnits.has(code) ? code : 'NAT';
}

/** The app opens onboarding only when no track has been saved. Never loops once finished. */
export function initialRoute(s: {
  onboarded: boolean;
  trackState: string | null;
}): '/onboarding' | '/learn' {
  return s.onboarded && s.trackState ? '/learn' : '/onboarding';
}
