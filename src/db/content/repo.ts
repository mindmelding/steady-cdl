import type { SqlDriver } from '../driver';
import type {
  Citation,
  GlossaryTerm,
  Jurisdiction,
  Lesson,
  Question,
  Section,
  StateFormat,
  Unit,
} from './types';

type Row = Record<string, unknown>;
const parse = <T>(v: unknown): T => JSON.parse(v as string) as T;
const opt = <T>(v: unknown): T | undefined =>
  v === null || v === undefined ? undefined : (v as T);

export function rowToQuestion(r: Row): Question {
  return {
    id: r.id as string,
    type: r.type as Question['type'],
    state: r.state as Jurisdiction,
    section: r.section as Section,
    unit_id: r.unit_id as string,
    lesson_id: opt<string>(r.lesson_id),
    topic: r.topic as string,
    question: r.question as string,
    options: parse<string[]>(r.options),
    answer_index: r.answer_index as number,
    explanation: r.explanation as string,
    manual_citation: parse<Citation>(r.manual_citation),
    regulation_ref: opt<string>(r.regulation_ref),
    cfr_sections: parse<string[]>(r.cfr_sections),
    source_a: parse<Citation>(r.source_a),
    source_b: parse<Citation>(r.source_b),
    source_excerpt_paraphrase: r.source_excerpt_paraphrase as string,
    official_manual_url: r.official_manual_url as string,
    figure_asset: opt<string>(r.figure_asset),
    reading_grade: r.reading_grade as number,
    last_checked: r.last_checked as string,
    verified_a_by: r.verified_a_by as string,
    verified_b_by: r.verified_b_by as string,
    review_status: r.review_status as Question['review_status'],
    difficulty: r.difficulty as Question['difficulty'],
    glossary_terms: parse<string[]>(r.glossary_terms),
    free_tier: r.free_tier === 1,
    version: r.version as number,
    change_note: opt<string>(r.change_note),
  };
}

export function rowToLesson(r: Row): Lesson {
  return {
    id: r.id as string,
    unit_id: r.unit_id as string,
    order: r.sort_order as number,
    title: r.title as string,
    minutes: r.minutes as number,
    why: r.why as string,
    key_facts: parse<Lesson['key_facts']>(r.key_facts),
    step_ids: parse<string[]>(r.step_ids),
    free: r.free === 1,
  };
}

export function rowToUnit(r: Row): Unit {
  return {
    id: r.id as string,
    section: r.section as Section,
    state: r.state as Jurisdiction,
    title: r.title as string,
    order: r.sort_order as number,
    lesson_ids: parse<string[]>(r.lesson_ids),
    unit_check_count: r.unit_check_count as number,
    entitlement: r.entitlement as Unit['entitlement'],
  };
}

export function rowToStateFormat(r: Row): StateFormat {
  return {
    state: r.state as Jurisdiction,
    section: r.section as Section,
    required_for: parse<StateFormat['required_for']>(r.required_for),
    order: r.sort_order as number,
    question_count: r.question_count as number,
    pass_pct: r.pass_pct as number,
    options_per_q: r.options_per_q as 3 | 4,
    time_limit_min: opt<number>(r.time_limit_min),
    test_language: r.test_language as StateFormat['test_language'],
    languages: r.languages ? parse<string[]>(r.languages) : undefined,
    manual_edition: r.manual_edition as string,
    manual_model: r.manual_model as StateFormat['manual_model'],
    source_url: r.source_url as string,
    last_checked: r.last_checked as string,
    verified_by: r.verified_by as string,
    verified: r.verified === 1,
    notes: opt<string>(r.notes),
  };
}

/**
 * A row may drive a simulator only if a human verified it from the primary source:
 * `verified` is true AND `verified_by` names who. Anything else is a placeholder.
 */
export function isSimulatorEligible(f: StateFormat | null | undefined): f is StateFormat {
  return !!f && f.verified === true && f.verified_by.trim() !== '';
}

export interface QuestionRef {
  id: string;
  lessonId: string | null;
  freeTier: boolean;
  topic: string;
}

/** Typed, read-only queries over content.db. Nothing here writes. */
export class ContentRepo {
  constructor(private db: SqlDriver) {}

  async contentVersion(): Promise<string | null> {
    const r = await this.db.get<{ value: string }>(
      "SELECT value FROM meta WHERE key = 'content_version'",
    );
    return r?.value ?? null;
  }

