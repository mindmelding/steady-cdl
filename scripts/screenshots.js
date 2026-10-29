// Dev-only: capture M1 screenshots from the web build with Playwright (preinstalled globally).
//   EXPO_PUBLIC_DEV_TOOLS=1 npx expo export -p web --output-dir <dist>
//   node scripts/serve-web.js <dist> 8081 &
//   NODE_PATH=$(npm root -g) node scripts/screenshots.js <outDir> [baseUrl]
// Browsers have no Dynamic Type, so "largest text" is simulated with ?fontScale=3 (dev-only param).
const { chromium } = require('playwright');
const path = require('path');

const outDir = process.argv[2];
const base = process.argv[3] || 'http://localhost:8081';
if (!outDir) throw new Error('usage: screenshots.js <outDir> [baseUrl]');

const SCALES = [
  { name: 'default', q: '' },
  { name: 'largest', q: '?fontScale=3' },
];

async function fresh(browser, viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('pageerror:', String(e).slice(0, 300)));
  return { ctx, page };
}

async function openQuestion(page, q) {
  await page.goto(`${base}/lesson/AB-L01/0${q}`);
  await page.getByRole('button', { name: 'Check' }).waitFor({ timeout: 20000 });
}

(async () => {
  const browser = await chromium.launch();
  const shot = async (page, name) => {
    const file = path.join(outDir, name + '.png');
    await page.screenshot({ path: file });
    console.log('wrote', file);
  };
  const flows = {
    '01-question-before-check': async (page) => {
      await page.getByLabel('Option A:').first().click();
    },
    '02-question-after-wrong': async (page) => {
      await page.getByLabel('Option A:').first().click();
      await page.getByRole('button', { name: 'Check' }).click();
      await page.getByText('Not quite.').waitFor();
    },
    '03-question-after-right': async (page) => {
      await page.getByLabel('Option B:').first().click();
      await page.getByRole('button', { name: 'Check' }).click();
      await page.getByText('Correct.').waitFor();
    },
  };
  for (const s of SCALES) {
    for (const [name, flow] of Object.entries(flows)) {
      for (const tall of [false, true]) {
        if (tall && s.name === 'default') continue;
        const { ctx, page } = await fresh(browser, { width: 393, height: tall ? 2800 : 852 });
        await openQuestion(page, s.q);
        await flow(page);
        await page.waitForTimeout(400);
        await shot(page, `${name}-${s.name}${tall ? '-tall' : ''}`);
        await ctx.close();
      }
    }
    const { ctx, page } = await fresh(browser, { width: 393, height: 852 });
    await page.goto(`${base}/dev/gallery${s.q}`);
    await page.getByText('Dev gallery').waitFor({ timeout: 20000 });
    await page.waitForTimeout(500);
    await shot(page, `04-gallery-${s.name}`);
    await ctx.close();
    const t = await fresh(browser, { width: 393, height: 2800 });
    await t.page.goto(`${base}/dev/gallery${s.q}`);
    await t.page.getByText('Dev gallery').waitFor({ timeout: 20000 });
    await t.page.waitForTimeout(500);
    await shot(t.page, `04-gallery-${s.name}-tall`);
    await t.ctx.close();
  }
  await browser.close();
})();
