import type { SqlDriver } from '../driver';
import { withTransaction } from '../driver';
import type { ReviewItem, Box } from '../../domain/review';

export interface Attempt {
  questionId: string;
  correct: boolean;
  chosenIndex: number;
  ts: number;
  mode: string;
}

export interface LessonProgress {
  lessonId: string;
  stepIndex: number;
  done: boolean;
  score: number;
  seconds: number;
  pendingPick: number | null;
  checked: boolean;
}

export interface Settings {
  textSize: number;
  sunMode: boolean;
  haptics: boolean;
  voice: string | null;
  speed: number;
  dailyMinutesGoal: number | null;
}

type Row = Record<string, unknown>;

export class UserRepo {
  constructor(private db: SqlDriver) {}

  // attempts
  async recordAttempt(a: Attempt): Promise<void> {
    await this.db.run(
      'INSERT INTO attempts (question_id, correct, chosen_index, ts, mode) VALUES (?,?,?,?,?)',
      [a.questionId, a.correct ? 1 : 0, a.chosenIndex, a.ts, a.mode],
    );
  }
  async listAttempts(questionId: string): Promise<Attempt[]> {
    const rows = await this.db.all('SELECT * FROM attempts WHERE question_id = ? ORDER BY id', [
      questionId,
    ]);
    return rows.map((r) => ({
      questionId: r.question_id as string,
      correct: r.correct === 1,
      chosenIndex: r.chosen_index as number,
      ts: r.ts as number,
      mode: r.mode as string,
    }));
  }

  // lesson progress
  async getProgress(lessonId: string): Promise<LessonProgress | null> {
    const r = await this.db.get<Row>('SELECT * FROM lesson_progress WHERE lesson_id = ?', [
      lessonId,
    ]);
    if (!r) return null;
    return {
      lessonId: r.lesson_id as string,
      stepIndex: r.step_index as number,
      done: r.done === 1,
      score: r.score as number,
      seconds: r.seconds as number,
      pendingPick: (r.pending_pick as number | null) ?? null,
      checked: r.checked === 1,
    };
  }
  async saveProgress(p: LessonProgress, ts: number): Promise<void> {
    await this.db.run(
      `INSERT INTO lesson_progress (lesson_id, step_index, done, score, seconds, pending_pick, checked, updated_ts)
       VALUES (?,?,?,?,?,?,?,?)
       ON CONFLICT(lesson_id) DO UPDATE SET step_index=excluded.step_index, done=excluded.done,
         score=excluded.score, seconds=excluded.seconds, pending_pick=excluded.pending_pick,
         checked=excluded.checked, updated_ts=excluded.updated_ts`,
      [
        p.lessonId,
        p.stepIndex,
        p.done ? 1 : 0,
        p.score,
        p.seconds,
        p.pendingPick,
        p.checked ? 1 : 0,
        ts,
      ],
    );
  }

  // review queue
  private toItem(r: Row): ReviewItem {
    return {
      questionId: r.question_id as string,
      box: r.box as Box,
      dueDate: r.due_date as string,
      streakCorrect: r.streak_correct as number,
    };
  }
  async getReviewItem(questionId: string): Promise<ReviewItem | null> {
    const r = await this.db.get<Row>('SELECT * FROM review_queue WHERE question_id = ?', [
      questionId,
    ]);
    return r ? this.toItem(r) : null;
  }
  async upsertReviewItem(i: ReviewItem): Promise<void> {
    await this.db.run(
      `INSERT INTO review_queue (question_id, box, due_date, streak_correct) VALUES (?,?,?,?)
       ON CONFLICT(question_id) DO UPDATE SET box=excluded.box, due_date=excluded.due_date,
         streak_correct=excluded.streak_correct`,
      [i.questionId, i.box, i.dueDate, i.streakCorrect],
    );
  }
  async removeReviewItem(questionId: string): Promise<void> {
    await this.db.run('DELETE FROM review_queue WHERE question_id = ?', [questionId]);
  }
  async listReviewItems(): Promise<ReviewItem[]> {
    const rows = await this.db.all<Row>(
      'SELECT * FROM review_queue ORDER BY due_date, question_id',
    );
    return rows.map((r) => this.toItem(r));
  }
  async countReview(today: string): Promise<{ total: number; due: number }> {
    const r = await this.db.get<{ total: number; due: number }>(
      'SELECT COUNT(*) AS total, COALESCE(SUM(due_date <= ?), 0) AS due FROM review_queue',
      [today],
    );
    return { total: r?.total ?? 0, due: r?.due ?? 0 };
  }

