import test from 'node:test';
import assert from 'node:assert/strict';
import {CLOUD_ISLANDS,CONSERVATORY_BEDS,STAR_ROUTE} from '../src/atlas-content.js';
const api=await import('../src/atlas-model.js').catch(()=>({}));
const create=()=>{assert.equal(typeof api.createAtlasState,'function','the atlas rules must exist');return api.createAtlasState();};
const enter=id=>api.atlasCommand(create(),'enter',{id}).state;
const tick=(state,seconds,input={})=>{for(let i=0;i<Math.ceil(seconds/.05);i++)state=api.stepAtlas(state,.05,input).state;return state;};

test('locations retain earned work and restore their own walking positions',()=>{
 let s=enter('conservatory');s.blooms[0]=1;s.player.x=4;
 s=api.atlasCommand(s,'enter',{id:'observatory'}).state;assert.equal(s.player.z,10);
 s=api.atlasCommand(s,'enter',{id:'conservatory'}).state;
 assert.equal(s.player.x,4);assert.equal(s.blooms[0],1);assert.deepEqual(s.visited,['conservatory','observatory']);
 const left=api.atlasCommand(s,'leave').state;assert.equal(left.location,null);assert.equal(left.blooms[0],1);
 assert.equal(api.atlasCommand(left,'enter',{id:'invented'}).ok,false);
});

test('a nearby player cannot pollinate until the actual butterfly arrives',()=>{
 let s=enter('conservatory');s.player={...s.player,x:-7,z:0};s.butterfly={x:15,y:1.1,z:0,trust:1};
 s=tick(s,2.2,{call:true});assert.equal(s.blooms[0],0,'a distant moth cannot pollinate through the map');
 s.butterfly={x:-7,y:1.1,z:0,trust:1};s=tick(s,2.2,{call:true});assert.equal(s.blooms[0],1);
});

test('running away leaves the following butterfly behind and earns no remote pollen',()=>{
 let s=enter('conservatory');s.player={...s.player,x:-7,z:0};s.butterfly={x:-7,y:1.1,z:0,trust:1};
 s=tick(s,2,{right:1,run:true,call:true});assert.ok(s.player.x-s.butterfly.x>3);assert.ok(s.blooms[0]<1);
 const progress=s.blooms[0];s=tick(s,2,{call:true});assert.ok(s.blooms[0]<=progress);
});

test('all three blooms complete the conservatory once and report the next destination',()=>{
 let s=enter('conservatory'),events=[];
 for(const bed of CONSERVATORY_BEDS){s.player={...s.player,x:bed.x,z:bed.z};s.butterfly={x:bed.x,y:1.1,z:bed.z,trust:1};for(let i=0;i<45;i++){const r=api.stepAtlas(s,.05,{call:true});s=r.state;events.push(...r.events);}}
 assert.deepEqual(s.completed,['conservatory']);assert.equal(events.filter(e=>e.type==='complete').length,1);assert.equal(api.atlasStatus(s).complete,true);assert.equal(api.atlasStatus(s).progress,1);
});

test('star study requires reaching the dais and only accepts the next route node',()=>{
 let s=enter('observatory');assert.equal(api.atlasCommand(s,'study').ok,false);
 s.player={...s.player,x:0,z:-18,y:1.8};s=api.atlasCommand(s,'study').state;
 assert.equal(s.stargazing,true);assert.equal(api.atlasCommand(s,'star',{id:2}).ok,false);
 s=api.atlasCommand(s,'star',{id:0}).state;assert.deepEqual(s.stars,[0]);assert.equal(api.atlasStatus(s).nextStar,1);
 s=api.atlasCommand(s,'exit-study').state;s=api.atlasCommand(s,'study').state;assert.deepEqual(s.stars,[0]);
 s=api.atlasCommand(s,'undo').state;assert.deepEqual(s.stars,[]);
 for(const id of STAR_ROUTE)s=api.atlasCommand(s,'star',{id}).state;
 assert.deepEqual(s.completed,['observatory']);assert.equal(api.atlasStatus(s).progress,1);
 assert.equal(api.atlasCommand(s,'undo').ok,false,'earned constellations stay complete');
});

