const fs=require('node:fs');const root='D:/AI Game/spring-letter/';
let h=fs.readFileSync(root+'index.html','utf8');
function rep(a,b){if(!h.includes(a))throw Error('Missing HTML '+a.slice(0,70));h=h.replace(a,b);}
rep('<div id="scene" aria-label="可交互的三维花庭"></div>','<div id="scene" aria-label="可交互的三维花庭"></div><div id="world-guide" aria-hidden="true"></div>');
rep('<p id="bloom-hint">让光从半开的花瓣间，落在水面。</p>','<p id="bloom-hint">轻触花心，让花瓣化作一阵光。</p><div class="flower-life"><span id="flower-cycle-label">花的形体</span><button id="flower-burst">化作花尘 <kbd>F</kbd></button></div>');
rep('<summary>花的形态与材质 <span>＋</span></summary>','<summary>换一朵花，换一种光 <span>＋</span></summary><div class="flower-forms" aria-label="花的形态"><button data-form="lily" class="active" aria-pressed="true"><i class="form-lily"></i><b>百合</b></button><button data-form="lotus" aria-pressed="false"><i class="form-lotus"></i><b>重莲</b></button><button data-form="iris" aria-pressed="false"><i class="form-iris"></i><b>鸢尾</b></button></div>');
const matStart=h.indexOf('<div class="material-row"'),matEnd=h.indexOf('<div class="pair">',matStart);
if(matStart<0||matEnd<0)throw Error('materials missing');
h=h.slice(0,matStart)+'<div class="material-row" aria-label="花的光泽与颜色"><button data-material="silver" class="active" aria-pressed="true"><i></i>月银</button><button data-material="crystal" aria-pressed="false"><i></i>流晶</button><button data-material="lily" aria-pressed="false"><i></i>粉瓷</button><button data-material="amber" aria-pressed="false"><i></i>琥珀</button><button data-material="celadon" aria-pressed="false"><i></i>青釉</button></div>'+h.slice(matEnd);
rep('<button id="scatter" aria-pressed="false">风笔 · 按住运笔</button>','<button id="scatter" aria-pressed="false">旅途风笔</button>');
rep('<p class="wind-mouse-help">不用按鼠标，把指针移到光团后方，轻轻推送。<br>靠近金色花杯时，把指针移远，让光自己停下。</p><p class="wind-touch-help">开启下方风笔，在光团后方按住并拖动，轻轻推送。<br>靠近金色花杯时，抬起手指，让光自己停下。</p><p class="muted">绕过石心，送进远处的金色花杯。外侧路更安稳；内侧路短，等横风变轻再走。</p>', '<p class="wind-mouse-help">按住游光，把它引向远处的花杯。<br>松手，它会缓缓停下。</p><p class="wind-touch-help">按住游光，再慢慢拖向花杯。<br>松手，它会缓缓停下。</p><p class="muted">绕开池中的石心。花杯旁的光环，会接住靠近的游光。</p>');
const finalStart=h.indexOf('  <div id="finale-controls"'),finalEnd=h.indexOf('  <div id="branch-controls"',finalStart);
h=h.slice(0,finalStart)+'  <div id="finale-controls" hidden><p>两枚种核，三座花庭。<br>走近它们，再决定你想照料的未来。</p><p id="allocation"></p><button id="depart" class="primary">回到花庭中 ↗</button><button id="review-letter" class="primary" hidden>回看这封春信 ↗</button><p class="muted">拿起、安放和取回，都只需靠近后点按 E。</p></div>\n'+h.slice(finalEnd);
rep('<span><kbd>拖动</kbd> 环看</span>','<button id="recenter-camera" title="镜头回到角色身后"><kbd>C</kbd> 镜头回正</button>');
rep('<div id="loading"><div class="loading-flower">✳</div><p>正在把春天唤醒<span id="load-status">花、光与水，即将相遇</span></p></div>','<div id="loading" aria-label="花庭正在准备"><span id="load-status">花、光与水，即将相遇</span></div>');
rep('一封写给未来的春信 <small>AN INTERACTIVE POEM</small>','一封写给未来的春信 <small>把风写成一条路</small>');
fs.writeFileSync(root+'index.html',h);
let s=fs.readFileSync(root+'src/main.js','utf8');
function m(a,b){if(!s.includes(a))throw Error('Missing main '+a.slice(0,80));s=s.replace(a,b);}
m("import './style.css';","import './style.css';\nimport './experience-v6.css';\nimport './loading-scene.css';\nimport {mountLoadingScene} from './loading-scene.js';");
m("const clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;","const clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;\nconst loadingScene=mountLoadingScene($('loading'));");
m("strength:0,mode:'weave'","strength:0,mode:'auto'");
m("$('load-status').textContent='正在铺开棚光与浅水';","loadingScene.setStage('assets','正在铺开晨光与浅水');");
m("$('load-status').textContent='正在准备月银、流晶与本色的光泽';","loadingScene.setStage('light','正在准备花瓣与水面的光泽');");
m("$('loading').style.opacity='0';setTimeout(()=>{$('loading').hidden=true;loadingTiming.overlayHiddenMs=performance.now()-loadingStartedAt;},750);","loadingScene.setStage('ready');loadingScene.complete().then(()=>{loadingTiming.overlayHiddenMs=performance.now()-loadingStartedAt;});");
m("}catch(e){console.error(e);errors.push(e.stack||String(e));$('loading').hidden=true;","}catch(e){console.error(e);errors.push(e.stack||String(e));loadingScene.dispose();$('loading').hidden=true;");
const cStart=s.indexOf('function syncCores('),cEnd=s.indexOf('\nfunction depart',cStart);
if(cStart<0||cEnd<0)throw Error('syncCores missing');
s=s.slice(0,cStart)+`function syncCores(){
 $('allocation').textContent=state.cores.map(c=>c?purposes[c]:'尚未安放').join(' · ');
 $('depart').disabled=false;$('depart').hidden=!!state.ending;$('review-letter').hidden=!state.ending;
}`+s.slice(cEnd);
m("state.ending=null;endingRevealAt=0;closeModal();openFocus('finale');save();","state.ending=null;endingRevealAt=0;delivery.restoreCarried(state.deliveryCarried,state);closeModal();exitFocus();caption('回到了启程前。靠近花座，可以把种核重新带走。',6);save();");
fs.writeFileSync(root+'src/main.js',s);
console.log('Integrated interface and loading.');
