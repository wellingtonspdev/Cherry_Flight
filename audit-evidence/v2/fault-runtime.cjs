const {chromium}=require('C:/Users/Wellington/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const results=[];try{
 for(const fault of ['corrupt','audio','quota']){
  const context=await browser.newContext({viewport:{width:844,height:390},hasTouch:true});
  await context.addInitScript(fault=>{
   if(fault==='corrupt')localStorage.setItem('@cherry_bloom_progress_v2','{bad-json');
   if(fault==='audio')window.Audio=class {constructor(){throw new Error('Injected unavailable audio backend');}};
   if(fault==='quota'){const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='@cherry_bloom_progress_v2')throw new DOMException('Injected storage quota','QuotaExceededError');return original.call(this,key,value);};}
  },fault);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:8105');
  await page.getByRole('button',{name:'Iniciar o jogo Cherry Bloom',exact:true}).click();await page.waitForFunction(()=>window.__CHERRY_BLOOM_V2__?.snapshot()?.status==='READY');
  const before=await page.evaluate(()=>__CHERRY_BLOOM_V2__.snapshot());await page.keyboard.press('Space');await page.waitForTimeout(100);
  const after=await page.evaluate(()=>__CHERRY_BLOOM_V2__.snapshot());assert.equal(after.status,'PLAYING');assert.ok(after.player.y<before.player.y);assert.equal(before.levelId,1);
  if(fault==='audio')assert.ok(after.audio.failures>=10);
  if(fault==='quota'){await page.getByRole('button',{name:'Voltar para a tela inicial',exact:true}).click();assert.ok((await page.locator('body').innerText()).includes('Progresso apenas nesta sessão'));}
  assert.equal(errors.length,0);results.push({fault,before:{status:before.status,levelId:before.levelId},after:{status:after.status,player:after.player,audio:after.audio},errors});await context.close();
 }
 const context=await browser.newContext({viewport:{width:844,height:390}}),page=await context.newPage();await page.goto('http://localhost:8105');await page.getByRole('button',{name:'SETTINGS',exact:true}).click();await page.getByRole('switch',{name:'Music',exact:true}).uncheck();await page.waitForTimeout(100);await page.reload();await page.getByRole('button',{name:'SETTINGS',exact:true}).click();assert.equal(await page.getByRole('switch',{name:'Music',exact:true}).isChecked(),false);assert.equal(await page.getByRole('switch',{name:'SFX',exact:true}).isChecked(),true);results.push({settingsReload:'PASS'});await context.close();
 fs.writeFileSync(path.join(__dirname,'fault-runtime.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(r=>({fault:r.fault,state:r.after?.status,settingsReload:r.settingsReload}))));
}finally{await browser.close();}})().catch(e=>{console.error(e.stack);process.exitCode=1});
