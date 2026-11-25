import { SAMPLE_BANK, FOLEY_BANK, scoreBar, scoreScene, tideReplyScore } from './audio-score.js';
import {assetUrl} from './asset-url.js';
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,finite(v,a)));
const MAX_VOICES=48;
const VOYAGE_EVENT_INTERVAL=Object.freeze({'voyage-seal':.75,'paper-open':.65,'rope-release':.28,'sail-hoist':.8,'wave-step':.24,'sea-bloom':.30,departure:2,jump:.45});

// Sampled chamber score, environmental sound and contextual feedback. Only
// AudioContext time schedules notes; paused scenes cannot queue stale events.
export function createAudio() {
 let context=null,master=null,convolver=null,musicBus=null,sfxBus=null,ambientBus=null,windGain=null,windFilter=null,waterGain=null,birdGain=null,seaGain=null,seaFilter=null;
 let muted=false,paused=false,disposed=false,loadPromise=null,loaded=false;
 let scene={zone:'garden',night:0,opening:false,branch:false,ended:false,moving:false,speed:0,dashing:false,challengeActive:false,combo:0,flowerPhase:'solid',gestureActive:false};
 let mix={music:.82,sfx:.88,ambience:.7},mixKey='',barIndex=0,nextBar=0,pending=[],lastNote=-99;
 let stepDistance=.4,lastFootstepAt=-Infinity,eventCount=0,scheduledNotes=0,missedSchedules=0,lastZone='garden',lastVoyage=null,lastAtlas=null,rng=130279,duckUntil=0,hasOutput=false,foleyEvents=0,lastFoley=null,fallbackNotes=0;
 const voyageEventTimes=new Map();
 const lastStep={grass:-1,stone:-1};
 const samples=new Map(),fallbackSamples=new Map(),voices=new Set(),persistentNodes=new Set(),persistentSources=new Set(),loadErrors=[];
 const now=()=>context?.currentTime||0;
 const random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
 const playable=()=>!!context&&!disposed&&!paused&&!muted&&context.state==='running';
 const keep=(node,source=false)=>{persistentNodes.add(node);if(source)persistentSources.add(node);return node;};
 function hold(param){const t=now();if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(t);else{const v=param.value;param.cancelScheduledValues(t);param.setValueAtTime(v,t);}}
 function fade(param,value,seconds=.15){if(!param)return;hold(param);param.setTargetAtTime(value,now(),Math.max(.01,seconds));}
 function cleanup(voice){if(voice.cleaned)return;voice.cleaned=true;voice.nodes.forEach(n=>{try{n.disconnect();}catch{}});voices.delete(voice);}
 function stopVoice(voice){if(voice.cleaned)return;voice.sources.forEach(s=>{try{s.stop();}catch{}});cleanup(voice);}
 function clearVoices(){for(const voice of [...voices])stopVoice(voice);pending=[];nextBar=0;}
 function voiceOutput(source,envelope,pan,bus,wet=.12){
  while(voices.size>=MAX_VOICES)stopVoice(voices.values().next().value);
  const nodes=[source,envelope],voice={sources:[source],nodes,bus,envelope,cleaned:false};source.connect(envelope);
  let output=envelope;
  if(context.createStereoPanner){const p=context.createStereoPanner();p.pan.value=clamp(pan,-1,1);envelope.connect(p);nodes.push(p);output=p;}
  output.connect(bus);
  source.onended=()=>cleanup(voice);voices.add(voice);return voice;
 }
 function sample(instrument,midi,duration,gain,pan=0,when=now(),bus=musicBus){
  if(!playable()||gain<=0||(bus===musicBus&&mix.music<=0)||(bus===sfxBus&&mix.sfx<=0))return false;
  const definition=SAMPLE_BANK[instrument],buffer=samples.get(instrument);if(!definition||!buffer)return false;
  return playSampleBuffer(instrument,buffer,midi,duration,gain,pan,when,bus);
 }
 function playSampleBuffer(instrument,buffer,midi,duration,gain,pan,when,bus){
  const definition=SAMPLE_BANK[instrument];
  const source=context.createBufferSource();source.buffer=buffer;
  const rate=2**((clamp(midi,32,96)-definition.root)/12);source.playbackRate.value=rate;
  const start=Math.max(now()+.003,when),length=Math.min(Math.max(.1,duration),buffer.duration/rate-.01);
  if(length<=.02)return false;
  const amp=context.createGain(),sustained=instrument==='cello'||instrument==='flute',attack=sustained?.08:.005,release=Math.min(sustained?.3:.22,length*.35);
  amp.gain.setValueAtTime(0,start);amp.gain.linearRampToValueAtTime(clamp(gain,0,1),start+Math.min(attack,length*.2));
  amp.gain.setValueAtTime(clamp(gain,0,1),start+Math.max(attack,length-release));amp.gain.linearRampToValueAtTime(0,start+length);
  voiceOutput(source,amp,pan,bus,bus===ambientBus?0:.16);source.start(start);source.stop(start+length+.01);
  scheduledNotes++;hasOutput=true;return true;
 }
 // A missed or still-loading asset must not turn the player's composition into
 // silent progress. These cached, finite notes are used only until real samples
 // arrive; each voice keeps its own decay and breath, with no oscillator loop.
 function fallbackBuffer(instrument){
  if(fallbackSamples.has(instrument))return fallbackSamples.get(instrument);
  const rate=context.sampleRate,length=Math.ceil(rate*1.5),buffer=context.createBuffer(1,length,rate),data=buffer.getChannelData(0);
  const frequency=440*2**((SAMPLE_BANK[instrument].root-69)/12);let air=0;
  for(let i=0;i<length;i++){
   const t=i/rate,phase=2*Math.PI*frequency*t;
   air=air*.88+(random()*2-1)*.12;
   const voice=instrument==='flute'
    ?(.83*Math.sin(phase+.012*Math.sin(t*27))+.10*Math.sin(phase*2)+air*.035)*Math.exp(-t*.65)
    :instrument==='harp'
     ?Math.sin(phase)*Math.exp(-t*3.6)+.24*Math.sin(phase*2)*Math.exp(-t*6.8)+.08*Math.sin(phase*3)*Math.exp(-t*10)
     :Math.sin(phase)*Math.exp(-t*2.8)+.28*Math.sin(phase*2.002)*Math.exp(-t*5.4)+.10*Math.sin(phase*3.007)*Math.exp(-t*8.4)+air*.015*Math.exp(-t*30);
   const edge=Math.min(1,t/.012,(1.5-t)/.08);
   data[i]=voice*.62*Math.max(0,edge);
  }
  fallbackSamples.set(instrument,buffer);return buffer;
 }
 function compositionNote(instrument,midi,duration,gain,pan,when=now()){
  if(!playable()||mix.sfx<=0||gain<=0)return false;
  if(sample(instrument,midi,duration,gain,pan,when,sfxBus))return true;
  const played=playSampleBuffer(instrument,fallbackBuffer(instrument),midi,Math.min(duration,1.2),gain,pan,when,sfxBus);
  if(played)fallbackNotes++;return played;
 }
 function foley(key,gain=.3,pan=0,rate=1){
  const buffer=samples.get(key);if(!playable()||mix.sfx<=0||!buffer)return false;
  const source=context.createBufferSource(),amp=context.createGain(),t=now()+.003,length=buffer.duration/rate;
  source.buffer=buffer;source.playbackRate.value=rate;
  amp.gain.setValueAtTime(0,t);amp.gain.linearRampToValueAtTime(gain,t+.001);
  amp.gain.setValueAtTime(gain,t+Math.max(.005,length-.025));amp.gain.linearRampToValueAtTime(0,t+length);
  voiceOutput(source,amp,pan,sfxBus);source.start(t);source.stop(t+length+.005);
  foleyEvents++;lastFoley=key;hasOutput=true;return true;
 }
 function footsteps(){
  if(mix.sfx<=0)return;
  const material=scene.groundMaterial==='grass'?'grass':scene.groundMaterial==='stone'||scene.groundMaterial==='water'?'stone':scene.zone==='garden'?'grass':'stone';
  // Choose a different recording each step; slight rate variation avoids a grid.
  const previous=lastStep[material],index=previous<0?Math.floor(random()*3):(previous+1+Math.floor(random()*2))%3;
  lastStep[material]=index;const pan=(eventCount++%2?1:-1)*.12;
  if(!foley(material+index,scene.dashing?.38:.29,pan,.96+random()*.08))soundNoise(.11,.07,material==='grass'?950:1700,pan);
 }
 function noiseBuffer(seconds,colour=.94){
  const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*seconds),context.sampleRate),data=buffer.getChannelData(0);let previous=0;
  for(let i=0;i<data.length;i++){const white=random()*2-1;previous=previous*colour+white*(1-colour);data[i]=previous*2.5;}
  const edge=Math.min(256,data.length/4);for(let i=0;i<edge;i++){data[i]*=i/edge;data[data.length-1-i]*=i/edge;}return buffer;
 }
 function soundNoise(duration=.3,gain=.2,frequency=1200,pan=0,when=now(),kind='lowpass'){
  if(!playable()||mix.sfx<=0)return;
  const source=context.createBufferSource();source.buffer=samples.get('noise');source.playbackRate.value=.85+random()*.3;
  const filter=context.createBiquadFilter();filter.type=kind;filter.frequency.value=frequency;filter.Q.value=.7;
  const amp=context.createGain(),t=Math.max(now()+.003,when);amp.gain.setValueAtTime(0,t);amp.gain.linearRampToValueAtTime(gain,t+.008);amp.gain.exponentialRampToValueAtTime(.0001,t+duration);
  const voice=voiceOutput(source,amp,pan,sfxBus,.07);source.disconnect();source.connect(filter);filter.connect(amp);voice.nodes.push(filter);source.start(t,random());source.stop(t+duration+.03);
 }
 function recordedAmbience(){
  if(disposed)return;
  for(const key of ['birds','river']){
   const buffer=samples.get(key);if(!buffer)continue;
   const source=keep(context.createBufferSource(),true),amp=keep(context.createGain());
   source.buffer=buffer;source.loop=true;amp.gain.value=0;
   source.connect(amp);amp.connect(ambientBus);source.start();
   if(key==='birds')birdGain=amp;else{
    waterGain=amp;
    // Rework the existing CC0 river recording into a low, swelling water bed.
    // This is sound design, not a newly recorded ocean asset. Both sends share
    // one source, and the original dry river route is unchanged inland.
    seaFilter=keep(context.createBiquadFilter());seaFilter.type='lowpass';seaFilter.frequency.value=420;seaFilter.Q.value=.3;
    seaGain=keep(context.createGain());seaGain.gain.value=0;
    source.connect(seaFilter);seaFilter.connect(seaGain);seaGain.connect(ambientBus);
   }
  }
  mixKey='';
 }
 function buildGraph(){
  const compressor=keep(context.createDynamicsCompressor());compressor.threshold.value=-14;compressor.knee.value=15;compressor.ratio.value=3;compressor.attack.value=.008;compressor.release.value=.22;
  master=keep(context.createGain());master.gain.value=0;master.connect(compressor);compressor.connect(context.destination);
  musicBus=keep(context.createGain());musicBus.gain.value=0;musicBus.connect(master);
  sfxBus=keep(context.createGain());sfxBus.gain.value=mix.sfx;sfxBus.connect(master);
  ambientBus=keep(context.createGain());ambientBus.gain.value=mix.ambience;ambientBus.connect(master);
  convolver=keep(context.createConvolver());const impulse=context.createBuffer(2,Math.round(context.sampleRate*1.65),context.sampleRate);
  for(let c=0;c<2;c++){const data=impulse.getChannelData(c);for(let i=0;i<data.length;i++)data[i]=(random()*2-1)*Math.exp(-i/(context.sampleRate*.32))*.25;}
  convolver.buffer=impulse;const wet=keep(context.createGain());wet.gain.value=.5;convolver.connect(wet);wet.connect(master);
  // Sends are POST channel faders: turning music or effects down also turns
  // down its reverberation, instead of leaking an audible wet-only signal.
  for(const [bus,amount]of[[musicBus,.16],[sfxBus,.12]]){const send=keep(context.createGain());send.gain.value=amount;bus.connect(send);send.connect(convolver);}
  samples.set('noise',noiseBuffer(3,.55));
  const wind=keep(context.createBufferSource(),true),filter=keep(context.createBiquadFilter());windFilter=filter;windGain=keep(context.createGain());
  wind.buffer=noiseBuffer(5,.98);wind.loop=true;
  filter.type='lowpass';filter.frequency.value=650;filter.Q.value=.35;windGain.gain.value=.055;
  wind.connect(filter);filter.connect(windGain);windGain.connect(ambientBus);wind.start();
 }
 async function load(){
  if(loadPromise)return loadPromise;
  loadPromise=Promise.all([...Object.entries(SAMPLE_BANK).map(([key,definition])=>[key,{...definition,folder:'audio'}]),...Object.entries(FOLEY_BANK).map(([key,definition])=>[key,{...definition,folder:'foley-v8'}])].map(async([key,definition])=>{
   try{const response=await fetch(assetUrl('assets/'+definition.folder+'/'+definition.file));if(!response.ok)throw Error('HTTP '+response.status);const bytes=await response.arrayBuffer();if(disposed)return;const buffer=await context.decodeAudioData(bytes);if(!disposed)samples.set(key,buffer);}
   catch(error){loadErrors.push(key+': '+String(error.message||error));}
  })).then(()=>{if(disposed)return {loaded:0,errors:loadErrors.slice()};loaded=true;recordedAmbience();nextBar=0;return {loaded:samples.size-1,errors:loadErrors.slice()};});return loadPromise;
 }
 function resume(){
  if(!context||disposed||paused)return;
  const current=context;Promise.resolve(current.resume()).then(()=>{if(disposed||current!==context)return;if(paused){current.suspend().catch(()=>{});return;}fade(master.gain,muted?0:.8,.12);}).catch(()=>{});
 }
 function unlock(){
  if(disposed)return false;
  if(!context){const Audio=globalThis.window?.AudioContext||globalThis.window?.webkitAudioContext;if(!Audio)return false;try{context=new Audio();buildGraph();load();}catch(error){loadErrors.push(String(error));return false;}}
  if(!paused)resume();return true;
 }
 function note(frequency=440,duration=1.4,strength=.3,options={}){
  if(!playable()||now()-lastNote<.035)return false;
  const midi=69+12*Math.log2(clamp(frequency,60,2400)/440),kind=options?.kind;
  const played=sample(kind==='cup'?'piano':'harp',midi,clamp(duration,.1,6),clamp(strength,0,.7)*1.35,options?.pan||0,now(),sfxBus);
  if(played){lastNote=now();duckUntil=now()+.45;}return played;
 }
 function motif(notes,spacing=.12,gain=.4,instrument='harp'){
  notes.forEach((midi,i)=>sample(instrument,midi,2.4,gain,Math.sin(i)*.35,now()+i*spacing,sfxBus));duckUntil=now()+.65;
 }
 function chime(){event('complete');}
 function event(type,payload={}){
  if(!playable())return false;
  if(Object.hasOwn(VOYAGE_EVENT_INTERVAL,type)){
   if(mix.sfx<=0||now()-(voyageEventTimes.get(type)??-Infinity)<VOYAGE_EVENT_INTERVAL[type])return false;
   voyageEventTimes.set(type,now());
  }
  eventCount++;const combo=Math.max(0,Math.floor(finite(payload.combo,scene.combo)));
  const atlas=scoreScene(scene).atlas;
  if(atlas&&(type==='collect'||type==='complete')){
   if(mix.sfx<=0)return false;
   const pitches=atlas==='conservatory'?[60,67,72]:atlas==='observatory'?[59,66,78]:[62,69,76];
   const instrument=atlas==='observatory'?'piano':'harp';
   motif(type==='complete'?pitches:pitches.slice(1),type==='complete'?.25:.16,type==='complete'?.13:.10,instrument);
   return true;
  }
  switch(type){
   case 'jump':
    soundNoise(.16,.045,850);sample('harp',67,.34,.085,0,now(),sfxBus);break;
   case 'voyage-seal':
    soundNoise(.16,.09,510,0);foley('stoneTurn',.10,0,.72);compositionNote('piano',62,.8,.095,-.12,now()+.04);compositionNote('harp',74,1.2,.09,.2,now()+.19);duckUntil=now()+.65;break;
   case 'paper-open':
    soundNoise(.48,.075,2100,-.15,now(),'bandpass');soundNoise(.22,.045,2900,.15,now()+.18,'bandpass');break;
   case 'rope-release':
    soundNoise(.30,.09,840,clamp(payload.pan,-1,1),now(),'bandpass');foley('grass1',.11,clamp(payload.pan,-1,1),.72);compositionNote('harp',69,.55,.06,clamp(payload.pan,-1,1),now()+.12);break;
   case 'sail-hoist':
    soundNoise(.75,.10,1550,0,now(),'bandpass');compositionNote('harp',62,.8,.07,-.2);compositionNote('harp',69,.9,.08,0,now()+.22);compositionNote('flute',74,.8,.065,.2,now()+.45);break;
   case 'wave-step':{
    const pan=clamp(payload.pan,-1,1);foley('stone'+(eventCount%3),.18,pan,.88);soundNoise(.28,.075,950,pan);break;
   }
   case 'sea-bloom':{
    const phrases=[[74,81],[78,86],[76,83],[71,78]],pair=phrases[Math.floor(clamp(payload.index,0,9999))%phrases.length];
    soundNoise(.48,.045,1250,clamp(payload.pan,-1,1));compositionNote('harp',pair[0],1,.095,clamp(payload.pan,-1,1));compositionNote('harp',pair[1],1.2,.07,clamp(payload.pan,-1,1),now()+.18);break;
   }
   case 'departure':
    soundNoise(.8,.075,1100,0);[62,69,74,78].forEach((midi,i)=>compositionNote(i===3?'flute':'piano',midi,1.4,.09,-.25+i*.16,now()+i*.34));duckUntil=now()+1.4;break;
   case 'start':motif([62,69,74],.16,.34);soundNoise(.5,.13,1700);break;
   case 'collect':motif([[74,78,81,83,86][combo%5],[78,81,83,86,90][combo%5]],.065,.34);break;
   case 'complete':motif([62,66,69,74,78,81],.12,.40);sample('triangle',72,1.4,.22,.3,now()+.5,sfxBus);break;
   case 'timeout':motif([74,71,69,62],.18,.25,'piano');break;
   case 'bump':soundNoise(.19,.28,420);sample('pizz',45,.28,.34,0,now(),sfxBus);break;
   case 'dash':soundNoise(.42,.24,2700,0,now(),'bandpass');sample('harp',81,.8,.23,.2,now(),sfxBus);break;
   case 'burst':soundNoise(.95,.28,2600);motif([62,69,74,81,86],.045,.25);break;
   case 'plant':soundNoise(.35,.16,850);motif([62,66,74],.2,.32);break;
   case 'bridge':soundNoise(.7,.2,1500);motif([50,62,69,74],.12,.34);break;
   case 'compose-note':{
    const instrument=['piano','harp','flute'].includes(payload.instrument)?payload.instrument:'piano';
    const played=compositionNote(instrument,clamp(finite(payload.midi,69),36,96),clamp(finite(payload.duration,1),.12,4),clamp(finite(payload.gain,.12),0,.3),clamp(finite(payload.pan,0),-1,1));
    if(played)duckUntil=now()+.9;return played;
   }
   case 'moment-reply':{
    if(mix.sfx<=0)return false;
    soundNoise(.20,.026,1700,0,now(),'bandpass');
    const played=compositionNote('harp',72,.44,.06,0,now()+.055);
    if(played)duckUntil=now()+.3;return played;
   }
   case 'letter-turn':{const notes=[62,66,69,74,78],i=Math.max(0,Math.floor(payload.tile||0))%notes.length;sample('piano',notes[i],.48,.07,payload.pan||0,now(),sfxBus);if(!foley('stoneTurn',.24,payload.pan||0,.97+random()*.06))soundNoise(.07,.035,530,payload.pan||0);break;}
   case 'letter-connected':motif(payload.id==='tide'?[62,69,74,81]:[69,74,78],.19,.24,'harp');break;
   case 'letter-reply':{
    soundNoise(.45,.08,1800,0,now(),'bandpass');
    if(payload.id==='tide'){
     const beat=60/scoreScene({...scene,letter:'tide'}).bpm;
     for(const item of tideReplyScore(payload.choice??scene.letterChoice))sample(item.instrument,item.midi,item.duration*beat,item.gain,item.pan,now()+item.beat*beat,sfxBus);
     duckUntil=now()+.65;
    }else motif(payload.id==='rain'?[62,66,74]:payload.id==='wind'?[66,69,78]:[62,69,74,81],.25,.29);
    break;
   }
   default:return false;
  }return true;
 }
 function setMix(next={}){for(const key of ['music','sfx','ambience'])if(next[key]!==undefined)mix[key]=clamp(Number(next[key]));mixKey='';if(context){fade(sfxBus.gain,mix.sfx,.12);fade(ambientBus.gain,mix.ambience,.2);}}
 function update(dt,next={}){
  if(disposed)return;
  const step=clamp(dt,0,.15);scene={...scene,...next};scene.night=clamp(scene.night);scene.combo=Math.max(0,finite(scene.combo));
  if(!playable())return;const t=now(),config=scoreScene(scene);
  const atlas=config.atlas||null,habitat=config.ambience,voyage=config.voyage||null,ocean=config.zone==='ocean',voyageSpeed=clamp(scene.voyageSpeed,0,3);
  if(config.zone!==lastZone||voyage!==lastVoyage||atlas!==lastAtlas){
   const atlasChanged=atlas!==lastAtlas;
   if(atlasChanged)stepDistance=.4;
   if(voyage!==lastVoyage||atlasChanged)for(const voice of voices){if(!atlasChanged&&voice.bus!==musicBus)continue;hold(voice.envelope.gain);voice.envelope.gain.linearRampToValueAtTime(0,t+.2);for(const source of voice.sources){try{source.stop(t+.24);}catch{}}}
   lastZone=config.zone;lastVoyage=voyage;lastAtlas=atlas;pending=[];nextBar=t+.15;barIndex=config.zone==='finale'?12:0;
  }
  const nearWater=Number.isFinite(scene.nearWater)?clamp(scene.nearWater):config.zone==='pool'?1:config.zone==='finale'?.35:0;
  const seaLevel=voyage?(ocean?.10+Math.sin(t*.43)*.025+voyageSpeed*.012:voyage==='tide'?.065:.042):0;
  const key=[config.zone,atlas,voyage,Math.round(voyageSpeed*3),Math.round(seaLevel*100),scene.opening,scene.branch,scene.ended,scene.challengeActive,Math.round(scene.night*5),Math.round(mix.music*100),t<duckUntil,scene.flowerPhase,scene.gestureActive,scene.composing,Math.round(nearWater*20)].join(':');
  if(key!==mixKey){mixKey=key;const storytelling=atlas?1:scene.branch?.53:scene.opening?.88:1,duck=t<duckUntil?.58:1;
   hold(musicBus.gain);musicBus.gain.linearRampToValueAtTime(scene.composing?0:mix.music*2.2*storytelling*duck*(!atlas&&scene.night>.5?.85:1),t+.32);
   fade(windGain.gain,habitat?habitat.wind:ocean?.07+voyageSpeed*.025:scene.gestureActive?.17:config.zone==='wind'?.14:scene.flowerPhase==='drifting'?.12:.055,.5);
   fade(windFilter?.frequency,habitat?habitat.windCutoff:650,.5);
   fade(waterGain?.gain,habitat?habitat.water:voyage?.025+nearWater*.04:.025+nearWater*.28,.9);
   fade(seaGain?.gain,seaLevel,.65);fade(seaFilter?.frequency,ocean?380+voyageSpeed*45:560,.8);
   fade(birdGain?.gain,habitat?habitat.birds:ocean?.028:(scene.night>.5?.07:.22)*(scene.branch?.7:1)*(config.zone==='garden'?1:.75),.9);
  }
  // 0.55 s of sample-accurate lookahead absorbs normal rendering stalls.
  if(scene.composing){pending=[];nextBar=0;}
  else if(loaded){
   if(!nextBar)nextBar=t+.05;
   if(nextBar<t-.6){missedSchedules++;pending=[];nextBar=t+.06;}
   if(nextBar<t+.55){const score=scoreBar(barIndex++,scene),beat=60/score.bpm;for(const item of score.notes)pending.push({...item,at:nextBar+item.beat*beat,seconds:item.duration*beat});nextBar+=score.beats*beat;}
   while(pending.length&&pending[0].at<t+.55){const item=pending.shift();if(item.at<t-.12){missedSchedules++;continue;}sample(item.instrument,item.midi,item.seconds,item.gain,item.pan,item.at,musicBus);}
  }
  // Prime the first stride so a short deliberate press lands a foot. Stop/start
  // jitter still cannot emit more than one footfall per 160 ms of audio time.
  if(scene.moving&&!ocean){stepDistance=Math.min(.5,stepDistance+step*clamp(finite(scene.speed,3.15)/3.15,.5,1.8));if(stepDistance>=.50&&t-lastFootstepAt>=.16){stepDistance=0;lastFootstepAt=t;footsteps();}}
  else stepDistance=.4;
 }
 function setMuted(value){
  muted=!!value;if(!context||disposed)return;
  if(muted){clearVoices();hold(master.gain);master.gain.linearRampToValueAtTime(0,now()+.06);}
  else fade(master.gain,paused?0:.8,.06);
 }
 function pause(value){paused=!!value;if(!context||disposed)return;if(paused){clearVoices();hold(master.gain);master.gain.setValueAtTime(0,now());context.suspend().catch(()=>{});}else resume();}
 function dispose(){if(disposed)return;disposed=true;clearVoices();for(const source of persistentSources){try{source.stop();}catch{}}for(const node of persistentNodes){try{node.disconnect();}catch{}}persistentNodes.clear();persistentSources.clear();samples.clear();fallbackSamples.clear();voyageEventTimes.clear();context?.close().catch(()=>{});}
 function getStats(){return {state:context?.state||'uninitialized',muted,paused,disposed,loaded,loadedSamples:Object.keys(SAMPLE_BANK).filter(v=>samples.has(v)),loadedFoley:Object.keys(FOLEY_BANK).filter(v=>samples.has(v)),loadErrors:loadErrors.slice(),persistentNodes:persistentNodes.size,persistentSources:persistentSources.size,voices:voices.size,voiceLimit:MAX_VOICES,queuedNotes:pending.length,bar:barIndex%16,musicTitle:scoreScene(scene).title,mix:{...mix},scheduledNotes,eventCount,foleyEvents,lastFoley,fallbackNotes,fallbackInstruments:[...fallbackSamples.keys()],missedSchedules,hasOutput,scene:{zone:scene.zone,atlas:scoreScene(scene).atlas||null,atlasProgress:clamp(scene.atlasProgress),voyage:scoreScene(scene).voyage||null,voyageSpeed:clamp(scene.voyageSpeed,0,3),groundMaterial:scene.groundMaterial,nearWater:scene.nearWater,challengeActive:!!scene.challengeActive,flowerPhase:scene.flowerPhase,composing:!!scene.composing}};}
 return {unlock,note,chime,update,setMuted,pause,dispose,event,setMix,getStats,ready:()=>loadPromise||Promise.resolve({loaded:0,errors:[]})};
}
