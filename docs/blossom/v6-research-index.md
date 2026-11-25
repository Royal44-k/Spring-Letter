# V6 研究、采用决定与验证索引

更新：2026-11-19。主题独立于金沙；制作路径只采用本地工具、原创实现和许可明确的免费资产。本页只组织已有资料和一手来源，不把案例宣传、独立实验或旧版验收当作当前完整游戏的证明。

**阅读顺序：** [V6 设计](v6-design.md) → [当前游玩剧本](v6-play-script.md) → [执行计划](v6-execution-plan.md)。早期文档中关于半开比例、长按种核和旧快捷键的描述属于历史；当前操作以 V6 剧本和最终候选实测为准。

## 从问题到实现

| 主题 | 本地研究与审查 | 本轮实际采用 | 证据边界 / 待验证 |
|---|---|---|---|
| 两段参考视频 | [逐帧分析](video-analysis.md) · [帧图册](frame-atlas.html) | 保留三花两苞百合、连续瓣形开合、银/晶/自然材质身份；同一花体采样形成花尘 | 2629 帧解码和全帧缩略表覆盖，关键帧放大；不等于每帧原尺寸逐一审阅。源站作者尚未可靠定位；原音轨尚无完整听觉复核，未宣称完美复刻 |
| 花形、实体与花尘 | [花形及材质研究](research-v6-flower.md) · [G界面原始报告](../../spring-letter/evidence/v6-interface.json) · [先前粒子结构](v5-particles.md) | 四种花形、五系列；粒子读取源花颜色；明确破开、漂游、运笔牵流和缓慢归形；换色不重置运动 | 55图仍属于独立光学实验场；G界面11项另实测四形五系列、实体与同源花尘。该轮首次破开周期12.736秒/763帧/最大18.1毫秒只对应该周期，不代表全程性能；花形曲率与原片仍有差距 |
| 加载页与启动等待 | [体验研究：加载演出](research-v6-experience.md) · [独立体验复核](v6-experience-review.md) · [预热对照实验](v6-startup-optimization.md) | 三幅原创 SVG 场景轮播、真实初始化阶段；尊重减少动态偏好、离场停止；预编译对齐实际composer目标，琥珀代表青釉，保留实体/透明粒子真实预热 | 独立实验初始化32–33秒降至16–17秒、程序170→108；并非清空驱动缓存。只预热初始系列会使首次流晶切换停顿约2.4秒，未采用。正式F与其他设备仍看其实际报告 |
| 随行镜头与手动环看 | [体验研究：相机](research-v6-experience.md) · [接线与偏好复核](v6-experience-review.md) · [G界面原始报告](../../spring-letter/evidence/v6-interface.json) | 按真实位移跟随、同次行走锁定输入坐标系、限速转向、手动优先、主动回正、关键建筑遮挡淡化；终庭兼顾离轴目标 | G已测持续横移与自动跟随、实际浏览器全屏、双指环看/缩放、衣橱偏好重载和竖屏布局；触屏为仿真，不等于实体手机，不将参数或自动断言称为所有设备无眩晕 |
| 主风廊与支庭送种 | [种子玩法研究](research-v6-seeds.md) · [规则复核](v6-seeds-review.md) · [普通输入审查](v6-seeds-play-review.md) | 统一按住牵引与松手落巢；不悬停施力；保留已完成的风门与可读软退 | 最终G主路11项与取消6项均有普通输入报告；此前候选独立保留。自动回归不是外部新玩家测试，不能证明所有玩家已理解引导 |
| 终庭两核三用途 | [种子玩法研究](research-v6-seeds.md) · [普通输入审查](v6-seeds-play-review.md) · [终庭与风廊美术记录](v6-world-polish-plan.md) | 一次拿取/安放/取回，携带存档，摘要取消不提交；灯、芽、帆不同轮廓；门柱后移，岸草土色融入岛面 | 最终G主路包含三种结局，移动端10项触屏仿真通过；仿真不是实体手机。旧遮挡与假阳性截图均保留，不能把旧失败改名为最终通过 |
| 渲染与长时诊断 | [渲染通道复核](v6-render-pass-review.md) · [G完整长跑](../../spring-letter/evidence/v6-soak.json) | G让AO法线通道暂时关闭两项阴影更新标志，再完整恢复；主场景继续逐帧投影 | 重复绘制量确定下降；三组短实验包含89.13ms慢窗口，不宣称帧率翻倍。F失败与约13分钟中断保留；G长跑47.004分钟、13轮351阶段通过，81组资源比较最大增长0。结果仅代表本机这套序列 |
| 初花庭构图 | [初花庭独立复审](v6-opening-art-review.md) | 一道薄主拱与低残肋、弧面法线平滑、局部哑光石材、减少金环刻度、落瓣压平并集中至岸边；保留短暂觉醒反馈 | 同机位 A/B 已独立看图，B 的花茎和静水轮廓更清楚，建议保留。石拱在暖光下略偏橄榄灰绿；石材仍带整块涂层感，不宣称电影级质感 |
| 叙事、角色与支线 | [V6 游玩剧本](v6-play-script.md) · [V6 保留内容实玩](v6-retained-content-verification.md) · [前版叙事审查](v5-narrative-review.md) · [前版三支线实玩](v5-branches-play-verification.md) | 场景关系承载旧事、当下与远方；现场提示使用拿取、牵引、安放等可理解动作；工具面板减重 | 最终 G 恢复后两个新档普通输入：三支线9项、雨/潮及衔接8项通过，重载保留；写风后提前退出近景仍会自然归形开路。D/F原报告与E/G中断记录保留，部分截图不计完整通过。未进行外部新玩家盲测，不代替审美与叙事评价 |

