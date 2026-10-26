// Public Snack verification. Reads and plays; never saves or edits project files.
const { chromium } = require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
async function main() {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    await page.goto('https://snack.expo.dev/7kDnJz_p3s3TVT4VDIrPE', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(12000);
    const frame = page.frames().find(f => f.url().includes('snack-runtime.eascdn.net'));
    assert.ok(frame, 'Snack runtime iframe must exist');
    const results = { url: page.url(), runtimeUrl: frame.url(), routes: [] };
    await frame.getByRole('button', { name: 'Ver instruções de como jogar' }).click();
    await frame.getByRole('heading', { name: 'HOW TO PLAY', exact: true }).waitFor();
    results.routes.push('Instructions');
    await frame.getByRole('button', { name: 'Voltar para a tela inicial', exact: true }).click();
    results.routes.push('Welcome');
    await frame.getByRole('button', { name: 'Ver créditos acadêmicos da FATEC' }).click();
    await frame.getByText('Wellington Siqueira Porto', { exact: true }).waitFor();
    results.routes.push('Credits');
    results.credits = await frame.locator('body').innerText();
    await frame.getByRole('button', { name: 'Jogar Cherry Bloom', exact: true }).click();
    results.routes.push('Game');
    const field = frame.getByRole('button', { name: 'Área do jogo Cherry Bloom. Toque para fazer a Cherri saltar.', exact: true }).last();
    await field.click({ delay: 10 });
    await page.waitForTimeout(150);
    results.afterQuickClick = await frame.locator('body').innerText();
    assert.ok(results.afterQuickClick.includes('TAP TO FLY'));
    await page.screenshot({ path: path.join(__dirname, 'snack-quick-click-fails.png') });
    await field.click({ delay: 100 });
    await page.waitForTimeout(150);
    results.afterLongPress = await frame.locator('body').innerText();
    assert.ok(!results.afterLongPress.includes('TAP TO FLY'));
    await frame.getByRole('heading', { name: 'GAME OVER', exact: true }).waitFor({ timeout: 5000 });
    results.gameOver = await frame.locator('body').innerText();
    await frame.getByRole('button', { name: 'Jogar novamente', exact: true }).click();
    results.replay = await frame.locator('body').innerText();
    assert.ok(results.replay.includes('TAP TO FLY'));
    await page.screenshot({ path: path.join(__dirname, 'snack-replay-ready.png') });
    fs.writeFileSync(path.join(__dirname, 'snack-results.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
