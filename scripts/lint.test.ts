import fs from 'fs';
import path from 'path';
import { lintContent, validateRaw } from './contentLint';
import { lintCopySource } from './copyLint';
import { loadSources } from '../content/build';
import type { ContentBundle, QuestionSrc } from '../src/db/content/types';

const NOW = new Date('2026-10-28T12:00:00Z');
const base = (): ContentBundle => JSON.parse(JSON.stringify(loadSources()));
const errorsFor = (b: ContentBundle) => lintContent(b, NOW).errors;
const withQ = (patch: Partial<QuestionSrc>): ContentBundle => {
  const b = base();
  b.questions[0] = { ...b.questions[0], ...patch };
  return b;
};

describe('content lint', () => {
  it('the shipped seed is clean', () => {
    expect(lintContent(loadSources(), NOW).errors).toEqual([]);
  });

  it('answer_index out of range', () => {
    expect(errorsFor(withQ({ answer_index: 9 })).join()).toMatch(/not a valid option index/);
    expect(errorsFor(withQ({ answer_index: -1 })).join()).toMatch(/not a valid option index/);
  });

  it('duplicate option text means more than one correct answer', () => {
    expect(errorsFor(withQ({ options: ['60 psi', '60 psi', '80 psi'] })).join()).toMatch(
      /duplicate option/,
    );
  });

  it('all/none of the above', () => {
    expect(errorsFor(withQ({ options: ['40 psi', '60 psi', 'All of the above'] })).join()).toMatch(
      /of the above/,
    );
    expect(errorsFor(withQ({ options: ['40 psi', '60 psi', 'None of the above'] })).join()).toMatch(
      /of the above/,
    );
  });

  it('option count must be 3 or 4', () => {
    expect(errorsFor(withQ({ options: ['a', 'b'] })).join()).toMatch(/needs 3 or 4 options/);
    expect(errorsFor(withQ({ options: ['a', 'b', 'c', 'd', 'e'] })).join()).toMatch(
      /needs 3 or 4 options/,
    );
  });

  it('missing manual_citation, source_a, source_b', () => {
    const e = errorsFor(
      withQ({
        manual_citation: { doc: '', locator: '' },
        source_a: { doc: '49 CFR', locator: '' },
        source_b: { doc: '', locator: '393.51' },
      }),
    ).join();
    expect(e).toMatch(/manual_citation missing/);
    expect(e).toMatch(/source_a missing/);
    expect(e).toMatch(/source_b missing/);
  });

  it('last_checked older than 12 months, future, or not a date', () => {
    expect(errorsFor(withQ({ last_checked: '2025-01-01' })).join()).toMatch(/max 12 months/);
    expect(errorsFor(withQ({ last_checked: '2027-01-01' })).join()).toMatch(/in the future/);
    expect(errorsFor(withQ({ last_checked: 'Oct 2026' })).join()).toMatch(/not a date/);
    expect(errorsFor(withQ({ last_checked: '2025-11-01' }))).toEqual([]);
  });

  it('paraphrase over 240 chars or empty', () => {
    expect(errorsFor(withQ({ source_excerpt_paraphrase: 'x'.repeat(241) })).join()).toMatch(
      /max 240/,
    );
    expect(errorsFor(withQ({ source_excerpt_paraphrase: 'x'.repeat(240) }))).toEqual([]);
    expect(errorsFor(withQ({ source_excerpt_paraphrase: '' })).join()).toMatch(/empty/);
  });

  it('figure_asset required when the text mentions shown/figure/diagram', () => {
    expect(errorsFor(withQ({ question: 'What does the gauge shown here read?' })).join()).toMatch(
      /figure_asset/,
    );
    expect(errorsFor(withQ({ question: 'See the diagram. Which part?' })).join()).toMatch(
      /figure_asset/,
    );
    expect(
      errorsFor(
        withQ({ question: 'What does the gauge shown here read?', figure_asset: 'gauge.png' }),
      ),
    ).toEqual([]);
    expect(errorsFor(withQ({ type: 'mc_figure' })).join()).toMatch(
      /mc_figure requires figure_asset/,
    );
  });

  it('duplicate ids', () => {
    const b = base();
    b.questions.push({ ...b.questions[0] });
    expect(errorsFor(b).join()).toMatch(/duplicate question id/);
    const c = base();
    c.lessons.push({ ...c.lessons[0] });
    expect(errorsFor(c).join()).toMatch(/duplicate lesson id/);
  });

  it('lessons need 2 to 4 key facts, each with a citation', () => {
    const b = base();
    b.lessons[0].key_facts = b.lessons[0].key_facts.slice(0, 1);
    expect(errorsFor(b).join()).toMatch(/needs 2-4 key facts/);
    const c = base();
    c.lessons[0].key_facts[0].citation = { doc: '', locator: '' };
    expect(errorsFor(c).join()).toMatch(/key fact 1 has no citation/);
    const d = base();
    d.lessons[0].key_facts = [
      ...d.lessons[0].key_facts,
      ...d.lessons[0].key_facts,
      ...d.lessons[0].key_facts,
    ];
    expect(errorsFor(d).join()).toMatch(/needs 2-4 key facts/);
  });

  it('only the first lesson of a unit is free', () => {
    const b = base();
    b.lessons[0].free = false;
    expect(errorsFor(b).join()).toMatch(/free must be true only for order === 1/);
  });

  it('broken references', () => {
    expect(errorsFor(withQ({ unit_id: 'nope' })).join()).toMatch(/unit_id nope does not exist/);
    expect(errorsFor(withQ({ lesson_id: 'nope' })).join()).toMatch(/lesson_id nope does not exist/);
    const b = base();
    b.lessons[0].step_ids = [...b.lessons[0].step_ids, 'GHOST'];
    expect(errorsFor(b).join()).toMatch(/GHOST is not a known question/);
  });

  it('invalid Jurisdiction or Section is a schema error', () => {
    const b = base();
    const raw = {
      questions: [{ ...b.questions[0], state: 'XX' }],
      units: [{ ...b.units[0], section: 'DRIVING' }],
      lessons: b.lessons,
      state_formats: b.state_formats,
      glossary: b.glossary,
      fix_log: b.fix_log,
      watched_sources: b.watched_sources,
    };
    const r = validateRaw(raw);
    expect(r.bundle).toBeUndefined();
    expect(r.errors.join()).toMatch(/questions\[0\.state\]/);
    expect(r.errors.join()).toMatch(/units\[0\.section\]/);
  });

  it('simulator-eligible rows require options.length === options_per_q', () => {
    const b = base();
    const i = b.state_formats.findIndex((s) => s.state === 'NAT' && s.section === 'AIR_BRAKES');
    b.state_formats[i] = {
      ...b.state_formats[i],
      verified: true,
      verified_by: 'Sean',
      last_checked: '2026-10-28',
      source_url: 'https://x',
      options_per_q: 4,
    };
    b.questions[2].options = ['The lower number', 'The higher number', 'Always 60 psi']; // 3 options
    expect(errorsFor(b).join()).toMatch(/AB-LOWAIR-003: has 3 options but NAT\/AIR_BRAKES uses 4/);
    // unverified rows are not enforced
    expect(errorsFor(base())).toEqual([]);
  });

  it('published questions may not carry [VERIFY] locators or empty verifiers', () => {
    const e = errorsFor(withQ({ review_status: 'published' })).join();
    expect(e).toMatch(/manual_citation still has a \[VERIFY\] locator/);
    expect(e).toMatch(/verified_a_by/);
  });

  it('verified state formats need who/when/source; verified_by without verified is rejected', () => {
    const b = base();
    b.state_formats[0] = { ...b.state_formats[0], verified: true };
    expect(errorsFor(b).join()).toMatch(/verified rows need verified_by/);
    const c = base();
    c.state_formats[0] = { ...c.state_formats[0], verified_by: 'Sean' };
    expect(errorsFor(c).join()).toMatch(/verified_by is set but verified is false/);
  });
});

