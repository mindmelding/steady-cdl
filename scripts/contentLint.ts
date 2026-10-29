// Content lint rules (CLAUDE.md §8, M1 subset). Pure functions: tested with bad fixtures.
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
import { isSimulatorEligible } from '../src/db/content/repo';
import { readingGrade } from '../content/readingGrade';

export interface LintResult {
  errors: string[];
  warnings: string[];
}

const NONE_OF_ABOVE = /\b(all|none|neither)\s+of\s+the\s+(above|these)\b/i;
const NEEDS_FIGURE = /\b(shown|figure|diagram)\b/i;
const MAX_PARAPHRASE = 240;
const MAX_AGE_DAYS = 366;
const MAX_READING_GRADE = 8;

const validCitation = (c: { doc?: string; locator?: string } | undefined) =>
  !!c && !!c.doc?.trim() && !!c.locator?.trim();

const isRealDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

function dupes(ids: string[]): string[] {
  const seen = new Set<string>();
  const out = new Set<string>();
  for (const id of ids) (seen.has(id) ? out : seen).add(id);
  return [...out];
}

/** Schema validation of raw JSON (catches invalid Jurisdiction/Section, missing fields). */
export function validateRaw(raw: Record<keyof ContentBundle, unknown>): {
  bundle?: ContentBundle;
  errors: string[];
} {
  const errors: string[] = [];
  const parts: Record<string, unknown[]> = {};
  const schemas: Record<keyof ContentBundle, z.ZodTypeAny> = {
    questions: QuestionSrcSchema,
    units: UnitSchema,
    lessons: LessonSchema,
    state_formats: StateFormatSchema,
    glossary: GlossaryTermSchema,
    fix_log: FixLogEntrySchema,
    watched_sources: WatchedSourceSchema,
  };
  for (const key of Object.keys(schemas) as (keyof ContentBundle)[]) {
    const r = z.array(schemas[key]).safeParse(raw[key]);
    if (r.success) parts[key] = r.data;
    else
      for (const i of r.error.issues)
        errors.push(`${key}[${i.path.join('.')}]: schema: ${i.message}`);
  }
  return errors.length ? { errors } : { bundle: parts as unknown as ContentBundle, errors };
}

