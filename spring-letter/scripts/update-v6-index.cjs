const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {assertWorkWindow,boundReport,assertPublishedArtifacts,assertCaptures}=require('./v6-release-evidence.cjs');
function updateIndex(){
const root=path.resolve(__dirname,'..'),docs=path.resolve(root,'../docs/blossom'),source=path.join(docs,'tools/v6-index.html');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'evidence/release-manifest-v6.json'))),ui=JSON.parse(fs.readFileSync(path.join(root,'evidence/v6-interface.json'))),media=JSON.parse(fs.readFileSync(path.join(root,'evidence/v6-media-decoding.json'))),pack=JSON.parse(fs.readFileSync(path.join(root,'evidence/v6-package-verification.json')));
const record=boundReport(root,manifest,'v6-recording-verification.json'),main=boundReport(root,manifest,'v6-main-play.json');
boundReport(root,manifest,'v6-interface.json');boundReport(root,manifest,'v6-media-decoding.json');
assertWorkWindow(manifest.workWindow);assertPublishedArtifacts(root,manifest,{pack,media,record});assert.equal(ui.passed,true);
assertCaptures(ui,['v6-interface-02-silver.png','v6-interface-03-first-drift.png','v6-interface-portrait-default.png']);
assertCaptures(record,['v6-record-03-flower-close.png']);assertCaptures(main,['v6-main-03-first-bridge.png','v6-main-05-memory-planted.png']);
for(const file of ['v6-interface-02-silver.png','v6-interface-03-first-drift.png','v6-interface-portrait-default.png','v6-record-03-flower-close.png',media.file])assert.ok(fs.existsSync(path.join(root,'evidence',file)),file);
assert.ok(fs.existsSync(path.join(root,pack.file)));assert.ok(fs.existsSync(path.join(docs,'v6-release-verification.md')));
const verification=fs.readFileSync(path.join(docs,'v6-release-verification.md'),'utf8');assert.ok(verification.includes(manifest.build)&&verification.includes(manifest.styleBuild),'QA page is stale');
const html=renderIndex(fs.readFileSync(source,'utf8'),{manifest,media,pack});
fs.writeFileSync(source,html);console.log(JSON.stringify({updated:source,build:manifest.build,videoSeconds:Math.round(media.lastTimestampSeconds)}));
}
function renderIndex(html,{manifest,media,pack}){
html=html.replaceAll('v6-candidate-b-gallery.png','v6-interface-02-silver.png').replaceAll('v6-candidate-b-drift.png','v6-interface-03-first-drift.png').replaceAll('v6-candidate-b-touch-gallery.png','v6-interface-portrait-default.png').replaceAll('候选 B · 游戏画廊实际截图','最终构建 · 游戏画廊实际截图').replaceAll('候选 B · 触屏仿真实际截图','最终构建 · 触屏仿真实际截图').replaceAll('候选B','最终构建');
html=html.replaceAll('v6-candidate-b-ui.json','v6-interface.json').replaceAll('候选 B 画廊与触屏记录','最终构建画廊与触屏记录').replace(/v6-build-candidate-[a-z]+\.json/g,'v6-build-'+manifest.candidate+'.json').replaceAll('候选 B 源文件与构建标识','最终源文件与构建标识');
const duration=Math.round(media.lastTimestampSeconds),clock=`${Math.floor(duration/60)}分${String(duration%60).padStart(2,'0')}秒`;
const section=`<section id="release" class="wrap section"><div class="section-head"><div><div class="eyebrow">0.4.0 · 可玩章节</div><h2>亲手寄出，<br>这一封春信。</h2></div><p>从完整引言走到一次明确选择的结局。下面是本轮最终构建的连续实录，${clock}，未剪辑、未加速；录像未录入声音，游戏内的合成声音可在实际游玩时体验。</p></div><video controls preload="none" poster="../../spring-letter/evidence/v6-record-03-flower-close.png" style="display:block;width:100%;background:#14121e;aspect-ratio:8/5" aria-label="花漾年华0.4完整引言至结局的无声连续实录"><source src="../../spring-letter/evidence/${media.file}" type="video/webm"></video><div class="v6-actions"><a class="action" href="http://127.0.0.1:5192/">进入本机花庭 ↗</a><a class="action" href="../../spring-letter/${pack.file}" download>保存 0.4.0 本地包 ↓</a><a class="action" href="v6-release-verification.html">查看最终验证与边界 ↗</a></div><p class="v6-fine">本地包需要已有 Node.js；解压后双击「启动春信.cmd」。页面仍开着旧版时请刷新。游戏资源均在本地，无需付费账户或外部生成服务。</p></section>\n\n`;
assert.ok(html.includes('<section id="library"'),'missing evidence library insertion point');
html=html.replace(/<section id="release"[\s\S]*?(?=<section id="library")/,'');
html=html.replace('<section id="library"',section+'<section id="library"');
for(const [file,label] of [['v6-release-verification','最终验证、实录与发行包'],['v6-retained-content-verification','保留支线与探索庭'],['v6-visual-boundaries','原片与本作的视觉边界'],['v6-production-notes','本轮制作复盘']]){
 const item=`<li><a href="${file}.html">${label} ↗</a></li>`;if(!html.includes(item))html=html.replace('<li><a href="../../spring-letter/evidence/v6-interface.json">',item+'<li><a href="../../spring-letter/evidence/v6-interface.json">');
}
html=html.replace('本页不预报最终通过数，不把旧版录像当成本轮记录。完整发行包、连续录像和最终验收以完成后的实际文件为准；本机运行与外部公开部署也分别处理。','本页使用最终构建实机图，并明确标记隔离实验与原片。主线、支线、触屏仿真、持续运行、连续实录、解压启动与实际资源散列分别有记录；当前提供本机运行入口，没有进行外部公开部署。');
return html;
}
if(require.main===module)updateIndex();
module.exports={renderIndex};
