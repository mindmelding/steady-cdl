import { Pressable, View } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '../theme/theme';
import { AppText } from './AppText';
import { CheckIcon } from './icons';

/** A selectable option card (onboarding goals, state rows). Selected = 2.5 pt border + a check. */
export function ChoiceCard({
  title,
  body,
  selected,
  onPress,
  trailing,
}: {
  title: string;
  body?: string;
  selected: boolean;
  onPress: () => void;
  trailing?: ReactNode;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={body ? `${title}. ${body}` : title}
      accessibilityState={{ selected, checked: selected }}
      onPress={onPress}
      style={{
        minHeight: theme.size.minTap + 16,
        borderRadius: theme.radius.card,
        borderWidth: selected ? theme.border.strong : theme.border.thin,
        borderColor: selected ? theme.color.ink : theme.color.line,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <AppText variant="h2">{title}</AppText>
        {body ? (
          <AppText variant="body" color={theme.color.sub}>
            {body}
          </AppText>
        ) : null}
      </View>
      {trailing}
      {selected ? <CheckIcon size={26} strokeWidth={3} /> : null}
    </Pressable>
  );
}
