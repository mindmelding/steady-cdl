import { View } from 'react-native';
import { useTheme } from '../theme/theme';
import { copy } from '../copy';

/** Segmented progress: segments up to and including the current step are filled. */
export function StepBar({ total, current }: { total: number; current: number }) {
  const theme = useTheme();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={copy.question.stepLabel(current + 1, total)}
      accessibilityValue={{ min: 1, max: total, now: current + 1 }}
      style={{ flex: 1, minWidth: 80, flexDirection: 'row', gap: 4, alignItems: 'center' }}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: i <= current ? theme.color.ink : theme.color.track,
          }}
        />
      ))}
    </View>
  );
}
