import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const scratchpad = 'C:/Users/learn/AppData/Local/Temp/claude/c00b0e0cd292abbf/e7b75390-f9f4-40aa-9a91-addcd25f5ac2/scratchpad';

// Navigate to Apollo 11 game
await page.goto('http://localhost:5175/play/apollo-11?demo=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(6000);
await page.screenshot({ path: `${scratchpad}/hologram-1-surface.png` });
console.log('Surface scene loaded');

// Force the game into inspect phase via store manipulation
await page.evaluate(() => {
  const store = window.__GAME_STORE__;
  if (store) {
    store.getState().send('INSPECT', { objectId: 'descent-stage' });
  }
});
await page.waitForTimeout(2000);
await page.screenshot({ path: `${scratchpad}/hologram-2-inspect.png` });

// Check if hologram elements exist
const hologramPanel = await page.$('[class*="backdrop-blur"]');
const evaBar = await page.$('text=EVA');
const objectCounter = await page.$('text=Objects:');
const closeBtn = await page.$('text=[ESC]');
console.log('Hologram panel:', hologramPanel !== null);
console.log('EVA bar:', evaBar !== null);
console.log('Object counter:', objectCounter !== null);
console.log('Close button:', closeBtn !== null);

// Check for any console errors
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.waitForTimeout(1000);
console.log('Console errors:', errors.length);
if (errors.length > 0) console.log('Errors:', errors.slice(0, 3));

await ctx.close();
await browser.close();
console.log('Done');
