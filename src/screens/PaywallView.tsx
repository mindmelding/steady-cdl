import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { CheckIcon, CloseIcon } from '../components/icons';
import { SteadyMark } from '../components/SteadyMark';
import { APP_NAME } from '../config';
import { copy } from '../copy';
import { useTheme } from '../theme/theme';

export interface PaywallViewProps {
  /** "You finished the free Air Brakes lesson." or the generic locked line. */
  context: string;
  /** Endorsement-goal users see endorsements first, never the Permit Pack first. */
  endorsementsFirst: boolean;
  onClose: () => void;
  onRestore: () => void;
  restoreMessage?: string | null;
}

/**
 * S9 placeholder (design/png/09-paywall.png). Honest and static: no prices (they come from the
 * store in M3), no purchase yet, Restore works. Never opened mid-lesson/test/review/Cab Mode.
 */
export function PaywallView(p: PaywallViewProps) {
  const theme = useTheme();
  const cards = [
    { key: 'permit', title: copy.paywall.permit, body: copy.paywall.permitBody },
    { key: 'all', title: copy.paywall.allEndorsements, body: copy.paywall.allEndorsementsBody },
    { key: 'one', title: copy.paywall.oneEndorsement, body: copy.paywall.oneEndorsementBody },
  ];
  const ordered = p.endorsementsFirst ? [cards[1], cards[2], cards[0]] : cards;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.page, paddingBottom: 20, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', columnGap: 12 }}>
          <AppText variant="body" color={theme.color.sub} style={{ flex: 1 }}>
            {p.context}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.paywall.close}
            onPress={p.onClose}
            style={{
              width: theme.size.closeTap,
              height: theme.size.closeTap,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CloseIcon size={26} strokeWidth={3} />
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
          <SteadyMark size={28} />
          <AppText variant="h2">{APP_NAME}</AppText>
        </View>

        <AppText
          variant="display"
          accessibilityRole="header"
          accessibilityLabel={copy.paywall.headlineA11y}
        >
          {copy.paywall.headline}
        </AppText>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 18, rowGap: 6 }}>
          {[copy.paywall.noAds, copy.paywall.noAutoRenew, copy.paywall.noTrial].map((t) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'center', columnGap: 6 }}>
              <CheckIcon size={22} strokeWidth={3} />
              <AppText variant="body">{t}</AppText>
            </View>
          ))}
        </View>

        {ordered.map((c, i) => (
          <View
            key={c.key}
            accessible
            accessibilityLabel={`${c.title}. ${c.body}. ${copy.paywall.priceLater}`}
            style={{
              borderRadius: theme.radius.card,
              borderWidth: i === 0 ? theme.border.strong : theme.border.thin,
              borderColor: i === 0 ? theme.color.ink : theme.color.line,
              padding: 18,
              gap: 6,
            }}
          >
            <AppText variant="h2">{c.title}</AppText>
            <AppText variant="body" color={theme.color.sub}>
              {c.body}
            </AppText>
            <AppText variant="meta" color={theme.color.sub}>
              {copy.paywall.priceLater}
            </AppText>
          </View>
        ))}

        <AppText variant="body">{copy.paywall.freeStays}</AppText>
        <AppText variant="meta" color={theme.color.sub}>
          {copy.paywall.notYet}
        </AppText>
      </ScrollView>

      <View style={{ paddingHorizontal: theme.space.page, paddingBottom: 12, gap: 6 }}>
        <Button label={copy.paywall.buyDisabled} disabled onPress={() => undefined} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copy.paywall.restore}
          onPress={p.onRestore}
          style={{ minHeight: theme.size.minTap, justifyContent: 'center' }}
        >
          <AppText variant="body" style={{ textDecorationLine: 'underline' }}>
            {copy.paywall.restore}
          </AppText>
        </Pressable>
        {p.restoreMessage ? (
          <AppText variant="meta" color={theme.color.sub} accessibilityLiveRegion="polite">
            {p.restoreMessage}
          </AppText>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