test('narrative notes must be found nearby in their own location',()=>{
 let s=enter('conservatory');assert.equal(api.atlasCommand(s,'read-note',{id:'moon'}).ok,false);assert.equal(api.atlasCommand(s,'read-note',{id:'fern'}).ok,false);
 s.player={...s.player,x:-10,z:7};s=api.atlasCommand(s,'read-note',{id:'fern'}).state;assert.deepEqual(s.notes.conservatory,['fern']);
 s=api.atlasCommand(s,'read-note',{id:'fern'}).state;assert.deepEqual(s.notes.conservatory,['fern']);
});

test('cloud geography has real gaps and the observatory has a walkable ramp',()=>{
 create();assert.equal(api.atlasGroundHeight('meadow',0,6),0);assert.equal(api.atlasGroundHeight('meadow',6,-3),1);assert.equal(api.atlasGroundHeight('meadow',0,-3),null);
 assert.equal(api.atlasGroundHeight('observatory',0,-10),0);assert.equal(api.atlasGroundHeight('observatory',0,-14),.9);assert.equal(api.atlasGroundHeight('observatory',0,-18),1.8);assert.equal(api.atlasGroundHeight('unknown',0,0),null);
});

test('jump rises, holding the action glides only on descent, and holding cannot autojump on landing',()=>{
 let s=enter('meadow');s=api.stepAtlas(s,.05,{jump:true}).state;assert.equal(s.player.grounded,false);assert.ok(s.player.y>0);assert.equal(s.player.gliding,false);
 s=tick(s,1,{jump:true});assert.equal(s.player.gliding,true);assert.ok(s.player.vy<0&&s.player.vy>-3);
 s=tick(s,4,{jump:true});assert.equal(s.player.grounded,true);assert.equal(s.player.y,0);
 const still=tick(s,.3,{jump:true});assert.equal(still.player.grounded,true);
 s=api.stepAtlas(s,.05,{jump:false}).state;s=api.stepAtlas(s,.05,{jump:true}).state;assert.equal(s.player.grounded,false);
});

test('landing on an out-of-order island cannot grant the final checkpoint',()=>{
 let s=enter('meadow');s.player={x:0,y:3,z:-36,vy:-2,grounded:false,gliding:false};
 s=tick(s,.3);assert.equal(s.player.grounded,true);assert.equal(s.meadowCheckpoint,0);assert.deepEqual(s.completed,[]);
 s.player={x:0,y:-14,z:-3,vy:-2,grounded:false,gliding:false};s=api.stepAtlas(s,.05,{}).state;assert.equal(s.player.z,6);assert.equal(s.player.grounded,true);
});

test('every cloud island is reachable with real jump and movement inputs in order',()=>{
 let s=enter('meadow');
 for(let index=1;index<CLOUD_ISLANDS.length;index++){
  const goal=CLOUD_ISLANDS[index];s=api.stepAtlas(s,.05,{jump:false}).state;
  for(let f=0;f<240&&s.meadowCheckpoint<index;f++){
   const dx=goal.x-s.player.x,dz=goal.z-s.player.z,len=Math.hypot(dx,dz);
   s=api.stepAtlas(s,.05,{right:len>.35?dx/len:0,forward:len>.35?-dz/len:0,run:true,jump:true}).state;
  }
  assert.equal(s.meadowCheckpoint,index,'must physically land on island '+index);
 }
 assert.deepEqual(s.completed,['meadow']);assert.equal(s.player.grounded,true);
});

