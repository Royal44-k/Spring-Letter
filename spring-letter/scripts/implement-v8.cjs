const fs=require('node:fs');
const file='src/main.js';let s=fs.readFileSync(file,'utf8');
function replace(a,b){if(!s.includes(a))throw Error('Missing anchor: '+a.slice(0,100));s=s.replace(a,b);}
function section(a,b,value){const start=s.indexOf(a),end=s.indexOf(b,start);if(start<0||end<0)throw Error('Missing section '+a);s=s.slice(0,start)+value+'\n'+s.slice(end);}
replace("import './style.css';",`import './style.css';
import {createSaveService,LEGACY_KEYS} from './save-service.js';
import {createSavePanel} from './save-panel.js';
import {createLetterController} from './letter-controller.js';
import {LETTERS,letterById,letterUnlocked,completedLetters} from './letter-model.js';
import './product-v8.css';`);
replace('let loadingScene;',`const saveService=createSaveService({getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v),removeItem:k=>localStorage.removeItem(k)});
saveService.read();
let loadingScene,letterController,savePanel,lastSaveResult=null;`);
replace("try{localStorage.setItem(RESONANCE_KEY,resonance.persist());}catch{}",'save();');
section('function storageGet(key){','function discover(id){',`function storageGet(key){const field=Object.entries(LEGACY_KEYS).find(([,v])=>v===key)?.[0];if(field)return saveService.read().data?.[field]||null;try{return localStorage.getItem(key);}catch{return null;}}
function currentPayload(){return {journey:serialize(state),preferences:JSON.stringify(state.settings),resonance:resonance?.persist()||storageGet(RESONANCE_KEY)};}
function save(){const payload={preferences:JSON.stringify(state.settings)};if(mode==='play'||mode==='opening'){payload.journey=serialize(state);if(resonance)payload.resonance=resonance.persist();}
 lastSaveResult=saveService.commit(payload);if(!lastSaveResult.ok)savePanel?.notifyFailure(lastSaveResult);return lastSaveResult;
}
function showLetters(){
 const completed=completedLetters(state.letters),canTravel=!!state.letters.entries.wind.choice;
 openModal('<small>送春人的信册 · '+completed.length+' / 3 封回信</small><h2>有人把愿望留在这里</h2><p>这是岑尚未回复的旧来信。你可以替他们照料一处，也可以回来重新安排。每一种选择都留下自己的回应。</p><div class="letter-book">'+LETTERS.map(l=>{const e=state.letters.entries[l.id],unlocked=letterUnlocked(l,state);return '<article><small>'+l.sender+'</small><h3>'+(e.choice?'✉ ':'')+l.title+'</h3><p>'+l.note+'</p>'+(e.choice?'<blockquote>'+l.replies[e.choice]+'</blockquote><p class="letter-benefit">'+l.reward+'</p>':'<p class="muted">'+(unlocked?'尚未回信 · '+l.rule:'前方的路醒来后，就能走到这里。')+'</p>')+'<div class="row"><button data-track-letter="'+l.id+'" '+(!unlocked||mode!=='play'?'disabled':'')+'>在花庭中寻找</button>'+(e.choice&&canTravel&&mode==='play'?'<button data-travel-letter="'+l.id+'">乘花尘前往</button>':'')+'</div></article>';}).join('')+'</div>'+(canTravel&&mode==='play'?'<button id="travel-home">乘花尘回初庭</button>':'')+'<p class="muted">三封信不分高低。风廊的追风和各庭的旧活动仍可自由体验。</p>');
 all('[data-track-letter]').forEach(b=>b.onclick=()=>{letterController.track(b.dataset.trackLetter);closeModal();exitFocus();caption('沿花庭图前往'+({rain:'左侧的听雨春庭',wind:'右侧的逆风春庭',tide:'旧台左侧的回声春庭'})[b.dataset.trackLetter]+'，靠近信台按 E。',6);});
 all('[data-travel-letter]').forEach(b=>b.onclick=()=>travelToLetter(b.dataset.travelLetter));if($('travel-home'))$('travel-home').onclick=()=>travelToLetter('home');
}
function travelToLetter(id){
 if(mode!=='play'||!state.letters.entries.wind.choice||resonance?.context.active){toast('先结束这一程追风，再乘花尘往返。');return;}
 if(delivery.carried!==null){toast('先把手中的种核安放好，再乘花尘出发。');return;}
 const l=letterById(id);if(id!=='home'&&(!l||!state.letters.entries[id].choice||!letterUnlocked(l,state)))return;
 closeModal();exitFocus();clearInput();state.player={x:l?l.x:0,z:l?l.z+2.5:5.5,safe:id==='wind'?'wind':id==='tide'?'pool':'garden'};state.bridge.support=null;if(id==='tide')state.bridge.platform='R';travel.reset();viewRig.reset();dash.refill(1);document.body.classList.add('travelling');setTimeout(()=>document.body.classList.remove('travelling'),state.settings.reducedMotion?50:950);audio.chime();caption(l?l.title+'。你留下的照料，还在这里。':'回到了初庭。花仍记得最初的风。',5);save();
}
function letterRepliesHtml(letters=state.letters){return completedLetters(letters).map(l=>'<p><b>'+l.title+'</b><br>'+l.replies[letters.entries[l.id].choice]+'</p>').join('')||'<p class="muted">还有三封旧来信，等愿意绕远的人。</p>';}
function onGardenReply(id,choice,result){
 if(id==='rain'&&!state.p1.solved){state.p1.solved=true;state.p1.hold=.8;discoverSilently('leaf');}
 if(id==='wind'&&!state.wind.solved){state.wind.solved=true;state.wind.hold=1;}
 dash.refill(1);audio.event?.('plant');audio.chime();world.respond();caption(result.text,9);
}
`);
replace("if(!focus&&resonance?.context.active){attemptResonance();return;}","if(focus==='letter'){letterController.exit();return;}\n if(!focus&&resonance?.context.active){attemptResonance();return;}");
replace("if(!focus&&resonance?.context.atStart){attemptResonance();return;}","if(!focus&&letterController?.nearId){letterController.enter(letterController.nearId);return;}\n if(!focus&&resonance?.context.atStart){attemptResonance();return;}");
replace("if(!focus&&resonance?.context.atStart&&!['take','plant','lift','send'].includes(delivery.context?.kind))$('focus-button').innerHTML='<kbd>E</kbd> '+resonance.context.actionLabel;", "if(!focus&&resonance?.context.atStart&&!['take','plant','lift','send'].includes(delivery.context?.kind))$('focus-button').innerHTML='<kbd>E</kbd> '+resonance.context.actionLabel;\n if(!focus&&letterController?.nearId)$('focus-button').innerHTML='<kbd>E</kbd> 读信 · 接通叶脉';");
replace("const c=exploration.context,visible=mode==='play'&&!focus&&!!c.nearTarget;", "const c=exploration.context,visible=mode==='play'&&!focus&&!!c.nearTarget&&!letterController?.nearId;");
replace('<div class="row"><button id="recover">回到最近的石台</button>', '<div class="row"><button id="save-manager">旅途存档</button><button id="help-play">行走手册</button><button id="recover">回到最近的石台</button>');
replace("$('camera-follow').onchange=", "$('save-manager').onclick=()=>savePanel.show();$('help-play').onclick=showPlayHelp;\n $('camera-follow').onchange=");
replace("function resetPresentation(){resonance?.cancel();", "function resetPresentation(){letterController?.reset();resonance?.cancel();");
replace("function startGame(continued=false){const preferences={...state.settings};resetPresentation();mode='play';state=continued?restore(storageGet(SAVE_KEY)):createState();state.settings=preferences;", `function startGame(continued=false){
 const preferences={...state.settings};if(continued){const r=saveService.reload();if(!r.ok){savePanel.notifyFailure(r);savePanel.show();return;}}
 const raw=continued?storageGet(SAVE_KEY):null,candidate=continued?restore(raw):createState();candidate.settings=preferences;candidate.started=true;
 if(!continued){const result=saveService.commit({journey:serialize(candidate),preferences:JSON.stringify(preferences),resonance:resonance.persist(),beforeLetter:null},{reason:'new-journey'});if(!result.ok){savePanel.notifyFailure(result);return;}}
 resetPresentation();mode='play';state=candidate;letterController?.reset();
 if(continued&&raw){try{const old=JSON.parse(raw).player,ground=old&&terrainAt(old.x,old.z);if(ground&&!ground.support){state.player={x:old.x,z:old.z,safe:ground.safe};if(ground.platform)state.bridge.platform=ground.platform;}}catch{}}
 `);
