/** Independent map rules. This module owns no renderer, DOM, audio or storage. */
import {ATLAS_LOCATIONS,CONSERVATORY_BEDS,MOTH_HOME,OBSERVATORY_DAIS,STAR_ROUTE,CLOUD_ISLANDS,ATLAS_NOTES} from './atlas-content.js';
import {atlasObstacles} from './atlas-spatial.js';

const ids=ATLAS_LOCATIONS.map(place=>place.id);
const finite=(n,f=0)=>Number.isFinite(n)?n:f;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,finite(n,a)));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const location=id=>ATLAS_LOCATIONS.find(place=>place.id===id);
const cloudAt=(x,z)=>CLOUD_ISLANDS.find(island=>((x-island.x)/island.rx)**2+((z-island.z)/island.rz)**2<=1);
const playerAt=p=>({x:p.x,y:p.height??p.y??0,z:p.z,vy:0,grounded:true,gliding:false});
const checkpointPlayer=s=>playerAt(CLOUD_ISLANDS[s.meadowCheckpoint]||CLOUD_ISLANDS[0]);
const FOOT_RADIUS=.24;

function clearFoot(id,x,z,from={x,z}){
 // Project only feet out of solid scenery. The tangential component remains,
 // allowing diagonal input to slide around a trunk or column naturally.
 const obstacles=atlasObstacles(id);
 for(let pass=0;pass<8;pass++){
  let corrected=false;
  for(const solid of obstacles){
   const radius=solid.radius+FOOT_RADIUS;let dx=x-solid.x,dz=z-solid.z,length=Math.hypot(dx,dz);
   if(length>=radius)continue;
   if(length<1e-8){dx=from.x-solid.x;dz=from.z-solid.z;length=Math.hypot(dx,dz);if(length<1e-8){dx=1;dz=0;length=1;}}
   x=solid.x+dx/length*(radius+1e-6);z=solid.z+dz/length*(radius+1e-6);corrected=true;
  }
  if(!corrected)break;
 }
 return {x,z};
}

export function createAtlasState(){
 return {version:1,location:null,player:playerAt(location('conservatory').spawn),visited:[],completed:[],
  blooms:[0,0,0],butterfly:{x:MOTH_HOME.x,y:1.1,z:MOTH_HOME.z,trust:0},stars:[],stargazing:false,meadowCheckpoint:0,
  notes:Object.fromEntries(ids.map(id=>[id,[]])),positions:{},jumpHeld:false,calling:false,elapsed:0,recoveries:0};
}

export function atlasGroundHeight(id,x,z){
 if(!Number.isFinite(x)||!Number.isFinite(z))return null;
 if(id==='meadow')return cloudAt(x,z)?.height??null;
 if(id==='conservatory')return Math.abs(x)<=17&&z>=-31&&z<=15?0:null;
 if(id==='observatory')return Math.abs(x)<=17&&z>=-28&&z<=15?clamp((-z-10)/8,0,1)*1.8:null;
 return null;
}

function copy(state){
 const s=state||createAtlasState();
 return {...s,player:{...s.player},visited:[...s.visited],completed:[...s.completed],blooms:[...s.blooms],butterfly:{...s.butterfly},stars:[...s.stars],notes:Object.fromEntries(ids.map(id=>[id,[...s.notes[id]]])),positions:Object.fromEntries(Object.entries(s.positions).map(([id,p])=>[id,{...p}]))};
}

function earned(s,id){return id==='conservatory'?s.blooms.every(value=>value>=1):id==='observatory'?s.stars.length===STAR_ROUTE.length:s.meadowCheckpoint===CLOUD_ISLANDS.length-1;}
function finish(s,events){for(const id of ids)if(earned(s,id)&&!s.completed.includes(id)){s.completed.push(id);events.push({type:'complete',location:id,reward:location(id).reward});}}
function normalizePlayer(id,value,checkpoint){
 const fallback=id==='meadow'?playerAt(CLOUD_ISLANDS[checkpoint]):playerAt(location(id).spawn);
 if(!value||!Number.isFinite(value.x)||!Number.isFinite(value.z))return fallback;
 let ground=atlasGroundHeight(id,value.x,value.z);
 if(ground===null)return fallback;
 // Airborne saves resume on a safe island, never with a stale held jump or fall.
 if(id==='meadow'&&(value.grounded!==true||(cloudAt(value.x,value.z)?.id??99)>checkpoint))return fallback;
 const foot=clearFoot(id,value.x,value.z);ground=atlasGroundHeight(id,foot.x,foot.z);
 return ground===null?fallback:{x:foot.x,y:ground,z:foot.z,vy:0,grounded:true,gliding:false};
}

