import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fontAssets } from '../src/theme/fonts';
import { ThemeProvider } from '../src/theme/theme';
import { getDevFontScale } from '../src/theme/devFontScale';
import { initDatabases } from '../src/db/init';
import { useSettingsStore } from '../src/state/settingsStore';
import { useReviewStore } from '../src/state/reviewStore';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const [ready, setReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const sun = useSettingsStore((s) => s.settings.sunMode);

  useEffect(() => {
    (async () => {
      try {
        await initDatabases();
        await useSettingsStore.getState().load();
        await useReviewStore.getState().refresh();
        setReady(true);
      } catch (e) {
        setDbError(String(e));
      }
    })();
  }, []);

  const done = (fontsLoaded || !!fontError) && (ready || !!dbError);
  useEffect(() => {
    if (done) void SplashScreen.hideAsync();
  }, [done]);

  if (!done) return null;
  if (dbError) throw new Error(dbError);

  return (
    <SafeAreaProvider>
      <ThemeProvider sun={sun} devFontScale={getDevFontScale()}>
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