replace("function exitFocus(){storyDirector?.exitBranch();", "function exitFocus(){if(focus==='letter'){letterController.exit();return;}storyDirector?.exitBranch();");
replace("try{localStorage.setItem(SAVE_KEY+':before-letter',serialize(state));}catch{}", "const checkpoint=saveService.commit({beforeLetter:serialize(state)});if(!checkpoint.ok)savePanel.notifyFailure(checkpoint);");
replace('${explorationReply()}</p></div><div class="row"><button id="ending-stay">', '${explorationReply()}</p>${letterRepliesHtml(state.lettersSent||state.letters)}</div><div class="row"><button id="ending-letters">回看我的回信</button><button id="ending-stay">');
replace("$('ending-stay').onclick=closeModal;", "$('ending-letters').onclick=showLetters;$('ending-stay').onclick=closeModal;");
replace("state.ending=null;endingRevealAt=0;", "state.ending=null;state.lettersSent=null;endingRevealAt=0;");
replace("$('begin').onclick=()=>startGame();", "$('begin').onclick=()=>savePanel.confirmNew(()=>startGame());");
replace("$('journal').onclick=()=>showJournal();", "$('journal').onclick=showLetters;");
replace("if(storyDirector.handleKey(e.code)){", "if(letterController?.handleKey(e)){e.preventDefault();return;}\n  if(storyDirector.handleKey(e.code)){");
replace("if(mode==='cover'||mode==='opening')return;e.preventDefault();if(spaceHeld)", "if(mode==='cover'||mode==='opening')return;e.preventDefault();if(focus==='letter'){setPointer(e);canvas.focus({preventScroll:true});if(e.button===0)letterController.pick(raycaster);return;}if(spaceHeld)");
replace("canvas.addEventListener('pointermove',e=>{", "canvas.addEventListener('pointermove',e=>{\n  if(focus==='letter')return;");
replace("if(focus==='flower'||focus==='wind'||focus==='branch'){dash.update", "if(focus==='flower'||focus==='wind'||focus==='branch'||focus==='letter'){dash.update");
replace("held:touchDash||keys.has('ShiftLeft')||keys.has('ShiftRight')", "held:touchDash||keys.has('ShiftLeft')||keys.has('ShiftRight'),recoveryRate:state.letters.entries.rain.choice?1.5:1");
replace("else if(focus==='flower'||mode==='gallery'){lookGoal", `else if(focus==='letter'){
  const bounds=letterController.bounds(),panel=$('letter-panel')?.getBoundingClientRect(),portrait=innerWidth<701;
  const rect=portrait?{left:20,right:innerWidth-20,top:90,bottom:Math.max(260,(panel?.top||innerHeight-310)-16)}:{left:45,right:Math.max(innerWidth*.45,(panel?.left||innerWidth-350)-45),top:100,bottom:innerHeight-70};
  const framed=frameBounds(bounds,{direction:{x:0,y:8.5,z:4.2},fov:48,width:innerWidth,height:innerHeight,rect});cameraGoal.copy(framed.target).add(framed.offset);lookGoal.copy(framed.target);
 }
 else if(focus==='flower'||mode==='gallery'){lookGoal`);
