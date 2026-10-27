const { chromium } = require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const final = process.argv.includes('--final');
const outputFile = name => path.join(__dirname, final ? name.replace(/^snack-/, 'snack-final-') : name);
async function main() {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
    let page = await context.newPage();
    const errors = []; const editorErrors = []; page.on('pageerror', error => editorErrors.push({message:error.message,stack:error.stack}));
    await page.goto((final ? 'https://snack.expo.dev/@wellingtonsp.de/cherry-flight' : 'https://snack.expo.dev/@wellingtonsp.de/cherry-flight-v2-qa'), {waitUntil:'domcontentloaded'});
    await page.getByRole('button',{name:'Web',exact:true}).waitFor();
    const popup = page.waitForEvent('popup');
    await page.locator('button._1tbb1yyj').click();
    page = await popup; await page.setViewportSize({width:844,height:390}); await page.bringToFront();
    page.on('pageerror',error=>errors.push({message:error.message,stack:error.stack}));
    await page.getByRole('button',{name:'Iniciar o jogo Cherry Bloom',exact:true}).waitFor({timeout:90000});
    await page.getByRole('button',{name:'Ver instruções de como jogar',exact:true}).click();
    await page.getByRole('button',{name:'Voltar para a tela inicial',exact:true}).click();
    await page.getByRole('button',{name:'Ver créditos acadêmicos da FATEC',exact:true}).click();
    await page.getByText('Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.',{exact:true}).scrollIntoViewIfNeeded();
    await page.getByRole('button',{name:'Voltar para a tela inicial',exact:true}).click();
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).click();
    await page.waitForFunction(() => {
      if (window.__CHERRY_BLOOM_V2__?.snapshot()) return true;
      const element = document.querySelector('[aria-label^="Área do jogo"]');
      if (!element) return false;
      let fiber = element[Object.keys(element).find(k => k.startsWith('__reactFiber'))];
      while (fiber) {
        const hooks = []; let hook = fiber.memoizedState;
        while (hook && typeof hook === 'object' && 'memoizedState' in hook) { hooks.push(hook.memoizedState); hook = hook.next; }
        const index = hooks.findIndex(h => h?.current?.player && Array.isArray(h.current.pairs) && typeof h.current.status === 'string');
        if (index >= 0) {
          const reference = hooks[index], raf = hooks[index + 1], diagnostic = hooks.find(h => typeof h?.current?.rootRenders === 'number');
          window.__CHERRY_BLOOM_V2__ = { snapshot: () => { const r = reference.current; return r ? { ...r, player: {...r.player}, pairs:r.pairs.map(p=>({...p})), future:r.future.map(p=>({...p,x:p.worldX-r.distance})), rafActive:raf.current !== null, diagnostics: {...diagnostic.current}, vectorStats:null } : null; } };
          return true;
        }
        fiber = fiber.return;
      }
      return false;
    }, undefined, {timeout:90000});
    await page.waitForFunction(() => window.__CHERRY_BLOOM_V2__?.snapshot()?.status === 'READY');
    const before = await page.evaluate(() => __CHERRY_BLOOM_V2__.snapshot());
    assert.equal(before.pairs.length, 4); assert.equal(before.future.length, 3);
    assert.ok(before.future.every(p => p.x > 844));
    await page.screenshot({ path: outputFile('snack-ready.png') });
    const cdp = await context.newCDPSession(page);
    const attempts = []; let after;
    for(let attempt=0; attempt<4; attempt++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 500, y: 220 }] });
    await page.waitForTimeout(10);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(50);
    after = await page.evaluate(() => __CHERRY_BLOOM_V2__.snapshot());
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
          window.dispatchEvent(new KeyboardEvent('keydown', {bubbles:true, code:'Space'}));
        }
      }, 16);
    });
    await page.waitForFunction(() => ['GAME_OVER', 'LEVEL_COMPLETE'].includes(__CHERRY_BLOOM_V2__?.snapshot()?.status), undefined, { timeout: 40000 });
    await page.evaluate(() => clearInterval(control));
    const candidate = await page.evaluate(() => __CHERRY_BLOOM_V2__.snapshot());
    attempts.push({status:candidate.status,score:candidate.score,collision:candidate.collision});
    if(candidate.status==='LEVEL_COMPLETE') break;
    await page.getByRole('button',{name:'Jogar novamente',exact:true}).click();
    await page.waitForFunction(()=>__CHERRY_BLOOM_V2__?.snapshot()?.status==='READY');
    }
    const end = await page.evaluate(() => __CHERRY_BLOOM_V2__.snapshot());
    const visible = end.metrics.filter(e => e.type === 'pair_visible');
    const preparedBeforeVisible = visible.every(e => end.metrics.some(p => p.type === 'pair_visual_prepared' && p.id === e.id && p.epoch === e.epoch && p.at <= e.at));
    const result = { before, after, end, preparedBeforeVisible, errors, editorErrors, attempts };
    fs.writeFileSync(outputFile('snack-runtime-results.json'), JSON.stringify(result, null, 2));
    await page.screenshot({ path: outputFile('snack-complete.png') });
    assert.equal(end.status, 'LEVEL_COMPLETE'); assert.equal(end.score, 8);
    assert.equal(end.rafActive, false); assert.equal(end.diagnostics.pairMounts, 4);
    if (end.vectorStats) assert.equal(end.vectorStats.parsesDuringPlay, 0); assert.ok(preparedBeforeVisible);
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
    await page.screenshot({path: outputFile('snack-level-select.png')});
    await page.getByRole('button', { name: '← HOME', exact: true }).click();
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).click();
    await page.getByText('LEVEL 2 · 10 pontos · Toque ou use ESPAÇO', {exact:true}).waitFor();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('@cherry_bloom_progress_v2')));
    assert.equal(saved.lastPlayedLevel, 2); assert.equal(saved.highestUnlockedLevel, 2);
    assert.ok(!('velocity' in saved));
    fs.writeFileSync(outputFile('snack-checkpoint-restored.json'), JSON.stringify({saved,errors}, null, 2));
    console.log(JSON.stringify({ score: end.score, status: end.status, diagnostics: end.diagnostics, parsesDuringPlay: end.vectorStats?.parsesDuringPlay, preparedBeforeVisible }));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });
