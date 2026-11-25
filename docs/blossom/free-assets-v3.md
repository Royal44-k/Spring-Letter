# 《花漾年华：待寄出的春信》免费资源与实现选型 v3

核验日期：2026-11-18。此清单围绕**珍珠灰浅水展厅、薄纱、液银／晶体百合、粉蓝表面粒子**选型。正式入库一项棚光 HDRI；其余为已核验出处的候选材质或开源实现依据。所有“建议值／预算”是本项目工程设计，不是源站实测，也不代表已完成视觉复刻。

## 采用清单

| 资源／实现 | 作者与精确许可 | 采用目的 | 当前状态 |
| --- | --- | --- | --- |
| Poly Haven — Studio Small 09，1K HDR | Sergej Majboroda；CC0-1.0 | 柔光箱在液银花瓣上形成连续宽高光，让晶体花也有可辨识结构 | 已下载、哈希校验、解码验证 |
| ambientCG — Marble 001，1K JPG | ambientCG / Lennart Demes；CC0-1.0 | 浅色石质池沿、展台；只作细节，不让纹理抢走花体焦点 | 许可与下载入口已核验，未下载 |
| Three.js r185 — ParametricGeometry | Three.js contributors；MIT | 原创百合瓣与悬垂薄纱的参数曲面；开合前后保持拓扑 | 代码可复用；原创模型待实现／验收 |
| Three.js r185 — MeshPhysicalMaterial / transmission 示例 | Three.js contributors；MIT | 液银、珠光、晶体三种可调材质原型 | 代码参考，未下载示例附属模型 |
| Three.js r185 — GPUComputationRenderer + MeshSurfaceSampler | Three.js contributors；MIT | 粉蓝粒子的表面停驻、局部排斥、散开与回归 | 算法参考；需实现稳定表面锚点 |
| Three.js r185 — webgl_gpgpu_water | Three.js contributors；MIT | 指尖水波、花落水面与投信涟漪的统一高度场 | 示例已核查；仅复用代码原理 |

## 1. 棚光：Studio Small 09

