// Standalone DOM/CSS check. This does not launch or mutate the game.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('D:/AI Game/node_modules/playwright');
const base='D:/AI Game/spring-letter',out=path.join(base,'evidence');
const sources=['src/loading-scene.js','src/loading-scene.css'];
const hashes=Object.fromEntries(sources.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(base,file))).digest('hex')]));
const script=fs.readFileSync(path.join(base,sources[0]),'utf8').replace('export function mountLoadingScene','function mountLoadingScene');
const css=fs.readFileSync(path.join(base,'src/style.css'),'utf8')+'\n'+fs.readFileSync(path.join(base,sources[1]),'utf8');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const errors=[],views=[],checks=[];
 async function createPage(viewport,options={}){
  const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(String(e)));
  await page.setContent('<!doctype html><html lang="zh-CN"><meta name="viewport" content="width=device-width,initial-scale=1"><body><div id="loading"></div></body></html>');
  await page.addStyleTag({content:css});
  await page.addScriptTag({content:`window.pendingLoadingTimers=new Set();const nativeSetTimeout=window.setTimeout.bind(window),nativeClearTimeout=window.clearTimeout.bind(window);window.setTimeout=(fn,ms,...args)=>{const id=nativeSetTimeout(()=>{pendingLoadingTimers.delete(id);fn(...args);},ms);pendingLoadingTimers.add(id);return id;};window.clearTimeout=id=>{pendingLoadingTimers.delete(id);nativeClearTimeout(id);};`});
  await page.addScriptTag({content:script+';window.loader=mountLoadingScene(document.getElementById("loading"),'+JSON.stringify(options)+');'});
  return page;
 }
 try{
  for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:844,height:390}]){
   const page=await createPage(viewport);
   for(let i=0;i<3;i++){
    await page.locator(`[data-load-page="${i}"]`).click();await page.waitForTimeout(1500);
    await page.screenshot({path:path.join(out,`v6-loading-${viewport.width}-${i}.png`)});
    const view=await page.evaluate(()=>({width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,title:document.querySelector('[data-load-title]').textContent,current:[...document.querySelectorAll('[data-load-page]')].findIndex(b=>b.getAttribute('aria-pressed')==='true'),titleBox:document.querySelector('[data-load-title]').getBoundingClientRect().toJSON(),bottomBox:document.querySelector('.spring-load-bottom').getBoundingClientRect().toJSON(),artViewBox:document.querySelector('.spring-load-scene svg').getAttribute('viewBox')}));
    assert.equal(view.current,i);assert.equal(view.overflow,false);assert.ok(view.titleBox.bottom<view.bottomBox.top,JSON.stringify(view));
    views.push(view);
   }
   checks.push(`${viewport.width}×${viewport.height}: all three scenes, readable title/footer separation, no horizontal overflow`);
   for(const [stage,index]of[['assets',0],['garden',1],['light',2],['ready',3]]){
    await page.evaluate(stage=>window.loader.setStage(stage),stage);
    assert.equal(await page.locator('.spring-load-steps i.is-done').count(),index);
    assert.equal(await page.locator('.spring-load-steps i.is-active').count(),1);
   }
   checks.push(`${viewport.width}px: actual stage API marks only completed stages`);
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(80);
   const reduced=await page.evaluate(()=>({paused:document.querySelector('#loading').classList.contains('is-paused'),name:getComputedStyle(document.querySelector('.spring-load-scene svg')).animationName,pending:pendingLoadingTimers.size}));
   assert.deepEqual(reduced,{paused:true,name:'none',pending:0});
   await page.evaluate(async()=>{await Promise.all([window.loader.complete(),window.loader.complete()]);await window.loader.complete();});
   assert.equal(await page.locator('#loading').isHidden(),true);assert.equal(await page.evaluate(()=>pendingLoadingTimers.size),0);
   checks.push(`${viewport.width}px: reduced motion stops rotation timer and CSS motion; repeated/concurrent complete hides and cleans timers`);
   await page.close();
  }
  const auto=await createPage({width:1280,height:720});
  await auto.waitForTimeout(6700);assert.equal(await auto.locator('[data-load-page="1"]').getAttribute('aria-pressed'),'true');
  await auto.evaluate(()=>window.loader.dispose());assert.equal(await auto.evaluate(()=>pendingLoadingTimers.size),0);assert.equal(await auto.locator('#loading').getAttribute('aria-busy'),'false');
  await auto.waitForTimeout(300);assert.equal(await auto.evaluate(()=>pendingLoadingTimers.size),0);
  checks.push('normal timed carousel reaches second scene; early dispose cancels timer and marks not busy');
  await auto.close();
  const preference=await createPage({width:1280,height:720},{reducedMotion:true});
  assert.equal(await preference.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),false);
  assert.equal(await preference.evaluate(()=>pendingLoadingTimers.size),0);
  assert.equal(await preference.locator('#loading').evaluate(el=>el.classList.contains('is-reduced')),true);
  assert.equal(await preference.locator('.spring-load-scene svg').first().evaluate(el=>getComputedStyle(el).animationName),'none');
  await preference.evaluate(()=>window.loader.complete());
  assert.equal(await preference.locator('#loading').isHidden(),true);
  checks.push('explicit persisted reducedMotion preference stops motion and timers even when OS preference is normal');
  await preference.close();
  assert.deepEqual(errors,[]);
  const result={date:new Date().toISOString(),scope:'Standalone loading component with current production CSS. Ordinary page buttons and its public lifecycle API only; no WebGL game launched or production state mutated.',hashes,checks,views,errors};
  fs.writeFileSync(path.join(out,'v6-loading-preview.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({checks:checks.length,views:views.length,errors}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
