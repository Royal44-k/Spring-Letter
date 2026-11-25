const fs=require('node:fs');let s=fs.readFileSync('src/main.js','utf8');const start=s.indexOf("$('ending-rewind').onclick=()=>"),end=s.indexOf('\nfunction updateUI',start);if(start<0||end<0)throw Error('rewind anchors');s=s.slice(0,start)+"$('ending-rewind').onclick=rewindLetter;}"+s.slice(end);
s=s.replace('function showEnding(){',`function rewindLetter(){
 const checkpoint=restore(storageGet(SAVE_KEY+':before-letter')),candidate=checkpoint.bridge.solved?checkpoint:restore(serialize({...state,ending:null}));
 candidate.settings={...state.settings};candidate.ending=null;candidate.lettersSent=null;
 const result=saveService.commit({journey:serialize(candidate),preferences:JSON.stringify(candidate.settings),resonance:resonance.persist()});lastSaveResult=result;
 if(!result.ok){savePanel.notifyFailure(result);savePanel.show();return;}
 state=candidate;endingRevealAt=0;delivery.restoreCarried(state.deliveryCarried,state);closeModal();exitFocus();caption('回到了启程前。靠近花座，可以把种核重新带走。',6);
}
function showEnding(){`);fs.writeFileSync('src/main.js',s);
