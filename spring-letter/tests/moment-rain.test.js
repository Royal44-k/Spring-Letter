import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createRainMoment,createRainDraft,restoreRainDraft,evaluateRainDraft,moveRainPane,RAIN_PANES,RAIN_LIMITS} from '../src/moment-rain.js';
import {getFlowerPalette} from '../src/flower-presets.js';

const approx=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<e,`${a} differs from ${b}`);
const activate=moment=>moment.update(0,0,{active:true});
const at=(moment,x,y,z)=>{
  moment.group.updateWorldMatrix(true,true);
  const origin=moment.group.localToWorld(new THREE.Vector3(x,y,z+9));
  const destination=moment.group.localToWorld(new THREE.Vector3(x,y,z));
  return new THREE.Raycaster(origin,destination.sub(origin).normalize());
};
function dragTo(moment,id,x,y,pointerId=7){
  const pane=moment.snapshot().panes.find(p=>p.id===id);
  assert.equal(moment.pointer('down',at(moment,...pane.position),{button:0,pointerId}),true);
  assert.equal(moment.pointer('move',at(moment,x,y,pane.position[2]),{pointerId}),true);
  assert.equal(moment.pointer('up',null,{pointerId}),true);
}
const alignedDraft=()=>{
  const draft=createRainDraft();
  for(const pane of RAIN_PANES)moveRainPane(draft,pane.id,...pane.target);
  return draft;
};

test('three authored silhouettes begin displaced; their paper regions overlap in the final composition',()=>{
  const draft=createRainDraft(),result=evaluateRainDraft(draft);
  assert.equal(result.ready,false);assert.equal(result.aligned,0);assert.equal(result.progress,0);
  assert.equal(new Set(RAIN_PANES.map(p=>p.shape)).size,3);
  assert.ok(RAIN_PANES.every(p=>Object.isFrozen(p.target)&&Object.isFrozen(p.start)));
  const flower=RAIN_PANES.find(p=>p.id==='bloom'),window=RAIN_PANES.find(p=>p.id==='window');
  assert.ok(Math.abs(flower.target[0]-window.target[0])<1.03);
  assert.ok(Math.abs(flower.target[1]-window.target[1])<1.36);
});

test('restoring a draft normalizes unknown versions and hostile numeric data without trusting completion flags',()=>{
  const start=createRainDraft();
  for(const input of [undefined,null,[],{},'ready',{version:2,ready:true}])assert.deepEqual(restoreRainDraft(input),start);
  const input={version:1,ready:true,selected:'invalid',positions:{tree:{x:Infinity,y:NaN},window:{x:999,y:-999},bloom:{x:'0.08',y:1.14}}};
  const restored=restoreRainDraft(input);
  assert.deepEqual(restored.positions.tree,start.positions.tree);
  assert.deepEqual(restored.positions.window,{x:RAIN_LIMITS.maxX,y:RAIN_LIMITS.minY});
  assert.equal(restored.positions.bloom.x,start.positions.bloom.x);
  assert.equal(restored.selected,'tree');assert.equal(evaluateRainDraft(restored).ready,false);
  restored.positions.tree.x=0;assert.equal(input.positions.tree.x,Infinity);
});

test('alignment is spatial, reversible and tolerant, with no colour or timer dependency',()=>{
  const draft=createRainDraft();
  for(let i=0;i<RAIN_PANES.length;i++){
    const p=RAIN_PANES[i];moveRainPane(draft,p.id,p.target[0]+.08,p.target[1]-.08);
    const result=evaluateRainDraft(draft);assert.equal(result.aligned,i+1);assert.equal(result.ready,i===2);
  }
  assert.equal(evaluateRainDraft(draft).progress,1);
  moveRainPane(draft,'tree',-1.75,.8);assert.equal(evaluateRainDraft(draft).ready,false);
  const before=structuredClone(draft);
  for(const [id,x,y] of [['unknown',0,0],['tree',NaN,0],['tree',0,Infinity]])assert.equal(moveRainPane(draft,id,x,y),false);
  assert.deepEqual(draft,before);
});