export function restoreAtlasState(data){
 const s=createAtlasState();
 if(!data||typeof data!=='object'||Array.isArray(data)||data.version!==1)return s;
 s.location=ids.includes(data.location)?data.location:null;
 s.visited=ids.filter(id=>Array.isArray(data.visited)&&data.visited.includes(id));
 s.blooms=s.blooms.map((_,i)=>clamp(data.blooms?.[i],0,1));
 if(Array.isArray(data.stars))for(let i=0;i<STAR_ROUTE.length&&i<data.stars.length;i++){if(data.stars[i]!==STAR_ROUTE[i])break;s.stars.push(data.stars[i]);}
 s.meadowCheckpoint=Math.floor(clamp(data.meadowCheckpoint,0,CLOUD_ISLANDS.length-1));
 s.butterfly={x:clamp(finite(data.butterfly?.x,MOTH_HOME.x),-17,17),y:1.1,z:clamp(finite(data.butterfly?.z,MOTH_HOME.z),-31,15),trust:clamp(data.butterfly?.trust,0,1)};
 for(const id of ids){s.notes[id]=ATLAS_NOTES[id].filter(note=>Array.isArray(data.notes?.[id])&&data.notes[id].includes(note.id)).map(note=>note.id);if(data.positions?.[id])s.positions[id]=normalizePlayer(id,data.positions[id],s.meadowCheckpoint);}
 if(s.location){s.player=normalizePlayer(s.location,data.player,s.meadowCheckpoint);if(!s.visited.includes(s.location))s.visited.push(s.location);s.positions[s.location]={...s.player};}
 s.stargazing=s.location==='observatory'&&distance(s.player,OBSERVATORY_DAIS)<=OBSERVATORY_DAIS.radius&&data.stargazing===true;
 s.elapsed=clamp(data.elapsed,0,8640000);s.recoveries=Math.floor(clamp(data.recoveries,0,99999));
 finish(s,[]);return s;
}

function recover(s,events){
 if(!s.location)return;
 s.player=s.location==='meadow'?checkpointPlayer(s):playerAt(location(s.location).spawn);
 s.stargazing=false;s.jumpHeld=false;s.calling=false;s.recoveries=Math.min(99999,s.recoveries+1);s.positions[s.location]={...s.player};
 events.push({type:'recover',location:s.location,checkpoint:s.meadowCheckpoint});
}

