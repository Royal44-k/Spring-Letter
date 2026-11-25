import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from 'three';
import {createVoyageState,voyageCommand,voyageStageInfo} from '../src/voyage-model.js';
import {VOYAGE_CHAPTERS} from '../src/voyage-content.js';
import {createTravelController} from '../src/navigation.js';
const source=readFileSync(new URL('../src/voyage-controller.js',import.meta.url),'utf8');
function productionFunction(name){const start=source.indexOf(` function ${name}(`);assert.ok(start>=0);const end=source.indexOf('\n function ',start+1);return source.slice(start,end);}
function fixture(stage='rigging'){
 const s=createVoyageState();s.stage=stage;
 const calls=[],nodes=new Map();
 const c={active:true,state:()=>s,held:new Set(),touchHeld:new Map(),travel:createTravelController(),cameraYaw:0,steer:0,hoisting:false,walkTarget:null,readOpen:false,bag:{hidden:true},end:{hidden:true},readPanel:{hidden:true},editing:false,clear(){c.held.clear();c.touchHeld.clear();},action:a=>calls.push(a),showBag:()=>calls.push('bag'),primary:()=>calls.push('primary'),scatter:()=>calls.push('scatter'),sync(){},onSettings:()=>calls.push('settings'),calls,$:id=>nodes.get(id),document:{activeElement:null}};
 vm.createContext(c);vm.runInContext(productionFunction('readControls')+'\n'+productionFunction('handleKey'),c);return {c,s,nodes};
}
const key=(code,target=null,type='keydown',extra={})=>({code,target,type,...extra});
test('Space and touch halyard return a numeric held hoist axis and release cleanly',()=>{
 const {c}=fixture();c.handleKey(key('Space'));assert.equal(c.readControls().hoist,1);
 c.handleKey(key('Space',null,'keyup'));assert.equal(c.readControls().hoist,0);
 c.touchHeld.set(4,'hoist');assert.equal(c.readControls().hoist,1);c.touchHeld.delete(4);assert.equal(c.readControls().hoist,0);
});
test('Tab and native button activation remain available while unrelated game shortcuts are not consumed',()=>{
 const {c}=fixture();const button={matches:()=>false,closest:s=>s==='button, a, summary'?{dataset:{}}:null};
 assert.equal(c.handleKey(key('Tab')),false);assert.equal(c.handleKey(key('Space',button)),false);assert.equal(c.handleKey(key('Enter',button)),false);
 assert.equal(c.handleKey(key('KeyR')),false);assert.equal(c.held.size,0);
});
test('reading either letter blocks background gameplay shortcuts and does not queue held controls',()=>{
 for(const kind of ['read','bag']){const {c}=fixture('rigging');if(kind==='read')c.readOpen=true;else c.bag.hidden=false;
  for(const code of ['KeyE','Digit1','Digit2','KeyF','Space','KeyW'])c.handleKey(key(code));
  assert.deepEqual(c.calls,[]);assert.equal(c.held.size,0);
  c.handleKey(key('Escape'));assert.equal(c.readOpen,false);assert.equal(c.bag.hidden,true);
 }
});
test('releasing a movement key while a text field has focus never leaves walking stuck',()=>{
 const {c}=fixture('tide');c.handleKey(key('KeyW'));assert.equal(c.held.has('KeyW'),true);
 c.handleKey(key('KeyW',{matches:()=>true},'keyup'));assert.equal(c.held.has('KeyW'),false);
});
test('stamp dragging outside the envelope cannot be converted into a native click seal',()=>{
 const listeners={},stamp={style:{},addEventListener:(name,fn)=>listeners[name]=fn,setPointerCapture(){}},envelope={getBoundingClientRect:()=>({left:150,right:250,top:0,bottom:100})};
 let s=voyageCommand(createVoyageState(),'begin').state;s=voyageCommand(s,'write',{recipient:'你',body:'春天到了。'}).state;
 const c={sealDrag:null,suppressSealClick:false,state:()=>s,$:id=>id==='voyage-seal'?stamp:envelope,command(name){const r=voyageCommand(s,name);s=r.state;return r.ok;},draft(){},onSound(){},hint:'',sync(){}};
 vm.createContext(c);const start=source.indexOf(' function seal('),end=source.indexOf(" $('voyage-leave-desk').onclick",start);vm.runInContext(source.slice(start,end),c);
 const event=(x,y)=>({pointerId:1,button:0,clientX:x,clientY:y,currentTarget:stamp});
 listeners.pointerdown(event(10,10));listeners.pointermove(event(100,150));listeners.pointerup(event(100,150));listeners.click({detail:1});assert.equal(s.letter.sealed,false);
 listeners.click({detail:0});assert.equal(s.letter.sealed,true,'keyboard activation still intentionally seals');
});

