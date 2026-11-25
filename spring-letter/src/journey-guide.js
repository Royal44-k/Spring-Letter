import * as THREE from 'three';
import {LETTER_BEDS,deliveryWaypoint} from './delivery.js';

// Names remain attached to places when the camera turns; no screen-left directions.
export function createJourneyGuide(container){
 const group=new THREE.Group();group.name='first-spring-remembers-the-wind';
 const colors=['#b9d9ea','#efb7ce','#e8cd93'];
 const wells=colors.map((color,i)=>{
  const node=new THREE.Group(),angle=-Math.PI/2+i*Math.PI*2/3;
  node.position.set(Math.cos(angle)*2.3,.04,Math.sin(angle)*2.3);
  const material=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.06,roughness:.5,metalness:.15});
  for(let j=0;j<7;j++){
   const petal=new THREE.Mesh(new THREE.SphereGeometry(.19,12,8),material);
   const a=j*Math.PI*2/7;petal.position.set(Math.sin(a)*.22,.02,Math.cos(a)*.22);petal.scale.set(.6,.12,1.45);petal.rotation.y=a;node.add(petal);
  }
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.48,.009,5,64),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.08,depthWrite:false}));
  ring.rotation.x=-Math.PI/2;node.add(ring);group.add(node);return {node,material,ring,value:0};
 });
 const markers=[{id:'flower',x:0,y:2.8,z:0,title:'沉睡的花'},
  {id:'wind',x:3,y:.9,z:-18,title:'避风的花杯'},
  {id:'source',x:0,y:1.05,z:-43,title:'种核花杯'},
  ...LETTER_BEDS.map(b=>({...b,id:b.purpose,y:1.35})),
  {id:'dock',x:0,y:1.7,z:-50.25,title:'启程台'}].map(target=>{
   const node=document.createElement('div');node.className='place-name';node.hidden=true;
   const name=document.createElement('b'),note=document.createElement('span');name.textContent=target.title;node.append(name,note);container.append(node);
   return {...target,node,note};
  });
 const compass=document.createElement('div');compass.className='journey-compass';compass.hidden=true;container.append(compass);
 const v=new THREE.Vector3(),forward=new THREE.Vector3(),to=new THREE.Vector3();
 return {group,
  update(t,dt,{state,mode,focus,camera,delivery,phase='solid'}){
   const active=mode==='play',p=state.player,readyToSend=state.cores.every(Boolean),dockDistance=Math.hypot(p.x,p.z+50.25);
   group.visible=mode!=='gallery';
   const stages=[state.p1.broken?1:0,(state.p1.ink||0)/1.2,state.p1.solved?1:0];
   wells.forEach((w,i)=>{w.value=THREE.MathUtils.damp(w.value,stages[i],3,dt);w.material.emissiveIntensity=.06+w.value*.7;w.ring.material.opacity=.08+w.value*.48;w.ring.scale.setScalar(1+Math.sin(t*.7+i)*.04*w.value);w.node.position.y=.04+w.value*.045;});
   camera.getWorldDirection(forward);
   for(const m of markers){
    let shown=active&&!state.ending;
    if(m.id==='flower')shown&&=!state.p1.solved&&!focus&&Math.hypot(p.x,p.z)<10;
    else if(m.id==='wind')shown&&=focus==='wind'&&!state.wind.solved;
    else shown&&=state.bridge.solved&&p.z<-39&&!focus;
    // The flower beds explain the choice. Once at the departure, its single
    // label takes over; stacking both at the same screen position hides words.
    if(m.purpose&&readyToSend&&dockDistance<3.1)shown=false;
    if(m.id==='dock')shown&&=readyToSend&&dockDistance<3.1;
    if(m.id==='source')shown&&=delivery.carried===null&&state.cores.some(c=>!c);
    to.set(m.x,m.y,m.z).sub(camera.position);const front=to.dot(forward)>0;
    v.set(m.x,m.y,m.z).project(camera);let x=(v.x*.5+.5)*innerWidth,y=(-v.y*.5+.5)*innerHeight;
    const inView=front&&x>45&&x<innerWidth-45&&y>115&&y<innerHeight-160;
    const edge=shown&&!!m.purpose&&!inView;
    shown&&=inView||edge;m.node.classList.toggle('offscreen',edge);
    if(edge){const right=to.x*camera.matrixWorld.elements[0]+to.y*camera.matrixWorld.elements[1]+to.z*camera.matrixWorld.elements[2];x=right<0?55:innerWidth-55;y=165+LETTER_BEDS.findIndex(b=>b.purpose===m.id)*48;}
    m.node.hidden=!shown;if(!shown)continue;
    m.node.style.transform=`translate(${x}px,${y}px) translate(-50%,-100%)`;
    const occupied=state.cores.includes(m.id);
    m.node.classList.toggle('planted',occupied);
    m.note.textContent=edge?'镜头外 · 拖动环看':m.purpose?(occupied?'已种下 · 可以取回':m.detail):m.id==='source'?'点按 E 拿起':m.id==='flower'?'靠近 · E 细看':m.id==='wind'?'把光引到这里':'点按 E 查看春信';
   }
   compass.hidden=!active||!!focus||!!state.ending;
   if(!compass.hidden){
    let target=!state.p1.solved?{x:0,z:0,title:'沉睡的花'}:!state.wind.solved?{x:0,z:-16,title:'风廊'}:!state.bridge.solved?{x:0,z:state.bridge.platform==='M'?-38:-26,title:state.bridge.platform==='M'?'彼岸':'借桥的石台'}:deliveryWaypoint(state,delivery.carried);
    if(state.bridge.solved&&delivery.carried!==null)target=null;
    if(target){const d=Math.hypot(target.x-p.x,target.z-p.z);compass.textContent=target.title+(d>2?' · '+Math.round(d)+'步':' · 就在身边');}
    else compass.textContent=delivery.carried!==null?'一枚种核，正在你手中':'花庭可以慢慢走';
   }
  },
  dispose(){markers.forEach(m=>m.node.remove());compass.remove();const materials=new Set();group.traverse(o=>{o.geometry?.dispose();if(o.material)materials.add(o.material);});materials.forEach(m=>m.dispose());}
 };
}