export function atlasCommand(state,type,payload={}){
 const s=copy(state),events=[];
 const result=(ok=true,reason='')=>({state:s,ok,reason,events});
 if(type==='enter'){
  if(!ids.includes(payload.id))return result(false,'这处地点尚未出现在地图上。');
  if(s.location)s.positions[s.location]={...s.player};
  s.location=payload.id;s.player=payload.resume!==false&&s.positions[s.location]?normalizePlayer(s.location,s.positions[s.location],s.meadowCheckpoint):s.location==='meadow'?checkpointPlayer(s):playerAt(location(s.location).spawn);
  if(!s.visited.includes(s.location))s.visited.push(s.location);
  s.stargazing=false;s.jumpHeld=false;s.calling=false;events.push({type:'enter',location:s.location});return result();
 }
 if(type==='leave'){
  if(s.location)s.positions[s.location]={...s.player};const previous=s.location;s.location=null;s.stargazing=false;s.jumpHeld=false;s.calling=false;s.player.gliding=false;
  events.push({type:'leave',location:previous});return result();
 }
 if(!s.location)return result(false,'先从地图走进一处新地点。');
 if(type==='recover'){recover(s,events);return result();}
 if(type==='read-note'){
  const note=ATLAS_NOTES[s.location].find(note=>note.id===payload.id);
  if(!note||distance(s.player,note)>3.1||!s.player.grounded)return result(false,'走近那一处留下字迹的地方。');
  if(!s.notes[s.location].includes(note.id)){s.notes[s.location].push(note.id);events.push({type:'note',location:s.location,id:note.id,text:note.text});}
  return result();
 }
 if(s.location!=='observatory')return result(false,'这处风景需要另一种回应。');
 if(type==='study'){
  if(distance(s.player,OBSERVATORY_DAIS)>OBSERVATORY_DAIS.radius)return result(false,'沿石阶走近前方的观星台。');
  s.stargazing=true;events.push({type:'study'});return result();
 }
 if(type==='exit-study'){s.stargazing=false;return result();}
 if(!s.stargazing)return result(false,'先在观星台按 E，仰望星空。');
 if(s.completed.includes('observatory'))return result(false,'这条星路已经留在旅途中。');
 if(type==='star'){
  if(payload.id!==STAR_ROUTE[s.stars.length])return result(false,'沿着微亮的下一颗星，继续写下去。');
  s.stars.push(payload.id);events.push({type:'star',id:payload.id,index:s.stars.length-1});finish(s,events);return result();
 }
 if(type==='undo'){
  if(!s.stars.length)return result(false,'星路还没有落下第一笔。');
  events.push({type:'undo',id:s.stars.pop()});return result();
 }
 return result(false,'先完成眼前这一段旅程。');
}

function pollinate(s,dt,input,events){
 const moth=s.butterfly,near=distance(s.player,moth);s.calling=!!input.call;
 moth.trust=clamp(moth.trust+dt*(input.call&&near<7?.8:near>13?-.35:-.04),0,1);
 if(input.call&&moth.trust>.12&&near<18&&near>.25){const travel=Math.min(near,2.6*dt);moth.x+=(s.player.x-moth.x)/near*travel;moth.z+=(s.player.z-moth.z)/near*travel;}
 CONSERVATORY_BEDS.forEach((bed,index)=>{
  if(s.blooms[index]>=1||!input.call||moth.trust<.55||distance(s.player,bed)>2||distance(moth,bed)>1.65)return;
  const before=s.blooms[index];s.blooms[index]=Math.min(1,before+dt/2);
  if(before<1&&s.blooms[index]===1)events.push({type:'bloom',id:bed.id,index});
 });
 finish(s,events);
}

function move(s,dt,input,events){
 const p=s.player,cloud=s.location==='meadow';let right=clamp(finite(input.right),-1,1),forward=clamp(finite(input.forward),-1,1);
 const magnitude=Math.hypot(right,forward);if(magnitude>1){right/=magnitude;forward/=magnitude;}
 if(cloud&&input.jump&&!s.jumpHeld&&p.grounded){p.vy=7.8;p.grounded=false;events.push({type:'jump'});}
 // The open parasol carries a walking traveller across gaps without requiring
 // a sprint modifier, including the coarse direction changes of touch buttons.
 const speed=input.run?6.4:cloud&&!p.grounded&&input.jump?5:s.location==='conservatory'&&input.call?2.2:3.5;
 const dx=right*speed*dt,dz=-forward*speed*dt;
 s.jumpHeld=!!input.jump;
 if(cloud){
  const next=p.grounded?clearFoot(s.location,p.x+dx,p.z+dz,p):{x:p.x+dx,z:p.z+dz};
  const candidate=atlasGroundHeight('meadow',next.x,next.z);
  if(!p.grounded||candidate===null||candidate<=p.y+.4){p.x=next.x;p.z=next.z;}
  const ground=atlasGroundHeight('meadow',p.x,p.z);
  if(p.grounded&&(ground===null||ground<p.y-.4))p.grounded=false;
  if(!p.grounded){
   const before=p.y;p.vy-=10.5*dt;p.gliding=!!input.jump&&p.vy<0;
   if(p.gliding)p.vy=Math.max(p.vy,-1.25);
   p.y+=p.vy*dt;
   if(ground!==null&&p.vy<=0&&before>=ground-.001&&p.y<=ground){
    const foot=clearFoot(s.location,p.x,p.z),landing=atlasGroundHeight(s.location,foot.x,foot.z);
    if(landing===null){recover(s,events);return;}
    p.x=foot.x;p.z=foot.z;p.y=landing;p.vy=0;p.grounded=true;p.gliding=false;const island=cloudAt(p.x,p.z);events.push({type:'land',island:island.id});
    if(island.id===s.meadowCheckpoint+1){s.meadowCheckpoint=island.id;events.push({type:'checkpoint',index:island.id});finish(s,events);}
   }
  }else{p.y=ground;p.vy=0;p.gliding=false;}
  if(p.y<-12||Math.abs(p.x)>65||p.z<-75||p.z>35)recover(s,events);
 }else{
  // Slide along the shared rectangular garden boundary instead of getting stuck.
  const attempt=(x,z)=>{const next=clearFoot(s.location,x,z,p);if(atlasGroundHeight(s.location,next.x,next.z)===null)return false;p.x=next.x;p.z=next.z;return true;};
  if(!attempt(p.x+dx,p.z+dz)){attempt(p.x+dx,p.z);attempt(p.x,p.z+dz);}
  p.y=atlasGroundHeight(s.location,p.x,p.z)??0;p.vy=0;p.grounded=true;p.gliding=false;
 }
}

