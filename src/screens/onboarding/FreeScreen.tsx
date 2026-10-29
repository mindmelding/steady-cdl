import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { track } from '../../analytics';
import { AppText } from '../../components/AppText';
import { CheckIcon } from '../../components/icons';
import { copy } from '../../copy';
import { useSettingsStore } from '../../state/settingsStore';
import { useTheme } from '../../theme/theme';
import { OnboardingShell } from './Shell';

/** S1 step 3: "What is free", then Home. Finishing saves the track so onboarding never repeats. */
export function FreeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const update = useSettingsStore((s) => s.update);

  const finish = async () => {
    const s = useSettingsStore.getState().settings;
    await update({ onboarded: true, goal: s.goal ?? 'permit', trackState: s.trackState ?? 'NAT' });
    const after = useSettingsStore.getState().settings;
    track('onboarding_completed', {
      state: after.trackState ?? 'NAT',
      goal: after.goal ?? 'permit',
    });
    router.replace('/learn');
  };

  return (
    <OnboardingShell
      step={3}
      backTo="/onboarding/goal"
      continueLabel={copy.onboarding.start}
      onContinue={() => void finish()}
    >
      <AppText variant="h1" accessibilityRole="header">
        {copy.onboarding.freeTitle}
      </AppText>
      <View
        style={{
          borderWidth: theme.border.strong,
          borderColor: theme.color.ink,
          borderRadius: 20,
          padding: 18,
          gap: 14,
        }}
      >
        {copy.onboarding.freeItems.map((t) => (
          <View key={t} style={{ flexDirection: 'row', columnGap: 12, alignItems: 'flex-start' }}>
            <CheckIcon size={26} strokeWidth={3} />
            <AppText variant="option" style={{ flex: 1 }}>
              {t}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="body" color={theme.color.sub}>
        {copy.onboarding.freeBody}
      </AppText>
    </OnboardingShell>
  );
}
