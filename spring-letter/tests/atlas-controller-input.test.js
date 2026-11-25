import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from 'three';
import {createAtlasState,atlasCommand,stepAtlas,atlasStatus,atlasComplete} from '../src/atlas-model.js';
import {ATLAS_LOCATIONS,atlasLocation,ATLAS_STARS,ATLAS_NOTES,STAR_ROUTE} from '../src/atlas-content.js';
import {createTravelController} from '../src/navigation.js';
import {fitAtlasStarCamera} from '../src/atlas-camera.js';

// Execute the complete production controller. Only its DOM and rendered-world
// boundaries are substituted; movement, progression and camera math stay real.
class Node {
 constructor(tag){this.tagName=tag;this.children=[];this.listeners={};this.style={};this.dataset={};this.hidden=false;this.id='';this.attributes={};const names=new Set();this.classList={add:(...v)=>v.forEach(x=>names.add(x)),remove:(...v)=>v.forEach(x=>names.delete(x)),contains:v=>names.has(v),toggle:(v,on)=>{const add=on===undefined?!names.has(v):on;if(add)names.add(v);else names.delete(v);return add;}};}
 set innerHTML(html){this.children=[];for(const match of html.matchAll(/<([\w-]+)[^>]*\bid="([^"]+)"[^>]*>/g)){const child=new Node(match[1]);child.id=match[2];this.append(child);}}
 append(...children){for(const child of children){child.parent=this;this.children.push(child);}}
 setAttribute(key,value){this.attributes[key]=String(value);}
 addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
 setPointerCapture(id){this.capture=id;}
 focus(){if(this.ownerDocument)this.ownerDocument.activeElement=this;}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 querySelectorAll(selector){const matches=node=>selector.startsWith('#')?node.id===selector.slice(1):node.tagName===selector;const all=[];const walk=node=>{for(const child of node.children){if(matches(child))all.push(child);walk(child);}};walk(this);return all;}
 closest(selector){return selector.split(',').map(s=>s.trim()).includes(this.tagName)?this:null;}
 fire(type,event={}){const e={type,preventDefault(){},button:0,pointerId:1,target:this,currentTarget:this,...event};this['on'+type]?.(e);for(const fn of this.listeners[type]||[])fn(e);return e;}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(node=>node!==this);}
}

function fixture(id='conservatory'){
 const game={atlas:createAtlasState(),settings:{quality:'balanced',autoCamera:false,reducedMotion:true}};
 const events=[],document={activeElement:null,createElement:tag=>Object.assign(new Node(tag),{ownerDocument:document}),body:new Node('body')};
 const world={group:{visible:false},setLocation(id){this.location=id;},update(time,dt,state){this.last=state;},snapshot(){return {location:this.location};},dispose(){this.disposed=true;}};
 const source=readFileSync(new URL('../src/atlas-controller.js',import.meta.url),'utf8').replace(/^import[^\n]*\n/gm,'').replace('export function createAtlasController','function createAtlasController');
 const context={THREE,createAtlasWorld:()=>world,atlasCommand,stepAtlas,atlasStatus,atlasComplete,ATLAS_LOCATIONS,atlasLocation,ATLAS_STARS,ATLAS_NOTES,STAR_ROUTE,createTravelController,fitAtlasStarCamera,document,innerWidth:1280,innerHeight:800,structuredClone};vm.createContext(context);vm.runInContext(source,context);
 const controller=context.createAtlasController({getState:()=>game,onStart:()=>events.push('start'),onExit:()=>events.push('exit'),onSave:()=>events.push('save'),onSound:(kind,payload)=>events.push({kind,payload}),onContinue:()=>events.push('continue'),onMap:()=>events.push('map'),onPhoto:()=>events.push('photo'),onSettings:()=>events.push('settings'),onRead:note=>events.push({read:note.id})});
 controller.start(id);const camera=new THREE.PerspectiveCamera(48,1.6,.1,360);
 const refreshCamera=()=>{const frame=controller.camera(1.6);camera.position.fromArray(frame.position);camera.lookAt(new THREE.Vector3(...frame.target));camera.updateMatrixWorld();controller.update(0,0,{camera});};refreshCamera();
 const key=(code,type='keydown',target=null,extra={})=>controller.handleKey({code,type,target,repeat:false,...extra});
 const tick=(frames=1,dt=.05)=>{for(let i=0;i<frames;i++)controller.update(i*dt,dt,{camera});};
 const node=id=>document.body.querySelector('#'+id);
 const study=()=>{game.atlas.player={x:0,y:1.8,z:-18,vy:0,grounded:true,gliding:false};controller.primary();refreshCamera();};
 const starEvent=(id,button=0)=>{const star=ATLAS_STARS[id],p=new THREE.Vector3(star.x,star.y,star.z).project(camera);return {button,pointerId:9,clientX:(p.x*.5+.5)*1280,clientY:(-p.y*.5+.5)*800};};
 return {game,events,controller,world,key,tick,node,study,starEvent,refreshCamera,document};
}

