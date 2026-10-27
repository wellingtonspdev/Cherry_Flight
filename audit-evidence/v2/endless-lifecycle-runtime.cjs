const {chromium}=require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const config=JSON.parse(fs.readFileSync('docs/LEVEL_CONFIG_V2.json','utf8'));
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true});await context.addInitScript(levels=>localStorage.setItem('@cherry_bloom_progress_v2',JSON.stringify({schemaVersion:2,lastPlayedLevel:12,levelResults:Object.fromEntries(levels.map(l=>[l.id,{completed:true,bestScore:l.targetScore}])),settings:{music:true,sfx:true,haptics:false}})),config.levels);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:8105');await page.getByRole('button',{name:'LEVEL SELECT',exact:true}).click();await page.getByRole('button',{name:/ENDLESS BLOOM/}).click();await page.waitForFunction(()=>window.__CHERRY_BLOOM_V2__?.snapshot()?.status==='READY');
 const before=await page.evaluate(()=>__CHERRY_BLOOM_V2__.snapshot());assert.equal(before.endless,true);assert.equal(before.pairs.length,5);assert.equal(new Set(before.vectorStats.chapters.map(c=>c.biome)).size,4);
 const transforms=()=>page.evaluate(()=>{const svg=document.querySelector('[aria-label^="Área do jogo"] svg[width="64"]');const result=[];for(let e=svg;e&&result.length<5;e=e.parentElement)result.push(getComputedStyle(e).transform);return result;});
 const visualBefore=await transforms();await page.keyboard.press('Space');await page.waitForTimeout(110);const visualAfter=await transforms();assert.notDeepEqual(visualAfter,visualBefore);
 await page.waitForFunction(()=>__CHERRY_BLOOM_V2__?.snapshot()?.status==='GAME_OVER');
 const retries=[];
 for(let retry=0;retry<3;retry++) {
  await page.getByRole('button',{name:'Jogar novamente',exact:true}).click();
  await page.waitForFunction(()=>__CHERRY_BLOOM_V2__?.snapshot()?.status==='READY');
  await page.getByText('TAP TO FLY',{exact:true}).waitFor();
  const reset=await page.evaluate(()=>__CHERRY_BLOOM_V2__.snapshot());
  assert.equal(reset.score,0);assert.equal(reset.elapsed,0);assert.equal(reset.player.velocity,0);assert.equal(reset.player.y,153);assert.equal(reset.pairs[0].x,844*1.1);assert.equal(reset.future.length,3);retries.push({score:reset.score,y:reset.player.y,velocity:reset.player.velocity,elapsed:reset.elapsed,pairs:reset.pairs.length});
  await page.evaluate(()=>{window.retryKeyEvents=[];for(const type of ['keydown','keyup','click']) document.addEventListener(type,e=>retryKeyEvents.push({type,target:e.target.getAttribute('aria-label'),code:e.code,status:__CHERRY_BLOOM_V2__?.snapshot()?.status}),{capture:true,once:true});});
  await page.keyboard.press('Space');
  await page.waitForTimeout(120);const probe=await page.evaluate(()=>({status:__CHERRY_BLOOM_V2__?.snapshot()?.status,inputs:__CHERRY_BLOOM_V2__?.snapshot()?.diagnostics.inputCount,events:retryKeyEvents,focus:document.activeElement?.outerHTML.slice(0,120)}));console.log('retry',retry,JSON.stringify(probe));fs.writeFileSync(path.join(__dirname,'retry-key-probe.json'),JSON.stringify(probe,null,2));
  if(retry<2) await page.waitForFunction(()=>__CHERRY_BLOOM_V2__?.snapshot()?.status==='GAME_OVER');
 }
 await page.waitForTimeout(80);
 await page.keyboard.press('KeyP');const paused=await page.evaluate(()=>__CHERRY_BLOOM_V2__.snapshot());assert.equal(paused.status,'PAUSED');
 await page.setViewportSize({width:960,height:540});await page.waitForFunction(()=>__CHERRY_BLOOM_V2__?.snapshot()?.status==='READY'&&__CHERRY_BLOOM_V2__.snapshot().player.x===250);
 await page.getByText('TAP TO FLY',{exact:true}).waitFor(); await page.waitForTimeout(40);
 const resized=await page.evaluate(()=>__CHERRY_BLOOM_V2__.snapshot());assert.equal(resized.score,0);assert.equal(resized.player.velocity,0);assert.equal(resized.vectorStats.parsesDuringPlay,0);assert.equal(resized.metrics.filter(e=>e.type==='pair_visual_prepared').length,5);
 await page.locator('[aria-label^="Área do jogo"]').tap({position:{x:500,y:220}});await page.waitForFunction(()=>__CHERRY_BLOOM_V2__?.snapshot()?.status==='PLAYING'&&__CHERRY_BLOOM_V2__.snapshot().elapsed>0);await page.evaluate(()=>window.readExitedRound=__CHERRY_BLOOM_V2__.snapshot);
 await page.getByRole('button',{name:'Voltar para a tela inicial',exact:true}).click();const exit1=await page.evaluate(()=>readExitedRound());await page.waitForTimeout(200);const exit2=await page.evaluate(()=>readExitedRound());assert.equal(exit1.status,'PLAYING');assert.ok(exit1.elapsed>0);assert.equal(exit1.elapsed,exit2.elapsed);assert.equal(exit2.rafActive,false);assert.equal(exit2.audio.active,false);
 await page.setViewportSize({width:390,height:844});await page.getByRole('heading',{name:'Gire o dispositivo',exact:true}).waitFor();await page.setViewportSize({width:844,height:390});await page.getByRole('button',{name:'LEVEL SELECT',exact:true}).waitFor();
 assert.equal(errors.length,0);fs.writeFileSync(path.join(__dirname,'endless-lifecycle-runtime.json'),JSON.stringify({fixture:'Contiguous completion storage fixture, not twelve real-browser completions',before,visualBefore,visualAfter,retries,resized,exit1,exit2,errors},null,2));console.log(JSON.stringify({endless:true,chapters:4,visualMoves:true,resize:'READY',exitLoop:false,portraitNotice:true}));
}finally{await browser.close();}})().catch(e=>{console.error(e.stack);process.exitCode=1});
