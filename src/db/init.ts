import * as SQLite from 'expo-sqlite';
import { migrate } from './migrate';
import { expoDriver } from './expoDriver';
import { USER_MIGRATIONS } from './user/migrations';
import { setDatabases } from '../state/runtime';

/** Opens user.db (migrated) and content.db (the shipped read-only asset) and registers them. */
export async function initDatabases(): Promise<void> {
  const user = await SQLite.openDatabaseAsync('user.db');
  const userDriver = expoDriver(user);
  await migrate(userDriver, USER_MIGRATIONS);

  // content.db is replaced from the bundled asset on every launch for now (it is ~100 KB).
  // Later OTA content updates (EAS Update) will compare meta.content_version first.
  await SQLite.importDatabaseFromAssetAsync('content.db', {
    assetId: require('../../assets/content.db'),
    forceOverwrite: true,
  });
  const content = await SQLite.openDatabaseAsync('content.db');
  setDatabases(userDriver, expoDriver(content));
}
