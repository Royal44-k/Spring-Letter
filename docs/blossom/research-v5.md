# v5 自主研究：把观看变成可玩的路

2026-11-19。延续此前Showreel、SAEL、MotionSites、Codrops、Evan Wallace、Outer Wilds、COCOON、Gorogoa的研究，本轮把筛选条件收紧为：是否能帮助玩家观察、移动、施力、发现结果，以及是否有免费、明确许可的可用资源。

## 新增一手观察与采用决定

|来源|这次实际接触的证据|采用的设计方法|
|---|---|---|
|[Starry Nightrider，作者站](https://starrynightrider.com/)|公开页面进入实际3D街道，以W骑行和Space跳跃；截图和操作记录保存在 research-v5-screens。未聊天、发分数、购买或拷贝作品资产|明确的角色轮廓、道路透视和远处地标一起告诉玩家往哪里走；艺术材质应该贯穿环境，而不只是放在一个中心展品上|
|[Sword of the Sea，PlayStation 官方试玩观察](https://blog.playstation.com/2025/06/05/sword-of-the-sea-hands-on-report/)|阅读官方发布平台上的作品介绍与玩法观察；本轮没有购买或亲自试玩成品|移动本身与恢复环境形成联系。本作据此把新内容放进实际可走的庭院，并让完成后长出的花永久留在场景里|
|[Sky，2026年10月官方更新](https://www.thatskygame.com/news/this-month-in-sky-october-2026-edition/)|核对当期故事角色、航海探险与不同活动的官方说明；未把活动商店内容当成免费资产库|世界可通过人物、小活动与环境变化保持多种节奏。春信的三庭分别使用描环、引种和静听，不复制同一任务外壳|
|[Codrops Creative Hub](https://tympanus.net/codrops/hub/)|查阅3D、粒子、音频、玻璃和交互案例目录，以及作者教程|学习持续输入、局部受力和可见轨迹的关系；具体实现与证据见 v5-particles 和 v5-bridge-weaver 文档|
|[Three.js GTAOPass 官方文档](https://threejs.org/docs/pages/GTAOPass.html)|文档与项目锁定版本的源码互相核对|采用半分辨率接触遮蔽；玻璃、水、雾和点场保留自己的光学，轻盈档关闭。可选效果失败时必须恢复隐藏物体与渲染状态|
|[EZ-Tree 作者仓库](https://github.com/dgreenheck/ez-tree)|景观作者阅读MIT许可与枝干生成结构，查看项目演示|参考主干—分支—细梢的层级与几何预算；本作柳树程序独立制作，没有引入其树资产包|

以上“采用”是设计推论，不是这些作者对本作的评价。公开可看不等于图像、模型或代码自动可再分发。

## 指定网站与热点，保留证据边界

[Showreel](https://showreel.design/)、[SAEL](https://sael.net/)、[MotionSites](https://motionsites.ai/)此前的实际页面研究已见研究v3。本轮再次用公开目录扩展案例；Showreel文本访问返回403，不能用搜索摘要冒充重新看过交互。MotionSites收费提示/MCP方案继续排除。

[Bruno Simon](https://bruno-simon.com/)与[What the Water Keeps](https://what-the-water-keeps.vercel.app/)本轮浏览器访问超时。保留失败记录，不写成已试玩。Starry页面一直残留加载文案，但点击进入后实际截图已显示角色、街道与移动后的视角；因此仅确认短暂实景操作，不宣称完成任务或长期稳定。

用户提到的Fable 5.2射击案例已在 [Saltline证据复核](fps-case-v3.md) 区分原作者发布、原始artifact与第三方镜像。本轮也核对 [Anthropic Fable页面](https://www.anthropic.com/claude/fable) 及发布资料。短浏览器关卡、一次提示触发的长时间代理运行、完整3A生产体量是不同问题。我们采用可检验的生产方法：先让输入和规则成立，再做环境与物件，持续看实机，保留失败与修复证据；不购买案例所用的付费计算方案，也不把“一句话”当作省去验证的理由。

## 真正进入发布包的新增免费资源

|素材|官方来源与作者|文件及使用|
|---|---|---|
|Spruit Sunrise 1K HDR|[Poly Haven](https://polyhaven.com/a/spruit_sunrise)，Greg Zaal，CC0|1,500,948字节；白日室外环境。主花仍使用Studio Small 09的受控棚光反射|
|Mossy Rock 1K OpenGL法线与粗糙度|[Poly Haven](https://polyhaven.com/a/mossy_rock)，Rob Tuytel，CC0|995,727＋780,918字节；地形、岩石、墙、树干的低强度微表面，不把整张漫反射硬贴成新风格|

官方API元数据、下载原文件与散列留在项目 public/assets。MD5与API记录一致，SHA-256见 public/assets/v5-source-hashes.json。许可来自 [Poly Haven许可页](https://polyhaven.com/license)。没有下载高分辨率位移包，没有购买模型或音乐，没有运行时远程素材请求。

## 从研究到本轮实际修正

- 参考花朵的亮不是单纯泛光：保持卷瓣曲率、银的薄膜厚度、晶的透射，以及自然花的绿色茎叶；三者都在同一模型上实拍比较。
- 原片点云的力量来自源形、密度和局部扰动。本轮保持同源采样，加入保形骨架、曲带与细丝，降低受力区洗白，散形时背景连续变暗。
- 作品可走，才有空间发现：两条环回侧路与一条池畔支路使用真实可见三角面做支撑检测；不能用远景装饰岛冒充可达区域。
- 教学必须响应动作：慢笔不散、快扫化尘；站桥上起笔要说明不能换桥；双指缩放不能误算松手；风种送达需要真实释放。
- 美术预算优先给主花与人物。减少背景草叶、小石台和远处细梢的无效面数，保留主花表面采样与近景轮廓。
- 结尾的情感要发生在世界里：实际杯声和同伴光脉冲先出现，回信随后展开。未做出的行为不写成“已经发生”。

这些规则将继续保存在项目知识手册；本轮主动学习的价值以进入作品的改动和可复核证据为准，不以罗列网站数量衡量。
