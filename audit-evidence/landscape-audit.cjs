const { chromium } = require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const results = [];
async function inViewport(locator, page) {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  return box && box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width + 1 && box.y + box.height <= viewport.height + 1;
}
const record = (name, value) => { results.push({ name, ...value }); fs.writeFileSync(path.join(__dirname, 'landscape-results.json'), JSON.stringify(results, null, 2)); console.log(name, JSON.stringify(value)); };
async function instrument(page) {
  await page.evaluate(() => {
    const element = [...document.querySelectorAll('[aria-label^="Área do jogo"]')].find(e => !e.closest('[aria-hidden="true"]'));
    let fiber = element[Object.keys(element).find(k => k.startsWith('__reactFiber'))];
    while (fiber && fiber.type?.name !== 'Tela3') fiber = fiber.return;
    window.landscapeState = () => {
      const hooks = []; let hook = fiber.memoizedState;
      while (hook) { hooks.push(hook.memoizedState); hook = hook.next; }
      const base = hooks.findIndex(h => h && typeof h === 'object' && typeof h.current === 'string' && ['READY', 'PLAYING', 'GAME_OVER'].includes(h.current));
      return { status: hooks[base].current, y: hooks[base + 1].current, velocity: hooks[base + 2].current, score: hooks[base + 3].current, raf: hooks[base + 6].current, obstacles: hooks[base + 5].current, field: element.getBoundingClientRect().toJSON() };
    };
  });
}
async function main() {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    for (const [sdk, url] of [['sdk54', 'http://localhost:8099'], ['sdk58', 'http://localhost:8098']]) {
      for (const [width, height] of [[568, 320], [844, 390], [1366, 768]]) {
        const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 1000, hasTouch: true, deviceScaleFactor: 1 });
        const page = await context.newPage();
        await page.goto(url);
        await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).waitFor({ timeout: 60000 });
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(__dirname, `${sdk}-landscape-home-${width}.png`) });
        record(`${sdk}-home-bounds-${width}`, { credits: await page.getByRole('button', { name: 'Ver créditos acadêmicos da FATEC', exact: true }).boundingBox() });
        assert.ok(await inViewport(page.getByRole('button', { name: 'Ver créditos acadêmicos da FATEC', exact: true }), page));
        await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).click();
        await instrument(page);
        const before = await page.evaluate(() => landscapeState());
        assert.equal(before.field.width, width); assert.equal(before.field.height, height);
        const cdp = await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: width * 0.5, y: height * 0.6 }] });
        await page.waitForTimeout(10);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForTimeout(60);
        const playing = await page.evaluate(() => landscapeState());
        assert.equal(playing.status, 'PLAYING'); assert.ok(playing.velocity < 0); assert.ok(playing.y < before.y);
        await page.screenshot({ path: path.join(__dirname, `${sdk}-landscape-game-${width}.png`) });
        await page.getByRole('heading', { name: 'GAME OVER', exact: true }).waitFor({ timeout: 5000 });
        await page.waitForTimeout(350);
        const replay = page.getByRole('button', { name: 'Jogar novamente', exact: true });
        assert.ok(await inViewport(replay, page));
        await page.screenshot({ path: path.join(__dirname, `${sdk}-landscape-gameover-${width}.png`) });
        await replay.click();
        await page.waitForFunction(() => {
          const e = [...document.querySelectorAll('[aria-label^="Área do jogo"]')].find(e => !e.closest('[aria-hidden="true"]'));
          const r = e?.getBoundingClientRect();
          return r && r.x === 0 && r.y === 0;
        }, undefined, { timeout: 1500 });
        const reset = await page.evaluate(() => landscapeState());
        assert.equal(reset.status, 'READY'); assert.equal(reset.velocity, 0); assert.equal(reset.score, 0);
        assert.equal(reset.field.x, 0); assert.equal(reset.field.y, 0);
        record(`${sdk}-${width}x${height}`, { before, playing, reset });
        if (width === 844) {
          await page.keyboard.press('Space');
          await page.setViewportSize({ width: 960, height: 420 });
          await page.waitForTimeout(100);
          const resized = await page.evaluate(() => landscapeState());
          assert.equal(resized.status, 'READY'); assert.equal(resized.raf, null); assert.equal(resized.field.width, 960);
          await page.keyboard.press('Space');
          await page.waitForTimeout(60);
          assert.equal((await page.evaluate(() => landscapeState())).status, 'PLAYING');
          await page.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).click();
          await page.keyboard.press('Space');
          await page.waitForTimeout(80);
          const hidden = await page.evaluate(() => landscapeState());
          assert.equal(hidden.raf, null); assert.equal(hidden.status, 'READY');
          record(`${sdk}-resize-and-home`, { resized, hidden });
          await page.setViewportSize({ width: 390, height: 844 });
          await page.getByRole('heading', { name: 'Gire o dispositivo', exact: true }).waitFor();
          assert.equal(await page.locator('[aria-label^="Área do jogo"]').count(), 0);
          await page.screenshot({ path: path.join(__dirname, `${sdk}-portrait-rotation-notice.png`) });
          await page.setViewportSize({ width: 844, height: 390 });
          await page.getByRole('button', { name: 'Ver instruções de como jogar', exact: true }).click();
          await page.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).scrollIntoViewIfNeeded();
          await page.screenshot({ path: path.join(__dirname, `${sdk}-landscape-instructions.png`) });
          await page.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).click();
          await page.getByRole('button', { name: 'Ver créditos acadêmicos da FATEC', exact: true }).click();
          const disclaimer = page.getByText('Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.', { exact: true });
          await disclaimer.scrollIntoViewIfNeeded();
          assert.ok(await inViewport(disclaimer, page));
          await page.screenshot({ path: path.join(__dirname, `${sdk}-landscape-credits.png`) });
        }
        await context.close();
      }
    }
  } finally { await browser.close(); }
}
main().catch(e => { record('harness-error', { message: e.message, stack: e.stack }); process.exitCode = 1; });
