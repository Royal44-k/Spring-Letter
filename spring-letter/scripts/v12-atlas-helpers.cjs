const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const{inspectCanvas,assessPixels,summarizeRgba}=require('./v10-pixel-validation.cjs');
const{bindStyleIdentity}=require('./v12-style-identity.cjs');
const BEDS=[[-7,0],[8,-12],[-5,-25]],ISLANDS=[{x:0,z:6,rx:6,rz:5},{x:10,z:-3,rx:5,rz:4},{x:-2,z:-13,rx:5,rz:5},{x:10,z:-24,rx:5,rz:4},{x:0,z:-36,rx:7,rz:6}];
function atlasHarness(p,ctx,out,report){
 const snap=()=>p.evaluate(()=>window.__SPRING__.snapshot()),a=async()=>(await snap()).atlas;
 async function install(){await p.addInitScript({content:'window.__V10_RGBA_STATS__='+summarizeRgba.toString()});}
 async function capture(name){const css=await bindStyleIdentity(p,report,p.url());const leaked=await p.evaluate(()=>['hud','controls','touch-pad','context','world-guide','exploration-hint','nearby-branch','caption','field-action','letter-post','letter-target','resonance-panel','dash-control'].filter(id=>{const n=document.getElementById(id);return n&&n.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})&&!n.closest('[hidden]');}));assert.deepEqual(leaked,[],'old garden UI cannot leak into an independent map');const s=await snap(),pixels=await p.evaluate(inspectCanvas),check=assessPixels(pixels);report.samples??=[];report.samples.push({name,location:s.atlas.state.location,pixels,pixelCheck:check,...css});delete s.frameTimes;fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(s,null,2));await p.screenshot({path:path.join(out,name+'.jpg')});assert.ok(check.valid,JSON.stringify(check));return s;}
 async function reload(){await p.reload();await p.waitForFunction(()=>window.__SPRING__,null,{timeout:120000});await p.waitForSelector('#loading',{state:'hidden'});await bindStyleIdentity(p,report,p.url());await p.locator('#continue').click();await p.waitForTimeout(900);}
 async function walk(x,z,{call=false,run=false,jump=false,untilGrounded=false,limit=45000}={}){
  const start=Date.now();await p.locator('#scene canvas').focus();if(call||jump)await p.keyboard.down('Space');if(run)await p.keyboard.down('ShiftLeft');
  try{while(Date.now()-start<limit){const q=await a(),s=q.state,dx=x-s.player.x,dz=z-s.player.z,d=Math.hypot(dx,dz),angle=q.camera.yaw||0;
   if(d<.4&&(!untilGrounded||s.player.grounded))return;
   const r=dx*Math.cos(angle)-dz*Math.sin(angle),f=-dx*Math.sin(angle)-dz*Math.cos(angle),keys=[];
   if(d>.3){if(Math.abs(r)>Math.abs(f)*.4142)keys.push(r>0?'KeyD':'KeyA');if(Math.abs(f)>Math.abs(r)*.4142)keys.push(f>0?'KeyW':'KeyS');}
   for(const k of keys)await p.keyboard.down(k);await p.waitForTimeout(d<.8?60:145);for(const k of keys)await p.keyboard.up(k);await p.waitForTimeout(20);
  }throw Error('atlas walk timeout '+JSON.stringify({target:[x,z],atlas:await a()}));}finally{for(const k of ['KeyW','KeyA','KeyS','KeyD','Space','ShiftLeft'])await p.keyboard.up(k);}
 }
 async function checkpoint(name){await ctx.storageState({path:path.join(out,'earned-'+name+'.json')});}
 async function play({reloads=true,onCheck=()=>{}}={}){
  assert.equal((await a()).state.location,'conservatory');await capture('01-rainforest-entry');await walk(0,6,{call:true});
  for(let i=0;i<BEDS.length;i++){await walk(...BEDS[i],{call:true});await p.keyboard.down('Space');await p.waitForFunction(i=>window.__SPRING__.snapshot().atlas.state.blooms[i]>=1,i,{timeout:20000});await p.keyboard.up('Space');await capture('02-orchid-'+i);if(i===0&&reloads){await checkpoint('rainforest');await reload();assert.equal((await a()).state.location,'conservatory');assert.equal((await a()).state.blooms[0],1);}}
  assert.ok((await a()).state.completed.includes('conservatory'));onCheck('rainforest: actual walking, delayed butterfly following and three orchid blooms');await p.locator('#atlas-next').click();await p.waitForTimeout(1200);await capture('03-observatory-entry');await walk(0,-18);await p.locator('#scene canvas').focus();await p.keyboard.press('KeyE');await p.waitForTimeout(1500);assert.equal((await a()).state.stargazing,true);await capture('04-constellation');
  const route=[0,1,2,3,4,0,5,2],stars=[[-6,10,-29],[0,14,-31],[6,10,-29],[6,5,-29],[-6,5,-29],[0,8,-27]];
  for(let i=0;i<route.length;i++){const q=await p.evaluate(pos=>window.__SPRING__.project(...pos),stars[route[i]]);const hit=await p.evaluate(q=>document.elementFromPoint(q.x,q.y)?.tagName,q);assert.equal(hit,'CANVAS','star visible and unobscured by UI');await p.mouse.click(q.x,q.y);await p.waitForTimeout(220);assert.equal((await a()).state.stars.length,i+1);if(i===2&&reloads){await checkpoint('stars');await reload();assert.equal((await a()).state.stars.length,3);await p.locator('#scene canvas').focus();await p.keyboard.press('KeyE');await p.waitForTimeout(1400);}}
  assert.ok((await a()).state.completed.includes('observatory'));await capture('05-star-letter-complete');await p.locator('#atlas-look-down').click();await p.locator('#atlas-next').click();await p.waitForTimeout(1200);onCheck('observatory: actual sky clicks trace an earned constellation, partial progress resumes');await capture('06-cloud-islands-entry');
  for(let i=0;i<4;i++){
   const from=ISLANDS[i],to=ISLANDS[i+1],dx=to.x-from.x,dz=to.z-from.z,d=Math.hypot(dx,dz),ux=dx/d,uz=dz/d,r=1/Math.sqrt((ux/from.rx)**2+(uz/from.rz)**2),edge={x:from.x+ux*r*.80,z:from.z+uz*r*.80};
   await walk(edge.x,edge.z);await walk(to.x,to.z,{jump:true,untilGrounded:true,limit:20000});assert.equal((await a()).state.meadowCheckpoint,i+1,'physically landed on next island');await capture('07-landed-island-'+(i+1));
   if(i===1&&reloads){await checkpoint('clouds');await reload();assert.equal((await a()).state.meadowCheckpoint,2);assert.equal((await a()).state.player.grounded,true);}
  }
  assert.ok((await a()).state.completed.includes('meadow'));assert.equal((await a()).state.completed.length,3);await checkpoint('three-maps');await capture('08-three-places-earned');onCheck('cloud meadow: physical walking, jumps, glides and four sequential landings');
  return await snap();
 }
 return{install,snap,a,capture,checkpoint,reload,walk,play};
}
module.exports={atlasHarness};