test('ordinary raycasts move sheets continuously under translated, rotated and scaled parent transforms',()=>{
  const moment=createRainMoment(),parent=new THREE.Group();
  parent.position.set(-12,1.9,-1);parent.rotation.set(.04,.47,-.03);parent.scale.set(1.15,.91,1.04);parent.add(moment.group);
  activate(moment);
  dragTo(moment,'tree',-.76,2.00);
  let snapshot=moment.snapshot();approx(snapshot.draft.positions.tree.x,-.76);approx(snapshot.draft.positions.tree.y,2.00);
  assert.equal(snapshot.aligned,1);assert.equal(snapshot.phase,'emerging');assert.equal(snapshot.undoCount,1);
  assert.notDeepEqual(snapshot.panes[0].position,snapshot.panes[0].worldPosition);
  for(const id of ['window','bloom']){const p=RAIN_PANES.find(p=>p.id===id);dragTo(moment,id,...p.target);}
  snapshot=moment.snapshot();assert.equal(snapshot.ready,true);assert.equal(snapshot.phase,'garden');
  assert.equal(snapshot.undoCount,3);assert.ok(snapshot.hint.includes('春窗'));
  moment.dispose();
});

test('several pointer moves form one undo record and never snap to authored targets',()=>{
  const moment=createRainMoment();activate(moment);const start=moment.snapshot().draft;
  const p=moment.snapshot().panes[0];moment.pointer('down',at(moment,...p.position),{pointerId:1});
  for(const [x,y] of [[-1.2,1.5],[-.9,1.9],[-.72,2.02]])moment.pointer('move',at(moment,x,y,p.position[2]),{pointerId:1});
  let s=moment.snapshot();assert.equal(s.undoCount,0);assert.equal(s.dragging,true);
  approx(s.draft.positions.tree.x,-.72);approx(s.draft.positions.tree.y,2.02);assert.equal(s.aligned,1);
  moment.pointer('up',null,{pointerId:1});assert.equal(moment.snapshot().undoCount,1);
  assert.equal(moment.action('undo'),true);assert.deepEqual(moment.snapshot().draft,start);
  moment.dispose();
});

test('a cancelled gesture restores its own start and cannot consume a previous completed gesture',()=>{
  const moment=createRainMoment();activate(moment);
  dragTo(moment,'tree',-1.30,1.40);const committed=moment.snapshot().draft;
  const p=moment.snapshot().panes[0];moment.pointer('down',at(moment,...p.position),{pointerId:3});
  moment.pointer('move',at(moment,-.65,2.08,p.position[2]),{pointerId:3});
  assert.equal(moment.action('undo'),true);
  assert.deepEqual(moment.snapshot().draft,committed);assert.equal(moment.snapshot().undoCount,1);
  assert.equal(moment.action('undo'),true);assert.deepEqual(moment.snapshot().draft,createRainDraft());
  moment.dispose();
});

test('other fingers, non-primary buttons and pointer misses cannot steal or end an active drag',()=>{
  const moment=createRainMoment();activate(moment);const p=moment.snapshot().panes[0];
  assert.equal(moment.pointer('down',at(moment,...p.position),{button:2,pointerId:1}),false);
  assert.equal(moment.pointer('down',at(moment,20,20,0),{button:0,pointerId:1}),false);
  moment.pointer('down',at(moment,...p.position),{pointerId:1});
  const before=moment.snapshot().draft;
  assert.equal(moment.pointer('move',at(moment,-.65,2.08,p.position[2]),{pointerId:2}),false);
  assert.equal(moment.pointer('down',at(moment,...p.position),{pointerId:2}),false);
  assert.equal(moment.pointer('up',null,{pointerId:2}),false);
  assert.deepEqual(moment.snapshot().draft,before);assert.equal(moment.snapshot().dragging,true);
  moment.pointer('cancel',null,{});assert.equal(moment.snapshot().dragging,false);
  moment.dispose();
});

