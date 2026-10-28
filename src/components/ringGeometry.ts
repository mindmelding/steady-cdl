// Pure geometry for <Ring/>. Angles are clock angles in degrees: 0 = 12 o'clock, clockwise.
export interface Point {
  x: number;
  y: number;
}

export const toRad = (deg: number) => (deg * Math.PI) / 180;
export const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.min(1, Math.max(0, v));
}

/** Point on a circle at a clock angle (0 deg = top, increasing clockwise). */
export function polar(cx: number, cy: number, r: number, clockDeg: number): Point {
  const a = toRad(clockDeg);
  return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
}

const f = (n: number) => Number(n.toFixed(3));

/**
 * SVG path of an arc from `startDeg` sweeping clockwise by `sweepDeg` (0 < sweep < 360).
 * Returns '' for a zero sweep. A sweep of 360 is drawn as two half arcs so SVG can render it.
 */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  sweepDeg: number,
): string {
  if (sweepDeg <= 0) return '';
  const s = polar(cx, cy, r, startDeg);
  if (sweepDeg >= 360) {
    const m = polar(cx, cy, r, startDeg + 180);
    return `M${f(s.x)} ${f(s.y)}A${f(r)} ${f(r)} 0 1 1 ${f(m.x)} ${f(m.y)}A${f(r)} ${f(r)} 0 1 1 ${f(s.x)} ${f(s.y)}`;
  }
  const e = polar(cx, cy, r, startDeg + sweepDeg);
  const large = sweepDeg > 180 ? 1 : 0;
  return `M${f(s.x)} ${f(s.y)}A${f(r)} ${f(r)} 0 ${large} 1 ${f(e.x)} ${f(e.y)}`;
}

/** Progress arc starting at 12 o'clock, clockwise. */
export function progressArcPath(cx: number, cy: number, r: number, progress: number): string {
  return arcPath(cx, cy, r, 0, clamp01(progress) * 360);
}

/** Pass-mark tick: a short line crossing the ring's stroke at `fraction` of a full turn. */
export function tickLine(
  cx: number,
  cy: number,
  r: number,
  stroke: number,
  fraction: number,
  overhang = 2,
): { from: Point; to: Point; angle: number } {
  const angle = clamp01(fraction) * 360;
  const half = stroke / 2 + overhang;
  return { from: polar(cx, cy, r - half, angle), to: polar(cx, cy, r + half, angle), angle };
}

/** Solid dot just past the arc end (the brand cue): clear of the round cap by `gap`. */
export function dotPosition(
  cx: number,
  cy: number,
  r: number,
  stroke: number,
  progress: number,
  gap = stroke * 0.25,
): { center: Point; radius: number; angle: number } {
  const radius = stroke / 2;
  const endAngle = clamp01(progress) * 360;
  const angle = endAngle + toDeg((stroke / 2 + gap + radius) / r);
  return { center: polar(cx, cy, r, angle), radius, angle };
}
