import fs from 'fs';
import os from 'os';
import path from 'path';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { buildContentDb, loadSources } from '../../content/build';
import { memoryDriver, nodeDriver } from '../db/nodeDriver';
import { migrate } from '../db/migrate';
import { USER_MIGRATIONS } from '../db/user/migrations';
import { clock, getUserRepo, setDatabases } from '../state/runtime';
import { useLessonStore } from '../state/lessonStore';
import { useReviewStore } from '../state/reviewStore';
import { ThemeProvider } from '../theme/theme';
import { QuestionScreen } from './QuestionScreen';
import { track } from '../analytics';

const mockRouter = { replace: jest.fn(), back: jest.fn(), canGoBack: () => false, push: jest.fn() };
jest.mock('expo-router', () => ({ useRouter: () => mockRouter }));
jest.mock('../analytics', () => ({ track: jest.fn() }));

const bundle = loadSources();
const firstQ = bundle.questions[0]; // AB-LOWAIR-001, answer index 1 (60 psi)
let contentFile: string;

beforeAll(() => {
  contentFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'qs-')), 'content.db');
  buildContentDb(bundle, contentFile);
});

async function boot() {
  const user = memoryDriver();
  await migrate(user, USER_MIGRATIONS);
  setDatabases(user, nodeDriver(contentFile, { readonly: true }));
  useLessonStore.setState({ progress: null });
  useReviewStore.setState({ total: 0, due: 0 });
  mockRouter.replace.mockClear();
  (track as jest.Mock).mockClear();
  clock.today = () => '2026-10-28';
}

const ui = (step = 0) => (
  <SafeAreaProvider
    initialMetrics={{
      frame: { x: 0, y: 0, width: 393, height: 852 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    }}
  >
    <ThemeProvider>
      <QuestionScreen lessonId="AB-L01" step={step} />
    </ThemeProvider>
  </SafeAreaProvider>
);

describe('QuestionScreen (container)', () => {
  beforeEach(boot);

  it('shows the first question, the "1 of 5" step and the federal badge', async () => {
    await render(ui());
    expect(await screen.findByText(firstQ.question)).toBeTruthy();
    expect(screen.getByText('1 of 5')).toBeTruthy();
    expect(screen.getByText('Federal rule · all states')).toBeTruthy();
    expect(track).toHaveBeenCalledWith('lesson_started', { lesson_id: 'AB-L01' });
  });

  it('wrong answer: autosaves the pick, writes attempt + review queue, shows words', async () => {
    await render(ui());
    await screen.findByText(firstQ.question);
    await fireEvent.press(screen.getByLabelText('Option A: 40 psi'));
    await waitFor(async () =>
      expect((await getUserRepo().getProgress('AB-L01'))?.pendingPick).toBe(0),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Check' }));
    expect(await screen.findByText('Not quite.')).toBeTruthy();
    expect(screen.getByText('Your answer')).toBeTruthy();
    expect(screen.getByText('Correct answer')).toBeTruthy();
    const attempts = await getUserRepo().listAttempts(firstQ.id);
    expect(attempts).toEqual([expect.objectContaining({ correct: false, chosenIndex: 0 })]);
    expect(await getUserRepo().getReviewItem(firstQ.id)).toMatchObject({
      box: 1,
      dueDate: '2026-10-29',
    });
    expect(track).toHaveBeenCalledWith('question_answered', {
      question_id: firstQ.id,
      lesson_id: 'AB-L01',
      correct: false,
    });
  });

  it('right answer: Correct., not queued for Review', async () => {
    await render(ui());
    await screen.findByText(firstQ.question);
    await fireEvent.press(screen.getByLabelText('Option B: 60 psi'));
    await fireEvent.press(screen.getByRole('button', { name: 'Check' }));
    expect(await screen.findByText('Correct.')).toBeTruthy();
    expect(await getUserRepo().getReviewItem(firstQ.id)).toBeNull();
  });

  it('resume: reopening after a kill restores the same step with the same pick selected', async () => {
    const r = await render(ui());
    await screen.findByText(firstQ.question);
    await fireEvent.press(screen.getByLabelText('Option C: 80 psi'));
    await waitFor(async () =>
      expect((await getUserRepo().getProgress('AB-L01'))?.pendingPick).toBe(2),
    );
    await r.unmount();
    useLessonStore.setState({ progress: null }); // process killed: memory gone, DB remains
    await render(ui());
    await screen.findByText(firstQ.question);
    expect(screen.getByLabelText('Option C: 80 psi').props.accessibilityState).toMatchObject({
      selected: true,
    });
    expect(screen.getAllByRole('button', { name: 'Check' }).at(-1)).toBeEnabled();
  });

  it('resume mid-lesson: opening step 0 after reaching step 2 redirects to step 2 and shows its question', async () => {
    const first = await render(ui());
    await screen.findByText(firstQ.question);
    for (let i = 0; i < 2; i++) {
      await fireEvent.press(screen.getByLabelText(/^Option B:/));
      await fireEvent.press(screen.getByRole('button', { name: 'Check' }));
      await fireEvent.press(await screen.findByRole('button', { name: 'Continue' }));
    }
    expect(mockRouter.replace).toHaveBeenLastCalledWith('/lesson/AB-L01/2');
    await first.unmount();
    useLessonStore.setState({ progress: null });
    mockRouter.replace.mockClear();
    await render(ui(0)); // stale URL says step 0
    expect(await screen.findByText(bundle.questions[2].question)).toBeTruthy();
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/lesson/AB-L01/2'));
  });

  it('finishing the last step marks the lesson done and goes to the complete screen', async () => {
    await render(ui());
    await screen.findByText(firstQ.question);
    for (let i = 0; i < 5; i++) {
      await fireEvent.press(screen.getAllByLabelText(/^Option [A-D]:/)[0]);
      await fireEvent.press(screen.getByRole('button', { name: 'Check' }));
      await fireEvent.press(
        await screen.findByRole('button', { name: i === 4 ? 'Finish lesson' : 'Continue' }),
      );
    }
    expect(mockRouter.replace).toHaveBeenLastCalledWith('/lesson/AB-L01/complete');
    expect(await getUserRepo().getProgress('AB-L01')).toMatchObject({ done: true });
  });

  it('an unknown lesson shows a plain message, not a crash', async () => {
    await render(
      <ThemeProvider>
        <QuestionScreen lessonId="nope" step={0} />
      </ThemeProvider>,
    );
    expect(await screen.findByText('This lesson could not be found.')).toBeTruthy();
  });
});