test('keyboard selection and fine placement share the spatial rules; reset can be undone',()=>{
  const moment=createRainMoment();activate(moment);
  assert.equal(moment.key({code:'Digit2'}),true);assert.equal(moment.snapshot().selected,'window');
  const start=moment.snapshot().draft.positions.window;
  moment.key({code:'ArrowLeft'});moment.key({code:'ArrowDown',shiftKey:true});
  const after=moment.snapshot().draft;approx(after.positions.window.x,start.x-.09);approx(after.positions.window.y,start.y-.025);
  assert.equal(moment.snapshot().ready,false);
  for(const code of ['KeyE','Space','Enter'])assert.equal(moment.key({code}),false);
  assert.equal(moment.key({code:'ArrowLeft',ctrlKey:true}),false);
  assert.equal(moment.key({code:'ArrowLeft',type:'keyup'}),false);
  moment.key({code:'KeyR'});assert.deepEqual(moment.snapshot().draft,createRainDraft());
  moment.key({code:'KeyZ'});assert.deepEqual(moment.snapshot().draft,after);
  moment.key({code:'KeyZ',repeat:true});assert.deepEqual(moment.snapshot().draft,after);
  moment.key({code:'ArrowLeft',repeat:true});approx(moment.snapshot().draft.positions.window.x,after.positions.window.x-.09);
  moment.dispose();
});

test('leaving, pausing and zero time do not advance growth or retain a half-finished gesture',()=>{
  const moment=createRainMoment();assert.equal(moment.action('right'),false);assert.equal(moment.key({code:'ArrowRight'}),false);
  activate(moment);const p=moment.snapshot().panes[0],before=moment.snapshot().draft;
  moment.pointer('down',at(moment,...p.position),{pointerId:1});moment.pointer('move',at(moment,...p.target),{pointerId:1});
  assert.equal(moment.snapshot().aligned,1);
  moment.update(10,0,{active:true});assert.deepEqual(moment.snapshot().growth,[0,0,0]);
  moment.update(10,.016,{active:false});assert.deepEqual(moment.snapshot().draft,before);assert.equal(moment.snapshot().dragging,false);
  moment.update(1000,1000,{active:false});assert.deepEqual(moment.snapshot().growth,[0,0,0]);
  assert.equal(moment.pointer('down',at(moment,...p.position),{}),false);
  moment.dispose();
});

test('each placed silhouette reveals growth, and complete alignment emits one completion event',()=>{
  const sounds=[],moment=createRainMoment({onSound:(name,payload)=>sounds.push({name,payload})});activate(moment);
  for(const p of RAIN_PANES){dragTo(moment,p.id,...p.target);moment.update(1,.05,{active:true});}
  assert.equal(sounds.filter(s=>s.name==='light-place').length,3);
  assert.equal(sounds.filter(s=>s.name==='light-complete').length,1);
  assert.ok(moment.snapshot().growth.every(n=>n>0));
  const resources=[];moment.group.traverse(o=>{if(o.geometry)resources.push(o.geometry);});
  for(let i=0;i<60;i++)moment.update(2+i*.016,.016,{active:true,reducedMotion:true,palette:['#64a3bb']});
  assert.equal(sounds.filter(s=>s.name==='light-complete').length,1);
  const after=[];moment.group.traverse(o=>{if(o.geometry)after.push(o.geometry);});assert.deepEqual(after,resources);
  moment.dispose();
});

test('guidance follows the actual order of discovery rather than assuming the tree was placed first',()=>{
  const moment=createRainMoment();activate(moment);
  moment.action('select','window');assert.ok(moment.snapshot().hint.includes('带拱顶的小窗'));
  dragTo(moment,'window',...RAIN_PANES.find(p=>p.id==='window').target);
  let s=moment.snapshot();assert.ok(s.hint.includes('枝叶花笺与花冠花笺'));assert.ok(s.status.includes('窗影花笺已经显影'));
  dragTo(moment,'bloom',...RAIN_PANES.find(p=>p.id==='bloom').target);
  s=moment.snapshot();assert.ok(s.hint.startsWith('只剩枝叶花笺'));assert.equal(s.aligned,2);
  moment.dispose();
});

