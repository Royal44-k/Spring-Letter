# V5 主线真实输入验收

2026-11-19 05:58:25 UTC，固定包 `http://127.0.0.1:5192`、入口 **`/assets/index-DcUM5LG9.js`** 完成15项主线真实输入检查，错误为空。报告 `spring-letter/evidence/v5-main-play.json` 记录入口；脚本 `spring-letter/scripts/v5-main-play.cjs` 只用普通键盘、鼠标和页面按钮，`snapshot`/`project`只读导航。新游戏通关过程没有预填存档或改写游戏状态。

实际走完：慢笔开花 → 步行风廊 → 指针推光并撤手等它停稳 → 到A台手绘A–M → 亲自过桥 → M台手绘M–F → 走到终庭 → 拾核、携核、种核 → 长按启程。随后通过页面“回到启程前”合法回退，走回花座取出种核并重新安放，实际达成`memory+season`、`memory+voyage`、`season+voyage`三个结局。

## 实际覆盖的边界

- 按住Q保持散聚时，半开的花在`scatter >= .18`期间不积累第一幕完成；松手自然归形后才解锁。普通慢笔不按Q的实体开花由同包录像和支线流程另行覆盖。
- 桥只画到一半就松手，草稿缓退、不造桥；画到终点但未松手时按M开地图，取消后不偷提交。
- 人站在承托自己的桥上时，不能换掉当前桥；到下一座石台后也没有排队执行旧请求。
- 已占花座拒绝第二枚种核，种核继续留在手中。
- 513ms短按启程不提交；长按完成后才进入结尾。本轮拾核618–717ms、安放886–990ms、取回699/738ms、启程1849–1902ms。测试依据可见状态变化后松手，不把固定墙钟等待当作已完成。

## 当前证据

| 文件（前缀`spring-letter/evidence/`） | 内容 |
|---|---|
| `v5-main-01-hand-opened-flower.png` | 真实风笔完成第一幕 |
| `v5-main-02-wind-delivery.png` | 游光实际送达 |
| `v5-main-03-weave-soft-return.png` | 提前抬笔、软退 |
| `v5-main-04-first-woven-bridge.png`、`05-second-woven-bridge.png` | 两段实景手绘桥 |
| `v5-main-06-memory-planted.png`、`07-letter-before-send.png` | 亲自携核安放、启程前可逆 |
| `v5-main-08-memory-season.png`、`09-memory-voyage.png`、`10-season-voyage.png` | 三种实际结局 |

同包的`spring-letter-v5-uncut-silent.webm`为**283.76秒、1280×720、25fps VP9、无音轨**，11项录制检查通过。它从新游戏开始，完整播放六镜自动开场（实测墙钟50.599秒），连续包含默认拖动环看、慢笔开花、快扫归形、推光、两桥、拾核安放、一个结局和留园回看，没有剪辑、加速或混入参考帧。它是普通输入自动实录，不是人工玩家录像；录制开销会改变墙钟节奏，不能作为性能基准。数值和范围见`v5-recording-verification.json`、`v5-recording-media-probe.json`。

本轮录像的风场引导读取既有位置和速度，移动真实鼠标提前减速、撤手，未改游戏收束规则。65次输入的采样间隔中位233ms、最大670ms，约16.608秒送达。此前BNqW录像采用固定强推，在较慢反馈下不收束；原失败录像/JSON保留在`archive-BNqW-record-wind-failure/`。同包不录制主线可通关，CPU延迟反馈对照也复现旧引导的过冲。此后从新游戏重录，未剪掉失败段接片，未降低完成条件。

## 真实触屏回访

`v5-final-revisit.json`在同一DcUM构建通过6项检查。它刻意加载本次成功录像结束后由浏览器原生导出的`v5-record-real-play-storage.json`，核对两枚已安放种核和已获得结局，再通过普通继续、回看、合法回退和再寄出完成回访；存档SHA256由报告记录，供构建验收核对。

寄出使用可见`#focus-button`上的CDP触屏接触输入，长按1844ms直到实际完成，再发送touchEnd。松手后`focus=null`、`ending=season+voyage`，镜头继续位于终庭远侧（释放时z=-57.495，稍后z=-63.659）；留园后仍可回看。没有注入DOM点击或修改状态。390×844实图`v5-release-portrait-farewell.png`也已复读：三个花座、人物和飞种可见，粗穹顶杆件不再穿过前景；`v5-release-portrait-letter.png`信笺无横向溢出。此为触屏视口与键盘步行测试，不是实体手机验收。

旧DeZn确曾在真实touchEnd后误开finale并切回前侧；其1847ms输入记录和失败图仍在`archive-DeZn-before-touch-fix/`，不追改为成功。当前构建消费长按这一原始意图产生的兼容点击，以上实际回访验证了修复。

## 边界与归档

没有把headless Edge的标签页切换冒充OS窗口失焦：此前焦点模拟未可靠让游戏失焦，故本报告不声称系统级blur已通过。实际地图模态中断已验证，纯判定测试与静态代码覆盖取消路径。

历史证据分别保存于`archive-v5-before-release/`、`archive-BKcu-gesture-review/`、`archive-BNqW-before-crown-fix/`、`archive-DeZn-before-touch-fix/`。同名图和报告须结合目录与入口字段区分。当前根目录主线、录像、支线和回访均为DcUM。常规安放镜头中，人物进入花座中心时仍可能与杯模型重叠，前景与文字的对比也有继续精修空间。完整通关证明交互链成立，不代表电影或3A级资产规模与美术质量。
