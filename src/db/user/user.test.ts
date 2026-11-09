import { memoryDriver } from '../nodeDriver';
import { migrate } from '../migrate';
import { USER_MIGRATIONS } from './migrations';
import { UserRepo } from './repos';

async function fresh() {
  const db = memoryDriver();
  await migrate(db, USER_MIGRATIONS);
  return { db, repo: new UserRepo(db) };
}

describe('user DB migrations', () => {
  it('create every §4.2 table and set user_version', async () => {
    const { db } = await fresh();
    const tables = (
      await db.all<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
      )
    ).map((t) => t.name);
    for (const t of [
      'attempts',
      'lesson_progress',
      'review_queue',
      'sims',
      'entitlements',
      'pending_reports',
      'test_date',
      'settings',
      'lesson_done',
      'test_runs',
    ]) {
      expect(tables).toContain(t);
    }
    expect((await db.get<{ user_version: number }>('PRAGMA user_version'))!.user_version).toBe(
      USER_MIGRATIONS.at(-1)!.version,
    );
  });

  it('is idempotent and applies later migrations only once', async () => {
    const db = memoryDriver();
    const last = USER_MIGRATIONS.at(-1)!.version;
    expect(await migrate(db, USER_MIGRATIONS)).toBe(last);
    expect(await migrate(db, USER_MIGRATIONS)).toBe(last);
    const extra = [
      ...USER_MIGRATIONS,
      { version: last + 1, sql: 'ALTER TABLE settings ADD COLUMN extra INTEGER' },
    ];
    expect(await migrate(db, extra)).toBe(last + 1);
    expect(await migrate(db, extra)).toBe(last + 1);
  });

  it('rolls back a failing migration and keeps the old version', async () => {
    const db = memoryDriver();
    await migrate(db, USER_MIGRATIONS);
    await expect(
      migrate(db, [
        ...USER_MIGRATIONS,
        {
          version: USER_MIGRATIONS.at(-1)!.version + 1,
          sql: 'CREATE TABLE ok (a); CREATE TABLE ok (a);',
        },
      ]),
    ).rejects.toThrow();
    expect((await db.get<{ user_version: number }>('PRAGMA user_version'))!.user_version).toBe(
      USER_MIGRATIONS.at(-1)!.version,
    );
  });
});

describe('UserRepo', () => {
  it('defaults settings and saves them', async () => {
    const { repo } = await fresh();
    expect(await repo.getSettings()).toEqual({
      textSize: 1,
      sunMode: false,
      haptics: true,
      voice: null,
      speed: 1,
      dailyMinutesGoal: null,
      trackState: null,
      goal: null,
      onboarded: false,
    });
    await repo.saveSettings({
      textSize: 1.2,
      sunMode: true,
      haptics: false,
      voice: 'x',
      speed: 1.5,
      dailyMinutesGoal: 15,
      trackState: 'TX',
      goal: 'permit',
      onboarded: true,
    });
    expect((await repo.getSettings()).sunMode).toBe(true);
  });

  it('saves and resumes lesson progress including the pending pick', async () => {
    const { repo } = await fresh();
    expect(await repo.getProgress('L')).toBeNull();
    await repo.saveProgress(
      {
        lessonId: 'L',
        stepIndex: 2,
        done: false,
        score: 1,
        seconds: 0,
        pendingPick: 3,
        checked: false,
      },
      1,
    );
    expect(await repo.getProgress('L')).toMatchObject({
      stepIndex: 2,
      pendingPick: 3,
      checked: false,
      score: 1,
    });
    await repo.saveProgress(
      {
        lessonId: 'L',
        stepIndex: 2,
        done: false,
        score: 1,
        seconds: 0,
        pendingPick: 3,
        checked: true,
      },
      2,
    );
    expect((await repo.getProgress('L'))!.checked).toBe(true);
  });

  it('review queue upsert, remove and counts', async () => {
    const { repo } = await fresh();
    await repo.upsertReviewItem({
      questionId: 'a',
      box: 1,
      dueDate: '2026-10-28',
      streakCorrect: 0,
    });
    await repo.upsertReviewItem({
      questionId: 'b',
      box: 2,
      dueDate: '2026-11-02',
      streakCorrect: 1,
    });
    expect(await repo.countReview('2026-10-28')).toEqual({ total: 2, due: 1 });
    await repo.upsertReviewItem({
      questionId: 'a',
      box: 2,
      dueDate: '2026-10-30',
      streakCorrect: 1,
    });
    expect(await repo.countReview('2026-10-28')).toEqual({ total: 2, due: 0 });
    await repo.removeReviewItem('a');
    expect((await repo.listReviewItems()).map((i) => i.questionId)).toEqual(['b']);
    expect(await repo.countReview('2026-10-28')).toEqual({ total: 1, due: 0 });
  });

  it('records attempts, sims, entitlements, reports and test date', async () => {
    const { repo } = await fresh();
    await repo.recordAttempt({
      questionId: 'q',
      correct: false,
      chosenIndex: 2,
      ts: 5,
      mode: 'lesson',
    });
    expect(await repo.listAttempts('q')).toEqual([
      { questionId: 'q', correct: false, chosenIndex: 2, ts: 5, mode: 'lesson' },
    ]);
    await repo.recordSim('u', 0.8, true, 1);
    await repo.recordSim('u', 0.6, false, 2);
    expect(await repo.recentSimScores('u')).toEqual([0.8, 0.6]);
    await repo.setEntitlement('permit', true, 1);
    await repo.setEntitlement('hazmat', false, 1);
    expect(await repo.listGrantedEntitlements()).toEqual(['permit']);
    await repo.queueReport('q', 'Typo', null, 1);
    expect(await repo.countPendingReports()).toBe(1);
    expect(await repo.getTestDate()).toBeNull();
    await repo.setTestDate('2026-11-18');
    expect(await repo.getTestDate()).toBe('2026-11-18');
  });

  it('lesson_done: a replay never downgrades a completion; tested out is remembered', async () => {
    const { repo } = await fresh();
    await repo.markLessonDone('A', 'tested_out', 1);
    await repo.markLessonDone('B', 'completed', 2);
    await repo.markLessonDone('B', 'tested_out', 3);
    await repo.markLessonDone('A', 'completed', 4);
    expect([...(await repo.listDoneLessons())]).toEqual([
      ['A', 'completed'],
      ['B', 'completed'],
    ]);
  });

  it('test runs: create, autosave answers, resume the active run, finish', async () => {
    const { repo } = await fresh();
    const id = await repo.createRun('unit_check', 'U1', ['q1', 'q2', 'q3'], 80, 10);
    expect(await repo.getRun(id)).toMatchObject({
      kind: 'unit_check',
      unitId: 'U1',
      answers: [null, null, null],
      step: 0,
      finished: false,
      passPct: 80,
    });
    await repo.saveRunAnswer(id, 0, 2, 1);
    expect(await repo.getActiveRun('unit_check', 'U1')).toMatchObject({
      id,
      answers: [2, null, null],
      step: 1,
    });
    expect(await repo.getActiveRun('unit_check', 'U2')).toBeNull();
    expect(await repo.getActiveRun('practice', 'U1')).toBeNull();
    await repo.finishRun(id, 20);
    expect(await repo.getActiveRun('unit_check', 'U1')).toBeNull();
    await repo.saveRunAnswer(id, 1, 1, 2); // ignored once finished
    expect((await repo.getRun(id))!.answers).toEqual([2, null, null]);
    const p = await repo.createRun('placement', null, ['q'], null, 30);
    expect(await repo.getActiveRun('placement', null)).toMatchObject({ id: p, passPct: null });
  });
});
