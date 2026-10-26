// Browser evidence against public deployments. Reads React refs; input uses Chromium touch events.
const { chromium } = require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const output = __dirname;
const selected = process.argv[2];
assert.ok(!selected || ['snack', 'vercel'].includes(selected));
const previousPath = path.join(output, 'published-runtime-results.json');
const results = selected && fs.existsSync(previousPath) ? JSON.parse(fs.readFileSync(previousPath, 'utf8')).filter(r => r.label !== selected) : [];
function record(label, data) {
  results.push({ label, ...data });
  fs.writeFileSync(path.join(output, 'published-runtime-results.json'), JSON.stringify(results, null, 2));
  console.log(label, JSON.stringify(data));
}
async function instrument(page) {
  await page.evaluate(() => {
    const e = [...document.querySelectorAll('[aria-label^="Área do jogo"]')].find(e => !e.closest('[aria-hidden="true"]'));
    let f = e[Object.keys(e).find(k => k.startsWith('__reactFiber'))];
    while (f) {
      const a = []; let h = f.memoizedState;
      while (h && typeof h === 'object' && 'memoizedState' in h) { a.push(h.memoizedState); h = h.next; }
      const i = a.findIndex(h => h && typeof h === 'object' && ['READY', 'PLAYING', 'GAME_OVER'].includes(h.current));
      if (i >= 0 && Array.isArray(a[i + 5]?.current) && typeof a[i + 1]?.current === 'number') {
        window.readPublicFlight = () => ({ status: a[i].current, y: a[i + 1].current, velocity: a[i + 2].current, score: a[i + 3].current, obstacles: a[i + 5].current, raf: a[i + 6].current, elapsed: a[i + 8].current });
        return;
      }
      f = f.return;
    }
    throw new Error('Could not locate read-only gameplay refs');
  });
}
async function audit(browser, kind) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true, deviceScaleFactor: 1 });
  let page = await context.newPage();
  const url = kind === 'snack' ? 'https://snack.expo.dev/@wellingtonsp.de/cherry-flight' : 'https://cherry-flight.vercel.app';
  console.log('opening', kind, url);
  if (kind === 'snack') {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Web', exact: true }).waitFor();
    const popupPromise = page.waitForEvent('popup');
    await page.locator('button._1tbb1yyj').click();
    page = await popupPromise;
    await page.setViewportSize({ width: 844, height: 390 });
  } else {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto(url);
  }
  await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).waitFor({ timeout: 90000 });
  await page.bringToFront();
  console.log(kind, 'environment', JSON.stringify(await page.evaluate(() => ({ visibility: document.visibilityState, width: innerWidth, height: innerHeight }))));
  await page.waitForTimeout(900);
  assert.ok((await page.locator('body').innerText()).includes('Ajude a Cherry'));
  assert.ok(!(await page.locator('body').innerText()).includes('Cherri'));
  await page.screenshot({ path: path.join(output, `published-${kind}-home.png`) });
  await page.getByRole('button', { name: 'Ver instruções de como jogar', exact: true }).click();
  assert.ok((await page.locator('body').innerText()).includes('Tap to make Cherry jump'));
  await page.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).click();
  await page.getByRole('button', { name: 'Ver créditos acadêmicos da FATEC', exact: true }).click();
  const disclaimer = page.getByText('Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.', { exact: true });
  await disclaimer.scrollIntoViewIfNeeded();
  assert.ok(await disclaimer.isVisible());
  await page.getByRole('button', { name: 'Jogar Cherry Bloom', exact: true }).click();
  await instrument(page);
  const cdp = await context.newCDPSession(page);
  const tap = async () => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 500, y: 220 }] });
    await page.waitForTimeout(10);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  const timeline = [];
  const attempts = [];
  let state;
  for (let attempt = 1; attempt <= 3; attempt++) {
    await tap();
    await page.evaluate(() => {
      const field = [...document.querySelectorAll('[aria-label^="Área do jogo"]')].find(e => !e.closest('[aria-hidden="true"]'));
      window.publicAutomatedTouchCount = 0;
      window.publicFlightController = setInterval(() => {
        const s = readPublicFlight();
        if (s.status !== 'PLAYING') return;
        const pair = s.obstacles.filter(p => p.x + p.width >= 225).sort((a, b) => a.x - b.x)[0];
        if (pair && s.velocity > 0 && s.y > pair.gapY + 85) {
          const touch = new Touch({ identifier: 0, target: field, clientX: 500, clientY: 220, pageX: 500, pageY: 220 });
          field.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [touch], targetTouches: [touch], changedTouches: [touch] }));
          field.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true, touches: [], targetTouches: [], changedTouches: [touch] }));
          window.publicAutomatedTouchCount++;
        }
      }, 16);
    });
    const started = Date.now();
    let previous = -1;
    while (Date.now() - started < 240000) {
    state = await page.evaluate(() => readPublicFlight());
    if (state.score !== previous) {
      previous = state.score; timeline.push({ attempt, score: state.score, elapsed: state.elapsed, y: state.y });
      console.log(kind, 'score', state.score);
      if ([10, 20, 30].includes(state.score)) await page.screenshot({ path: path.join(output, `published-${kind}-score-${state.score}.png`) });
    }
    if (state.status !== 'PLAYING' || state.score >= 30) break;
    await page.waitForTimeout(150);
    }
    await page.evaluate(() => clearInterval(publicFlightController));
    attempts.push({ attempt, score: state.score, end: state.status });
    if (state.score >= 30) break;
    console.log(kind, 'automated player lost', JSON.stringify(attempts.at(-1)));
    await page.getByRole('button', { name: 'Jogar novamente', exact: true }).click();
  }
  assert.ok(state.score >= 30, kind + ' did not reach 30 points: ' + JSON.stringify(state));
  await page.getByRole('heading', { name: 'GAME OVER', exact: true }).waitFor({ timeout: 5000 });
  for (let i = 0; i < 5; i++) {
    await page.getByRole('button', { name: 'Jogar novamente', exact: true }).click();
    const reset = await page.evaluate(() => readPublicFlight());
    assert.equal(reset.status, 'READY'); assert.equal(reset.score, 0); assert.equal(reset.velocity, 0);
    assert.ok(reset.obstacles.every(p => !p.scored));
    await tap();
    await page.getByRole('heading', { name: 'GAME OVER', exact: true }).waitFor({ timeout: 5000 });
  }
  await page.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).last().click();
  await page.keyboard.press('Space');
  await page.waitForTimeout(60);
  assert.equal((await page.evaluate(() => readPublicFlight())).raf, null);
  const pwa = {};
  if (kind === 'vercel') {
    const registration = await page.evaluate(async () => {
      const r = await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(new Error('Service worker not ready')), 7000))]);
      return { scope: r.scope, state: r.active?.state };
    });
    pwa.registration = registration;
    await page.reload();
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).waitFor();
    await page.waitForTimeout(700);
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).click();
    await tap();
    await page.getByRole('heading', { name: 'GAME OVER', exact: true }).waitFor({ timeout: 5000 });
    pwa.offlineGameplay = true;
    await context.setOffline(false);
  }
  record(kind, { url, state: 'PASS', sdkVersion: '54.0.0', score: state.score, timeline, attempts, restarts: 5, routes: ['Welcome', 'Instructions', 'Credits', 'Game'], input: 'Trusted Chromium touch 10ms for start/restarts; DOM TouchEvents for the automated flight, without writes to game state', pwa });
  await context.close();
}
async function main() {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try { for (const kind of selected ? [selected] : ['snack', 'vercel']) { try { await audit(browser, kind); } catch (error) { record(kind, { state: 'FAIL', message: error.message }); process.exitCode = 1; } } }
  finally { await browser.close(); }
}
main().catch(error => { record('error', { message: error.message }); process.exitCode = 1; });
