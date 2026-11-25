import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMomentKeepsake} from '../src/moment-keepsake.js';

const rain=()=>({edition:2,choice:'tree',artwork:{version:1,positions:{tree:{x:-.65,y:2.08},window:{x:.52,y:1.77},bloom:{x:.08,y:1.14}},selected:'bloom'}});
const wind=()=>({edition:2,choice:'lamp',artwork:{version:1,gate:5,distance:73,x:.12,y:2.04,completed:true,misses:10,elapsed:183.2}});
const tide=()=>({edition:2,choice:'new',artwork:{version:1,notes:[[true,false,false,false,true,false,false,false],[false,false,true,false,false,false,true,false],[false,true,false,false,false,false,false,true]],heardSignature:'10001000:00100010:01000001'}});
const freeze=value=>{if(value&&typeof value==='object'){Object.freeze(value);Object.values(value).forEach(freeze);}return value;};

test('old editions, missing art, unknown letters and malformed choices leave the existing letter intact',()=>{
 for(const id of ['rain','wind','tide'])for(const value of [null,undefined,{},[],{edition:1,artwork:{version:1}},{edition:2,choice:'invalid',artwork:{version:1}},{edition:2,choice:'tree'}])assert.equal(renderMomentKeepsake(id,value),'');
 assert.equal(renderMomentKeepsake('unknown',rain()),'');
 const old=rain();old.edition=1;assert.equal(renderMomentKeepsake('rain',old),'');
 const future=rain();future.artwork.version=2;assert.equal(renderMomentKeepsake('rain',future),'');
});