export function lintContent(b: ContentBundle, now: Date = new Date()): LintResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const err = (id: string, msg: string) => errors.push(`${id}: ${msg}`);

  // unique ids
  for (const d of dupes(b.questions.map((q) => q.id))) err(d, 'duplicate question id');
  for (const d of dupes(b.lessons.map((l) => l.id))) err(d, 'duplicate lesson id');
  for (const d of dupes(b.units.map((u) => u.id))) err(d, 'duplicate unit id');
  for (const d of dupes(b.state_formats.map((s) => `${s.state}/${s.section}`)))
    err(d, 'duplicate state format row');
  for (const d of dupes(b.glossary.map((g) => g.term))) err(d, 'duplicate glossary term');

  const lessonById = new Map(b.lessons.map((l) => [l.id, l]));
  const unitById = new Map(b.units.map((u) => [u.id, u]));
  const questionIds = new Set(b.questions.map((q) => q.id));

  for (const q of b.questions) {
    const id = q.id;
    // exactly one valid answer
    if (
      !Number.isInteger(q.answer_index) ||
      q.answer_index < 0 ||
      q.answer_index >= q.options.length
    )
      err(id, `answer_index ${q.answer_index} is not a valid option index`);
    if (q.options.length < 3 || q.options.length > 4)
      err(id, `needs 3 or 4 options, has ${q.options.length}`);
    const norm = q.options.map((o) => o.trim().toLowerCase());
    if (new Set(norm).size !== norm.length)
      err(id, 'duplicate option text (more than one option could be correct)');
    if (q.options.some((o) => NONE_OF_ABOVE.test(o)))
      err(id, 'options use "all/none of the above"');

    // citations
    if (!validCitation(q.manual_citation)) err(id, 'manual_citation missing');
    if (!validCitation(q.source_a)) err(id, 'source_a missing');
    if (!validCitation(q.source_b)) err(id, 'source_b missing');

    // freshness
    if (!isRealDate(q.last_checked)) err(id, `last_checked "${q.last_checked}" is not a date`);
    else {
      const age = (now.getTime() - Date.parse(q.last_checked)) / 86400000;
      if (age > MAX_AGE_DAYS)
        err(id, `last_checked is ${Math.floor(age)} days old (max 12 months)`);
      if (age < -1) err(id, 'last_checked is in the future');
    }

    // paraphrase
    if (!q.source_excerpt_paraphrase.trim()) err(id, 'source_excerpt_paraphrase is empty');
    if (q.source_excerpt_paraphrase.length > MAX_PARAPHRASE)
      err(id, `paraphrase is ${q.source_excerpt_paraphrase.length} chars (max ${MAX_PARAPHRASE})`);

    // figure
    const text = [q.question, ...q.options].join(' ');
    if (NEEDS_FIGURE.test(text) && !q.figure_asset)
      err(id, 'text mentions shown/figure/diagram but figure_asset is missing');
    if (q.type === 'mc_figure' && !q.figure_asset) err(id, 'mc_figure requires figure_asset');

    // structure
    const unit = unitById.get(q.unit_id);
    if (!unit) err(id, `unit_id ${q.unit_id} does not exist`);
    else if (unit.section !== q.section)
      err(id, `section ${q.section} differs from its unit's ${unit.section}`);
    if (q.lesson_id) {
      const lesson = lessonById.get(q.lesson_id);
      if (!lesson) err(id, `lesson_id ${q.lesson_id} does not exist`);
      else if (!lesson.step_ids.includes(id)) err(id, `not listed in step_ids of ${q.lesson_id}`);
    }

    // simulator-eligible rows: option count must equal options_per_q
    const fmt = b.state_formats.find((s) => s.state === q.state && s.section === q.section);
    if (isSimulatorEligible(fmt) && q.options.length !== fmt.options_per_q)
      err(
        id,
        `has ${q.options.length} options but ${fmt.state}/${fmt.section} uses ${fmt.options_per_q}`,
      );

    // published questions can carry no placeholders
    if (q.review_status === 'published' || q.review_status === 'human_verified') {
      for (const [k, c] of [
        ['manual_citation', q.manual_citation],
        ['source_a', q.source_a],
        ['source_b', q.source_b],
      ] as const)
        if (c.locator.includes('[VERIFY]')) err(id, `${k} still has a [VERIFY] locator`);
      if (!q.verified_a_by.trim() || !q.verified_b_by.trim())
        err(id, 'verified_a_by / verified_b_by must be set');
      if (q.cfr_sections.length === 0 && q.manual_citation.locator.includes('[VERIFY]'))
        err(id, 'needs cfr_sections or a real manual citation');
    }

    const grade = readingGrade([q.question, ...q.options, q.explanation].join('. '));
    if (grade > MAX_READING_GRADE)
      warnings.push(`${id}: reading grade ${grade} (target <= ${MAX_READING_GRADE})`);
  }

  for (const l of b.lessons) {
    const id = l.id;
    if (l.key_facts.length < 2 || l.key_facts.length > 4)
      err(id, `needs 2-4 key facts, has ${l.key_facts.length}`);
    l.key_facts.forEach((k, i) => {
      if (!validCitation(k.citation)) err(id, `key fact ${i + 1} has no citation`);
    });
    if (!unitById.has(l.unit_id)) err(id, `unit_id ${l.unit_id} does not exist`);
    for (const s of l.step_ids)
      if (!questionIds.has(s)) err(id, `step ${s} is not a known question`);
    if (l.free !== (l.order === 1)) err(id, 'free must be true only for order === 1');
  }

  for (const u of b.units) {
    for (const lid of u.lesson_ids)
      if (!lessonById.has(lid)) err(u.id, `lesson ${lid} does not exist`);
  }

  for (const s of b.state_formats) {
    const id = `${s.state}/${s.section}`;
    if (s.pass_pct <= 0 || s.pass_pct > 100) err(id, `pass_pct ${s.pass_pct} out of range`);
    if (s.verified && (!s.verified_by.trim() || !s.last_checked.trim() || !s.source_url.trim()))
      err(id, 'verified rows need verified_by, last_checked and source_url');
    if (!s.verified && s.verified_by.trim()) err(id, 'verified_by is set but verified is false');
  }

  return { errors, warnings };
}