test('touch-speed eight-direction jumps reach every island from a forgiving 65-percent-radius takeoff',()=>{
 let s=enter('meadow');
 function travelTo(target,{jump=false,untilGrounded=false}={}){
  for(let burst=0;burst<220;burst++){
   const dx=target.x-s.player.x,dz=target.z-s.player.z,d=Math.hypot(dx,dz);
   if(d<.4&&(!untilGrounded||s.player.grounded))return;
   const input={jump,right:d>.3&&Math.abs(dx)>Math.abs(dz)*.4142?Math.sign(dx):0,forward:d>.3&&Math.abs(dz)>Math.abs(dx)*.4142?-Math.sign(dz):0};
   // A finger/keyboard direction is sampled in bursts, with time to adjust it.
   for(let frame=0;frame<3;frame++)s=api.stepAtlas(s,.05,input).state;
   s=api.stepAtlas(s,.02,{jump}).state;
   assert.equal(s.recoveries,0,'a reasonable takeoff must not fall short of the next island');
  }
  assert.fail('eight-direction travel did not reach '+JSON.stringify(target));
 }
 for(let index=0;index<CLOUD_ISLANDS.length-1;index++){
  const from=CLOUD_ISLANDS[index],to=CLOUD_ISLANDS[index+1],dx=to.x-from.x,dz=to.z-from.z,length=Math.hypot(dx,dz),ux=dx/length,uz=dz/length;
  const edge=1/Math.sqrt((ux/from.rx)**2+(uz/from.rz)**2);
  travelTo({x:from.x+ux*edge*.65,z:from.z+uz*edge*.65});
  travelTo(to,{jump:true,untilGrounded:true});assert.equal(s.meadowCheckpoint,index+1);
  const grounded=s.player.y;s=api.stepAtlas(s,.05,{jump:true}).state;assert.equal(s.player.grounded,true);assert.equal(s.player.y,grounded,'continuing to hold cannot immediately jump again');
 }
 assert.deepEqual(s.completed,['meadow']);assert.equal(s.recoveries,0);
});

test('recover returns to the latest earned island and leaves map progress intact',()=>{
 let s=enter('meadow');s.meadowCheckpoint=2;s.player={...s.player,x:100,z:100,y:-20};s=api.atlasCommand(s,'recover').state;
 assert.deepEqual([s.player.x,s.player.y,s.player.z],[-2,2,-13]);assert.equal(s.meadowCheckpoint,2);
});

test('malformed saves and oversized frame inputs cannot create nonfinite state or forged rewards',()=>{
 create();let s=api.restoreAtlasState({version:1,location:'meadow',player:{x:NaN,y:Infinity,z:-999,vy:Infinity},completed:['conservatory','fake'],visited:['fake'],blooms:[Infinity,-3,'1'],stars:[0,2,3],meadowCheckpoint:Infinity,notes:{meadow:['tree','fake']}});
 assert.deepEqual(s.completed,[]);assert.deepEqual(s.stars,[0]);assert.equal(s.meadowCheckpoint,0);assert.ok(Object.values(s.player).every(v=>typeof v!=='number'||Number.isFinite(v)));
 const a=api.stepAtlas(s,999,{right:Infinity,forward:NaN,jump:true}).state;const b=api.stepAtlas(s,.05,{right:0,forward:0,jump:true}).state;assert.deepEqual(a,b);
 assert.deepEqual(api.restoreAtlasState({version:99}),create());assert.equal(api.atlasComplete(s),false);
});

test('rule commands and stepping do not mutate their caller state',()=>{
 const s=enter('meadow'),before=structuredClone(s);api.stepAtlas(s,.05,{jump:true,right:1});api.atlasCommand(s,'leave');assert.deepEqual(s,before);
});

