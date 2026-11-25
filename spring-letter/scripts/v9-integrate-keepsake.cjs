const fs=require('node:fs');const file='src/main.js';let s=fs.readFileSync(file,'utf8');function change(a,b){if(!s.includes(a))throw Error(a.slice(0,100));s=s.replace(a,b);}
change("import {drawPostcard} from './postcard.js';","import {drawPostcard} from './postcard.js';\nimport {renderMomentKeepsake} from './moment-keepsake.js';\nimport {scorePreviewEvents,startScorePreview} from './score-preview.js';");
change('let loadingScene,letterController,savePanel,playtestFeedback,lastSaveResult=null;','let loadingScene,letterController,savePanel,playtestFeedback,lastSaveResult=null,keepsakePlayback=null;');
change("+l.note+'</p>'+(e.choice?", "+l.note+'</p>'+renderMomentKeepsake(l.id,e)+(l.id==='tide'&&e.edition===2&&scorePreviewEvents(e).length?'<button data-replay-score>听听这封信的春声 ▷</button>':'')+(e.choice?");
change("all('[data-track-letter]').forEach(b=>", "all('[data-replay-score]').forEach(b=>b.onclick=()=>playSavedScore(state.letters.entries.tide,b));\n all('[data-track-letter]').forEach(b=>");
change("return '<p><b>'+l.title+'</b><br>'+l.replies[letters.entries[l.id].choice]+'</p>';", "return '<p><b>'+l.title+'</b><br>'+l.replies[letters.entries[l.id].choice]+'</p>'+renderMomentKeepsake(l.id,letters.entries[l.id]);");
change('function clearInput(){letterController?.cancel?.();','function clearInput(){stopSavedScore();letterController?.cancel?.();');
change("function closeModal(){if($('modal').open)","function closeModal(){stopSavedScore();if($('modal').open)");
const anchor='function showLetters(){';
change(anchor,`function stopSavedScore(){if(keepsakePlayback){const stop=keepsakePlayback;keepsakePlayback=null;stop();}}
function playSavedScore(entry,button){
 if(keepsakePlayback){stopSavedScore();return;}if(state.settings.muted){toast('声音现在关闭了。先用右上角的声音开关，再听听这封信。');return;}
 const events=scorePreviewEvents(entry);if(!events.length)return;const label=button.textContent;audio.unlock();audio.pause(false);button.textContent='停一停 ■';button.setAttribute('aria-pressed','true');
 keepsakePlayback=startScorePreview(events,{play:e=>audio.event('compose-note',e),onBeat:beat=>button.parentElement?.querySelectorAll('[data-keepsake-beat]').forEach(g=>g.classList.toggle('sounding',Number(g.dataset.keepsakeBeat)===beat)),onEnd:()=>{button.textContent=label;button.setAttribute('aria-pressed','false');keepsakePlayback=null;audio.pause(true);if(!modalPaused&&!hidden)audio.pause(false);}});
}
`+anchor);
fs.writeFileSync(file,s);
