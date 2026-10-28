-- Content DB (read-only at runtime; shipped as an asset, later OTA). Mirrors CLAUDE.md section 4.1.
-- Nested objects (citations, arrays) are stored as JSON text. Column `sort_order` = the spec's `order`.
CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);

CREATE TABLE units (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  state TEXT NOT NULL,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  lesson_ids TEXT NOT NULL,
  unit_check_count INTEGER NOT NULL,
  entitlement TEXT NOT NULL
);

CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL REFERENCES units(id),
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  minutes INTEGER NOT NULL,
  why TEXT NOT NULL,
  key_facts TEXT NOT NULL,
  step_ids TEXT NOT NULL,
  free INTEGER NOT NULL
);

CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  state TEXT NOT NULL,
  section TEXT NOT NULL,
  unit_id TEXT NOT NULL REFERENCES units(id),
  lesson_id TEXT,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  answer_index INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  manual_citation TEXT NOT NULL,
  regulation_ref TEXT,
  cfr_sections TEXT NOT NULL,
  source_a TEXT NOT NULL,
  source_b TEXT NOT NULL,
  source_excerpt_paraphrase TEXT NOT NULL,
  official_manual_url TEXT NOT NULL,
  figure_asset TEXT,
  reading_grade REAL NOT NULL,
  last_checked TEXT NOT NULL,
  verified_a_by TEXT NOT NULL,
  verified_b_by TEXT NOT NULL,
  review_status TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  glossary_terms TEXT NOT NULL,
  free_tier INTEGER NOT NULL,
  version INTEGER NOT NULL,
  change_note TEXT
);
CREATE INDEX questions_lesson ON questions(lesson_id);

CREATE TABLE state_formats (
  state TEXT NOT NULL,
  section TEXT NOT NULL,
  required_for TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  question_count INTEGER NOT NULL,
  pass_pct REAL NOT NULL,
  options_per_q INTEGER NOT NULL,
  time_limit_min REAL,
  test_language TEXT NOT NULL,
  languages TEXT,
  manual_edition TEXT NOT NULL,
  manual_model TEXT NOT NULL,
  source_url TEXT NOT NULL,
  last_checked TEXT NOT NULL,
  verified_by TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  PRIMARY KEY (state, section)
);

CREATE TABLE glossary (
  term TEXT PRIMARY KEY,
  plain TEXT NOT NULL,
  es_gloss TEXT,
  citation TEXT
);

CREATE TABLE fix_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  question_id TEXT,
  state TEXT,
  version INTEGER NOT NULL,
  kind TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT
);

CREATE TABLE watched_sources (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  target TEXT NOT NULL,
  last_hash TEXT NOT NULL,
  last_seen TEXT NOT NULL
);
