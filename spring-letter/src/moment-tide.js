import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const TIDE_BEATS=8;
export const TIDE_STEP_SECONDS=.65;
export const TIDE_VOICES=Object.freeze([
 {id:'cup',label:'杯声',instrument:'piano',shape:'cup',color:'#f5d6a2',base:60},
 {id:'harp',label:'弦声',instrument:'harp',shape:'lyre',color:'#e4a3bc',base:72},
 {id:'wind',label:'风声',instrument:'flute',shape:'reed',color:'#98d3cf',base:72},
]);
const finite=(v,d=0)=>Number.isFinite(v)?v:d;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const tones=[0,4,7,9,7,4,2,0];
const emptyNotes=()=>Array.from({length:3},()=>Array(8).fill(false));
const validCell=(voice,beat)=>Number.isInteger(voice)&&voice>=0&&voice<3&&Number.isInteger(beat)&&beat>=0&&beat<8;
export function tideSignature(notes){return notes.map(row=>row.map(Boolean).map(Number).join('')).join(':');}
export function tideScoreCounts(score){return {notes:score.notes.reduce((sum,row)=>sum+row.filter(Boolean).length,0),voices:score.notes.filter(row=>row.some(Boolean)).length};}
export function createTideScore(){return {version:1,notes:emptyNotes(),selectedVoice:0,selectedBeat:0,heardSignature:null,playCount:0,playing:false,elapsed:0,nextBeat:0,playhead:-1};}
export function tideScoreReady(score){const n=tideScoreCounts(score);return n.notes>=3&&n.voices>=2&&score.heardSignature===tideSignature(score.notes);}
export function tideDraft(score){return {version:1,notes:score.notes.map(row=>row.slice()),selectedVoice:score.selectedVoice,selectedBeat:score.selectedBeat,heardSignature:score.heardSignature,playCount:score.playCount};}
export function restoreTideScore(data){
 const score=createTideScore();if(data?.version!==1)return score;
 for(let voice=0;voice<3;voice++)for(let beat=0;beat<8;beat++)score.notes[voice][beat]=data.notes?.[voice]?.[beat]===true;
 score.selectedVoice=clamp(Math.floor(finite(data.selectedVoice)),0,2);score.selectedBeat=clamp(Math.floor(finite(data.selectedBeat)),0,7);
 score.playCount=clamp(Math.floor(finite(data.playCount)),0,9999);
 if(data.heardSignature===tideSignature(score.notes)&&tideScoreCounts(score).notes>=3&&tideScoreCounts(score).voices>=2)score.heardSignature=data.heardSignature;
 return score;
}
export function stopTidePlayback(score){score.playing=false;score.elapsed=0;score.nextBeat=0;score.playhead=-1;}
export function editTideNote(score,voice,beat,value){
 if(!validCell(voice,beat))return false;
 const next=value===undefined?!score.notes[voice][beat]:value===true;if(score.notes[voice][beat]===next)return false;
 score.notes[voice][beat]=next;score.selectedVoice=voice;score.selectedBeat=beat;score.heardSignature=null;stopTidePlayback(score);return true;
}
export function startTidePlayback(score){if(!tideScoreCounts(score).notes)return false;stopTidePlayback(score);score.playing=true;return true;}
/** Only an actual complete pass marks this exact score as heard. Pauses supply no delta. */
export function stepTidePlayback(score,dt){
 const events=[];if(!score.playing||!Number.isFinite(dt)||dt<=0)return events;
 score.elapsed+=Math.min(.1,dt);
 while(score.nextBeat<8&&score.nextBeat*TIDE_STEP_SECONDS<=score.elapsed){
  const beat=score.nextBeat++;score.playhead=beat;
  for(let voice=0;voice<3;voice++)if(score.notes[voice][beat])events.push({type:'note',voice,beat});
  events.push({type:'beat',beat});
 }
 if(score.elapsed+1e-8>=8*TIDE_STEP_SECONDS){score.heardSignature=tideSignature(score.notes);score.playCount++;score.playing=false;score.playhead=-1;events.push({type:'complete'});}
 return events;
}

