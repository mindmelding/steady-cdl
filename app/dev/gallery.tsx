import { ScrollView, View } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../src/components/AppText';
import { OptionRow } from '../../src/components/OptionRow';
import { Ring } from '../../src/components/Ring';
import { SteadyMark } from '../../src/components/SteadyMark';
import { copy } from '../../src/copy';
import { DEV_TOOLS_ENABLED } from '../../src/theme/devFontScale';
import { useTheme } from '../../src/theme/theme';

// Dev-only: visual check of the motif components (Ring, SteadyMark) and the option states.
export default function Gallery() {
  const theme = useTheme();
  if (!DEV_TOOLS_ENABLED) return <Redirect href="/learn" />;
  const row = { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' } as const;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <ScrollView contentContainerStyle={{ padding: theme.space.page, gap: 18 }}>
        <AppText variant="h1" accessibilityRole="header">
          {copy.dev.galleryTitle}
        </AppText>

        <AppText variant="h2">Ring</AppText>
        <View style={row}>
          <Ring progress={0} size={44} stroke={4} accessibilityLabel="Ring 0 percent" />
          <Ring
            progress={0.3}
            size={44}
            stroke={4}
            dot
            accessibilityLabel="Ring 30 percent, current"
          />
          <Ring progress={1} size={44} stroke={4} accessibilityLabel="Ring complete" />
          <Ring
            progress={0.78}
            size={48}
            stroke={5}
            tick={0.8}
            accessibilityLabel="Readiness 78, pass mark 80"
          >
            <AppText variant="meta" allowFontScaling={false} style={{ fontSize: 14 }}>
              78
            </AppText>
          </Ring>
        </View>
        <View style={row}>
          <Ring
            progress={0.78}
            size={120}
            stroke={12}
            tick={0.8}
            accessibilityLabel="Readiness 78 out of 100. Pass mark 80."
          >
            <AppText variant="h1" allowFontScaling={false}>
              78
            </AppText>
          </Ring>
          <Ring
            progress={0.45}
            size={120}
            stroke={12}
            tick={0.6}
            dot
            accessibilityLabel="Ring 45, mark 60"
          />
        </View>

        <AppText variant="h2">SteadyMark</AppText>
        <View style={row}>
          <SteadyMark size={160} />
          <SteadyMark size={64} />
          <SteadyMark size={32} />
          <SteadyMark size={22} />
        </View>

        <AppText variant="h2">Option states</AppText>
        <View style={{ gap: 10 }}>
          <OptionRow letter="A" text="Idle option" state="idle" />
          <OptionRow letter="B" text="Selected option" state="selected" />
          <OptionRow letter="C" text="Your pick, not correct" state="wrong" />
          <OptionRow letter="D" text="The correct option" state="correct" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
