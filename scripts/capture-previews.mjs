import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PORT = 6006;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = join(ROOT, 'docs/assets');

const PREVIEWS = [
  {id: 'widgets-ces7-survey--preview', file: 'ces7.png'},
  {id: 'widgets-csat2-survey--preview', file: 'csat2.png'},
  {id: 'widgets-csat5-survey--preview', file: 'csat5.png'},
  {id: 'widgets-csat5-survey--preview-popup', file: 'csat5-popup.png'},
  {id: 'widgets-nps10-survey--preview', file: 'nps10.png'},
  {id: 'widgets-nps10-survey--preview-mobile', file: 'nps10-mobile.png', viewport: {width: 414, height: 896}},
];

async function isStorybookRunning() {
  try {
    const res = await fetch(`${BASE_URL}/iframe.html`);
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForStorybook(maxMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    if (await isStorybookRunning()) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Storybook did not start within 60s');
}

async function main() {
  let storybookProcess = null;

  if (await isStorybookRunning()) {
    console.log(`Using existing Storybook on port ${PORT}`);
  } else {
    console.log('Starting Storybook...');
    storybookProcess = spawn('npx', ['storybook', 'dev', '-p', String(PORT), '--ci'], {
      cwd: ROOT,
      stdio: 'pipe',
    });
    storybookProcess.stderr.on('data', d => process.stderr.write(d));
    await waitForStorybook();
    console.log('Storybook ready.');
  }

  const browser = await chromium.launch();

  try {
    for (const {id, file, viewport} of PREVIEWS) {
      const page = await browser.newPage({deviceScaleFactor: 2});

      if (viewport) {
        await page.setViewportSize(viewport);
      }

      await page.goto(`${BASE_URL}/iframe.html?id=${id}&viewMode=story`, {waitUntil: 'networkidle'});

      const el = page.locator('#storybook-root > *').first();
      await el.waitFor({state: 'visible'});

      // Stories use layout: 'fullscreen' + inline-flex, so element is already at (0,0).
      // Only need to neutralise browser's default body margin.
      await page.addStyleTag({content: 'body { margin: 0; background: transparent; }'});

      await el.screenshot({path: join(OUTPUT_DIR, file), omitBackground: true});
      console.log(`  saved  docs/assets/${file}`);

      await page.close();
    }
  } finally {
    await browser.close();
    storybookProcess?.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
