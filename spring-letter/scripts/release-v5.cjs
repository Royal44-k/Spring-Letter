// Produce a provenance-aware release report only after the named checks pass.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const evidence = path.join(root, 'evidence');
const read = name => JSON.parse(fs.readFileSync(path.join(evidence, name), 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]).sort();
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const names = {
  main: 'v5-main-play.json', branches: 'v5-branches-play.json',
  boundary: 'v5-boundary-verification.json', visual: 'v5-visual-verification.json',
  fullscreen: 'fullscreen-verification.json', audio: 'audio-verification.json',
  recording: 'v5-recording-verification.json', soak: 'v5-soak.json', guards: 'v5-release-guards.json',
  exploration: 'v5-exploration-play.json', touch: 'v5-exploration-access.json',
  revisit: 'v5-exploration-revisit.json', mobileUI: 'v5-exploration-ui.json', finalRevisit: 'v5-final-revisit.json',
};
const reports = Object.fromEntries(Object.entries(names).map(([key, file]) => [key, read(file)]));
const reportBuild = report => typeof report.build === 'string' ? report.build
  : report.build?.finalEntry || report.build?.entry || (typeof report.entry === 'string' ? report.entry : report.entry?.build);
const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const build = html.match(/src="([^"]+\.js)"/)?.[1];
assert.ok(build, 'dist must contain a built module');
const startup = read('v5-startup.json');
assert.equal(startup.build, build); assert.equal(startup.errors.length, 0);
const startupFinal = startup.phases.at(-1).snapshot;
assert.ok(startupFinal.loadingTiming.totalMs > 0 && startupFinal.loadingTiming.warmupMs > 0);
for (const [key, report] of Object.entries(reports)) {
  assert.ok(report.checks?.length, `${key} has no completed checks`);
  assert.ok(!report.failure && report.passed !== false, `${key} failed`);
  assert.equal(report.errors?.length || 0, 0, `${key} contains errors`);
  assert.equal(report.pageErrors?.length || 0, 0, `${key} contains page errors`);
  assert.ok(report.checks.every(check => typeof check === 'string' || check.passed === true));
}
// The older exploration and isolated soak reports remain explicitly labelled.
for (const key of ['main', 'branches', 'boundary', 'visual', 'recording', 'fullscreen', 'finalRevisit', 'mobileUI']) {
  const actual = reportBuild(reports[key]);
  assert.equal(actual, build, `${key} was not run against the release module`);
  // A historical mid-run fix can have two entries. Neither may be promoted as
  // a whole final-build run merely because its last revisit used the new one.
  if (reports[key].build && typeof reports[key].build === 'object') {
    for (const field of ['entry', 'finalEntry']) {
      if (reports[key].build[field]) assert.equal(reports[key].build[field], build, `${key}.${field} is a mixed-build run`);
    }
  }
}
assert.ok(reports.soak.passed && reports.soak.elapsedMs >= 45 * 60000);
assert.ok(reports.recording.uncut === true && reports.recording.audioRecorded === false);
assert.equal(reports.finalRevisit.sourceSaveSha256, hash(path.join(evidence, 'v5-record-real-play-storage.json')), 'portrait revisit must identify the exact earned recording save');
assert.equal(reports.audio.source.sha256, hash(path.join(root, 'src/audio.js')));
for (const file of ['scripts/serve.cjs', 'scripts/release-v5.cjs', 'scripts/verify-release-guards.cjs']) assert.equal(reports.guards.sourceSha256[file], hash(path.join(root, file)), 'release guard changed: ' + file);
const licenses = fs.readFileSync(path.join(root, 'dist/THIRD_PARTY_LICENSES.txt'), 'utf8');
for (const required of ['The MIT License', 'three.js authors', 'Studio Small 09', 'White Plaster 02', 'Spruit Sunrise', 'Mossy Rock']) assert.ok(licenses.includes(required), `missing distributed notice: ${required}`);
const fuzzFile = path.resolve(root, '../docs/blossom/v5-restore-fuzz-final.json');
const fuzz = JSON.parse(fs.readFileSync(fuzzFile, 'utf8'));
assert.equal(fuzz.samples, 10000); assert.equal(fuzz.passed, 10000); assert.equal(fuzz.failed, 0);
assert.equal(fuzz.sourceSha256['game-model.js'], hash(path.join(root, 'src/game-model.js')));
const units = fs.readFileSync(path.join(evidence, 'unit-verification-v5.txt'), 'utf8');
const unitCount = Number(units.match(/tests\s+(\d+)/)?.[1]);
const unitPass = Number(units.match(/pass\s+(\d+)/)?.[1]);
assert.ok(unitCount && unitCount === unitPass, 'unit verification incomplete');
const files = walk(path.join(root, 'dist')).map(file => ({ file: rel(file), bytes: fs.statSync(file).size, sha256: hash(file) }));
const served = read('v5-served-files.json');
assert.equal(served.passed, true); assert.equal(served.files.length, files.length);
for (const entry of files) assert.ok(served.files.some(file => 'dist/' + file.file === entry.file && file.sha256 === entry.sha256), `served release mismatch: ${entry.file}`);
const sourceFiles = ['src', 'tests', 'scripts'].flatMap(dir => walk(path.join(root, dir)))
  .concat(['index.html', 'package.json', 'package-lock.json', 'README.md', 'ASSET_SOURCES.md', 'THIRD_PARTY_LICENSES.txt', '启动春信.cmd'].map(file => path.join(root, file)))
  .filter(file => !/\.py[co]$/.test(file))
  .map(file => ({ file: rel(file), sha256: hash(file) }));
