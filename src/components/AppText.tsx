import { Text, type TextProps } from 'react-native';
import { useTheme } from '../theme/theme';
import type { TypeVariant } from '../theme/tokens';

interface Props extends TextProps {
  variant?: TypeVariant;
  color?: string;
}

/**
 * The only text primitive. Scales with the OS font setting (allowFontScaling is left at its
 * default, true) and never truncates: do not pass numberOfLines or maxFontSizeMultiplier (only exception: tab bar
 * labels, which are capped at TAB_MAX_SCALE like the system tab bar).
 */
export function AppText({ variant = 'body', color, style, ...rest }: Props) {
  const theme = useTheme();
  return (
    <Text {...rest} style={[theme.text[variant], { color: color ?? theme.color.ink }, style]} />
  );
}
