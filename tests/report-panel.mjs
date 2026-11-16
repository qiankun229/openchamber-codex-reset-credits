// Optional Chromium check against PORT=4179 bun tests/preview.ts; synthetic data only.
import { strict as assert } from 'node:assert';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

assert(process.env.PLAYWRIGHT_MODULE, 'Set PLAYWRIGHT_MODULE to an installed Playwright module path');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}),
});
const page = await browser.newPage({ viewport: { width: 360, height: 1000 } });
const artifacts = await mkdtemp(join(tmpdir(), 'codex-report-ui-'));
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const base = 'http://127.0.0.1:4179/';
const fixed = 'https://github.com/sofianbll/openchamber-codex-reset-credits/issues/new?template=bug_report.md';
const frame = page.frameLocator('iframe');
await page.route(base + '**', async route => {
  if (new URL(route.request().url()).pathname !== '/') return route.continue();
  const response = await route.fetch();
  const html = (await response.text()).replace('if(!message.id) return;', `if(!message.id) return;
    window.reportCalls ??= []; window.serviceCalls ??= [];
    const parameters = new URLSearchParams(location.search);
    if(message.type === 'open-url' || message.type === 'clipboard-write') {
      window.reportCalls.push({type:message.type,payload:message.payload});
      const fail = parameters.has('bridgefail');
      const reply = () => send({type:'result',id:message.id,ok:!fail,...(fail?{code:'HOST_REJECTED',error:'Synthetic private bridge error'}:{})});
      if(parameters.has('bridgeDelay')) setTimeout(reply,100); else reply();
      return;
    }
    if(message.type === 'service-request') {
      window.serviceCalls.push(message.payload);
      const code = parameters.get('serviceerror');
      if(code) { send({type:'result',id:message.id,ok:true,payload:{status:503,body:JSON.stringify({error:code})}}); return; }
    }`);
  await route.fulfill({ response, body: html });
});
try {
  await page.goto(base + '?fixture=grant&locale=en&width=260&bridgefail=1&theme=dark');
  await frame.locator('.notice').filter({ hasText: 'NOT_GRANTED' }).waitFor();
  assert.equal((await page.evaluate(() => window.reportCalls)).length, 0);
  const requests = await page.evaluate(() => window.serviceCalls.length);
  await frame.locator('.report-diagnostics summary').focus();
  await page.keyboard.press('Enter');
  const expected = 'surface: panel\nview: compact\nlanguage: en\nerror: NOT_GRANTED';
  assert.equal(await frame.locator('.report-preview').inputValue(), expected);
  assert.equal(await frame.locator('.report-preview').getAttribute('readonly'), '');
  await frame.getByRole('button', { name: 'Copy diagnostics', exact: true }).click();
  await frame.getByText('Copy failed. Select the diagnostics above and copy them manually.', { exact: true }).waitFor();
  await frame.getByRole('button', { name: 'Report a bug', exact: true }).click();
  await frame.getByText('Could not open GitHub. Copy the address below into your browser.', { exact: true }).waitFor();
  assert.equal(await frame.locator('.report-url').textContent(), fixed);
  assert.deepEqual(await page.evaluate(() => window.reportCalls), [
    { type: 'clipboard-write', payload: { text: expected } },
    { type: 'open-url', payload: { url: fixed } },
  ]);
  assert.equal(await page.evaluate(() => window.serviceCalls.length), requests);
  assert.equal(await frame.locator('html').evaluate(el => el.scrollWidth > el.clientWidth), false);
  await frame.locator('.report-preview').evaluate(el => el.select());
  assert.equal(await frame.locator('.report-preview').evaluate(el => el.value.slice(el.selectionStart, el.selectionEnd)), expected);
  await page.screenshot({ path: join(artifacts, 'en-260-dark.png'), fullPage: true });
  await frame.getByRole('button', { name: 'Refresh', exact: true }).click();
  await frame.locator('[data-focus="refresh"]:not(:disabled)').waitFor();
  await frame.getByText('Copy failed. Select the diagnostics above and copy them manually.', { exact: true }).waitFor();
  assert.equal(await frame.locator('.report-manual').isVisible(), true);

  await page.goto(base + '?fixture=grant&locale=en&bridgefail=1&bridgeDelay=1');
  await frame.locator('.notice').waitFor();
  await frame.getByRole('button', { name: 'Report a bug', exact: true }).click();
  await frame.getByRole('button', { name: 'Refresh', exact: true }).click();
  await frame.getByText('Could not open GitHub. Copy the address below into your browser.', { exact: true }).waitFor();
  assert.equal(await frame.locator('.report-manual').isVisible(), true);

  await page.goto(base + '?locale=fr&width=260&serviceerror=SQLITE_UNAVAILABLE');
  await frame.locator('.notice').filter({ hasText: 'SQLITE_UNAVAILABLE' }).waitFor();
  assert.equal((await frame.locator('.notice').textContent()).includes('sqlite3'), false);
  await frame.locator('.report-diagnostics summary').click();
  assert.equal(await frame.locator('.report-preview').inputValue(), 'surface: panel\nview: compact\nlanguage: fr\nerror: SQLITE_UNAVAILABLE');
  await frame.getByRole('button', { name: 'Copier le diagnostic', exact: true }).click();
  await frame.getByText('Diagnostic copié. Relisez-le avant de le partager.', { exact: true }).waitFor();
  assert.equal(await frame.locator('html').evaluate(el => el.scrollWidth > el.clientWidth), false);
  await page.screenshot({ path: join(artifacts, 'fr-260-light.png'), fullPage: true });

  await page.goto(base + '?serviceerror=DATABASE_SYNTHETIC_SECRET&locale=en');
  await frame.locator('.notice').waitFor();
  await frame.locator('.report-diagnostics summary').click();
  assert.equal(await frame.locator('.report-preview').inputValue(), 'surface: panel\nview: compact\nlanguage: en\nerror: unknown');

  await page.goto(base + '?surface=status&fixture=grant&locale=en');
  await frame.locator('.notice').filter({ hasText: 'NOT_GRANTED' }).waitFor();
  assert.equal(await frame.locator('.bug-report').count(), 0);

  await page.goto(base + '?fixture=confirm&locale=en');
  await frame.locator('.act').waitFor();
  await frame.getByRole('button', { name: 'Display settings', exact: true }).click();
  const limit = frame.locator('#sidebar-account-limit');
  const input = await limit.elementHandle();
  await limit.fill('7');
  await frame.locator('.report-diagnostics summary').click();
  await frame.getByRole('button', { name: 'Copy diagnostics', exact: true }).click();
  await frame.getByText('Diagnostics copied. Review them before sharing.', { exact: true }).waitFor();
  assert.equal(await limit.inputValue(), '7');
  assert.equal(await input.evaluate(el => el === document.querySelector('#sidebar-account-limit')), true);
  await frame.locator('.act').click();
  const confirmation = await frame.locator('.confirmation').elementHandle();
  const before = await page.evaluate(() => window.serviceCalls.length);
  await frame.getByRole('button', { name: 'Copy diagnostics', exact: true }).click();
  await frame.getByRole('button', { name: 'Report a bug', exact: true }).click();
  assert.equal(await confirmation.evaluate(el => el === document.querySelector('.confirmation')), true);
  assert.equal(await frame.locator('[data-focus="refresh"]').isDisabled(), true);
  assert.equal(await page.evaluate(() => window.serviceCalls.length), before);
  assert.equal(await page.evaluate(() => window.serviceCalls.filter(call => call.method === 'POST').length), 0);

  for (const uncertain of [true, false]) {
    await page.goto(base + '?fixture=confirm&locale=en' + (uncertain ? '&result=unknown' : ''));
    await frame.locator('.act').waitFor();
    await page.locator('#exercise').click();
    await page.getByText('PASS: cancel focus, host update, Escape, one synthetic POST, locked action', { exact: true }).waitFor();
    await frame.locator('.report-diagnostics').evaluate(el => el.open = true);
    assert.equal(await frame.locator('.report-preview').inputValue(),
      'surface: panel\nview: compact\nlanguage: en\nerror: ' + (uncertain ? 'REDEMPTION_UNKNOWN' : 'unknown'));
    await frame.getByRole('button', { name: 'Copy diagnostics', exact: true }).click();
    await frame.getByText('Diagnostics copied. Review them before sharing.', { exact: true }).waitFor();
    assert.equal(await frame.locator('[data-focus^="redeem:"]').isDisabled(), true);
    assert.equal(await page.evaluate(() => window.serviceCalls.filter(call => call.method === 'POST').length), 1);
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: report panel, service denial, exact URL/copy, manual fallbacks, privacy, EN/FR, narrow layout, settings and consumption guards. Screenshots: ${artifacts}`);
} finally {
  await browser.close();
}
