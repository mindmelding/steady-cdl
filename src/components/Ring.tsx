import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useTheme } from '../theme/theme';
import { dotPosition, progressArcPath, tickLine } from './ringGeometry';

export interface RingProps {
  /** 0 to 1. 0 = track only, 1 = full ring. */
  progress: number;
  size: number;
  stroke: number;
  /** Pass mark as a fraction of a full turn (StateFormat.pass_pct / 100). Never hard-coded here. */
  tick?: number;
  /** Solid dot just past the arc end (current node / Learn tab icon only). */
  dot?: boolean;
  track?: string;
  color?: string;
  accessibilityLabel?: string;
  children?: ReactNode;
}

/** The product motif: starts at 12 o'clock, runs clockwise, round caps (CLAUDE.md §5.1). */
export function Ring({
  progress,
  size,
  stroke,
  tick,
  dot = false,
  track,
  color,
  accessibilityLabel,
  children,
}: RingProps) {
  const theme = useTheme();
  const trackColor = track ?? theme.color.track;
  const ink = color ?? theme.color.ink;
  const c = size / 2;
  const r = (size - stroke) / 2;
  const path = progressArcPath(c, c, r, progress);
  const t = tick === undefined ? null : tickLine(c, c, r, stroke, tick);
  const d = dot ? dotPosition(c, c, r, stroke, progress) : null;

  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute' }}
      >
        <Circle cx={c} cy={c} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        {path !== '' && (
          <Path d={path} stroke={ink} strokeWidth={stroke} strokeLinecap="round" fill="none" />
        )}
        {t && (
          <Line
            x1={t.from.x}
            y1={t.from.y}
            x2={t.to.x}
            y2={t.to.y}
            stroke={ink}
            strokeWidth={2.5}
            testID="ring-tick"
          />
        )}
        {d && <Circle cx={d.center.x} cy={d.center.y} r={d.radius} fill={ink} testID="ring-dot" />}
      </Svg>
      {children}
    </View>
  );
}
