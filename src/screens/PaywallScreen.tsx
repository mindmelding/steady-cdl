import { useEffect, useState } from 'react';
import { goHome } from '../nav';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { copy } from '../copy';
import { canOpenPaywall } from '../domain/access';
import { trackPaywallViewed, useActivityStore } from '../state/activity';
import { usePurchasesStore } from '../state/purchasesStore';
import { useSettingsStore } from '../state/settingsStore';
import { PaywallView } from './PaywallView';

/**
 * Paywall route. It re-checks the guard itself: if it is ever reached while a lesson, test,
 * Review or Cab Mode is open (deep link, bug), it closes and records nothing.
 */
export function PaywallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ source?: string; unit?: string }>();
  const activity = useActivityStore((s) => s.activity);
  const goal = useSettingsStore((s) => s.settings.goal);
  const [msg, setMsg] = useState<string | null>(null);
  const allowed = canOpenPaywall(activity);

  useEffect(() => {
    if (!allowed) {
      if (router.canGoBack()) router.back();
      else goHome(router);
      return;
    }
    trackPaywallViewed(params.source ?? 'locked_item');
    // Once per opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!allowed) return null;

  const close = () => (router.canGoBack() ? router.back() : goHome(router));
  return (
    <PaywallView
      context={
        params.source === 'unit_boundary' && params.unit
          ? copy.paywall.contextFinished(params.unit)
          : copy.paywall.contextLocked
      }
      endorsementsFirst={goal === 'endorsement' || goal === 'hazmat_renewal'}
      onClose={close}
      restoreMessage={msg}
      onRestore={async () => {
        setMsg(copy.settings.restoring);
        const owned = await usePurchasesStore.getState().restore();
        setMsg(
          owned.size === 0
            ? copy.settings.nothingToRestore
            : copy.settings.restored([...owned].join(', ')),
        );
      }}
    />
  );
}
