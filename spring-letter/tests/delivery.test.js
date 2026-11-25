import test from 'node:test';import assert from 'node:assert/strict';
import {createState,allocateCore,serialize,restore,commitLetter} from '../src/game-model.js';
import {createDelivery,deliveryIntent,deliveryWaypoint} from '../src/delivery.js';
const fresh=()=>{const s=createState();s.bridge.solved=true;return s;};
const origin={x:0,z:-43},left={x:-3,z:-46},right={x:3,z:-46},dock={x:0,z:-50.25};
function tick(d,s,p,trigger=false,active=true){const events=d.update(1,1/60,{state:s,player:p,trigger,active});for(const e of events)if(e.type==='allocate')assert.equal(allocateCore(s,e.id,e.purpose).ok,true);return events;}
test('after planting, onward guidance points to the remaining seed or the departure instead of undoing the planted choice',()=>{
 const s=fresh(),d=createDelivery();try{
  tick(d,s,origin,true);assert.equal(deliveryWaypoint(s,d.carried),null);
  tick(d,s,left);tick(d,s,left,true);assert.equal(deliveryIntent(s,left,d.carried).kind,'lift');assert.equal(deliveryWaypoint(s,d.carried).id,'source');
  tick(d,s,origin);tick(d,s,origin,true);tick(d,s,right);tick(d,s,right,true);assert.equal(deliveryWaypoint(s,d.carried).id,'dock');
  commitLetter(s);assert.equal(deliveryWaypoint(s,d.carried),null);
 }finally{d.dispose();}
});
test('ordinary actions carry, plant, lift, replant and preview without committing the ending',()=>{
 const s=fresh(),d=createDelivery();try{
 assert.equal(tick(d,s,origin,true)[0].type,'carry');assert.equal(d.carried,0);
 tick(d,s,left);assert.equal(tick(d,s,left,true)[0].type,'allocate');assert.deepEqual(s.cores,['memory',null]);
 tick(d,s,left);tick(d,s,left,true);assert.equal(d.carried,0);assert.deepEqual(s.cores,[null,null]);
 tick(d,s,right);tick(d,s,right,true);assert.deepEqual(s.cores,['voyage',null]);
 tick(d,s,origin);tick(d,s,origin,true);assert.equal(d.carried,1);
 tick(d,s,left);tick(d,s,left,true);assert.deepEqual(s.cores,['voyage','memory']);
 tick(d,s,dock);assert.equal(tick(d,s,dock,true)[0].type,'preview-send');assert.equal(s.ending,null);
 }finally{d.dispose();}
});
test('sustained trigger never performs an accidental second action across intent changes',()=>{
 const s=fresh(),d=createDelivery();try{
 tick(d,s,origin,true);for(let i=0;i<90;i++)assert.deepEqual(tick(d,s,left,true),[]);
 assert.equal(d.carried,0);assert.deepEqual(s.cores,[null,null]);tick(d,s,left);tick(d,s,left,true);
 assert.deepEqual(s.cores,['memory',null]);for(let i=0;i<90;i++)assert.deepEqual(tick(d,s,left,true),[]);
 assert.equal(d.carried,null);
 }finally{d.dispose();}
});
test('occupied beds do not consume the second core and distant actions explain the destination',()=>{
 const s=fresh(),d=createDelivery();try{
 s.cores[0]='memory';tick(d,s,origin,true);tick(d,s,left);const e=tick(d,s,left,true);
 assert.equal(e[0].type,'guide');assert.equal(d.carried,1);assert.deepEqual(s.cores,['memory',null]);
 tick(d,s,{x:0,z:-41});assert.equal(tick(d,s,{x:0,z:-41},true)[0].type,'guide');
 }finally{d.dispose();}
});
test('carried identity survives presentation recreation and rejects invalid or allocated identities',()=>{
 const s=fresh(),a=createDelivery(),b=createDelivery();try{
 tick(a,s,origin,true);assert.equal(a.persistCarried(),0);assert.equal(b.restoreCarried(a.persistCarried(),s),0);
 assert.equal(deliveryIntent(s,left,b.carried).kind,'plant');
 s.cores[0]='memory';assert.equal(b.restoreCarried(0,s),null);
 for(const id of [-1,2,'0',Infinity,{},undefined])assert.equal(b.restoreCarried(id,s),null);
 }finally{a.dispose();b.dispose();}
});
test('inactive presentation and held input across a modal cannot take, plant, or send',()=>{
 const s=fresh(),d=createDelivery();try{
 assert.deepEqual(tick(d,s,origin,true,false),[]);assert.deepEqual(tick(d,s,origin,true,true),[]);
 assert.equal(d.carried,null);tick(d,s,origin);tick(d,s,origin,true);assert.equal(d.carried,0);
 }finally{d.dispose();}
});
test('closed or completed chapters expose no delivery action',()=>{
 const s=createState();assert.equal(deliveryIntent(s,origin,null),null);s.bridge.solved=true;s.ending='memory+season';assert.equal(deliveryIntent(s,origin,null),null);
});

