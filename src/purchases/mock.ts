import { entitlementsFor, type ProductId, type Purchases } from './types';

/**
 * In-memory stand-in for RevenueCat (not installed: it phones home). `store` plays the role of
 * the App Store / Play account, so restore() after a "fresh install" (new MockPurchases sharing
 * the same store) returns what was bought.
 */
export class MockPurchases implements Purchases {
  constructor(
    private store: Set<ProductId> = new Set(),
    private installed: Set<ProductId> = new Set(),
  ) {}

  async getEntitlements() {
    return entitlementsFor(this.installed);
  }
  async purchase(product: ProductId) {
    this.store.add(product);
    this.installed.add(product);
    return entitlementsFor(this.installed);
  }
  async restore() {
    this.store.forEach((p) => this.installed.add(p));
    return entitlementsFor(this.installed);
  }
}
