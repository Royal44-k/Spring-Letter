# v6 体验设计与接线独立复审

2026-11-19。本页保留两个历史阶段：最初接线期间的CPU审查，以及后来候选E的启动成本调查。阅读范围为设计稿、`main.js`、`navigation.js`、`flower-cycle.js`、`flower-lesson.js`、`journey-guide.js`、`delivery.js`、`index.html`与故事文案；最初审查没有启动本机WebGL游戏，加载组件另做独立DOM/CSS预览。下文的“当前”“待测”和建议均指对应阶段，不表示冻结候选G仍存在同样的问题，也不将后续结果倒写为最初已知。

## 冻结候选G的后续状态

当前G为 `/assets/index-BAJMaxNn.js`、`/assets/index-B12KydA1.css`。[界面11项](../../spring-letter/evidence/v6-interface.json)已有同版普通输入记录：实际全屏、设置暂停与恢复、持续横移时镜头跟随、双指环看与缩放、抬指后再次破开、衣橱重载和竖屏布局。[主线11项](../../spring-letter/evidence/v6-main-play.json)、[取消6项](../../spring-letter/evidence/v6-seed-cancellation.json)、[窄屏终庭10项](../../spring-letter/evidence/v6-seeds-mobile-delivery.json)和[保留支线17项](v6-retained-content-verification.md)分别记录其实际操作范围。

这些报告不等于下文每条早期建议都有独立断言：例如2–3像素细步拖动、所有Q键距离、回溯后每一种声音偏好、操作系统后台行为不能仅因整章可通关就标为逐项已测。真实手机、外部新玩家理解、主观舒适度和艺术质量仍有独立边界；G的45分钟持续运行尚待最终结果。以下历史分析保留原来的观察和推导。

## 已实现与已验证：加载组件

`src/loading-scene.js`与`src/loading-scene.css`现为三个原创SVG场景：晨雾莲湾、琥珀风廊、星夜花帆。画面包含前景植物/人物、道路、水线、远山与当地地标；SVG/CSS少量动效，不创建WebGL context，不启动RAF。无外部图片或付费服务。

- API：`mountLoadingScene(element,{reducedMotion=false}={})`返回`setStage(key,message?)`、`complete()`、`dispose()`。阶段键为assets/garden/light/ready；阶段由主程序触发，不由定时器伪造。轮播每6.5秒，完成即淡出，不等待一整轮。
- 11项独立检查、9个视图：1440×900、390×844、844×390各三景；无横向溢出，标题和底部不相撞；视口变化调整焦点。实际检查图片，不仅检查DOM。
- 正常等待6.7秒后切到第二景；OS减少动态与保存偏好true都暂停自动轮播并关闭CSS运动（显式false不能覆盖OS）；early dispose和并发/重复complete清理计时器。complete后隐藏，不在幕后继续计算。
- [复现脚本](tools/verify-v6-loading.cjs) · [预览报告与源文件SHA](../../spring-letter/evidence/v6-loading-preview.json) · [晨雾](../../spring-letter/evidence/v6-loading-1440-0.png) · [风廊](../../spring-letter/evidence/v6-loading-1440-1.png) · [花帆](../../spring-letter/evidence/v6-loading-1440-2.png) · [竖屏](../../spring-letter/evidence/v6-loading-390-2.png)。

范围限制：这证明组件及其与当前基础CSS的布局、状态接口和销毁；不证明主游戏预热时帧率，也未证明最终发行包的载入连续性。主程序同步造景之前需要给浏览器一次绘制机会。

## 最初接线阶段：当时已报告修复，待整包复验

1. **右键轻点被当成打散。** 原pointerup只看是否移动与花体raycast，没有限定左键，违背右键环看。根代理已报告加入按钮限定。
2. **慢速连续拖动被当成点击。** 原pointerMoved判断用每次相邻事件dx/dy，而startPointer不断改写；每次2–3px的长笔画抬手仍可触发点击。根代理已报告改为按下起点的总位移。需要真实细步拖动测试，而非只用一次大mouse.move。
3. **非近花Q意外触发花尘。** 根代理已报告限定Q到近花/图库。
4. **加载画面未及时绘制、阶段跳过。** 组件挂载后main立即同步造景直到HDR await，加载初见可能静止；原只调用assets/light/ready。根代理已报告garden+两次RAF后再造景，HDR阶段不倒退。

