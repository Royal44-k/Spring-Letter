const assert=require('node:assert/strict'),path=require('node:path');
function harness(page,{evidence,prefix='v6-main',width=1440,height=900}={}){
 const route=[],captures=[],snap=()=>page.evaluate(()=>window.__SPRING__.snapshot());
 const project=(x,y,z)=>page.evaluate(p=>window.__SPRING__.project(...p),[x,y,z]);
 async function aim(x,y,z){const p=await project(x,y,z);assert.ok(p.x>8&&p.x<width-8&&p.y>8&&p.y<height-8,'visible world target '+JSON.stringify({x,y,z,p}));await page.mouse.move(p.x,p.y);return p;}
 async function capture(name){const file=prefix+'-'+name+'.png';await page.screenshot({path:path.join(evidence,file)});captures.push(file);}
 async function walk(x,z){
  const start=Date.now();let down=[];
  try{while(Date.now()-start<45000){
   const s=await snap();assert.ok(!['flower','wind','branch'].includes(s.focus),'leave near-view before walking');
   const p=s.state.player,dx=x-p.x,dz=z-p.z,a=s.view.azimuth,distance=Math.hypot(dx,dz);
   if(distance<.23){route.push({target:[x,z],actual:[p.x,p.z],platform:s.state.bridge.platform,support:s.state.bridge.support});return;}
   const r=dx*Math.cos(a)-dz*Math.sin(a),f=-dx*Math.sin(a)-dz*Math.cos(a);down=[];
   if(Math.abs(r)>Math.abs(f)*.4142)down.push(r>0?'KeyD':'KeyA');
   if(Math.abs(f)>Math.abs(r)*.4142)down.push(f>0?'KeyW':'KeyS');
   for(const k of down)await page.keyboard.down(k);
   await page.waitForTimeout(distance<.6?50:130);
   for(const k of down)await page.keyboard.up(k);down=[];await page.waitForTimeout(35);
  }throw Error('walk timeout '+JSON.stringify({target:[x,z],actual:(await snap()).state.player}));}
  finally{for(const k of down)await page.keyboard.up(k);}
 }
 async function routeTo(points){for(const p of points)await walk(...p);}
 async function ensureVisible(points){for(let i=0;i<6;i++){const projected=await Promise.all(points.map(p=>project(p.x,.4,p.z)));if(projected.every(p=>p.x>55&&p.x<width-55&&p.y>110&&p.y<height-150))return;await page.mouse.move(width*.5,height*.45);await page.mouse.wheel(0,330);await page.waitForTimeout(650);}throw Error('world anchors cannot fit current view');}
 const platforms={A:{x:0,z:-26},M:{x:0,z:-32},F:{x:0,z:-38},R:{x:-5,z:-29}};
 function bridgeAnchors(shape){const [a,b,curve]=shape==='bridge_am'?['A','M',.28]:shape==='bridge_mf'?['M','F',-.32]:['R','M',.24];const from=platforms[a],to=platforms[b],dx=to.x-from.x,dz=to.z-from.z,length=Math.hypot(dx,dz);return Array.from({length:6},(_,i)=>{const t=i/5,c=Math.sin(t*Math.PI)*curve;return{x:from.x+dx*t-dz/length*c,z:from.z+dz*t+dx/length*c};});}
 async function drawBridge(shape,{count=6,release=true}={}){
  const anchors=bridgeAnchors(shape);await ensureVisible(anchors.slice(0,count));
  await page.keyboard.down('Space');await aim(anchors[0].x,.4,anchors[0].z);await page.mouse.down();await page.waitForTimeout(100);
  for(let i=1;i<count;i++)for(let j=1;j<=7;j++){const t=j/7;await aim(anchors[i-1].x+(anchors[i].x-anchors[i-1].x)*t,.4,anchors[i-1].z+(anchors[i].z-anchors[i-1].z)*t);await page.waitForTimeout(45);}
  if(release){await page.mouse.up();await page.keyboard.up('Space');await page.waitForTimeout(220);}
 }
 async function act(){await page.keyboard.press('KeyE');await page.waitForTimeout(250);}
 async function mainWindHeld(){
  await aim(-3,.5,-14);await page.mouse.down();
  for(const [x,z]of[[-3,2],[-1.5,2],[0,2],[1.5,1.8],[3,1],[3,-.5],[3,-2]]){
   const start=Date.now();while(Date.now()-start<10000){await aim(x,.5,z-16);await page.waitForTimeout(80);const w=(await snap()).state.wind;if(Math.hypot(w.x-x,w.z-z)<.2)break;}
   const w=(await snap()).state.wind;assert.ok(Math.hypot(w.x-x,w.z-z)<.3,'held seed reaches route point');
  }
 }
 return {snap,project,aim,capture,walk,routeTo,drawBridge,act,mainWindHeld,route,captures};
}
module.exports={harness};