test('rigging at 99.5 percent keeps hoisting available until the launch rule is satisfied',()=>{
 const s=createVoyageState();s.stage='rigging';s.sail=.995;s.ropes=[true,true];
 const elements=new Map(),element=id=>{if(!elements.has(id))elements.set(id,{hidden:false,classList:{toggle(){}},style:{},focus(){}});return elements.get(id);};
 const c={active:true,state:()=>s,lastStage:'rigging',hint:'',voyageStageInfo,VOYAGE_CHAPTERS,roman:Array(9).fill('Ⅰ'),$:element,readOpen:false,endingOpen:false,readPanel:element('reading'),end:element('end'),touch:element('touch'),bag:{hidden:true},heading:element('heading'),tools:element('tools'),editor:element('editor'),actionPanel:element('action'),marker:element('marker')};
 vm.createContext(c);vm.runInContext(productionFunction('sync'),c);c.sync();
 assert.equal(element('voyage-hoist').disabled,false);assert.equal(element('voyage-launch').disabled,true);
 s.sail=1;c.sync();assert.equal(element('voyage-hoist').disabled,true);assert.equal(element('voyage-launch').disabled,false);
});

test('the deliberate departure notifies completion once; a repeated ending action does not notify again',()=>{
 const s=createVoyageState();s.stage='dawn';const game={voyage:s};let count=0;
 const c={state:()=>game.voyage,getState:()=>game,voyageCommand,readOpen:false,bag:{hidden:true},end:{hidden:true},hint:'',onComplete:()=>count++,onSound(){},persist(){},sync(){},clear(){},endingOpen:false};
 vm.createContext(c);vm.runInContext(productionFunction('events')+'\n'+productionFunction('command')+'\n'+productionFunction('primary'),c);
 c.primary();assert.equal(game.voyage.stage,'complete');assert.equal(count,1);c.primary();assert.equal(count,1);
});

test('recovery explains the return and clears an obsolete click-to-walk target',()=>{
 const c={hint:'',walkTarget:{x:50,z:-50},onSound(){},onComplete(){}};vm.createContext(c);vm.runInContext(productionFunction('events'),c);c.events([{type:'recover',checkpoint:4}]);
 assert.match(c.hint,/高石/);assert.equal(c.walkTarget,null);
});

test('the visible close-letter action returns to the tide without taking the old letter',()=>{
 const s=createVoyageState();s.stage='tide';s.oldRead=true;let focused=false,cleared=false;
 const c={state:()=>s,readOpen:true,clear:()=>cleared=true,sync(){},$:()=>({focus:()=>focused=true})};
 const start=source.indexOf(' function action('),end=source.indexOf('\n root.addEventListener',start);
 vm.createContext(c);vm.runInContext(source.slice(start,end),c);c.action('close-old');
 assert.equal(c.readOpen,false);assert.ok(cleared&&focused);assert.equal(s.predecessor,false);assert.equal(s.stage,'tide');
});

function riggingPointerFixture(){
 const game={voyage:createVoyageState()};game.voyage.stage='rigging';let target='rope-left';
 const c={active:true,readOpen:false,bag:{hidden:true},end:{hidden:true},state:()=>game.voyage,nearObject:()=>({id:target}),drag:null,orbitYaw:0,orbitPitch:0,manualCamera:0,steer:0,travel:{orbit(){}},clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),onSound(){},clear(){},command(name,payload){const r=voyageCommand(game.voyage,name,payload);game.voyage=r.state;return r.ok;}};
 vm.createContext(c);vm.runInContext(productionFunction('pointer'),c);
 return {game,c,drag(object,button,steps=[['down',10,10],['move',35,50],['up',35,50]]){target=object;for(const [type,x,y] of steps)c.pointer(type,{}, {pointerId:1,button,clientX:x,clientY:y});}};
}