describe('copy lint', () => {
  const run = (src: string) => lintCopySource(src).map((v) => v.reason);

  it('the shipped src/copy.ts is clean', () => {
    const src = fs.readFileSync(path.join(__dirname, '../src/copy.ts'), 'utf8');
    expect(lintCopySource(src)).toEqual([]);
  });

  it.each(['guarantee', 'pass first', 'real test questions', 'actual test', 'streak', 'pass rate'])(
    'rejects "%s" in any case',
    (phrase) => {
      expect(
        run(`export const copy = { a: { b: 'We ${phrase.toUpperCase()} it' } };`).join(),
      ).toMatch(/forbidden phrase/);
      expect(run(`export const copy = { a: \`${phrase}\` };`).join()).toMatch(/forbidden phrase/);
    },
  );

  it.each(['Official', 'DMV', 'DPS', 'FMCSA'])('rejects %s outside source keys', (w) => {
    expect(run(`export const copy = { headline: 'The ${w} way' };`).join()).toMatch(
      /only allowed in keys that start with "source"/,
    );
  });

  it('allows Official/DMV/DPS/FMCSA inside source* keys, including nested and templates', () => {
    expect(run("export const copy = { sourceLine: 'Source: TX DPS' };")).toEqual([]);
    expect(run("export const copy = { sourceLabels: { tx: 'TX DPS', fed: 'FMCSA' } };")).toEqual(
      [],
    );
    expect(
      run(
        'export const copy = { sourceChecked: (m: string) => `Checked ${m} · official manual` };',
      ),
    ).toEqual([]);
  });

  it('does not match inside other words and ignores property names', () => {
    expect(run("export const copy = { a: 'Unofficially fine, dpsx' };")).toEqual([]);
    expect(run("export const copy = { streak_free: 'ok' };")).toEqual([]);
  });

  it('reports the key path of the offending string', () => {
    const v = lintCopySource("export const copy = { paywall: { title: 'A guarantee' } };");
    expect(v[0].key).toBe('copy.paywall.title'.replace('copy.', ''));
  });
});
