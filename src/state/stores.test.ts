import { memoryDriver } from '../db/nodeDriver';
import { migrate } from '../db/migrate';
import { USER_MIGRATIONS } from '../db/user/migrations';
import { clock, getUserRepo, setDatabases } from './runtime';
import { useLessonStore } from './lessonStore';
import { useReviewStore } from './reviewStore';
import { useSettingsStore } from './settingsStore';
import type { Question } from '../db/content/types';
import { track } from '../analytics';

jest.mock('../analytics', () => ({ track: jest.fn() }));

const q = (id: string, answer: number): Question => ({ id, answer_index: answer }) as Question;

async function setup() {
  const user = memoryDriver();
  await migrate(user, USER_MIGRATIONS);
  setDatabases(user, memoryDriver());
  useLessonStore.setState({ progress: null });
  useReviewStore.setState({ total: 0, due: 0 });
  (track as jest.Mock).mockClear();
  clock.today = () => '2026-10-28';
  let t = 1000;
  clock.now = () => t++;
}

describe('lesson store autosave and resume', () => {
  beforeEach(setup);

  it('starting a lesson creates progress and tracks lesson_started once', async () => {
    await useLessonStore.getState().load('L1');
    expect(track).toHaveBeenCalledWith('lesson_started', { lesson_id: 'L1' });
    await useLessonStore.getState().load('L1');
    expect((track as jest.Mock).mock.calls.filter((c) => c[0] === 'lesson_started')).toHaveLength(
      1,
    );
  });

  it('a pick is saved immediately and survives a restart (reload from the DB)', async () => {
    const s = useLessonStore.getState();
    await s.load('L1');
    await s.select(2);
    useLessonStore.setState({ progress: null }); // simulate a killed app
    const p = await useLessonStore.getState().load('L1');
    expect(p).toMatchObject({ stepIndex: 0, pendingPick: 2, checked: false });
  });

  it('a wrong check writes an attempt, enters Review and persists the checked state', async () => {
    const s = useLessonStore.getState();
    await s.load('L1');
    await s.select(0);
    const correct = await useLessonStore.getState().check(q('Q1', 1));
    expect(correct).toBe(false);
    const repo = getUserRepo();
    expect(await repo.listAttempts('Q1')).toHaveLength(1);
    expect(await repo.getReviewItem('Q1')).toMatchObject({ box: 1, dueDate: '2026-10-29' });
    expect(useReviewStore.getState().total).toBe(1);
    expect(await repo.getProgress('L1')).toMatchObject({ checked: true, pendingPick: 0, score: 0 });
    expect(track).toHaveBeenCalledWith('question_answered', {
      question_id: 'Q1',
      lesson_id: 'L1',
      correct: false,
    });
  });

  it('a correct check scores and does not queue Review', async () => {
    const s = useLessonStore.getState();
    await s.load('L1');
    await s.select(1);
    expect(await useLessonStore.getState().check(q('Q1', 1))).toBe(true);
    expect(await getUserRepo().getReviewItem('Q1')).toBeNull();
    expect((await getUserRepo().getProgress('L1'))!.score).toBe(1);
  });

  it('cannot change the pick after Check, or check twice', async () => {
    const s = useLessonStore.getState();
    await s.load('L1');
    await s.select(1);
    await useLessonStore.getState().check(q('Q1', 1));
    await useLessonStore.getState().select(3);
    expect(useLessonStore.getState().progress!.pendingPick).toBe(1);
    await expect(useLessonStore.getState().check(q('Q1', 1))).rejects.toThrow();
  });

  it('check without a pick throws', async () => {
    await useLessonStore.getState().load('L1');
    await expect(useLessonStore.getState().check(q('Q1', 1))).rejects.toThrow();
  });

  it('advance moves on, clears the pick, and marks done after the last step', async () => {
    await useLessonStore.getState().load('L1');
    await useLessonStore.getState().advance(2);
    expect(useLessonStore.getState().progress).toMatchObject({
      stepIndex: 1,
      pendingPick: null,
      checked: false,
      done: false,
    });
    await useLessonStore.getState().advance(2);
    expect(useLessonStore.getState().progress).toMatchObject({ stepIndex: 2, done: true });
    expect(track).toHaveBeenCalledWith(
      'lesson_completed',
      expect.objectContaining({ lesson_id: 'L1' }),
    );
  });

  it('a later correct answer to a queued miss advances its box', async () => {
    await useLessonStore.getState().load('L1');
    await useLessonStore.getState().select(0);
    await useLessonStore.getState().check(q('Q1', 1)); // miss
    await useLessonStore.getState().restart('L1');
    await useLessonStore.getState().select(1);
    await useLessonStore.getState().check(q('Q1', 1)); // right
    expect(await getUserRepo().getReviewItem('Q1')).toMatchObject({ box: 2, streakCorrect: 1 });
  });
});

describe('settings store', () => {
  beforeEach(setup);
  it('persists updates to the user DB', async () => {
    await useSettingsStore.getState().load();
    await useSettingsStore.getState().update({ sunMode: true, haptics: false });
    useSettingsStore.setState({ loaded: false });
    await useSettingsStore.getState().load();
    expect(useSettingsStore.getState().settings).toMatchObject({ sunMode: true, haptics: false });
  });
});
