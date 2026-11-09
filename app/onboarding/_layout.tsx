import { Redirect, Stack } from 'expo-router';
import { useSettingsStore } from '../../src/state/settingsStore';

// No loop: once onboarding is finished (track saved), any way back in lands on Home.
export default function OnboardingLayout() {
  const done = useSettingsStore((s) => s.settings.onboarded && !!s.settings.trackState);
  if (done) return <Redirect href="/learn" />;
  return <Stack screenOptions={{ headerShown: false, animation: 'none' }} />;
}
