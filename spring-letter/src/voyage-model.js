/** The coast and voyage rules are deterministic and own no DOM or rendering. */
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const finite = (n, fallback = 0) => Number.isFinite(n) ? n : fallback;
const axis = n => clamp(finite(n), -1, 1);
const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const STAGES = ['idle', 'writing', 'tide', 'island', 'rigging', 'sailing', 'dawn', 'complete'];
const KINDS = ['lily', 'lotus', 'iris'];
const MAX_DISTANCE = 150;
const MAX_FLOWERS = 96;
export const BOAT_DOCK = Object.freeze({x:7, z:-27.4});
export const BOAT_MOORING = Object.freeze({x:7.8, z:-29});
export const JETTY = Object.freeze({minX:4.8,maxX:7.2,minZ:-28.05,maxZ:-26.75,height:.9});
export const TIDE_STONES = Object.freeze([
  [0,-2.8], [.45,-4.8], [-.35,-6.8], [.25,-8.8], [-.45,-10.8], [0,-13],
  [.45,-15.2], [-.35,-17.3], [.25,-19.4], [-.35,-21.5], [0,-23.5],
].map(([x,z], index) => {
  const high = [0,3,5,8,10].includes(index), oldLetter = index === 5;
  return Object.freeze({id:`tide-stone-${index}`,index,x,z,high,oldLetter,
    radius:oldLetter?2.1:high?1.65:1.3,height:high?.95:.36});
}));
const OLD_LETTER = TIDE_STONES[5];
const SHORE = {x:0,z:4};
const ISLAND = {x:0,z:-26};

export function createVoyageState() {
  return {version:1,stage:'idle',letter:{recipient:'',body:'',sealed:false,sealKind:'lily'},
    predecessor:false,oldRead:false,player:{x:0,z:5},checkpoint:0,elapsed:0,tideClock:0,
    boat:{...BOAT_MOORING,heading:0,speed:0},ropes:[false,false],sail:0,trim:0,distance:0,
    flowers:[],recoveries:0,recover:0,scatterCooldown:0,flowerSerial:0,flowerDistance:0,paused:false};
}
function copy(s) {
  return {...s,letter:{...s.letter},player:{...s.player},boat:{...s.boat},ropes:[...s.ropes],flowers:s.flowers.map(f=>({...f}))};
}
function safeText(value, max) {
  if (typeof value !== 'string') return '';
  const text = value.toWellFormed().normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return Array.from(text).slice(0,max).join('');
}
function validLetter(letter) { return !!(letter.sealed && letter.recipient.trim() && letter.body.trim()); }
function checkpointPoint(s) {
  const stone = TIDE_STONES[s.checkpoint - 1];
  return stone?.high ? {x:stone.x,z:stone.z} : {x:0,z:0};
}
function changeStage(s, stage, events) {
  if (s.stage === stage) return;
  s.stage = stage; events.push({type:'stage',stage});
}
export function voyageTideLevel(stateOrClock) {
  const clock = finite(typeof stateOrClock === 'number' ? stateOrClock : stateOrClock?.tideClock);
  return (1 - Math.cos((clock % 18) / 18 * Math.PI * 2)) / 2;
}
function onShore(p) { return dist(p,SHORE) <= 6; }
function onIsland(p) { return dist(p,ISLAND) <= 6 || p.x>=JETTY.minX&&p.x<=JETTY.maxX&&p.z>=JETTY.minZ&&p.z<=JETTY.maxZ; }
export function voyageGroundHeight(player) {
  if(!player||!Number.isFinite(player.x)||!Number.isFinite(player.z))return .9;
  const stone=TIDE_STONES.find(t=>t.high&&dist(player,t)<=t.radius);
  if(stone)return stone.height;
  if(onShore(player)||onIsland(player))return .9;
  return TIDE_STONES.find(t=>dist(player,t)<=t.radius)?.height??.08;
}
function stoneAt(p, level) {
  // High overlaps take priority: standing on a safe platform never depends on
  // array order or the tide state of a nearby low stepping stone.
  return TIDE_STONES.find(t => t.high && dist(p,t) <= t.radius)
    || (level <= .62 ? TIDE_STONES.find(t => dist(p,t) <= t.radius) : null);
}
function recoverPlayer(s, events) {
  s.player = checkpointPoint(s); s.recoveries = Math.min(99999,s.recoveries+1);s.recover=1;
  events.push({type:'recover',checkpoint:s.checkpoint});
}
function blossom(s, kind, events, manual = false) {
  const i=s.flowerSerial++,side=i%2?1:-1,offset=1.35+(i%5)*.34;
  const heading=s.boat.heading,back=1.25+(i%3)*.3;
  const x=s.boat.x+Math.cos(heading)*offset*side-Math.sin(heading)*back;
  const z=s.boat.z+Math.sin(heading)*offset*side+Math.cos(heading)*back;
  s.flowers.push({x,z,kind:KINDS.includes(kind)?kind:KINDS[i%KINDS.length],age:0});
  if(s.flowers.length>MAX_FLOWERS)s.flowers.splice(0,s.flowers.length-MAX_FLOWERS);
  if(manual)events.push({type:'flower',kind:s.flowers.at(-1).kind});
}

