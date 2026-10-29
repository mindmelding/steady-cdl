// How a citation is shown to the learner. A placeholder locator ("[VERIFY]", "§5.x") must never
// render as if it were a real section number (HANDOFF section 9).
import { copy } from '../copy';
import type { Citation, Question } from '../db/content/types';
import { monthYear } from './dates';

export function isPlaceholderLocator(locator: string): boolean {
  const l = locator.trim();
  return (
    l === '' || /verify/i.test(l) || /\bx\b/i.test(l.replace(/[§.\d]/g, ' ')) || /\.x\b/i.test(l)
  );
}

export function formatCitation(c: Citation): string {
  if (isPlaceholderLocator(c.locator)) return `${c.doc} · ${copy.proof.sectionToConfirm}`;
  return `${c.doc} ${c.locator}`;
}

/** "State CDL manual · Section to be confirmed · 49 CFR 393.51" */
export function sourceLine(q: Pick<Question, 'manual_citation' | 'regulation_ref'>): string {
  const parts = [formatCitation(q.manual_citation)];
  const ref = q.regulation_ref?.trim();
  if (ref && !parts.some((p) => p.includes(ref))) parts.push(ref);
  return parts.join(' · ');
}

export function lastCheckedLine(iso: string): string {
  const m = monthYear(iso);
  return m ? copy.proof.lastChecked(m) : copy.proof.notChecked;
}
