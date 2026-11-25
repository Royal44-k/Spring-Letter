import * as THREE from 'three';
export const LETTER_BEDS=Object.freeze([
 Object.freeze({purpose:'memory',x:-3,z:-46,title:'旧日的灯',detail:'让故乡的声音继续被听见',color:'#a8ceef'}),
 Object.freeze({purpose:'season',x:0,z:-48,title:'眼前的四季',detail:'让这里的花重新生长、更替',color:'#edb0be'}),
 Object.freeze({purpose:'voyage',x:3,z:-46,title:'远方的新庭',detail:'让花帆带种子去往新的土地',color:'#e9bd77'}),
]);
const SOURCE=Object.freeze({id:'source',x:0,z:-43,title:'种核花杯'});
const DOCK=Object.freeze({id:'dock',x:0,z:-50.25,title:'启程台'});
const dist=(p,t)=>Math.hypot(p.x-t.x,p.z-t.z);
const validCarry=(state,value)=>state.bridge.solved&&!state.ending&&[0,1].includes(value)&&state.cores[value]===null?value:null;
// The current interaction may be "take it back"; the onward route should still
// lead to the next unfilled part of the letter rather than undoing that choice.
export function deliveryWaypoint(state,carried){
 if(!state.bridge.solved||state.ending||validCarry(state,carried)!==null)return null;
 return state.cores.every(Boolean)?DOCK:SOURCE;
}
export function deliveryIntent(state,player,carried){
 if(!state.bridge.solved||state.ending||player.z>-40)return null;
 carried=validCarry(state,carried);
 const placed=state.cores.filter(Boolean).length;
 const stage=carried!==null?'choose':placed===2?'send':placed===1?'second':'first';
 const base={stage,carried,placed,total:2};
 const bed=LETTER_BEDS.find(b=>dist(player,b)<1.6);
 if(bed){const occupied=state.cores.indexOf(bed.purpose);
  if(carried!==null)return occupied<0?{...base,kind:'plant',id:carried,purpose:bed.purpose,title:bed.title,detail:bed.detail+'。放下后，还可以取回。',actionLabel:'种在这里',target:bed}:{...base,kind:'full',title:bed.title,detail:'这里已经种下一枚。另一座空花庭还在等你。',actionLabel:'这里已有种核',target:bed};
  if(occupied>=0)return {...base,kind:'lift',id:occupied,purpose:null,title:bed.title,detail:bed.detail+'。启程前可以换个去处。',actionLabel:'重新带走',target:bed};
  return {...base,kind:'empty',title:bed.title,detail:bed.detail+'。先从入口花杯带来一枚种核。',actionLabel:'先去拿种核',target:SOURCE};
 }
 if(dist(player,SOURCE)<1.6){
  if(carried!==null)return {...base,kind:'carry',title:'种核已在你手中',detail:'带它走向旧灯、四季或远方；靠近时可以看到它会带来什么。',actionLabel:'走向一座花庭',target:null};
  const id=state.cores.findIndex(v=>v===null);
  if(id>=0)return {...base,kind:'take',id,title:placed?'还有一枚种核':'两枚种核，三座花庭',detail:placed?'带上这一枚，再去看看另一座花庭。':'先带上一枚。哪座花庭会让你想留下它？',actionLabel:'拿起种核',target:SOURCE};
 }
 if(carried===null&&placed===2&&dist(player,DOCK)<1.75)return {...base,kind:'send',title:'春信已备好',detail:'寄出前，看看这两枚种核会带来什么。你仍可以回来更改。',actionLabel:'看看这封春信',target:DOCK};
 const target=carried!==null?null:placed===2?DOCK:SOURCE;
 return {...base,kind:'walk',title:carried!==null?'把种核带去你想照料的地方':placed===2?'两座花庭已经醒来':'还有一枚春天在等你',detail:carried!==null?'找一找蓝色听声环、粉色新芽与金色花帆。走近听听它们的愿望。':placed===2?'沿着花粉，走到前方的启程台。':'沿着花粉，回到入口的种核花杯。',actionLabel:carried!==null?'走近一座花庭':placed===2?'走向启程台':'回到种核花杯',target};
}
export function createDelivery(){
 const group=new THREE.Group();group.name='a-spring-carried-by-hand';
 const gold=new THREE.MeshStandardMaterial({color:'#e1ba7a',metalness:.32,roughness:.35,emissive:'#b67b43',emissiveIntensity:.18});
 const light=new THREE.MeshBasicMaterial({color:'#ffe5aa'});
 const rose=new THREE.MeshBasicMaterial({color:'#ebbfcb',transparent:true,opacity:.6,depthWrite:false});
 const stone=new THREE.MeshStandardMaterial({color:'#9b879b',roughness:.6});
 const add=(geometry,material,x,y,z)=>{const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);group.add(m);return m;};
 add(new THREE.CylinderGeometry(.64,.78,.22,36),stone,0,.1,-43);
 const pods=[-.25,.25].map(x=>{const m=add(new THREE.SphereGeometry(.16,16,12),gold,x,.6,-43);m.scale.set(.8,1.55,.8);return m;});
 const carriedMesh=add(new THREE.SphereGeometry(.14,16,12),light,0,0,0);carriedMesh.scale.set(.8,1.45,.8);
 const landing=add(new THREE.TorusGeometry(.77,.012,5,60),rose,0,.36,-43);landing.rotation.x=-Math.PI/2;
 const dock=add(new THREE.TorusGeometry(.85,.035,6,70),gold,0,.12,-50.25);dock.rotation.x=-Math.PI/2;
 const mast=add(new THREE.CylinderGeometry(.018,.025,1.3,8),gold,0,.72,-50.25);
 const sail=add(new THREE.PlaneGeometry(.52,.38),rose,.25,1.16,-50.25);sail.rotation.y=.45;
 const guideGeometry=new THREE.BufferGeometry();guideGeometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(48*3),3));
 const guideMaterial=new THREE.PointsMaterial({color:'#f4cf96',size:.065,transparent:true,opacity:.7,depthWrite:false});
 const guide=new THREE.Points(guideGeometry,guideMaterial);guide.frustumCulled=false;group.add(guide);
 let carried=null,lastTrigger=false,context=null,flight=null;
 const targets=[SOURCE,...LETTER_BEDS.map(b=>({...b,id:b.purpose})),DOCK];
 return {group,targets,get context(){return context;},get carried(){return carried;},
  persistCarried(){return carried;},restoreCarried(value,state){carried=validCarry(state,value);lastTrigger=false;return carried;},
  reset(){carried=null;lastTrigger=false;context=null;flight=null;},
  update(t,dt,{state,player,trigger=false,active=true}){
   group.visible=!!state.bridge.solved;const signals=[];
   carried=validCarry(state,carried);
   const intent=active?deliveryIntent(state,player,carried):null;
   const fired=active&&trigger&&!lastTrigger;lastTrigger=!!trigger;
   if(fired&&intent){
    if(intent.kind==='take'){carried=intent.id;signals.push({type:'carry',id:carried});}
    else if(intent.kind==='plant'){
     flight={at:t,from:new THREE.Vector3(player.x+.25,(player.y??.35)+.75,player.z),to:new THREE.Vector3(intent.target.x,.7,intent.target.z)};
     signals.push({type:'allocate',id:carried,purpose:intent.purpose});carried=null;
    }else if(intent.kind==='lift'){carried=intent.id;signals.push({type:'allocate',id:carried,purpose:null});}
    else if(intent.kind==='send')signals.push({type:'preview-send'});
    else signals.push({type:'guide',text:intent.detail});
   }
   context=intent?{...intent,progress:0,carried}:null;
   pods.forEach((m,i)=>{m.visible=state.cores[i]===null&&carried!==i;m.position.y=.65+Math.sin(t*1.4+i)*.06;m.rotation.y=t*.45+i;});
   carriedMesh.visible=carried!==null&&active;
   carriedMesh.position.set(player.x+.3,(player.y??.35)+.78,player.z+.05);carriedMesh.rotation.y=t*.6;
   if(flight){const u=Math.min(1,(t-flight.at)/.6);carriedMesh.visible=true;carriedMesh.position.lerpVectors(flight.from,flight.to,u);carriedMesh.position.y+=Math.sin(u*Math.PI)*.5;if(u>=1)flight=null;}
   landing.rotation.z=t*.1;landing.material.opacity=.35+Math.sin(t*1.3)*.12;
   sail.rotation.y=.45+Math.sin(t*.7)*.12;dock.visible=state.cores.every(Boolean);mast.visible=sail.visible=dock.visible;
   const destination=deliveryWaypoint(state,carried);guide.visible=active&&!!destination&&!state.ending&&dist(player,destination)>1.7;
   if(guide.visible){const positions=guideGeometry.getAttribute('position');for(let i=0;i<48;i++){const u=(i/48+t*.1)%1;positions.setXYZ(i,THREE.MathUtils.lerp(player.x,destination.x,u),.19+Math.sin(u*Math.PI)*.2,THREE.MathUtils.lerp(player.z,destination.z,u));}positions.needsUpdate=true;}
   return signals;
  },dispose(){group.traverse(o=>o.geometry?.dispose());for(const m of [gold,light,rose,stone,guideMaterial])m.dispose();}}
}
