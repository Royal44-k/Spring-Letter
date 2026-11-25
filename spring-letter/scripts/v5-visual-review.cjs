const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
const directory=path.resolve(__dirname,'../evidence');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],shots=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const snapshot=()=>page.evaluate(()=>{const s=window.__SPRING__.snapshot();return {material:s.material,night:s.night,bloom:s.displayBloom,scatter:s.scatter,dustView:s.dustView,camera:s.camera,gesture:s.gesture,particles:s.particles};});
  async function shot(name){const file='v5-review-'+name+'.png';const state=await snapshot();await page.screenshot({path:path.join(directory,file)});shots.push({file,state});console.log(file);}
  await page.goto(process.env.SPRING_URL||'http://127.0.0.1:5192');await page.waitForFunction(()=>window.__SPRING__);await page.locator('#gallery').click();await page.waitForTimeout(1800);
  if(await page.locator('#flower-workbench').getAttribute('open')===null)await page.locator('#flower-workbench>summary').click();
  await shot('01-silver-day');await page.mouse.move(760,470);await page.mouse.wheel(0,-280);await page.waitForTimeout(1100);await shot('02-silver-near');
  await page.mouse.move(680,410);await page.mouse.down();await page.mouse.move(790,410,{steps:20});await page.mouse.up();await page.waitForTimeout(900);await shot('03-silver-orbit');
  await page.locator('[data-material="crystal"]').click();await page.waitForTimeout(1200);await shot('04-crystal-day');
  await page.locator('#night').click();await page.waitForTimeout(1200);await shot('05-crystal-night');
  await page.locator('#night').click();await page.locator('[data-material="lily"]').click();await page.waitForTimeout(1100);await shot('06-lily-blush');
  await page.locator('#variant').click();await page.waitForTimeout(900);await shot('07-lily-golden');
  await page.locator('[data-material="silver"]').click();await page.locator('[data-gallery="dust"]').click();await page.waitForTimeout(1800);await shot('08-dust-source');
  await page.keyboard.down('Space');await page.mouse.move(520,440);await page.mouse.down();
  for(let i=1;i<=14;i++){await page.mouse.move(520+i*25,440-i*5);await page.waitForTimeout(16);}
  await shot('09-dust-sweep');await page.mouse.up();await page.keyboard.up('Space');await page.mouse.move(45,85);await page.waitForTimeout(3200);await shot('10-dust-return');
  await page.locator('[data-gallery="flower"]').click();await page.waitForTimeout(1800);await page.mouse.move(700,440);await page.keyboard.down('KeyQ');await page.waitForTimeout(1600);await shot('11-world-scatter');
  await page.keyboard.up('KeyQ');await page.mouse.move(45,85);await page.waitForTimeout(3000);await shot('12-world-return');
  await page.locator('#bloom').focus();await page.keyboard.press('Home');await page.keyboard.press('PageUp');await page.keyboard.press('PageUp');await page.mouse.click(690,640);await page.waitForTimeout(700);
  await page.keyboard.down('Space');await page.mouse.move(660,570);await page.mouse.down();
  for(let i=1;i<=30;i++){await page.mouse.move(660,570-i*4);await page.waitForTimeout(55);}
  await shot('13-slow-bloom');await page.mouse.up();await page.keyboard.up('Space');await page.waitForTimeout(1500);await shot('14-slow-return');
  fs.writeFileSync(path.join(directory,'v5-visual-review.json'),JSON.stringify({date:new Date().toISOString(),url:process.env.SPRING_URL||'http://127.0.0.1:5192',errors,shots,scope:'Ordinary UI, mouse and keyboard; read-only diagnostics. The url field identifies the tested development service or fixed candidate.'},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
