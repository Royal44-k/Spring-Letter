import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createState} from '../src/game-model.js';
import {deliveryIntent} from '../src/delivery.js';
// Run the production dispatcher; real browser checks cover click, touch and E.
const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const start=source.indexOf('function requestInteraction(');
const handler=source.slice(start,source.indexOf('\nfunction ',start+1));
function fixture(){
 const state=createState();state.bridge.solved=true;state.player={x:0,z:-43};
 const c={state,resonance:null,letterController:null,voyage:null,atlas:null,mode:'play',focus:null,modalPaused:false,delivery:{carried:null},deliveryTrigger:false,deliveryIntent,interactions:0};
 c.interact=()=>c.interactions++;vm.createContext(c);vm.runInContext(handler,c);return c;
}
test('ordinary action at the seed cup requests pickup without held-key state',()=>{
 const c=fixture();c.requestInteraction();assert.equal(c.deliveryTrigger,true);assert.equal(c.interactions,0);
});
test('between beds an action requests guidance rather than disappearing',()=>{
 const c=fixture();c.state.player={x:1.7,z:-42};c.requestInteraction();
 assert.equal(c.deliveryTrigger,true);assert.equal(deliveryIntent(c.state,c.state.player,null).kind,'walk');
});
test('normal close views retain the action to leave',()=>{
 const c=fixture();c.state.player={x:0,z:4};c.requestInteraction();assert.equal(c.interactions,1);assert.equal(c.deliveryTrigger,false);
 c.state.player={x:0,z:-43};c.focus='flower';c.requestInteraction();assert.equal(c.interactions,2);
});
test('modal and opening cannot queue a pickup behind the visible screen',()=>{
 const c=fixture();c.modalPaused=true;c.requestInteraction();assert.equal(c.deliveryTrigger,false);
 c.modalPaused=false;c.mode='opening';c.requestInteraction();assert.equal(c.deliveryTrigger,false);assert.equal(c.interactions,0);
});
test('an earned letter still opens its review instead of queuing a seed action',()=>{
 const c=fixture();c.state.ending='memory+season';c.state.cores=['memory','season'];c.requestInteraction();assert.equal(c.interactions,1);assert.equal(c.deliveryTrigger,false);
});
test('a nearby nest does not swallow seed actions unless actually at its start',()=>{
 const c=fixture();c.resonance={context:{near:true,atStart:false,active:false}};
 c.requestInteraction();assert.equal(c.deliveryTrigger,true);
});
test('an active run handles E as return-to-nest rather than consuming a seed',()=>{
 const c=fixture();let attempts=0;c.resonance={context:{active:true}};c.attemptResonance=()=>attempts++;
 c.requestInteraction();assert.equal(attempts,1);assert.equal(c.deliveryTrigger,false);
});
test('an idle nest cannot steal pickup at the overlapping edge of the terminal seed cup',()=>{
 const c=fixture();c.state.player={x:1.5,z:-42.5};c.resonance={context:{active:false,atStart:true}};let attempts=0;c.attemptResonance=()=>attempts++;
 assert.equal(deliveryIntent(c.state,c.state.player,null).kind,'take');c.requestInteraction();assert.equal(c.deliveryTrigger,true);assert.equal(attempts,0);
});
test('a nest still starts when the only delivery intent is a distant walk hint',()=>{
 const c=fixture();c.state.player={x:3,z:-42};c.resonance={context:{active:false,atStart:true}};let attempts=0;c.attemptResonance=()=>attempts++;
 assert.equal(deliveryIntent(c.state,c.state.player,null).kind,'walk');c.requestInteraction();assert.equal(attempts,1);assert.equal(c.deliveryTrigger,false);
});

test('a nearby letter opens in free roam while an active chase keeps ownership of E',()=>{
 const c=fixture();c.state.player={x:-12,z:-1};let opened=0,attempts=0;
 c.letterController={nearId:'rain',enter:id=>{assert.equal(id,'rain');opened++;}};
 c.requestInteraction();assert.equal(opened,1);assert.equal(c.interactions,0);
 c.resonance={context:{active:true}};c.attemptResonance=()=>attempts++;
 c.requestInteraction();assert.equal(attempts,1);assert.equal(opened,1,'E cannot enter a letter behind a running challenge');
});

test('an actionable seed pickup takes priority over a stale nearby-letter hint',()=>{
 const c=fixture();let opened=0;c.letterController={nearId:'rain',enter:()=>opened++};
 assert.equal(deliveryIntent(c.state,c.state.player,null).kind,'take');c.requestInteraction();
 assert.equal(c.deliveryTrigger,true);assert.equal(opened,0);
});

test('an active coastal chapter owns E without triggering a hidden seed pickup or garden interaction',()=>{
 const c=fixture();let coastActions=0;c.voyage={active:true,primary:()=>coastActions++};
 c.requestInteraction();assert.equal(coastActions,1);assert.equal(c.deliveryTrigger,false);assert.equal(c.interactions,0);
 c.modalPaused=true;c.requestInteraction();assert.equal(coastActions,1,'the outer modal remains the input owner');
});

test('an active atlas map owns E before retained coastal progress or nearby garden pickups',()=>{
 const c=fixture();let mapActions=0,coastActions=0;c.atlas={active:true,primary:()=>mapActions++};c.voyage={active:true,primary:()=>coastActions++};
 c.requestInteraction();assert.equal(mapActions,1);assert.equal(coastActions,0);assert.equal(c.deliveryTrigger,false);assert.equal(c.interactions,0);
 c.modalPaused=true;c.requestInteraction();assert.equal(mapActions,1);
});
