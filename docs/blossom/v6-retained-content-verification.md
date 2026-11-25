# V6 保留支线与雨、潮庭：普通输入回归

**最终候选 G 已实际完成两轮独立新档验证。** 原始输出保留在 `evidence/v6-candidate-g-final-retained/`；发行工具读取的根 evidence 路径为16个文件的同字节副本，[SHA-256核对清单](../../spring-letter/evidence/v6-retained-g-copy-manifest.json)全部一致，未重写报告字段。

2026-11-19，候选 G；两轮独立新档，桌面 Edge 无头模式，1440×900。三条叙事支线 **9 项通过**，雨、潮庭与主路衔接 **8 项通过**。恢复后两轮均在本次运行完成，重载确认已获得的成果保存，页面和控制台错误列表为空。本次使用既有输入脚本并更新文档，没有修改运行代码。

## 候选与证据

两轮共同入口 `/assets/index-BAJMaxNn.js`，SHA-256 `2f1312b822af74a328c5dfb230bb4563db48878406892113c48a0d56c6ea1636`；样式 `/assets/index-B12KydA1.css`，地址 `http://127.0.0.1:5194`。每个脚本在开始与重载后检查资源身份一致，避免把不同候选混成一份报告。

| 范围 | 脚本、报告与实际获得存档 | 完成时刻 |
|---|---|---|
| 三条叙事支线 | [脚本](../../spring-letter/scripts/v6-branches-play.cjs) · [完整 JSON](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-branches-play.json) · [实际获得存档](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-branches-earned-storage.json) | 11:21:34 UTC |
| 雨留庭、潮生庭 | [脚本](../../spring-letter/scripts/v6-exploration-play.cjs) · [完整 JSON](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-exploration-play.json) · [实际获得存档](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-exploration-earned-storage.json) | 11:23:53 UTC |

D历史的[三支线9项](../../spring-letter/evidence/v6-candidate-d/v6-branches-play.json)与[雨潮8项](../../spring-letter/evidence/v6-candidate-d/v6-exploration-play.json)仍原样保留，D入口为`index-Dm57NR6t.js`。E的接力因启动性能调查中断，只有部分截图及[中断说明](../../spring-letter/evidence/v6-candidate-e-retained/INTERRUPTED.json)，不计通过。当前脚本链接指向最终G使用版本，已增加首花提前离开近景的断言，不把它倒算成D已经测试的内容。

F历史的[三支线9项](../../spring-letter/evidence/v6-candidate-f-retained/v6-branches-play.json)与[雨潮8项](../../spring-letter/evidence/v6-candidate-f-retained/v6-exploration-play.json)继续独立保留。G的上次运行随本轮主动中断，只留下两张截图及[中断说明](../../spring-letter/evidence/v6-candidate-g-retained/INTERRUPTED.json)，没有完整报告；本次恢复后从两个新档重新执行，没有续用旧会话或把部分结果补称通过。

两个报告的 `sourceCheckpoint` 均为 `null`。从可见“新的旅途”开始，使用可见跳过引言按钮；未注入进度或调用状态 setter。诊断接口只读取快照与世界坐标投影，按键、鼠标、滑杆和按钮承担实际操作。

脚本支持可选 `SPRING_STORAGE`，但本轮未使用。未来若从 `v6-main-before-wind-storage.json` 继续，仅映射 origin，并记录原文件路径与哈希；不能修改任务字段来制造合法进度。全通关的 `v6-main-real-play-storage.json` 不满足本组测试的前置条件。

## 三条叙事支线