export function voyageCommand(state, command, payload = {}) {
  const s=copy(state),events=[];
  const fail=reason=>({state:s,events,ok:false,reason});
  const done=()=>({state:s,events,ok:true});
  if(command==='pause'){s.paused=true;s.boat.speed=0;return done();}
  if(command==='resume'){s.paused=false;return done();}
  if(s.paused)return fail('先回到旅程，再继续这一步。');
  if(command==='begin') {
    if(s.stage!=='idle')return fail('这段旅程已经开始。');
    changeStage(s,'writing',events);return done();
  }
  if(command==='write') {
    if(s.stage!=='writing')return fail('在岸边书桌，写好自己的信。');
    if(!payload||typeof payload!=='object'||['recipient','body'].some(k=>k in payload&&typeof payload[k]!=='string'))return fail('信上的文字需要是可读的正文。');
    const recipient='recipient' in payload?safeText(payload.recipient,60):s.letter.recipient;
    const body='body' in payload?safeText(payload.body,600):s.letter.body;
    if(recipient!==s.letter.recipient||body!==s.letter.body)s.letter.sealed=false;
    Object.assign(s.letter,{recipient,body});
    if(KINDS.includes(payload.sealKind))s.letter.sealKind=payload.sealKind;
    return done();
  }
  if(command==='seal') {
    if(s.stage!=='writing')return fail('信已经放进旅袋。');
    if(!s.letter.recipient.trim()||!s.letter.body.trim())return fail('写下收信人，也留下一句你想说的话。');
    if(!s.letter.sealed)events.push({type:'sealed'});
    s.letter.sealed=true;return done();
  }
  if(command==='unseal') {
    if(s.stage!=='writing')return fail('信已经收进旅袋，先让它陪你走过这一程。');
    if(s.letter.sealed)events.push({type:'unsealed'});s.letter.sealed=false;return done();
  }
  if(command==='leave-desk') {
    if(s.stage!=='writing'||!validLetter(s.letter))return fail('先写好自己的信，再亲手封缄。');
    changeStage(s,'tide',events);s.tideClock=0;return done();
  }
  if(command==='read-old'||command==='take-old') {
    if(!['tide','island'].includes(s.stage)||dist(s.player,OLD_LETTER)>2.15)return fail('走近潮汐中央的旧邮亭，那里有岑留下的信。');
    if(command==='read-old') {
      if(!s.oldRead)events.push({type:'old-read'});s.oldRead=true;return done();
    }
    if(!s.oldRead)return fail('先读一读岑留下的话，再把信收进旅袋。');
    if(!s.predecessor)events.push({type:'old-letter'});s.predecessor=true;
    s.checkpoint=Math.max(s.checkpoint,OLD_LETTER.index+1);return done();
  }
  if(command==='board') {
    if(s.stage!=='island'||!s.predecessor||!validLetter(s.letter))return fail('带着两封信抵达小岛，再去岸边找船。');
    if(dist(s.player,BOAT_DOCK)>1.9)return fail('再走近一点，船就在岛岸的小码头。');
    s.boat={...BOAT_MOORING,heading:0,speed:0};s.player={...BOAT_MOORING};
    changeStage(s,'rigging',events);events.push({type:'board'});return done();
  }
  if(command==='untie') {
    if(s.stage!=='rigging'||![0,1].includes(payload?.side))return fail('先登船，再解开左、右两侧的缆绳。');
    if(!s.ropes[payload.side])events.push({type:'rope',side:payload.side});
    s.ropes[payload.side]=true;return done();
  }
  if(command==='hoist') {
    if(s.stage!=='rigging')return fail('在船上沿着桅杆，慢慢升起花帆。');
    const previous=s.sail;s.sail=clamp(s.sail+clamp(finite(payload?.amount),0,.25),0,1);
    if(previous<1&&s.sail>=1)events.push({type:'sail'});return done();
  }
  if(command==='launch') {
    if(s.stage!=='rigging'||!s.ropes.every(Boolean)||s.sail<.999||!s.predecessor||!validLetter(s.letter))return fail('两侧缆绳都解开、花帆完全升起后，才可以离岸。');
    s.sail=1;changeStage(s,'sailing',events);events.push({type:'launch'});return done();
  }
  if(command==='scatter') {
    if(s.stage!=='sailing')return fail('航行时，把种子轻轻撒向船侧。');
    if(s.scatterCooldown<=0){blossom(s,payload?.kind,events,true);s.scatterCooldown=.38;}return done();
  }
  if(command==='trim') {
    if(s.stage!=='sailing'||!Number.isFinite(payload?.value))return fail('出海后，慢慢调整花帆迎风的角度。');
    s.trim=clamp(payload.value,-1,1);return done();
  }
  if(command==='depart') {
    if(s.stage==='complete')return done();
    if(s.stage!=='dawn')return fail('沿着海上的浮光，继续向晨曦驶去。');
    changeStage(s,'complete',events);events.push({type:'complete'});return done();
  }
  return fail('这一步暂时还没有展开。');
}

