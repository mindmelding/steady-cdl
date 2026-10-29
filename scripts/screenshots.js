/* global __dirname */
// Dev-only: capture screenshots from the web build with Playwright (preinstalled globally).
//   EXPO_PUBLIC_DEV_TOOLS=1 npx expo export -p web --output-dir <dist>
//   node scripts/serve-web.js <dist> 8081 &
//   NODE_PATH=$(npm root -g) node scripts/screenshots.js <outDir> [baseUrl]
// Browsers have no Dynamic Type, so "largest text" is simulated with ?fontScale=3 (dev-only param).
// Each scale runs one journey through the real UI: onboarding, placement check, lesson, Proof sheet,
// lesson complete, Review, practice test + Results, paywall placeholder, Settings, Test Day.
// The largest scale also writes a "-tall" copy (393 x 2800) so nothing is hidden below the fold.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outDir = process.argv[2];
const base = process.argv[3] || 'http://localhost:8081';
if (!outDir) throw new Error('usage: screenshots.js <outDir> [baseUrl]');
fs.mkdirSync(outDir, { recursive: true });

const QUESTIONS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../content/src/questions.json'), 'utf8'),
);
const SCALES = [
  { name: 'default', q: '' },
  { name: 'largest', q: '?fontScale=3' },
];
const W = 393;
const H = 852;

async function newPage(browser) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('pageerror:', String(e).slice(0, 300)));
  page.on('console', (m) => {
    if (m.type() === 'error') console.error('console error:', m.text().slice(0, 300));
  });
  return { ctx, page };
}

/** The question on screen, found by its stem, so random draws can be answered right or wrong. */
async function currentQuestion(page) {
  await page
    .getByLabel(/^Option A:/)
    .first()
    .waitFor({ timeout: 20000 });
  for (let i = 0; i < 40; i++) {
    const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
    const q = QUESTIONS.find((x) => text.includes(x.question.replace(/\s+/g, ' ').slice(0, 40)));
    if (q) return q;
    await page.waitForTimeout(250);
  }
  throw new Error('question not recognised on screen');
}
/** After Next/Continue: wait until the previous question has left the screen. */
async function gone(page, q) {
  const stem = q.question.replace(/\s+/g, ' ').slice(0, 60);
  await page.waitForFunction(
    (t) => !document.body.innerText.replace(/\s+/g, ' ').includes(t),
    stem,
    { timeout: 20000 },
  );
}
const letter = (i) => String.fromCharCode(65 + i);
async function pick(page, q, how) {
  const i = how === 'right' ? q.answer_index : (q.answer_index + 1) % q.options.length;
  await page
    .getByLabel(new RegExp(`^Option ${letter(i)}:`))
    .first()
    .click();
}