test('pollen uses the actual bouquet palette fields and updates when flower series changes',()=>{
  const moment=createRainMoment(),pollen=moment.group.getObjectByName('light-room-pollen');
  for(const kind of ['silver','lily','crystal','amber','celadon']){
    const palette=getFlowerPalette(kind);moment.update(1,.016,{active:true,palette});
    const expected=new THREE.Color(palette.pollen);approx(pollen.material.color.r,expected.r);approx(pollen.material.color.g,expected.g);approx(pollen.material.color.b,expected.b);
  }
  moment.dispose();
});

test('silhouette batching keeps the light room below a modest draw-item budget without removing three pick targets',()=>{
  const moment=createRainMoment();let draws=0,picks=0;
  moment.group.traverse(o=>{if(o.isMesh||o.isLine||o.isPoints)draws++;if(o.userData.rainPane)picks++;});
  assert.ok(draws<=72,`light room has ${draws} drawable items`);assert.equal(picks,3);
  moment.dispose();
});

test('procedural shadow maps contain distinct visible botanical shapes and a soft edge without browser canvas',()=>{
  const moment=createRainMoment(),coverages=[];
  for(const p of RAIN_PANES){const pixels=moment.group.getObjectByName('light-shadow-'+p.id).material.map.image.data;let visible=0,soft=0;
    for(let i=3;i<pixels.length;i+=4){if(pixels[i]>0)visible++;if(pixels[i]>0&&pixels[i]<255)soft++;}
    assert.ok(visible>100&&visible<pixels.length/8);assert.ok(soft>100);coverages.push(visible);
  }
  assert.equal(new Set(coverages).size,3);moment.dispose();
});

test('save/restore is JSON data, reproduces actual positions and does not replay completion sound',()=>{
  const sounds=[],moment=createRainMoment({onSound:name=>sounds.push(name)});activate(moment);moment.restore(alignedDraft());
  const saved=JSON.parse(JSON.stringify(moment.snapshot().draft));assert.equal(moment.snapshot().ready,true);assert.equal(moment.snapshot().undoCount,0);
  assert.equal(sounds.length,0);assert.equal(moment.snapshot().growth.every(v=>v===1),true);
  const second=createRainMoment();second.restore(saved);assert.deepEqual(second.snapshot().draft,saved);assert.equal(second.snapshot().ready,true);
  saved.positions.tree.x=999;assert.notEqual(second.snapshot().draft.positions.tree.x,999);
  second.restore({version:1,ready:true});assert.equal(second.snapshot().ready,false);
  moment.dispose();second.dispose();
});

test('only a committed choice changes the living garden, while the paper layout and puzzle result stay intact',()=>{
  const moment=createRainMoment();moment.restore(alignedDraft());const draft=moment.snapshot().draft;
  moment.update(0,0,{active:false,choice:'tree',completed:false});assert.equal(moment.snapshot().outcome.choice,null);
  assert.equal(moment.snapshot().outcome.plants[0].scale[1],1);
  moment.update(0,0,{active:false,choice:'tree',completed:true});const tree=moment.snapshot();
  assert.equal(tree.outcome.choice,'tree');assert.ok(tree.outcome.plants[0].scale[1]>1.5);assert.ok(tree.outcome.plants[2].scale[1]<.7);
  assert.ok(tree.outcome.plants[1].position[0]<0);
  moment.update(0,0,{active:false,choice:'shoot',completed:true});const shoot=moment.snapshot();
  assert.equal(shoot.outcome.choice,'shoot');assert.ok(shoot.outcome.plants[2].scale[1]>1.3);assert.ok(shoot.outcome.plants[0].scale[1]<.9);
  assert.ok(shoot.outcome.plants[1].position[0]>0);
  assert.deepEqual(tree.draft,draft);assert.deepEqual(shoot.draft,draft);assert.equal(tree.ready,true);assert.equal(shoot.ready,true);
  moment.update(0,0,{active:false,choice:'unknown',completed:true});assert.equal(moment.snapshot().outcome.choice,null);
  moment.dispose();
});