export function stepVoyage(state, dt, input = {}) {
  const s=copy(state),events=[],delta=clamp(finite(dt),0,.05);
  if(!delta||s.paused||s.stage==='idle'||s.stage==='complete')return {state:s,events};
  s.elapsed=Math.min(8640000,s.elapsed+delta);
  s.scatterCooldown=Math.max(0,s.scatterCooldown-delta);
  for(const flower of s.flowers)flower.age=Math.min(8640000,flower.age+delta);
  if(['writing','tide','island'].includes(s.stage)) {
    if(s.stage==='tide')s.tideClock=(s.tideClock+delta)%18;
    if(s.recover>0){s.recover=Math.max(0,s.recover-delta);return {state:s,events};}
    let x=axis(input?.right),z=-axis(input?.forward),length=Math.hypot(x,z);
    if(length>1){x/=length;z/=length;}
    const speed=input?.run===true?4.2:3.1;
    const next={x:s.player.x+x*speed*delta,z:s.player.z+z*speed*delta};
    if(s.stage==='writing') {if(onShore(next))s.player=next;return {state:s,events};}
    if(s.stage==='island') {if(onIsland(next))s.player=next;return {state:s,events};}
    if(!s.predecessor&&next.z < -14.6)next.z=-14.6;
    const stone=stoneAt(next,voyageTideLevel(s));
    if(onShore(next)||(s.predecessor&&onIsland(next))||stone) {
      s.player=next;
      if(stone?.high)s.checkpoint=Math.max(s.checkpoint,stone.index+1);
      if(s.predecessor&&next.z<=-24&&onIsland(next))changeStage(s,'island',events);
    } else recoverPlayer(s,events);
    return {state:s,events};
  }
  if(s.stage==='rigging') {
    const previous=s.sail;s.sail=clamp(s.sail+Math.max(0,axis(input?.hoist))*delta*.38,0,1);
    if(previous<1&&s.sail>=1)events.push({type:'sail'});return {state:s,events};
  }
  if(s.stage==='sailing') {
    s.trim=clamp(s.trim+axis(input?.trim)*delta*.7,-1,1);
    s.boat.heading=clamp(s.boat.heading+axis(input?.steer)*delta*.65,-.7,.7);
    const wind=.2+Math.sin(s.distance*.04)*.35;
    const catchWind=1-clamp(Math.abs(s.trim-wind)/1.4,0,1);
    const targetSpeed=(3.1+catchWind*1.9)*(input?.brake===true?.25:1);
    s.boat.speed+=(targetSpeed-s.boat.speed)*(1-Math.exp(-delta*2.8));
    const travel=Math.min(MAX_DISTANCE-s.distance,s.boat.speed*Math.cos(s.boat.heading)*delta);
    s.distance=clamp(s.distance+travel,0,MAX_DISTANCE);
    s.boat.x=clamp(s.boat.x+Math.tan(s.boat.heading)*travel,-25,25);
    s.boat.z=BOAT_MOORING.z-s.distance;s.player={x:s.boat.x,z:s.boat.z};
    if(s.distance-s.flowerDistance>=2.2){blossom(s,null,events);s.flowerDistance=s.distance;}
    if(input?.scatter===true&&s.scatterCooldown<=0){blossom(s,null,events,true);s.scatterCooldown=.38;}
    if(s.distance>=MAX_DISTANCE){s.boat.speed=0;changeStage(s,'dawn',events);events.push({type:'dawn'});}
  }
  return {state:s,events};
}

