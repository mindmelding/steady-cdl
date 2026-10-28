import type { SQLiteDatabase } from 'expo-sqlite';
import type { SqlDriver, SqlParam } from './driver';

export function expoDriver(db: SQLiteDatabase): SqlDriver {
  return {
    exec: (sql) => db.execAsync(sql),
    run: async (sql, params = []) => {
      await db.runAsync(sql, params);
    },
    all: <T>(sql: string, params: SqlParam[] = []) =>
      db.getAllAsync<T & object>(sql, params) as Promise<T[]>,
    get: async <T>(sql: string, params: SqlParam[] = []) =>
      ((await db.getFirstAsync<T & object>(sql, params)) ?? null) as T | null,
  };
}