test('controller sends world-coordinate movement and displays fractional model progress as a percentage',()=>{
 const f=fixture();const before={...f.game.atlas.player};f.key('KeyW');f.tick();f.key('KeyW','keyup');assert.ok(f.game.atlas.player.z<before.z);assert.equal(f.game.atlas.player.x,before.x);
 f.key('KeyD');f.tick();f.key('KeyD','keyup');assert.ok(f.game.atlas.player.x>before.x);
 f.game.atlas.blooms=[1,.5,0];f.tick(3);assert.equal(f.node('atlas-progress-fill').style.width,'50%');assert.equal(f.world.last.location,'conservatory');assert.equal(f.world.last.settings.quality,'balanced');
});

test('releasing movement over a focused button or input cannot leave the avatar walking',()=>{
 for(const tag of ['button','input']){const f=fixture();f.key('KeyW');f.tick();f.key('KeyW','keyup',new Node(tag));const before=f.game.atlas.player.z;f.tick(6);assert.equal(f.game.atlas.player.z,before,tag+' focus must still release the physical key');assert.equal(f.controller.snapshot().held.length,0);}
});

test('ordinary button, link and summary focus still permits walking and game shortcuts',()=>{
 for(const tag of ['button','a','summary']){
  const f=fixture(),target=Object.assign(new Node(tag),{ownerDocument:f.document});target.focus();
  for(const [code,axis,sign] of [['KeyW','z',-1],['KeyA','x',-1],['KeyS','z',1],['KeyD','x',1],['ArrowUp','z',-1],['ArrowRight','x',1]]){
   const before=f.game.atlas.player[axis];f.key(code,'keydown',f.document.activeElement);f.tick();f.key(code,'keyup',f.document.activeElement);
   assert.ok((f.game.atlas.player[axis]-before)*sign>0,tag+' focus must not block '+code);
  }
  f.key('KeyM','keydown',target);assert.equal(f.events.filter(e=>e==='map').length,1);
 }
});

test('editable controls suppress gameplay while native buttons retain Space and Enter activation',()=>{
 const f=fixture(),editable=Object.assign(new Node('div'),{isContentEditable:true});
 for(const target of [new Node('input'),new Node('textarea'),new Node('select'),editable])for(const code of ['Space','KeyW','ArrowDown','KeyE','KeyM'])assert.equal(f.key(code,'keydown',target),false);
 for(const tag of ['button','a','summary'])for(const code of ['Space','Enter'])assert.equal(f.key(code,'keydown',new Node(tag)),false);
 f.tick(4);assert.equal(f.game.atlas.player.z,10);assert.equal(f.game.atlas.calling,false);assert.equal(f.controller.snapshot().held.length,0);assert.equal(f.events.includes('map'),false);
});

test('map entry and leaving the star controls return keyboard focus to the playable scene',()=>{
 const f=fixture('observatory');assert.equal(f.document.activeElement?.id,'atlas-ui');assert.equal(f.node('atlas-ui').attributes.tabindex,'-1');
 f.node('atlas-settings').focus();f.controller.start('conservatory');assert.equal(f.document.activeElement?.id,'atlas-ui');
 f.controller.start('observatory');f.study();f.node('atlas-look-down').focus();f.node('atlas-look-down').fire('click',{detail:0});assert.equal(f.game.atlas.stargazing,false);assert.equal(f.document.activeElement?.id,'atlas-ui');
 const z=f.game.atlas.player.z;f.key('KeyS','keydown',f.document.activeElement);f.tick();f.key('KeyS','keyup',f.document.activeElement);assert.ok(f.game.atlas.player.z>z);
});

