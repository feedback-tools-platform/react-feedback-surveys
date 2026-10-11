import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PORT = 6006;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = join(ROOT, 'docs/assets');

const PREVIEWS = [
  {id: 'widgets-survey-ces--preview', file: 'ces7.png'},
  {id: 'widgets-survey-csat-2-points--preview', file: 'csat2.png'},
  {id: 'widgets-survey-csat-5-points--preview', file: 'csat5.png'},
  {id: 'widgets-survey-csat-5-points--preview-popup', file: 'csat5-popup.png'},
  {id: 'widgets-survey-nps--preview', file: 'nps10.png'},
  {id: 'widgets-survey-nps--preview-mobile', file: 'nps10-mobile.png', viewport: {width: 414, height: 896}},
  {id: 'widgets-survey-general--preview', file: 'general.png'},
  {id: 'style-catalog--collage', file: 'styles-collage.png', viewport: {width: 1440, height: 1600}, waitForPlay: true, opaque: true},
  // every `[data-capture]` element saved on its own as `<dir>/<data-capture>.png`
  {
    id: 'style-catalog--collage',
    dir: 'styles',
    each: '[data-capture]',
    css: '.styles-collage-label { display: none; } .styles-collage-tile { border-radius: 0; }',
    viewport: {width: 1440, height: 1600},
    waitForPlay: true,
    opaque: true
  },
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
    for (const {id, file, dir, each, css = '', viewport, waitForPlay, opaque} of PREVIEWS) {
      const page = await browser.newPage({deviceScaleFactor: 2});

      if (viewport) {
        await page.setViewportSize(viewport);
      }

      await page.goto(`${BASE_URL}/iframe.html?id=${id}&viewMode=story`, {waitUntil: 'networkidle'});

      const el = page.locator('#storybook-root > *').first();
      await el.waitFor({state: 'visible'});

      // the story's play function marks the root once it has opened the steps it shows
      if (waitForPlay) {
        await page.locator('#storybook-root[data-ready]').waitFor({state: 'attached'});
      }

      // Stories use layout: 'fullscreen' + inline-flex, so element is already at (0,0).
      // Only need to neutralise browser's default body margin.
      await page.addStyleTag({content: `body { margin: 0; background: ${opaque ? '#fff' : 'transparent'}; } ${css}`});

      if (each) {
        mkdirSync(join(OUTPUT_DIR, dir), {recursive: true});

        for (const part of await page.locator(each).all()) {
          const name = await part.getAttribute('data-capture');

          await part.screenshot({path: join(OUTPUT_DIR, dir, `${name}.png`), omitBackground: !opaque});
          console.log(`  saved  docs/assets/${dir}/${name}.png`);
        }
      } else {
        // an opaque preview paints its own background, so a fractional height must not leave a see-through last row
        await el.screenshot({path: join(OUTPUT_DIR, file), omitBackground: !opaque});
        console.log(`  saved  docs/assets/${file}`);
      }

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
