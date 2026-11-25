# v8 首开审计与花材采样优化

2026-11-21。先完成只读审计，随后按主任务分工，仅在 `botany.js` 实施颜色采样缓存并增加测试；本子任务未修改 main、音频、机关或渲染模块，也未启动浏览器/GPU。当前首开数值来自已有 first-look 记录；下面的 CPU 数据是本轮 Node 测量，不能当作浏览器帧率。首开与候选预热的实现由主任务另行验证。

首要建议：**首开只准备当前花材及必要的消散状态；其余花材按用户意图预热。与此同时，切换花材应复用表面采样结果。** 保持默认花瓣、机关、阴影、AO、反射的品质参数，不以降低粒子数或分辨率换启动时间。

## 已核实的成本

`spring-letter/evidence/v8/first-look/snapshot.json` 记录初始化 15881.9 ms，其中 warmup 12718.8 ms，加载层消失于 16534.2 ms。warmup 占初始化约 80%。该记录在雨庭时有 123 个 program；这不能单独证明内存泄漏，也不能视为首屏 program 数。

`main.js` 的 warmup 依次使用 crystal、lily、amber、silver。每一种都做实心与半透明两次 `compileAsync(scene,camera)`，随后各进行完整水面反射与 composer 渲染，共八次全场景预编译和八次完整管线渲染。相同的静态 shader 会命中缓存，并不是每一轮都重新编译全部 shader；新增材质特征、透明状态、反射/阴影/法线通路仍会引入不同程序。

本地 Three r185 的 `WebGLRenderer.compile()` 对待编译对象使用 `scene.traverse()`。因此 `.visible=false`、隐藏庭院或关闭棋盘，**不会**把这些子树从预编译集合移除。灯光收集才使用 `traverseVisible()`。`compileAsync()` 先同步发起 `compile()`，之后轮询各材质当前 program 的完成状态；它并不把所有 JS 工作移到后台。

