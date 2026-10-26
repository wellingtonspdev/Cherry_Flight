// Runs real input against the horizontal SDK54 app; never changes position, score or obstacles.
const { chromium } = require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
async function main() {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto('http://localhost:8099');
    await page.getByRole('button', { name: 'Iniciar o jogo Cherry Bloom', exact: true }).click();
    await page.waitForTimeout(80);
    await page.evaluate(() => {
      const e = document.querySelector('[aria-label^="Área do jogo"]');
      let f = e[Object.keys(e).find(k => k.startsWith('__reactFiber'))];
      while (f && f.type?.name !== 'Tela3') f = f.return;
      window.readFlight = () => {
        const a = []; let h = f.memoizedState; while (h) { a.push(h.memoizedState); h = h.next; }
        const i = a.findIndex(h => h && typeof h === 'object' && typeof h.current === 'string' && ['READY', 'PLAYING', 'GAME_OVER'].includes(h.current));
        return { status: a[i].current, y: a[i + 1].current, velocity: a[i + 2].current, score: a[i + 3].current, elapsed: a[i + 8].current, obstacles: a[i + 5].current };
      };
    });
    const cdp = await context.newCDPSession(page);
    const tap = async () => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 500, y: 220 }] });
      await page.waitForTimeout(10);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    await tap();
    const timeline = [];
    const started = Date.now();
    let previous = -1;
    let state;
    while (Date.now() - started < 80000) {
      state = await page.evaluate(() => readFlight());
      if (state.score !== previous) {
        previous = state.score; timeline.push({ ...state });
        fs.writeFileSync(path.join(__dirname, 'landscape-playthrough.json'), JSON.stringify({ timeline, state }, null, 2));
        console.log('score', state.score, 'elapsed', state.elapsed);
        if ([10, 20, 30].includes(state.score)) await page.screenshot({ path: path.join(__dirname, 'sdk54-landscape-natural-score-' + state.score + '.png') });
      }
      if (state.status !== 'PLAYING' || state.score >= 30) break;
      const pair = state.obstacles.filter(p => p.x + p.width >= 225).sort((a, b) => a.x - b.x)[0];
      if (pair && state.velocity > 0 && state.y > pair.gapY + 90) await tap();
      await page.waitForTimeout(12);
    }
    assert.ok(state.score >= 30, 'Real-input playthrough must reach 30 points: ' + JSON.stringify(state));
    await page.getByRole('heading', { name: 'GAME OVER', exact: true }).waitFor({ timeout: 5000 });
    const restarts = [];
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: 'Jogar novamente', exact: true }).click();
      const reset = await page.evaluate(() => readFlight());
      assert.equal(reset.status, 'READY'); assert.equal(reset.score, 0); assert.equal(reset.velocity, 0);
      assert.ok(reset.obstacles.every(p => !p.scored));
      await tap();
      await page.waitForTimeout(35);
      assert.equal((await page.evaluate(() => readFlight())).status, 'PLAYING');
      await page.getByRole('heading', { name: 'GAME OVER', exact: true }).waitFor({ timeout: 5000 });
      restarts.push(reset);
    }
    fs.writeFileSync(path.join(__dirname, 'landscape-playthrough.json'), JSON.stringify({ timeline, state, restarts }, null, 2));
    console.log('PASS: 30 points from real touch input, all four phases, five consecutive restarts');
  } finally { await browser.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
