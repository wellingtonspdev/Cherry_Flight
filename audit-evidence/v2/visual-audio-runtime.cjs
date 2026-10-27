const {chromium}=require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const config=JSON.parse(fs.readFileSync('docs/LEVEL_CONFIG_V2.json','utf8'));
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const results=[];
try {for(const size of [{width:667,height:375},{width:844,height:390},{width:1366,height:768}]) {
 const context=await browser.newContext({viewport:size,hasTouch:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(data=>{localStorage.setItem('@cherry_bloom_progress_v2',JSON.stringify(data));},{schemaVersion:2,lastPlayedLevel:1,levelResults:Object.fromEntries(config.levels.map(l=>[l.id,{bestScore:l.targetScore,completed:true}])),settings:{music:true,sfx:true,haptics:false}});
 await page.goto('http://localhost:8105');
 for(const id of [1,4,7,10]) {
  await page.getByRole('button',{name:'LEVEL SELECT',exact:true}).click();
  await page.getByRole('button',{name:`Level ${id}. Concluído`,exact:true}).click();
  await page.waitForFunction(()=>window.__CHERRY_BLOOM_V2__?.snapshot()?.status==='READY');
  await page.waitForTimeout(550);
  const before=await page.evaluate(()=>__CHERRY_BLOOM_V2__.snapshot());assert.equal(before.levelId,id);
  await page.screenshot({path:path.join(__dirname,`visual-${size.width}-level-${id}.png`)});
  await page.keyboard.press('Space');await page.waitForTimeout(180);await page.keyboard.press('KeyP');
  const paused=await page.evaluate(()=>__CHERRY_BLOOM_V2__.snapshot());assert.equal(paused.status,'PAUSED');assert.equal(paused.rafActive,false);
  await page.getByRole('button',{name:'Retomar partida',exact:true}).last().click();
  await page.waitForTimeout(120);await page.keyboard.press('KeyP');
  const resumed=await page.evaluate(()=>__CHERRY_BLOOM_V2__.snapshot());assert.ok(resumed.elapsed>paused.elapsed);assert.equal(resumed.vectorStats.parsesDuringPlay,0);
  results.push({size,level:id,before:before.audio,paused:paused.audio,resumed:resumed.audio,diagnostics:resumed.diagnostics});
  await page.getByRole('button',{name:'Voltar para a tela inicial',exact:true}).last().click();
  await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>typeof window.__CHERRY_BLOOM_V2__),'undefined');
 }
 await page.getByRole('button',{name:'SETTINGS',exact:true}).click();
 await page.getByRole('switch',{name:'Music',exact:true}).uncheck();
 await page.getByRole('switch',{name:'SFX',exact:true}).uncheck();
 await page.waitForTimeout(150);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('@cherry_bloom_progress_v2')));assert.equal(saved.settings.music,false);assert.equal(saved.settings.sfx,false);
 await page.screenshot({path:path.join(__dirname,`settings-${size.width}.png`)});
 assert.equal(errors.length,0,errors.join('\n'));await context.close();
}
fs.writeFileSync(path.join(__dirname,'visual-audio-runtime.json'),JSON.stringify({fixture:'All-level completion storage fixture; does not prove twelve natural completions.',results},null,2));console.log(JSON.stringify(results.map(r=>({size:r.size.width,level:r.level,music:r.before.music,paused:r.paused.music,resumed:r.resumed.music}))));
}finally{await browser.close();}})().catch(e=>{console.error(e.stack);process.exitCode=1});

