// Independent CPU-only save restoration probe. No DOM, browser, rendering or mutations to src.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {createState, restore, serialize} from '../../../spring-letter/src/game-model.js';

const seed = 0x5a17c0de, samples = 10000;
let randomState = seed;
function random() {
  randomState ^= randomState << 13; randomState ^= randomState >>> 17; randomState ^= randomState << 5;
  return (randomState >>> 0) / 4294967296;
}
const pick = values => values[Math.floor(random() * values.length)];
const clone = value => JSON.parse(JSON.stringify(value));
const purposes = ['memory','season','voyage'];
const structures = ['none','bridge_am','bridge_mf','shield_rm'];
const numbers = [-1e308,-999999,-1,-.1,0,.12,.5,.8,1,2,3,5.15,6.2,4095,999999,1e308];
const strings = ['', 'true', 'false', 'null', '1','memory','season','voyage','memory+season','season+voyage','memory+voyage','__proto__','constructor','toString','hasOwnProperty','none','bridge_am','bridge_mf','shield_rm','A','M','F','pool','finale'];
const special = [null,true,false,[],{},['memory','memory','voyage'],['bridge_am'],{toString:null},{toString:1},{toString:[],valueOf:null},{valueOf:'none'}];
function mixed(depth=0) {
  const kind = Math.floor(random() * (depth > 2 ? 4 : 6));
  if (kind === 0) return pick(numbers);
  if (kind === 1) return pick(strings);
  if (kind === 2) return clone(pick(special));
  if (kind === 3) return random() < .5;
  if (kind === 4) return Array.from({length:Math.floor(random()*8)},()=>mixed(depth+1));
  const result = Object.create(null);
  for(let i=0,n=Math.floor(random()*6);i<n;i++) result[pick(['done','solved','toString','valueOf','__proto__','0','stage','mask','travel','memory'])] = mixed(depth+1);
  return result;
}
const paths = [
  'version','started','bloom','player','player.x','player.z','player.safe','p1','p1.solved','p1.hold',
  'wind','wind.solved','wind.touched','wind.hold','wind.x','wind.z','wind.vx','wind.vz','companion','companion.awakened',
  'bridge','bridge.solved','bridge.platform','bridge.structure','bridge.support','cores','cores.0','cores.1','ending','discoveries',
  'story','story.introSeen','story.branches','story.branches.rhythm','story.branches.light','story.branches.memory',
  'story.motif','story.lightFound','story.memorySeen','story.memorySeen.closed','story.memorySeen.open','story.memoryBloom','story.seenChapters',
  'exploration','exploration.rain','exploration.rain.done','exploration.rain.rounds','exploration.rain.mask','exploration.rain.travel',
  'exploration.rain.clock','exploration.rain.best','exploration.wind','exploration.wind.done','exploration.wind.stage','exploration.wind.seed',
  'exploration.wind.hold','exploration.wind.bumps','exploration.tide','exploration.tide.done','exploration.tide.index','exploration.tide.hold',
  'exploration.seen','settings','settings.quality','settings.muted','settings.reducedMotion',
];
function mutate(root,path,value) {
  const parts=path.split('.');let node=root;
  for(const part of parts.slice(0,-1)) {
    if (!node[part] || typeof node[part] !== 'object') node[part]={};
    node=node[part];
  }
  node[parts.at(-1)] = value;
}
function validBase(index) {
  const s=createState(),stage=index%4;
  s.started=true;s.p1.solved=stage>=1;s.wind.solved=stage>=2;s.bridge.solved=stage>=3;
  s.companion.awakened=stage>=2;
  s.bridge.platform=pick(['A','R','M','F']);s.bridge.structure=pick(structures);
  s.player={x:pick(numbers),z:pick(numbers),safe:pick(['garden','wind','pool','finale'])};
  if(stage===3){const pair=pick([['memory','season'],['memory','voyage'],['season','voyage']]);s.cores=random()<.3?[null,null]:[...pair];if(s.cores.every(Boolean)&&random()<.5)s.ending=[...pair].sort().join('+');}
  s.story.motif=[1,2,0,1,2,0];s.story.branches.rhythm=random()<.5;
  s.story.lightFound=[true,true,true];s.story.memorySeen={closed:true,open:true};s.story.branches.memory=random()<.5;
  for(const key of ['rain','wind','tide']){s.exploration[key].done=random()<.4;s.exploration[key].rounds=Math.floor(random()*5);}
  s.exploration.wind.stage=Math.floor(random()*4);s.exploration.tide.index=Math.floor(random()*4);
  return s;
}
const targeted = [null,[],{},1,'saved',true,{version:2},
  ...[{toString:null},['bridge_am'],'__proto__','constructor','toString','hasOwnProperty'].map(structure=>({version:1,p1:{solved:true},wind:{solved:true},bridge:{structure}})),
  ...[null,[],{},['memory','memory','voyage'],['memory','voyage','season'],['memory','season']].map(cores=>({version:1,p1:{solved:true},wind:{solved:true},bridge:{solved:true},cores,ending:'memory+season'})),
  {version:1,p1:{solved:false},wind:{solved:true},bridge:{solved:true},cores:['memory','season'],ending:'memory+season'},
];
function makeSample(index) {
  if(index<targeted.length)return {category:'targeted',value:clone(targeted[index])};
  if(index%19===0)return {category:'arbitrary-root',value:mixed()};
  const value=validBase(index),edits=index%10===0?0:1+Math.floor(random()*8);
  for(let i=0;i<edits;i++)mutate(value,pick(paths),mixed());
  if(index%37===0){value.p1={solved:true};value.wind={solved:true};value.bridge={...value.bridge,structure:mixed()};}
  return {category:edits?'mixed-fields':'normalization-control',value};
}
const hash = path => crypto.createHash('sha256').update(fs.readFileSync(new URL(path,import.meta.url))).digest('hex');
const sourcePaths=['../../../spring-letter/src/game-model.js','../../../spring-letter/src/exploration-model.js','../../../spring-letter/src/story-model.js'];
const startedAt = new Date().toISOString(),start=performance.now();
const evidence={kind:'CPU-only deterministic save restore fuzz',seed:'0x'+seed.toString(16),prng:'xorshift32',samples,startedAt,node:process.version,
  sourceSha256:Object.fromEntries(sourcePaths.map(p=>[p.split('/').at(-1),hash(p)])),categories:{},passed:0,failed:0,violationCounts:{},firstFailures:[],
  coverage:{acceptedVersion:0,gateStages:[0,0,0,0],restoredEndings:0,endingValues:{},restoredCompletedGardens:0},
  invariants:['restore → serialize → restore does not throw','all restored numbers and player/seed coordinates are finite','exactly two core slots; only known purposes or null; no duplicate purpose','ending is null or the sorted pair of two distinct known purposes, preserved only from the exact input ending','wind requires p1; bridge requires wind; ending requires bridge; companion requires wind','restoration is idempotent after serialization','bridge structure is a known literal string','rain cannot retain a qualifying trace consumed by the normal simulation'],
  exclusions:['No browser, GPU, audio, build or real-time long run','JSON cannot carry functions, getters, circular references, NaN, or Infinity; finite extreme numbers are included','A structurally coherent saved ending is retained by design; this is not a tamper-proof authenticity check']};
