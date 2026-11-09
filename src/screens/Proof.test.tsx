import { PixelRatio } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { ProofInfo } from '../components/ProofSheet';
import { ThemeProvider } from '../theme/theme';
import { allText, nodesWithProp } from '../testUtils/tree';
import { QuestionView, type QuestionViewProps } from './QuestionView';

const proof: ProofInfo = {
  letter: 'B',
  answerText: '60 psi',
  why: 'Federal rules require a warning you can see or hear before tank pressure falls below 60 psi (or half the governor cut-out pressure, if that is lower).',
  sourceLine: 'State CDL manual · Section to be confirmed · 49 CFR 393.51',
  lastChecked: 'Last checked Oct 2026',
  paraphrase:
    'The low air warning must come on before service reservoir pressure drops below 60 psi.',
  officialUrl: 'https://www.ecfr.gov/current/title-49/section-393.51',
};

const props: QuestionViewProps = {
  stem: 'The low air pressure warning must come on before pressure in the service air tank drops below about:',
  options: ['40 psi', '60 psi', '80 psi'],
  answerIndex: 1,
  badge: 'Federal rule · all states',
  stepIndex: 2,
  total: 5,
  pick: 0,
  checked: true,
  isLast: false,
  flagged: false,
  speaking: false,
  proof,
  onReport: jest.fn(),
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
  ['largest accessibility text size (3.1x)', 3.1],
])('S5 Proof sheet at %s', (_n, scale) => {
  it('shows the answer, Why, the Source block and Last checked, un-truncated', async () => {
    await renderAt(scale);
    const tree = screen.toJSON();
    expect(nodesWithProp(tree, 'numberOfLines')).toHaveLength(0);
    const text = allText(tree);
    expect(text).toContain('Not quite.');
    expect(text).toContain('Added to Review');
    expect(text).toContain('The answer is B · 60 psi');
    expect(text).toContain(proof.why);
    expect(text).toContain(proof.sourceLine);
    expect(text).toContain('Last checked Oct 2026');
    expect(screen.getByRole('button', { name: 'Report a mistake' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
  });

  it('matches the snapshot (wrong answer, Proof sheet open)', async () => {
    await renderAt(scale);
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('matches the snapshot (right answer)', async () => {
    await renderAt(scale, { pick: 1 });
    expect(screen.toJSON()).toMatchSnapshot();
  });
});

describe('Proof sheet behaviour', () => {
  it('a placeholder locator never shows as a section number', async () => {
    await renderAt(1);
    const text = allText(screen.toJSON()).join(' ');
    expect(text).toContain('Section to be confirmed');
    expect(text).not.toMatch(/\[VERIFY\]/);
    expect(text).not.toMatch(/§\s?5/);
  });

  it('tapping the source opens the Source card with the paraphrase and the official link button', async () => {
    await renderAt(1);
    await fireEvent.press(screen.getByLabelText(/^Source\. State CDL manual/));
    expect(await screen.findByText('Where this comes from')).toBeTruthy();
    expect(screen.getByText(proof.paraphrase)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Open the official source' })).toBeTruthy();
  });

  it('Source card without a link says so instead of showing a dead button', async () => {
    await renderAt(1, { proof: { ...proof, officialUrl: '' } });
    await fireEvent.press(screen.getByLabelText(/^Source\. State CDL manual/));
    expect(await screen.findByText('No link for this source yet.')).toBeTruthy();
  });

  it('Report a mistake lists the six reasons and sends the chosen one with the note', async () => {
    const onReport = jest.fn();
    await renderAt(1, { onReport });
    await fireEvent.press(screen.getByRole('button', { name: 'Report a mistake' }));
    for (const r of [
      'Wrong answer',
      'Outdated',
      'Not in my state’s manual',
      'Confusing wording',
      'Typo',
      'Other',
    ]) {
      expect(await screen.findByRole('radio', { name: r })).toBeTruthy();
    }
    expect(screen.getByRole('button', { name: 'Save report' })).toBeDisabled();
    await fireEvent.press(screen.getByRole('radio', { name: 'Outdated' }));
    await fireEvent.changeText(screen.getByLabelText('Add a note (optional)'), '  old number ');
    await fireEvent.press(screen.getByRole('button', { name: 'Save report' }));
    expect(onReport).toHaveBeenCalledWith('Outdated', 'old number');
    expect(await screen.findByText('Thanks. Your report is saved on this device.')).toBeTruthy();
  });

  it('unit checks have no Check button and no Proof sheet: the pick stays "selected"', async () => {
    await renderAt(1, { feedback: false, checked: false, pick: 0 });
    expect(screen.queryByRole('button', { name: 'Check' })).toBeNull();
    expect(screen.queryByTestId('proof-sheet')).toBeNull();
    expect(screen.queryByText('Not quite.')).toBeNull();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    expect(screen.getByLabelText('Option A: 40 psi').props.accessibilityState).toMatchObject({
      selected: true,
    });
    expect(screen.queryByText('Your answer')).toBeNull();
  });

  it('a no-feedback test cannot move on until an answer is picked', async () => {
    await renderAt(1, { feedback: false, checked: false, pick: null, isLast: true });
    expect(screen.getByRole('button', { name: 'Finish test' })).toBeDisabled();
  });
});
