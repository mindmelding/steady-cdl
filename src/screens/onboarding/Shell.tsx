import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppText } from '../../components/AppText';
import { Button } from '../../components/Button';
import { CheckIcon, ChevronIcon } from '../../components/icons';
import { StepBar } from '../../components/StepBar';
import { copy } from '../../copy';
import { useTheme } from '../../theme/theme';

/** Header (back, segmented bar, "N of 3"), scrolling body and a pinned Continue (S1). */
export function OnboardingShell({
  step,
  backTo,
  children,
  footer,
  continueLabel = copy.onboarding.continue,
  continueDisabled = false,
  onContinue,
}: {
  step: 1 | 2 | 3;
  /** Where Back goes when there is no history (e.g. after a reload on web). */
  backTo?: string;
  children: ReactNode;
  footer?: ReactNode;
  continueLabel?: string;
  continueDisabled?: boolean;
  onContinue: () => void;
}) {
  const theme = useTheme();
  const router = useRouter();
  const back = () => {
    if (router.canGoBack()) router.back();
    else if (backTo) router.replace(backTo);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: theme.space.page,
          paddingTop: 8,
          paddingBottom: 12,
        }}
      >
        {step > 1 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.onboarding.back}
            onPress={back}
            style={{
              width: theme.size.closeTap,
              height: theme.size.closeTap,
              justifyContent: 'center',
            }}
          >
            <ChevronIcon dir="left" size={26} strokeWidth={3} />
          </Pressable>
        ) : (
          <View style={{ width: 8 }} />
        )}
        <StepBar total={3} current={step - 1} label={copy.onboarding.step(step)} />
        <AppText variant="meta" color={theme.color.sub} style={{ flexShrink: 0 }}>
          {copy.onboarding.step(step)}
        </AppText>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: theme.space.page, paddingBottom: 16, gap: 16 }}
      >
        {children}
      </ScrollView>
      <View
        style={{ paddingHorizontal: theme.space.page, paddingBottom: 12, paddingTop: 8, gap: 12 }}
      >
        {footer}
        <Button label={continueLabel} disabled={continueDisabled} onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}

/** The state chip: "Texas · tests in English" (language only when verified), else just the name. */
export function StateChip({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={text}
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        borderWidth: theme.border.thin,
        borderColor: theme.color.line,
        borderRadius: theme.radius.chip,
        paddingHorizontal: 18,
        paddingVertical: 10,
      }}
    >
      <CheckIcon size={22} strokeWidth={3} />
      <AppText variant="body">{text}</AppText>
    </View>
  );
}