function finiteNumbers(value,path='state') {
  if(typeof value==='number'&&!Number.isFinite(value))throw new Error('nonfinite:'+path);
  if(value&&typeof value==='object')for(const [k,v] of Object.entries(value))finiteNumbers(v,path+'.'+k);
}
function check(input,state,again) {
  const issues=[];const add=(condition,name)=>{if(!condition)issues.push(name);};
  try{finiteNumbers(state);}catch(e){issues.push(e.message);}
  add([state.player.x,state.player.z,state.exploration.wind.seed.x,state.exploration.wind.seed.z].every(Number.isFinite),'finite-coordinates');
  add(Array.isArray(state.cores)&&state.cores.length===2,'two-core-slots');
  add(state.cores.every(v=>v===null||purposes.includes(v)),'known-core-purposes');
  const used=state.cores.filter(v=>v!==null);add(new Set(used).size===used.length,'unique-core-purposes');
  if(state.ending!==null){add(used.length===2&&state.ending===[...used].sort().join('+'),'coherent-ending');add(state.ending===input?.ending,'not-invented-ending');add(state.bridge.solved,'ending-gate');}
  add(!state.wind.solved||state.p1.solved,'wind-gate');add(!state.bridge.solved||state.wind.solved,'bridge-gate');add(!state.companion.awakened||state.wind.solved,'companion-gate');
  add(structures.includes(state.bridge.structure),'known-structure-string');
  add(serialize(state)===serialize(again),'restore-idempotence');
  let bits=0;for(let i=0;i<12;i++)bits+=(state.exploration.rain.mask>>i)&1;
  add(!(bits>=11&&state.exploration.rain.travel>=5.15),'no-impossible-rain-trace');
  return issues;
}
for(let index=0;index<samples;index++) {
  const {category,value}=makeSample(index);evidence.categories[category]=(evidence.categories[category]||0)+1;
  const raw=JSON.stringify(value),input=JSON.parse(raw);let issues=[],state;
  try {
    state=restore(raw);const again=restore(serialize(state));issues=check(input,state,again);
    if(input?.version===1&&!Array.isArray(input))evidence.coverage.acceptedVersion++;
    evidence.coverage.gateStages[state.bridge.solved?3:state.wind.solved?2:state.p1.solved?1:0]++;
    if(state.ending){evidence.coverage.restoredEndings++;evidence.coverage.endingValues[state.ending]=(evidence.coverage.endingValues[state.ending]||0)+1;}
    evidence.coverage.restoredCompletedGardens+=['rain','wind','tide'].filter(k=>state.exploration[k].done).length;
  }catch(error){issues=['exception:'+error.message];}
  if(issues.length){evidence.failed++;for(const issue of issues)evidence.violationCounts[issue]=(evidence.violationCounts[issue]||0)+1;if(evidence.firstFailures.length<30)evidence.firstFailures.push({index,category,input,issues,restoredBridge:state?.bridge});}
  else evidence.passed++;
}
evidence.elapsedMs=+(performance.now()-start).toFixed(3);evidence.finishedAt=new Date().toISOString();
evidence.sourceUnchanged=sourcePaths.every(p=>evidence.sourceSha256[p.split('/').at(-1)]===hash(p));
const output=new URL('../'+(process.argv[2]||'v5-restore-fuzz-evidence.json'),import.meta.url);
fs.writeFileSync(output,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({output:output.pathname,passed:evidence.passed,failed:evidence.failed,violationCounts:evidence.violationCounts,coverage:evidence.coverage,sourceUnchanged:evidence.sourceUnchanged,elapsedMs:evidence.elapsedMs},null,2));
process.exitCode=evidence.failed?1:0;
