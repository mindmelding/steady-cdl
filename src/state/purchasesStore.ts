// Entitlements for the UI. The provider is the in-memory mock until RevenueCat is wired in M3
// (RevenueCat phones home, so it needs Sean's OK). The cache in the user DB lets the app work
// offline and survive a restart (CLAUDE.md section 2.1).
import { create } from 'zustand';
import { MockPurchases } from '../purchases/mock';
import {
  PRODUCT_ENTITLEMENTS,
  type PaidEntitlement,
  type ProductId,
  type Purchases,
} from '../purchases/types';
import { clock, getUserRepo } from './runtime';

const ALL_ENTITLEMENTS: PaidEntitlement[] = [
  'permit',
  'hazmat',
  'tanker',
  'doubles',
  'passenger',
  'schoolbus',
];

interface PurchasesState {
  owned: Set<PaidEntitlement>;
  provider: Purchases;
  /** Read the cached entitlements (offline-safe). */
  load: () => Promise<void>;
  /** Ask the provider what the store account owns and replace the cache (refunds re-lock quietly). */
  restore: () => Promise<Set<PaidEntitlement>>;
  /** Mock/dev only: buy a product with the mock provider. */
  grant: (product: ProductId) => Promise<void>;
}

async function writeCache(owned: Set<PaidEntitlement>): Promise<void> {
  const repo = getUserRepo();
  const ts = clock.now();
  for (const e of ALL_ENTITLEMENTS) await repo.setEntitlement(e, owned.has(e), ts);
}

export const usePurchasesStore = create<PurchasesState>((set, get) => ({
  owned: new Set(),
  provider: new MockPurchases(),
  load: async () => {
    const cached = await getUserRepo().listGrantedEntitlements();
    set({
      owned: new Set(
        cached.filter((e): e is PaidEntitlement => ALL_ENTITLEMENTS.includes(e as PaidEntitlement)),
      ),
    });
  },
  restore: async () => {
    const owned = await get().provider.restore();
    await writeCache(owned);
    set({ owned });
    return owned;
  },
  grant: async (product) => {
    const owned = new Set([...get().owned, ...PRODUCT_ENTITLEMENTS[product]]);
    await get().provider.purchase(product);
    await writeCache(owned);
    set({ owned });
  },
}));
