// Separate cold-start timing from steady animation; no progress is injected.
const { chromium } = require('playwright');
const fs = require('node:fs'), path = require('node:path');
const url = process.env.SPRING_URL || 'http://127.0.0.1:5192';
const output = process.env.SPRING_STARTUP_REPORT || 'v5-startup.json';
(async () => {
 const browser = await chromium.launch({ executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless:true });
 const page = await browser.newPage({ viewport:{width:1440,height:900} }), errors=[], phases=[];
 page.on('pageerror', e=>errors.push(e.stack));
 await page.addInitScript(()=>{
  window.__BOOT_TIMING__={longTasks:[],marks:[]};
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.__BOOT_TIMING__.longTasks.push({start:e.startTime,duration:e.duration});}).observe({type:'longtask',buffered:true});
 });
 const started=Date.now();
 const mark=async name=>{const record=await page.evaluate(()=>({now:performance.now(),loadingHidden:document.getElementById('loading').hidden,loadingOpacity:document.getElementById('loading').style.opacity,snapshot:window.__SPRING__?.snapshot()}));if(record.snapshot)delete record.snapshot.frameTimes;phases.push({name,wallMs:Date.now()-started,...record});console.log(name,phases.at(-1).wallMs,record.snapshot?.frameTiming);};
 try {
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__,null,{timeout:90000});await mark('diagnostics-ready');
  await page.waitForSelector('#loading',{state:'hidden',timeout:60000});await mark('loading-hidden');await page.waitForTimeout(1500);await mark('cover-settled');
  await page.locator('#begin').click();await page.waitForTimeout(1800);await mark('opening-start');
  await page.locator('#opening-skip').click();await page.waitForTimeout(1800);await mark('first-walkable-view');
  await page.keyboard.press('KeyE');await page.waitForTimeout(2000);await mark('first-flower-focus');
  await page.locator('#home').click();await page.locator('#gallery').click();await page.waitForTimeout(2000);await mark('first-gallery');
  const report={date:new Date().toISOString(),url,build:await page.locator('script[type=module]').getAttribute('src'),phases,bootTiming:await page.evaluate(()=>window.__BOOT_TIMING__),errors,scope:'New browser/context; standard UI clicks and read-only timing. Includes cold initialization and first visual transitions. Does not clear the operating system driver shader cache.'};
  fs.writeFileSync(path.resolve(__dirname,'../evidence',output),JSON.stringify(report,null,2));console.log('SAVED '+output);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