export function restoreVoyageState(data) {
  const s=createVoyageState();
  if(!data||typeof data!=='object'||Array.isArray(data)||data.version!==1)return s;
  s.letter={recipient:safeText(data.letter?.recipient,60),body:safeText(data.letter?.body,600),
    sealKind:KINDS.includes(data.letter?.sealKind)?data.letter.sealKind:'lily',sealed:false};
  s.letter.sealed=data.letter?.sealed===true&&!!(s.letter.recipient.trim()&&s.letter.body.trim());
  s.oldRead=data.oldRead===true;s.predecessor=s.oldRead&&data.predecessor===true;
  s.elapsed=clamp(finite(data.elapsed),0,8640000);s.recoveries=Math.floor(clamp(finite(data.recoveries),0,99999));
  s.ropes=[data.ropes?.[0]===true,data.ropes?.[1]===true];s.sail=clamp(finite(data.sail),0,1);s.trim=axis(data.trim);
  const rawStage=STAGES.includes(data.stage)?data.stage:'idle';
  s.stage=rawStage;
  if(s.stage!=='idle'&&s.stage!=='writing'&&!validLetter(s.letter))s.stage='writing';
  if(['island','rigging','sailing','dawn','complete'].includes(s.stage)&&!s.predecessor)s.stage='tide';
  if(['sailing','dawn','complete'].includes(s.stage)&&(!s.ropes.every(Boolean)||s.sail<.999))s.stage='rigging';
  if(['idle','writing'].includes(s.stage)){s.oldRead=false;s.predecessor=false;s.ropes=[false,false];s.sail=0;}
  if(['tide','island'].includes(s.stage)){s.ropes=[false,false];s.sail=0;}
  let index=Number.isInteger(data.checkpoint)?clamp(data.checkpoint,0,TIDE_STONES.length):0;
  if(index&&!TIDE_STONES[index-1]?.high)index=0;
  if(!s.predecessor)index=Math.min(index,OLD_LETTER.index+1);
  if(s.predecessor)index=Math.max(index,OLD_LETTER.index+1);
  if(['idle','writing'].includes(s.stage))index=0;
  s.checkpoint=index;
  if(s.stage==='tide')s.player=checkpointPoint(s);
  if(s.stage==='island')s.player={x:0,z:-24.2};
  if(['rigging','sailing','dawn','complete'].includes(s.stage))s.player={...BOAT_MOORING};
  if(['sailing','dawn','complete'].includes(s.stage)) {
    s.distance=clamp(finite(data.distance),0,MAX_DISTANCE);
    if(['dawn','complete'].includes(s.stage)&&s.distance<MAX_DISTANCE)s.stage='sailing';
    if(s.stage==='sailing'&&s.distance===MAX_DISTANCE)s.stage='dawn';
    s.boat={x:clamp(finite(data.boat?.x,BOAT_MOORING.x),-25,25),z:BOAT_MOORING.z-s.distance,heading:clamp(finite(data.boat?.heading),-.7,.7),speed:0};
    s.player={x:s.boat.x,z:s.boat.z};
    s.flowers=Array.isArray(data.flowers)?data.flowers.filter(f=>f&&Number.isFinite(f.x)&&Number.isFinite(f.z)&&KINDS.includes(f.kind)).slice(-MAX_FLOWERS).map(f=>({x:clamp(f.x,-32,32),z:clamp(f.z,BOAT_MOORING.z-MAX_DISTANCE-8,BOAT_MOORING.z+8),kind:f.kind,age:clamp(finite(f.age),0,8640000)})):[];
    s.flowerSerial=Math.floor(clamp(finite(data.flowerSerial,s.flowers.length),s.flowers.length,100000));s.flowerDistance=s.distance;
  }
  // A resumed tide waits at a dry high stone; a boat retains its earned route
  // but no momentum, held controls, recovery delay, or paused modal state.
  return s;
}

