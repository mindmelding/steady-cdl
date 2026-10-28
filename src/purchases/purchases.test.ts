import { MockPurchases } from './mock';
import { PRODUCT_IDS, entitlementsFor, type ProductId } from './types';

describe('purchases (mock provider)', () => {
  it('has the seven SKUs from the brief', () => {
    expect([...PRODUCT_IDS]).toEqual([
      'permit_pack',
      'endo_hazmat',
      'endo_tanker',
      'endo_doubles',
      'endo_passenger',
      'endo_schoolbus',
      'endo_all',
    ]);
  });

  it('endo_all grants all five endorsements; permit_pack grants only permit', () => {
    expect([...entitlementsFor(['endo_all'])].sort()).toEqual([
      'doubles',
      'hazmat',
      'passenger',
      'schoolbus',
      'tanker',
    ]);
    expect([...entitlementsFor(['permit_pack'])]).toEqual(['permit']);
    expect(entitlementsFor([]).size).toBe(0);
  });

  it('purchase then restore on a fresh install', async () => {
    const store = new Set<ProductId>();
    const a = new MockPurchases(store);
    expect((await a.getEntitlements()).size).toBe(0);
    await a.purchase('permit_pack');
    expect((await a.getEntitlements()).has('permit')).toBe(true);
    const fresh = new MockPurchases(store);
    expect((await fresh.getEntitlements()).size).toBe(0);
    expect((await fresh.restore()).has('permit')).toBe(true);
  });
});