## 最初接线阶段：问题与当时的修复状态

### 终庭返回按钮仍使用旧寄出条件

审查当时`#depart`已改名“回到花庭中”，handler只负责exitFocus；但`syncCores()`仍在存在未安放种核时disabled=true。另`interact()`退出focus只覆盖flower/wind/branch，遗漏finale/pool。于是到彼岸z约-39.5按E进入终庭说明时，返回按钮不可用，再按E重复打开面板。

建议：将说明面板返回始终可用；E在任何主动focus都先退出，除非当前局部玩法明确占用E。旧data-core/data-purpose已不存在，旧循环和activeCore可清理，避免继续混入桌面分配状态。真正寄信只保留现场启程台→一次摘要→确认路径。随后读取新源码已确认：`syncCores`返回按钮始终可用，`interact`任意focus先退出；仍待整包普通输入复验。

### 封面设置在开始新旅途时丢失

`showSettings()`和全局声音按钮允许封面修改settings，但`save()`在cover/gallery不保存；`startGame(false)`调用createState覆盖当前settings。因此玩家先静音/启用轻缓动态/关闭随行，再点开始，会恢复默认。

建议将偏好与存档进度分开；最小可接受处理为新旅程继承当前settings，并启动时读取上次偏好。清空剧情进度不应等于打开声音。游戏内轻缓设置若持久化，加载组件也应采同一偏好，不只读取OS媒体查询。随后读取新源码已确认独立preferences key、新旅程继承偏好、加载挂载传入保存的reducedMotion。加载组件11项独立检查包含OS正常但保存偏好true的路径。另发现ending-rewind直接恢复checkpoint.settings，会覆盖玩家刚改的偏好，已反馈需在回溯时保留当前settings；该处尚未声明实机验证。

## 最初接线阶段：首幕与叙事一致性建议

1. **旧日记叶片仍解释45–60%玩法。** `journal.leaf`现在还说“完全开放的花很美，却留不住一束方向”“花开到一半…照见水下旧路”，而首幕已改为打散、写风、归形。建议日记名改为“归来的花”，正文如：“花尘散开以后，仍记得每一片花瓣的位置。你写下的风停了，光却没有离开——它回到花里，也落进了水下的路。”旧台支线的半开姿态有历史意义，应保留在那里，不能误当当前操作规则。
2. **最后序章句仍把玩家导向开花。** OPENING最后一句“先让眼前这朵花透进光”可改成“这朵花还记得风。你走近时，水下的旧路也仿佛轻轻亮了一下。”操作由随后靠近花时的单条提示承担。
3. **首幕卡住反馈要具体。** 现在破开→有效笔迹→归形三阶段逻辑比比例门槛合理；若玩家只点花后观赏，回归后仍未完成，必须说明“再给花尘一阵风”。不要只重复含糊的“让它换一种生命”。普通输入首玩时需确认这一分支被实际看见。
4. **谨慎减少英文口号。** 设置的MAKE ROOM FOR YOUR OWN PACE、地图的AN ATLAS OF UNSENT SPRING、拾光册的COLLECTED LIGHT等与可玩状态无关，可直接换成“行走与声音”“花庭图”“旅途中留下的回声”，或去掉small元素。保留作品副标题/资料来源中的英文不影响中文游戏辨识。
5. **少用抽象的进度词。** “保存、滋养、远行”在说明中可帮助归纳，但现场动作要写“拿起种核”“种在这里”“重新带走”“看看这封春信”。当前delivery的actionLabel方向正确；不要回退到“核心一/二＋分配”的表格语言。

## 最初接线阶段：相机方案复核

当前travel controller将连续输入手势的移动basis与相机yaw分开，能从结构上阻止A/D自反馈绕圈；实际位移决定heading，移动累计≥.3秒才自动转；手动拖动设1.8秒优先窗口；停步不自动追；C可主动回正。它符合本轮研究建议，具体舒适度还需实际测试。