export function stepAtlas(state,dt,input={}){
 const s=copy(state),events=[],step=clamp(dt,0,.05);
 if(!s.location||step===0)return {state:s,events};
 s.elapsed=Math.min(8640000,s.elapsed+step);
 if(!s.stargazing)move(s,step,input,events);
 if(s.location==='conservatory')pollinate(s,step,input,events);else s.calling=false;
 s.positions[s.location]={...s.player};return {state:s,events};
}

export function atlasComplete(state){return ids.every(id=>state?.completed?.includes(id));}

export function atlasStatus(state){
 const s=state||createAtlasState(),place=location(s.location);
 if(!place)return {location:null,title:'远方的三处驿路',objective:'在地图选择一处新的风景。',hint:'花香、星路与远风，都可以慢慢寻找。',progress:0,complete:false,target:null,nextStar:null,canStudy:false};
 const complete=s.completed.includes(place.id),canStudy=place.id==='observatory'&&distance(s.player,OBSERVATORY_DAIS)<=OBSERVATORY_DAIS.radius;
 let progress=0,target=null,hint=place.objective;
 if(place.id==='conservatory'){progress=s.blooms.reduce((sum,n)=>sum+n,0)/3;const bed=CONSERVATORY_BEDS.find((_,i)=>s.blooms[i]<1);target=bed?{x:bed.x,y:0,z:bed.z}:null;hint=s.butterfly.trust<.55?'走近蝶群，按住 Space，让它们熟悉你的气息。':'按住 Space 慢行；等蝶抵达兰花旁，再一起停留片刻。';}
 if(place.id==='observatory'){progress=s.stars.length/STAR_ROUTE.length;target={x:OBSERVATORY_DAIS.x,y:1.8,z:OBSERVATORY_DAIS.z};hint=s.stargazing?'沿亮起的星点描画；可以松手，Z 撤回一笔。':canStudy?'按 E 仰望星空，把星光缝成一封信。':'沿月白斜坡走向前方的观星台。';}
 if(place.id==='meadow'){progress=s.meadowCheckpoint/(CLOUD_ISLANDS.length-1);const island=CLOUD_ISLANDS[Math.min(CLOUD_ISLANDS.length-1,s.meadowCheckpoint+1)];target={x:island.x,y:island.height,z:island.z};hint='向下一面风旗起跳；持续按住 Space，下降时花伞会托住你。';}
 if(complete)hint='已留下「'+place.reward+'」。可以在这里停留，也可以继续上路。';
 return {location:place.id,title:place.title,objective:place.objective,hint,progress,complete,target,nextStar:place.id==='observatory'?(STAR_ROUTE[s.stars.length]??null):null,canStudy};
}
