const { chromium } = require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
async function main() {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://localhost:8106');
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).click();
    await page.waitForFunction(() => window.__CHERRY_BLOOM_V2__?.snapshot()?.status === 'READY');
    const before = await page.evaluate(() => __CHERRY_BLOOM_V2__.snapshot());
    assert.equal(before.pairs.length, 4); assert.equal(before.future.length, 3);
    assert.ok(before.future.every(p => p.x > 844));
    await page.screenshot({ path: path.join(__dirname, 'sdk57-ready.png') });
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 500, y: 220 }] });
    await page.waitForTimeout(10);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(50);
    const after = await page.evaluate(() => __CHERRY_BLOOM_V2__.snapshot());
    assert.equal(after.status, 'PLAYING'); assert.ok(after.player.y < before.player.y);
    await page.evaluate(() => {
      window.control = setInterval(() => {
        const s = __CHERRY_BLOOM_V2__.snapshot();
        if (s.status !== 'PLAYING') return;
        const pair = s.pairs.filter(p => p.x + p.width >= s.player.x + 6).sort((a, b) => a.x - b.x)[0];
        const rise = 390 * 390 / (2 * 1050);
        const trigger = pair.gapY - 6 + rise + (pair.gapSize - 36 - rise) / 2 - 6;
        if (s.player.velocity > 0 && s.player.y > trigger) {
          const field = document.querySelector('[aria-label^="Área do jogo"]');
          field.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0, buttons: 1, clientX: 500, clientY: 220 }));
          field.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0, buttons: 0, clientX: 500, clientY: 220 }));
        }
      }, 16);
    });
    await page.waitForFunction(() => ['GAME_OVER', 'LEVEL_COMPLETE'].includes(__CHERRY_BLOOM_V2__?.snapshot()?.status), undefined, { timeout: 40000 });
    await page.evaluate(() => clearInterval(control));
    const end = await page.evaluate(() => __CHERRY_BLOOM_V2__.snapshot());
    const visible = end.metrics.filter(e => e.type === 'pair_visible');
    const preparedBeforeVisible = visible.every(e => end.metrics.some(p => p.type === 'pair_visual_prepared' && p.id === e.id && p.epoch === e.epoch && p.at <= e.at));
    const result = { before, after, end, preparedBeforeVisible, errors };
    fs.writeFileSync(path.join(__dirname, 'sdk57-runtime-results.json'), JSON.stringify(result, null, 2));
    await page.screenshot({ path: path.join(__dirname, 'sdk57-complete.png') });
    assert.equal(end.status, 'LEVEL_COMPLETE'); assert.equal(end.score, 8);
    assert.equal(end.rafActive, false); assert.equal(end.diagnostics.pairMounts, 4);
    assert.equal(end.vectorStats.parsesDuringPlay, 0); assert.ok(preparedBeforeVisible);
    assert.ok(end.diagnostics.rootRenders < end.diagnostics.frames / 5);
    assert.equal(errors.length, 0);
    await page.getByText('Checkpoint salvo no início do próximo nível.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Jogar próximo nível', exact: true }).click();
    await page.waitForFunction(() => __CHERRY_BLOOM_V2__?.snapshot()?.status === 'READY' && __CHERRY_BLOOM_V2__?.snapshot()?.levelId === 2);
    await page.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).click();
    await page.reload();
    await page.getByRole('button', { name: 'LEVEL SELECT', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Level 3. Bloqueado', exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Level 1. Concluído', exact: true }).isDisabled(), false);
    await page.screenshot({path: path.join(__dirname, 'sdk57-level-select.png')});
    await page.getByRole('button', { name: '← HOME', exact: true }).click();
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).click();
    await page.waitForFunction(() => __CHERRY_BLOOM_V2__?.snapshot()?.status === 'READY' && __CHERRY_BLOOM_V2__?.snapshot()?.levelId === 2);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('@cherry_bloom_progress_v2')));
    assert.equal(saved.lastPlayedLevel, 2); assert.equal(saved.highestUnlockedLevel, 2);
    assert.ok(!('velocity' in saved));
    fs.writeFileSync(path.join(__dirname, 'sdk57-checkpoint-restored.json'), JSON.stringify({saved,errors}, null, 2));
    console.log(JSON.stringify({ score: end.score, status: end.status, diagnostics: end.diagnostics, parsesDuringPlay: end.vectorStats.parsesDuringPlay, preparedBeforeVisible }));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
