import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { arcPath } from './ringGeometry';
import { markGeometry } from './steadyMarkGeometry';
import { APP_NAME } from '../config';

/** Fixed-geometry brand mark (not a progress value). Geometry: steadyMarkGeometry.ts. */
export function SteadyMark({
  size,
  color = '#000000',
  accessibilityLabel = `${APP_NAME} mark`,
}: {
  size: number;
  color?: string;
  accessibilityLabel?: string;
}) {
  const g = markGeometry(size);
  const d = arcPath(g.center.x, g.center.y, g.R, g.startDeg, g.endDeg - g.startDeg);
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Path d={d} stroke={color} strokeWidth={g.stroke} strokeLinecap="round" fill="none" />
        <Circle cx={g.dot.x} cy={g.dot.y} r={g.dotR} fill={color} testID="mark-dot" />
      </Svg>
    </View>
  );
}
