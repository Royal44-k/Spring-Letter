/** Deterministic gameplay rules. Rendering and storage never own progression. */
import {createStory,restoreStory} from './story-model.js';
import {createExplorationState,restoreExplorationState} from './exploration-model.js';
import {createLetters,restoreLetters} from './letter-model.js';
import {createMoments,restoreMoments} from './moments-state.js';
import {createVoyageState,restoreVoyageState} from './voyage-model.js';
import {createAtlasState,restoreAtlasState} from './atlas-model.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
const step=(dt)=>clamp(finite(dt),0,.05);
const purposes=['memory','season','voyage'];
const connections={bridge_am:['A','M'],bridge_mf:['M','F'],shield_rm:['R','M']};
export const SAVE_KEY='spring-letter:journey:v1';

export function createState(){
 return {version:1,started:false,playedSeconds:0,bloom:.12,player:{x:0,z:6,safe:'garden'},
  p1:{solved:false,hold:0,broken:false,ink:0},
  wind:{x:-3,z:2,vx:0,vz:0,touched:false,solved:false,hold:0,returns:0,time:0},
  companion:{trust:0,awakened:false},
  bridge:{platform:'A',support:null,structure:'none',solved:false},
  cores:[null,null],deliveryCarried:null,ending:null,discoveries:[],story:createStory(),exploration:createExplorationState(),letters:createLetters(),lettersSent:null,moments:createMoments(),voyage:createVoyageState(),atlas:createAtlasState(),settings:{muted:false,quality:'balanced',reducedMotion:false,autoCamera:true,flowerForm:'lily',flowerSeries:'silver'}};
}

export function updateBloom(state,b,dt){
 state.bloom=clamp(finite(b,state.bloom),0,1);
 if(state.p1.solved)return;
 state.p1.hold=state.bloom>=.45&&state.bloom<=.6?state.p1.hold+step(dt):0;
 if(state.p1.hold>=.8){state.p1.solved=true;state.p1.hold=.8;}
}

export {stepWind} from './wind-flow.js';

export function setStructure(state,target){
 const b=state.bridge;
 if(!state.wind.solved)return {ok:false,reason:'先让风廊的光抵达。'};
 if(target!=='none'&&!connections[target])return {ok:false,reason:'这里没有可归形的锚位。'};
 if(b.support)return {ok:false,reason:'先回到石台，再收回承托你的结构。'};
 if(target!=='none'&&!connections[target].includes(b.platform))return {ok:false,reason:'先走到与这段路相接的石台。'};
 b.structure=target;return {ok:true};
}

export function allocateCore(state,id,purpose){
 if(state.ending)return {ok:false,reason:'春信已经启程；可以回到启程前重新安排。'};
 if(!state.bridge.solved)return {ok:false,reason:'沿花桥到达初绽穹顶后，再安放种核。'};
 if(![0,1].includes(id)||(purpose!==null&&!purposes.includes(purpose)))return {ok:false,reason:'请选择一个可见的花座。'};
 if(purpose!==null&&state.cores.some((p,i)=>i!==id&&p===purpose))return {ok:false,reason:'这个花座已有种核，另一个可以留给其他用途。'};
 state.cores[id]=purpose;return {ok:true};
}

export function commitLetter(state){
 if(state.ending)return {ok:false,reason:'这封春信已经出发。'};
 if(!state.bridge.solved||state.cores.some(p=>!purposes.includes(p))||new Set(state.cores).size!==2)return {ok:false,reason:'先为两枚种核安排不同的花座。'};
 state.ending=[...state.cores].sort().join('+');state.lettersSent=restoreLetters(state.letters);return {ok:true};
}

export function serialize(state){
 const {version,started,playedSeconds,bloom,player,p1,wind,companion,bridge,cores,deliveryCarried,ending,discoveries,story,exploration,letters,lettersSent,moments,voyage,atlas,settings}=state;
 return JSON.stringify({version,started,playedSeconds,bloom,player,p1,wind,companion,bridge,cores,deliveryCarried,ending,discoveries,story,exploration,letters,lettersSent,moments,voyage,atlas,settings});
}

