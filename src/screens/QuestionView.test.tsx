import { PixelRatio } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QuestionView, type QuestionViewProps } from './QuestionView';
import { ThemeProvider } from '../theme/theme';
import { allText, nodesWithProp } from '../testUtils/tree';

const AX5 = 3.1; // iOS accessibility XXXL font scale, roughly

const props: QuestionViewProps = {
  stem: 'A truck has air brakes. Its governor cut-out pressure is 125 psi. The low air warning must come on before pressure in the service reservoir falls below:',
  options: [
    '40 psi',
    '60 psi, or half of the governor cut-out pressure when that number is lower than 60 psi',
    '80 psi',
    '100 psi',
  ],
  answerIndex: 1,
  badge: 'Federal rule · all states',
  stepIndex: 2,
  total: 5,
  pick: null,
  checked: false,
  isLast: false,
  flagged: false,
  speaking: false,
  onSelect: jest.fn(),
  onCheck: jest.fn(),
  onContinue: jest.fn(),
  onClose: jest.fn(),
  onReadAloud: jest.fn(),
  onFlag: jest.fn(),
};

async function renderAt(scale: number, extra: Partial<QuestionViewProps> = {}) {
  jest.spyOn(PixelRatio, 'getFontScale').mockReturnValue(scale);
  await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 393, height: 852 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <ThemeProvider devFontScale={scale}>
        <QuestionView {...props} {...extra} />
      </ThemeProvider>
    </SafeAreaProvider>,
  );
}

describe.each([
  ['default text size', 1],
  ['largest accessibility text size (3.1x)', AX5],
])('QuestionView at %s', (_name, scale) => {
  it('never truncates: no numberOfLines / ellipsizeMode, and all text renders in full', async () => {
    await renderAt(scale);
    const tree = screen.toJSON();
    expect(nodesWithProp(tree, 'numberOfLines')).toHaveLength(0);
    expect(nodesWithProp(tree, 'ellipsizeMode')).toHaveLength(0);
    expect(nodesWithProp(tree, 'adjustsFontSizeToFit')).toHaveLength(0);
    expect(nodesWithProp(tree, 'maxFontSizeMultiplier')).toHaveLength(0);
    const text = allText(tree);
    expect(text).toContain(props.stem);
    for (const o of props.options) expect(text).toContain(o);
    expect(text).toContain('3 of 5');
    expect(text).toContain('Federal rule · all states');
    expect(text).toContain('Check');
  });

  it('reading text scales (question stem font size follows the scale)', async () => {
    await renderAt(scale);
    const stem = screen.getByText(props.stem);
    const style = Array.isArray(stem.props.style)
      ? Object.assign({}, ...stem.props.style.flat(3))
      : stem.props.style;
    expect(style.fontSize).toBeCloseTo(22 * scale);
    expect(stem.props.allowFontScaling).not.toBe(false);
  });

  it('matches the snapshot before Check', async () => {
    await renderAt(scale, { pick: 0 });
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('matches the snapshot after a wrong answer', async () => {
    await renderAt(scale, { pick: 0, checked: true });
    expect(screen.toJSON()).toMatchSnapshot();
  });
});

describe('QuestionView states (CLAUDE.md §6: icon + word)', () => {
  it('Check is disabled until a pick is made', async () => {
    await renderAt(1);
    expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled();
    await renderAt(1, { pick: 2 });
    expect(screen.getAllByRole('button', { name: 'Check' }).at(-1)).toBeEnabled();
  });

  it('wrong pick: "Your answer" + "Not quite." + Added to Review; correct row says "Correct answer"', async () => {
    await renderAt(1, { pick: 0, checked: true });
    expect(screen.getByText('Your answer')).toBeTruthy();
    expect(screen.getByText('Correct answer')).toBeTruthy();
    expect(screen.getByText('Not quite.')).toBeTruthy();
    expect(screen.getByText('Added to Review')).toBeTruthy();
    expect(screen.getByLabelText('Option A: 40 psi. Your answer')).toBeTruthy();
    expect(screen.getByLabelText(/^Option B: .*\. Correct answer$/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
  });

  it('right pick: "Correct." and no Added to Review or Your answer', async () => {
    await renderAt(1, { pick: 1, checked: true });
    expect(screen.getByText('Correct.')).toBeTruthy();
    expect(screen.getByText('Correct answer')).toBeTruthy();
    expect(screen.queryByText('Your answer')).toBeNull();
    expect(screen.queryByText('Added to Review')).toBeNull();
  });

  it('last step offers Finish lesson', async () => {
    await renderAt(1, { pick: 1, checked: true, isLast: true });
    expect(screen.getByRole('button', { name: 'Finish lesson' })).toBeTruthy();
  });

  it('every control has an accessibility label', async () => {
    await renderAt(1);
    for (const name of ['Close lesson', 'Read aloud', 'Flag', 'Check']) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
    expect(screen.getByRole('progressbar', { name: 'Question 3 of 5' })).toBeTruthy();
  });
});
