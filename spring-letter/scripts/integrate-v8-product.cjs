const fs=require('node:fs');let s=fs.readFileSync('src/main.js','utf8');
const a=s.indexOf('function depart(){'),b=s.indexOf('function showEnding(){',a);if(a<0||b<0)throw Error('depart anchors');
s=s.slice(0,a)+`function depart(){
 const before=serialize(state),candidate=structuredClone(state),result=commitLetter(candidate);if(!result.ok){toast(result.reason);return;}
 const saved=saveService.commit({journey:serialize(candidate),beforeLetter:before,preferences:JSON.stringify(state.settings),resonance:resonance.persist()});
 lastSaveResult=saved;if(!saved.ok){savePanel.notifyFailure(saved);savePanel.show();return;}
 state=candidate;exitFocus();audio.chime();storyDirector.playFarewell();caption('花庭记住了你的来信。\\n新的安排，会从你放下种核的地方慢慢发生。',10);endingRevealAt=time+7.2;
}
`+s.slice(b);
const aboutStart=s.indexOf("$('about').onclick=()=>"),aboutEnd=s.indexOf('\n}',aboutStart);
if(aboutStart<0||aboutEnd<0)throw Error('about');
s=s.slice(0,aboutStart)+`$('about').onclick=()=>{openModal('<small>SPRING LETTER · 0.6 来信之庭</small><h2>一封信，一处新生活</h2><p>弥是一位新醒来的送春者。岑留下三封没有回复的旧来信，你用花尘接通叶脉，为尚未抵达的人照料庭院。</p><p>游戏在本机运行，进度保存在当前浏览器。没有账号、内购或联网收集。配乐使用七种免费许可真实乐器采样演奏原创乐段；场景、角色、花朵和机关为程序造型。</p><p>乐器：VSCO 2 Community Edition，Sam Gossner、Simon Dalzell；采样编辑 Elan Hickler / Soundemote（CC0）。环境与表面：Poly Haven，Sergej Majboroda、Greg Zaal、Rob Tuytel、Amal Kumar（CC0）。运行库：Three.js、Vite。</p><p>视觉研究参考用户提供的 ShiningBlossom 与 3D粒子效果。玩法研究包括 Flower、A Short Hike 与 SEASON 的公开创作资料。借鉴设计方法，没有打包它们的角色、音乐、模型或画面。</p><p><a href="/ASSET_SOURCES.md" target="_blank" rel="noopener">逐项素材来源</a> · <a href="/THIRD_PARTY_LICENSES.txt" target="_blank" rel="noopener">完整许可与鸣谢</a></p><p class="muted">当前是可独立游玩的艺术探索章节。商业表现、真实玩家接受度和更多设备的表现，仍需实际试玩验证。</p>');};`+s.slice(aboutEnd);
s=s.replace("if($('travel-home'))$('travel-home').onclick=()=>travelToLetter('home');","if($('travel-home'))$('travel-home').onclick=()=>travelToLetter('home');");
fs.writeFileSync('src/main.js',s);
let html=fs.readFileSync('index.html','utf8').replace('风起之时 · 追风，奏响，送春','来信之庭 · 为后来的人，留一处春天').replace('四幕远行 · 三庭追风 · 花与和声','三封来信 · 叶脉解谜 · 四幕远行').replace('id="journal">拾光册','id="journal">来信册').replace('有人把整个故乡，藏进一朵花。<br>而你，要让它再次拥有春天。','三封旧来信，还没有等到回复。<br>你让一朵花散作春风，替远方的人照料故乡。');
fs.writeFileSync('index.html',html);const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.version='0.6.0';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');
