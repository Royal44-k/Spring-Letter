const fs=require('node:fs');let s=fs.readFileSync('src/main.js','utf8');
function replace(a,b){if(!s.includes(a))throw Error('anchor '+a.slice(0,80));s=s.replace(a,b);}
replace("import {createSavePanel} from './save-panel.js';","import {createSavePanel} from './save-panel.js';\nimport {createPlaytestFeedback} from './playtest-feedback.js';");
replace('let loadingScene,letterController,savePanel,','let loadingScene,letterController,savePanel,playtestFeedback,');
replace("function releaseFlower(){\n", "function releaseFlower(){\n if(focus==='letter'){letterController.burst();return;}\n");
replace("onSound:(kind,payload)=>audio.event?.('letter-'+kind,payload)","onSound:(kind,payload)=>audio.event?.(kind==='source'?'burst':'letter-'+kind,payload)");
replace("<button id=\"help-play\">行走手册</button>","<button id=\"help-play\">行走手册</button><button id=\"playtest-feedback\">留下试玩感受</button>");
replace("$('help-play').onclick=showPlayHelp;", "$('help-play').onclick=showPlayHelp;$('playtest-feedback').onclick=()=>playtestFeedback.show();");
replace('<button id="ending-letters">回看我的回信</button>', '<button id="ending-feedback">留下试玩感受</button><button id="ending-letters">回看我的回信</button>');
replace("$('ending-letters').onclick=showLetters;", "$('ending-feedback').onclick=()=>playtestFeedback.show();$('ending-letters').onclick=showLetters;");
replace(' letterController=createLetterController(', ` playtestFeedback=createPlaytestFeedback({openModal,closeModal,toast,getSummary:()=>({version:'0.6.0',playedSeconds:state.playedSeconds||0,letters:completedLetters(state.letters).map(l=>l.id),chapter:state.ending?4:state.bridge.solved?3:state.wind.solved?2:state.p1.solved?1:0,ending:state.ending,quality:state.settings.quality,viewport:{width:innerWidth,height:innerHeight}})});
 letterController=createLetterController(`);
fs.writeFileSync('src/main.js',s);
