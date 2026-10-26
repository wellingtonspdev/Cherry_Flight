// Audit-only harness. No product source or dependencies are changed.
const { chromium } = require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = __dirname;
const evidence = [];
const record = (test, value) => { evidence.push({ test, ...value }); fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify(evidence, null, 2)); console.log(test, JSON.stringify(value)); };
async function main() {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto('http://localhost:8094');
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).waitFor();
    await page.waitForTimeout(1100);
    await page.screenshot({ path: path.join(output, 'sdk54-home-390.png') });
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).click();
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      const element = document.querySelector('[aria-label^="Área do jogo"]');
      window.auditHooks = () => {
        let fiber = element[Object.keys(element).find(key => key.startsWith('__reactFiber'))];
        while (fiber && fiber.type?.name !== 'Tela3') fiber = fiber.return;
        const values = []; let hook = fiber.memoizedState;
        while (hook) { values.push(hook); hook = hook.next; }
        return values;
      };
      window.auditState = () => {
        const h = auditHooks().map(hook => hook.memoizedState);
        return { status: h[8].current, y: h[9].current, velocity: h[10].current, score: h[11].current, raf: h[14].current, elapsed: h[16].current, tick: h[7], obstacles: h[13].current.map(pair => ({ ...pair })) };
      };
      window.auditCall = index => auditHooks()[index].memoizedState[0]();
      window.auditSetScore = score => { auditHooks()[3].queue.dispatch(score); auditHooks()[11].memoizedState.current = score; };
    });
    const state = () => page.evaluate(() => auditState());
    await page.screenshot({ path: path.join(output, 'sdk54-ready-390.png') });
    const session = await context.newCDPSession(page);
    async function touch(duration) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 400 }] });
      await page.waitForTimeout(duration);
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForTimeout(25);
    }
    await touch(10);
    const short = await state(); assert.equal(short.status, 'READY'); assert.equal(short.velocity, 0);
    record('trusted-touch-10ms-rejected', short);
    await touch(100);
    const long = await state(); assert.equal(long.status, 'PLAYING'); assert.ok(long.velocity < 0); assert.ok(long.y < short.y);
    record('trusted-touch-100ms-starts-and-moves', long);
    await page.getByRole('heading', { name: 'GAME OVER', exact: true }).waitFor({ timeout: 5000 });
    record('natural-ground-gameover', await state());
    await page.screenshot({ path: path.join(output, 'sdk54-gameover-390.png') });
    for (let i = 1; i <= 5; i++) {
      await page.getByRole('button', { name: 'Jogar novamente', exact: true }).click();
      const reset = await state(); assert.equal(reset.status, 'READY'); assert.equal(reset.score, 0); assert.equal(reset.velocity, 0); assert.equal(reset.obstacles.length, 3); assert.ok(reset.obstacles.every(p => !p.scored));
      await touch(90);
      assert.equal((await state()).status, 'PLAYING');
      await page.getByRole('heading', { name: 'GAME OVER', exact: true }).waitFor({ timeout: 5000 });
      record('restart-' + i, { reset, end: await state() });
    }
    await page.getByRole('button', { name: 'Jogar novamente', exact: true }).click();
    for (const score of [0, 10, 20, 30]) {
      await page.evaluate(score => auditSetScore(score), score);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(output, 'sdk54-phase-' + score + '-injected.png') });
      record('phase-render-injected-' + score, { text: await page.locator('body').innerText() });
    }
    // Remove obstacles only for a controlled lifecycle test, isolating resize from collisions.
    await page.evaluate(() => { auditCall(32); auditHooks()[13].memoizedState.current = []; auditCall(31); window.auditKeepAlive = setInterval(() => { const s = auditState(); if (s.status === 'PLAYING' && s.y > 230 && s.velocity > 0) auditCall(31); }, 20); });
    await page.waitForTimeout(100);
    const preResize = await state();
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(150);
    const resizeA = await state();
    await page.waitForTimeout(200);
    const resizeB = await state();
    await page.evaluate(() => clearInterval(auditKeepAlive));
    assert.equal(resizeA.status, 'PLAYING'); assert.equal(resizeA.raf, null); assert.equal(resizeA.y, resizeB.y);
    record('resize-freezes-playing-controlled', { preResize, resizeA, resizeB });
    await page.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).click();
    const homeBefore = await state();
    await page.keyboard.press('Space');
    await page.waitForTimeout(120);
    const homeAfter = await state();
    assert.equal(homeBefore.raf, null); assert.equal(homeAfter.status, 'PLAYING'); assert.notEqual(homeAfter.raf, null);
    record('home-space-restarts-hidden-game', { homeBefore, homeAfter, visible: await page.locator('body').innerText() });
    await page.evaluate(() => auditCall(23));
    await page.getByRole('button', { name: 'Ver instruções de como jogar', exact: true }).click();
    await page.screenshot({ path: path.join(output, 'sdk54-instructions-320.png') });
    await page.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, 'sdk54-instructions-bottom-320.png') });
    record('instructions-320-scroll', { horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), text: await page.locator('body').innerText() });
    await page.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).click();
    await page.getByRole('button', { name: 'Ver créditos acadêmicos da FATEC', exact: true }).click();
    const disclaimer = 'Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.';
    await page.getByText(disclaimer, { exact: true }).scrollIntoViewIfNeeded();
    assert.equal(await page.getByText(disclaimer, { exact: true }).innerText(), disclaimer);
    await page.screenshot({ path: path.join(output, 'sdk54-credits-320.png') });
    record('credits-exact-320', { horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), text: await page.locator('body').innerText() });
    const assets = await browser.newPage({ viewport: { width: 1400, height: 800 } });
    await assets.goto('file:///D:/Cherry_Flight/audit-evidence/sdk54/public/audit-assets.html');
    await assets.screenshot({ path: path.join(output, 'vector-and-icons.png'), fullPage: true });
  } finally { await browser.close(); }
}
main().catch(error => { record('harness-error', { message: error.message, stack: error.stack }); process.exitCode = 1; });
