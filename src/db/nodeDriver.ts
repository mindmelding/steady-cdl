// Node-only driver (better-sqlite3). Used by tests, the content build and dev screenshots.
// Never imported from app/ code, so Metro does not bundle it.
import Database from 'better-sqlite3';
import type { SqlDriver, SqlParam } from './driver';

export function nodeDriver(
  file: string,
  opts: { readonly?: boolean } = {},
): SqlDriver & { close(): void } {
  const db = new Database(file, { readonly: opts.readonly ?? false });
  return {
    exec: async (sql) => {
      db.exec(sql);
    },
    run: async (sql, params = []) => {
      db.prepare(sql).run(...(params as SqlParam[]));
    },
    all: async <T>(sql: string, params: SqlParam[] = []) => db.prepare(sql).all(...params) as T[],
    get: async <T>(sql: string, params: SqlParam[] = []) =>
      (db.prepare(sql).get(...params) as T | undefined) ?? null,
    close: () => db.close(),
  };
}

export function memoryDriver(): SqlDriver & { close(): void } {
  return nodeDriver(':memory:');
}
