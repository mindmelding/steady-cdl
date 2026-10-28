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
    ]) {
      expect(tables).toContain(t);
    }
    expect((await db.get<{ user_version: number }>('PRAGMA user_version'))!.user_version).toBe(
      USER_MIGRATIONS.at(-1)!.version,
    );
  });

  it('is idempotent and applies later migrations only once', async () => {
    const db = memoryDriver();
    expect(await migrate(db, USER_MIGRATIONS)).toBe(1);
    expect(await migrate(db, USER_MIGRATIONS)).toBe(1);
    const extra = [
      ...USER_MIGRATIONS,
      { version: 2, sql: 'ALTER TABLE settings ADD COLUMN extra INTEGER' },
    ];
    expect(await migrate(db, extra)).toBe(2);
    expect(await migrate(db, extra)).toBe(2);
  });

  it('rolls back a failing migration and keeps the old version', async () => {
    const db = memoryDriver();
    await migrate(db, USER_MIGRATIONS);
    await expect(
      migrate(db, [
        ...USER_MIGRATIONS,
        { version: 2, sql: 'CREATE TABLE ok (a); CREATE TABLE ok (a);' },
      ]),
    ).rejects.toThrow();
    expect((await db.get<{ user_version: number }>('PRAGMA user_version'))!.user_version).toBe(1);
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
    });
    await repo.saveSettings({
      textSize: 1.2,
      sunMode: true,
      haptics: false,
      voice: 'x',
      speed: 1.5,
      dailyMinutesGoal: 15,
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
});
