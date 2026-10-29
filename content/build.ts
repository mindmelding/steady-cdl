// Builds assets/content.db from content/src/*.json. Run: npm run build:content
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { z } from 'zod';
import {
  FixLogEntrySchema,
  GlossaryTermSchema,
  LessonSchema,
  QuestionSrcSchema,
  StateFormatSchema,
  UnitSchema,
  WatchedSourceSchema,
  type ContentBundle,
} from '../src/db/content/types';
import { readingGrade } from './readingGrade';

export const CONTENT_VERSION = '1';

export function loadSources(dir = path.join(__dirname, 'src')): ContentBundle {
  const read = <T extends z.ZodTypeAny>(file: string, schema: T): z.infer<T>[] => {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    return z.array(schema).parse(raw);
  };
  return {
    questions: read('questions.json', QuestionSrcSchema),
    units: read('units.json', UnitSchema),
    lessons: read('lessons.json', LessonSchema),
    state_formats: read('state_formats.json', StateFormatSchema),
    glossary: read('glossary.json', GlossaryTermSchema),
    fix_log: read('fix_log.json', FixLogEntrySchema),
    watched_sources: read('watched_sources.json', WatchedSourceSchema),
  };
}

const j = (v: unknown) => JSON.stringify(v);
const n = <T>(v: T | undefined): T | null => (v === undefined ? null : v);

export function buildContentDb(bundle: ContentBundle, outPath: string): void {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  if (fs.existsSync(outPath)) fs.rmSync(outPath);
  const db = new Database(outPath);
  db.exec(fs.readFileSync(path.join(__dirname, '../src/db/content/schema.sql'), 'utf8'));
  const tx = db.transaction(() => {
    db.prepare('INSERT INTO meta VALUES (?, ?)').run('content_version', CONTENT_VERSION);
    const unit = db.prepare('INSERT INTO units VALUES (?,?,?,?,?,?,?,?)');
    for (const u of bundle.units)
      unit.run(
        u.id,
        u.section,
        u.state,
        u.title,
        u.order,
        j(u.lesson_ids),
        u.unit_check_count,
        u.entitlement,
      );
    const lesson = db.prepare('INSERT INTO lessons VALUES (?,?,?,?,?,?,?,?,?)');
    for (const l of bundle.lessons)
      lesson.run(
        l.id,
        l.unit_id,
        l.order,
        l.title,
        l.minutes,
        l.why,
        j(l.key_facts),
        j(l.step_ids),
        l.free ? 1 : 0,
      );
    const question = db.prepare(
      `INSERT INTO questions VALUES (${new Array(29).fill('?').join(',')})`,
    );
    for (const q of bundle.questions) {
      const grade = readingGrade([q.question, ...q.options, q.explanation].join('. '));
      question.run(
        q.id,
        q.type,
        q.state,
        q.section,
        q.unit_id,
        n(q.lesson_id),
        q.topic,
        q.question,
        j(q.options),
        q.answer_index,
        q.explanation,
        j(q.manual_citation),
        n(q.regulation_ref),
        j(q.cfr_sections),
        j(q.source_a),
        j(q.source_b),
        q.source_excerpt_paraphrase,
        q.official_manual_url,
        n(q.figure_asset),
        grade,
        q.last_checked,
        q.verified_a_by,
        q.verified_b_by,
        q.review_status,
        q.difficulty,
        j(q.glossary_terms),
        q.free_tier ? 1 : 0,
        q.version,
        n(q.change_note),
      );
    }
    const sf = db.prepare(
      `INSERT INTO state_formats VALUES (${new Array(17).fill('?').join(',')})`,
    );
    for (const s of bundle.state_formats)
      sf.run(
        s.state,
        s.section,
        j(s.required_for),
        s.order,
        s.question_count,
        s.pass_pct,
        s.options_per_q,
        n(s.time_limit_min),
        s.test_language,
        s.languages ? j(s.languages) : null,
        s.manual_edition,
        s.manual_model,
        s.source_url,
        s.last_checked,
        s.verified_by,
        s.verified ? 1 : 0,
        n(s.notes),
      );
    const g = db.prepare('INSERT INTO glossary VALUES (?,?,?,?)');
    for (const t of bundle.glossary)
      g.run(t.term, t.plain, n(t.es_gloss), t.citation ? j(t.citation) : null);
    const f = db.prepare(
      'INSERT INTO fix_log (date,question_id,state,version,kind,summary,source_url) VALUES (?,?,?,?,?,?,?)',
    );
    for (const e of bundle.fix_log)
      f.run(e.date, n(e.question_id), n(e.state), e.version, e.kind, e.summary, n(e.source_url));
    const w = db.prepare('INSERT INTO watched_sources VALUES (?,?,?,?,?)');
    for (const s of bundle.watched_sources) w.run(s.id, s.kind, s.target, s.last_hash, s.last_seen);
  });
  tx();
  db.close();
}

if (require.main === module) {
  const out = path.join(__dirname, '../assets/content.db');
  const bundle = loadSources();
  buildContentDb(bundle, out);
  console.log(
    `content.db built: ${bundle.questions.length} questions, ${bundle.lessons.length} lessons`,
  );
}
