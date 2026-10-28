import { polar, toDeg, type Point } from './ringGeometry';

/**
 * Brand mark geometry, CLAUDE.md §5.2. All values are fractions of the outer diameter D.
 * Clock angles: 0 = 12 o'clock, clockwise. The ring is an 80% ring with a 72 deg gap that runs
 * from 12 o'clock to about 2:24; one dot sits in the gap near the arc's start.
 */
export const MARK_LARGE = { R: 0.4268, stroke: 0.1465, dotR: 0.0732, space: 0.0318 };
export const MARK_SMALL = { R: 0.3962, stroke: 0.2075, dotR: 0.1038, space: 0.0566 };
export const MARK_SMALL_MAX_PX = 64; // <= 64 px uses the small constants
export const MARK_GAP_DEG = 72;

export interface MarkGeometry {
  D: number;
  center: Point;
  R: number;
  stroke: number;
  dotR: number;
  space: number;
  capDeg: number;
  /** Arc runs clockwise from startDeg to endDeg. */
  startDeg: number;
  endDeg: number;
  start: Point;
  end: Point;
  dotAngleDeg: number;
  dot: Point;
  largeArc: boolean;
}

export function markGeometry(D: number): MarkGeometry {
  const c = D <= MARK_SMALL_MAX_PX ? MARK_SMALL : MARK_LARGE;
  const R = c.R * D;
  const stroke = c.stroke * D;
  const dotR = c.dotR * D;
  const space = c.space * D;
  const center = { x: D / 2, y: D / 2 };
  const capDeg = toDeg(stroke / 2 / R);
  const startDeg = MARK_GAP_DEG + capDeg;
  const endDeg = 360 - capDeg;
  const dotAngleDeg = MARK_GAP_DEG - toDeg((stroke / 2 + space + dotR) / R);
  return {
    D,
    center,
    R,
    stroke,
    dotR,
    space,
    capDeg,
    startDeg,
    endDeg,
    start: polar(center.x, center.y, R, startDeg),
    end: polar(center.x, center.y, R, endDeg),
    dotAngleDeg,
    dot: polar(center.x, center.y, R, dotAngleDeg),
    largeArc: endDeg - startDeg > 180,
  };
}
