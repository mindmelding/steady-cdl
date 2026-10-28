import { View } from 'react-native';
import { useTheme } from '../theme/theme';
import { AppText } from './AppText';

export function Badge({ label }: { label: string }) {
  const theme = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={label}
      style={{
        alignSelf: 'flex-start',
        borderWidth: theme.border.thin,
        borderColor: theme.color.line,
        borderRadius: theme.radius.chip,
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <AppText variant="meta" color={theme.color.ink}>
        {label}
      </AppText>
    </View>
  );
}