test('touch movement and the held action release on cancellation or lost pointer capture',()=>{
 const f=fixture();f.node('atlas-move-forward').fire('pointerdown',{pointerId:1});f.node('atlas-special').fire('pointerdown',{pointerId:2});f.tick(6);assert.ok(f.game.atlas.player.z<10);assert.equal(f.game.atlas.calling,true);
 f.node('atlas-move-forward').fire('lostpointercapture',{pointerId:1});f.node('atlas-special').fire('pointercancel',{pointerId:2});const before=f.game.atlas.player.z;f.tick(4);assert.equal(f.game.atlas.player.z,before);assert.equal(f.game.atlas.calling,false);assert.equal(f.controller.snapshot().touch.length,0);
});

test('the held action also works from keyboard focus on its own accessible button',()=>{
 const f=fixture();const button=f.node('atlas-special');button.fire('keydown',{code:'Enter'});f.tick(6);assert.equal(f.game.atlas.calling,true);
 button.fire('keyup',{code:'Enter'});f.tick();assert.equal(f.game.atlas.calling,false);button.fire('keydown',{code:'Space'});button.fire('blur');f.tick();assert.equal(f.game.atlas.calling,false);
});

test('special-button key events bubble without duplicating its hold and release on a changed focus',()=>{
 for(const code of ['Space','Enter']){
  const f=fixture(),button=f.node('atlas-special');button.focus();const down=button.fire('keydown',{code});assert.equal(f.controller.handleKey(down),false);f.tick(6);assert.equal(f.game.atlas.calling,true);assert.deepEqual([...f.controller.snapshot().held],['Space']);
  const up=button.fire('keyup',{code});f.controller.handleKey(up);f.tick();assert.equal(f.game.atlas.calling,false);assert.equal(f.controller.snapshot().held.length,0);
  button.fire('keydown',{code});button.fire('blur');f.key(code,'keyup',new Node('input'));f.tick();assert.equal(f.game.atlas.calling,false);assert.equal(f.controller.snapshot().held.length,0);
 }
});

test('entering stargazing cancels movement and the same ordered stars survive exit and reentry',()=>{
 const f=fixture('observatory');f.key('KeyW');f.study();assert.equal(f.game.atlas.stargazing,true);assert.equal(f.controller.snapshot().held.length,0);
 f.key('Digit1');f.key('Digit2');assert.deepEqual(f.game.atlas.stars,[0,1]);f.key('Escape');assert.equal(f.game.atlas.stargazing,false);f.key('KeyE');assert.equal(f.game.atlas.stargazing,true);assert.deepEqual(f.game.atlas.stars,[0,1]);
 f.key('Backspace');assert.deepEqual(f.game.atlas.stars,[0]);
});

for(const mode of ['click','drag'])test('the final constellation '+mode+' completes once without dereferencing the cancelled pointer',()=>{
 const f=fixture('observatory');f.study();f.game.atlas.stars=STAR_ROUTE.slice(0,-1);
 const ray={ray:new THREE.Ray()},last=f.starEvent(2);
 if(mode==='drag')f.controller.pointer('down',ray,{...last,clientX:-1000,clientY:-1000});
 assert.doesNotThrow(()=>f.controller.pointer(mode==='drag'?'move':'down',ray,last));
 assert.deepEqual(f.game.atlas.completed,['observatory']);assert.equal(f.controller.snapshot().held.length,0);assert.equal(f.controller.snapshot().touch.length,0);assert.equal(f.events.filter(e=>e.kind==='complete').length,1);
 assert.doesNotThrow(()=>f.controller.pointer('up',ray,last));
});