重点整包路径：持续A三秒、WA斜走、S掉头、松开后停步观景、转身中手动拖动、碰到坡边导致轴向滑动、近花退出到漫游、C在静止状态。检查的是路径与构图，不仅比较yaw数值。当前预看距离由movingTime阈值开关，会经lookGoal阻尼过渡；低帧率/急停仍需看实际画面。现有terrain高度保护与遮挡淡化不等于完整建筑碰撞；穿柱/穹架的可能性需实景确认。

## 最初接线阶段：方案可用性判断

新的核心循环与用户意见一致：花体和粒子同源、颜色跟随系列、打散后有可玩的时间、镜头分担导航、种核选择回到现场。它比继续增加展柜按钮更有希望形成自然体验。

但所有“更顺手/更有趣”的判断仍待实际首玩。现有阅读与组件检查不能代替独立从新存档完整游玩；尤其首幕自动近看是否突兀、风廊牵引范围是否一眼理解、种核花座在变动视角下是否可见，必须以普通输入观察后再下结论。

## 候选E启动调查：历史CPU排查与后续量测

候选E首启出现约51秒加载、其中约46秒预热的专项记录后，最终回归暂停，根任务开始独立对照构建。本段是本地 Three.js 0.185.0 源码与实际材质对象的CPU核对，不将推断写成已测得的提速。

**调查时预编目标与实际渲染目标不同。** 候选E的 `compileAsync(scene,camera)` 时 renderer 的 target 为 null，[WebGLPrograms](../../node_modules/three/src/renderers/webgl/WebGLPrograms.js) 会为物理材质选择屏幕输出色域与 ACES tone mapping；实际 [RenderPass](../../node_modules/three/examples/jsm/postprocessing/RenderPass.js) 和 [Reflector](../../node_modules/three/examples/jsm/objects/Reflector.js) 都切到普通 render target，使用工作色域与 NoToneMapping，再由 OutputPass 输出。因此同一材质可能被准备两种不同的程序。当时建议预编时临时绑定 composer 的 readBuffer，使用 finally 恢复原 target，随后仍做真实反射与 composer 渲染。改 target 不是关闭色彩管理，输出阶段继续由原 OutputPass 负责。

**琥珀与青釉可共享预热代表。** [CPU材质比较](v6-material-variants-cpu.json)实际构造本作花体，遍历6类部件、morph属性、UV/normal以及不透明/透明两态。琥珀与青釉的功能签名相同：clearcoat、iridescence、sheen均启用，仅瓣/苞有transmission，颜色和强度等差别为uniform。流晶另有dispersion而无iridescence/sheen，不能代表两者；月银与粉瓷也有各自功能组合。此比较没有创建renderer，不宣称已经观察到GPU缓存复用；以实际program计数与首切换长帧为准。

**仍需保留完整渲染预热。** compileAsync只准备场景材质，不覆盖GTAO、bloom、输出、阴影及传输捕获的所有首次使用成本；粒子首次出现与花体透明态也不能从预热中删掉。E当时5系列×2状态的全场景遍历过宽，且compile采用`traverse`，不只处理可见对象。当时提出先比较“正确target＋4个代表系列”和“仅当前保存系列＋两态”，不要通过给所有材质强塞非零特性、全局关阴影或取消归形透明来换取表面数字。

量测应分开记录编译、反射、composer渲染和总等待，并记下程序数量。首次新浏览器上下文不代表驱动着色器缓存必定为空；冷热运行顺序、硬件/后端与并发GPU活动都应注明。其他系列若采用首次选择时准备，必须另验首次换色；不把启动成本转移到玩家点击后的卡顿而不报告。

后续对照已经完成：[预热实验与最终取舍](v6-startup-optimization.md)。正确目标与代表系列方案初始化约16–17秒，程序108；原全系列约32–33秒、程序170。仅初始系列方案虽更快启动，却出现约2.4秒首次流晶停顿，已拒绝。实验结果在F集成、G继续保留；对应F报告固定链接归档，G当前回归另见本页补记，不把独立实验数值改称G的整包帧率。
