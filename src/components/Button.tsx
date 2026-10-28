import { Pressable, View } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../theme/theme';
import { AppText } from './AppText';

export function Button({
  label,
  onPress,
  disabled = false,
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityHint?: string;
}) {
  const theme = useTheme();
  const bg = disabled ? theme.color.disabledBg : theme.color.ink;
  const fg = disabled ? theme.color.disabledInk : theme.color.bg;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={disabled ? accessibilityHint : undefined}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: theme.size.buttonH,
        borderRadius: theme.radius.button,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    >
      <AppText variant="button" color={fg} style={{ textAlign: 'center' }}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** Icon + word action (Read aloud, Flag). Always >= 48 pt tall. */
export function LinkButton({
  label,
  icon,
  onPress,
  accessibilityLabel,
  selected,
}: {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  selected?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={{
        minHeight: theme.size.minTap,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
      }}
    >
      <View>{icon}</View>
      <AppText variant="body" color={theme.color.sub}>
        {label}
      </AppText>
    </Pressable>
  );
}