const place=(voice,beat)=>{
 const x=(beat-3.5)*.91+[.16,-.14,.03][voice]+.035*Math.sin(beat*1.1+voice);
 return new THREE.Vector3(x,.68+voice*.87+.13*Math.sin(beat*.8+voice*1.4),-.83+.055*x*x-voice*.30+.065*Math.sin(beat*.7+voice));
};
const ECHOES=12,TRAIL_POINTS=12;
const WATER_VERTEX=`varying vec3 vLocal; varying vec3 vWorld;
void main(){vLocal=position;vec4 world=modelMatrix*vec4(position,1.0);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`;
const WATER_FRAGMENT=`uniform float uTime; uniform float uMotion;
uniform vec4 uEchoes[12]; uniform vec3 uColors[12];
varying vec3 vLocal; varying vec3 vWorld;
void main(){
 vec2 p=vLocal.xz; float t=uTime*.32;
 float a=sin(p.x*2.8+p.y*1.9+t),b=sin(p.y*4.3-p.x*.8-t*.72);
 vec3 n=normalize(vec3(a*.11,1.0,b*.13));
 vec3 eye=normalize(cameraPosition-vWorld),light=normalize(vec3(-.4,1.0,.7));
 float shine=pow(max(dot(reflect(-light,n),eye),0.0),26.0);
 float threads=pow(.5+.5*sin(p.x*8.0+p.y*5.0+a*1.8+b*.7),14.0);
 float caustic=threads*pow(.5+.5*sin(p.y*7.0-p.x*2.3+b),5.0);
 float depth=smoothstep(-2.4,1.6,p.y);
 vec3 color=mix(vec3(.018,.055,.10),vec3(.045,.17,.20),depth);
 color+=vec3(.12,.24,.28)*shine+vec3(.10,.23,.24)*caustic*.38;
 color+=vec3(.025,.075,.09)*(.5+.5*sin(p.x*1.5+p.y*2.3+a*.5));
 // Broken reflected bands follow the small surface normals instead of a flat fill.
 float bandDistance=(p.x+p.y*.3+sin(p.y*2.0+t)*.12-1.0)/.26;
 float band=exp(-bandDistance*bandDistance);
 color+=vec3(.10,.15,.17)*band*(.3+.7*pow(.5+.5*sin(p.y*16.0+t),3.0));
 for(int i=0;i<12;i++){
  float age=uEchoes[i].z,energy=uEchoes[i].w*max(0.0,1.0-age/2.8);
  float d=length(p-uEchoes[i].xy),radius=mix(.18,age*.85,uMotion);
  float ringDistance=(d-radius)/.042,innerDistance=(d-radius*.69)/.027;
  float ring=exp(-ringDistance*ringDistance);
  float inner=exp(-innerDistance*innerDistance)*.34;
  color+=uColors[i]*(ring+inner)*energy*.55;
  color+=uColors[i]*exp(-d*d*5.0)*energy*.10;
 }
 gl_FragColor=vec4(color,1.0);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const VEIL_VERTEX=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const VEIL_FRAGMENT=`uniform float uTime;varying vec2 vUv;
