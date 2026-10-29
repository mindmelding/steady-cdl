import fs from 'fs';
import path from 'path';
import { render } from '@testing-library/react-native';
import { arcPath, clamp01, dotPosition, polar, progressArcPath, tickLine } from './ringGeometry';
import { markGeometry } from './steadyMarkGeometry';
import { Ring } from './Ring';
import { SteadyMark } from './SteadyMark';

const near = (a: number, b: number, tol = 0.01) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('ring geometry', () => {
  it('0 deg is 12 o clock and angles run clockwise', () => {
    const top = polar(50, 50, 40, 0);
    near(top.x, 50);
    near(top.y, 10);
    const right = polar(50, 50, 40, 90);
    near(right.x, 90);
    near(right.y, 50);
    const bottom = polar(50, 50, 40, 180);
    near(bottom.y, 90);
    const left = polar(50, 50, 40, 270);
    near(left.x, 10);
  });

  it('arc path starts at 12 o clock, sweeps clockwise, sets the large-arc flag past half', () => {
    expect(progressArcPath(50, 50, 40, 0)).toBe('');
    expect(progressArcPath(50, 50, 40, 0.25)).toBe('M50 10A40 40 0 0 1 90 50');
    expect(progressArcPath(50, 50, 40, 0.5)).toBe('M50 10A40 40 0 0 1 50 90');
    expect(progressArcPath(50, 50, 40, 0.75)).toMatch(/^M50 10A40 40 0 1 1 10 50$/);
  });

  it('a full ring is drawn as two half arcs', () => {
    const p = progressArcPath(50, 50, 40, 1);
    expect(p.match(/A/g)).toHaveLength(2);
  });

  it('clamps progress to 0..1 and survives NaN', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(NaN)).toBe(0);
    expect(arcPath(50, 50, 40, 0, 0)).toBe('');
  });

  it('tick crosses the ring at the requested fraction, centred on the ring radius', () => {
    const t = tickLine(60, 60, 54, 12, 0.8);
    expect(t.angle).toBeCloseTo(288);
    const mid = { x: (t.from.x + t.to.x) / 2, y: (t.from.y + t.to.y) / 2 };
    const expectMid = polar(60, 60, 54, 288);
    near(mid.x, expectMid.x);
    near(mid.y, expectMid.y);
    // spans the full stroke plus a little overhang each side
    const len = Math.hypot(t.to.x - t.from.x, t.to.y - t.from.y);
    expect(len).toBeGreaterThan(12);
    // a different pass mark moves the tick (never hard-coded 80)
    expect(tickLine(60, 60, 54, 12, 0.6).angle).toBeCloseTo(216);
  });

  it('dot sits past the arc end, clear of the cap', () => {
    const d = dotPosition(50, 50, 40, 8, 0.5);
    expect(d.angle).toBeGreaterThan(180 + (4 / 40) * (180 / Math.PI));
    expect(d.radius).toBe(4);
  });
});

describe('SteadyMark geometry (CLAUDE.md §5.2)', () => {
  it('large constants at D=800', () => {
    const g = markGeometry(800);
    near(g.R, 341.44);
    near(g.stroke, 117.2);
    near(g.dotR, 58.56);
    near(g.space, 25.44);
    near(g.capDeg, 9.84, 0.05);
    near(g.startDeg, 81.84, 0.05);
    near(g.endDeg, 350.16, 0.05);
    near(g.dotAngleDeg, 48.06, 0.05);
  });

  it('uses the small constants at or below 64 px', () => {
    const g = markGeometry(64);
    near(g.R, 0.3962 * 64, 1e-6);
    near(g.stroke, 0.2075 * 64, 1e-6);
    near(markGeometry(65).R, 0.4268 * 65, 1e-6);
  });

  // Compared against design/final/steady-cdl-mark-only-black-on-white.svg: that file is a 1200 box
  // with the mark's outer diameter D = 800 centred at (600,600). We recompute its path numbers
  // from the formulas and require them to match within 0.1 px.
  it('matches design/final/steady-cdl-mark-only-black-on-white.svg', () => {
    const svg = fs.readFileSync(
      path.join(__dirname, '../../design/final/steady-cdl-mark-only-black-on-white.svg'),
      'utf8',
    );
    const m = /M([\d.]+) ([\d.]+)A([\d.]+) ([\d.]+) 0 (\d) (\d) ([\d.]+) ([\d.]+)/.exec(svg)!;
    const [sx, sy, rx, , large, sweep, ex, ey] = m.slice(1).map(Number);
    const circle = /cx='([\d.]+)' cy='([\d.]+)' r='([\d.]+)'/.exec(svg)!;
    const stroke = /stroke-width='([\d.]+)'/.exec(svg)!;
    const g = markGeometry(800);
    const o = 600 - 400; // offset of the 800 box inside the 1200 viewBox
    near(g.start.x + o, sx, 0.1);
    near(g.start.y + o, sy, 0.1);
    near(g.end.x + o, ex, 0.1);
    near(g.end.y + o, ey, 0.1);
    near(g.R, rx, 0.1);
    expect(g.largeArc).toBe(large === 1);
    expect(sweep).toBe(1);
    near(g.dot.x + o, Number(circle[1]), 0.1);
    near(g.dot.y + o, Number(circle[2]), 0.1);
    near(g.dotR, Number(circle[3]), 0.1);
    near(g.stroke, Number(stroke[1]), 0.1);
  });
});

describe('<Ring/> and <SteadyMark/>', () => {
  it('renders label, tick and dot only when asked', async () => {
    const a = await render(
      <Ring
        progress={0.78}
        size={120}
        stroke={12}
        accessibilityLabel="Readiness 78 out of 100. Pass mark 80."
      />,
    );
    expect(a.getByLabelText('Readiness 78 out of 100. Pass mark 80.')).toBeTruthy();
    expect(a.queryByTestId('ring-tick')).toBeNull();
    expect(a.queryByTestId('ring-dot')).toBeNull();
    const b = await render(<Ring progress={0.78} size={120} stroke={12} tick={0.8} dot />);
    expect(b.getByTestId('ring-tick')).toBeTruthy();
    expect(b.getByTestId('ring-dot')).toBeTruthy();
  });

  it('SteadyMark renders with its dot and a label', async () => {
    const r = await render(<SteadyMark size={120} />);
    expect(r.getByLabelText('Steady CDL mark')).toBeTruthy();
    expect(r.getByTestId('mark-dot')).toBeTruthy();
  });
});
