import type { Migration } from '../migrate';

// User DB, CLAUDE.md §4.2. Only ever append migrations; never edit a shipped one.
export const USER_MIGRATIONS: Migration[] = [
  {
    version: 1,
    sql: `
CREATE TABLE attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id TEXT NOT NULL,
  correct INTEGER NOT NULL,
  chosen_index INTEGER NOT NULL,
  ts INTEGER NOT NULL,
  mode TEXT NOT NULL
);
CREATE INDEX attempts_question ON attempts(question_id, ts);

-- pending_pick / checked hold the in-flight step so a killed app resumes on the same step with the
-- same pick selected. score = number of correct answers so far in this lesson run.
CREATE TABLE lesson_progress (
  lesson_id TEXT PRIMARY KEY,
  step_index INTEGER NOT NULL DEFAULT 0,
  done INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  seconds INTEGER NOT NULL DEFAULT 0,
  pending_pick INTEGER,
  checked INTEGER NOT NULL DEFAULT 0,
  updated_ts INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE review_queue (
  question_id TEXT PRIMARY KEY,
  box INTEGER NOT NULL,
  due_date TEXT NOT NULL,
  streak_correct INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE sims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_id TEXT NOT NULL,
  score REAL NOT NULL,
  passed INTEGER NOT NULL,
  ts INTEGER NOT NULL
);

-- Cache of RevenueCat entitlements for offline use (CLAUDE.md §2.1).
CREATE TABLE entitlements (
  entitlement TEXT PRIMARY KEY,
  granted INTEGER NOT NULL,
  updated_ts INTEGER NOT NULL
);

CREATE TABLE pending_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  note TEXT,
  ts INTEGER NOT NULL,
  sent INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE test_date (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  date TEXT
);

CREATE TABLE settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  text_size REAL NOT NULL DEFAULT 1,
  sun_mode INTEGER NOT NULL DEFAULT 0,
  haptics INTEGER NOT NULL DEFAULT 1,
  voice TEXT,
  speed REAL NOT NULL DEFAULT 1,
  daily_minutes_goal INTEGER
);
INSERT INTO settings (id) VALUES (1);
`,
  },
  {
    // M2: the saved track (state + goal), lessons done or tested out, and in-flight / finished
    // test runs (unit checks, practice tests, the placement check).
    version: 2,
    sql: `
ALTER TABLE settings ADD COLUMN track_state TEXT;
ALTER TABLE settings ADD COLUMN goal TEXT;
ALTER TABLE settings ADD COLUMN onboarded INTEGER NOT NULL DEFAULT 0;
-- how = 'completed' (finished the lesson) or 'tested_out' (placement check). Never cleared by a replay.
CREATE TABLE lesson_done (
  lesson_id TEXT PRIMARY KEY,
  how TEXT NOT NULL,
  ts INTEGER NOT NULL
);
-- kind = 'unit_check' | 'practice' | 'placement'. answers is a JSON array of chosen indexes
-- (null = not answered yet). pass_pct is set only when the format was verified at start.
CREATE TABLE test_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  unit_id TEXT,
  question_ids TEXT NOT NULL,
  answers TEXT NOT NULL,
  step INTEGER NOT NULL DEFAULT 0,
  finished INTEGER NOT NULL DEFAULT 0,
  pass_pct REAL,
  started_ts INTEGER NOT NULL,
  finished_ts INTEGER
);
`,
  },
];
