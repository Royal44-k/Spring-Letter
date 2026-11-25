const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const p=read('evidence/v12/release-proof.json'),b=read('evidence/v12/build-'+p.candidate+'.json'),r=Object.fromEntries(Object.entries(p.reports).map(([k,f])=>[k,read(f)]));
const extra=read('evidence/v12/additional-evidence.json');
for(const report of [...Object.values(r),...extra.openings.map(read)]){assert.equal(report.passed,true);assert.equal(report.entry,b.entry);assert.equal(report.entrySha256,b.entrySha256);assert.equal(report.style,b.style);assert.equal(report.styleSha256,b.styleSha256);}
assert.equal(extra.openings.length,3);assert.deepEqual(extra.openings.map(f=>read(f).actualQuality).sort(),['balanced','delicate','light']);
const locationNames={conservatory:'雨幕温室',observatory:'沉星天文台',meadow:'云海花甸'};
const link=(label,file)=>'['+label+']('+file+')';
const text=`# 0.9.0 · 三处独立新地图与完整春信旅程验收

2026-11-23。验收候选 **${p.candidate}**：入口 **${b.entry}**，样式 **${b.style}**。本文所列最终运行报告同时核对 JavaScript 与 CSS 的 SHA-256；开发中的失败、旧候选与修正过程保留，不充当最终证据。本机发行入口为 http://127.0.0.1:5192/ 。

## 本轮实际新增

游戏为独立主题，与金沙无关。三张新地图拥有自己的三维地形、可行走范围、地标、植被、光照、音乐与存档，不复用旧花庭地面。首页「展开远方地图」及旅途地图均可直接进入；独立访问不会代替尚未完成的旧主线。

| 地图 | 实际空间 | 不同的核心操作 |
|---|---|---|
| 雨幕温室 | 铜色肋拱、巨蕨与悬藤、育苗架、三层实体林缘、林地与旧驿门 | 按住招蝶，慢行带领有跟随滞后的蝶群，在三丛不同颜色的兰花边停留授粉 |
| 沉星天文台 | 蓝夜玄武岩台地、断柱石廊、黄铜浑仪、月亮与夜花 | 实际走上观星台，点触或拖过三维星点描出信封航路；可松手停笔、撤回，亦可用数字键 |
| 云海花甸 | 五座分离的实体浮岛、分层侵蚀岩、低云、花丛、风旗与邮枝树 | 主角起跳并持续展开花伞滑翔，按顺序跨岛；落空回到最近的已达花岛 |

完整顺序是：**情境序章 → 花光暗房 → 纸翼渡风 → 回声织信 → 借花为桥 → 留下两处春天 → 雨幕温室 → 沉星天文台 → 云海花甸 → 写自己的信 → 潮汐旧信 → 岛岸备舟 → 繁花远航 → 仪式结局**。共十二个主要行动环节；六处驿路字迹不额外凑入关卡数。

三处经历以花香、星路、远风串联，写信桌会回望这段旅程。玩家仍亲自写正文、收起岑的旧信、登岛找到船、解缆升帆，携两封信迎向曙光。海上花朵保持立体几何；结局保留玩家实际原文，可导出两封信、留影或继续看海。

## 最终运行验收

| 范围 | 实际结果与证据 |
|---|---|
| 代码及数据规则 | ${b.testRun.total}/${b.testRun.total} 通过；0 失败、取消、跳过、待办。${link('原始测试日志',b.testRun.log)} |
| 从零完整旅程 | 12/12 实际输入完成，无进度注入；中途刷新、自己的信与旧信、帆、航程和最终仪式保留。${link('完整报告',p.reports.full)} |
| 新地图布局与输入 | 3 地点 × 桌面、竖屏触控、横屏触控，共 9/9；方向、按住/松开/取消、环看、地图滚动、返回续玩、6 颗星可见且中心未被 UI 遮挡。${link('布局报告',p.reports.layout)} |
| 三地图音频 | 3/3；实际原生音频图录制，默认混音、纯音乐、静音、恢复；记录有限信号与采样削波检查，保留 WebM。${link('声音报告',p.reports.audio)} |
| 三档画质与场景生命周期 | 3 地点 × light/balanced/delicate，9/9；三次真实 WebGL context loss 后导出及恢复；三轮地图往返资源稳定，返回花庭像素正常。${link('场景报告',p.reports.stress)} |
| 花形与材质回归 | 100/100 观察点，涵盖三档画质、五系列、四形态、散聚、重载、全屏、横竖屏；原始画布 RGBA 与 GL 错误判定。${link('渲染报告',p.reports.render)} |
| 开场及首次入场 | 三档画质分别自动走完六镜开场与首次游玩；逐次取样实际画布，无透明、纯色或非法 GL 状态判定。${extra.openings.map((f,i)=>link(read(f).actualQuality+'（'+read(f).frames.length+' 次取样）',f)).join(' · ')} |
| 原有故障恢复 | 初始 HDR 等待、开场、花尘、材质准备 4/4 真实图形上下文丢失；清楚显示恢复和导出入口，恢复后重载，进度保留。${link('恢复报告',p.reports.context)} |

## 这一轮确实修正过的问题

- 中轴柱与入口铜架挡路：移动布景并共享实体碰撞定义，树干、断柱与大型仪器阻挡脚步，沿边可滑动。
- 云岛起跳过苛刻：普通方向输入也有足够持伞航程；从岛半径 65% 位置起跳的四跨模型回归通过，真实通关保留安全落点。
- 地面双重乘色与温室空背景：恢复可读颜色，增加原创程序粗糙度/法线、林缘与承托林地；云岛使用宽底侵蚀岩层。
- 小屏星图裁切、横屏工具条遮挡：按真实星点透视投影适配安全画面；极小窗口亦有回退，不因缩放停止渲染。
- 招蝶按钮松开反馈滞后：按下、释放与取消立即同步，避免视觉上仍像按住。
- 完成描星后缺少明确去向：显示已收好星路，并明确返回石阶继续旅途。
- 从旧花庭进入新图时残留种核/踏风界面：新地图隔离全部旧场景 HUD；完整通关截图同时断言这些界面不可见。
- 旧版粉色全屏保护、花桥绿色波浪墙修复继续保留。完整路径实际经过叶桥；当前构建重新执行上述渲染与开场回归。

## 保存、资源和发行

旧版已封好的信、收信人、正文、旧信、结局和海岸阶段不被新增地图清洗。三份 v11 实得存档的保存/导出/导入与新地图往返回归已纳入代码测试；旧海岸玩家可直接继续原航程。云岛空中存档回到已达安全岛，清除按住状态。

本轮在侧边浏览器实际打开八个此前未计入的官方域名，${link('浏览器访问记录','evidence/v12/reference-browser.json')}与${link('研究和取舍','../docs/blossom/v12-research.md')}分别记录访问和借鉴。官网公开研究无需购买，不把商业游戏本体当作免费素材。本轮新增地图造型及表面为原创程序生成；声音复用已有许可明确的 CC0 乐器与环境资源，无付费接口、账号或新商业素材。${link('完整来源与许可','ASSET_SOURCES.md')}。

发布门禁核对 ${b.sourceAll.length} 个冻结输入与 ${b.files.length} 个构建文件，同时锁定入口、样式、CPU 日志和运行报告哈希。先完整备份旧 dist，校验暂存入口后再替换；保留旧版带哈希资源。运行文件、启动器与发行 ZIP 另作逐文件校验，ZIP 再检查 CRC、解压结果、HTTP 及子目录访问。${link('发布证据索引','evidence/v12/release-proof.json')}；发行结果写入 ${link('发行清单','evidence/release-manifest-v12.json')}与${link('包校验记录','evidence/v12/package.json')}。

## 验收边界

本轮设备证据为本机桌面 Edge 与 Chromium 模拟触屏，未冒充实体手机、全部浏览器或全硬件认证。声音检查证明实际输出与控制有效，不代替不同扬声器下的主观试听。开场为连续过程中的定时取样，未声称检查每个 GPU 帧。三轮资源稳定与完整通关不等于无限时长无缺陷保证。

当前交付是有明确边界、可独立完成的艺术探索章节。商业定价、真实用户留存与受众接受度尚未经过市场验证；不将自动化通过描述为 AAA 认证或零漏洞承诺。
`;
fs.writeFileSync(path.join(root,'FINAL_QA.md'),text);console.log(JSON.stringify({written:'FINAL_QA.md',candidate:p.candidate,entry:b.entry,style:b.style,units:b.testRun.total}));