  async getUnit(id: string): Promise<Unit | null> {
    const r = await this.db.get('SELECT * FROM units WHERE id = ?', [id]);
    return r ? rowToUnit(r) : null;
  }

  async listUnits(state: Jurisdiction): Promise<Unit[]> {
    const rows = await this.db.all('SELECT * FROM units WHERE state = ? ORDER BY sort_order', [
      state,
    ]);
    return rows.map(rowToUnit);
  }

  async getLesson(id: string): Promise<Lesson | null> {
    const r = await this.db.get('SELECT * FROM lessons WHERE id = ?', [id]);
    return r ? rowToLesson(r) : null;
  }

  async listLessons(unitId: string): Promise<Lesson[]> {
    const rows = await this.db.all('SELECT * FROM lessons WHERE unit_id = ? ORDER BY sort_order', [
      unitId,
    ]);
    return rows.map(rowToLesson);
  }

  async getQuestion(id: string): Promise<Question | null> {
    const r = await this.db.get('SELECT * FROM questions WHERE id = ?', [id]);
    return r ? rowToQuestion(r) : null;
  }

  /** Questions of a lesson in the lesson's step order. Retired/flagged questions are skipped. */
  async getLessonQuestions(lessonId: string): Promise<Question[]> {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) return [];
    const rows = await this.db.all(
      "SELECT * FROM questions WHERE lesson_id = ? AND review_status NOT IN ('retired','flagged')",
      [lessonId],
    );
    const byId = new Map(rows.map((r) => [r.id as string, rowToQuestion(r)]));
    return lesson.step_ids.map((id) => byId.get(id)).filter((q): q is Question => !!q);
  }

  /** Questions by id, in the order asked for. Unknown ids are skipped. */
  async getQuestions(ids: string[]): Promise<Question[]> {
    if (ids.length === 0) return [];
    const rows = await this.db.all(
      `SELECT * FROM questions WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids,
    );
    const byId = new Map(rows.map((r) => [r.id as string, rowToQuestion(r)]));
    return ids.map((id) => byId.get(id)).filter((q): q is Question => !!q);
  }

  /** Light rows for counting and pooling: skips retired and flagged questions. */
  async unitQuestionRefs(unitId: string): Promise<QuestionRef[]> {
    const rows = await this.db.all<{
      id: string;
      lesson_id: string | null;
      free_tier: number;
      topic: string;
    }>(
      `SELECT id, lesson_id, free_tier, topic FROM questions
       WHERE unit_id = ? AND review_status NOT IN ('retired','flagged') ORDER BY id`,
      [unitId],
    );
    return rows.map((r) => ({
      id: r.id,
      lessonId: r.lesson_id,
      freeTier: r.free_tier === 1,
      topic: r.topic,
    }));
  }

  /** Jurisdictions that have their own units (everything else uses NAT content). */
  async statesWithUnits(): Promise<Set<string>> {
    const rows = await this.db.all<{ state: string }>('SELECT DISTINCT state FROM units');
    return new Set(rows.map((r) => r.state));
  }

  async getStateFormat(state: Jurisdiction, section: Section): Promise<StateFormat | null> {
    const r = await this.db.get('SELECT * FROM state_formats WHERE state = ? AND section = ?', [
      state,
      section,
    ]);
    return r ? rowToStateFormat(r) : null;
  }

  async listStateFormats(state: Jurisdiction): Promise<StateFormat[]> {
    const rows = await this.db.all(
      'SELECT * FROM state_formats WHERE state = ? ORDER BY sort_order',
      [state],
    );
    return rows.map(rowToStateFormat);
  }

  /** The only way to get a format for a simulator: null unless the row is verified. */
  async getSimulatorFormat(state: Jurisdiction, section: Section): Promise<StateFormat | null> {
    const f = await this.getStateFormat(state, section);
    return isSimulatorEligible(f) ? f : null;
  }

  async canOfferSimulator(state: Jurisdiction, section: Section): Promise<boolean> {
    return (await this.getSimulatorFormat(state, section)) !== null;
  }

  async getGlossary(): Promise<GlossaryTerm[]> {
    const rows = await this.db.all('SELECT * FROM glossary ORDER BY term');
    return rows.map((r) => ({
      term: r.term as string,
      plain: r.plain as string,
      es_gloss: opt<string>(r.es_gloss),
      citation: r.citation ? parse<Citation>(r.citation) : undefined,
    }));
  }
}