**官方与下载：**[资产页](https://polyhaven.com/a/studio_small_09) · [1K HDR 直链](https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr) · [官方文件元数据](https://api.polyhaven.com/files/studio_small_09) · [作者元数据](https://api.polyhaven.com/info/studio_small_09)。作者 Sergej Majboroda；[Poly Haven 资产许可](https://polyhaven.com/license)为 [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)。

源站描述的是带大型柔光箱的中性小型摄影棚，适合本项目对柔和宽高光与干净反射的需求。以它作为环境光，背景另设珍珠灰，不把摄影棚全景直接当场景。色相来自花体材质与少量粉蓝轮廓光；先控制曝光和粗糙度，再加 bloom，避免高亮区域一片白。

- 本地文件：`D:/AI Game/spring-letter/public/assets/environment/studio_small_09_1k.hdr`。
- 实际大小 **1,615,248 bytes**；**1024 × 512**；Radiance RGBE 编码。
- SHA-256：`e7cfda5f4e98e623db12b8bfd0184e048488e4855d9c83e2751fb44a32e80c45`。
- MD5：`d5d7eb9d26d341d6aa4d11c1a54fd97c`，与官方 API 一致。
- 本地 Three r185 `HDRLoader.parse()` 成功解码，RGBA16 数据 **4 MiB**。GPU 环境贴图、PMREM 与生成时临时资源会另占显存，不能把 1.54 MiB 下载体积当作总显存。
- 接入路径：`HDRLoader → PMREMGenerator → scene.environment`；PMREM 完成后释放源纹理和生成器临时对象。实际释放顺序依调用方式验证；不要提前释放仍使用的环境贴图。
- 出处与校验已另存同目录 `studio_small_09_1k.source.json`、`README.source.md`。该资源无需账号或付费；运行时直接读取本地资源，不依赖第三方 API。

**验收：**花瓣边缘和弯曲处应出现连续高光带；视角旋转时反射移动；亮部仍保有渐变。当前验证的是文件完整性与可解码性，尚不是光照效果验收。

## 2. 浅色石材：Marble 001

**官方与下载：**[资产页](https://ambientcg.com/view?id=Marble001) · [1K-JPG ZIP 入口](https://ambientcg.com/get?file=Marble001_1K-JPG.zip) · [许可说明](https://docs.ambientcg.com/license/) · [作者／运营者信息](https://docs.ambientcg.com/legal/)。作者标注为 ambientCG / Lennart Demes。下载资产适用 **CC0-1.0**；无需署名，此项目仍记录来源。

官方分类为白色、干净的大理石 PBR 材质，来源为程序制作。它适合水池外沿、台座与少量墙面，帮助近景保有尺度；不用于花瓣。若实际预览的纹理过于抢眼，可只保留粗糙度／法线的低强度变化，主色继续用原创珍珠灰。最终是否采用应由近景截图判断。

- 官方标示 ZIP：**1K JPG 6 MB**；1K PNG 14 MB。这里采用前者作为候选下载入口，**尚未下载**，因此没有声称内部贴图数量、精确字节数或最终显存实测。
- 初期仅计划选取 base color、normal、roughness；不把整个多分辨率包带入游戏。1K RGBA8 单张约 4 MiB，含完整 mip 链约 5.33 MiB；三张约 16 MiB，属未压缩预算估算。可将单通道图合并，待视觉锁定后再考虑 KTX2。
- 限制：池底纹理强度必须低于涟漪；法线凹凸不能把浅水变成粗糙石坑。远景可用常量材质，节省加载和采样。

## 3. 原创花瓣与薄纱：ParametricGeometry

**官方源码／下载：**[r185 ParametricGeometry.js](https://raw.githubusercontent.com/mrdoob/three.js/r185/examples/jsm/geometries/ParametricGeometry.js)；[Three.js r185 MIT 许可](https://raw.githubusercontent.com/mrdoob/three.js/r185/LICENSE)。作者为 Three.js contributors。本地现有同版本模块为 **3,814 bytes**，不是整个渲染引擎的体积。

建议用原创建模保留两个视频的形态识别特征，而非塞入不相干的现成植物：用 `u` 描述花瓣根部至尖端、`v` 描述横向宽度，宽度先张开后收尖；中轴曲率、两侧内卷和尖端反卷分开控制。外轮和内轮花瓣错位排列，开合变化保持相同顶点索引。**这是本项目的造型方法，不是此类自带的“百合生成器”。**

- 主体起点预算：每瓣 `48 × 12` 网格，即 637 顶点、1,152 三角形；18 瓣约 11,466 顶点、20,736 三角形。厚度、双层结构和花蕊会额外增加几何量；轮廓质量优先于机械地固定此数字。
- 薄纱可用同类 UV 曲面加重力垂度、低频风摆和边缘卷曲，近景补细分。初期不用全布料求解器；交互位移用局部解析形变，避免自碰撞与不稳定时间步扩张范围。
- 表面粒子锚定同一曲面参数或面索引＋重心坐标，花瓣开合时同步更新，防止粒子留在旧形状上。
- ParametricGeometry 只负责采样曲面；花型、厚度、动画、材质、粒子锚点均须自行实现。参考视频帧可用于轮廓对照；不将未授权视频帧直接打包进成品。

## 4. 液银与晶体：MeshPhysicalMaterial

**官方源码／下载：**[r185 MeshPhysicalMaterial.js](https://raw.githubusercontent.com/mrdoob/three.js/r185/src/materials/MeshPhysicalMaterial.js) · [r185 透射示例源码](https://raw.githubusercontent.com/mrdoob/three.js/r185/examples/webgl_materials_physical_transmission.html)；作者 Three.js contributors，**MIT**。代码免费；示例引用的 HDRI、模型、纹理需分别查许可，本清单没有下载或自动授权它们。

材质不要混为一套：液银用高金属度与可控粗糙度形成长条高光；珠光花以浅灰主色、少量 iridescence 与细腻粗糙变化表现；晶体花再启用 transmission、ior、thickness。薄膜色来自视角变化，不能只用固定彩虹渐变假装光学效果。相关参数应在同一灯光和固定机位下逐项调节。

- **初始探索区间，非复刻验收数值：**液银 metalness 0.95–1、roughness 0.10–0.24；晶体 transmission 0.80–0.95、ior 1.35–1.5、roughness 0.04–0.16。珠光强度以不掩盖瓣面明暗为界，thickness 必须随场景尺度调整。
- 开启透射会引入额外渲染和采样成本。初期只给焦点晶体花使用；远景改低成本材质。不要同时为整片薄纱、全场花朵和水面堆叠透射。
- transmission 不等同于低 opacity，材质也不会自动提供真实焦散或所有透明物体的正确相互折射。浅水焦散若使用程序图案，应标明是实时视觉近似。
- 验收顺序：无后期灰模 → 棚光银材 → 晶体厚度 → 柔和珠光 → 最后少量 bloom。每次保留固定机位对比，避免后期亮度掩盖错误几何。

## 5. 表面粉蓝粒子：GPUComputationRenderer + MeshSurfaceSampler

**官方源码／下载：**[r185 GPUComputationRenderer.js](https://raw.githubusercontent.com/mrdoob/three.js/r185/examples/jsm/misc/GPUComputationRenderer.js) · [r185 MeshSurfaceSampler.js](https://raw.githubusercontent.com/mrdoob/three.js/r185/examples/jsm/math/MeshSurfaceSampler.js)；作者 Three.js contributors，**MIT**。本地模块分别为 **14,157 bytes** 与 **8,161 bytes**。

前者提供纹理状态的 GPU 迭代框架，后者提供按三角面面积／权重的表面采样。适配本项目的方法是：初始化固定随机种子并建立粒子身份；每粒子有表面目标、当前位置、速度和散聚相位；指针只影响有限半径，离开后通过阻尼弹簧回归。色彩以粉蓝两组为主，近景点大小保持细小，不将参考中的贴面颗粒改成巨大光球。

- **必须自行实现的部分：**稳定目标、形态匹配、动画后锚点、边缘过渡和交互力。MeshSurfaceSampler 的普通输出不能自动保留完整动画绑定；需要自行记录面索引＋重心坐标，或直接复用原创花瓣的 `(u,v)` 参数。
- `256 × 256 = 65,536` 粒子。位置和速度两变量、每变量双缓冲、RGBA32F 时状态约 **4 MiB**；再加两张同尺寸 RGBA32F 目标表约 **2 MiB**。这是数据纹理预算，不包含花、水、后期和浏览器开销。半浮点可降低占用，但须先验证精度和设备支持。
- GPUComputationRenderer 的依赖均基于前一轮状态读入；不可误以为同一轮位置变量能读到刚算好的速度。弹簧更新要按实际帧间隔／固定步长设计，限制大帧间隔，做帧率变化下的回归测试。
- 正式路径以局部力＋噪声的 O(N) 更新为主；不照搬鸟群两两比较的 O(N²) 行为。低配可减到 16K 粒子，并保留同样轮廓和响应顺序。
- 需要实测浮点 framebuffer 完整性和读写支持；不把“支持 WebGL2”直接等同于所有计算纹理格式可用。

## 6. 交互浅水：webgl_gpgpu_water

**官方源码／下载：**[Three.js r185 water 示例](https://raw.githubusercontent.com/mrdoob/three.js/r185/examples/webgl_gpgpu_water.html) · [在线示例入口](https://threejs.org/examples/webgl_gpgpu_water.html)；作者 Three.js contributors，**MIT**。沿用代码原理时保留 MIT 许可；示例鸭子模型与环境贴图不随代码许可自动进入本项目。

源例使用 GPU 高度场、相邻采样估算法线，并把指针作用到水面对应位置。项目可把相同的“注入水波”接口用于指尖、花瓣落水与投信结果：事件只提供世界位置、半径、强度和时间，水面统一解算，避免三套互不相干的特效。

- 源例高度场宽度 **128**；RGBA32F 双缓冲占 **0.5 MiB**。若升到 256，双缓冲约 **2 MiB**。网格／法线采样、反射贴图、全屏后期另计。先用 128 验证指尖延迟与波纹尺度，再由视觉需要决定升格。
- 指针应先 raycast 到水面，再转到水面局部 UV；不能直接用屏幕坐标作为水波位置，否则改变机位后会偏移。
- 采用固定更新步长和阻尼参数，约束连续输入的振幅；切到后台后恢复不得一次累积数秒模拟。
- 浅水透明、石材池底、倒影与水波要单独调节。此示例不是完整的物理水、薄膜光学或真实焦散方案；当前只选其稳定的交互高度场思路。
- 源例包含额外物体与数据回读用途；本项目如只需要视觉涟漪，可省去无关模型和同步 GPU 回读，降低复杂度。

## 入库与开发次序

1. **已完成：**下载唯一一项 CC0 1K 棚光，保存原始字节、作者、许可、官方 URL、SHA-256、MD5；通过本地加载器解码。
2. **首先验证：**同一灯光下的原创花瓣轮廓、银材连续反射、粉蓝粒子表面覆盖；将材质与点位问题分别检查。
3. **然后融合：**花体表面散聚 → 尘流轨迹 → 水面落点，用稳定粒子身份和统一事件驱动连接；水波给予操作结果，不让它成为无意义的自动循环。
4. **最后扩充：**需要近景台座细节时再下载 Marble001；粗糙度与法线强度验收后再入包。按实际引入文件更新资产清单，不把“候选”写成“已使用”。

## 许可与取舍边界

- Poly Haven 与 ambientCG 的免费资产可用于本地游戏；CC0 不要求署名，项目仍保留作者与来源。源站 API 的服务规则、网页文字、商标等与资产许可不同，不把全站内容视为同一许可。
- Three.js 采用 **MIT**，版权归 `Copyright © 2010–2026 three.js authors`；分发包含相关代码的副本时保留许可与版权声明。锁定 r185，避免当前文档变化与本地版本不一致。
- 没有使用付费订阅、付费材质、生成额度或许可不明的“免费试看”下载；没有为堆积资源引入森林、城堡或武器包。
- Blender 官方示例库中确有花朵教学资源，但本轮没有确认到可入库文件及完整许可版本，因此不将其记作已采用素材。百合与薄纱优先原创参数建模，结构和交互更容易与参考一致。
- 尚未完成的工作：候选石材视觉审查、场景中灯光验收、正式粒子／水波实现、低配设备性能采样。这份清单证明来源和技术可行路径，不能代替逐帧复刻验收或可玩章节测试。
