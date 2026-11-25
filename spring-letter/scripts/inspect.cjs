const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const dir=path.resolve(__dirname,'../evidence');fs.mkdirSync(dir,{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(process.env.SPRING_URL||'http://127.0.0.1:5192');await page.waitForFunction(()=>window.__SPRING__,null,{timeout:60000});await page.waitForTimeout(2200);await page.screenshot({path:path.join(dir,'01-cover.png')});
 console.log('Cover rendered');
 await page.locator('#gallery').click();await page.waitForTimeout(2500);await page.screenshot({path:path.join(dir,'02-silver.png')});
 await page.locator('[data-material="crystal"]').click();await page.waitForTimeout(800);await page.screenshot({path:path.join(dir,'03-crystal.png')});
 await page.locator('[data-material="lily"]').click();await page.waitForTimeout(600);await page.screenshot({path:path.join(dir,'04-natural.png')});
 await page.locator('[data-gallery="dust"]').click();await page.waitForTimeout(2000);await page.screenshot({path:path.join(dir,'05-dust.png')});
 await page.locator('#gallery-back').click();await page.locator('#begin').click();await page.waitForTimeout(1500);await page.keyboard.press('KeyE');await page.waitForTimeout(2000);await page.screenshot({path:path.join(dir,'06-bud-puzzle.png')});
 fs.writeFileSync(path.join(dir,'inspection.json'),JSON.stringify({snapshot:await page.evaluate(()=>window.__SPRING__.snapshot()),errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