test('real model saves keep the held identity across take, plant and lift without duplicating a core',()=>{
 let state=fresh();state.started=true;state.p1.solved=state.wind.solved=true;let d=createDelivery();
 const recreate=()=>{state.deliveryCarried=d.persistCarried();const restored=restore(serialize(state));d.dispose();d=createDelivery();d.restoreCarried(restored.deliveryCarried,restored);state=restored;};
 try{
 tick(d,state,origin,true);recreate();assert.equal(d.carried,0);assert.deepEqual(state.cores,[null,null]);
 tick(d,state,left);tick(d,state,left,true);recreate();assert.equal(d.carried,null);assert.deepEqual(state.cores,['memory',null]);
 tick(d,state,origin);tick(d,state,origin,true);recreate();assert.equal(d.carried,1);assert.deepEqual(state.cores,['memory',null]);
 tick(d,state,right);tick(d,state,right,true);recreate();assert.equal(d.carried,null);assert.deepEqual(state.cores,['memory','voyage']);
 tick(d,state,left);tick(d,state,left,true);recreate();assert.equal(d.carried,0);assert.deepEqual(state.cores,[null,'voyage']);
 }finally{d.dispose();}
});
test('malformed and contradictory carried saves are rejected by authoritative restoration',()=>{
 const raw=fresh();raw.p1.solved=raw.wind.solved=true;raw.cores=['memory',null];
 for(const bad of [0,'1',-1,2,{},[],true,Infinity]){raw.deliveryCarried=bad;assert.equal(restore(serialize(raw)).deliveryCarried,null);}
 raw.deliveryCarried=1;assert.equal(restore(serialize(raw)).deliveryCarried,1);
 raw.bridge.solved=false;assert.equal(restore(serialize(raw)).deliveryCarried,null);
 raw.bridge.solved=true;raw.cores=['memory','voyage'];raw.ending='memory+voyage';assert.equal(restore(serialize(raw)).deliveryCarried,null);
});
test('canceling a letter preview leaves allocations editable and subsequent confirmation remains authoritative',()=>{
 const s=fresh(),d=createDelivery();s.cores=['memory','season'];try{
 tick(d,s,dock,true);assert.equal(s.ending,null);
 tick(d,s,left);tick(d,s,left,true);assert.equal(d.carried,0);assert.deepEqual(s.cores,[null,'season']);
 tick(d,s,right);tick(d,s,right,true);assert.deepEqual(s.cores,['voyage','season']);
 tick(d,s,dock);assert.equal(tick(d,s,dock,true)[0].type,'preview-send');assert.equal(s.ending,null);
 assert.equal(commitLetter(s).ok,true);assert.equal(s.ending,'season+voyage');
 tick(d,s,dock);assert.deepEqual(tick(d,s,dock,true),[]);
 }finally{d.dispose();}
});
