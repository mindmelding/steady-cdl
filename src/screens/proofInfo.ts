import type { ProofInfo } from '../components/ProofSheet';
import { copy } from '../copy';
import type { Question } from '../db/content/types';
import { lastCheckedLine, sourceLine } from '../domain/citations';

export function proofInfoFor(q: Question): ProofInfo {
  return {
    letter: String.fromCharCode(65 + q.answer_index),
    answerText: q.options[q.answer_index],
    why: q.explanation,
    sourceLine: sourceLine(q),
    lastChecked: lastCheckedLine(q.last_checked),
    paraphrase: q.source_excerpt_paraphrase,
    officialUrl: q.official_manual_url,
  };
}

/** What Read aloud says: the question and options before the answer, the answer and why after. */
export function readAloudText(q: Question, answered: boolean): string {
  if (answered) {
    const p = proofInfoFor(q);
    return copy.proof.listenAnswer(p.letter, p.answerText, p.why);
  }
  const opts = q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}.`).join(' ');
  return `${q.question} ${opts}`;
}
