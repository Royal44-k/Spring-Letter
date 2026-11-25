# 春信产品化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. 用户已授权自主实施，不再设置设计批准停点。

**Goal:** 交付三封可亲手解谜并改变庭院的春信，以及保护进度的可试玩发行候选。
**Architecture:** letter-model 负责回路和持久选择；letter-garden 负责三维石盘/流路/生长；letter-ui 负责来信与可访问操作。main 协调优先级、镜头、旧玩法与奖励。save-service 独立处理迁移、备份和导入导出。
**Tech Stack:** 现有 Three.js 0.185、Vite、Web Audio、Node tests、隔离 Playwright Edge。
**Spec:** [v8-design.md](v8-design.md)

## 全局约束
- 只用免费、本地、可追溯资源；不发布外网、不收费、不新增账号。
- 不碰金沙；保留 .history/v05-before-v8.zip 和 v7 证据。
- GPU 浏览器串行，普通输入验证，不用改存档伪造通关。
- 中止、暂停、误触、旧档、竖屏必须可恢复；所有成果措辞与证据一致。

## 重点审查
- 两个出口同亮时选择明确；接通预览不提前写完成。
- 切走/暂停后没有残留按键或强制推进。
- 源头与出口端口方向、回环、泄漏、双源判定一致。
- 新旅程/导入/另一标签页不静默覆盖旧进度。
- 近看、追风、投种与委托的 E 优先级及画面提示一致。

## 工作包
- [x] 1. 受众/竞品/叙事研究；记录可验证的产品假设。
- [x] 2. letter-model.js + tests：三回路，旋转、撤销、接通、确认、重选、恢复。
- [x] 3. letter-garden.js：物理转子、逐段花尘、两种结果、可点选投影与边界。
- [x] 4. letter-ui.js/css：信册、读信、操作引导、键盘/触摸、反馈与快捷往返。
- [x] 5. main/game-model 整合：入口、镜头、优先级、三奖励、结尾与旧档兼容。
- [x] 6. save-service + tests + UI：备份/导入导出/冲突与失败反馈、来源页完善。
- [x] 7. 初次体验/实机艺术审读并迭代；全流程、存档、窄屏、连续运行验证。
- [x] 8. 固定候选、更新设计档案与真实产品验证计划、打包验证并启动5192。

## 决策日志
- 产品采用温柔空间解谜，追风转为可选；不扩充地图来掩盖现有行动缺乏后果。
- 两种照料同等收益，允许重选；情感不做隐藏分数。
- 商业目标是可测试的独立作品方向，本轮不承诺销量或市场认可。

## 冻结版本验收

release-d（`index-DTQylXTU.js`）通过314项规则/工程检查、新主线12项、旧路线15项、存档UI9项、窄屏触控4项、20种花型/系列切换、全屏/明信片/反馈3项、真实音频37项及分析10项。持续运行539.179秒、7轮，资源在预热基线范围；批量换花型仍有明显长帧，未宣称稳定60帧。

两个ZIP均已解压并逐个核对52个HTTP文件。本机5192已推广同一构建，并通过全新进入、全屏、行走、声音与已有真实旅途续玩检查。最终产品页在1440与390视口通过33项媒体、布局与入口检查，主任务已审读桌面和手机首屏、桌面全页图像；[产品页记录](media/v8/product-check-2026-11-21T06-02-58-417Z/report.json)保留。完整证据：[验收摘要](../../spring-letter/FINAL_QA.md)、[发行清单](../../spring-letter/evidence/release-manifest-v8.json)、[包校验](../../spring-letter/evidence/v8/package.json)、[正式入口](../../spring-letter/evidence/v8/production.json)。

本地实施与交付工作包已完成。陌生玩家观察、真实移动设备和市场验证未执行，保留在产品档案下一阶段，而非计作本轮已达成结果。

