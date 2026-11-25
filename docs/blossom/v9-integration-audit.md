# 0.7 异质交互重构：接入审计

2026-11-21。只读审计当前 `spring-letter` 0.6 源码；未修改运行代码，未启动浏览器或声称实机验收。本文服务于独立的《花漾年华：待寄出的春信》，不引入金沙项目内容。

## 结论

保留“走到庭院、进入体验、留下回信、获得行路能力、继续探索”的控制器外壳；替换三庭共用的格子、转子、连通判定与工具面板。新机制必须拥有各自的输入语法、空间构图和反馈，不能仍由 `rotate(delta)` 驱动。

最小可维护方案是 **一个旅程控制器，三个机制模块**。每个机制模块各自负责纯规则与三维呈现，主控制器只仲裁进入/退出、输入所有权、保存、暂停、回信与导航。不要把三套细节全部塞入 `main.js`，也不必为了本轮引入通用 ECS 或额外框架。

三个现有岛屿可保留作为入口，但当前岛中心半径约2.1、外圈约3.3–4.15，不能假装现有布局足以承载大型飞行或步行场景。近景绘画、立体摆放、拨弦等可利用现有空间；若采用行走或飞行，必须明确扩大/另建空间及碰撞支持，而非只拉远镜头。

## 当前模块与硬耦合

| 位置 | 当前行为 | v9 接入影响 |
|---|---|---|
| `src/letter-model.js` | 同时保存来信文本、坐标、奖励、回信和石盘拓扑；`evaluateLetter` 是逐源 BFS | 叙事身份可复用，玩法拓扑不能继续作为三个机制的共同接口 |
| `src/letter-controller.js` | 负责近身进入、选石、转石、撤销、提示、提交、下一程、路径标记 | 近身/追踪/导航可保留；`pick/rotate/chooseDirection/musicState` 当前全依赖石盘 |
| `src/letter-garden.js` | 三庭共用石片/沟槽/源花/花池，所有拾取都返回 tileId | 必须替换三庭构造，不要把第三套物体叠在原石盘上；源花材质和散聚周期可拆为独立组件 |
| `src/letter-ui.js` | 标题/原文/退出/下一程可用；其余 DOM 硬编码转石、端口、字母选择 | 建议重建轻量体验 HUD。不要用 CSS 隐藏旧字母盘后再塞大量机制分支 |
| `src/main.js:289–300` | `focus==='letter'` 时仅 pointerdown 调 `pick()`，pointermove 直接返回，未 capture 当前 pointerId | 现路径无法支持拖拽、绘画、拨动/释放，必须新增完整 pointer 生命周期 |
| `src/main.js:307` | 任意 letter focus 都禁止移动 | 角色行走类机制需要 per-mechanism movementPolicy，而不是复用这个全禁用判断 |
| `src/main.js:321–324` | 所有 letter focus 都使用同一俯视方向 `{x:0,y:8.5,z:4.2}` | 机制分别返回 cameraSpec；保留 `frameBounds` 对真实可用画布的适配 |
| `src/main.js:412` | letter focus 永远隐藏人物和同伴 | 绘画近景可以隐藏，协作/行走场景必须按 presentation policy 显示相应角色 |
| `src/exploration.js` / `exploration-model.js` | 旧三活动与来信石盘完全共享三个岛中心 | 新主玩法不能叠第三套。旧道具应迁走或移出当前主庭呈现/交互，历史记录保留 |
| `src/letter-wayfinding.js` | 按 p1/wind/bridge 进度建立真实陆路图 | 若沿用入口坐标可以复用；改岛或新地形时必须同步图和地面测试 |

## 建议协议

下面是接入建议，不是现有 API 或已实现功能。模块名可随最终设计调整。

```js
// 每庭的纯规则模块
{
  id,
  initial(),
  restore(raw),                    // 缺失字段、旧版与异常数值有确定处理
  reduce(state, command),           // 离散操作，返回新状态与语义事件
  step(state, dt, input),           // 连续操作，dt=0 不推进
  evaluate(state),                 // progress、readyChoices、可解释的下一步
  receipt(state, choice),          // 仅已达到玩法条件才允许确认
}

// 每庭的呈现适配器
{
  group,
  bounds(state),
  cameraSpec(state, viewport),     // direction/fov/sceneBounds；可另用跟随镜头
  presentation(state),             // actor、companion、movementPolicy
  hitTest(raycaster),              // 只回传可见目标，不执行奖励
  pointerToLocal(raycaster, hit),  // 自己的平面/曲面，不借主庭水面位置
  update(time, dt, state, input),
  snapshot(),
  dispose(),
}

// 主控制器对 main 的稳定边界
{
  group, activeId, nearId, trackedId,
  enter(id), exit(), reset(), track(id),
  pointerDown(event, raycaster),
  pointerMove(event, raycaster),
  pointerUp(event, raycaster),
  cancelInput(reason),
  handleKey(event), handleKeyUp(event),
  cameraSpec(), movementPolicy(), presentation(),
  musicState(),
  update(time, dt, context),
  snapshot(), dispose(),
}
```

