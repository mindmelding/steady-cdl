// Zod validators + types for every CLAUDE.md §4.1 content type. Shared by the content build,
// the content lint and the app (the app imports types only).
import { z } from 'zod';

export const JURISDICTIONS = [
  'NAT',
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
] as const;
export const JurisdictionSchema = z.enum(JURISDICTIONS);
export type Jurisdiction = z.infer<typeof JurisdictionSchema>;

export const SECTIONS = [
  'GK',
  'AIR_BRAKES',
  'COMBINATION',
  'TX_COMMERCIAL_RULES',
  'HAZMAT',
  'TANKER',
  'DOUBLES_TRIPLES',
  'PASSENGER',
  'SCHOOL_BUS',
  'HAZMAT_RENEWAL',
  'AIR_BRAKE_RESTRICTION', // reserved for Gate 1
] as const;
export const SectionSchema = z.enum(SECTIONS);
export type Section = z.infer<typeof SectionSchema>;

export const CitationSchema = z.object({
  doc: z.string().min(1), // "TX CDL Handbook" | "49 CFR"
  locator: z.string().min(1), // "§5.4.2" | "393.51" | "[VERIFY]"
  edition: z.string().optional(),
  url: z.string().optional(),
});
export type Citation = z.infer<typeof CitationSchema>;

export const REVIEW_STATUSES = [
  'draft',
  'agent_verified',
  'human_verified',
  'published',
  'flagged',
  'retired',
] as const;
export const ReviewStatusSchema = z.enum(REVIEW_STATUSES);

export const QuestionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['mc', 'mc_figure']),
  state: JurisdictionSchema,
  section: SectionSchema,
  unit_id: z.string().min(1),
  lesson_id: z.string().optional(),
  topic: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)),
  answer_index: z.number().int(),
  explanation: z.string().min(1),
  manual_citation: CitationSchema,
  regulation_ref: z.string().optional(),
  cfr_sections: z.array(z.string()),
  source_a: CitationSchema,
  source_b: CitationSchema,
  source_excerpt_paraphrase: z.string(),
  official_manual_url: z.string(),
  figure_asset: z.string().optional(),
  reading_grade: z.number(),
  last_checked: z.string(), // ISO date
  verified_a_by: z.string(),
  verified_b_by: z.string(),
  review_status: ReviewStatusSchema,
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  glossary_terms: z.array(z.string()),
  free_tier: z.boolean(),
  version: z.number().int(),
  change_note: z.string().optional(),
});
export type Question = z.infer<typeof QuestionSchema>;
/** Source files omit reading_grade; the build computes it. */
export const QuestionSrcSchema = QuestionSchema.omit({ reading_grade: true });
export type QuestionSrc = z.infer<typeof QuestionSrcSchema>;

export const ENTITLEMENTS = [
  'free',
  'permit',
  'hazmat',
  'tanker',
  'doubles',
  'passenger',
  'schoolbus',
] as const;
export const EntitlementSchema = z.enum(ENTITLEMENTS);
export type Entitlement = z.infer<typeof EntitlementSchema>;

export const UnitSchema = z.object({
  id: z.string().min(1),
  section: SectionSchema,
  state: JurisdictionSchema,
  title: z.string().min(1),
  order: z.number().int(), // from StateFormat.order
  lesson_ids: z.array(z.string()),
  unit_check_count: z.number().int(), // = StateFormat.question_count
  entitlement: EntitlementSchema,
});
export type Unit = z.infer<typeof UnitSchema>;

export const KeyFactSchema = z.object({
  label: z.string().min(1),
  text: z.string().min(1),
  citation: CitationSchema,
});

export const LessonSchema = z.object({
  id: z.string().min(1),
  unit_id: z.string().min(1),
  order: z.number().int(),
  title: z.string().min(1),
  minutes: z.number().int(),
  why: z.string().min(1),
  key_facts: z.array(KeyFactSchema),
  step_ids: z.array(z.string()),
  free: z.boolean(), // true only for order === 1 in each unit
});
export type Lesson = z.infer<typeof LessonSchema>;

export const StateFormatSchema = z.object({
  state: JurisdictionSchema,
  section: SectionSchema,
  required_for: z.array(z.enum(['A', 'B', 'C', 'ENDO'])),
  order: z.number().int(), // TX Commercial Rules = 1
  question_count: z.number().int(),
  pass_pct: z.number(), // drives the readiness tick
  options_per_q: z.union([z.literal(3), z.literal(4)]),
  time_limit_min: z.number().optional(), // only if published
  test_language: z.enum(['en_only', 'en_plus']),
  languages: z.array(z.string()).optional(),
  manual_edition: z.string(),
  manual_model: z.enum(['legacy', 'aamva_modernized', 'unknown']),
  source_url: z.string(),
  last_checked: z.string(), // '' until verified
  verified_by: z.string(), // '' until verified
  /** M1 addition: a row is never used for a simulator unless verified is true. */
  verified: z.boolean(),
  notes: z.string().optional(),
});
export type StateFormat = z.infer<typeof StateFormatSchema>;

export const GlossaryTermSchema = z.object({
  term: z.string().min(1),
  plain: z.string().min(1),
  es_gloss: z.string().optional(),
  citation: CitationSchema.optional(),
});
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;

export const FixLogEntrySchema = z.object({
  date: z.string(),
  question_id: z.string().optional(),
  state: JurisdictionSchema.optional(),
  version: z.number().int(),
  kind: z.enum(['user_report', 'rule_change', 'manual_edition', 'format_change']),
  summary: z.string(),
  source_url: z.string().optional(),
});
export type FixLogEntry = z.infer<typeof FixLogEntrySchema>;

export const WatchedSourceSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['ecfr_part', 'fed_register_query', 'manual_url', 'dmv_page']),
  target: z.string(),
  last_hash: z.string(),
  last_seen: z.string(),
});
export type WatchedSource = z.infer<typeof WatchedSourceSchema>;

export interface ContentBundle {
  questions: QuestionSrc[];
  units: Unit[];
  lessons: Lesson[];
  state_formats: StateFormat[];
  glossary: GlossaryTerm[];
  fix_log: FixLogEntry[];
  watched_sources: WatchedSource[];
}