export function voyageStageInfo(state) {
  const s=state,info={
    idle:['尚未寄出的春信','把两处春天安排好，沿岸边的灯走向书桌。'],
    writing:['写给未曾谋面的人',s.letter.sealed?'封缄已落。带上自己的信，去潮汐中央寻找岑的旧邮亭。':'写下收信人和想说的话，再把花印落在信封上。'],
    tide:['潮汐留下的旧信',s.predecessor?'两封信都在旅袋里。退潮时沿石脊，走向前方小岛。':s.oldRead?'读完旧信后，把它收进旅袋；岑的旅程会与你一起继续。':'看一看潮水的呼吸。退潮时过低石，涨潮时停在高石；旧邮亭在半途。'],
    island:['岸边的一叶舟','沿小岛走向右前方的码头，岑留了一条船给后来的人。'],
    rigging:['把春风升上桅杆',!s.ropes.every(Boolean)?'解开船两侧的缆绳，再沿桅杆慢慢拉起花帆。':s.sail<.999?'缆绳已松开。把花帆升到顶，让它接住海风。':'花帆已经接住风。两封信在船上，亲手离岸吧。'],
    sailing:['一路繁花向海','左右掌舵，调整花帆迎风；把种子撒向船侧，让走过的海也开花。'],
    dawn:['收信人，尚在远方','曙光就在前面。再作一次启程的决定，让两封信去往新的春天。'],
    complete:['有些春天，送出去才属于我们','你的信和岑的旧信，在同一条船上继续向远方。'],
  }[s.stage]||['待寄出的春信','回到岸边，重新拾起旅程。'];
  const target=s.stage==='writing'?{x:0,z:1}:s.stage==='tide'?(s.predecessor?{x:0,z:-24.2}:{x:OLD_LETTER.x,z:OLD_LETTER.z}):s.stage==='island'?{...BOAT_DOCK}:null;
  return {stage:s.stage,title:info[0],hint:info[1],target,tideLevel:voyageTideLevel(s),distance:s.distance,progress:s.distance/MAX_DISTANCE};
}
