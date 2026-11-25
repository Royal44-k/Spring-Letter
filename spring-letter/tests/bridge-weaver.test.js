import test from 'node:test';
import assert from 'node:assert/strict';
import { BRIDGE_WEAVE_ROUTES, createBridgeWeaveController, createBridgeWeaver } from '../src/bridge-weaver.js';
import { createState, setStructure } from '../src/game-model.js';
import { PLATFORMS } from '../src/layout.js';

function fixture(origin='A') {
  const state=createState();state.p1.solved=state.wind.solved=true;state.bridge.platform=origin;
  const player={...PLATFORMS[origin]};state.player={...state.player,...player,safe:'pool'};
  return {state,player,interactive:true};
}
function stroke(controller,input,shape,{release=true,reverse=false}={}) {
  const route=BRIDGE_WEAVE_ROUTES.find(route=>route.shape===shape);
  const anchors=reverse?[...route.anchors].reverse():route.anchors;
  let signals=[];
  for(const position of anchors)signals.push(...controller.update(1/60,{...input,gesture:{active:true,position}}));
  if(release)signals.push(...controller.update(1/60,{...input,gesture:{active:false,released:true}}));
  return signals;
}

test('a complete ordered world-space stroke commits only on deliberate release',()=>{
  const input=fixture(),controller=createBridgeWeaveController();
  const before=JSON.stringify(input.state);
  assert.deepEqual(stroke(controller,input,'bridge_am',{release:false}),[]);
  assert.equal(controller.context.status,'ready');assert.equal(controller.context.progress,1);
  assert.equal(JSON.stringify(input.state),before,'recognizer must not write game state');
  const signals=controller.update(1/60,{...input,gesture:{active:false,released:true}});
  assert.deepEqual(signals,[{type:'construct',shape:'bridge_am'}]);
  assert.equal(setStructure(input.state,signals[0].shape).ok,true);
  assert.deepEqual(controller.update(1/60,{...input,gesture:{active:false,released:true}}),[]);
});

test('the middle platform chooses its adjacent route by the actual first anchors',()=>{
  for(const [shape,reverse] of [['bridge_am',true],['bridge_mf',false],['shield_rm',true]]){
    const controller=createBridgeWeaveController(),input=fixture('M');
    assert.deepEqual(stroke(controller,input,shape,{reverse}),[{type:'construct',shape}]);
  }
  const controller=createBridgeWeaveController();
  assert.deepEqual(stroke(controller,fixture('R'),'shield_rm'),[{type:'construct',shape:'shield_rm'}]);
});

test('remote starts, skipped routes and one-frame teleports cannot build a bridge',()=>{
  const input=fixture('A');
  const remote=createBridgeWeaveController();
  assert.deepEqual(stroke(remote,input,'bridge_mf'),[]);
  const jump=createBridgeWeaveController();
  jump.update(.016,{...input,gesture:{active:true,position:PLATFORMS.A}});
  jump.update(.016,{...input,gesture:{active:true,position:PLATFORMS.M}});
  assert.deepEqual(jump.update(.016,{...input,gesture:{active:false,released:true}}),[]);
  assert.equal(jump.context.status,'fading');
  const impostor=createBridgeWeaveController();
  assert.deepEqual(stroke(impostor,{...input,player:{x:0,z:-23}},'bridge_am'),[]);
});

test('occupied bridge, locked wind and nonadjacent platform cannot queue a later construction',()=>{
  const input=fixture('A'),controller=createBridgeWeaveController();
  input.state.bridge.support='bridge_am';
  assert.deepEqual(stroke(controller,input,'bridge_am'),[]);
  input.state.bridge.support=null;
  assert.deepEqual(controller.update(.016,{...input,gesture:{active:false,released:true}}),[]);
  input.state.wind.solved=false;
  assert.deepEqual(stroke(controller,input,'bridge_am'),[]);
  input.state.wind.solved=true;input.state.bridge.platform='F';
  assert.deepEqual(stroke(controller,input,'bridge_am'),[]);
});

test('lifting early, leaving the route, moving the player or losing focus cancels safely',()=>{
  const input=fixture(),route=BRIDGE_WEAVE_ROUTES[0];
  const early=createBridgeWeaveController();
  for(const position of route.anchors.slice(0,3))early.update(.016,{...input,gesture:{active:true,position}});
  assert.deepEqual(early.update(.016,{...input,gesture:{active:false,released:true}}),[]);
  assert.equal(early.context.status,'fading');
  const outside=createBridgeWeaveController();
  outside.update(.016,{...input,gesture:{active:true,position:PLATFORMS.A}});
  outside.update(.016,{...input,gesture:{active:true,position:{x:1.5,z:-26.5}}});
  assert.equal(outside.context.status,'fading');
  for(const interruption of [{interactive:false},{player:{x:0,z:-29}},{gesture:{active:false,released:false}},{gesture:{active:true,position:{x:NaN,z:-32}}}]){
    const controller=createBridgeWeaveController();stroke(controller,input,'bridge_am',{release:false});
    assert.deepEqual(controller.update(.016,{...input,gesture:{active:false,released:true},...interruption}),[]);
    assert.notEqual(controller.context.status,'committed');
  }
});

test('a failed stroke fades and a clean next stroke can succeed without reset buttons',()=>{
  const input=fixture(),controller=createBridgeWeaveController();
  controller.update(.016,{...input,gesture:{active:true,position:PLATFORMS.A}});
  controller.update(.016,{...input,gesture:{active:true,position:{x:1.6,z:-26.4}}});
  controller.update(.016,{...input,gesture:{active:false,released:true}});
  const fade=controller.context.fade;
  controller.update(.1,{...input,gesture:{active:false}});
  assert.ok(controller.context.fade<fade);
  assert.deepEqual(stroke(controller,input,'bridge_am'),[{type:'construct',shape:'bridge_am'}]);
});

test('visual adapter owns four render objects and disposes without mutating state',()=>{
  const weaver=createBridgeWeaver(),input=fixture();const before=JSON.stringify(input.state);
  assert.equal(weaver.group.children.length,4);
  weaver.update(0,.016,input);
  assert.equal(weaver.context.available,true);assert.equal(weaver.group.visible,true);
  weaver.update(.008,.008,{...input,interactive:false});
  assert.equal(weaver.group.visible,false,'gallery or title-screen mode must not leak world-space bridge guides');
  weaver.update(.016,.016,{...input,gesture:{active:true,position:PLATFORMS.A}});
  weaver.cancel();
  assert.equal(JSON.stringify(input.state),before);
  weaver.dispose();weaver.dispose();assert.equal(weaver.group.children.length,0);
  assert.deepEqual(weaver.update(1,.016,input),[]);
});
