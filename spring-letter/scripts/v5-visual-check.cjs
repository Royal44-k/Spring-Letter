const{chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true}),errors=[],checks=[];
 const dir=path.resolve(__dirname,'../evidence'),url=process.env.SPRING_URL||'http://127.0.0.1:5192';
 page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 try{
  await page.goto(url);await page.waitForFunction(()=>window.__SPRING__);await page.locator('#begin').click();await page.locator('#opening-skip').click();await page.waitForTimeout(1700);await page.screenshot({path:path.join(dir,'v5-release-roaming.png')});
  await page.keyboard.press('KeyE');await page.waitForTimeout(1500);
  await page.keyboard.down('Space');await page.mouse.move(640,560);await page.mouse.down();
  for(let n=1;n<=38;n++){await page.mouse.move(640,560-n*4);await page.waitForTimeout(45);}
  await page.mouse.up();await page.keyboard.up('Space');await page.waitForFunction(()=>window.__SPRING__.snapshot().scatter<.01);await page.waitForTimeout(900);
  await page.screenshot({path:path.join(dir,'v5-release-world-flower.png')});
  await page.mouse.move(560,400);await page.keyboard.down('Space');await page.mouse.down();let worldPeak=0;
  for(let n=0;n<26;n++){await page.mouse.move(n%2?850:560,400,{steps:2});await page.waitForTimeout(25);const state=await snap();worldPeak=Math.max(worldPeak,state.scatter);if(n===18)await page.screenshot({path:path.join(dir,'v5-release-world-dust.png')});}
  assert.ok(worldPeak>.3,'fast wind visibly disperses the flower inside the actual game world');assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('ink-scene')),true);await page.mouse.up();await page.keyboard.up('Space');await page.waitForFunction(()=>window.__SPRING__.snapshot().scatter<.01);await page.screenshot({path:path.join(dir,'v5-release-world-return.png')});checks.push('actual game flower disperses under fast strokes with darkened surroundings and returns without a reset button');
  await page.locator('#home').click();await page.locator('#gallery').click();await page.waitForTimeout(1700);
  await page.locator('#surface-controls>summary').click();const slider=page.locator('[data-surface=thickness]'),box=await slider.boundingBox();await page.mouse.click(box.x+box.width*.65,box.y+box.height/2);assert.ok(Number(await slider.inputValue())>500);
  await page.locator('#chase-light').click();await page.mouse.move(650,340);assert.equal(await page.locator('#chase-light').getAttribute('aria-pressed'),'true');await page.locator('#chase-light').click();await page.locator('#surface-controls>summary').click();checks.push('thin-film and chase-light controls remain usable in the optional workbench');
  for(const material of ['silver','crystal','lily']){await page.locator(`[data-material=${material}]`).click();await page.waitForTimeout(1600);assert.equal((await snap()).material,material);await page.screenshot({path:path.join(dir,`v5-release-${material}.png`)});}
  assert.equal(await page.locator('[data-surface=iridescence]').isDisabled(),true);await page.locator('#variant').click();await page.waitForTimeout(700);await page.screenshot({path:path.join(dir,'v5-release-golden.png')});checks.push('three material presets and the natural color variant keep their identity');
  await page.locator('[data-material=silver]').click();const bloom=await page.locator('#bloom').boundingBox();await page.mouse.click(bloom.x+bloom.width*.5,bloom.y+bloom.height/2);const target=(await snap()).displayBloom;
  let peaks=[];
  for(let round=0;round<3;round++){
   await page.mouse.move(560,400);await page.keyboard.down('Space');await page.mouse.down();let peak=0;
   for(let n=0;n<14;n++){await page.mouse.move(560+(n%2?200:0),400,{steps:3});await page.waitForTimeout(25);peak=Math.max(peak,(await snap()).scatter);}
   peaks.push(peak);assert.ok(peak>.15);await page.mouse.up();await page.keyboard.up('Space');await page.waitForFunction(()=>window.__SPRING__.snapshot().scatter<.01);assert.ok(Math.abs((await snap()).displayBloom-target)<.02);
  }
  checks.push('three real horizontal wind strokes scatter and naturally reform the same half-open flower');
  await page.locator('[data-gallery=dust]').click();await page.waitForTimeout(1800);const before=await snap();await page.mouse.move(570,350);await page.mouse.down();await page.mouse.move(910,450,{steps:30});await page.mouse.up();await page.waitForTimeout(500);const after=await snap();assert.ok(Math.abs(after.view.azimuth-before.view.azimuth)>1);assert.ok(after.scatter<.01);await page.screenshot({path:path.join(dir,'v5-release-dust.png')});checks.push('dust gallery default drag changes view without masquerading as a wind stroke');
  const download=page.waitForEvent('download');await page.locator('#photo').click();await(await download).saveAs(path.join(dir,'v5-my-spring-letter.png'));assert.ok(fs.statSync(path.join(dir,'v5-my-spring-letter.png')).size>30000);checks.push('photo saves a real local PNG from the composed scene');
  assert.deepEqual(errors,[]);const report={date:new Date().toISOString(),url,build:await page.locator('script[type=module]').getAttribute('src'),checks,errors,peaks,worldPeak,scope:'Ordinary visible UI and pointer input, read-only snapshots. Screenshots are actual renders; material labels alone are not a photorealism verdict.'};fs.writeFileSync(path.join(dir,'v5-visual-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