test('a continuous slow walk lets the real butterfly follow and pollinate all three beds',()=>{
 let s=enter('conservatory');s=tick(s,1,{call:true});
 for(const bed of CONSERVATORY_BEDS){
  for(let frame=0;frame<650;frame++){
   const dx=bed.x-s.player.x,dz=bed.z-s.player.z,length=Math.hypot(dx,dz);
   if(length<.2)break;
   s=api.stepAtlas(s,.05,{right:dx/length,forward:-dz/length,call:true}).state;
  }
  s=tick(s,4,{call:true});assert.ok(s.blooms[CONSERVATORY_BEDS.indexOf(bed)]>=1,'butterfly must really reach '+bed.id);
 }
 assert.deepEqual(s.completed,['conservatory']);assert.deepEqual(s.stars,[]);assert.equal(s.meadowCheckpoint,0);
});

test('restoring an airborne save returns to the earned island and clears action latches',()=>{
 const s=enter('meadow');s.meadowCheckpoint=2;s.player={x:8,y:7,z:-23,vy:-1.65,grounded:false,gliding:true};s.positions.meadow={...s.player};s.jumpHeld=true;s.calling=true;
 const r=api.restoreAtlasState(JSON.parse(JSON.stringify(s)));
 assert.deepEqual(r.player,{x:-2,y:2,z:-13,vy:0,grounded:true,gliding:false});assert.equal(r.jumpHeld,false);assert.equal(r.calling,false);assert.equal(r.meadowCheckpoint,2);
 const returned=api.atlasCommand(api.atlasCommand(r,'enter',{id:'conservatory'}).state,'enter',{id:'meadow'}).state;assert.deepEqual(returned.player,r.player);
});

test('grounded walking cannot pass through the actual fern trunk, brass base or cloud tree',()=>{
 for(const fixture of [{id:'conservatory',x:-11,z:5,start:-13,y:0,radius:.55},{id:'observatory',x:8,z:-18,start:4,y:1.8,radius:1.8},{id:'meadow',x:-2.9,z:-38,start:-5,y:2.8,radius:.55}]){
  let s=enter(fixture.id);s.player={x:fixture.start,y:fixture.y,z:fixture.z,vy:0,grounded:true,gliding:false};
  s=tick(s,2,{right:1});assert.ok(s.player.x<=fixture.x-fixture.radius,'cannot walk through '+fixture.id+' solid');assert.ok(Math.hypot(s.player.x-fixture.x,s.player.z-fixture.z)>=fixture.radius);
 }
});

test('diagonal movement slides around a trunk instead of sticking or entering its cylinder',()=>{
 let s=enter('conservatory');s.player={x:-11.6,y:0,z:5,vy:0,grounded:true,gliding:false};
 for(let frame=0;frame<18;frame++){s=api.stepAtlas(s,.05,{right:1,forward:1}).state;assert.ok(Math.hypot(s.player.x+11,s.player.z-5)>=.55);}
 assert.ok(s.player.z<4,'the unobstructed direction remains usable');assert.ok(s.player.x>-11.5,'the player can slide around and pass the side of the trunk');
});

test('airborne flight can clear a cloud trunk but landing cannot leave feet inside it',()=>{
 let s=enter('meadow');s.meadowCheckpoint=4;s.player={x:-4.5,y:6,z:-38,vy:0,grounded:false,gliding:true};s=tick(s,.6,{right:1,jump:true});assert.ok(s.player.x>-2,'the raised avatar is not blocked by a ground-only collider');
 s.player={x:-2.9,y:2.9,z:-38,vy:-2,grounded:false,gliding:false};s=tick(s,.2);assert.equal(s.player.grounded,true);assert.ok(Math.hypot(s.player.x+2.9,s.player.z+38)>=.55);
});

test('a saved position inside newly solid scenery restores just outside that scenery',()=>{
 const s=enter('conservatory');s.player={x:-11,y:0,z:5,vy:0,grounded:true,gliding:false};const r=api.restoreAtlasState(s);assert.equal(r.location,'conservatory');assert.ok(Math.hypot(r.player.x+11,r.player.z-5)>=.55);assert.equal(r.player.grounded,true);
});
