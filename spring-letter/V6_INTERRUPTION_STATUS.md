# 0.4 制作中断检查点（历史记录）

**已恢复并完成游戏发行。** 2026-11-19 11:18:23 UTC 接续工作后，G 完成支线、界面、47 分钟连续运行、完整实录与 4,397 帧解码；0.4.0 已更新本机 5192 入口，ZIP 已实际解压启动并逐项核对。当前结果见 [最终验证](FINAL_QA.md) 与 [图文交付](../docs/blossom/index.html)。下文保留中断当时的状态，不能视为当前待办。

2026-11-19。本轮被主动中断，停止继续开发与验收。未发布 0.4 成品，未执行发行目录替换或打包。

## 已保存的实现

独立主题《花漾年华：待寄出的春信》，与金沙无关。三景动画加载、随行镜头与全屏、四花型五视觉系列、同源配色花尘、破开／写风漂游／自然归形、第一幕离场完成衔接、种子统一牵引和点按携带、终庭可撤回选择及窄屏可读性均已进入源码。

最终候选目前为 `.qa-v6/candidate-g`：

- JS：`/assets/index-BAJMaxNn.js`
- CSS：`/assets/index-B12KydA1.css`
- JS SHA-256：`2f1312b822af74a328c5dfb230bb4563db48878406892113c48a0d56c6ea1636`
- 完整构建记录：`evidence/v6-build-candidate-g.json`

G 在 F 基础上只修正接触阴影辅助绘制：临时保护 `shadowMap.autoUpdate/needsUpdate`，避免重复生成并覆盖正式场景阴影，finally 恢复；主画面仍逐帧更新阴影。

## 已实际通过的 G 检查

- Node 166 项通过：`evidence/unit-verification-v6.txt`。
- 首花写风后提前离开，自动归形仍解锁：`v6-flower-leave-fixed.json`。
- 主路与三种结局：11 项，`v6-main-play.json`。
- 主／支风地图和双指取消：6 项，`v6-seed-cancellation.json`。
- 竖屏终庭、合法旧存档、携带刷新、标签与字幕：10 项，`v6-seeds-mobile-delivery.json`。
- 10,000 份存档恢复探针通过，对应模型文件未在 G 改动；其来源散列由发行脚本再核验。

这些报告的 G 资源身份一致，错误记录为空。它们不代表 G 全部验收结束。

## 未完成的部分

1. G 三条物件支线／雨潮探索。中断的研究会话 `72682` 已不存在；`evidence/v6-candidate-g-retained` 只有两张截图（09:50:34、09:50:42 UTC），没有完整报告或获得存档，不能算通过。
2. G 界面复验。根目录 `v6-interface.json` 仍是 F 的 10 项结果；脚本现增加检查环境资源、接触阴影及反射真实启用，G 尚未运行。
3. G 至少 45 分钟连续运行。尚未启动。F 首次因重莲窗口只有 26 个新帧而失败，原件为 `v6-soak-first-failure.json`；F 第二次约 13 分钟后主动中断做阴影调查，原件为 `v6-soak-f-diagnostic-interrupted.json`。两次都不是长跑通过。
4. G 无剪辑实录与完整 PyAV 解码，尚未运行；不要复用旧版录像。
5. 发行目录替换、最终 manifest、ZIP、实际解压启动、5192 全文件 HTTP 核验、最终图文页和 QA 更新，均未执行。

F 的既有报告已归档到 `evidence/v6-candidate-f`；F 保留内容原件还在 `v6-candidate-f-retained`。E、D 及更早版本同样保留，不能将它们改写为 G 验收。

## 恢复工作时

- 先重新确认本机服务和进程归属，不能沿用旧 session ID 假定还在运行，也不能关闭无法归属的用户浏览器。
- 本机正式 `dist` 尚未提升到 G。用户原浏览器存档没有被测试改写。
- GPU 测试串行；不与第二个 3D 浏览器或几何压力测试并行。新帧数和资源增长断言不降低。
- 有独立启动与阴影对照实验，但帧耗时存在同机波动。记录全部数据，不宣传 FPS 翻倍，不宣称初始慢窗已唯一归因。
- 已备好的脚本：`v6-interface.cjs`、`v6-soak.cjs`、`v6-record.cjs`、`verify-v6-media.py`、`promote-v6.ps1`、`release-v6.cjs`、`package-v6.py`、`verify-v6-package.py`、`verify-v6-served.cjs`、`write-v6-qa.cjs`、`update-v6-index.cjs`。
- `promote-v6.ps1` 和 `release-v6.cjs` 已指向 candidate-g。前者验证路径、保留旧 dist，不执行删除；仍须完成全部验收再运行。
- 图文生成器在 `../docs/blossom/tools/build_v6_dossier.py`，最终 QA 页尚未加入 PAGES；最终实际文件生成后再加入、统一生成，并运行 `check_v6_links.py` 与浏览器看图。
- 时间边界：本轮从 06:44:55 UTC 开始，最后连续制作工具时间为约 09:49:45 UTC，已实际工作超过三小时。09:50 左右中断，11:08 UTC 才做中断核对；不能把这段空档称为制作时间。现有发行脚本 `workWindow.elapsedMs` 是墙钟时长，恢复后须在最终叙述中明确区分墙钟与实际工作时间。

研究、完整可执行剧情、视觉边界、启动优化与渲染复核都保存在 `../docs/blossom/`。原片流晶体积、纱面粒子、角色和环境质感仍有差距，本版不能称为完全复刻、电影或商业 AAA 成品。
