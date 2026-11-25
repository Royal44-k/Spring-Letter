const fs=require('node:fs'),assert=require('node:assert/strict');
function edit(file,fn){const original=fs.readFileSync(file,'utf8');fs.writeFileSync(file,fn(original));}
function rep(s,a,b){assert.ok(s.includes(a),'Missing integration anchor: '+a.slice(0,90));return s.replace(a,b);}
edit('src/game-model.js',s=>{s=rep(s,"import {createLetters,restoreLetters} from './letter-model.js';","import {createLetters,restoreLetters} from './letter-model.js';\nimport {createMoments,restoreMoments} from './moments-state.js';");s=rep(s,'letters:createLetters(),lettersSent:null','letters:createLetters(),lettersSent:null,moments:createMoments()');s=rep(s,'exploration,letters,lettersSent,settings}=state','exploration,letters,lettersSent,moments,settings}=state');s=rep(s,'exploration,letters,lettersSent,settings});','exploration,letters,lettersSent,moments,settings});');s=rep(s,'clean.letters=restoreLetters(data.letters);','clean.moments=restoreMoments(data.moments);clean.letters=restoreLetters(data.letters);');return s;});
edit('src/letter-model.js',s=>{s=rep(s,"const clean=createLetters();if(value?.version!==1)return clean;","const clean=createLetters();if(value?.version!==1)return clean;");s=rep(s,'entry.choice=l.goals.some(g=>g.id===old.choice)?old.choice:null;','entry.choice=l.goals.some(g=>g.id===old.choice)?old.choice:null;if(old.edition===2){entry.edition=2;try{const artifact=JSON.stringify(old.artwork);if(artifact&&artifact.length<24000)entry.artwork=JSON.parse(artifact);}catch{}}');return s;});
edit('src/postcard.js',s=>{s="import {momentLetter} from './moments-state.js';\n"+s;s=rep(s,'return LETTERS.map(l=>{const g=l.goals.find','return LETTERS.map(original=>{const l=momentLetter(original,saved.entries[original.id]);const g=l.goals.find');return s;});
edit('src/save-service.js',s=>rep(s,"['letters','lettersSent']","['letters','lettersSent','moments']"));
edit('src/main.js',s=>{
 s=rep(s,"import {createLetterController} from './letter-controller.js';","import {createLetterController} from './moments-controller.js';\nimport {momentLetter,momentText,safeArtwork} from './moments-state.js';");
 s=rep(s,"LETTERS.map(l=>{const e=state.letters.entries[l.id],unlocked=letterUnlocked(l,state);","LETTERS.map(original=>{const e=state.letters.entries[original.id],l=momentLetter(original,e),unlocked=letterUnlocked(l,state);");
 s=rep(s,"completedLetters(letters).map(l=>'<p><b>'+l.title+'</b><br>'+l.replies[letters.entries[l.id].choice]+'</p>')","completedLetters(letters).map(original=>{const l=momentLetter(original,letters.entries[original.id]);return '<p><b>'+l.title+'</b><br>'+l.replies[letters.entries[l.id].choice]+'</p>';})");
 s=rep(s,'function onGardenReply(id,choice,result){',`function commitMoment(id,choice,draft){
 const text=momentText(id);if(!text?.goals.some(g=>g.id===choice))return {ok:false};
 const candidate=restore(serialize(state));candidate.player={...state.player};candidate.moments.entries[id]={draft:safeArtwork(draft),completed:true};
 const entry=candidate.letters.entries[id];entry.choice=choice;entry.edition=2;entry.artwork=safeArtwork(draft);entry.read=true;
 if(id==='rain'){candidate.p1.solved=true;candidate.p1.hold=.8;if(!candidate.discoveries.includes('leaf'))candidate.discoveries.push('leaf');}
 if(id==='wind'){candidate.wind.solved=true;candidate.wind.hold=1;}
 const result=saveService.commit({...currentPayload(),journey:serialize(candidate)},{reason:'moment-reply'});lastSaveResult=result;
 if(!result.ok){savePanel.notifyFailure(result);savePanel.show();return result;}state=candidate;return result;
}
function onGardenReply(id,choice,result){`);
 s=rep(s,'function clearInput(){touchDash=false;','function clearInput(){letterController?.cancel?.();touchDash=false;');
 s=s.replaceAll('读信 · 接通叶脉','走近看看 · 展开来信');
 s=rep(s,"if(focus==='letter'){setPointer(e);canvas.focus({preventScroll:true});if(e.button===0)letterController.pick(raycaster);return;}","if(focus==='letter'){setPointer(e);canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);audio.unlock();if(e.button===0)letterController.pointer('down',raycaster,e);return;}");
 s=rep(s,"if(focus==='letter')return;","if(focus==='letter'){setPointer(e);letterController.pointer('move',raycaster,e);return;}");
 s=rep(s,"window.addEventListener('pointerup',e=>{if(e.pointerId", "window.addEventListener('pointerup',e=>{if(focus==='letter'){setPointer(e);letterController.pointer('up',raycaster,e);return;}if(e.pointerId");
 s=rep(s,"window.addEventListener('keyup',e=>{keys.delete(e.code);","window.addEventListener('keyup',e=>{letterController?.handleKey(e);keys.delete(e.code);");
 s=rep(s,"const rect=portrait?{left:20", "const legacyRect=portrait?{left:20");
 s=rep(s,"const framed=frameBounds(bounds,{direction:{x:0,y:8.5,z:4.2},fov:48,width:innerWidth,height:innerHeight,rect});", "const rect=letterController.frameRect?.(innerWidth,innerHeight)||legacyRect;const framed=frameBounds(bounds,{direction:letterController.cameraOffset?.()||{x:0,y:8.5,z:4.2},fov:48,width:innerWidth,height:innerHeight,rect});");
 s=rep(s,"interactive:mode==='play'&&!focus&&!hadPinch&&touchPoints.size<2","interactive:false");
 s=rep(s,"exploration.group.visible=mode!=='cover'&&mode!=='gallery'&&focus!=='letter'&&dustView<.995;","exploration.group.visible=false;");
 s=rep(s,"function updateExplorationUI(){const c=exploration.context,visible=mode==='play'&&!focus&&!!c.nearTarget&&!letterController?.nearId;","function updateExplorationUI(){const c=exploration.context,visible=false;");
 s=rep(s,"onSave:save,onReply:onGardenReply,","onSave:save,onReply:onGardenReply,onCommit:commitMoment,");
 s=rep(s,"onSound:(kind,payload)=>audio.event?.(kind==='source'?'burst':'letter-'+kind,payload)","onSound:(kind,payload)=>audio.event?.(kind==='compose-note'?'compose-note':kind.startsWith('wind')?'catch':kind.startsWith('light')?'letter-turn':kind==='source'?'burst':'letter-'+kind,payload)");
 s=s.replaceAll("version:'0.6.0'","version:'0.7.0'").replaceAll('0.6 来信之庭','0.7 折光 · 渡风 · 织声');
 s=s.replace('你用花尘接通叶脉，为尚未抵达的人照料庭院。','你在光里拼回花窗，乘纸翼穿过风廊，再把自己写下的春声寄向远方。');
 return s;
});
edit('src/audio-engine.js',s=>{s=rep(s,"case 'letter-turn':",`case 'compose-note':{const instrument=['piano','harp','flute'].includes(payload.instrument)?payload.instrument:'piano';sample(instrument,Math.max(36,Math.min(96,finite(payload.midi,69))),Math.max(.12,Math.min(4,finite(payload.duration,1))),Math.max(0,Math.min(.3,finite(payload.gain,.12))),Math.max(-1,Math.min(1,finite(payload.pan,0))),now(),sfxBus);duckUntil=now()+.9;break;}
   case 'letter-turn':`);s=rep(s,'mix.music*2.2*storytelling*duck*','mix.music*2.2*storytelling*duck*(scene.composing?.3:1)*');s=rep(s,'scene.flowerPhase,scene.gestureActive,','scene.flowerPhase,scene.gestureActive,scene.composing,');return s;});
for(const file of ['package.json','package-lock.json'])edit(file,s=>s.replaceAll('"version": "0.6.0"','"version": "0.7.0"'));
console.log('Integrated v9; source preview only, production dist unchanged');
