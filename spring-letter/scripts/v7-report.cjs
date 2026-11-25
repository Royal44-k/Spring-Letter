const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const full=read('evidence/v7/full-play.json'),mobile=read('evidence/v7/mobile/mobile.json'),visual=read('evidence/v7/visual/visual.json'),soak=read('evidence/v7/soak.json'),analysis=read('evidence/v7-audio/actual-analysis.json');for(const r of[full,mobile,visual,soak])assert.equal(r.passed,true);const units=fs.readFileSync(path.join(root,'evidence/v7/unit-final.txt'),'utf8');assert.match(units,/fail\s+0/);const count=units.match(/tests\s+(\d+)/)[1];
assert.ok(Object.values(analysis.checks).every(Boolean),'Decoded audio checks incomplete');
const text=`# 0.5.0 · 风起之时 验证记录

2026-11-20。候选 ${full.build.entry}，样式 ${full.build.styleBuild}。后续发行直接复制此候选的已测文件，最终 ZIP 与解压后 HTTP 响应另作逐文件核对。

## 实际完成的路线

使用新隔离浏览器，从扉页正常开始；三庭共 28 朵花灵全部以 WASD / Shift 接取，并各自回巢一次。第二庭等待真实游絮跟上再接银灵，第三庭通过慢银疾金与开放窗口。随后普通鼠标写风架设两段桥、步行跨越、拾取两枚种核、安放、预览取消再确认寄信，刷新后记录与结尾保持。${full.checks.length} 项流程断言通过。

另覆盖活动取消、重复按 E 不重复发奖、暂停冻结时间和游絮、静音恢复。终庭交互重叠区也通过普通走位复现并验证：E 执行拾种，可见提示与动作一致，不重开追风活动。脚本只读调试快照用于导航，没有传送、修改状态或注入通关存档。它不是新玩家盲测。

## 声音与画面

实际 Web Audio 混音通过输出分支录制为 WebM，完整解码分析与 55 秒 MP3 节选见 evidence/v7-audio/actual-analysis.md 和 ../docs/blossom/media/v7/game-audio.mp3。声音检查区分媒体 PTS、音频时钟与墙钟：暂停期间的无包区间没有被错误映射为连续 PCM。静音按固定峰值/RMS阈值评估，并保留是否精确归零的诊断。结果依据实际录音，不把节点存在当作可听见的证明；统计分析不等于主观听感试听。

九张固定候选截图覆盖扉页、晨光初庭、四种花型/系列、青釉花尘、自动归形及夜景；无浏览器错误。场景仍为风格化程序造型，真实表面与光照改进不能被表述为商业 3A 资产质量。

## 触控、持续运行和规则

390×844 竖屏浏览器仿真 ${mobile.checks.length} 项操作检查通过：真正触屏点按起程、同时触摸方向与踏风、抬手释放、独立音乐滑块和刷新恢复。活动说明与踏风触点无重叠，控件在视口内；没有把它称为真实手机验收。

持续 ${Math.round(soak.elapsedSeconds)} 秒、${soak.cycles} 轮反复活动/取消、20 种花型系列组合、散聚自然返回、菜单暂停和静音恢复。相同阶段的几何、纹理和程序数与预热基线对照无持续上升；音频保持 15 个持久节点、2 个环境源，临时声部与调度队列受限。此记录不是 GPU 显存工具测量，也不承诺所有机器达到固定帧率。

${count} 项 Node 检查通过，覆盖旧主线、桥、种核身份、保存恢复、新护送/慢行规则、运动资源、音频生命周期及画质资源释放。

## 文件

- evidence/v7/full-play.json：完整普通输入路线、获得的存档和截图清单。
- evidence/v7/mobile/mobile.json：竖屏触点与音量验证。
- evidence/v7/visual/visual.json：九阶段实景与运行快照。
- evidence/v7/soak.json：持续检查逐阶段资源与音频数据。
- evidence/v7-audio/actual-analysis.json：完整混音解码、响度/削波/静音与暂停分析。
- evidence/release-manifest-v7.json 和 evidence/v7/package.json：发行文件散列与 ZIP 解压 HTTP 验证。

已知范围：短篇独立浏览器游戏；庭院尺度、角色表演、支线对后续玩法的影响仍有限。需要真实新玩家体验与更多设备测试；不能用自动检查数量替代可玩性、电影叙事或审美评价。
`;
fs.writeFileSync(path.join(root,'FINAL_QA.md'),text);console.log('Wrote current-scope FINAL_QA.md');