## 直接影响本轮决定的一手来源

| 一手来源 | 采用到哪里 | 未采用 / 仍只研究 |
|---|---|---|
| [Flower 制作方](https://thatgamecompany.com/flower/) · [Sword of the Sea 作者说明](https://blog.playstation.com/2025/06/04/sword-of-the-sea-launches-august-19-on-ps5-as-part-of-playstation-plus-game-catalog/) | 动作、花尘、移动与环境回应保持因果 | 未复制关卡、角色、音乐或高速滑板玩法 |
| [Ghost of Tsushima 首席 VFX 作者说明](https://blog.playstation.com/2021/01/12/how-stunning-visual-effects-bring-ghost-of-tsushima-to-life/) | 风和环境反馈应属于同一个空间；引导帮助看路 | 未声称复现其完整风场、地形查询或引擎技术 |
| [GDC 实时相机设计](https://media.gdcvault.com/gdc05/slides/GD_Haigh-Hutchinson_FundamentalsReal-TimeCameraDesign.pdf) · [Cinemachine 跟随](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineThirdPersonFollow.html) · [环绕与回正](https://docs.unity3d.com/Packages/com.unity.cinemachine@3.1/manual/CinemachineOrbitalFollow.html) | 自动帮助、保留手动意图、阻尼与等待 | 以现有 Three.js 实现职责，不迁移引擎 |
| [樱井政博 Loading Screens](https://www.youtube.com/watch?v=JKV-30FD6NY) | 等待介绍世界，状态可读，准备好便进入 | 读取官方视频说明；未声称完整逐镜观看。无假百分比或强制轮播时长 |
| [皮克敏4 官方入门](https://www.nintendo.com/us/whatsnew/pikmin-4-guide-for-fresh-recruits/) · [智慧的再现官方提示](https://www.nintendo.com/en-gb/News/2024/October/10-tips-to-help-save-Hyrule-in-The-Legend-of-Zelda-Echoes-of-Wisdom-2668982.html) · [Xbox XAG107](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107) | 一致的操作关系、试错可撤回、减少日常长按负担 | 是本作设计推导，不把官方说明说成其内部实现 |
| [Three.js 物理材质](https://threejs.org/docs/pages/MeshPhysicalMaterial.html) · [作者 Flow Field Particles](https://flowfield.niccolofanton.dev/) | 体积和反射支撑流晶；同源目标、流场与平滑指针输入 | 本项目锁定的库版本优先；不直接搬新版属性，不借作者粒子数量承诺本机帧率 |
| [K-State 鸢尾结构](https://extension.k-state.edu/hort-judging/flowers-foliages/iris.html) · [RHS 睡莲](https://www.rhs.org.uk/plants/waterlilies/growing-guide) · [Kew 大丽](https://www.kew.org/plants/dahlia) · [大丽分类](https://www.dahlia-nds.co.uk/about-dahlias/classification/) | 三立三垂、层瓣杯状、放射卷瓣形成真实轮廓差别 | 原创艺术形态，不冒称植物扫描或精确品种重建 |
| [Matt Nava 的 Journey 开发回顾](https://bsky.app/profile/mattnava.bsky.social/post/3lbnlt5m2i22d) · [世界美术作者的构图方法](https://nvalchev.artstation.com/blog/7oYNO/the-power-of-composition-how-to-guide-a-player-s-eye-through-your-environment) · [Sony 对 Ghost 主创的直接访谈](https://www.sony.com/en/brand/voicesofcreativity/interviews/ghost1/) | 大小反差、留白、克制细节、先明确场景情感，再安排建筑和光影 | 未借用其商用素材；源码正确与截图漂亮均不足以证明达到其制作体量 |

## 指定网站与自主扩展

[网站溯源记录](research-sites-v3.md)、[V5 自主研究](research-v5.md)、[V6 体验研究](research-v6-experience.md)保留每次访问范围。

- **[SAEL](https://sael.net/)**：本轮再次读取公开目录；[Soap Bubble](https://sael.net/soap-bubble/)与[Prism Room](https://sael.net/prism-room/)用于学习输入和材料变化的可见关系。只研究，不将公开可看等同素材许可，不搬实验参数面板到游戏主流程。
- **[MotionSites](https://motionsites.ai/)**：本轮再次读取目录，作为发现作者的入口。[MCP 说明](https://motionsites.ai/mcp)和[条款](https://motionsites.ai/terms)中的付费提示方案不采用；没有将卡片截图当作本作资产。
- **[Showreel](https://showreel.design/)**：本轮直接访问仍为 403；以前成功取得首页截图的记录独立保留。不能写成这次已逐部看完影片。
- **[Codrops 作者教程](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/)**与[作者制作案例](https://tympanus.net/codrops/2026/10/12/chasing-the-moment/)：用于追踪原作者；本轮部分正文返回 403，研究文档已标出只读到索引摘要的范围。
- **[Sky Dear Van Gogh 官方页](https://www.thatskygame.com/dearvangogh/)**：只研究艺术、操作与旅程的连接；[官方9月公告](https://www.thatskygame.com/news/this-month-in-sky-september-2026-edition/)记载该季结束时间，不称为目前仍在进行的季节，不取用画作或游戏资产。

## 近期 Fable 案例：学习方法，不继承宣传结论

[原始案例核查](research-cases.md)与[射击案例版本复核](fps-case-v3.md)区分原作者、原始作品、后续修订和非官方镜像。本轮根任务再次访问 [Anthropic Fable 官方页](https://www.anthropic.com/claude/fable)及[官方发布页](https://www.anthropic.com/claude-fable-and-mythos-5-2)；官方名称与模型资料不等于“一句话完成完整 AAA 游戏”得到证实。

| 案例与原始来源 | 本作采用 | 仍未知 / 不采用 |
|---|---|---|
| Saltline：[作者发布](https://x.com/felixrieseberg/status/2119925633564463609)、[作者提示词回复](https://x.com/felixrieseberg/status/2119927483994907024)、[原始初版作品](https://claude.ai/artifact/2UXyB49DrVHFfhTMdNDFTA)、[后续作品](https://claude.ai/artifact/BGY1SztrAYcJQHSsnHHGmp) | 小范围完整循环、具体美术简报、持续工具执行与独立看图 | 用户所见传播片段尚未唯一确认；首版/修订版不能混称；原帖直取失败的耗时、费用和无反馈说法维持未独立核验，不采购付费算力方案 |
| Abyssal Garden：[作者仓库](https://github.com/Noniv/abyssal-garden)、[作者提示词](https://raw.githubusercontent.com/Noniv/abyssal-garden/main/prompt.txt)、[许可](https://github.com/Noniv/abyssal-garden/blob/main/LICENSE) | 程序化资源、固定机位审美复核、真实性能记录与分阶段完善 | 未复制源码作为本作产品依赖；作者高端硬件目标不等于本机表现；最终可用性包含后续修订 |
| What the Water Keeps：[作者发布](https://x.com/kevin_t_ngo/status/2119868968307695818)、[原作入口](https://what-the-water-keeps.vercel.app/) | 只研究连续旅程如何以色彩、天气与尺度形成章节 | 原帖/原作读取不完整，工具与素材授权未核清；未采用其生成服务或资产 |

## 免费资源与长期积累

[早期免费资产清单](free-assets-v3.md)、[资源与架构](resources-architecture.md)、[知识手册](knowledge-playbook.md)、[V5 经验](v5-knowledge.md)分别保存选型、实现选择和复盘。V3清单中的“仅入库一项棚光”属于当时状态，不能当作当前资产清单；最终运行采用如下四项资源，共两份1K HDR与四张1K表面贴图：

| 已采用资源 | 作者、范围与本地出处 |
|---|---|
| [Studio Small 09](https://polyhaven.com/a/studio_small_09) | Sergej Majboroda，CC0-1.0；棚光环境，[原文件及哈希记录](../../spring-letter/public/assets/environment/studio_small_09_1k.source.json) |
| [Spruit Sunrise](https://polyhaven.com/a/spruit_sunrise) | Greg Zaal，CC0-1.0；户外晨光，[官方元数据与文件记录](../../spring-letter/public/assets/v5-source-record.json) |
| [White Plaster 02](https://polyhaven.com/a/white_plaster_02) | Rob Tuytel，CC0-1.0；仅OpenGL法线与粗糙度，不含漫反射/位移，[记录](../../spring-letter/public/assets/surfaces/source.json) |
| [Mossy Rock](https://polyhaven.com/a/mossy_rock) | Rob Tuytel，CC0-1.0；仅OpenGL法线与粗糙度，[记录](../../spring-letter/public/assets/v5-source-record.json) |

[Poly Haven许可](https://polyhaven.com/license)的资产授权不扩展为其网站文字、标识、展示图或API服务的统一授权。Three.js 0.185.0运行代码使用MIT，分发声明保存在[THIRD_PARTY_LICENSES.txt](../../spring-letter/THIRD_PARTY_LICENSES.txt)。[Kenney官方说明](https://kenney.nl/support)仅为候选研究，未引入其资产包；ambientCG Marble001也仍是未下载候选，不把收费工具或公开可看的网页作品算作已授权游戏资产。

其余花体、粒子规则、岸边几何、SVG加载绘画与合成声音为本作原创实现；未把参考视频帧、SAEL/MotionSites卡片或商用游戏画面打包进运行产品。没有购买外部生成图片、视频、语音或提示库。G主路、保留支线、界面11项与47.004分钟长跑已有普通输入证据；F首用周期与界面证据继续独立归档。全量Node178/178、Python包校验3项与媒体守卫9项通过。随后实际完成[G无声连续实录](../../spring-letter/evidence/spring-letter-v6-uncut-silent.webm)、[4397帧完整解码](../../spring-letter/evidence/v6-media-decoding.json)、[发行包解压启动](../../spring-letter/evidence/v6-package-verification.json)与[本机22资源HTTP核对](../../spring-letter/evidence/v6-served-files.json)，身份均绑定[发行清单](../../spring-letter/evidence/release-manifest-v6.json)。[图文页面视觉检查](../../spring-letter/evidence/v6-dossier-visual.json)已通过桌面/窄屏6组，根任务另人工查看截图。实体设备与外部新玩家理解未验证，不能由研究资料数量替代。
