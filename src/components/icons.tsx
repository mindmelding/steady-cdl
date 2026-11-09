import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';
import { useGlyphScale, useTheme } from '../theme/theme';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

function useIcon({ size = 24, color, strokeWidth = 2.5 }: IconProps) {
  const theme = useTheme();
  const k = useGlyphScale();
  return { size: size * k, color: color ?? theme.color.ink, strokeWidth };
}

// Decorative: every icon is always paired with a word, so the icons themselves are hidden from
// screen readers (the word is read instead).
const a11y = {
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;

export function CheckIcon(p: IconProps) {
  const { size, color, strokeWidth } = useIcon(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...a11y}>
      <Polyline
        points="4.5,12.5 10,18 19.5,6.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function CrossIcon(p: IconProps) {
  const { size, color, strokeWidth } = useIcon(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...a11y}>
      <Line
        x1="5.5"
        y1="5.5"
        x2="18.5"
        y2="18.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1="18.5"
        y1="5.5"
        x2="5.5"
        y2="18.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export const CloseIcon = CrossIcon;

export function FlagIcon({ filled, ...p }: IconProps & { filled?: boolean }) {
  const { size, color, strokeWidth } = useIcon({ strokeWidth: 2, ...p });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...a11y}>
      <Line
        x1="6"
        y1="3.5"
        x2="6"
        y2="21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M6 4.5h12l-2.5 4 2.5 4H6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

export function SpeakerIcon(p: IconProps) {
  const { size, color, strokeWidth } = useIcon({ strokeWidth: 2, ...p });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...a11y}>
      <Path
        d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M15.5 9a4 4 0 0 1 0 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M18 6.5a7.5 7.5 0 0 1 0 11"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function CalendarIcon(p: IconProps) {
  const { size, color, strokeWidth } = useIcon({ strokeWidth: 2, ...p });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...a11y}>
      <Rect
        x="4"
        y="5.5"
        width="16"
        height="14.5"
        rx="2.5"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Line x1="4" y1="10.5" x2="20" y2="10.5" stroke={color} strokeWidth={strokeWidth} />
      <Line
        x1="8.5"
        y1="3.5"
        x2="8.5"
        y2="7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Line
        x1="15.5"
        y1="3.5"
        x2="15.5"
        y2="7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="15" r="1.2" fill={color} />
    </Svg>
  );
}

/** Chevron pointing right (or left with `dir="left"`). */
export function ChevronIcon({ dir = 'right', ...p }: IconProps & { dir?: 'left' | 'right' }) {
  const { size, color, strokeWidth } = useIcon({ strokeWidth: 2.5, ...p });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...a11y}>
      <Polyline
        points={dir === 'right' ? '9,5 16,12 9,19' : '15,5 8,12 15,19'}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function LockIcon(p: IconProps) {
  const { size, color, strokeWidth } = useIcon({ strokeWidth: 2.2, ...p });
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...a11y}>
      <Rect
        x="5"
        y="10.5"
        width="14"
        height="10"
        rx="2.5"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Path
        d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