(async () => {
  const browser = await chromium.launch();
  for (const s of SCALES) {
    const { page } = await newPage(browser);
    process.on('unhandledRejection', () => {});
    const tall = s.name === 'largest';
    const shot = async (name) => {
      await page.waitForTimeout(450);
      const file = (suffix) => path.join(outDir, `${name}-${s.name}${suffix}.png`);
      await page.screenshot({ path: file('') });
      console.log('wrote', file(''));
      if (tall) {
        await page.setViewportSize({ width: W, height: 2800 });
        await page.waitForTimeout(450);
        await page.screenshot({ path: file('-tall') });
        await page.setViewportSize({ width: W, height: H });
        await page.waitForTimeout(250);
      }
    };
    const click = (name, { timeout = 30000, ...opts } = {}) =>
      page
        .getByRole('button', { name, ...opts })
        .first()
        .click({ timeout });
    const tab = (name) => page.getByRole('tab', { name }).first().click();

    // 1. Onboarding
    await page.goto(`${base}/${s.q}`);
    await page.getByRole('radio', { name: /^Texas/ }).waitFor({ timeout: 30000 });
    await page.getByRole('radio', { name: /^Texas/ }).click();
    await shot('01-onboarding-state');
    await click('Continue');
    await page.getByRole('radio', { name: /^Getting my permit/ }).waitFor();
    await shot('02-onboarding-goal');

    // 2. The 2-minute check (answered wrong on purpose so Review has something in it)
    await click(/Already studied/);
    let q = await currentQuestion(page);
    await pick(page, q, 'wrong');
    await shot('03-placement-question');
    // Answer the rest of the check (up to 10), wrong on purpose, until it finishes.
    for (let i = 0; i < 12; i++) {
      await click(/^(Finish check|Next)$/);
      const done = page.getByText('Check done');
      const next = page.getByLabel(/^Option A:/).first();
      await Promise.race([
        done.waitFor({ timeout: 30000 }),
        gone(page, q).then(() => next.waitFor({ timeout: 30000 })),
      ]).catch(() => {});
      if (await done.isVisible().catch(() => false)) break;
      q = await currentQuestion(page);
      await pick(page, q, 'wrong');
    }
    await page.getByText('Check done').waitFor();
    await shot('04-placement-done');
    await click('Continue');
    await page.getByText('What is free').waitFor();
    await shot('05-onboarding-free');
    await click('Start learning');
    await page.getByText(/Up next/i).waitFor({ timeout: 15000 });
    await shot('06-home');

    // 3. Lesson: intro, a wrong answer with its Proof sheet, the Source card, Report, a right answer
    await click('Start lesson');
    await page.getByText('Key facts').waitFor();
    await shot('07-lesson-intro');
    await click('Start lesson');
    q = await currentQuestion(page);
    await pick(page, q, 'wrong');
    await click('Check');
    await page.getByText('Not quite.').waitFor();
    await shot('08-proof-wrong');
    await page
      .getByLabel(/^Source\./)
      .first()
      .click();
    await page.getByText('Where this comes from').waitFor();
    await shot('09-source-card');
    await page.getByRole('button', { name: 'Close', exact: true }).last().click();
    await page.getByText('Where this comes from').waitFor({ state: 'hidden' });
    await click('Report a mistake');
    await page.getByRole('radio', { name: 'Outdated' }).click();
    await shot('10-report-sheet');
    await click('Cancel');
    await page.getByRole('radio', { name: 'Outdated' }).waitFor({ state: 'hidden' });
    await click('Continue');
    await gone(page, q);
    q = await currentQuestion(page);
    await pick(page, q, 'right');
    await click('Check');
    await page.getByText('Correct.').waitFor();
    await shot('11-proof-right');
    await click('Continue');
    await gone(page, q);
    for (let i = 0; i < 3; i++) {
      q = await currentQuestion(page);
      await pick(page, q, i === 0 ? 'wrong' : 'right');
      await click('Check');
      await click(i === 2 ? 'Finish lesson' : 'Continue');
      if (i < 2) await gone(page, q);
    }
    await page
      .getByText(/complete/i)
      .first()
      .waitFor();
    await shot('12-lesson-complete');
    await click('Continue');
    // The next lesson is locked, so finishing the free lesson reaches the unit boundary and the
    // paywall may open here (allowed: not mid-lesson). Shoot it and close it.
    const settingsBtn = page.getByRole('button', { name: 'Settings' });
    const payOnce = page.getByText('Pay once.').first();
    await Promise.race([settingsBtn.waitFor(), payOnce.waitFor()]);
    if (await payOnce.isVisible().catch(() => false)) {
      await shot('12b-paywall-after-free-lesson');
      await page.getByRole('button', { name: 'Close', exact: true }).first().click();
    }
    await settingsBtn.waitFor();

    // 4. Home after the free lesson, Review with items
    await page.waitForTimeout(600);
    await shot('13-home-after-lesson');
    await tab(/^Review/);
    await page.getByText(/to fix/).waitFor();
    await shot('14-review');

    // 5. Practice test: question (no feedback) and Results
    await tab(/^Learn/);
    await page
      .getByText(/Practice test/)
      .first()
      .click();
    // Answer every question until Results; the length comes from the "1 of N" counter.
    q = await currentQuestion(page);
    const counter = (await page.locator('body').innerText()).match(/1 of (\d+)/);
    const total = counter ? Number(counter[1]) : 5;
    for (let i = 0; i < total; i++) {
      if (i > 0) q = await currentQuestion(page);
      await pick(page, q, i < 2 ? 'wrong' : 'right');
      if (i === 0) await shot('15-practice-question');
      const last = i === total - 1;
      await click(last ? 'Finish test' : 'Next', { timeout: 20000, exact: true });
      if (!last) await gone(page, q);
    }
    await page.getByRole('button', { name: /Replay \d+ mistakes?/ }).waitFor();
    await shot('16-results');

    // 6. Replay mistakes (Proof sheet inside Review)
    await click(/Replay \d+ mistakes?/);
    await currentQuestion(page);
    await shot('17-replay-question');
    await click('Close replay');
    await click('Back to Learn');

    // 7. Paywall placeholder, Settings, Test Day
    await page
      .getByText(/Full unit check/)
      .first()
      .click();
    await page.getByText('Pay once.').first().waitFor();
    await shot('18-paywall');
    await page.getByRole('button', { name: 'Close', exact: true }).first().click();
    await page.getByRole('button', { name: 'Settings' }).waitFor();
    await click('Settings');
    await page.getByText('Text size').waitFor();
    await shot('19-settings');
    await click('Back');
    await tab(/^Test Day/);
    await page.getByText('A study guide, not a guarantee.').waitFor();
    await shot('20-test-day');

    // 8. Unlocked (mock purchase, dev only)
    await page.goto(`${base}/dev/grant?product=permit_pack${s.q ? '&' + s.q.slice(1) : ''}`);
    await page
      .getByText(/Practice test|Unit check/)
      .first()
      .waitFor({ timeout: 30000 });
    await shot('21-home-unlocked');
    await page.context().close();

    // 9. Review with nothing in it (fresh install, no check taken)
    const fresh = await newPage(browser);
    const p2 = fresh.page;
    await p2.goto(`${base}/${s.q}`);
    await p2.getByRole('radio', { name: /^Not sure/ }).click();
    await p2.getByRole('button', { name: 'Continue' }).click();
    await p2.getByRole('radio', { name: /^Getting my permit/ }).waitFor();
    await p2.getByRole('button', { name: 'Continue' }).click();
    await p2.getByText('What is free').waitFor();
    await p2.getByRole('button', { name: 'Start learning' }).click();
    await p2.getByText(/Up next/i).waitFor({ timeout: 15000 });
    await p2
      .getByRole('tab', { name: /^Review/ })
      .first()
      .click();
    await p2.getByText(/Nothing to fix/).waitFor();
    await p2.waitForTimeout(450);
    await p2.screenshot({ path: path.join(outDir, `22-review-empty-${s.name}.png`) });
    console.log('wrote', `22-review-empty-${s.name}.png`);
    if (tall) {
      await p2.setViewportSize({ width: W, height: 2800 });
      await p2.waitForTimeout(450);
      await p2.screenshot({ path: path.join(outDir, `22-review-empty-${s.name}-tall.png`) });
    }
    await fresh.ctx.close();
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
