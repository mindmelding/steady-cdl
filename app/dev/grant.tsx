import { useEffect } from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { PRODUCT_IDS, type ProductId } from '../../src/purchases/types';
import { usePurchasesStore } from '../../src/state/purchasesStore';
import { DEV_TOOLS_ENABLED } from '../../src/theme/devFontScale';

// Dev-only: /dev/grant?product=permit_pack buys that product with the MOCK provider so locked and
// unlocked screens can be checked. Disabled unless dev tools are on. Never ships (no link to it).
export default function Grant() {
  const { product } = useLocalSearchParams<{ product?: string }>();
  useEffect(() => {
    if (DEV_TOOLS_ENABLED && PRODUCT_IDS.includes(product as ProductId)) {
      void usePurchasesStore.getState().grant(product as ProductId);
    }
  }, [product]);
  return <Redirect href="/learn" />;
}
