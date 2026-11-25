const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {assertWorkWindow,boundReport,assertPublishedArtifacts}=require('./v6-release-evidence.cjs');
const root=path.resolve(__dirname,'..'),e=path.join(root,'evidence');
const read=n=>JSON.parse(fs.readFileSync(path.join(e,n),'utf8'));
const manifest=read('release-manifest-v6.json'),soak=read('v6-soak.json'),record=read('v6-recording-verification.json'),media=read('v6-media-decoding.json'),pack=read('v6-package-verification.json'),served=read('v6-served-files.json'),ui=read('v6-interface.json');
assert.ok(pack.extractedRuntime?.passed&&served.passed&&media.passed&&soak.passed&&record.success&&ui.passed);
assertWorkWindow(manifest.workWindow);assertPublishedArtifacts(root,manifest,{pack,media,record,served});
const reports=[['主路与三种结局','v6-main-play.json'],['主/支风中断与多指取消','v6-seed-cancellation.json'],['竖屏终庭与原生旧存档','v6-seeds-mobile-delivery.json'],['三条物件叙事支线','v6-branches-play.json'],['雨潮探索与主路衔接','v6-exploration-play.json'],['花形、系列、全屏、镜头及触屏','v6-interface.json'],['持续运行','v6-soak.json'],['完整引言至首个结局的实录','v6-recording-verification.json']];
for(const [,file]of reports){const r=boundReport(root,manifest,file);assert.ok(!r.failure&&r.errors.length===0);assert.ok(r.checks?.length&&r.checks.every(c=>typeof c==='string'||c.passed===true));}
boundReport(root,manifest,'v6-media-decoding.json');boundReport(root,manifest,'v6-flower-leave-fixed.json');
const median=values=>values.slice().sort((a,b)=>a-b)[Math.floor(values.length/2)],seconds=n=>(n/1000).toFixed(1);
function render(prefix){
 const link=(label,file)=>`[${label}](${prefix}evidence/${file})`;
 return `# 花漾年华：待寄出的春信 0.4.0 · 最终验证\n\n`+
 `首段连续制作为 2026-11-19 14:44:55–17:49:45（上海；06:44:55–09:49:45 UTC），已超过 3 小时。17:50 中断，19:18 恢复；从首段结束到恢复时首次时钟记录 19:18:23 的空档均不计制作时间。发行清单记录的制作时段合计 ${(manifest.workWindow.activeWorkMs/3600000).toFixed(2)} 小时，开始至本次发行核对的墙钟跨度为 ${(manifest.workWindow.wallClockElapsedMs/3600000).toFixed(2)} 小时，两者分别记录。时段记录不是键盘活动计时。独立主题，与金沙项目无关。验证在隔离浏览器上下文执行，未改写用户正在游玩的存档。\n\n`+
 `实际发行入口：\`${manifest.build}\`；样式：\`${manifest.styleBuild}\`。${link('发行标识与文件散列','release-manifest-v6.json')}。固定候选构建后没有重新生成另一套未测游戏文件。\n\n`+
 `## 本轮落地\n\n`+
 `三幅原创情景加载画与分层轮播、真实准备阶段；随行镜头、手动环看与回正；四花型五系列共享实体/花尘颜色；破开、写风漂游、自动慢归形；流晶可见度修订；第一幕离场后照常结算；主/支风统一按住牵引与主动松手；终庭点按拿取、携带存档、种植、取回、寄出摘要；窄屏取景、标签与字幕间距；初庭留白、岸线和灯/芽/帆的场景辨识。四幕、六镜、三条物件支线、三座探索庭与三种结局继续保留，并非全部是本轮新增。\n\n`+
 `## 实际操作与规则检查\n\n`+
 `|范围|结果|原始证据|\n|---|---|---|\n`+
 reports.map(([title,file])=>`|${title}|${read(file).checks.length} 项完成，错误记录为空|${link('报告',file)}|`).join('\n')+`\n\n`+
 `另有 ${manifest.checks.units} 项 Node 检查通过，其中包括验证工具自身的反例测试；10,000 份确定性存档恢复探针全部通过。测试数量不等于美术质量。首花边界有先失败后修复的普通输入证据：${link('D 离开后未解锁','v6-candidate-d/v6-flower-leave-before-return.json')} → ${link('最终构建离开后自然解锁','v6-flower-leave-fixed.json')}。\n\n`+
 `## 持续运行与启动\n\n`+
 `本机设备：${soak.device}。持续 ${(soak.elapsedMs/60000).toFixed(2)} 分钟，${soak.rounds} 轮，${soak.phases.length} 段稳态采样。每轮以真实控件切换四形×五系列、反复打散归形、环看缩放、切换 65,536/16,384 粒子、静音与暂停后继续。\n\n`+
 `稳态各段平均帧间隔的中位数为 ${median(soak.phases.map(p=>p.averageMs)).toFixed(2)} ms；各段 P95 范围 ${Math.min(...soak.phases.map(p=>p.p95Ms)).toFixed(2)}–${Math.max(...soak.phases.map(p=>p.p95Ms)).toFixed(2)} ms；稳态最大单帧间隔 ${Math.max(...soak.phases.map(p=>p.maxMs)).toFixed(2)} ms。切换窗口单列，最大 ${Math.max(...soak.transitions.map(p=>p.maxMs)).toFixed(2)} ms。以上为同一共享桌面机器的 RAF 间隔，不是 GPU 定时查询，也不是隔离硬件实验室数据，不能当成所有机型的帧率承诺。\n\n`+
 `资源检查以完整首轮暖机后的固定状态为基线，比较以后所有同状态样本，并拒绝逐轮上升趋势；不靠“最后三次看起来接近”推断稳定。每段必须有新渲染帧，暂停则实际停帧并清除前景声音。${link('完整计数、范围及局限','v6-soak.json')}；这仍不是显存泄漏的数学证明。\n\n`+
 `最终界面复核这次的加载准备 ${seconds(ui.loading.totalMs)} 秒，其中光影准备 ${seconds(ui.loading.warmupMs)} 秒。历史独立实验在实际后处理目标上预热，约 32–33 秒降到 16–17 秒；该实验的首次换流晶为几十毫秒量级，删掉其他系列预热的对照则首次换晶约 2.4 秒，故舍弃。此段历史实验不是最终构建的首交互帧时结果；最终构建只以本页绑定报告为准。没有清除驱动缓存，不宣称全新驱动冷启动测试。实际耗时依设备与缓存变化。\n\n`+
 `## 实录、分发与本机入口\n\n`+
 `${link('无剪辑、无声实录',record.file)}：全六镜自动引言、首花、风廊、两段实绘桥、两枚种核及一次明确确认的结局。录像没有注入进度或替换帧；另外的主线回归覆盖三种结局。独立完整解码 ${media.decodedFrames} 帧，${media.dimensions.join('×')}，末帧时间 ${media.lastTimestampSeconds.toFixed(2)} 秒，时间戳严格递增；录像没有音轨，不能拿它评价游戏合成声音。${link('解码记录','v6-media-decoding.json')}。\n\n`+
 `发行包包含 ${pack.members} 个文件，CRC 与当前发行散列一致；真实解压到中文目录，启动包内 Node 服务并逐个核验 ${pack.extractedRuntime.filesVerified} 个 HTTP 资源。当前本机入口也核验了全部 ${served.files.length} 个文件。${link('打包与解压记录','v6-package-verification.json')} · ${link('实际服务核对','v6-served-files.json')}。ZIP 需要本机已有 Node.js，无付费接口、账户或外部运行服务。\n\n`+
 `## 明确的边界\n\n`+
 `这是风格化浏览器可玩章节。流晶厚度与内部折射、原片粒子折叠纱面感、石材与角色表现、长期玩法深度仍有差距；四花型目前主要改变观感。未进行实体手机、跨 GPU 或外部新玩家盲测，触控报告是浏览器仿真。参考视频有全帧解码联系表与关键帧放大，不宣称每帧原尺寸逐一审阅或完全复刻。电影感与商业 AAA 规模不由制作时长、截图或检查数量证明。\n`;
}
fs.writeFileSync(path.join(root,'FINAL_QA.md'),render(''));
fs.writeFileSync(path.resolve(root,'../docs/blossom/v6-release-verification.md'),render('../../spring-letter/'));
console.log(JSON.stringify({written:['FINAL_QA.md','docs/blossom/v6-release-verification.md'],build:manifest.build}));