官方 API 接受 `compileAsync(object,camera,targetScene)`，可只编译一个对象或子组，并从真实目标场景取得灯光与环境。KHR 扩展提供非阻塞的完成状态查询，不能保证总编译时间更短；无该扩展时，r185 的 `isReady()` 直接视为完成，首次实际使用仍可能停顿。[Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)、[KHR 扩展规范](https://registry.khronos.org/webgl/extensions/KHR_parallel_shader_compile/)

本轮 Node 三次串行 CPU 测量（毫秒，未实例化 renderer）：

| 操作 | 观测范围 | 意义 |
|---|---:|---|
| createLandscape | 179–326 | 地形/合批创建有成本，但远小于已有 12.7 秒 warmup |
| createLetterGarden | 52–80 | 三庭共享实例材质，不宜先拆成延迟可用的玩法模块 |
| createBouquet | 97–143 | 首次花型几何生成 |
| 首次 sampleSurface(65536) | 90–126 | 包含首次表面表构建 |
| 已有表面表上再次完整采样 | 46–81 | 仅切花材取颜色仍支付此成本 |
| 首次 lily 材质 | 89–118 | 首次程序生成花瓣纹理；其他材质赋值通常低于 2 |
| 换花型重建 | 通常 76–259 | 另有一次 iris 956 ms 离群值，不能推算浏览器表现 |
| 换花型后首次采样 | 86–279 | 与几何重建叠加，不能由 shader 预热消除 |

上述测量仍会受系统负载和 GC 影响，适合定位操作量级，不是验收基准。

## 建议的实施顺序

### 1. 先测每一个阶段，再缩小首开工作集

保留当前对 composer 线性目标预编译的做法。先为八个编译/反射/合成阶段分别记录 `performance.now()`、program 增量和分配量，区分首次静态程序成本与后续花材成本。不能把 12.7 秒简单除以四来承诺改后的等待时间。

第一版最小变更可只预热保存设置中的当前系列：实心一遍、消散/点场组合一遍，再恢复状态并渲染真正的首帧。两个 HDR、当前首屏的纹理、阴影、AO、反射、输出 pass 仍须完成；保留同一套画质。当前系列可能是晶体，不能假设每个人都用 silver。

进一步缩小时，显式选出首屏需要的对象子树，并调用第三参数为真实 scene 的 `compileAsync`。仅依靠 visible 或 camera layers 不够。不要把真实对象 `add()` 进临时组而改变其父级；可直接编译真实子组，或者构建轻量代理，保留实际几何、材质、morph、instancing、receiveShadow 等会影响 shader 的特征。

留一次真正的 composer 和反射渲染，用于 shader 之外的纹理上传、缓冲建立、传输目标、阴影/法线 pass 初始化。`compileAsync()` 不等同于这些资源都已准备完毕。延迟到首屏后的场景资源需要在玩家靠近前排队准备，不能到进入棋盘时才整块同步创建。

### 2. 非当前花材用稳定的候选材质预热

首屏可交互之后，在空闲时排一个候选系列；`pointerenter`、键盘 `focus`、进入鉴赏台等用户意图提高其优先级。触屏没有可靠 hover，点击时若尚未准备好，保留当前完整花朵并显示短暂的“正在准备材质”，候选准备完毕再一次性切换。快速多次选择使用请求编号，以最后一次选择为准。

预热必须用稳定的候选材质/代理，不能在后台把屏幕上的同一 bouquet 反复改成其他系列。`compileAsync` 的完成检查引用材质的 `currentProgram`，等待中继续改变同一材质会让状态难以判断。候选可按“系列 × 植物角色”缓存，最后直接交换到已准备的材质；所有缓存要有明确释放路径。Amber 与 celadon 的特征一致时只需预热一个特征组合，颜色仍保持不同。

后台调度还必须修正当前 `compileForComposer()` 的 render-target 生命周期：

```js
const previousTarget = renderer.getRenderTarget();
let ready;
try {
  renderer.setRenderTarget(composer.readBuffer);
  ready = renderer.compileAsync(candidate, camera, scene);
} finally {
  renderer.setRenderTarget(previousTarget); // 在等待 promise 前恢复
}
await ready;
```

当前启动阶段尚无 RAF，所以跨 `await` 持有目标没有竞争；移到后台后就不能沿用。若需要候选实际 draw，用独立的小目标和受控 staging 场景；目标颜色空间、灯光、环境、雾、传输/透明特征必须与实际管线一致，之后仍验证真实反射与 composer 首次显示。不要为了预热重复八次整场景 AO/反射。

`requestIdleCallback` 只决定何时开始 JS，不会限制同步编译调用或驱动的执行时长。每次只启动一个任务，长帧后暂停低优先级任务。不要同时 `Promise.all` 改写同一组材质来追求“并行”。

### 3. 消除系列切换的重复 CPU 采样

`switchFlowerSeries()` 当前调用 `sampleSurface(65536).colors`。`sampleSurface()` 虽缓存三角表，但每次仍分配 closed/open/colors 三个数组，二分抽面并重算两个姿态的位置。只换材质不改变点的位置，可按 form/count/seed 保留 closed/open、role、grain、uvTint；仅重新计算颜色。保持同一个随机序列与粒子 ID，不会改变视觉密度、分布或回聚目标。

单个 65536 点姿态数组约 0.75 MiB，closed+open 共 1.5 MiB，colors 另 0.75 MiB。缓存当前花型与一个候选花型已能避免大量重分配，无须无界缓存所有组合。再次选择已激活的 form/series 直接返回，不再次重采样和写存档。初始化时先应用保存的 form/series 再采样一次，避免尾部两个 switch 又做重复采样。

首次自然花纹理可预生成到候选缓存。换花型的几何构建同样不能由 compileAsync 解决：先准备下一花型，再提交；若仍有长任务，可分批构建/采样或在 worker 计算数组，保留原细分数。只做 CPU 缓存预计已能解决重复切换的大部分确定性成本，worker 应在浏览器计时证明需要之后再引入。

### 4. 资源下载可并行，材质安装须在编译前完成

当前 studio HDR、sunrise HDR、白灰泥贴图、苔石贴图、garden surfaces 是串行 await。可同时发起网络读取，再按依赖安装：花仍使用 studio 环境，场景仍使用 sunrise 环境，保持视觉不变。PMREM 转换和后续 GPU 操作需受控执行，不以多路无节制提交换主线程拥塞。所有会改变材质特征的 normalMap/roughnessMap/自定义 hook 安装完毕后再编译，避免先编一种、贴图到达又编一种。

音频不在当前首开阻塞链：AudioContext、噪声图和样本加载都在用户操作调用 `unlock()` 时启动，init 未等待 `ready()`。因此不应把首开 16 秒归咎于音频。可在首屏后预取样本 ArrayBuffer、用户手势后再解码与启动，改善开始游戏的首个声音；不要为此把音频等待加回加载门槛。

## 验收方法与取舍

1. 保存改前/改后固定场景图：默认花、晶体传输、自然花纹理、半透明消散、昼夜、棋盘源头与目标；保持 DPR、画质和相机一致。
2. 每版至少三次新浏览器上下文启动，交替 A/B 次序，区分 HTTP 缓存和驱动 shader 缓存；新页面不等于驱动冷缓存。记录 total/overlay、逐阶段耗时、program 增量、扩展支持、主线程长任务。
3. 首屏立即开始、立即进入鉴赏台、立即切晶体；之后按 silver→crystal→lily→amber→celadon→silver 反复切换并消散/回聚。记录点击处理耗时、点击到稳定新画面的时间、切换附近最大帧间隔。稳态 60 fps 不能代替这组指标。
4. 测 hover 后选择、纯键盘 focus、触屏直接点、连续快速选三种、预热未完成就离开、上下文中断等路径。候选预热不得改变游戏进度、当前材质设置或音频时间。
5. 连续 20 次往返后，program/geometry/texture 数应进入有界平台；对比默认画质，不减样本、不改透明/反射效果。首次尚未完成的系列允许可解释的短暂等待，但画面与输入不能整段冻结。

取舍是把用户未选中的材质准备从首开搬到可取消的候选队列，并用少量有界缓存换重复切换流畅度。最终减少多少首开等待、能否达到预定切换帧间隔，必须用上述浏览器 A/B 记录确认；下述取色 CPU 优化不能替代该验收。

## 已实施：有界表面采样缓存

`botany.js` 现仅保留当前花型、最近一次 count 的私有采样；seed 由 bouquet 构造固定。缓存包含两个 Float32 姿态、角色分组、grain、tint、openY。grain/tint 使用 Float64，继续执行原有随机序列、逐次 Float32 累加与颜色运算顺序。

- `sampleColors(count)` 只返回新的颜色数组。相同 count 时不再抽面或重算姿态。
- `sampleSurface(count)` 继续返回三个调用方独立持有的数组，修改返回值不能污染缓存。
- count 更换、花型更换及 dispose 均不会保留多份采样；0 count 替换为空缓存。新增只读 `series` / `variant` getter，供调用端处理相同选项。
- 65536 点时保留约 2.81 MiB 采样元数据；只换材质分配 0.75 MiB 输出颜色，不再为无用姿态分配另外 1.5 MiB。

修改前的完整 botany 模块保存在系统临时目录，只有 import 路径调整为绝对地址。独立 Node 对照测试验证了 **4 花型 × 5 系列 × 2 变体 × 65536 点**，三个完整 Float32 数组以及新 `sampleColors` 均逐元素一致。正式测试不依赖该旧模块，而是使用修改前采样的完整数组 SHA256 fixture，覆盖全部 40 个组合，另覆盖调用方修改隔离、count/form 变更、空输入、无效输入和 dispose。

`node --test tests/botany.test.js tests/botany-sampling.test.js tests/particles.test.js tests/flower-return-integration.test.js tests/flower-cycle.test.js tests/stroke-motion.test.js`：42 项通过。

同一 Node 进程交替运行旧/新实现，每系列 7 次、65536 点、已有采样表的 CPU 毫秒中位数：

| 系列 | 原完整采样取色 | 新 sampleColors | 新 sampleSurface（含独立数组） |
|---|---:|---:|---:|
| silver | 37.715 | 1.501 | 1.798 |
| crystal | 42.760 | 2.911 | 3.681 |
| lily | 41.330 | 2.880 | 3.191 |
| amber | 43.967 | 3.075 | 3.212 |
| celadon | 43.266 | 2.971 | 3.181 |

新 colors-only 的最大观测值为 7.753 ms。完整原始记录在 `spring-letter/evidence/v8/botany-sampling-cpu.json`。这不包括纹理创建、GPU 上传、编译、反射或 browser input-to-frame；首次花型生成与第一次采样仍需原有工作量。

## release-d 浏览器观测补记

首屏改为仅准备当前系列，其他系列第一次选中时准备，已完成的材质程序继续复用。此次 [视觉记录](../../spring-letter/evidence/v8/visual-2026-11-21T04-20-19.144Z/report.json) 的首个上下文准备耗时6994.3毫秒、加载幕结束7648.5毫秒；不是驱动冷缓存基准，不能把之后缓存续玩的约两秒启动替代这个数字。

[持续运行](../../spring-letter/evidence/v8/soak-2026-11-21T05-43-50-075Z/soak.json) 在1280×800下完成539.179秒、7轮。35个重叠诊断窗口中位帧间隔约16.7毫秒，最差窗口p95为33.5毫秒、p99为50.1毫秒；最大1435.2毫秒出现在第一轮批量切换后的窗口，后续轮次该窗口仍有约451–518毫秒峰值。雨庭后续窗口最大约50毫秒。由于窗口覆盖前一段时间，这只能说明关联，不能当作调用栈归因；多个重叠窗口也不能相加计算样本总数。

资源计数有界与不存在长帧是两种结论，本轮只证明前者通过该路线检查。下一步应对换花型的几何创建、首次采样、源花重建、纹理上传与GPU驱动分别取样；在有证据前不以减少粒子或省略材质替代性能定位。当前版本不承诺全程稳定60帧。
