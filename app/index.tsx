import { Redirect } from 'expo-router';
import { initialRoute } from '../src/domain/track';
import { useSettingsStore } from '../src/state/settingsStore';

// Onboarding only while no track is saved. Finishing it saves the track, so it never loops.
export default function Index() {
  const s = useSettingsStore((st) => st.settings);
  return <Redirect href={initialRoute(s)} />;
}
