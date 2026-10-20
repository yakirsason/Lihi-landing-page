import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const production = process.argv.includes('--production');
const baseURL = production ? 'http://127.0.0.1:4173' : process.env.TEST_URL || 'http://127.0.0.1:5173';
const server = production ? spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { stdio: 'ignore', windowsHide: true }) : null;
if (server) {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(baseURL)).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) { server.kill(); throw new Error('Production preview did not start.'); }
}
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
await mkdir('test-results', { recursive: true });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(baseURL);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('main>section').count(), 10);
  assert.equal(await page.locator('h1').count(), 1);
  for (const id of ['hero-portrait', 'about-portrait', 'certification', 'clinic-interior', 'result-01-before', 'result-01-after']) {
    const image = page.locator(`[data-media-id="${id}"] img`).first();
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img => img.decode());
    assert.equal(await image.evaluate(img => img.complete && img.naturalWidth > 0), true, `Supplied asset did not load: ${id}`);
  }
  assert.equal(await page.locator('.comparison-disclaimer').count(), 0);
  for (const href of await page.locator('a[href^="https://wa.me/"]').evaluateAll(links => links.map(a => a.href))) {
    assert.equal(new URL(href).pathname, '/972523430314');
    assert.ok(new URL(href).searchParams.get('text'));
  }
  await page.locator('.compare-range').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.compare-range').inputValue(), '51');
  assert.ok((await page.locator('.comparison').getAttribute('style')).includes('51%'));
  await page.getByRole('button', { name: 'לתוצאה הבאה', exact: true }).click();
  assert.ok(await page.locator('[data-media-id="result-02-before"]').count());
  await page.getByRole('button', { name: 'הצגת תיעוד 3', exact: true }).click();
  assert.ok(await page.locator('[data-media-id="result-03-after"]').count());
  await page.getByRole('button', { name: 'הצגת תיעוד 1', exact: true }).click();

  await page.locator('.gallery-item-1').click();
  assert.equal(await page.locator('#media-dialog').evaluate(el => el.open), true);
  assert.ok(await page.locator('#media-dialog [data-media-id="clinic-interior"] img').count());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#media-dialog').evaluate(el => el.open), false);
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('gallery-item-1')), true);
  await page.locator('.treatment-film').click();
  assert.ok(await page.locator('#media-dialog [data-media-id="treatment-video"]').count());
  await page.locator('#media-dialog .close-dialog').click();

  await page.locator('.faq-item').nth(0).locator('summary').click();
  assert.equal(await page.locator('.faq-item').nth(0).evaluate(el => el.open), true);
  await page.locator('.faq-item').nth(1).locator('summary').click();
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.faq-item').nth(0).evaluate(el => el.open), false);
  await page.locator('.faq-item').nth(1).locator('summary').click();

  await page.locator('.review-next').click();
  await page.waitForTimeout(100);
  assert.ok(await page.locator('.review-track').evaluate(el => Math.abs(el.scrollLeft) > 10));

  assert.equal(await page.locator('.quiz-next').isDisabled(), true);
  await page.getByRole('radio', { name: 'אקנה ופצעונים', exact: true }).check();
  await page.locator('.quiz-next').click();
  await page.getByRole('radio', { name: 'מעורב', exact: true }).check();
  let quizLink = new URL(await page.locator('.quiz-send').getAttribute('href'));
  assert.equal(quizLink.pathname, '/972523430314');
  assert.match(quizLink.searchParams.get('text'), /אקנה ופצעונים/);
  assert.match(quizLink.searchParams.get('text'), /מעורב/);
  await page.locator('.quiz-back').click();
  assert.equal(await page.getByRole('radio', { name: 'אקנה ופצעונים', exact: true }).isChecked(), true);
  await page.locator('.quiz-next').click();
  assert.equal(await page.getByRole('radio', { name: 'מעורב', exact: true }).isChecked(), true);
  assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  await page.locator('.privacy-button').click();
  assert.equal(await page.locator('#privacy-dialog').evaluate(el => el.open), true);
  await page.keyboard.press('Escape');

  for (const width of [1440, 1024, 768, 600, 390, 360, 320]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(baseURL);
    await page.evaluate(() => document.fonts.ready);
    const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(dimensions.scroll <= dimensions.width, `Horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`);
    if ([1440, 768, 390].includes(width)) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `test-results/page-${width}.png`, fullPage: true });
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      if (audit.violations.length) {
        await import('node:fs/promises').then(fs => fs.writeFile(`test-results/axe-${width}.json`, JSON.stringify(audit.violations, null, 2)));
      }
      assert.equal(audit.violations.length, 0, `Accessibility at ${width}px: ${audit.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`).join('\n')}`);
    }
    if (width === 390) {
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
      await page.locator('#mobile-nav a[href="#about"]').click();
      assert.equal(await page.locator('#mobile-nav').isVisible(), false);
      assert.equal(await page.locator('.mobile-sticky').isVisible(), true);
      await page.locator('.gallery-item-4').click();
      await page.keyboard.press('Escape');
    }
  }
  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(baseURL);
  await touchPage.locator('.menu-toggle').tap();
  assert.equal(await touchPage.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await touchPage.locator('#mobile-nav a[href="#results"]').tap();
  await touchPage.locator('.compare-range').scrollIntoViewIfNeeded();
  const rangeBox = await touchPage.locator('.compare-range').boundingBox();
  await touchPage.touchscreen.tap(rangeBox.x + rangeBox.width * .25, rangeBox.y + rangeBox.height * .5);
  assert.notEqual(await touchPage.locator('.compare-range').inputValue(), '50');
  await touchPage.getByRole('radio', { name: 'אקנה ופצעונים', exact: true }).tap();
  await touchPage.locator('.quiz-next').tap();
  await touchPage.getByRole('radio', { name: 'רגיש', exact: true }).tap();
  assert.match(new URL(await touchPage.locator('.quiz-send').getAttribute('href')).searchParams.get('text'), /רגיש/);
  await touchContext.close();
  assert.deepEqual(errors, [], `Browser or asset errors: ${errors.join(', ')}`);
  console.log(`PASS (${production ? 'production build' : 'development'}): 10 sections, WhatsApp destinations, comparison keyboard and touch control and three result slots, media dialogs and focus restoration, FAQ, carousel, questionnaire with back navigation and message encoding, privacy dialog, mobile menu, seven responsive widths, WCAG A/AA at desktop/tablet/mobile, no asset or browser errors.`);
} finally {
  await browser.close();
  server?.kill();
}
