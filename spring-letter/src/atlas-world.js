import * as THREE from 'three';
import {createCourier} from './courier.js';
import {ATLAS_LOCATIONS,atlasLocation} from './atlas-content.js';
import {finite,bounded,surface,tube} from './atlas-world-geometry.js';
import {createConservatory,createObservatory,createMeadow} from './atlas-world-scenes.js';

/** Three separately authored destinations. This module only presents state;
 * movement, checkpoints, pollination and the constellation belong to the model. */
export function createAtlasWorld(){
 const group=new THREE.Group();group.name='spring-letter-distant-atlas';group.visible=false;
 const maps={conservatory:createConservatory(),observatory:createObservatory(),meadow:createMeadow()};
 for(const map of Object.values(maps))group.add(map.group);
 const actor=createCourier();actor.group.name='atlas-spring-courier';group.add(actor.group);actor.group.visible=false;
 const umbrella=new THREE.Group();umbrella.name='atlas-open-flower-parasol';umbrella.visible=false;group.add(umbrella);
 const umbrellaMat=new THREE.MeshStandardMaterial({name:'atlas-parasol-coral-paper',color:'#e5b4ae',side:THREE.DoubleSide,roughness:.9});
 const ribMat=new THREE.MeshStandardMaterial({name:'atlas-parasol-fine-brass',color:'#a5875e',metalness:.4,roughness:.62});
 const canopyGeo=surface(10,64,(u,v)=>{const a=-v*Math.PI*2,r=u*1.35*(1+.055*Math.cos(a*8));return[Math.cos(a)*r,.36*(1-u*u),Math.sin(a)*r];});
 const canopy=new THREE.Mesh(canopyGeo,umbrellaMat);canopy.name='atlas-eight-lobed-parasol-canopy';canopy.castShadow=true;umbrella.add(canopy);
 const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,1.18,8),ribMat);shaft.name='atlas-parasol-shaft';shaft.position.y=-.45;umbrella.add(shaft);
 const ribParts=[];for(let i=0;i<8;i++){const a=i*Math.PI/4;const rib=new THREE.Mesh(tube([[0,.34,0],[Math.cos(a)*.65,.24,Math.sin(a)*.65],[Math.cos(a)*1.4,-.01,Math.sin(a)*1.4]],.012,10,4),ribMat);rib.name='atlas-parasol-rib';umbrella.add(rib);ribParts.push(rib);}
 let active=null,disposed=false,lastTime=0,lastState={},actorPosition=new THREE.Vector3();
 function setLocation(id){
  if(disposed)return false;const next=maps[id]?id:null;
  for(const [key,map]of Object.entries(maps))map.group.visible=key===next;
  active=next;actor.group.visible=!!next;umbrella.visible=false;
  if(next){const spawn=atlasLocation(next).spawn;actorPosition.set(spawn.x,spawn.y+.17,spawn.z);actor.group.position.copy(actorPosition);}
  return!!next;
 }
 function update(time=0,dt=0,state={}){
  if(disposed||!active)return;
  lastTime=bounded(finite(time,lastTime),0,8640000);const delta=bounded(dt,0,.1);lastState=state&&typeof state==='object'?state:{};
  const spawn=atlasLocation(active).spawn,source=lastState.player||{},p={x:finite(source.x,spawn.x),y:finite(source.y,spawn.y),z:finite(source.z,spawn.z)};
  actorPosition.set(p.x,p.y+.17,p.z);actor.group.position.copy(actorPosition);actor.update(lastTime,delta,actorPosition,false,{dashing:false});
  umbrella.visible=active==='meadow'&&source.gliding===true;
  if(umbrella.visible){umbrella.position.set(p.x,p.y+1.85,p.z);umbrella.rotation.z=lastState.settings?.reducedMotion?0:Math.sin(lastTime*1.4)*.045;}
  maps[active].update(lastTime,delta,lastState,p);
 }
 function snapshot(){
  const map=maps[active];let meshes=0,triangles=0,objects=0,instances=0;
  const inspect=root=>root.traverse(object=>{
   objects++;if(object.isMesh){meshes++;const count=object.isInstancedMesh?object.count:1;instances+=object.isInstancedMesh?count:0;triangles+=((object.geometry.index?.count??object.geometry.attributes.position?.count??0)/3)*count;}
  });
  if(map)inspect(map.group);if(actor.group.visible)inspect(actor.group);if(umbrella.visible)inspect(umbrella);
  return{location:active,visibleLocations:Object.entries(maps).filter(([,m])=>m.group.visible).map(([id])=>id),landmarks:map?[...map.landmarks]:[],meshes,triangles:Math.round(triangles),objects,instances,
   player:actorPosition.toArray(),parasol:umbrella.visible,tracedSegments:active==='observatory'?map.tracedSegments:0,disposed,
   maps:ATLAS_LOCATIONS.map(({id,title})=>({id,title,landmarks:[...maps[id].landmarks]}))};
 }
 function dispose(){
  if(disposed)return;disposed=true;actor.dispose();
  const geometries=new Set(),materials=new Set([umbrellaMat,ribMat]),textures=new Set();
  group.traverse(object=>{
   if(object.geometry)geometries.add(object.geometry);
   for(const mat of Array.isArray(object.material)?object.material:object.material?[object.material]:[])materials.add(mat);
   if(object.isLight)object.dispose?.();
  });
  for(const map of Object.values(maps)){for(const mat of map.materials)materials.add(mat);for(const tex of map.textures)textures.add(tex);}
  for(const mat of materials){for(const value of Object.values(mat))if(value?.isTexture)textures.add(value);mat.dispose();}
  for(const tex of textures)tex.dispose();for(const geometry of geometries)geometry.dispose();
  group.removeFromParent();group.clear();active=null;
 }
 return{group,setLocation,update,snapshot,dispose};
}
