// Original Spring Letter score, 16 bars in 3/4. Related tonal centres make
// transitions musical; fragments are authored, never random note picking.
export const SAMPLE_BANK = Object.freeze({
 harpLow:{file:'harp-low.wav',root:48},harp:{file:'harp-high.wav',root:72},
 piano:{file:'piano.wav',root:60},flute:{file:'flute.wav',root:72},
 cello:{file:'cello.wav',root:60},pizz:{file:'pizz.wav',root:60},triangle:{file:'triangle.wav',root:72}
});
// CC0 recordings, with source files and processing hashes beside the assets.
export const FOLEY_BANK = Object.freeze({
 grass0:{file:'grass-0.wav'},grass1:{file:'grass-1.wav'},grass2:{file:'grass-2.wav'},
 stone0:{file:'stone-0.wav'},stone1:{file:'stone-1.wav'},stone2:{file:'stone-2.wav'},
 stoneTurn:{file:'stone-turn.wav'},birds:{file:'birds-loop.wav'},river:{file:'river-loop.wav'}
});
const CHORDS = [
 [50,62,66,69,73],[49,61,64,69,71],[47,59,62,66,69],[43,55,59,62,66],
 [45,57,62,64,69],[47,59,62,66,73],[52,64,67,71,74],[45,57,61,64,69],
 [43,55,59,62,66],[50,62,66,69,74],[40,52,55,59,66],[45,57,61,64,71],
 [47,59,62,66,69],[43,55,59,62,69],[45,57,61,64,69],[50,62,66,69,74]
];
const MELODIES = [
 [[0,74,1],[1,78,.5],[1.5,81,.5],[2,83,1]],[[.5,81,1],[1.5,76,.5],[2,73,1]],
 [[0,78,1.5],[1.5,76,.5],[2,74,1]],[[0,71,1],[1,74,1],[2,78,1]],
 [[.5,76,.5],[1,74,1],[2,69,1]],[[0,71,1.5],[1.5,74,.5],[2,78,1]],
 [[0,79,1],[1,78,.5],[1.5,76,.5],[2,74,1]],[[0,73,1.5],[2,69,.75]],
 [[0,71,1],[1,74,.5],[1.5,78,.5],[2,81,1]],[[0,78,1.5],[1.5,76,.5],[2,74,1]],
 [[0,71,1.5],[2,67,.75]],[[0,69,1],[1,73,1],[2,76,1]],
 [[0,78,1],[1.5,74,.5],[2,71,1]],[[0,74,1.5],[1.5,71,.5],[2,69,1]],
 [[0,73,1],[1,76,1],[2,81,1]],[[0,78,1],[1,76,.5],[1.5,74,1.5]]
];
// Shore is a quiet place to make a letter, not another victory fanfare.
// At sea a beat is an eighth-note: accents at 0 and 3 make an actual 6/8 lilt.
const VOYAGE = Object.freeze({
 writing:{zone:'shore',bpm:64,beats:4,title:'落笔之前'},
 tide:{zone:'shore',bpm:60,beats:4,title:'潮水替人留白'},
 island:{zone:'shore',bpm:72,beats:3,title:'岛上还有一盏灯'},
 rigging:{zone:'shore',bpm:78,beats:3,title:'把风系在帆上'},
 sailing:{zone:'ocean',bpm:144,beats:6,title:'一路繁花向海'},
 dawn:{zone:'ocean',bpm:126,beats:6,title:'天将明，两封信'},
 complete:{zone:'ocean',bpm:108,beats:6,title:'春天已经上路'}
});
const VOYAGE_CHORDS=[
 [50,62,66,69,74],[47,59,62,66,71],[43,55,59,62,69],[45,57,62,64,69],
 [50,62,66,69,74],[43,55,59,62,71],[45,57,61,64,73],[50,62,66,69,74]
];
// The two-note reach and returning D answer the existing garden's D-major
// motif. These are written phrases, not random notes chosen from a scale.
const VOYAGE_MELODY=[
 [[0,74,2],[3,78,2],[5,76,1]],[[1,74,2],[3,71,3]],
 [[0,71,2],[2,74,1],[3,78,3]],[[0,76,3],[4,73,2]],
 [[0,78,2],[2,81,1],[3,78,2],[5,76,1]],[[1,74,2],[3,71,3]],
 [[0,73,2],[2,76,1],[3,81,3]],[[0,78,2],[2,76,1],[3,74,3]]
];
// Three independent phrases for the inland route. Habitat levels reuse the
// existing CC0 bird/river recordings and the existing wind bed; no new loops.
const ATLAS=Object.freeze({
 conservatory:{zone:'atlas',bpm:72,beats:4,title:'蝶翼停在雨声里',ambience:{wind:.032,water:.115,birds:.14,windCutoff:540}},
 observatory:{zone:'atlas',bpm:54,beats:4,title:'留白处有星光',ambience:{wind:.035,water:.003,birds:.008,windCutoff:380}},
 meadow:{zone:'atlas',bpm:90,beats:3,title:'花伞借来的风',ambience:{wind:.12,water:0,birds:.045,windCutoff:720}}
});
const CONSERVATORY_CHORDS=[
 [48,60,64,67],[45,57,60,64],[53,60,65,69],[43,55,62,67],
 [48,60,64,69],[52,59,64,67],[53,60,65,69],[43,55,59,62]
];
const CONSERVATORY_FLUTE={1:[[.5,72,1],[2.5,67,.75]],4:[[1.5,69,1],[3,72,.6]],6:[[.75,74,1.3]]};
const OBSERVATORY_PHRASE=[
 [[0,59,1.7],[.08,66,1.4],[2,81,.7]],[],
 [[.5,62,1.8],[2.5,78,.65]],[],
 [[0,57,1.7],[.12,64,1.6],[2.25,79,.75]],[],
 [[.5,54,1.7],[1.5,66,1],[2.75,83,.65]],[]
];
const MEADOW_ARCS=[
 [55,67,71,74,71,67],[52,64,67,71,74,71],
 [57,69,72,76,72,69],[50,62,66,69,74,69],
 [55,67,74,79,74,71],[52,64,71,76,71,67],
 [57,69,72,76,79,76],[50,62,69,74,69,66]
];
const bounded=(value,min,max)=>Math.max(min,Math.min(max,Number.isFinite(value)?value:min));
const atlasPlace=scene=>typeof scene.atlas==='string'&&Object.hasOwn(ATLAS,scene.atlas)?scene.atlas:null;
const voyageStage=scene=>typeof scene.voyage==='string'&&Object.hasOwn(VOYAGE,scene.voyage)?scene.voyage:null;
export function scoreScene(scene={}) {
 const atlas=atlasPlace(scene);
 if(atlas)return {...ATLAS[atlas],atlas};
 const voyage=voyageStage(scene);
 if(voyage)return {...VOYAGE[voyage],voyage};
 const zone=['garden','wind','pool','finale'].includes(scene.zone)?scene.zone:'garden';
 if(['rain','wind','tide'].includes(scene.letter))return {zone,bpm:scene.letter==='wind'?80:scene.letter==='rain'?70:66,title:{rain:'一瓢雨的回声',wind:'夜渡之前',tide:'留给下一声'}[scene.letter]};
 return {zone,bpm:scene.challengeActive?100:scene.ended?68:zone==='wind'?86:zone==='pool'?70:76,
  title:scene.challengeActive?'逐风的回声':scene.ended?'把春天寄往远方':zone==='wind'?'风廊的舞步':zone==='pool'?'水下的旧信':zone==='finale'?'此刻与远方':'花庭晨光'};
}
function atlasBar(index,scene,config){
 const b=index%8,notes=[],progress=bounded(scene.atlasProgress,0,1);
 const add=(instrument,midi,beat,duration,gain,pan=0)=>notes.push({instrument,midi,beat,duration,gain,pan});
 if(config.atlas==='conservatory'){
  const chord=CONSERVATORY_CHORDS[b];
  add('harpLow',chord[0],0,1.5,.10,-.25);
  add('pizz',chord[1],.5,.5,.12,-.18);
  add('pizz',chord[2],1.75,.45,.095,.18);
  add('harp',chord[3],2.5,1,.085,.32);
  if(b%2===0)add('pizz',chord[1],3.25,.45,.08,-.12);
  for(const [beat,midi,duration]of CONSERVATORY_FLUTE[b]||[])add('flute',midi,beat,duration,.065+progress*.012,.22);
 }else if(config.atlas==='observatory'){
  // Every other bar is wholly silent. Finite piano and harp tails finish
  // before it, instead of a high oscillator or cello filling every pause.
  for(const [beat,midi,duration]of OBSERVATORY_PHRASE[b])add(midi>=78?'harp':'piano',midi,beat,duration,midi>=78?.055+progress*.008:.085,midi>=78?.28:-.22);
 }else{
  const arc=MEADOW_ARCS[b],motion=scene.moving?bounded(scene.speed,0,6)/6:0;
  add('harpLow',arc[0],0,1.7,.095,-.25);
  arc.slice(1).concat(arc[2]).forEach((midi,i)=>add('harp',midi,i*.5,1.05,(i===0?.115:.077)+motion*.012,Math.sin(i)*.32));
  if(b===3)add('flute',76,1,1.35,.065+progress*.01,.25);
  if(b===7){add('flute',79,0,1,.075,.25);add('flute',74,1.5,1,.065,.25);}
 }
 return {index,...config,notes:notes.sort((a,b)=>a.beat-b.beat)};
}
function voyageBar(index,scene,config){
 const b=index%8,chord=VOYAGE_CHORDS[b],notes=[],stage=config.voyage,speed=bounded(scene.voyageSpeed,0,3)/3,progress=bounded(scene.voyageProgress,0,1);
 const add=(instrument,midi,beat,duration,gain,pan=0)=>notes.push({instrument,midi,beat,duration,gain,pan});
 if(stage==='writing'){
  add('piano',chord[1],0,3,.095,-.22);add('piano',chord[2],.04,2.8,.075,.12);
  if(b%2===0)add('harp',chord[3],2.5,1.7,.075,.30);
  if(b%4===3)add('piano',chord[4],2,1.8,.07,.18);
 }else if(stage==='tide'){
  // Even bars have a full second half of silence; the flute answers from the
  // next high stone. A tide wait must not become a metronomic countdown.
  if(b%2===0){add('cello',chord[0],0,1.9,.10,-.23);add('piano',chord[2],.5,1.3,.065,.10);}
  else{add('flute',chord[4],1,1.3,.072,.30);add('harp',chord[3],2.5,1.1,.065,-.25);}
 }else if(stage==='island'){
  add('cello',chord[0],0,3.2,.095,-.2);
  [1,2,3].forEach((tone,i)=>add('piano',chord[tone],i*.05,2.8,.078,-.25+i*.22));
  add('harp',chord[4],1.5,1.8,.09,.30);
  if(b%2)add('flute',VOYAGE_MELODY[b][0][1],.5,1.8,.075,.2);
 }else if(stage==='rigging'){
  add('piano',chord[1],0,2.7,.10,-.18);add('piano',chord[2],.04,2.6,.075,.08);
  add('pizz',chord[0],0,.55,.105,-.25);add('pizz',chord[3],1.5,.55,.085,-.15);
  add('harp',chord[4],2,1.5,.095,.25);
 }else if(stage==='complete'){
  if(b%2===0)add('cello',chord[0],0,5.7,.075,-.2);
  add('piano',chord[1],0,5,.085,-.2);add('piano',chord[2],.05,4.8,.065,.18);
  add('harp',chord[4],3,2.8,.085,.35);
 }else{
  const dawn=stage==='dawn';
  add('cello',chord[0],0,6.3,dawn?.13:.11,-.2);
  add('harpLow',chord[0],0,4.6,.11,-.3);
  [1,3,2,4,3,2].forEach((tone,i)=>add('harp',chord[tone],i,1.9,(i%3===0?.14:.092)+(dawn?.02:speed*.014),Math.sin(i*.9)*.38));
  if(speed>.18||dawn){add('pizz',chord[0],0,.8,.095+speed*.025,-.25);add('pizz',chord[3],3,.7,.085+speed*.02,.15);}
  if(b>=2||dawn)for(const [beat,midi,duration] of VOYAGE_MELODY[b])add('flute',midi,beat,duration+.12,dawn?.105:.078,.32);
  if(dawn){
   [1,2,3].forEach((tone,i)=>add('piano',chord[tone]+12,i*.06,5.4,.075+progress*.015,-.32+i*.22));
   if(b===7)add('harp',86,3,2.6,.09,.50);
  }
 }
 return {index, ...config,notes:notes.sort((a,b)=>a.beat-b.beat)};
}
function tideVoices(choice,pitches){
 // Both replies keep the same two pitches. The new reply leaves half a beat
 // before the harp answers, while the old reply keeps the two voices together.
 return [
  {instrument:'piano',midi:pitches[0],beat:0,duration:1.4,gain:.075,pan:-.55},
  {instrument:'harp',midi:pitches[1],beat:choice==='new'?.5:0,duration:1.4,gain:.085,pan:.55}
 ];
}
export function tideReplyScore(choice){
 return [[62,69],[74,81]].flatMap((pitches,i)=>tideVoices(choice,pitches).map(note=>({...note,beat:note.beat+i*1.5,duration:.8,gain:note.gain*2.7})));
}
export function scoreBar(index,scene={}) {
 const b=((Math.floor(Number.isFinite(index)?index:0)%16)+16)%16, config=scoreScene(scene), notes=[];
 if(config.atlas)return atlasBar(b,scene,config);
 if(config.voyage)return voyageBar(b,scene,config);
 const offset=config.zone==='wind'?2:config.zone==='pool'?8:config.zone==='finale'?12:0;
 const chord=CHORDS[(b+offset)%16], movement=!!scene.challengeActive;
 const add=(instrument,midi,beat,duration,gain,pan=0)=>notes.push({instrument,midi,beat,duration,gain,pan});
 // Grounding bow, soft felt-piano chord, and a separated harp answer.
 add('cello',chord[0],0,3.35,.12,-.15);
 if(b%2===0)add('harpLow',chord[0],0,3.8,.13,-.2);
 [chord[1],chord[2],chord[3]].forEach((note,i)=>add('piano',note,i*.035,3.7,.12+i*.014,-.32+i*.2));
 const arpeggio=movement?[1,3,2,4,3,2]:[1,3,4,2];
 arpeggio.forEach((tone,i)=>add('harp',chord[tone]+(scene.flowerPhase==='drifting'?12:0),i*(movement?.5:.75),1.6,movement?.20:.18,Math.sin(i*1.3)*.38));
 // First four bars establish space. Then an eight-bar call/reply phrase grows.
 if(b>=4||scene.opening||scene.ended||movement){
  const phrase=MELODIES[(b+offset)%16];
  for(const [beat,midi,duration] of phrase) add(config.zone==='pool'?'piano':'flute',midi,beat,duration+.12,scene.opening?.105:.085,.24);
 }
 if(movement){
  [0,1,2].forEach((beat,i)=>add('pizz',chord[i===1?3:0],beat,.52,.24,-.25));
  if(b%2===0)add('triangle',72,0,1.5,.09,.45);
 }else if(b===7||b===15)add('harp',chord[4]+12,2,2.8,.16,.42);
 if(scene.letter){
  // Two tide springs answer from opposite sides. Connection adds a quiet
  // upper response rather than raising the whole soundtrack.
  if(scene.letter==='tide'){
   if(scene.letterChoice==='old'||scene.letterChoice==='new')notes.push(...tideVoices(scene.letterChoice,[chord[2]+12,chord[3]+12]));
   else{add('piano',chord[2]+12,0,1.5,.075,-.55);add('harp',chord[3]+12,1.5,1.7,.085,.55);}
  }
  else if(scene.letter==='wind')add('pizz',chord[1],1,.6,.11,-.2);
  if(scene.letterConnected)add('harp',chord[4]+12,2.25,1.8,.095,.35);
  if(scene.letterChoice&&b%4===0)add(scene.letter==='rain'?'flute':'piano',chord[3]+12,.5,2,.075,.2);
 }
 return {index:b,beats:3,...config,notes:notes.sort((a,b)=>a.beat-b.beat)};
}
export const midiFrequency = midi => 440*2**((midi-69)/12);
