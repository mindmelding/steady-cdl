import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../components/AppText';
import { useTheme } from '../theme/theme';

/** Placeholder for tabs that arrive in later milestones. */
export function StubScreen({ title, note }: { title: string; note: string }) {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <View style={{ padding: theme.space.page, gap: 12 }}>
        <AppText variant="h1" accessibilityRole="header">
          {title}
        </AppText>
        <AppText variant="body" color={theme.color.sub}>
          {note}
        </AppText>
      </View>
    </SafeAreaView>
  );
}
