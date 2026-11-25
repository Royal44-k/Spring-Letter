import * as THREE from 'three';
import {RESONANCE_ROUTES,createResonanceState,serializeResonance,attemptResonance,cancelResonance,stepResonance,resonanceContext,resonanceNodePosition,resonanceNodeState,resonanceHazards,routeUnlocked,routeById} from './resonance-model.js';

const TAU=Math.PI*2;
const palette={drift:new THREE.Color('#b8eee2'),swift:new THREE.Color('#f3ba6c'),home:new THREE.Color('#e5f2e2'),storm:new THREE.Color('#b59bd0'),spent:new THREE.Color('#486d66'),escort:new THREE.Color('#edfaff'),escortTail:new THREE.Color('#79c9ee')};
function petalGeometry(){
 const positions=[],indices=[];
 for(let i=0;i<=8;i++){const t=i/8,w=Math.sin(t*Math.PI)*.15;positions.push(-w,Math.sin(t*Math.PI)*.07,t*.48,w,Math.sin(t*Math.PI)*.07,t*.48);if(i<8){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
function glowTexture(){
 const size=32,data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const a=(y*size+x)*4,r=Math.hypot(x/31*2-1,y/31*2-1);data[a]=data[a+1]=data[a+2]=255;data[a+3]=Math.round(Math.pow(Math.max(0,1-r),2)*255);}
 const texture=new THREE.DataTexture(data,size,size);texture.needsUpdate=true;return texture;
}

/** Self-contained world activity. Signals are requests; this never changes the main save. */
export function createResonance({saved}={}){
 const group=new THREE.Group();group.name='spring-courier-resonance';
 const geo=petalGeometry(),material=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.5,metalness:.12,side:THREE.DoubleSide,emissive:'#78978b',emissiveIntensity:.28});
 const petals=new THREE.InstancedMesh(geo,material,420);petals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);petals.frustumCulled=false;group.add(petals);
 const orbGeometry=new THREE.SphereGeometry(.1,8,6),orbMaterial=new THREE.MeshBasicMaterial({color:'#ffffff'}),cores=new THREE.InstancedMesh(orbGeometry,orbMaterial,64);cores.instanceMatrix.setUsage(THREE.DynamicDrawUsage);cores.frustumCulled=false;group.add(cores);
 const texture=glowTexture(),pointPositions=new Float32Array(300*3),pointColors=new Float32Array(300*3),pointGeometry=new THREE.BufferGeometry();pointGeometry.setAttribute('position',new THREE.BufferAttribute(pointPositions,3));pointGeometry.setAttribute('color',new THREE.BufferAttribute(pointColors,3));
 const pointMaterial=new THREE.PointsMaterial({size:.28,map:texture,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false,vertexColors:true});const points=new THREE.Points(pointGeometry,pointMaterial);points.frustumCulled=false;group.add(points);
 const baseGeo=new THREE.CylinderGeometry(.48,.62,.13,16),baseMat=new THREE.MeshStandardMaterial({color:'#637d78',roughness:.84,metalness:.04});
 const bases=RESONANCE_ROUTES.map(r=>{const mesh=new THREE.Mesh(baseGeo,baseMat);mesh.position.set(r.x,.18,r.z);mesh.receiveShadow=true;group.add(mesh);return mesh;});
 const dummy=new THREE.Object3D(),color=new THREE.Color();let model=createResonanceState(saved),context=resonanceContext(model),lastInput={player:{x:0,z:6},progress:{}},clock=0,disposed=false,bursts=[],trail=[],escortTrail=[];
 function accept(result){model=result.state;for(const signal of result.signals){if(signal.type==='collect')bursts.push({x:signal.x,z:signal.z,age:0,kind:signal.kind});}context=resonanceContext(model,lastInput.player,lastInput.progress);return result;}
 function render(time,dt,input){
  let petalCount=0,coreCount=0,pointCount=0;
  function leaf(x,y,z,rotation,scale,tint,pitch=.35){if(petalCount>=420)return;dummy.position.set(x,y,z);dummy.rotation.set(pitch,rotation,0);dummy.scale.setScalar(scale);dummy.updateMatrix();petals.setMatrixAt(petalCount,dummy.matrix);petals.setColorAt(petalCount++,tint);}
  function core(x,y,z,scale,tint){if(coreCount>=64)return;dummy.position.set(x,y,z);dummy.rotation.set(0,0,0);dummy.scale.setScalar(scale);dummy.updateMatrix();cores.setMatrixAt(coreCount,dummy.matrix);cores.setColorAt(coreCount++,tint);}
  function glow(x,y,z,tint,brightness=1){if(pointCount>=300)return;const i=pointCount++*3;pointPositions[i]=x;pointPositions[i+1]=y;pointPositions[i+2]=z;pointColors[i]=tint.r*brightness;pointColors[i+1]=tint.g*brightness;pointColors[i+2]=tint.b*brightness;}
  function blossom(x,y,z,scale,tint,spin=0,opening=1){core(x,y+.03,z,scale*.55,tint);for(let i=0;i<5;i++)leaf(x,y,z,spin+i*TAU/5,scale,tint,-1.12+1.47*opening);}
  const slow=input.reducedMotion?.28:1;
  for(let i=0;i<RESONANCE_ROUTES.length;i++){
   const route=RESONANCE_ROUTES[i],unlocked=routeUnlocked(route,input.progress),record=model.records[route.id];bases[i].visible=unlocked;if(!unlocked)continue;
   const active=model.run?.id===route.id,ready=active&&model.run.collected.length>=route.goal,tint=ready?palette.swift:palette.home;
   // A nest of curved petals with a rising seed ribbon, rather than a task ring.
   blossom(route.x,.34,route.z,1.2,tint,time*.08*slow);
   for(let j=0;j<12;j++){const a=j*.58+time*.22*slow,r=.22+Math.sin(j*.4)*.12;leaf(route.x+Math.cos(a)*r,.45+j*.12,route.z+Math.sin(a)*r,a+Math.PI*.5,.32,tint,Math.sin(a)*.8);glow(route.x+Math.cos(a)*r,.47+j*.12,route.z+Math.sin(a)*r,tint,.4);}
   const crown=.38+Math.sin(time*1.4*slow)*.06;blossom(route.x,2.02+crown,route.z,.67,tint,-time*.12*slow);
   for(let j=0;j<record.grade*4;j++){const a=j*2.399,r=.65+(j%3)*.25;blossom(route.x+Math.cos(a)*r,.29+(j%2)*.06,route.z+Math.sin(a)*r,.24+(j%3)*.04,j%2?palette.swift:palette.drift,a);}
  }
  const run=model.run;
  if(run){
   const route=routeById(run.id);
   for(const node of route.nodes){if(run.collected.includes(node.id))continue;const p=resonanceNodePosition(route,node,run.elapsed),availability=resonanceNodeState(route,node,run),nearPlayer=Math.hypot(p.x-input.player.x,p.z-input.player.z)<1.9;
    const opening=availability.requiresWalking&&run.dashing&&nearPlayer?.18:route.id==='homeward'&&node.kind==='swift'?THREE.MathUtils.smoothstep(Math.sin(run.elapsed*TAU/4.2+node.phase),-.6,-.2):availability.blockedReason==='escort'?.68:1,tint=opening===1?palette[node.kind]:color.copy(palette[node.kind]).multiplyScalar(.32+.68*opening),bob=Math.sin(run.elapsed*1.7+node.phase)*.09;
    blossom(p.x,.83+bob,p.z,(node.kind==='swift'?.72:.58)*(.72+.28*opening),tint,run.elapsed*(node.kind==='swift'?-.65:.22)*slow+node.phase,.06+.94*opening);
    glow(p.x,.83+bob,p.z,tint,.25+.95*opening);
    for(let j=1;j<5;j++){const q=resonanceNodePosition(route,node,Math.max(0,run.elapsed-j*.18));glow(q.x,.78+bob-j*.07,q.z,tint,.8-j*.12);}
   }
   for(const h of resonanceHazards(route,run.elapsed)){
    for(let j=0;j<12;j++){const a=run.elapsed*1.1*slow+j*.52,r=.3+j*.025;leaf(h.x+Math.cos(a)*r,.45+j*.045,h.z+Math.sin(a)*r,a,.42,palette.storm,.85);}
    glow(h.x,.7,h.z,palette.storm,.7);
   }
   if(run.escort){
    const e=run.escort,bob=Math.sin(run.elapsed*3*slow)*.065,height=1.06+bob,facing=Math.atan2(input.player.x-e.x,input.player.z-e.z);
    blossom(e.x,height,e.z,1.05,palette.escort,run.elapsed*.48*slow,.86);
    for(let j=0;j<4;j++){const a=facing+Math.PI+(j-1.5)*.25;leaf(e.x+Math.sin(a)*.12,height-.08-j*.035,e.z+Math.cos(a)*.12,a,.78-j*.1,palette.escortTail,-.38+Math.sin(run.elapsed*5+j)*.15*slow);}
    glow(e.x,height+.04,e.z,palette.escort,1.3);
    if(input.interactive!==false&&dt>0){escortTrail.push({x:e.x,z:e.z,age:0});if(escortTrail.length>24)escortTrail.shift();}
    for(const t of escortTrail){if(input.interactive!==false)t.age+=dt;glow(t.x,1.02-t.age*.16,t.z,palette.escortTail,Math.max(0,.95-t.age*1.1));}
    if(!e.near)for(let j=1;j<=8;j++){const f=j/9;glow(THREE.MathUtils.lerp(e.x,input.player.x,f),.74+Math.sin(f*Math.PI)*.22+Math.sin(run.elapsed*3-j)*.025,THREE.MathUtils.lerp(e.z,input.player.z,f),palette.escortTail,.28);}
   }else escortTrail=[];
   if(input.interactive!==false&&dt>0){trail.push({x:input.player.x,z:input.player.z,age:0});if(trail.length>32)trail.shift();}
   for(const t of trail){t.age+=dt;glow(t.x,.3+t.age*.12,t.z,input.dashing?palette.swift:palette.drift,Math.max(0,.8-t.age*.55));}
   if(run.collected.length>=route.goal){const d=Math.hypot(route.x-input.player.x,route.z-input.player.z);for(let j=1;j<=Math.min(12,Math.floor(d*2));j++){const f=j/(Math.min(12,Math.floor(d*2))+1);glow(THREE.MathUtils.lerp(input.player.x,route.x,f),.28+Math.sin(time*2-j*.6)*.035,THREE.MathUtils.lerp(input.player.z,route.z,f),palette.home,.55);}}
  }else{trail=[];escortTrail=[];}
  bursts=bursts.filter(b=>b.age<.9);for(const b of bursts){b.age+=dt;for(let j=0;j<9;j++){const a=j*TAU/9,r=b.age*(.7+(j%3)*.12);glow(b.x+Math.cos(a)*r,.8+Math.sin(b.age*Math.PI)*.45,b.z+Math.sin(a)*r,palette[b.kind],(1-b.age/.9)*.9);}}
  petals.count=petalCount;cores.count=coreCount;petals.instanceMatrix.needsUpdate=true;cores.instanceMatrix.needsUpdate=true;if(petals.instanceColor)petals.instanceColor.needsUpdate=true;if(cores.instanceColor)cores.instanceColor.needsUpdate=true;pointGeometry.setDrawRange(0,pointCount);pointGeometry.attributes.position.needsUpdate=true;pointGeometry.attributes.color.needsUpdate=true;
 }
 return {
  group,
  update(time,dt,input={}){if(disposed)return [];lastInput={player:input.player||lastInput.player,progress:input.progress||{},...input};clock=Number.isFinite(time)?time:clock;const result=accept(stepResonance(model,lastInput,dt));render(clock,Math.max(0,Math.min(dt||0,.1)),lastInput);return result.signals;},
  attempt(player=lastInput.player,progress=lastInput.progress){lastInput={...lastInput,player,progress};const result=accept(attemptResonance(model,player,progress));render(clock,0,lastInput);return {ok:result.ok,signals:result.signals,reason:result.reason};},
  cancel(){const result=accept(cancelResonance(model));trail=[];escortTrail=[];return result.signals;},
  reset(savedValue){model=createResonanceState(savedValue);bursts=[];trail=[];escortTrail=[];context=resonanceContext(model,lastInput.player,lastInput.progress);render(clock,0,lastInput);},
  persist(){return serializeResonance(model);},
  get context(){return {...context};},
  snapshot(){const route=model.run?routeById(model.run.id):null;return {active:!!model.run,context:{...context},records:JSON.parse(JSON.stringify(model.records)),run:model.run?{...model.run,collected:[...model.run.collected],previous:model.run.previous?{...model.run.previous}:null,escort:model.run.escort?{...model.run.escort}:null}:null,escort:model.run?.escort?{...model.run.escort}:null,result:model.result?{...model.result}:null,nodes:route?route.nodes.map(node=>({id:node.id,...resonanceNodePosition(route,node,model.run.elapsed),kind:node.kind,type:node.kind,collected:model.run.collected.includes(node.id),...resonanceNodeState(route,node,model.run)})):[],hazards:route?resonanceHazards(route,model.run.elapsed):[],stations:RESONANCE_ROUTES.map(r=>({id:r.id,title:r.title,x:r.x,z:r.z,unlocked:routeUnlocked(r,lastInput.progress),completed:model.records[r.id].completions>0})),resources:{geometries:4,materials:4,textures:1}};},
  dispose(){if(disposed)return;disposed=true;group.removeFromParent();geo.dispose();material.dispose();orbGeometry.dispose();orbMaterial.dispose();pointGeometry.dispose();pointMaterial.dispose();texture.dispose();baseGeo.dispose();baseMat.dispose();group.clear();bursts=[];trail=[];escortTrail=[];},
 };
}
