import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const origin = 'http://127.0.0.1:4176';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4176', '--strictPort'], { stdio: 'ignore', windowsHide: true });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(origin)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, 'Production review server failed to start.');
  await mkdir('docs/brand-review', { recursive: true });
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', ...(width === 390 ? { isMobile: true, hasTouch: true } : {}) });
    const page = await context.newPage();
    await page.goto(origin);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.site-header .brand-logo').evaluate(img => img.decode());
    await page.locator('.hero-media img').evaluate(img => img.decode());
    assert.match(await page.title(), /LIHI SKIN STUDIO/);
    assert.doesNotMatch(await page.locator('body').innerText(), /KB PURE/);
    assert.equal(await page.locator('.hero .brand-logo').count(), 0);
    const headerLogo = await page.locator('.site-header .brand-logo').evaluate(img => ({ src: img.currentSrc, fit: getComputedStyle(img).objectFit }));
    assert.ok(headerLogo.src.endsWith(width === 390 ? '/lihi-wordmark.png' : '/lihi-skin-studio.png'));
    assert.equal(headerLogo.fit, 'contain');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `docs/brand-review/${width === 390 ? 'mobile' : 'desktop'}-header-hero.png` });
    await page.setViewportSize({ width, height: width === 390 ? 650 : 460 });
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await page.locator('.site-footer .brand-logo').evaluate(img => img.decode());
    assert.ok((await page.locator('.site-footer .brand-logo').evaluate(img => img.currentSrc)).endsWith('/lihi-skin-studio.png'));
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    const footer = await page.locator('.site-footer').boundingBox();
    await page.screenshot({ path: `docs/brand-review/${width === 390 ? 'mobile' : 'desktop'}-footer.png`, clip: { x: 0, y: footer.y, width, height: footer.height } });
    await context.close();
  }
  console.log('Brand review passed: actual desktop/mobile header, hero and footer captured in docs/brand-review/.');
} finally {
  await browser?.close();
  server.kill();
}