test('every keepsake is responsive standalone SVG with accessible words and no external resource or interactive claim',()=>{
 for(const [id,entry]of [['rain',rain()],['wind',wind()],['tide',tide()]]){
  const svg=renderMomentKeepsake(id,entry);assert.ok(svg.startsWith('<svg '));assert.ok(svg.endsWith('</svg>'));
  assert.match(svg,/viewBox="0 0 720 300"/);assert.match(svg,/preserveAspectRatio="xMidYMid meet"/);assert.match(svg,/role="img"/);assert.match(svg,/<title>.+<\/title><desc>.+<\/desc>/);
  assert.doesNotMatch(svg,/<(?:script|image|foreignObject|iframe|audio|animate|use)\b|\bhref\s*=|\bon\w+\s*=|url\(|javascript:|点击播放|播放按钮/i);
 }
});

test('rendering is deterministic and never mutates committed artwork',()=>{
 for(const [id,entry]of [['rain',rain()],['wind',wind()],['tide',tide()]]){
  const frozen=freeze(entry),before=JSON.stringify(frozen),first=renderMomentKeepsake(id,frozen);
  assert.ok(first.length>1000);assert.equal(renderMomentKeepsake(id,frozen),first);assert.equal(JSON.stringify(frozen),before);
 }
});

test('rain positions are taken from the actual three papers rather than an authored finished arrangement',()=>{
 const entry=rain(),first=renderMomentKeepsake('rain',entry);
 assert.match(first,/data-pane="tree" data-x="-0.65" data-y="2.08"/);
 entry.artwork.positions.tree={x:-1.32,y:1.08};const changed=renderMomentKeepsake('rain',entry);
 assert.notEqual(changed,first);assert.match(changed,/data-pane="tree" data-x="-1.32" data-y="1.08"/);
 assert.equal((changed.match(/data-pane=/g)||[]).length,3);
 entry.choice='shoot';const newFlower=renderMomentKeepsake('rain',entry);assert.notEqual(newFlower,changed);assert.match(newFlower,/让窗里开出新花/);assert.doesNotMatch(newFlower,/留住窗前的树影/);
});

test('invalid rain coordinates cannot produce a misleading or unbounded illustration',()=>{
 for(const [field,value]of [['x',NaN],['y',Infinity],['x','<svg onload=alert(1)>'],['x',99],['y',-.1]]){
  const entry=rain();entry.artwork.positions.tree[field]=value;assert.equal(renderMomentKeepsake('rain',entry),'');
 }
 const incomplete=rain();delete incomplete.artwork.positions.bloom;assert.equal(renderMomentKeepsake('rain',incomplete),'');
});

test('wind uses the saved progress to mark the five known gates without printing scores or inventing a flight trace',()=>{
 const entry=wind();entry.artwork.gate=3;entry.artwork.distance=45;
 const svg=renderMomentKeepsake('wind',entry);
 assert.equal((svg.match(/data-gate=/g)||[]).length,5);assert.equal((svg.match(/data-passed="true"/g)||[]).length,3);assert.equal((svg.match(/data-passed="false"/g)||[]).length,2);
 assert.match(svg,/data-wing="saved-position" data-distance="45"/);assert.match(svg,/不表示完整飞行轨迹/);assert.doesNotMatch(svg,/misses|elapsed|183\.2|分数|得分|失误|用时/);
 entry.artwork.gate=4;entry.artwork.distance=60;const next=renderMomentKeepsake('wind',entry);assert.equal((next.match(/data-passed="true"/g)||[]).length,4);assert.notEqual(svg,next);
});

test('wind rejects missing and unsafe saved state and reflects the actual recipient choice',()=>{
 for(const [field,value]of [['gate',1.5],['gate',6],['gate',-1],['distance',Infinity],['distance',999],['x',NaN],['y',-4]]){
  const entry=wind();entry.artwork[field]=value;assert.equal(renderMomentKeepsake('wind',entry),'');
 }
 const entry=wind();assert.match(renderMomentKeepsake('wind',entry),/将信送到迎客灯下/);entry.choice='sail';assert.match(renderMomentKeepsake('wind',entry),/将风留在护种帆上/);
});

test('every tide petal group corresponds exactly to one saved voice/beat including real rests',()=>{
 const entry=tide(),svg=renderMomentKeepsake('tide',entry);
 assert.equal((svg.match(/data-cell=/g)||[]).length,24);assert.equal((svg.match(/data-keepsake-beat=/g)||[]).length,8);
 for(let voice=0;voice<3;voice++)for(let beat=0;beat<8;beat++)assert.ok(svg.includes(`data-cell="${voice}:${beat}" data-on="${entry.artwork.notes[voice][beat]}"`));
 assert.equal((svg.match(/data-on="true"/g)||[]).length,6);
 entry.artwork.notes[0][0]=false;entry.artwork.notes[2][3]=true;
 const changed=renderMomentKeepsake('tide',entry);assert.notEqual(changed,svg);assert.match(changed,/data-cell="2:3" data-on="true"/);assert.match(changed,/data-cell="0:0" data-on="false"/);
});

test('a valid blank score stays blank; malformed note dimensions and non-boolean cells are not coerced',()=>{
 const entry=tide();entry.artwork.notes=Array.from({length:3},()=>Array(8).fill(false));const svg=renderMomentKeepsake('tide',entry);assert.ok(svg);assert.equal((svg.match(/data-on="true"/g)||[]).length,0);
 for(const notes of [null,[],Array.from({length:2},()=>Array(8).fill(false)),Array.from({length:3},()=>Array(9).fill(false)),[[1,...Array(7).fill(false)],Array(8).fill(false),Array(8).fill(false)]]){const bad=tide();bad.artwork.notes=notes;assert.equal(renderMomentKeepsake('tide',bad),'');}
});

test('untrusted strings and prototype-shaped properties are never included in generated markup',()=>{
 const payload='<script>alert("unsafe")</script><svg onload="alert(1)">';
 for(const [id,entry]of [['rain',rain()],['wind',wind()],['tide',tide()]]){
  entry.title=payload;entry.text=payload;entry.artwork.note=payload;entry.artwork.selected=payload;entry.artwork.__protoValue=payload;
  const svg=renderMomentKeepsake(id,entry);assert.ok(svg);assert.doesNotMatch(svg,/unsafe|onload|<script|__protoValue/);
  entry.choice=payload;assert.equal(renderMomentKeepsake(id,entry),'');
 }
 assert.equal(renderMomentKeepsake('__proto__',rain()),'');assert.equal(renderMomentKeepsake('constructor',rain()),'');
 const getter={get edition(){throw new Error('untrusted getter');}};assert.equal(renderMomentKeepsake('rain',getter),'');
});