主控制器构造回调可继续采用 `getState/onFocus/onExit/onBook/onContinue/onSound`，新增 `onCommit(candidate) -> saveResult`。`onSave` 用于有限大小的草稿检查点，不能在 pointermove 或每一帧同步写 `localStorage`。可在一次拖动释放、一次有效摆放、离开、失焦和已有低频 autosave 时保存。

纯规则的命令应描述动作，例如 `beginStroke/appendStroke/endStroke`、`grab/move/release`、`strike/listen/respond`；不应统一成 `rotate(index)` 或 `advanceStage()`。可保留一个通用 `undo`/重来入口，但撤销具体哪些状态由各机制决定。

## 输入与镜头：必须同步改的部分

1. **先判所有权。** Canvas pointerdown 先检查是否可交互（play、无 modal/hidden/shaderPreparing）。active experience 的左键输入交给模块；右键/双指按明确规则环看，不能同时影响机关。未命中可交互物时不要启动拖拽。
2. **捕获与释放成对。** 成功抓取后保存 pointerId，并调用 `setPointerCapture`；pointermove/up/cancel 只认拥有者。退出、开菜单、失焦、contextlost、重开、传送均调用 `cancelInput`，然后释放 capture。晚到的 pointerup 不得提交结果。
3. **不要用水面高度。** `main.setPointer()` 总能更新 raycaster，但返回的是主庭水平水面交点。三座侧庭高度分别1.6、2.5、1.1，当前石盘基准为1.9、2.8、1.4。拖拽应命中真实物体后锁定该机制的平面或局部空间，避免指针与对象错位。
4. **持续按键需要 keyup。** 当前 `letterController.handleKey` 仅接 keydown，且被处理的键不会进入主 `keys`。若新机制需要“按住/放开”，必须转发 keyup，并在 cancel 时清空自己的 held 状态。不可依赖操作系统重复 keydown 计时。
5. **独立手势。** `updateGesture()` 明确排除 letter focus，旧全局风笔不会在这里生效。绘画机制应拥有自己的拖动轨迹，再把渲染事件交给呈现层；不要悄悄打开全局风笔导致桥/旧种子同时响应。
6. **镜头分别表达不同空间。** 用 `frameBounds` 保证对象落在真实剩余画布：桌面避开侧栏，窄屏避开底部控制。斜视绘画、平视倾听、跟随移动不能始终共享同一俯视机位。拖动过程中使用当前 camera 做投影，保持拾取与画面一致。
7. **角色可见性与移动分开。** `movementPolicy:'none'` 不意味着必须隐藏角色；演奏可以显示站定的弥。协作场景显示同伴但确保可操作对象不被遮挡。将策略集中为一个接口，避免各处分支遗漏。

主循环在 hidden/modalPaused/shaderPreparing 时提前返回，时间和音频已有暂停基础；新机制应复用传入 dt，而不是独立 `Date.now()`、setInterval 或仍推进的音频时钟。诊断快照保持只读，不添加“强制过关”入口。

## 保存与历史叙事兼容

### 最小风险的状态方案

保留 journey/version=1、`letters.version=1` 和原有三个 choice 枚举；在 journey 内增加独立的 `experiences: {version:1, rain:{...}, wind:{...}, tide:{...}}`。新状态必须进入 `game-model.createState/serialize/restore`，并加入 `save-service.validatePart` 对嵌套 future version 的拒绝。`beforeLetter` 也是 journey，需同样验证。缺失 experiences 的旧档创建新体验初态，同时保留旧 p1/wind/bridge 和回信，绝不能因此重新锁路。

不要用“旧 choice 存在”伪造新玩法已经完成。可以允许老玩家继续旅行，同时说明这是此前留下的回信，新体验可自由回访。新体验的已达成步骤和当前回信是两个独立事实。

### 当前历史文本的隐藏风险

`lettersSent` 只冻结 choice/turns/read/moves，并没有冻结回信文字。`showLetters`、`letterRepliesHtml`、`postcard.js` 都从当前 `LETTERS.replies/goals/title` 取文字。因此直接修改共享文本会改写已经寄出的0.6春信。

可选的最小修正：保留 v1 内容映射，在每条 entry 增加 `edition`。旧数据中已有 choice 的 entry 默认 edition=1；新体验亲手完成时写 edition=2；所有文字输出通过 `getLetterText/getGoalLabel` 按 entry edition 获取。`restoreLetters` 必须保留有效 edition，`lettersSent` 继续克隆时保留它。不要只加全局 edition 后把整本旧信一次升级。

如果新版完全更换三庭身份/选择，可以另存 `experienceReceipts`，原 letters/lettersSent 当历史册保留；结束页和明信片分别显示新版成果与旧信。这更干净但触及UI范围稍大。两种方案由主设计选定，不能同时维护两套互相覆盖的“完成”权威状态。

