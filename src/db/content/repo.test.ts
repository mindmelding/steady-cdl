import path from 'path';
import os from 'os';
import fs from 'fs';
import { buildContentDb, loadSources } from '../../../content/build';
import { nodeDriver } from '../nodeDriver';
import { ContentRepo, isSimulatorEligible } from './repo';
import { JURISDICTIONS, StateFormatSchema } from './types';

let tmp: string;
let repo: ContentRepo;
let driver: ReturnType<typeof nodeDriver>;
const bundle = loadSources();

beforeAll(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'content-'));
  const file = path.join(tmp, 'content.db');
  buildContentDb(bundle, file);
  driver = nodeDriver(file, { readonly: true });
  repo = new ContentRepo(driver);
});
afterAll(() => driver.close());

describe('content DB', () => {
  it('loads: version, seed unit, lesson and five draft questions in step order', async () => {
    expect(await repo.contentVersion()).toBe('1');
    const unit = await repo.getUnit('NAT-AIR_BRAKES');
    expect(unit).toMatchObject({ title: 'Air Brakes', state: 'NAT', section: 'AIR_BRAKES' });
    const lesson = await repo.getLesson('AB-L01');
    expect(lesson?.title).toBe('Low air warnings');
    expect(lesson?.free).toBe(true);
    const qs = await repo.getLessonQuestions('AB-L01');
    expect(qs.map((q) => q.id)).toEqual(lesson!.step_ids);
    expect(qs).toHaveLength(5);
    expect(qs.every((q) => q.review_status === 'draft')).toBe(true);
    expect(qs[0].options.length).toBeGreaterThanOrEqual(3);
    expect(qs[0].reading_grade).toBeGreaterThan(0);
  });

  it('seed questions only use real 49 CFR locators or the literal [VERIFY]', () => {
    for (const q of bundle.questions) {
      for (const c of [q.manual_citation, q.source_a, q.source_b]) {
        if (c.doc === '49 CFR') expect(c.locator).toBe('393.51');
        else expect(c.locator).toBe('[VERIFY]');
      }
    }
  });

  it('defines all 51 jurisdictions plus NAT exactly as CLAUDE.md section 4.1', () => {
    const md = fs.readFileSync(path.join(__dirname, '../../../CLAUDE.md'), 'utf8');
    const line = md.split('\n').find((l) => l.startsWith('type Jurisdiction'))!;
    const fromDoc = [...line.matchAll(/'([A-Z]{2,3})'/g)].map((m) => m[1]);
    expect([...JURISDICTIONS]).toEqual(fromDoc);
    expect(JURISDICTIONS).toHaveLength(52);
  });
});

describe('state formats: no simulator for unverified rows', () => {
  it('seed has NAT/TX/CA/FL rows and every one is unverified', async () => {
    for (const st of ['NAT', 'TX', 'CA', 'FL'] as const) {
      const rows = await repo.listStateFormats(st);
      expect(rows.length).toBeGreaterThan(0);
      for (const r of rows) {
        expect(r.verified).toBe(false);
        expect(r.verified_by).toBe('');
      }
    }
    const tx = await repo.getStateFormat('TX', 'TX_COMMERCIAL_RULES');
    expect(tx).toMatchObject({
      question_count: 20,
      pass_pct: 80,
      order: 1,
      test_language: 'en_only',
    });
  });

  it('getSimulatorFormat and canOfferSimulator refuse unverified rows', async () => {
    expect(await repo.getStateFormat('NAT', 'GK')).not.toBeNull();
    expect(await repo.getSimulatorFormat('NAT', 'GK')).toBeNull();
    expect(await repo.canOfferSimulator('TX', 'TX_COMMERCIAL_RULES')).toBe(false);
    expect(await repo.canOfferSimulator('CA', 'GK')).toBe(false);
  });

  it('a row is eligible only when verified is true AND verified_by is set', () => {
    const base = StateFormatSchema.parse(bundle.state_formats[0]);
    expect(isSimulatorEligible(base)).toBe(false);
    expect(isSimulatorEligible({ ...base, verified: true })).toBe(false);
    expect(isSimulatorEligible({ ...base, verified_by: 'Sean' })).toBe(false);
    expect(isSimulatorEligible({ ...base, verified: true, verified_by: 'Sean' })).toBe(true);
    expect(isSimulatorEligible(null)).toBe(false);
  });

  it('a verified row in the database is then offered', async () => {
    const f = path.join(tmp, 'verified.db');
    const b = loadSources();
    b.state_formats[0] = { ...b.state_formats[0], verified: true, verified_by: 'Sean' };
    buildContentDb(b, f);
    const d = nodeDriver(f, { readonly: true });
    const r = new ContentRepo(d);
    expect(await r.canOfferSimulator(b.state_formats[0].state, b.state_formats[0].section)).toBe(
      true,
    );
    d.close();
  });
});
