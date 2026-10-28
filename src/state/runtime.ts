// Process-wide handles set once at startup (app/_layout.tsx) or by tests.
import { ContentRepo } from '../db/content/repo';
import type { SqlDriver } from '../db/driver';
import { UserRepo } from '../db/user/repos';
import { localDateString } from '../domain/dates';

let userRepo: UserRepo | null = null;
let contentRepo: ContentRepo | null = null;

export function setDatabases(user: SqlDriver, content: SqlDriver): void {
  userRepo = new UserRepo(user);
  contentRepo = new ContentRepo(content);
}
export function getUserRepo(): UserRepo {
  if (!userRepo) throw new Error('User DB not initialised');
  return userRepo;
}
export function getContentRepo(): ContentRepo {
  if (!contentRepo) throw new Error('Content DB not initialised');
  return contentRepo;
}

export const clock = {
  now: () => Date.now(),
  today: () => localDateString(),
};