const manifest = {
  version: JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).version,
  date: new Date().toISOString(), build, sourceFiles, dist: files,
  runtimeFiles: sourceFiles.filter(file => ['scripts/serve.cjs', '启动春信.cmd', 'THIRD_PARTY_LICENSES.txt'].includes(file.file)),
  totalBytes: files.reduce((total, file) => total + file.bytes, 0),
  checks: { units: unitCount, ...Object.fromEntries(Object.entries(reports).map(([key, report]) => [key, report.checks.length])) },
  provenance: Object.fromEntries(Object.entries(reports).map(([key, report]) => [key, { date: report.date || report.generatedAt, build: reportBuild(report) || null, scope: report.scope }])),
  evidence: Object.values(names).map(file => ({ file, sha256: hash(path.join(evidence, file)) })),
  restoreFuzz: { file: rel(fuzzFile), sha256: hash(fuzzFile), samples: fuzz.samples, passed: fuzz.passed },
  startup: { file: 'v5-startup.json', sha256: hash(path.join(evidence, 'v5-startup.json')), build: startup.build },
  served: { file: 'v5-served-files.json', sha256: hash(path.join(evidence, 'v5-served-files.json')), files: served.files.length },
  limitations: ['The 45-minute GPU soak preceded a strict type/own-key save validation fix, device-specific instruction copy, separation of startup timing from the first animation frame, moving reflection warmup under the loading overlay, integrating brush speed before clamping, retaining the Space chord across range focus, reducing hero wind-trail brightness, and moving the decorative crown beyond the portrait farewell camera, and consuming the compatibility click of a completed hold; its original build is retained.', 'Exploration/touch/revisit reports are earlier v5 candidates and are labelled with their original build.', 'Headless Edge on one integrated AMD device is not multi-device, real-phone or final audio listening validation.'],
};
fs.writeFileSync(path.join(evidence, 'release-manifest-v5.json'), JSON.stringify(manifest, null, 2));
const all = reports.soak.phases;
const phaseRows = [...new Set(all.map(p => p.name))].map(name => {
  const phases = all.filter(p => p.name === name);
  const count = phases.reduce((sum, p) => sum + p.frames, 0);
  const average = phases.reduce((sum, p) => sum + p.averageMs * p.frames, 0) / count;
  return `|${name}|${phases.length}|${average.toFixed(2)}|${Math.max(...phases.map(p => p.maxMs)).toFixed(2)}|`;
}).join('\n');
const count = key => reports[key].checks.length;
const prior = path.join(root, 'FINAL_QA.md');
if (fs.existsSync(prior) && !fs.existsSync(path.join(root, 'FINAL_QA-v02.md'))) fs.copyFileSync(prior, path.join(root, 'FINAL_QA-v02.md'));
const text = `# 花漾年华：待寄出的春信 · v0.3 验收

2026-11-19。独立可玩章节，设计与制作版本 v5。发行模块 **${build}**；${files.length} 个本地文件，${manifest.totalBytes.toLocaleString('en-US')} 字节。完整来源、版本和散列见 [发行清单](evidence/release-manifest-v5.json)。全部发行文件已从实际本机服务取回并逐字节核对；构建仍提示 Three.js 单个合包超过 500KB，该提示没有被隐藏。

## 本轮交付

连续空间探索、360° 拖动环看与随角色移动的镜头；缓慢引风开花、快速笔势散瓣、自然回流；保留花表面身份的双色花尘、弧形花瓣流和细丝。主线以走近、引风、手绘两段花桥、携带两枚种核并选择栽植位置推进。取消“点一下归位”的核心交互；参数面板收为可选的观花工作台。

雨庭画环、风庭过门送种、潮庭走近聆听新增三条空间支线；原有杯声作曲、三处碑文、旧花两种年份仍可操作。角色弥、游絮、岑通过引言、场景证据和最终回信进入故事。终章在世界中停留约 7.2 秒，播放玩家杯曲与游絮的回应，再呈现信件。全屏、暂停、静音、低动态、触屏和本地存档保留。

美术包括原创地形、支路和植物群、可行走坡道、披风角色、晨雾、平面水面反射、接触遮蔽、独立花体环境光和古石微表面。新增 CC0 天空与石材已核对官方元数据、文件散列并实际解码。没有采购素材、调用付费生成接口或公开部署。

## 检查

|检查|通过项目|证据范围|
|---|---:|---|
|单元、几何、规则与恢复|${unitCount}|源码测试输出|
|最终包主线|${count('main')}|普通键鼠；手绘桥、搬种、三种合法结局|
|最终包原有支线与告别|${count('branches')}|作曲、碑文、旧花、真实杯音顺序、结尾重看|
|最终包边界|${count('boundary')}|损坏/禁用存储、模拟失焦、低档粒子、Esc、上下文丢失、触屏仿真|
|最终包视觉交互|${count('visual')}|三材质、真实笔势、滑块后继续写风、自然恢复、环看、PNG|
|最终包竖屏尾声回访|${count('finalRevisit')}|复用真实实录存档、触屏长按/抬指、正常回看/重选、远侧构图与宽度|
|全屏专项|${count('fullscreen')}|真实进入/退出、Esc、拒绝请求的回退|
|发行标识与启动复用|${count('guards')}|拒绝混版验收与同名旧服务，保留已有服务|
|原生音频图|${count('audio')}|14 固定节点、10 前景声部上限、暂停/静音/释放|
|持续运行|${count('soak')}|${(reports.soak.elapsedMs / 60000).toFixed(2)} 分钟、${reports.soak.rounds} 轮、${all.length} 次视图采样|
|最终包触控与移动布局|${count('mobileUI')}|持续快扫、慢笔、多指取消与横竖屏仿真|
|新支路/触屏/回访|${count('exploration')} / ${count('touch')} / ${count('revisit')}|较早 v5 候选完整三庭实测，原始 build 保存在各报告|

[单元](evidence/unit-verification-v5.txt) · [主线](evidence/v5-main-play.json) · [支线](evidence/v5-branches-play.json) · [边界](evidence/v5-boundary-verification.json) · [视觉](evidence/v5-visual-verification.json) · [全屏](evidence/fullscreen-verification.json) · [音频](evidence/audio-verification.json) · [长时运行](evidence/v5-soak.json)。

主线、支线和连续录像使用普通输入；只读快照用于判断结果与导航，不写入已通关状态。坏存档、失焦和 WebGL 中断是明确标注的边界注入。固定种子一万份 JSON 恢复探针发现并修复非法 bridge.structure 的强制转键异常；单独保存修复前后证据。独立审查还修复了坏雨庭存档的空操作奖励与结尾后 E 键重看被遮断。

持续运行采用 ${reports.soak.build}；之后修复存档形状的类型/自有键白名单，并澄清桌面/触屏操作提示与发光地标文案，同时将加载时间与首帧动画计时分开，将倒影与首屏零步渲染移入加载阶段，并通过一次刷新边界再启动动画；之后还修正了快笔事件稀疏时的速度积分、滑块到场景的空格组合键，并压低近花风迹亮度；将远景穹架后移，避免竖屏尾声相机落在杆件后方；并修正长按寄出后的兼容点击会误开近看面板的问题。新手势路径另以最终包真实笔势、主线和连续录像复验；45分钟报告没有覆盖这些后续修改。不能把较早候选的报告冒充最终模块测试。报告中的错误数组为空，仅代表相应范围内没有页面/控制台错误。

持续快笔缺陷有独立修复前后记录：稀疏 pointermove 被逐帧限幅后，空事件帧导致散形不足；现在先对未限幅的标量速度积分，再限制能量，方向施力仍独立。最终包实景检查峰值 ${reports.visual.worldPeak.toFixed(4)}，同一半开花连续三轮自然归形。这个数值只解释触发结果，画面仍需看 [实景花尘](evidence/v5-release-world-dust.png) 与 [修复审查](../docs/blossom/v5-gesture-fix-review.json)。

## 连续实录

[1280 × 720 无声连续试玩](evidence/spring-letter-v5-uncut-silent.webm)。包含完整自动开场、花体笔势、空间行走、两段手绘花桥、实体种核与一个结局；没有剪辑、变速、混入参考视频或概念图。[实录元数据](evidence/v5-recording-verification.json)。另外保留这次普通游玩实际产生的本地存档导出，作为回访复现依据。录像没有声音；音频图测试也不能代替最终混音听感评审。

## 持续运行观测

${reports.soak.device}；Edge 无头，1440 × 900，单浏览器隔离运行。下表是各视图采样区间的浏览器帧间隔，均值按帧数加权；最大值保留，不滤掉卡顿。不是 GPU timer query，也不覆盖全部切场帧。

|视图|采样次数|加权平均 ms|采样最大 ms|
|---|---:|---:|---:|
${phaseRows}

末四轮同视图的几何体、纹理、着色程序数量进入平台；音频固定节点/声源保持 14 / 4。每轮实际切换 65,536 ↔ 16,384 粒子并操作旋转、笔势、静音、暂停。完整累计长帧计数在 JSON 的 frameTiming 中。DOL 报告的单次 9088ms 记录包含了 loading 内的着色预热：全屏初始同步提前设置了计时基线。原报告保留，最终包将加载时间独立记录，并由启动专项复测，不能将该值冒充已证实的可交互卡顿。长跑末尾打印摘要因变量名错误失败，原始 192 个观察与七项断言已完整写入；另以 verify-soak.cjs 独立复核，原错误报告保留，没有伪造第二次长跑。资源计数稳定不是对 GPU 显存无泄漏的证明，也不能推导所有设备稳定 60fps。

## 启动与首次切场

[最终包启动记录](evidence/v5-startup.json)单独记录加载、封面、序章、首次漫游、近花和图库。此次加载准备 ${startupFinal.loadingTiming.totalMs.toFixed(0)}ms，其中材质预热 ${startupFinal.loadingTiming.warmupMs.toFixed(0)}ms；首次动画至上述操作结束，累计最大帧间隔 ${startupFinal.frameTiming.longestMs.toFixed(1)}ms。新浏览器上下文没有清除操作系统驱动着色器缓存，不能称为完全冷缓存基准。加载时间没有被删除或假装成流畅帧，而是与动画帧分开报告。

## 质量边界

这是可玩的独立章节。水波和焦散仍为程序近似，植物与建筑仍有风格化重复，角色没有表情捕捉或配音，首次玩家理解与真实手机表现尚需外部试玩；竖屏近花仍有左侧花缘裁切，默认优先桌面宽屏体验。参考视频的花形/折射/运动细节仍有差距；没有宣称逐像素复刻、完整 3A 大作或电影成片。保留具体视觉差距清单，避免以测试数代替美术判断。

[当前图文入口](../docs/blossom/index.html) · [剧本与设计](../docs/blossom/v5-design-script.md) · [研究](../docs/blossom/research-v5.md) · [视觉差距](../docs/blossom/v5-visual-gap-review.md) · [经验沉淀](../docs/blossom/v5-knowledge.md) · [素材来源](ASSET_SOURCES.md)。

[本机游玩](http://127.0.0.1:5192/) · [Windows本机运行包](releases/spring-letter-0.3.0-windows.zip)。服务器停止后双击启动春信.cmd；运行包需本机已有Node.js。此地址只在当前电脑有效。
`;
fs.writeFileSync(prior, text);
console.log(JSON.stringify({ version: manifest.version, build, bytes: manifest.totalBytes, files: files.length, checks: manifest.checks }));