void main(){
 vec2 p=vUv;float haze=sin(p.x*8.0+p.y*3.0+uTime*.05)*.5+.5;
 // Multisampled edge fragments may extrapolate UVs beyond the triangle.
 // Fractional pow requires a nonnegative base, including at clipped edges.
 vec3 color=mix(vec3(.018,.045,.080),vec3(.075,.15,.21),pow(clamp(p.y,0.0,1.0),.7));
 color+=vec3(.018,.033,.038)*haze;
 float glow=exp(-length((p-vec2(.65,.58))*vec2(3.5,2.2))*2.0);
 color+=vec3(.025,.045,.055)*glow;
 float edge=smoothstep(0.0,.13,p.x)*smoothstep(0.0,.13,1.0-p.x)*smoothstep(0.0,.17,1.0-p.y);
 gl_FragColor=vec4(color,edge*.96);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const TRACE_VERTEX=`attribute vec3 color;attribute float aLife;varying vec3 vColor;varying float vLife;
void main(){vColor=color;vLife=aLife;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=clamp(34.0/max(.1,-mv.z),1.0,7.0);gl_Position=projectionMatrix*mv;}`;
const TRACE_FRAGMENT=`varying vec3 vColor;varying float vLife;
void main(){float r=length(gl_PointCoord-.5);float glow=exp(-r*r*15.0)*(1.0-smoothstep(.3,.5,r));gl_FragColor=vec4(vColor,glow*vLife);}`;

function merged(parts){const geometry=mergeGeometries(parts,false);for(const part of parts)part.dispose();return geometry;}
function cupGeometry(){
 const outline=[[.07,-.22],[.15,-.19],[.21,-.10],[.23,.10],[.21,.16],[.17,.15],[.16,-.08],[.10,-.14]].map(p=>new THREE.Vector2(...p));
 const cup=new THREE.LatheGeometry(outline,24);const stem=new THREE.CylinderGeometry(.024,.032,.16,10);stem.translate(0,-.28,0);return merged([cup,stem]);
}
function harpGeometry(){
 const frame=new THREE.TorusGeometry(.21,.035,6,20,Math.PI*1.65);frame.rotateZ(-Math.PI*.325);frame.scale(.86,1.25,1);
 const foot=new THREE.CylinderGeometry(.025,.025,.30,8);foot.rotateZ(Math.PI/2);foot.translate(0,-.17,0);return merged([frame,foot]);
}
function reedGeometry(){
 const parts=[];for(let i=0;i<3;i++){const pipe=new THREE.CylinderGeometry(.035,.045,.52-i*.09,12,1,true);pipe.translate((i-1)*.09,-i*.02,0);parts.push(pipe);}return merged(parts);
}

/** An authored shore instrument. No DOM, network, persistence or global event listeners. */
export function createTideMoment({onSound=()=>{}}={}){
 const group=new THREE.Group();group.name='moment-tide-soundgarden';
 const geometrySet=new Set(),materialSet=new Set();let disposed=false,score=createTideScore(),active=false,dragging=false,pointerId=null,strokeSeen=new Set(),strokeRecorded=false,history=[],customHint='';
 const ownG=g=>(geometrySet.add(g),g),ownM=m=>(materialSet.add(m),m);
 const standard=(color,options={})=>ownM(new THREE.MeshStandardMaterial({color,roughness:.6,metalness:.25,...options}));
 const bronze=standard('#8a7564',{metalness:.78,roughness:.25}),wood=standard('#233a43',{roughness:.88,metalness:.08});
 const wireMaterial=ownM(new THREE.LineBasicMaterial({color:'#91a7ab',transparent:true,opacity:.38}));
 const echoes=Array.from({length:ECHOES},()=>({origin:new THREE.Vector3(),age:3,voice:0}));let echoCursor=0,replyChoice=null,replyAge=0;
 const waterUniforms={uTime:{value:0},uMotion:{value:1},uEchoes:{value:echoes.map(()=>new THREE.Vector4(0,0,3,0))},uColors:{value:echoes.map(()=>new THREE.Color())}};
 const waterMaterial=ownM(new THREE.ShaderMaterial({uniforms:waterUniforms,vertexShader:WATER_VERTEX,fragmentShader:WATER_FRAGMENT}));waterMaterial.name='tide-water-reflections';
 const mesh=(geometry,material,x=0,y=0,z=0,parent=group)=>{const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);parent.add(object);return object;};
 // The stage is a low, irregular shore, not a board of identical circular sockets.
 const shoreShape=new THREE.Shape();shoreShape.moveTo(-4.05,-1.75);shoreShape.bezierCurveTo(-2.2,-2.9,2.6,-2.45,4.1,-1.7);shoreShape.lineTo(3.8,1.35);shoreShape.bezierCurveTo(1.7,.65,-1.8,1.95,-4.1,.6);shoreShape.closePath();
 const shore=ownG(new THREE.ExtrudeGeometry(shoreShape,{depth:.1,bevelEnabled:false,curveSegments:16}));shore.rotateX(-Math.PI/2);mesh(shore,wood,0,-.2,0);
 const water=ownG(new THREE.ShapeGeometry(shoreShape,16));water.rotateX(-Math.PI/2);mesh(water,waterMaterial,0,-.08,0).name='tide-water';
 const rimPoints=shoreShape.getPoints(64).map(p=>new THREE.Vector3(p.x,-.075,-p.y));
 const rimG=ownG(new THREE.BufferGeometry().setFromPoints(rimPoints)),rimM=ownM(new THREE.LineBasicMaterial({color:'#728b92',transparent:true,opacity:.58}));group.add(new THREE.LineLoop(rimG,rimM));
 // A curved, feathered blue veil keeps the suspended instruments readable in
 // the wider daylight world. It stays inside the stage's existing bounds.
 const veilG=ownG(new THREE.PlaneGeometry(8.16,3.96,32,14));
 const vp=veilG.attributes.position;for(let i=0;i<vp.count;i++){const x=vp.getX(i),y=vp.getY(i)+1.73;vp.setXYZ(i,x,y,-2.29+.028*x*x);}vp.needsUpdate=true;veilG.computeVertexNormals();
 const veilM=ownM(new THREE.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:VEIL_VERTEX,fragmentShader:VEIL_FRAGMENT,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
 const veil=mesh(veilG,veilM);veil.name='tide-blue-veil';veil.renderOrder=-2;
 const beamPoints=[];for(let i=0;i<=32;i++){const x=-3.75+7.5*i/32;beamPoints.push(new THREE.Vector3(x,3.42+.18*Math.cos(x*.65),-.9+.055*x*x));}
 const beam=ownG(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(beamPoints),32,.045,6,false));mesh(beam,bronze);
 const stems=[];for(const side of [-1,1]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*3.78,-.14,.05),new THREE.Vector3(side*3.86,1.15,-.10),new THREE.Vector3(side*3.72,2.35,-.20),new THREE.Vector3(side*3.75,3.28,-.13)]);stems.push(new THREE.TubeGeometry(curve,22,.029,7,false));}mesh(ownG(merged(stems)),bronze);
 const wires=[];for(let voice=0;voice<3;voice++)for(let beat=0;beat<8;beat++){const p=place(voice,beat),top=new THREE.Vector3(p.x+(voice-1)*.07,3.42+.18*Math.cos(p.x*.65),-.9+.055*p.x*p.x);for(let segment=0;segment<5;segment++){for(const f of [segment/5,(segment+1)/5]){wires.push(THREE.MathUtils.lerp(top.x,p.x,f)+Math.sin(f*Math.PI)*.035,THREE.MathUtils.lerp(top.y,p.y+.25,f),THREE.MathUtils.lerp(top.z,p.z,f));}}}
 const wireG=ownG(new THREE.BufferGeometry());wireG.setAttribute('position',new THREE.Float32BufferAttribute(wires,3));group.add(new THREE.LineSegments(wireG,wireMaterial));
 const bodyGs=[ownG(cupGeometry()),ownG(harpGeometry()),ownG(reedGeometry())];
 const haloG=ownG(new THREE.TorusGeometry(.31,.012,4,32));
 const pickG=ownG(new THREE.SphereGeometry(.28,8,6)),pickMaterial=ownM(new THREE.MeshBasicMaterial({visible:false}));
 const voiceColors=TIDE_VOICES.map(v=>new THREE.Color(v.color));
 const notes=[],pickMeshes=[],pulses=Array(24).fill(0),bodyMeshes=[],glowAttributes=[];
 for(let voice=0;voice<3;voice++){
  const glow=new THREE.InstancedBufferAttribute(new Float32Array(8),1);glow.setUsage(THREE.DynamicDrawUsage);bodyGs[voice].setAttribute('aEcho',glow);glowAttributes.push(glow);
  const material=ownM(new THREE.MeshPhysicalMaterial({color:TIDE_VOICES[voice].color,metalness:voice===2?.06:.78,roughness:voice===2?.12:.24,clearcoat:1,clearcoatRoughness:.10,transparent:voice===2,opacity:voice===2?.70:1,depthWrite:voice!==2,emissive:'#183d47',emissiveIntensity:.08}));
  material.name=['tide-brushed-copper','tide-rose-copper','tide-blown-glass'][voice];
  material.onBeforeCompile=shader=>{shader.vertexShader='attribute float aEcho; varying float vEcho;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvEcho = aEcho;');shader.fragmentShader='varying float vEcho;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * vEcho;');};
  material.customProgramCacheKey=()=> 'tide-instanced-echo-v1';
  const bodies=new THREE.InstancedMesh(bodyGs[voice],material,8);bodies.name='tide-instruments-'+TIDE_VOICES[voice].id;bodies.castShadow=true;bodies.frustumCulled=false;bodies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);group.add(bodies);bodyMeshes.push(bodies);
 }
 const halos=new THREE.InstancedMesh(haloG,ownM(new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.58,depthWrite:false})),24);halos.instanceMatrix.setUsage(THREE.DynamicDrawUsage);halos.frustumCulled=false;group.add(halos);
 const stringParts=[];for(let i=0;i<4;i++){const string=new THREE.CylinderGeometry(.004,.004,.32,4);string.translate((i-1.5)*.07,-.005,0);stringParts.push(string);}
 const silver=standard('#c7dcdf',{metalness:.84,roughness:.20}),strings=new THREE.InstancedMesh(ownG(merged(stringParts)),silver,8);strings.frustumCulled=false;group.add(strings);
 const collarG=ownG(new THREE.TorusGeometry(.039,.007,5,12)),collars=new THREE.InstancedMesh(collarG,bronze,24);collars.frustumCulled=false;group.add(collars);
 const cupRims=new THREE.InstancedMesh(ownG(new THREE.TorusGeometry(.216,.009,6,24)),silver,8);cupRims.frustumCulled=false;group.add(cupRims);
 for(let voice=0;voice<3;voice++)for(let beat=0;beat<8;beat++){
  const p=place(voice,beat),body=new THREE.Object3D();body.position.copy(p);
  const pickBody=mesh(pickG,pickMaterial,...p.toArray());pickBody.userData={voice,beat};pickBody.name='tide-pick-'+voice+'-'+beat;
  notes.push({voice,beat,body,origin:p});pickMeshes.push(pickBody);halos.setColorAt(voice*8+beat,voiceColors[voice]);
 }
 // Every chosen note contributes a petal to the living phrase above the water.
 const petalG=ownG(new THREE.SphereGeometry(1,8,5));petalG.scale(.08,.18,.025);
 const petalM=standard('#eac9d2',{roughness:.55,metalness:.08});
 const blooms=new THREE.InstancedMesh(petalG,petalM,64);blooms.frustumCulled=false;blooms.instanceMatrix.setUsage(THREE.DynamicDrawUsage);group.add(blooms);
 const constellationG=ownG(new THREE.BufferGeometry());constellationG.setAttribute('position',new THREE.BufferAttribute(new Float32Array(24*6),3));constellationG.setDrawRange(0,0);
 const constellationM=ownM(new THREE.LineBasicMaterial({color:'#b9e8de',transparent:true,opacity:.6}));const constellation=new THREE.LineSegments(constellationG,constellationM);constellation.frustumCulled=false;group.add(constellation);
 const cursor=mesh(ownG(new THREE.IcosahedronGeometry(.065,1)),ownM(new THREE.MeshBasicMaterial({color:'#fff3c5'})));cursor.visible=false;
 const fireflyG=ownG(new THREE.BufferGeometry()),fireflyPositions=new Float32Array(96*3);fireflyG.setAttribute('position',new THREE.BufferAttribute(fireflyPositions,3));
 const fireflyM=ownM(new THREE.PointsMaterial({color:'#d4e9db',size:.026,transparent:true,opacity:.52,depthWrite:false}));const fireflies=new THREE.Points(fireflyG,fireflyM);group.add(fireflies);
 const traceG=ownG(new THREE.BufferGeometry()),tracePositions=new Float32Array(ECHOES*TRAIL_POINTS*3),traceColors=new Float32Array(ECHOES*TRAIL_POINTS*3),traceLife=new Float32Array(ECHOES*TRAIL_POINTS);
 traceG.setAttribute('position',new THREE.BufferAttribute(tracePositions,3));traceG.setAttribute('color',new THREE.BufferAttribute(traceColors,3));traceG.setAttribute('aLife',new THREE.BufferAttribute(traceLife,1));
 const traceM=ownM(new THREE.ShaderMaterial({vertexShader:TRACE_VERTEX,fragmentShader:TRACE_FRAGMENT,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));const traces=new THREE.Points(traceG,traceM);traces.name='tide-sounding-trails';traces.frustumCulled=false;group.add(traces);
 const replyG=ownG(new THREE.BufferGeometry()),replyPositions=new Float32Array(96*3),replyColors=new Float32Array(96*3);replyG.setAttribute('position',new THREE.BufferAttribute(replyPositions,3));replyG.setAttribute('color',new THREE.BufferAttribute(replyColors,3));
 const replyM=ownM(new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending})),replyLine=new THREE.Line(replyG,replyM);replyLine.name='tide-reply-current';replyLine.frustumCulled=false;replyLine.visible=false;group.add(replyLine);
 const dummy=new THREE.Object3D(),local=new THREE.Object3D(),matrix=new THREE.Matrix4(),worldPoint=new THREE.Vector3(),tint=new THREE.Color();
 function remember(){history.push(tideDraft(score));if(history.length>40)history.shift();}
 function sound(voice,beat,preview=false){const v=TIDE_VOICES[voice];pulses[voice*8+beat]=1;const echo=echoes[echoCursor];echo.origin.copy(notes[voice*8+beat].origin);echo.age=0;echo.voice=voice;echoCursor=(echoCursor+1)%ECHOES;onSound('compose-note',{instrument:v.instrument,midi:v.base+tones[beat],duration:voice===2?.58:1.05,gain:preview?.12:.16,pan:(beat-3.5)*.17,voice,beat,preview});}
 function toggle(voice,beat,{record=true,desired}={}){if(!validCell(voice,beat))return false;if(desired!==undefined&&score.notes[voice][beat]===desired)return false;if(record)remember();editTideNote(score,voice,beat,desired);customHint='';if(score.notes[voice][beat])sound(voice,beat,true);return true;}
 function pick(raycaster){group.updateWorldMatrix(true,true);const hit=raycaster?.intersectObjects(pickMeshes,false)?.[0];return hit?.object.userData||null;}
 function cancel(){dragging=false;pointerId=null;strokeSeen.clear();strokeRecorded=false;}
 function action(id,value){
  if(disposed)return false;
  const voice=TIDE_VOICES.findIndex(v=>'voice-'+v.id===id);
  if(voice>=0){score.selectedVoice=voice;sound(voice,score.selectedBeat,true);return true;}
  if(id==='toggle')return toggle(value?.voice??score.selectedVoice,value?.beat??score.selectedBeat);
  if(id==='play'){cancel();if(score.playing){stopTidePlayback(score);return true;}if(!startTidePlayback(score)){customHint='先碰一个乐器，给这封信落下第一个声音。';return false;}customHint='';return true;}
  if(id==='stop'){stopTidePlayback(score);cancel();return true;}
  if(id==='undo'){cancel();if(!history.length)return false;score=restoreTideScore(history.pop());customHint='刚才的一笔已经收回。';return true;}
  if(id==='clear'||id==='reset'){cancel();if(!tideScoreCounts(score).notes)return false;remember();const voice=score.selectedVoice;score=createTideScore();score.selectedVoice=voice;customHint='水面又空出来了。你可以重新留一段声音。';return true;}
  if(id==='hint'){customHint='杯、弦、风至少选两种，在八拍中留下三个以上声音，再把自己的曲子完整听一遍。没有标准答案，空拍也可以留下。';return true;}
  return false;
 }
 function pointer(type,raycaster,event={}){
  if(disposed)return false;
  if(type==='cancel'){const held=dragging;cancel();return held;}
  const id=event.pointerId??0;
  if(type==='down'){if(dragging||event.button!==undefined&&event.button!==0)return false;const cell=pick(raycaster);if(!cell)return false;dragging=true;pointerId=id;}
  if(!dragging||id!==pointerId)return false;
  if(type==='up'){cancel();return true;}
  if(type==='move'&&event.buttons===0){cancel();return false;}
  const cell=pick(raycaster);if(!cell)return true;const key=cell.voice+':'+cell.beat;
  if(!strokeSeen.has(key)){if(!strokeRecorded){remember();strokeRecorded=true;}strokeSeen.add(key);toggle(cell.voice,cell.beat,{record:false});}return true;
 }
 function key(event){
  if(disposed||event.type==='keyup'||event.target?.matches?.('input,select,textarea,button,summary'))return false;
  const code=event.code;if(/^Digit[123]$/.test(code)){if(!event.repeat)action('voice-'+TIDE_VOICES[Number(code.slice(-1))-1].id);return true;}
  if(code==='ArrowLeft'||code==='ArrowRight'){score.selectedBeat=(score.selectedBeat+(code==='ArrowLeft'?7:1))%8;return true;}
  if(code==='ArrowUp'||code==='ArrowDown'){score.selectedVoice=(score.selectedVoice+(code==='ArrowUp'?1:2))%3;return true;}
  if(code==='Enter'){if(!event.repeat)action('toggle');return true;}
  if(code==='Space'){if(!event.repeat)action('play');return true;}
  if(code==='KeyZ'){if(!event.repeat)action('undo');return true;}
  if(code==='Delete'||code==='Backspace'){if(!event.repeat)toggle(score.selectedVoice,score.selectedBeat,{desired:false});return true;}return false;
 }
 function update(time,dt,options={}){
  if(disposed)return;const wasActive=active;active=!!options.active;if(wasActive&&!active)cancel();
  const visualDelta=clamp(finite(dt),0,.1),delta=active?visualDelta:0,clock=finite(time),reduced=!!options.reducedMotion;
  if(active)for(const event of stepTidePlayback(score,delta)){if(event.type==='note')sound(event.voice,event.beat);if(event.type==='complete')customHint=tideScoreReady(score)?'这一段回应已经听完。你可以继续改，也可以把它收进春信。':'这一段已经听完。再添另一种声音，并留下至少三个落点，重新听一遍。';}
  let activeNodes=[],petalIndex=0;
  for(const n of notes){const index=n.voice*8+n.beat,on=score.notes[n.voice][n.beat],selected=score.selectedVoice===n.voice&&score.selectedBeat===n.beat;pulses[index]=Math.max(0,pulses[index]-visualDelta*2.5);
   const pulse=pulses[index];n.body.position.copy(n.origin);n.body.rotation.set(0,Math.sin(n.beat*1.7+n.voice)*.10,reduced?0:Math.sin(clock*1.8+n.beat)*(.010+pulse*.09));n.body.scale.setScalar(1+(reduced?0:pulse*.09));n.body.updateMatrix();
   bodyMeshes[n.voice].setMatrixAt(n.beat,n.body.matrix);glowAttributes[n.voice].setX(n.beat,(on?.19:.025)+pulse*.70);
   dummy.position.copy(n.origin);dummy.rotation.set(0,0,0);dummy.scale.setScalar(selected&&active?1.06:on?.91:.001);dummy.updateMatrix();halos.setMatrixAt(index,dummy.matrix);
   if(n.voice===0){local.position.set(0,.153,0);local.rotation.set(Math.PI/2,0,0);local.scale.setScalar(1);local.updateMatrix();matrix.multiplyMatrices(n.body.matrix,local.matrix);cupRims.setMatrixAt(n.beat,matrix);}
   if(n.voice===1)strings.setMatrixAt(n.beat,n.body.matrix);
   if(n.voice===2)for(let pipe=0;pipe<3;pipe++){local.position.set((pipe-1)*.09,.26-pipe*.065,0);local.rotation.set(Math.PI/2,0,0);local.scale.setScalar(1);local.updateMatrix();matrix.multiplyMatrices(n.body.matrix,local.matrix);collars.setMatrixAt(n.beat*3+pipe,matrix);}
   if(on)activeNodes.push(n.origin);for(let petal=0;petal<2;petal++){const a=(n.voice*2+petal)*Math.PI/3;dummy.position.set(n.origin.x+Math.cos(a)*.20,.07+(reduced?0:Math.sin(clock*.7+n.beat)*.012),n.origin.z+.45+Math.sin(a)*.20);dummy.rotation.set(-Math.PI/2,0,-a+Math.PI/2);dummy.scale.setScalar(on?.9+(reduced?0:pulse*.3):.001);dummy.updateMatrix();blooms.setMatrixAt(petalIndex,dummy.matrix);blooms.setColorAt(petalIndex,voiceColors[n.voice]);petalIndex++;}
  }
  for(const bodies of bodyMeshes)bodies.instanceMatrix.needsUpdate=true;for(const glow of glowAttributes)glow.needsUpdate=true;for(const object of [halos,strings,collars,cupRims])object.instanceMatrix.needsUpdate=true;
  blooms.count=petalIndex;blooms.instanceMatrix.needsUpdate=true;if(blooms.instanceColor)blooms.instanceColor.needsUpdate=true;
  activeNodes.sort((a,b)=>a.x-b.x||a.y-b.y);const values=constellationG.attributes.position.array;let offset=0;for(let i=1;i<activeNodes.length;i++){activeNodes[i-1].toArray(values,offset);offset+=3;activeNodes[i].toArray(values,offset);offset+=3;}constellationG.setDrawRange(0,offset/3);constellationG.attributes.position.needsUpdate=true;
  cursor.visible=active&&score.playing;if(cursor.visible){const beat=clamp(score.elapsed/TIDE_STEP_SECONDS,0,7),x=(beat-3.5)*.91;cursor.position.set(x,3.42+.18*Math.cos(x*.65),-.9+.055*x*x);}
  for(let i=0;i<96;i++){const a=i*2.399963,drift=reduced?0:clock*.07;fireflyPositions[i*3]=Math.sin(a+drift)*(1.3+(i%13)*.20);fireflyPositions[i*3+1]=.1+(i%17)*.19;fireflyPositions[i*3+2]=Math.cos(a+drift)*1.7-.4;}fireflyG.attributes.position.needsUpdate=true;
  waterUniforms.uTime.value=reduced?0:clock;waterUniforms.uMotion.value=reduced?0:1;veilM.uniforms.uTime.value=reduced?0:clock;
  for(let i=0;i<ECHOES;i++){
   const echo=echoes[i];echo.age=Math.min(3,echo.age+visualDelta);const color=voiceColors[echo.voice];
   waterUniforms.uEchoes.value[i].set(echo.origin.x,echo.origin.z+.30,Math.max(0,echo.age-.35),echo.age<2.8?1:0);waterUniforms.uColors.value[i].copy(color);
   for(let j=0;j<TRAIL_POINTS;j++){
    const index=i*TRAIL_POINTS+j,head=reduced?1:Math.min(1,echo.age/.62),along=clamp(head-j*.045,0,1),ease=along*along*(3-2*along);
    tracePositions[index*3]=echo.origin.x+Math.sin(along*Math.PI)*.08;tracePositions[index*3+1]=THREE.MathUtils.lerp(echo.origin.y,.03,ease);tracePositions[index*3+2]=echo.origin.z+along*.30;
    color.toArray(traceColors,index*3);traceLife[index]=echo.age<1.2&&!reduced?Math.max(0,1-echo.age/1.2)*(1-j/TRAIL_POINTS)*.8:0;
   }
  }
  traceG.attributes.position.needsUpdate=true;traceG.attributes.color.needsUpdate=true;traceG.attributes.aLife.needsUpdate=true;
  const choice=options.completed&&['old','new'].includes(options.choice)?options.choice:null;
  if(choice!==replyChoice){replyChoice=choice;replyAge=0;}if(replyChoice)replyAge+=visualDelta;
  replyLine.visible=!!replyChoice;
  if(replyChoice){
   const reach=reduced?1:Math.min(1,replyAge/4),flow=reduced?0:replyAge;
   for(let i=0;i<96;i++){
    const u=i/95,angle=u*Math.PI*2;
    if(replyChoice==='old'){replyPositions[i*3]=Math.cos(angle)*2.72;replyPositions[i*3+1]=.055+Math.sin(angle*3+flow*.3)*.025;replyPositions[i*3+2]=.28+Math.sin(angle)*1.10;}
    else{const v=u*reach;replyPositions[i*3]=Math.sin(v*Math.PI*2)*.28+v*.56;replyPositions[i*3+1]=.035+Math.sin(v*Math.PI)*.12+v*v*.45;replyPositions[i*3+2]=1.45-v*3.55;}
    const voice=Math.floor(u*7.99)%3,hasVoice=score.notes[voice].some(Boolean),gleam=.35+.65*Math.pow(.5+.5*Math.sin(u*15-flow*1.4),3);
    tint.copy(voiceColors[voice]).multiplyScalar((hasVoice?1:.35)*gleam);tint.toArray(replyColors,i*3);
   }
   replyM.opacity=replyChoice==='old'?.60*Math.min(1,replyAge/.7):.68*Math.max(.22,1-Math.max(0,replyAge-5)/4);
   replyG.attributes.position.needsUpdate=true;replyG.attributes.color.needsUpdate=true;
  }
 }
 function snapshot(){
  const n=tideScoreCounts(score),ready=tideScoreReady(score);group.updateWorldMatrix(true,true);
  let hint=customHint||(n.notes===0?'碰一下悬挂的杯、弦或风笛，把声音放进这一拍；也可以按住拖过多个乐器。':n.voices<2?'这封信已有一种声音。试试另一种形状的乐器，让它来回应。':n.notes<3?'再留一个声音的位置。八拍不必填满，空白也属于你的曲子。':ready?'你的回应已完整响过。可以再改一笔，或将这一版收进春信。':'按「听一遍」回放你留下的声音。每一拍会在花铃和水纹中回应。');
  if(score.playing)hint='正在听第 '+Math.min(8,Math.floor(score.elapsed/TIDE_STEP_SECONDS)+1)+' / 8 拍。声音之间的空白，也会一起留下。';
  return {kind:'tide',ready,progress:ready?1:Math.min(.95,Math.min(1,n.notes/3)*.25+Math.min(1,n.voices/2)*.25+(score.playing?score.elapsed/(8*TIDE_STEP_SECONDS)*.45:0)),hint,status:score.playing?'春声正在水面展开':ready?'这一封，已经有你的声音':n.notes===0?'水面还留着八拍空白':n.voices<2?'一段独白，等另一种声音来回应':n.notes<3?'再为这段回应，留一个落脚':'听一遍，让声音之间的空白也留下来',selected:TIDE_VOICES[score.selectedVoice].id+':'+score.selectedBeat,playing:score.playing,playhead:score.playhead,noteCount:n.notes,voiceCount:n.voices,canUndo:history.length>0,
   controls:[...TIDE_VOICES.map((v,i)=>({id:'voice-'+v.id,label:v.label+' '+(i+1),pressed:score.selectedVoice===i})),{id:'play',label:score.playing?'停一停':'听一遍',disabled:!n.notes},{id:'undo',label:'收回一笔',disabled:!history.length},{id:'clear',label:'重新留白',disabled:!n.notes}],draft:tideDraft(score),
   targets:notes.map(n=>{worldPoint.copy(n.origin);group.localToWorld(worldPoint);return {voice:n.voice,beat:n.beat,id:TIDE_VOICES[n.voice].id+':'+n.beat,shape:TIDE_VOICES[n.voice].shape,local:n.origin.toArray(),position:worldPoint.toArray(),active:score.notes[n.voice][n.beat]};}),
   presentation:{reply:replyChoice,echoes:echoes.filter(e=>e.age<2.8).length,trailCapacity:ECHOES*TRAIL_POINTS},history:history.length,disposed};
 }
 function restore(data){cancel();history=[];customHint='';score=restoreTideScore(data?.draft||data);pulses.fill(0);for(const echo of echoes)echo.age=3;replyChoice=null;replyAge=0;update(0,0,{active:false,reducedMotion:true});}
 function dispose(){if(disposed)return;disposed=true;cancel();stopTidePlayback(score);group.traverse(object=>{if(object.isInstancedMesh)object.dispose();});for(const geometry of geometrySet)geometry.dispose();for(const material of materialSet)material.dispose();group.clear();}
 update(0,0,{active:false,reducedMotion:true});
 return {group,bounds:{min:[-4.15,-.35,-2.65],max:[4.15,3.85,2.9]},cameraOffset:{x:.2,y:3.5,z:8.5},update,pointer,key,action,snapshot,restore,dispose};
}