test('secondary pointers never connect stars and keyboard digits use the same route rule',()=>{
 const f=fixture('observatory');f.study();const ray={ray:new THREE.Ray()};
 for(const button of [1,2]){const e=f.starEvent(0,button);f.controller.pointer('down',ray,e);f.controller.pointer('move',ray,{...e,clientX:e.clientX+20});f.controller.pointer('up',ray,e);}
 assert.deepEqual(f.game.atlas.stars,[]);f.key('Digit3');assert.deepEqual(f.game.atlas.stars,[]);for(const id of STAR_ROUTE)f.key('Digit'+(id+1));assert.deepEqual(f.game.atlas.completed,['observatory']);
});

test('completion releases held touch movement and permits a later deliberate fresh jump',()=>{
 const f=fixture('meadow');f.game.atlas.meadowCheckpoint=3;f.game.atlas.player={x:0,y:2.82,z:-36,vy:-1,grounded:false,gliding:false};f.node('atlas-special').fire('pointerdown',{pointerId:2});f.node('atlas-move-right').fire('pointerdown',{pointerId:3});f.tick();assert.deepEqual(f.game.atlas.completed,['meadow']);assert.equal(f.controller.snapshot().touch.length,0);assert.equal(f.controller.snapshot().held.length,0);
 f.tick();f.key('Space');f.tick();assert.equal(f.game.atlas.player.grounded,false);
});

test('switching maps and return preserve separate positions while clearing transient inputs',()=>{
 const f=fixture();f.key('KeyD');f.tick(4);const x=f.game.atlas.player.x;f.controller.start('observatory');assert.equal(f.game.atlas.location,'observatory');assert.equal(f.game.atlas.player.x,0);assert.equal(f.controller.snapshot().held.length,0);
 f.controller.start('conservatory');assert.equal(f.game.atlas.player.x,x);f.controller.stop();assert.equal(f.game.atlas.location,null);assert.equal(f.controller.active,false);assert.equal(f.world.group.visible,false);
 f.controller.start('conservatory');assert.equal(f.game.atlas.player.x,x);f.controller.stop({preserveLocation:true,silent:true});assert.equal(f.game.atlas.location,'conservatory');
});

test('cancelled click-to-walk cannot resume when a paused map starts updating again',()=>{
 const f=fixture(),ray={ray:new THREE.Ray(new THREE.Vector3(4,10,0),new THREE.Vector3(0,-1,0))},e={button:0,pointerId:9,clientX:300,clientY:300};
 f.controller.pointer('down',ray,e);f.controller.pointer('up',ray,e);f.tick(3);f.controller.cancel();const before={...f.game.atlas.player};f.tick(5);assert.deepEqual(f.game.atlas.player,before);
});

test('an automatic fall recovery cancels old held controls before returning to its checkpoint',()=>{
 const f=fixture('meadow');f.game.atlas.meadowCheckpoint=1;f.game.atlas.player={x:0,y:-13,z:-3,vy:-2,grounded:false,gliding:true};f.key('KeyW');f.node('atlas-special').fire('pointerdown',{pointerId:2});f.tick();
 assert.equal(f.game.atlas.recoveries,1);assert.equal(f.controller.snapshot().held.length,0);assert.equal(f.controller.snapshot().touch.length,0);
 const recovered={...f.game.atlas.player};f.tick(4);assert.deepEqual(f.game.atlas.player,recovered);assert.equal(f.game.atlas.player.grounded,true);
});

test('a rejected airborne note interaction cannot open text that the model did not record',()=>{
 const f=fixture('meadow');f.game.atlas.player={x:10,y:3,z:-3,vy:0,grounded:false,gliding:false};f.controller.primary();assert.equal(f.events.some(event=>event.read==='flag'),false);assert.deepEqual(f.game.atlas.notes.meadow,[]);
 f.game.atlas.player={x:10,y:1,z:-3,vy:0,grounded:true,gliding:false};f.controller.primary();assert.equal(f.events.filter(event=>event.read==='flag').length,1);assert.deepEqual(f.game.atlas.notes.meadow,['flag']);
});

test('Z performs the same single-step undo advertised in the star-map hint',()=>{
 const f=fixture('observatory');f.study();f.key('Digit1');f.key('Digit2');assert.equal(f.key('KeyZ'),true);assert.deepEqual(f.game.atlas.stars,[0]);
 f.key('KeyZ','keydown',null,{repeat:true});assert.deepEqual(f.game.atlas.stars,[0]);
});
