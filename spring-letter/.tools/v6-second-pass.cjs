// Apply only between browser review windows, so Vite cannot reset a live test.
const fs=require('node:fs'),root='D:/AI Game/spring-letter/';let s=fs.readFileSync(root+'src/main.js','utf8');
function rep(a,b){if(!s.includes(a))throw Error('Missing marker '+a.slice(0,90));s=s.replace(a,b);}
rep("leaf:['半开的光','完全开放的花很美，却留不住一束方向。花开到一半时，光能从瓣间穿过，照见水下的旧路。']", "leaf:['归来的花','花尘散开以后，仍记得每一片花瓣的位置。你写下的风停了，光却没有离开。它回到花里，也落进了水下的路。']");
rep("label:'半开的故乡'","label:'让春风经过'");
rep('<small>AN ATLAS OF UNSENT SPRING</small>','<small>一路走来的地方</small>');
rep('<small>COLLECTED LIGHT · ${ids.length} / 4</small>','<small>旅途中留下的回声</small>');
rep('<small>MAKE ROOM FOR YOUR OWN PACE</small>','<small>行走与声音</small>');
rep('<small>YOUR LETTER HAS FOUND A WIND</small>','<small>春信已经启程</small>');
rep("const checkpoint=restore(old);state=", "const checkpoint=restore(old),preferences={...state.settings};state=");
rep('state.ending=null;endingRevealAt=0;delivery.restoreCarried','state.settings=preferences;state.ending=null;endingRevealAt=0;delivery.restoreCarried');
rep("const visible=mode==='play'&&!focus&&!!c;", "const visible=mode==='play'&&!focus&&!!c&&(!delivery.context||!['walk','carry'].includes(c.kind));");
rep("const action=delivery.context?.actionLabel;", "const action=delivery.context?(['take','plant','lift','send'].includes(delivery.context.kind)?delivery.context.actionLabel:'查看指引'):null;");
rep('let flowerForm=', 'let chapterNoticeUntil=0,lastChapter=-1;\nlet flowerForm=');
rep("function updateUI(){if(mode!=='play')return;const act=", "function updateUI(){if(mode!=='play')return;const act=");
rep("const titles=['让春风经过'", "if(act!==lastChapter){lastChapter=act;chapterNoticeUntil=time+9;}document.body.classList.toggle('chapter-notice',time<chapterNoticeUntil);const titles=['让春风经过'");
rep('autoFlowerEntered=state.p1.solved;', 'autoFlowerEntered=state.p1.solved;lastChapter=-1;');
fs.writeFileSync(root+'src/main.js',s);
let story=fs.readFileSync(root+'src/story-content.js','utf8');story=story.replace('先让眼前这朵花透进光。水下那条旧路，通向尚未寄出的信。','这朵花还记得风。你走近时，水下的旧路也仿佛轻轻亮了一下。').replace("target:[0,1,3.7],bloom:.12,scatter:0", "target:[0,1,3.7],bloom:.82,scatter:0").replace('它会避开持续的推力，也会在你留出余地时靠近。','它会追随轻轻的牵引，也会在你留出余地时靠近。');fs.writeFileSync(root+'src/story-content.js',story);
let lesson=fs.readFileSync(root+'src/flower-lesson.js','utf8');lesson=lesson.replace("if(!state.p1.broken||phase==='solid')return", "if(phase==='solid'&&state.p1.broken&&(state.p1.ink||0)<1.2)return '花已归来。再触碰花心，随后按住拖动，给花尘留下一笔风。';\n if(!state.p1.broken||phase==='solid')return");fs.writeFileSync(root+'src/flower-lesson.js',lesson);
fs.appendFileSync(root+'src/experience-v6.css',`\n/* Only a nearby action needs a card; wandering leaves room for the place. */
.play:not(.focus) #hud{background:transparent;box-shadow:none;backdrop-filter:none;border:0;padding:0;width:280px;transition:opacity .7s}
.play:not(.focus) #hud .chapter{gap:13px}
.play:not(.focus) #act-number{font-size:29px;opacity:.65}
.play:not(.focus) #act-title{font-size:19px;line-height:1.5}
.play:not(.focus) #act-eyebrow{display:none}
.play:not(.focus):not(.chapter-notice) #hud #objective,.play:not(.focus):not(.chapter-notice) #hud .progress-line{display:none}
.play:not(.focus):not(.chapter-notice) #hud{opacity:.76}
.play #field-action{background:linear-gradient(90deg,#f7eee8e6,#f7eee8b0);border:0;box-shadow:none;border-left:2px solid #ba8f9c88;max-width:270px;padding:14px 18px}
.play #field-title{font-size:17px}.play #field-hint{font-size:12px;line-height:1.8}
.play #controls{gap:20px}.play #controls button{min-height:34px}
.play #caption{font-size:15px;letter-spacing:1px}
@media(max-width:700px){.play:not(.focus) #hud{width:220px}.play:not(.focus) #act-title{font-size:16px}.play:not(.focus) #act-number{font-size:24px}.play #field-action{max-width:240px;padding:10px 13px}.play #field-title{font-size:14px}.play #field-hint{font-size:11px}.play #controls{gap:9px}}
`);
console.log('Second-pass narrative, preferences and contextual UI applied.');