test('committed result grows gently during play, settles immediately for reduced motion, and stays inside authored bounds',()=>{
  const moment=createRainMoment();moment.restore(alignedDraft());activate(moment);
  moment.update(.05,.05,{active:true,choice:'shoot',completed:true});const blend=moment.snapshot().outcome.blend.shoot;
  assert.ok(blend>0&&blend<1);moment.update(.1,.05,{active:true,choice:'shoot',completed:true});assert.ok(moment.snapshot().outcome.blend.shoot>blend);
  const bounds=new THREE.Box3(new THREE.Vector3(...moment.bounds.min),new THREE.Vector3(...moment.bounds.max));
  for(const choice of ['tree','shoot']){moment.update(.2,.05,{active:true,choice,completed:true,reducedMotion:true});assert.equal(moment.snapshot().outcome.blend[choice],1);assert.ok(bounds.containsBox(new THREE.Box3().setFromObject(moment.group)));}
  const before=moment.snapshot().outcome;moment.update(9999,0,{active:true,choice:'shoot',completed:true,reducedMotion:true});assert.deepEqual(moment.snapshot().outcome,before);
  moment.dispose();
});

test('authored view bounds contain geometry even when every sheet is moved to each movement limit',()=>{
  const moment=createRainMoment();
  const bound=new THREE.Box3(new THREE.Vector3(...moment.bounds.min),new THREE.Vector3(...moment.bounds.max));
  for(const [x,y] of [[RAIN_LIMITS.minX,RAIN_LIMITS.minY],[RAIN_LIMITS.maxX,RAIN_LIMITS.maxY]]){
    const draft=createRainDraft();for(const p of RAIN_PANES)moveRainPane(draft,p.id,x,y);moment.restore(draft);
    const actual=new THREE.Box3().setFromObject(moment.group);assert.ok(bound.containsBox(actual),`actual ${actual.min.toArray()} / ${actual.max.toArray()}`);
  }
  moment.group.traverse(object=>{const position=object.geometry?.attributes.position;if(position)for(const value of position.array)assert.ok(Number.isFinite(value));});
  const screen=moment.group.getObjectByName('light-room-linen-screen');assert.ok(screen);
  const pickables=[];moment.group.traverse(o=>{if(o.userData.rainPane)pickables.push(o);});assert.equal(pickables.length,3);
  moment.dispose();
});

test('disposal releases each owned geometry and material once and makes later input harmless',()=>{
  const moment=createRainMoment(),geometries=new Set(),materials=new Set(),textures=new Set(),events=new Map();
  moment.group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const material of Array.isArray(o.material)?o.material:[o.material])if(material){materials.add(material);for(const key of ['map','emissiveMap'])if(material[key])textures.add(material[key]);}});
  assert.equal(textures.size,5);
  for(const texture of textures){assert.ok(texture.isDataTexture);assert.ok(texture.image.data.some(v=>v!==0));}
  for(const resource of [...geometries,...materials,...textures]){events.set(resource,0);resource.addEventListener('dispose',()=>events.set(resource,events.get(resource)+1));}
  moment.dispose();moment.dispose();assert.equal(moment.group.children.length,0);
  assert.ok([...events.values()].every(v=>v===1));
  assert.equal(moment.action('reset'),false);assert.equal(moment.pointer('cancel',null),false);assert.equal(moment.key({code:'Digit1'}),false);
  assert.doesNotThrow(()=>moment.update(100,.1,{active:true}));assert.doesNotThrow(()=>moment.restore(alignedDraft()));
  assert.equal(moment.snapshot().disposed,true);
});
