// A tiny async SQL interface so the same repositories run on expo-sqlite (device) and
// better-sqlite3 (tests, content build, dev screenshots).
export type SqlParam = string | number | null;

export interface SqlDriver {
  exec(sql: string): Promise<void>;
  run(sql: string, params?: SqlParam[]): Promise<void>;
  all<T = Record<string, unknown>>(sql: string, params?: SqlParam[]): Promise<T[]>;
  get<T = Record<string, unknown>>(sql: string, params?: SqlParam[]): Promise<T | null>;
}

/** Runs fn inside BEGIN/COMMIT on a single connection; rolls back on error. */
export async function withTransaction<T>(db: SqlDriver, fn: () => Promise<T>): Promise<T> {
  await db.exec('BEGIN');
  try {
    const out = await fn();
    await db.exec('COMMIT');
    return out;
  } catch (e) {
    await db.exec('ROLLBACK');
    throw e;
  }
}
