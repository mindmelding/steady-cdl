import { PixelRatio } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { LessonNode, TestNode, UnitModel } from '../state/homeModel';
import { allText, nodesWithProp } from '../testUtils/tree';
import { ThemeProvider } from '../theme/theme';
import { HomeView } from './HomeView';
import { PaywallView } from './PaywallView';
import { ReviewView } from './ReviewView';

async function renderAt(scale: number, ui: ReactElement) {
  jest.spyOn(PixelRatio, 'getFontScale').mockReturnValue(scale);
  await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 393, height: 852 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <ThemeProvider devFontScale={scale}>{ui}</ThemeProvider>
    </SafeAreaProvider>,
  );
}

const lesson = (n: number, status: LessonNode['status']): LessonNode => ({
  kind: 'lesson',
  lessonId: `L${n}`,
  number: n,
  title: n === 1 ? 'Low air warnings' : `Lesson ${n}`,
  minutes: 4,
  questions: 5,
  status,
  inProgress: false,
  fraction: 0,
});
const test = (variant: TestNode['variant'], locked: boolean): TestNode => ({
  kind: 'test',
  variant,
  unitId: 'U',
  count: 5,
  minutes: 3,
  testKind: 'practice',
  locked,
});
const unit = {
  unit: { id: 'U', title: 'Air Brakes' },
  number: 1,
  total: 2,
  owned: false,
  lessonsDone: 0,
  lessonsTotal: 3,
  formatLine: 'Test format still being confirmed',
  nodes: [
    lesson(1, 'current'),
    lesson(2, 'locked'),
    test('practice', false),
    test('full_locked', true),
  ],
} as unknown as UnitModel;
const other = { ...unit, unit: { id: 'V', title: 'Combination' }, number: 2 } as UnitModel;

const noop = jest.fn();
const home = (
  <HomeView
    trackLabel="Texas · Permit"
    readiness={{ score: 4 }}
    unit={unit}
    others={[other]}
    onSettings={noop}
    onLesson={noop}
    onTest={noop}
    onLocked={noop}
    onSelectUnit={noop}
  />
);
const rows = [
  { id: 'a', unitTitle: 'Air Brakes', topic: 'Low air warning point', due: { kind: 'today' } },
  { id: 'b', unitTitle: 'Air Brakes', topic: 'Which number applies', due: { kind: 'days', n: 2 } },
] as never;

describe.each([
  ['default text size', 1],
  ['largest accessibility text size (3.1x)', 3.1],
])('Home, Review and Paywall at %s', (_n, scale) => {
  it('S2 Home path: nothing truncated, Unlock and Start visible', async () => {
    await renderAt(scale, home);
    const tree = screen.toJSON();
    expect(nodesWithProp(tree, 'numberOfLines')).toHaveLength(0);
    expect(allText(tree)).toContain('Test format still being confirmed');
    expect(screen.getByRole('button', { name: 'Start lesson' })).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  it('S7 Review: Replay first, × with a due word on every row', async () => {
    await renderAt(scale, <ReviewView rows={rows} dueCount={1} onReplay={noop} />);
    const tree = screen.toJSON();
    expect(nodesWithProp(tree, 'numberOfLines')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Replay 2 mistakes' })).toBeTruthy();
    expect(allText(tree)).toContain('Due today');
    expect(tree).toMatchSnapshot();
  });

  it('S9 paywall placeholder: honest copy, Restore present, no price strings', async () => {
    await renderAt(
      scale,
      <PaywallView
        context="This is part of a paid unit."
        endorsementsFirst={false}
        onClose={noop}
        onRestore={noop}
      />,
    );
    const tree = screen.toJSON();
    const text = allText(tree).join(' ');
    expect(nodesWithProp(tree, 'numberOfLines')).toHaveLength(0);
    expect(text).toContain('No ads');
    expect(text).toContain('No auto-renew');
    expect(text).not.toMatch(/\$\d/);
    expect(screen.getByText('Restore purchases')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});