replace("&&focus!=='branch';", "&&focus!=='branch'&&focus!=='letter';");
const auto=" if(!focus&&!resonance?.context.active&&!state.p1.solved&&!autoFlowerEntered&&Math.hypot(state.player.x,state.player.z)<1.65){autoFlowerEntered=true;openFocus('flower');caption('轻触花心。花会换一种方式，留在你身边。',6);}";
replace(auto," // Near-view is deliberate; walking past the flower never steals the camera.");
replace("if(mode==='play')updatePlay(dt);", "if(mode==='play')updatePlay(dt);");
replace("resonanceUI.update({context:resonance.context", "letterController.update(time,dt,{mode,focus,palette:bouquet.palette,reducedMotion:state.settings.reducedMotion,quality:state.settings.quality,challengeActive:!!resonance.context.active});\n document.body.classList.toggle('letter-led',mode==='play'&&!focus&&!state.bridge.solved&&!resonance.context.active);\n resonanceUI.update({forecast:!!state.letters.entries.tide.choice,context:resonance.context");
replace("interactive:mode==='play'&&focus!=='branch'&&focus!=='flower'&&focus!=='wind'", "interactive:mode==='play'&&focus!=='branch'&&focus!=='flower'&&focus!=='wind'&&focus!=='letter'");
replace("world=createWorld();scene.add(world.group);", `world=createWorld();scene.add(world.group);
 savePanel=createSavePanel({service:saveService,openModal,closeModal,getPayload:currentPayload,toast,onLoaded:()=>{state.settings=readPreferences({getItem:storageGet});startGame(true);}});
 letterController=createLetterController({getState:()=>state,onFocus:()=>{clearInput();focus='letter';$('context').hidden=true;document.body.classList.add('focus');},onExit:()=>{focus=null;clearInput();document.body.classList.remove('focus','letter-focus');},onSave:save,onReply:onGardenReply,onSound:()=>audio.note(440,.3,.06,{kind:'cup'}),onBook:showLetters});scene.add(letterController.group);
 `);
