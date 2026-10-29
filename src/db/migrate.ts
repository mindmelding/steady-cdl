import { withTransaction, type SqlDriver } from './driver';

export interface Migration {
  version: number;
  sql: string;
}

/** Applies pending migrations in order, versioned by PRAGMA user_version. Idempotent. */
export async function migrate(db: SqlDriver, migrations: Migration[]): Promise<number> {
  const row = await db.get<{ user_version: number }>('PRAGMA user_version');
  let current = row?.user_version ?? 0;
  const sorted = [...migrations].sort((a, b) => a.version - b.version);
  for (const m of sorted) {
    if (m.version <= current) continue;
    await withTransaction(db, async () => {
      await db.exec(m.sql);
      await db.exec(`PRAGMA user_version = ${m.version}`);
    });
    current = m.version;
  }
  return current;
}
