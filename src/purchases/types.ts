import type { Entitlement } from '../db/content/types';

// CLAUDE.md §2.1. Real prices come from the store at runtime (never hard-coded in the UI).
export const PRODUCT_IDS = [
  'permit_pack',
  'endo_hazmat',
  'endo_tanker',
  'endo_doubles',
  'endo_passenger',
  'endo_schoolbus',
  'endo_all',
] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export type PaidEntitlement = Exclude<Entitlement, 'free'>;
const ENDORSEMENTS: PaidEntitlement[] = ['hazmat', 'tanker', 'doubles', 'passenger', 'schoolbus'];

export const PRODUCT_ENTITLEMENTS: Record<ProductId, PaidEntitlement[]> = {
  permit_pack: ['permit'],
  endo_hazmat: ['hazmat'],
  endo_tanker: ['tanker'],
  endo_doubles: ['doubles'],
  endo_passenger: ['passenger'],
  endo_schoolbus: ['schoolbus'],
  endo_all: ENDORSEMENTS, // endo_all grants all five
};

export function entitlementsFor(owned: Iterable<ProductId>): Set<PaidEntitlement> {
  const out = new Set<PaidEntitlement>();
  for (const p of owned) PRODUCT_ENTITLEMENTS[p]?.forEach((e) => out.add(e));
  return out;
}

export interface Purchases {
  /** Entitlements the user currently holds (works offline from cache). */
  getEntitlements(): Promise<Set<PaidEntitlement>>;
  /** Buy a product. Resolves with the new entitlement set; throws if cancelled/failed. */
  purchase(product: ProductId): Promise<Set<PaidEntitlement>>;
  /** Restore without an account; always available. */
  restore(): Promise<Set<PaidEntitlement>>;
}
