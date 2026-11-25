import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Exercise the actual main dispatcher, including its native/default boundary.
// Controller-only tests cannot detect a key leaking into the garden afterward.
const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const prefix=" window.addEventListener('keydown',e=>{";
const begin=source.indexOf(prefix)+prefix.length;
const end=source.indexOf(" });window.addEventListener('keyup'",begin);
assert.ok(begin>=prefix.length&&end>begin);
const production='function keydown(e){'+source.slice(begin,end)+'}';
function fixture(handler=()=>false){
 const calls=[],modal={open:false};
 const c={renderBlocked:()=>false,fullscreen:{isActive:()=>false,toggle:()=>calls.push('fullscreen')},performance:{now:()=>1000},fullscreenExitedAt:0,$:()=>modal,shaderPreparing:false,atlas:null,voyage:{active:true,handleKey:e=>{calls.push('coast:'+e.code);return handler(e);}},spaceHeld:false,focus:'voyage',storyDirector:{handleKey:()=>{calls.push('garden-story');return false;}},letterController:{handleKey:()=>{calls.push('garden-letter');return false;}},keys:new Set(),travel:{recenter:()=>calls.push('garden-camera')},requestInteraction:()=>calls.push('garden-interaction'),releaseFlower:()=>calls.push('garden-flower'),penMode:false,setPenMode:()=>calls.push('garden-pen'),showMap:()=>calls.push('garden-map')};
 vm.createContext(c);vm.runInContext(production,c);
 const fire=(code,extra={})=>{let prevented=0;const event={code,altKey:false,repeat:false,preventDefault:()=>prevented++,target:{matches:()=>false},...extra};c.keydown(event);return prevented;};
 return {c,calls,modal,fire};
}
test('a handled dialog Tab suppresses its native second focus advance exactly once',()=>{
 const f=fixture(e=>e.code==='Tab');assert.equal(f.fire('Tab'),1);assert.deepEqual(f.calls,['coast:Tab']);
});
test('native Tab and text editing remain native without entering garden dispatch',()=>{
 const f=fixture();assert.equal(f.fire('Tab'),0);
 assert.equal(f.fire('KeyM',{target:{matches:selector=>selector.includes('input')}}),0);
 assert.deepEqual(f.calls,['coast:Tab','coast:KeyM']);assert.equal(f.c.keys.size,0);
});
test('unhandled coastal M R and E cannot open hidden garden systems or leave held keys behind',()=>{
 const f=fixture();for(const code of ['KeyM','KeyR','KeyE'])assert.equal(f.fire(code),0);
 assert.deepEqual(f.calls,['coast:KeyM','coast:KeyR','coast:KeyE']);assert.equal(f.c.keys.size,0);
});
test('native focused button activation keeps its Space and Enter defaults',()=>{
 const f=fixture();const target={matches:selector=>selector.includes('button')};
 assert.equal(f.fire('Space',{target}),0);assert.equal(f.fire('Enter',{target}),0);
 assert.equal(f.c.spaceHeld,false);assert.equal(f.c.keys.size,0);
});
test('fullscreen and outer modals keep priority over the coastal input owner',()=>{
 const f=fixture(()=>true);assert.equal(f.fire('Enter',{altKey:true}),1);assert.deepEqual(f.calls,['fullscreen']);
 f.modal.open=true;assert.equal(f.fire('KeyE'),0);assert.deepEqual(f.calls,['fullscreen']);
});
test('returning to the garden restores its own shortcuts',()=>{
 const f=fixture();f.c.voyage.active=false;f.fire('KeyM');assert.ok(f.calls.includes('garden-map'));assert.ok(!f.calls.some(c=>c.startsWith('coast:')));
});

test('an active new map receives its own keys before retained coastal or garden input',()=>{
 const f=fixture();f.c.atlas={active:true,handleKey:e=>{f.calls.push('atlas:'+e.code);return e.code==='Space';}};
 assert.equal(f.fire('Space'),1);assert.equal(f.fire('KeyM'),0);assert.deepEqual(f.calls,['atlas:Space','atlas:KeyM']);assert.equal(f.c.keys.size,0);assert.equal(f.c.spaceHeld,false);
 f.modal.open=true;f.fire('KeyE');assert.equal(f.calls.length,2);
});