1. 从花庭外圈走到旧杯边。六拍全留白无法完成；自编曲 `[1,2,0,1,0,2]` 可以在游絮尚未觉醒时留存。开始改写后取消，或离开再回来，原曲均保持。
2. 改写为 `[2,0,1,2,0,2]` 并重听，观察到四个实际杯声基频依次为 `523.25 / 392 / 523.25 / 523.25 Hz`，两处留白的实际起音间隔均大于 1.08 秒。观测脚本旁听 Web Audio 的 oscillator 创建与 start，不替换声源或推进任务；用同次 `2.76×` 泛音区分杯声与环境音。这证明调度关系，不证明扬声器输出或主观音质。
3. 首花通过 `F` 释放、普通鼠标运笔后，**在漂游阶段主动退出近景**，保持`focus: null`等待自然归形，首幕照样完成；随后实际步行上新路到显影支线，没有再次E近看来提交结果。这项覆盖E修复、由最终G再次验证的边界，不沿用V5的即时上划解锁。
4. 到信笺前，分别用数字键、可见刻痕按钮、实际世界刻痕的鼠标位置，使三处浅痕显影。结果保存为三项全读。
5. 主风种子在按住时受牵引，经过石障外缘到目标；仍按住时不会完成，真实松手后停入花杯。随后等待游絮的自然觉醒。
6. 旧花未观察年份时不能直接提交；实际操作滑杆 Home / End 并停留，全合与全开都有可见形态差别。停在端点仍不能提交；回到 0.4 的中间姿态后成功留存。
7. 正常重载后，三项支线全完成、自编六拍与 `memoryBloom: 0.4` 均保留。

实图：[杯边自编曲](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-branches-01-authored-cups.png) · [三处显影](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-branches-03-inscriptions.png) · [旧花全合](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-branches-04-old-flower-closed.png) · [旧花全开](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-branches-05-old-flower-open.png) · [留下的姿态](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-branches-06-old-flower-chosen.png)。

## 雨留庭、潮生庭与真实路线

另一新档从初花庭外圈上雨庭坡道，在任何主谜题完成前抵达。角色海拔符合实际抬高地形。持笔不移动无法完成；沿真实世界半径 1.28 的花环连续画风，花庭恢复。沿另一条合法坡道返回，绕开首花 3.9 米自动近景边界，再明确进入首花互动。

完成新首花与主风后，依次走至主路 A 台、R 台和西侧地形连接，到潮庭时终桥仍未解开。分别步行到三处花铃，驻足等待实际回声推进；最后 `tide.index` 为 3，雨、潮庭完成，侧风仍未完成。正常重载保留这组真实状态，未误解锁终庭。

实图：[雨庭初至](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-exploration-01-rain-arrival.png) · [半圈运笔](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-exploration-02-rain-half-trace.png) · [雨庭恢复](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-exploration-03-rain-restored.png) · [主风落巢](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-exploration-04-main-wind-delivered.png) · [潮庭初至](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-exploration-06-tide-arrival.png) · [三段来信听完](../../spring-letter/evidence/v6-candidate-g-final-retained/v6-exploration-07-tide-complete.png)。

## 范围与后续审美判断

- 使用新跟随镜头的分段按键，每一小段释放后再根据当前方位继续；39 个到达路点均来自真实步行。这覆盖这些路线的可达性，不等于全面证明镜头舒适性或所有自由探索路径。
- 没有重复侧风取消专项；`SPRING_INCLUDE_WIND=1` 的可选路径已准备但本轮未运行，不能标为本报告通过内容。终庭分配、三种结局、触屏与移动端由各自专项负责。
- 截图可确认杯、信笺、旧花和两庭均有现场反馈；仍存在程式化石台、旧花像标本装置、天空与地表光比偏平等审美限制。它们需要独立美术改进，不应因交互断言通过就宣称电影或 3A 品质。
- 旧花截图中的临时提示来自本测试刻意尝试无效提交，随提示寿命消退；记录其来源，不能把静帧中残留提示误认为提交失败。
- 报告末尾的 `frameTiming`、`loadingTiming` 属于**重载后的短窗口**。首次加载已单独保存在`observations.initialLoadingTiming`：支线轮初始化15.60秒、预热12.43秒、加载层消退16.25秒；雨潮轮对应16.06／13.03／16.71秒。末尾重载初始化分别约2.53与2.41秒，不能拿后者宣称首次启动速度；这些本机单次观察也不代表全程稳定帧率。
- 这是代理驱动的真实输入回归，尚未进行外部新玩家盲测；不声称玩家已经理解叙事、引导或选择内涵。

V5 的脚本与报告保持原样，D、F的原始通过记录和E、G的中断证据继续保留；本页最终结论仅对应以上候选G与实际证据。