  /** Atomic: attempt + progress + review change in one transaction (autosave on Check). */
  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return withTransaction(this.db, fn);
  }

  // settings
  async getSettings(): Promise<Settings> {
    const r = (await this.db.get<Row>('SELECT * FROM settings WHERE id = 1'))!;
    return {
      textSize: r.text_size as number,
      sunMode: r.sun_mode === 1,
      haptics: r.haptics === 1,
      voice: (r.voice as string | null) ?? null,
      speed: r.speed as number,
      dailyMinutesGoal: (r.daily_minutes_goal as number | null) ?? null,
    };
  }
  async saveSettings(s: Settings): Promise<void> {
    await this.db.run(
      'UPDATE settings SET text_size=?, sun_mode=?, haptics=?, voice=?, speed=?, daily_minutes_goal=? WHERE id=1',
      [s.textSize, s.sunMode ? 1 : 0, s.haptics ? 1 : 0, s.voice, s.speed, s.dailyMinutesGoal],
    );
  }

  // sims
  async recordSim(unitId: string, score: number, passed: boolean, ts: number): Promise<void> {
    await this.db.run('INSERT INTO sims (unit_id, score, passed, ts) VALUES (?,?,?,?)', [
      unitId,
      score,
      passed ? 1 : 0,
      ts,
    ]);
  }
  async recentSimScores(unitId: string, n = 3): Promise<number[]> {
    const rows = await this.db.all<{ score: number }>(
      'SELECT score FROM sims WHERE unit_id = ? ORDER BY id DESC LIMIT ?',
      [unitId, n],
    );
    return rows.map((r) => r.score).reverse();
  }

  // entitlements cache
  async setEntitlement(name: string, granted: boolean, ts: number): Promise<void> {
    await this.db.run(
      `INSERT INTO entitlements (entitlement, granted, updated_ts) VALUES (?,?,?)
       ON CONFLICT(entitlement) DO UPDATE SET granted=excluded.granted, updated_ts=excluded.updated_ts`,
      [name, granted ? 1 : 0, ts],
    );
  }
  async listGrantedEntitlements(): Promise<string[]> {
    const rows = await this.db.all<{ entitlement: string }>(
      'SELECT entitlement FROM entitlements WHERE granted = 1',
    );
    return rows.map((r) => r.entitlement);
  }

  // pending reports (offline queue; sending is M5)
  async queueReport(
    questionId: string,
    reason: string,
    note: string | null,
    ts: number,
  ): Promise<void> {
    await this.db.run(
      'INSERT INTO pending_reports (question_id, reason, note, ts) VALUES (?,?,?,?)',
      [questionId, reason, note, ts],
    );
  }
  async countPendingReports(): Promise<number> {
    const r = await this.db.get<{ n: number }>(
      'SELECT COUNT(*) AS n FROM pending_reports WHERE sent = 0',
    );
    return r?.n ?? 0;
  }

  // test date
  async getTestDate(): Promise<string | null> {
    const r = await this.db.get<{ date: string | null }>('SELECT date FROM test_date WHERE id = 1');
    return r?.date ?? null;
  }
  async setTestDate(date: string | null): Promise<void> {
    await this.db.run(
      'INSERT INTO test_date (id, date) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET date = excluded.date',
      [date],
    );
  }
}