### 回信提交应先保存再承认完成

当前 `letter-controller.commit` 先改 live `choice`、调用 `onReply` 发奖励，再调用 `onSave`，即使保存失败也显示“你的回信已经留下”。现有终局 depart/rewind 已有候选提交模式，新体验应沿用它：构造独立候选 → 规则验证 → saveService.commit → 成功后替换 live → 播放回信演出及奖励。失败保留未提交草稿和明确恢复出口，不让成功文案掩盖丢档。

能力仍可映射原进度：rain 成功置 p1.solved，wind 成功置 wind.solved，tide 提供可选追风预告。`onGardenReply`、`dash` 的恢复倍率、信册往返、`letterNextStep` 和 bridge 导航都依赖这些字段；迁移时不应另立第四套互斥关卡进度。

## 场景、声音和资源归属

现有旧 exploration 的三个中心与 letters 完全重合，且只在 letter focus 隐藏旧装置。若直接新增三种造型，漫游时仍会看见重叠道具。主庭应只有一套当前玩法：旧装置移至独立支路，或暂停它们在主庭的呈现和 interactive，保留旧完成记录；源花独立组件可以共享。

现有 `world.respond()` 仅触发通用同伴回应，不能替代各机制完成后的真实空间变化。每个模块应根据持久成果重建其场景：种出的植物、展开的帆、演奏后停留的音符/灯光都由规则状态驱动，刷新后可再看见。

`audio.event` 目前支持 letter-turn/connected/reply 及 burst/plant 等。新机制应发送语义声音（划过、接触、松手、拨弦、落定），避免绘画每个采样点都发完整和弦。限制每秒事件/并发声部，离开与暂停清理待调度事件。既有7种采样和9种CC0音效可复用，旋律/配器由新操作状态改变；不能三庭都以同一石片敲击作反馈。

资源 ownership 沿用已有 Set 的幂等 dispose 模式；同一机制每次进入不重新分配纹理和几何，每帧只更新已有 BufferAttribute/实例矩阵。新几何或材质增加后重新检查编译等待，不能沿用0.6的启动/帧率数据。

## 主任务可按此顺序接入

1. 定下三种不同动作与具体空间，写各自成功/失败/重试/自由表达的条件；每庭先给一条能用真实输入走通的完整路径。
2. 新纯状态与迁移、历史文本 edition 先落地，保留0.6 raw archive fixture。
3. 实现三个独立 view/model，统一主控制器的 pointer 生命周期和 cameraSpec；先不动终局和存档服务架构。
4. `main` 只做输入路由、视角/可见性策略、暂停与候选提交；替换旧三庭工具 HUD 和来源文案。
5. 实际沿路完成三种玩法、退出/重访/重选，再过桥与种核结尾；保留以普通输入获得的新 archive。
6. 固定候选之后再做同版本画面/音频/移动/存档/持续运行，最后复制已测字节到5192；旧0.6包和证据保留。

## 有意义的验证范围

- **纯规则**：每庭真实操作序列、错误操作可恢复、相同总动作但错误空间条件不算完成、dt=0不推进、无效输入/大dt约束、重来不清除其他庭成果。不要只断言实现里写的常量。
- **持久化**：旧无experiences档、旧已结束lettersSent、部分新进度、未知嵌套版本、导入取消、写失败、双页冲突；旧回信文字和明信片须保持原版。
- **输入整合**：mouse/touch拖出canvas再松手、pointercancel、第二指介入、拖动时开菜单/失焦/退出、键盘按住后退出。不能残留抓取、画笔、音符或自动通关。
- **实景路线**：玩家步行到入口，真实pointer/keys完成三种不同机制；不能用state setter代替新体验。可用只读 `window.__SPRING__.project(x,y,z)` 定位可见目标，但不得用诊断对象修改进度。
- **布局**：1440×900和390×844实际拖拽对象、读取提示与退出；确保模块可玩区域避开HUD，不只是截图看起来摆得下。
- **声音**：录制游戏本身AudioContext；分别听见/分析三个动作路径的输出，静音、暂停和离开无残留；客观音量结果与人工听感结论分开。
- **性能**：同一阶段重复进入/退出、完成/重来后资源计数有界；检查首次输入到画面、连续拖动帧间隔和暂停恢复。0.6素材切换长帧属于已知历史，不能被新功能通过掩盖。

已有可复用测试入口：`tests/save-ending.test.js` 的真实生产函数VM事务检查、`tests/field-action-input.test.js` 的E优先级、`scripts/v6-input-helpers.cjs` 的普通行走与世界投影、`scripts/v8-save-ui-check.cjs` 的实际保存UI、`scripts/v8-full-play.cjs` 的真实新旅途与存档结果记录。旧v8 full-play中的转石选择器和解法必须改写，不能直接当v9功能证明。
