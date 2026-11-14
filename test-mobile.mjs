import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const scratchpad = 'C:/Users/learn/AppData/Local/Temp/claude/c00b0e0cd292abbf/e7b75390-f9f4-40aa-9a91-addcd25f5ac2/scratchpad';

// Mobile portrait — wait longer for the game to finish loading
const mobilePortraitCtx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
const page = await mobilePortraitCtx.newPage();
await page.goto('http://localhost:5175/play/apollo-11?demo=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(8000);
await page.screenshot({ path: `${scratchpad}/mobile-portrait-nudge.png` });

// Check nudge overlay
const nudgeEl = await page.$('text=rotate your phone');
console.log('Nudge present:', nudgeEl !== null);
if (nudgeEl) {
  const box = await nudgeEl.boundingBox();
  console.log('Nudge bounding box:', box);
}

// Check no touch controls visible in portrait (nudge blocks everything)
const jumpBtn = await page.$('button:has-text("JUMP")');
console.log('JUMP in portrait:', jumpBtn !== null);

await mobilePortraitCtx.close();
await browser.close();
console.log('Done');
