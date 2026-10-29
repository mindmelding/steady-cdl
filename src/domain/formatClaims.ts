// The one place that decides what the app may CLAIM about a test format (M2 honesty rule).
// A StateFormat row that is not verified (verified:true AND verified_by set) is only a placeholder:
// no state count, no pass mark, no "like the real test", no language rule, no pass tick.
// Unverified rows still give a sensible practice length (the row's NAT-default numbers).
import { isSimulatorEligible } from '../db/content/repo';
import type { StateFormat } from '../db/content/types';

export interface FormatClaims {
  /** The row is verified from the primary source. Nothing below is claimed unless this is true. */
  verified: boolean;
  /** 'real' = the check matches the verified state format; 'practice' = just a practice test. */
  testKind: 'real' | 'practice';
  /** Number of questions the check will actually ask. */
  questionCount: number;
  /** Pass mark in percent. Only set when verified. */
  passPct?: number;
  /** Pass mark as a fraction of a turn for the Ring tick. Only set when verified. */
  tick?: number;
  /** "On the Texas test" may be shown on lessons. */
  onStateTest: boolean;
  /** The language rule may be claimed ("tests in English"). */
  languageEnglishOnly: boolean;
}

export interface FormatClaimsOptions {
  /** How many questions the bank can supply for this unit. */
  available?: number;
  /** Fallback length when there is no row at all (the unit's own unit_check_count). */
  fallbackCount?: number;
}

export function formatClaims(
  row: StateFormat | null | undefined,
  opts: FormatClaimsOptions = {},
): FormatClaims {
  const verified = isSimulatorEligible(row);
  const wanted = Math.max(0, row?.question_count ?? opts.fallbackCount ?? 0);
  const available = opts.available ?? wanted;
  const questionCount = Math.min(wanted, available);
  // "Like the real test" is only true if the bank can fill the real length.
  const real = verified && available >= wanted && wanted > 0;
  return {
    verified,
    testKind: real ? 'real' : 'practice',
    questionCount,
    passPct: verified ? row!.pass_pct : undefined,
    tick: verified ? row!.pass_pct / 100 : undefined,
    onStateTest: verified,
    languageEnglishOnly: verified && row!.test_language === 'en_only',
  };
}

/**
 * "Texas · tests in English" may be said only when every format row for the state is verified and
 * English-only. Anything less shows just the state name.
 */
export function languageClaim(rows: StateFormat[]): boolean {
  return rows.length > 0 && rows.every((r) => formatClaims(r).languageEnglishOnly);
}