replace("'WASD 行走，镜头会跟着你。\\n右前方花巢：走近按 E 开始追风。Shift 踏风加速。'", "'WASD 行走，镜头会跟着你。\\n左岸的听雨春庭，留着第一封未回复的信。'");
replace("resonance:resonance.snapshot(),dash:","resonance:resonance.snapshot(),letters:letterController.snapshot(),saveStatus:{status:saveService.read().status,lastResult:lastSaveResult?{ok:lastSaveResult.ok,code:lastSaveResult.code}:null},dash:");
replace("function showSettings(){", `function showPlayHelp(){openModal('<small>送春人的随身手册</small><h2>先读一封信，再留下一处春天</h2><p>左岸听雨春庭有第一封来信。靠近信台按 E；点叶脉石会顺时针转动，花尘只沿相接的槽走。接通之后，选择要照料的花池。</p><p>近看时：方向键选石，Enter 或 Space 转动，Z 撤销，H 提示，E 回到庭院。转错没有惩罚，离开后也会记住排法。</p><p>漫游：WASD / 方向键行走，Shift 踏风；拖动环看，C 回正。近主花按 E，轻触花心或 F 让花散成花尘，再拖动写风。</p><p>花桥：在石台按住 Space 拖动，沿光迹写路。也可近看花桥，使用辅助归形。种核：靠近花杯或花座按 E 拿起、安放、取回。</p><p>追风是可选挑战：靠近小花巢按 E。信册中可以追踪来信；风庭回信后能乘花尘往返已照料的庭院。</p><div class="row"><button id="help-journal">查看旧日拾光</button><button id="help-save">旅途存档</button></div>');$('help-journal').onclick=()=>showJournal();$('help-save').onclick=()=>savePanel.show();}
function showSettings(){`);
fs.writeFileSync(file,s);
