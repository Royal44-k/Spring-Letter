/** Authored courier routes. Pure rules: no renderer, DOM, storage, or random clock. */
export const RESONANCE_SAVE_KEY='spring-letter:resonance:v1';
const TAU=Math.PI*2;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number.isFinite(n)?n:a));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const station=(id,title,x,z,cz,goal,duration,need,offsets)=>Object.freeze({id,title,x,z,cx:0,cz,radius:5.9,goal,duration,need,nodes:Object.freeze(offsets.map(([nx,nz,kind='drift',motion=0],i)=>Object.freeze({id:i,x:nx,z:nz+cz,kind,motion,phase:i*1.73}))) });
export const RESONANCE_ROUTES=Object.freeze([
 station('dawn','第一阵春风',3,4,0,5,75,0,[[4.8,1.6], [3.8,-2.5], [0,-4.8],[-3.8,-2.5],[-4.5,2],[-1.8,4.8,'swift',.35],[4.6,-.8,'swift',.3],[-2.3,-4.5,'swift',.35]]),
 station('crosswind','穿过回旋的风',3,-12,-16,6,80,1,[[4.7,1.4],[3.5,-2.8],[0,-4.6],[-3.6,-2.8],[-4.7,1.2],[-1.8,4.5],[4.4,-.9,'swift',.55],[1.7,-4.4,'swift',.45],[-4.4,-.9,'swift',.55],[.4,3.9,'swift',.5]]),
 station('homeward','把远方带回来',3,-42,-46,7,90,2,[[4.5,.8],[2.5,-3.8],[-2.5,-3.8],[-4.5,.8],[-2,4.3],[4.2,-1.6,'swift',.55],[.4,-4.5,'swift',.55],[-4.3,-1.5,'swift',.55],[-.9,3.8,'swift',.45],[1.5,2.9,'swift',.5]])
]);
export const routeById=id=>RESONANCE_ROUTES.find(route=>route.id===id);
export const routeUnlocked=(route,progress={})=>route.need===0||(route.need===1?progress.p1?.solved===true:progress.bridge?.solved===true);
const freshRecord=()=>({best:0,completions:0,grade:0,most:0});
export function createResonanceState(saved){
 let data=saved;try{if(typeof saved==='string')data=JSON.parse(saved);}catch{data=null;}
 const records=Object.fromEntries(RESONANCE_ROUTES.map(route=>[route.id,freshRecord()]));
 if(data?.version===1)for(const route of RESONANCE_ROUTES){const r=data.records?.[route.id];if(r&&typeof r==='object'){const completions=Math.floor(clamp(r.completions,0,9999));records[route.id]={best:completions?Math.floor(clamp(r.best,0,10000)):0,completions,grade:completions?Math.floor(clamp(r.grade,1,3)):0,most:completions?Math.floor(clamp(r.most,route.goal,route.nodes.length)):0};}}
 return {version:1,records,run:null,result:null};
}
export function serializeResonance(state){return JSON.stringify({version:1,records:state.records});}
export function resonanceNodePosition(route,node,elapsed){
 const phase=elapsed*.8+node.phase;
 return {x:node.x+Math.sin(phase)*node.motion,z:node.z+Math.cos(phase*.77)*node.motion*.65};
}
export function resonanceNodeOpen(route,node,elapsed){return route.id!=='homeward'||node.kind!=='swift'||Math.sin(elapsed*TAU/4.2+node.phase)>-.4;}
export function resonanceUntilOpen(route,node,elapsed){if(resonanceNodeOpen(route,node,elapsed))return 0;const phase=((elapsed*TAU/4.2+node.phase)%TAU+TAU)%TAU;return ((TAU+Math.asin(-.4)-phase+TAU)%TAU)*4.2/TAU;}
export function resonanceNodeState(route,node,run){
 const requiresDash=node.kind==='swift',requiresEscort=route.id==='crosswind'&&!requiresDash,requiresWalking=route.id==='homeward'&&!requiresDash,open=resonanceNodeOpen(route,node,run?.elapsed||0);
 const blockedReason=requiresDash&&!run?.dashing?'dash':requiresDash&&!open?'closed':requiresEscort&&!run?.escort?.near?'escort':requiresWalking&&run?.dashing?'walking':null;
 return {requiresDash,requiresEscort,requiresWalking,open,untilOpen:resonanceUntilOpen(route,node,run?.elapsed||0),available:!run?.collected.includes(node.id)&&!blockedReason,blockedReason};
}
const pickupHints={dash:'这朵金色花灵随急风走。按住 Shift 踏风，再掠过它。',closed:'这朵花灵正在合拢。等金色花冠张开，再踏风掠过。',escort:'游絮还在身后追赶。稍等它靠近，再一起走过银白花灵。',walking:'银白花灵怕急风。松开 Shift，放慢脚步，再轻轻走过它。'};
function keepEscortOnLand(escort){const radius=Math.hypot(escort.x,escort.z+16);if(radius>5.7){escort.x*=5.7/radius;escort.z=-16+(escort.z+16)*5.7/radius;}}
function spawnEscort(player){const escort={x:player.x-.55,z:player.z+.35,moving:false,waiting:false};keepEscortOnLand(escort);escort.distance=distance(escort,player);escort.near=escort.distance<=2;return escort;}
function routeHint(route,run){
 if(route.id==='crosswind')return run?.escort?.near===false?'游絮还在追上来。等它靠近，再一起接住银白花灵；金色可以独自踏风去追。':'游絮就在身边。一起接银白花灵；踏风追金色后，记得等它跟上。';
 return route.id==='homeward'?'银白要松开 Shift 慢行接近；金色花冠张开时，再踏风掠过。':'银白走近拾取 · 金色按住 Shift 踏风 · 连续抵达能续起和声。';
}
export function resonanceHazards(route,elapsed){
 if(route.id==='dawn')return [];
 return [0,1].map(i=>{const a=elapsed*(route.id==='homeward'?.42:.32)+i*Math.PI;return {x:Math.cos(a)*2.9,z:route.cz+Math.sin(a)*2.9,radius:.68};});
}
function nearStation(player,route){return distance(player,route)<1.65;}
function copy(state){return {...state,records:{...state.records},run:state.run?{...state.run,collected:[...state.run.collected],escort:state.run.escort?{...state.run.escort}:null,previous:state.run.previous?{...state.run.previous}:null}:null,result:state.result?{...state.result}:null};}
function bank(state,route){
 const run=state.run,old=state.records[route.id],score=Math.round(run.score+Math.max(0,route.duration-run.elapsed)*2),grade=run.collected.length===route.nodes.length?3:run.collected.length>=route.goal+1?2:1;
 const record={best:Math.max(old.best,score),completions:old.completions+1,grade:Math.max(old.grade,grade),most:Math.max(old.most,run.collected.length)};
 state.records[route.id]=record;state.result={id:route.id,success:true,score,grade,collected:run.collected.length,best:record.best,first:old.completions===0,remaining:10};state.run=null;
 return {type:'complete',id:route.id,score,grade,collected:run.collected.length,best:record.best,first:old.completions===0,refill:1,text:grade===3?'你把整片春风带回来了。花巢里，多了一段完整的和声。':'风落进花巢，沿岸的花重新亮了起来。'};
}
export function attemptResonance(previous,player,progress={}){
 const state=copy(previous);if(!Number.isFinite(player?.x)||!Number.isFinite(player?.z))return {state,ok:false,signals:[],reason:'先站稳，再把风送出去。'};
 if(state.run){const route=routeById(state.run.id);if(!nearStation(player,route))return {state,ok:false,signals:[],reason:'沿着花粉回到起点的花巢，再按 E 送回春风。'};if(state.run.collected.length<route.goal)return {state,ok:false,signals:[],reason:`还差 ${route.goal-state.run.collected.length} 朵花灵。${routeHint(route,state.run)}`};return {state,ok:true,signals:[bank(state,route)]};}
 const route=RESONANCE_ROUTES.find(r=>routeUnlocked(r,progress)&&nearStation(player,r));if(!route)return {state,ok:false,signals:[],reason:'走近岸边发光的花巢，再开始送春。'};
 state.result=null;state.run={id:route.id,elapsed:0,collected:[],score:0,combo:0,chainAge:0,bumpCooldown:0,reminder:0,hintReason:null,dashing:false,escort:route.id==='crosswind'?spawnEscort(player):null,previous:{x:player.x,z:player.z},outside:0};
 return {state,ok:true,signals:[{type:'start',id:route.id,refill:1,text:`带回至少 ${route.goal} 朵花灵。${routeHint(route,state.run)}\n凑够后回花巢按 E，也可以再绕远一点。`} ]};
}
export function cancelResonance(previous){const state=copy(previous),id=state.run?.id;state.run=null;state.result=null;return {state,signals:id?[{type:'cancel',id,text:'这一程先放下。回来时，花巢还在。'}]:[]};}
function segmentDistance(point,a,b){const dx=b.x-a.x,dz=b.z-a.z,t=clamp(((point.x-a.x)*dx+(point.z-a.z)*dz)/(dx*dx+dz*dz||1),0,1);return Math.hypot(point.x-a.x-t*dx,point.z-a.z-t*dz);}
function followEscort(run,player,dt,signals){
 const escort=run.escort;if(!escort)return;
 const dx=player.x-escort.x,dz=player.z-escort.z,d=Math.hypot(dx,dz),step=Math.min(Math.max(0,d-.7),3.65*dt,Math.max(0,d-.7)*5*dt);
 if(d>.001){escort.x+=dx/d*step;escort.z+=dz/d*step;}
 // The companion remains over the existing island even during an abandoned exit.
 keepEscortOnLand(escort);
 escort.moving=step>.001;escort.distance=distance(escort,player);escort.near=escort.distance<=2;
 if(escort.waiting&&escort.near){escort.waiting=false;run.reminder=0;run.hintReason=null;signals.push({type:'hint',id:run.id,reason:'escort-rejoined',text:'游絮跟上来了。一起轻轻走过银白花灵，它就会把花接住。'});}
}
export function stepResonance(previous,input={},delta=0){
 const state=copy(previous),signals=[],dt=clamp(delta,0,.1),run=state.run;
 if(input.interactive===false||!dt){if(run)run.previous=null;return {state,signals};}
 if(state.result){state.result.remaining-=dt;if(state.result.remaining<=0)state.result=null;}
 if(!run)return {state,signals};const route=routeById(run.id),player=input.player;
 if(!Number.isFinite(player?.x)||!Number.isFinite(player?.z)){run.previous=null;return {state,signals};}
 run.elapsed+=dt;run.chainAge+=dt;run.bumpCooldown=Math.max(0,run.bumpCooldown-dt);run.reminder=Math.max(0,run.reminder-dt);
 if(run.chainAge>5.5)run.combo=0;
 if(run.elapsed>=route.duration){state.run=null;state.result={id:route.id,success:false,score:run.score,collected:run.collected.length,remaining:8};signals.push({type:'timeout',id:route.id,text:'风暂时散了。走回花巢，按 E 就能重新出发；已经寄出的春信不会丢失。'});return {state,signals};}
 const outside=Math.hypot(player.x-route.cx,player.z-route.cz)>route.radius+1.6;run.outside=outside?run.outside+dt:0;
 if(run.outside>2.5){state.run=null;signals.push({type:'cancel',id:route.id,text:'离开花庭，这一程暂时停下。花巢的最好记录仍然保留。'});return {state,signals};}
 const before=run.previous||player,teleported=distance(before,player)>3;run.previous={x:player.x,z:player.z};run.dashing=input.dashing===true;if(teleported||outside)return {state,signals};
 followEscort(run,player,dt,signals);
 const moved=distance(before,player)>.0005;
 if(!input.dashing&&!run.bumpCooldown&&resonanceHazards(route,run.elapsed).some(h=>segmentDistance(h,before,player)<h.radius)){
  run.combo=0;run.chainAge=6;run.bumpCooldown=1.5;signals.push({type:'bump',id:route.id,slowFor:.55,text:'回旋风打断了连奏。绕开它，或踏风穿过；手中的花灵不会丢。'});
 }
 for(const node of route.nodes){
  if(run.collected.includes(node.id))continue;const p=resonanceNodePosition(route,node,run.elapsed);
  if(!moved||segmentDistance(p,before,player)>(node.kind==='swift'?.78:.88))continue;
  const availability=resonanceNodeState(route,node,run);
  if(availability.blockedReason){const reason=availability.blockedReason;if(reason==='escort')run.escort.waiting=true;if(!run.reminder||run.hintReason!==reason){signals.push({type:'hint',id:route.id,node:node.id,reason,text:pickupHints[reason]});run.reminder=2.5;run.hintReason=reason;}continue;}
  run.collected.push(node.id);run.combo++;run.chainAge=0;const points=Math.round((node.kind==='swift'?180:100)*(1+Math.min(8,run.combo-1)*.2));run.score+=points;
  signals.push({type:'collect',id:route.id,node:node.id,kind:node.kind,points,combo:run.combo,score:run.score,x:p.x,z:p.z,refill:node.kind==='swift'?.32:.12});
  if(run.collected.length===route.goal)signals.push({type:'ready',id:route.id,text:'春风已经足够。回发光的花巢按 E 送回，或继续收齐这一庭的花灵。'});
 }
 return {state,signals};
}
export function resonanceContext(state,player={x:0,z:6},progress={}){
 const run=state.run,route=run?routeById(run.id):RESONANCE_ROUTES.find(r=>routeUnlocked(r,progress)&&distance(r,player)<3.8);
 if(!route)return {active:false,near:false,id:null,title:'',objective:'',hint:'',progress:0};
 const record=state.records[route.id],atStart=nearStation(player,route),count=run?.collected.length||0,ready=!!run&&count>=route.goal,complete=count===route.nodes.length;
 return {id:route.id,title:route.title,active:!!run,near:true,atStart,readyToBank:ready,escortNear:run?.escort?.near??null,escortDistance:run?.escort?.distance??null,movementRule:route.id==='crosswind'?'escort':route.id==='homeward'?'slow-fast':'gather',actionLabel:run?(ready?'送回春风':'继续寻花'):(record.completions?'再送一阵风':'追风送春'),goal:route.goal,total:route.nodes.length,collected:count,progress:Math.min(1,count/route.goal),score:run?.score||0,combo:run?.combo||0,remaining:run?Math.ceil(route.duration-run.elapsed):route.duration,best:record.best,grade:record.grade,completed:record.completions>0,start:{x:route.x,z:route.z},objective:run?(ready?(complete?'这一庭的花灵齐了，带它们回家':`现在回巢，或寻找余下的 ${route.nodes.length-count} 朵`):route.id==='crosswind'?`与游絮一起带回 ${route.goal} 朵花灵`:`带回 ${route.goal} 朵花灵`):'让花尘陪你走一段有风的路',hint:run?(complete?'花粉细线通往起点。靠近花巢按 E，送回完整的和声。':routeHint(route,run)):route.id==='dawn'?'靠近花巢按 E 出发。选择自己的路线，把花灵带回来。':`靠近花巢按 E 出发。${routeHint(route)}`};
}
