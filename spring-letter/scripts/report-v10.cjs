const fs=require('node:fs'),path=require('node:path');
const {validateV10Evidence}=require('./validation-v10.cjs');
const root=path.resolve(__dirname,'..'),v=validateV10Evidence(root,{candidate:process.argv[2]||'v10-final-e'}),{proof,build,reports:r,total,evidenceDigest,graphics:g,graphicsProof}=v;
const openings=['openingLight','openingBalanced','openingDelicate'],samples=openings.reduce((n,key)=>n+g[key].frames.length,0),input=r.input.pages.reduce((n,p)=>n+p.checks.length,0),timings=r.soak.samples.map(s=>s.timing),max=key=>Math.max(...timings.map(t=>t[key]));
const text=`# 0.7.1 · 粉屏修复与全面回归记录

2026-11-21。冻结构建 **${proof.candidate}**，入口 **${build.entry}**，样式 **${build.style}**。游戏 JavaScript 与本轮核心修复候选 v10-final-c **逐字节相同**；最终仅追加终章提示与踏风按钮的 CSS 间距规则。输入、序章、音频、存档和核心图形对照明确复用同一逻辑字节的本轮记录；终章三视口、整体视觉、静态路径、导出、旧档及持续运行在最终样式下重新检查。每份复用证据的来源及哈希单列保存，没有改写旧报告。

## 根因与实际修复

已重现用户指出的序章、首次进入游戏全屏粉色故障。春声庭的蓝色薄雾材质，对未经约束的 UV 高度计算分数次幂；多重采样边缘可能外推出负 UV，产生无效颜色。水面倒影带入这些像素，辉光把异常扩散到整幅画面，连透明度一起失效，露出页面底色。界面仍会推进，WebGL 错误队列也可能是零，因此只看按钮和控制台会漏检。

修复将分数幂输入限定在有效范围，同步修正相关水面/木纹的带符号平方和反射角范围。保留原来的 **2× 倒影多重采样、HDR、线性过滤、倒影和辉光**。额外用浮点指数位识别坏反射样本，只让该像素退回水面底色；普通 isnan 判断在本机编译器下被优化掉，未把它当成有效保护交付。

另修复首次倒影早于阴影纹理分配引发的 GL_INVALID_OPERATION；倒影异常时恢复渲染目标、视口、裁剪和阴影状态。加载前就注册图形中断处理，故障时暂停绘制与音频、撤下加载遮罩，显示可读的恢复面板，提供存档导出及明确重新打开。高像素密度和极端尺寸使用缓冲区预算，同尺寸事件不再清空画面。

[根因、官方依据及正负对照](evidence/v10/render-root-cause.md)；[旧验收盲点及测试修正](evidence/v10/validation-integrity-note.md)。此前“天空着色错误”的中间归因已撤回，正式结论依据安全的逐 draw 探针。

## 图形与故障回归

| 范围 | 本构建结果 |
|---|---|
| 省电、均衡、细致三档完整自动序章 | 各六镜头及首次游玩，合计 ${samples} 次真实画布采样全部有效；细致另用 DPR 2 |
| 花型、材质、散聚、重载及全屏/横竖屏 | ${g.matrix.observations.length} 次画面观察全部通过，包含 3 档画质 × 5 个系列 × 4 种花型 |
| 初始化逐 draw GL 检查 | ${g.glTrace.errors.length} 个绘制错误 |
| 加载中、序章中、深色粒子、材质准备中强制图形中断 | ${g.context.cases.length} 条路径均可导出、恢复提示及重新打开；已有旅途不被覆盖 |
| DPR 3 下尺寸压力 | ${g.resize.observations.length} 组实际窗口变化，包含 7680×4320 与 1 像素边界；恢复正常窗口后画面有效 |
| 连续运行 | ${r.soak.elapsedSeconds.toFixed(1)} 秒、${r.soak.cycles} 轮；每个阶段同时检查真实画布与资源计数 |

序章按约 180 ms 间隔采样，不声称检查了每一渲染帧。透明、RGBA 全零、近乎纯色、GL 错误及故障界面都会导致失败；仅精确匹配的第三方 X4122 精度提示列为非阻断警告。旧错误的负控制确实产生粉屏；生产代码对照倒影无 NaN；故意保留坏样本时位级保护仍保持有效画面。这三份原始报告及源码哈希均进入发行验证。

终章新增布局回归：1440×900 与 844×390 的旧版提示确实与踏风按钮相交；最终桌面、竖屏、横屏三种尺寸下，说明、正文及按钮均在窗口内且互不遮挡。[独立 CSS 修补与复用清单](evidence/v10/presentation-patch.json)。

## 玩法、声音与数据

- 实际鼠标、键盘和可见按钮完成三庭、织桥、安放两枚种核、取消预览再寄出、刷新续玩：${r.play.checks.length} 项通过。自动化只用只读空间投影定位物体，没有注入完成状态；不等同无引导真人首玩。
- 桌面及仿真触屏输入边界：${input} 项；包括焦点、暂停、重复按键、双指方向释放、音符单笔归属与撤回。
- 旧档兼容 ${r.legacy.checks.length} 项；存档界面 ${r.saves.checks.length} 项，覆盖导出/导入、取消、恢复备份、冲突及临时模式。
- 留存、全屏、照片、SVG 与本地反馈 ${r.keepsake.checks.length} 项。根路径及子目录静态运行通过。
- 对本构建的实际音频输出录音并分析，静音、暂停、两次演奏及电平检查通过。没有替换成离线配乐，也不把数字分析冒充人工听感评价。
- 单元检查 **${total}/${total}** 通过。连续检查中，预热后的同阶段几何、纹理和程序计数未持续增长，音频节点/队列有界。这些计数不等于底层 GPU 内存测量。

${timings.length} 个重叠诊断窗口中，最大窗口 p95 帧间隔 ${max('p95').toFixed(1)} ms，最大间隔 ${max('max').toFixed(1)} ms；包含材质准备和切换。不能据此宣称所有设备稳定 60 帧。

## 发行与证据

发行包含 ${build.files.length} 个静态文件。通过校验后才原子替换本机 5192 入口，原 dist 备份并保留旧哈希资源。Windows/静态浏览器 ZIP 采用同一批文件，独立核对 CRC、解压文件及 HTTP 哈希。发行后的结果分别见 [本机一致性](evidence/v10/production.json) 和 [包装核验](evidence/v10/package.json)；本候选报告不预先宣布尚未执行的发布检查已通过。

${Object.entries(graphicsProof.reports).map(([k,p])=>'- ['+k+']('+p+')').join('\n')}
${Object.entries(proof).filter(([k])=>k!=='candidate').map(([k,p])=>'- ['+k+']('+p+')').join('\n')}

验证覆盖本机 Chromium 与仿真触屏；不同实体 GPU、驱动和手机仍有差异。图形恢复流程不会承诺自动修复所有运行时异常。这是独立艺术探索浏览器章节，与金沙无关；商业表现、无引导可玩性和电影级/AAA 质量仍不能仅凭自动化测试证明。
<!-- v10-evidence-sha256: ${evidenceDigest} -->
`;
const destination=path.join(root,'FINAL_QA.md'),history=path.join(root,'evidence/v10/FINAL_QA-before-0.7.1.md');if(fs.existsSync(destination)&&!fs.existsSync(history))fs.copyFileSync(destination,history);fs.writeFileSync(destination,text);console.log(JSON.stringify({written:true,entry:build.entry,samples,units:total,evidenceDigest}));