export function restore(raw){
 const clean=createState();let data;
 try{data=typeof raw==='string'?JSON.parse(raw):null;}catch{return clean;}
 if(!data||Array.isArray(data)||data.version!==1)return clean;
 clean.started=data.started===true;clean.playedSeconds=clamp(finite(data.playedSeconds),0,8640000);clean.bloom=clamp(finite(data.bloom,.12),0,1);
 clean.p1.solved=data.p1?.solved===true;clean.p1.hold=clean.p1.solved?.8:0;
 clean.p1.broken=data.p1?.broken===true;clean.p1.ink=clean.p1.broken?clamp(finite(data.p1?.ink),0,1.2):0;
 clean.wind.solved=clean.p1.solved&&data.wind?.solved===true;
 clean.bridge.solved=clean.wind.solved&&data.bridge?.solved===true;
 clean.companion.awakened=clean.wind.solved&&data.companion?.awakened===true;
 clean.companion.trust=clean.companion.awakened?1:0;
 if(clean.wind.solved){clean.wind.x=3;clean.wind.z=-2;clean.wind.touched=true;clean.wind.hold=.8;}
 if(clean.wind.solved&&['A','R','M','F'].includes(data.bridge?.platform))clean.bridge.platform=data.bridge.platform;
 const structure=data.bridge?.structure;
 if(clean.wind.solved&&typeof structure==='string'&&(structure==='none'||Object.hasOwn(connections,structure)))clean.bridge.structure=structure;
 if(clean.wind.solved&&data.player?.safe==='pool'){
  const anchors={A:[0,-26],R:[-5,-29],M:[0,-32],F:[0,-38]};
  [clean.player.x,clean.player.z]=anchors[clean.bridge.platform];clean.player.safe='pool';
 }else if(clean.bridge.solved){clean.player={x:0,z:-43,safe:'finale'};}
 else if(clean.p1.solved){clean.player={x:0,z:-11,safe:'wind'};}
 if(clean.bridge.solved&&Array.isArray(data.cores)){
  for(let i=0;i<2;i++){const purpose=data.cores[i];if(purposes.includes(purpose)&&!clean.cores.includes(purpose))clean.cores[i]=purpose;}
 }
 const expected=clean.cores.every(p=>purposes.includes(p))?[...clean.cores].sort().join('+'):null;
 if(expected&&data.ending===expected)clean.ending=expected;
 if(clean.bridge.solved&&!clean.ending&&[0,1].includes(data.deliveryCarried)&&clean.cores[data.deliveryCarried]===null)clean.deliveryCarried=data.deliveryCarried;
 if(Array.isArray(data.discoveries))clean.discoveries=[...new Set(data.discoveries.filter(v=>['leaf','table','echo','protocol'].includes(v)))];
 clean.exploration=restoreExplorationState(data.exploration);clean.story=restoreStory(data.story);if(!data.story&&clean.p1.solved)clean.story.introSeen=true;
 clean.moments=restoreMoments(data.moments);clean.letters=restoreLetters(data.letters);clean.lettersSent=clean.ending?restoreLetters(data.lettersSent||data.letters):null;
 clean.voyage=clean.bridge.solved?restoreVoyageState(data.voyage):createVoyageState();
 clean.atlas=restoreAtlasState(data.atlas);
 clean.settings.muted=data.settings?.muted===true;clean.settings.reducedMotion=data.settings?.reducedMotion===true;
 clean.settings.autoCamera=data.settings?.autoCamera!==false;
 if(['lily','lotus','iris','dahlia'].includes(data.settings?.flowerForm))clean.settings.flowerForm=data.settings.flowerForm;
 if(['silver','crystal','lily','amber','celadon'].includes(data.settings?.flowerSeries))clean.settings.flowerSeries=data.settings.flowerSeries;
 if(['delicate','balanced','light'].includes(data.settings?.quality))clean.settings.quality=data.settings.quality;
 return clean;
}
