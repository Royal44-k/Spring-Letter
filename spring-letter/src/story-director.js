import {OPENING,BRANCHES} from './story-content.js';
import {appendBeat,commitMotif,scanInscription,observeMemory,commitMemory} from './story-model.js';

const $=id=>document.getElementById(id);
const beatNames=['留白','左杯','右杯'];
export function createStoryDirector({getState,audio,caption,toast,save,project,getLightTargets,onOpeningStart,onOpeningEnd,onBranchStart,onBranchEnd,onReply=()=>{}}){
 let opening=null,branch=null,memoryBloom=.5,beam=null,lightSweep=null,beatValue=0,beatPulse=0,playback=null,rhythmDraft=null,lastPointer=null;
 function progress(){const s=getState();return s.bridge.solved?3:s.wind.solved?2:s.p1.solved?1:0;}
 function nearby(){const s=getState();return Object.entries(BRANCHES).filter(([,b])=>b.need<=progress()&&Math.hypot(s.player.x-b.x,s.player.z-b.z)<2.05).sort((a,b)=>Math.hypot(s.player.x-a[1].x,s.player.z-a[1].z)-Math.hypot(s.player.x-b[1].x,s.player.z-b[1].z))[0]?.[0]||null;}
 function showOpeningFrame(){const part=OPENING[opening.index];$('opening-speaker').textContent=part.speaker;$('opening-line').textContent=part.text;$('opening-page').textContent=`0${opening.index+1} / 06`;$('opening-next').textContent=opening.index===5?'醒来，走进花庭 →':'下一段 · Space';audio.note([261.63,329.63,392,523.25,440,293.66][opening.index],2,.13);}
 function startOpening(){opening={index:0,elapsed:0};branch=null;playback=null;onOpeningStart();$('opening').hidden=false;showOpeningFrame();}
 function cancelOpening(){opening=null;$('opening').hidden=true;$('opening-progress').style.width='0%';}
 function finishOpening(){if(!opening)return;cancelOpening();getState().story.introSeen=true;onOpeningEnd();save();}
 function nextOpening(){if(!opening)return;if(opening.index===5){finishOpening();return;}opening.index++;opening.elapsed=0;showOpeningFrame();}
 function pulse(n){beatValue=n;beatPulse=1;if(n)audio.note(n===1?392:523.25,1.2,.28,{pan:n===1?-.45:.45,kind:'cup'});}
 function playMotif(){const motif=rhythmDraft??getState().story.motif;playback={notes:motif.length?[...motif]:[1,1,0,2,2,2],index:0,elapsed:.6};}
 function playFarewell(){const s=getState().story;playback={notes:s.branches.rhythm?[...s.motif]:[1,1,2],index:0,elapsed:0,reply:true};}
 function completed(id){audio.chime();save();caption(BRANCHES[id].reward,10);$('branch-line').textContent=BRANCHES[id].reward;renderTask();}
 function tap(n){const s=getState().story;if(rhythmDraft===null){toast('先选择改写杯曲，再留下新的六拍。');return;}const draft={...s,branches:{...s.branches,rhythm:false},motif:rhythmDraft},r=appendBeat(draft,n);if(!r.ok){toast(r.reason);return;}if(!s.branches.rhythm){s.motif=[...rhythmDraft];save();}pulse(n);renderTask();}
 function finishBranch(){const s=getState().story;let r;if(branch==='rhythm'){if(rhythmDraft===null)return;const draft={...s,branches:{...s.branches,rhythm:false},motif:rhythmDraft};r=commitMotif(draft);if(r.ok){s.motif=[...rhythmDraft];s.branches.rhythm=true;rhythmDraft=null;}}else if(branch==='memory')r=commitMemory(s,memoryBloom);else return;if(!r.ok)toast(r.reason);else completed(branch);}
 function renderTask(){
  if(!branch)return;const s=getState().story,done=s.branches[branch],editing=branch==='rhythm'&&rhythmDraft!==null;$('branch-finish').hidden=(done&&!editing)||branch==='light';
  if(branch==='rhythm'){
   const motif=rhythmDraft??s.motif;
   $('branch-task').innerHTML=`<div class="motif-slots" aria-label="六拍杯曲">${Array.from({length:6},(_,i)=>`<span class="${motif[i]!==undefined?'filled':''}" aria-label="第${i+1}拍 ${beatNames[motif[i]]||'未写'}">${motif[i]===0?'—':motif[i]===1?'◒':motif[i]===2?'◓':'·'}</span>`).join('')}</div>${editing?`<div class="beat-pad"><button data-beat="1">左杯 <kbd>1</kbd></button><button data-beat="2">右杯 <kbd>2</kbd></button><button data-beat="0">留白 <kbd>0</kbd></button></div>`:''}<div class="pair"><button id="motif-play">${!motif.length?'听旧杯示范':editing?'试听这一句':'重听我的杯曲'}</button>${editing?'<button id="motif-reset">重新编写</button>':'<button id="motif-rewrite">改写杯曲</button>'}</div>${done&&editing?'<button id="motif-cancel">保留原曲</button>':''}`;
   document.querySelectorAll('[data-beat]').forEach(b=>b.onclick=()=>tap(Number(b.dataset.beat)));$('motif-play').onclick=playMotif;if($('motif-reset'))$('motif-reset').onclick=()=>{rhythmDraft=[];playback=null;if(!s.branches.rhythm){s.motif=[];save();}renderTask();};if($('motif-rewrite'))$('motif-rewrite').onclick=()=>{rhythmDraft=[];playback=null;renderTask();};if($('motif-cancel'))$('motif-cancel').onclick=()=>{rhythmDraft=null;playback=null;renderTask();};
   $('branch-status').textContent=done&&!editing?'你留下的六拍，还可以重听或改写。':done?'改写尚未保存。留下新曲后才会替换原曲；离开仍保留原曲。':'自由编写六拍，至少让一拍响起。也可以留一点空白，让后来者接一句。';$('branch-finish').textContent=done?'以这句替换原曲':'把这句杯声留下';
  }else if(branch==='light'){
   $('branch-task').innerHTML='<div class="inscription-guides">'+['左边刻痕','中间刻痕','右边刻痕'].map((t,i)=>`<button data-inscription="${i}" aria-pressed="false"><span>${s.lightFound[i]?['后来者','有席','此处'][i]:t}</span><kbd>${i+1}</kbd><i></i></button>`).join('')+'</div>';
   document.querySelectorAll('[data-inscription]').forEach(b=>b.onclick=()=>{beam=Number(b.dataset.inscription);});$('branch-status').textContent=done?'这不是寄给某一个人的地址，而是一个向后来者敞开的席位。':'在实景刻痕上停留光束；也可按 1 / 2 / 3 定位。光停稳，字才显影。';
  }else{
   $('branch-task').innerHTML=`<div class="memory-years"><span id="memory-closed">${s.memorySeen.closed?'✓':'○'} 风暴那年</span><span id="memory-open">${s.memorySeen.open?'✓':'○'} 晴天以后</span></div><label class="memory-range">合拢 <span>开放</span><input id="memory-bloom" type="range" min="0" max="100" value="${Math.round(memoryBloom*100)}" aria-label="旧花开放程度"></label><p id="memory-evidence"></p>`;
   $('memory-bloom').oninput=e=>{memoryBloom=Number(e.target.value)/100;};$('branch-status').textContent=done?'你留下的姿态会保存在记录架上；此处仍可反复观察。':'把旧花全合、全开各停留片刻，再选择一种仍有余地的中间姿态。';$('branch-finish').textContent='留下这道能呼吸的缝';
  }
 }
 function openBranch(id){if(!BRANCHES[id])return;branch=id;beam=null;lightSweep=null;playback=null;const s=getState().story;rhythmDraft=id==='rhythm'&&!s.branches.rhythm?[...s.motif]:null;memoryBloom=s.memoryBloom;onBranchStart(id);$('context-label').textContent=BRANCHES[id].title;$('branch-subtitle').textContent=BRANCHES[id].subtitle;$('branch-line').textContent=s.branches[id]?BRANCHES[id].reward:BRANCHES[id].text;renderTask();}
 function exitBranch(){branch=null;beam=null;lightSweep=null;playback=null;rhythmDraft=null;const s=getState().story;memoryBloom=s.memoryBloom;s.lightHold=[0,0,0];s.memoryHold={closed:0,open:0};}
 function handleKey(code){if(opening){if(code==='Space')nextOpening();else if(code==='Escape')finishOpening();return true;}if(!branch)return false;if(branch==='rhythm'&&['Digit0','Digit1','Digit2'].includes(code)){tap(Number(code.at(-1)));return true;}if(branch==='light'&&['Digit1','Digit2','Digit3'].includes(code)){beam=Number(code.at(-1))-1;return true;}return false;}
 function update(dt,{pointer,active,orbiting}){
  const s=getState().story,pointerMoved=pointer&&lastPointer&&(pointer.x!==lastPointer.x||pointer.y!==lastPointer.y);if(pointer)lastPointer={x:pointer.x,y:pointer.y};
  if(opening){opening.elapsed+=dt;$('opening-progress').style.width=`${Math.min(100,opening.elapsed/8*100)}%`;if(opening.elapsed>=8)nextOpening();}
  beatPulse=Math.max(0,beatPulse-dt*2.5);
  if(playback){playback.elapsed+=dt;if(playback.elapsed>=.6){playback.elapsed=0;if(playback.index<playback.notes.length)pulse(playback.notes[playback.index++]);else{if((playback.reply||s.branches.rhythm)&&getState().companion.awakened){audio.note(659.25,1.5,.2);onReply();}playback=null;}}}
  if(branch==='light'){
   const targets=getLightTargets();let target=beam;
   if(active&&!orbiting&&pointer&&pointerMoved){target=null;let closest=64;targets.forEach((p,i)=>{const screen=project(p.x,p.y,p.z),d=Math.hypot(screen.x-pointer.x,screen.y-pointer.y);if(d<closest){closest=d;target=i;}});beam=target;}
   lightSweep=target===null?null:targets[target]||null;
   const before=s.lightFound.filter(Boolean).length,done=s.branches.light;scanInscription(s,target,dt);
   if(s.lightFound.filter(Boolean).length!==before){audio.note([392,523.25,659.25][target],1.6,.2);save();renderTask();}
   document.querySelectorAll('[data-inscription]').forEach((el,i)=>{el.setAttribute('aria-pressed',String(target===i));el.querySelector('i').style.width=`${s.lightFound[i]?100:s.lightHold[i]/.65*100}%`;});
   if(!done&&s.branches.light)completed('light');
  }else if(branch==='memory'){
   const count=Number(s.memorySeen.closed)+Number(s.memorySeen.open);observeMemory(s,memoryBloom,dt);
   if(count!==Number(s.memorySeen.closed)+Number(s.memorySeen.open)){save();audio.note(memoryBloom<.5?261.63:523.25,1.8,.2);}
   $('memory-closed').textContent=`${s.memorySeen.closed?'✓':'○'} 风暴那年`;$('memory-open').textContent=`${s.memorySeen.open?'✓':'○'} 晴天以后`;
   $('memory-evidence').textContent=memoryBloom<.15?'花瓣合拢，风暴里的种子被保护了。':memoryBloom>.85?'花瓣打开，外面的年轮继续向前；留在花心里的时光，曾经停得太久。':'花仍有遮护，也为新来的风留下一道缝。';
  }
 }
 $('opening-next').onclick=nextOpening;$('opening-skip').onclick=finishOpening;$('branch-finish').onclick=finishBranch;$('nearby-branch').onclick=()=>{const id=nearby();if(id)openBranch(id);};
 return {startOpening,cancelOpening,finishOpening,nextOpening,openBranch,exitBranch,nearby,handleKey,update,playMotif,playFarewell,
  get opening(){return opening?{...OPENING[opening.index],index:opening.index,progress:(opening.index+opening.elapsed/8)/6}:null;},
  get branch(){return branch;},get presentation(){return {lightSweep,memoryBloom:branch==='memory'?memoryBloom:getState().story.memoryBloom,beatValue,beatPulse};},
  dispose(){exitBranch();opening=null;},
 };
}