for(const button of [1,2])test(`${button===1?'middle':'right'} button drags never change either rope or the halyard`,()=>{
 const {game,drag}=riggingPointerFixture();
 for(const object of ['rope-left','rope-right','halyard'])drag(object,button);
 assert.deepEqual(game.voyage.ropes,[false,false]);assert.equal(game.voyage.sail,0);
});

for(const button of [1,2])test(`${button===1?'middle':'right'} orbit cannot hoist or steer during its initial sub-threshold movement`,()=>{
 const {game,c,drag}=riggingPointerFixture();
 drag('halyard',button,[['down',10,10],['move',13,13],['move',35,35],['up',35,35]]);
 assert.equal(game.voyage.sail,0,'the first 3px must not enter the halyard branch');
 game.voyage.stage='sailing';drag('halyard',button,[['down',10,10],['move',13,13]]);
 assert.equal(c.steer,0,'an orbit must not enqueue steering before crossing the drag threshold');
});

test('primary physical drags still untie both ropes and raise the sail',()=>{
 const {game,drag}=riggingPointerFixture();
 for(const object of ['rope-left','rope-right','halyard'])drag(object,0);
 assert.deepEqual(game.voyage.ropes,[true,true]);assert.ok(game.voyage.sail>0);
});

test('rigging applies the orbit camera while letter and ending framing stay fixed',()=>{
 const start=source.indexOf(' function camera('),end=source.indexOf('\n return {group:',start);
 for(const stage of ['rigging','writing','dawn','complete']){
  const c={THREE,state:()=>({stage}),view:()=>({stage}),world:{camera:()=>({position:[0,4,10],target:[0,0,0]})},orbitYaw:.4,orbitPitch:.1,cameraYaw:0,clamp:(x,a,b)=>Math.max(a,Math.min(b,x))};
  vm.createContext(c);vm.runInContext(source.slice(start,end),c);const camera=c.camera(1.6);
  if(stage==='rigging'){
   assert.ok(camera.position[0]>1,'right drag must visibly orbit the rigging view');
   assert.equal(c.cameraYaw,.4);assert.ok(Math.abs(Math.hypot(...camera.position)-Math.hypot(0,4,10))<1e-9);
  }else assert.deepEqual(camera.position,[0,4,10]);
 }
});

test('completed rigging targets cannot steal a nearby remaining rope pick',()=>{
 const s=createVoyageState();s.stage='rigging';s.ropes=[true,false];
 const cameraRef=new THREE.PerspectiveCamera(50,1,.1,100);cameraRef.position.set(0,0,10);cameraRef.lookAt(0,0,0);cameraRef.updateMatrixWorld();
 const c={cameraRef,state:()=>s,point:new THREE.Vector3(),innerWidth:1000,innerHeight:1000,world:{interactables:[{id:'rope-left',position:[0,0,0],radius:.4},{id:'rope-right',position:[.01,0,0],radius:.4}]}};
 vm.createContext(c);vm.runInContext(productionFunction('nearObject'),c);
 assert.equal(c.nearObject({clientX:500,clientY:500})?.id,'rope-right','the already untied knot must no longer be a target');
 c.world.interactables[0]={id:'halyard',position:[0,0,0],radius:.5};s.sail=1;
 assert.equal(c.nearObject({clientX:500,clientY:500})?.id,'rope-right','a fully raised sail must not intercept the remaining rope');
});

for(const stage of ['tide','island','sailing'])test(`${stage} only primary clicks can walk or scatter`,()=>{
 for(const button of [1,2,0]){
  const {game,c}=riggingPointerFixture();game.voyage.stage=stage;c.walkTarget=null;c.point=new THREE.Vector3();c.pointerPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);let scattered=0;c.scatter=()=>scattered++;
  const ray={ray:new THREE.Ray(new THREE.Vector3(2,5,-3),new THREE.Vector3(0,-1,0))};
  for(const type of ['down','up'])c.pointer(type,ray,{pointerId:1,button,clientX:10,clientY:10});
  if(stage==='sailing')assert.equal(scattered,button===0?1:0);
  else if(button===0)assert.deepEqual({...c.walkTarget},{x:2,z:-3});else assert.equal(c.walkTarget,null);
 }
});
