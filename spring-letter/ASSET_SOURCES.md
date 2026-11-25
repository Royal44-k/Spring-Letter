# 素材、工具与来源

本项目无素材采购、付费提示库、生成接口或运行时联网依赖。现有会话与设备的使用成本不被称为零成本。

## 0.9.0 · 雨林、星台与云海

本轮在原有九段行动之间增加雨幕温室、沉星天文台、云海花甸三处可真实行走的独立三维地图，构成十二个主要环节。温室铜色肋拱、巨蕨、兰花、蝶群与雨线，天文台石阶、柱列、黄铜浑仪、月亮、星点与星路线，云海浮岛、垂根、草甸、风旗与角色花伞均由本项目程序几何、材质或纹理制作。引蝶授粉、三维描星、角色花伞滑翔及其规则、文字与界面为项目实现。本轮没有新增外部模型、图片、音轨下载或收费资源；既有外部贴图、乐器与自然录音继续保留全部原始许可及处理记录。

三图配乐使用已有 VSCO 2 Community Edition 的 CC0 乐器录音演奏独立原创音序：温室木拨弦与疏落笛声，观星钢琴与少量高竖琴、隔小节留白，云海轻盈三拍流动。鸟声、河流与脚步继续复用下方已有 CC0 资源；三图采用不同环境混合参数，不将河流录音描述为新采集的雨林或云海实录。没有新合成 API、在线音源、玩家麦克风采集或参考作品配乐。

本轮免费公开研究的八个新官方入口为 [Eden Project](https://www.edenproject.com/whats-here/rainforest-biome)、[Eastshade](https://eastshade.com/eastshade-game/)、[Papetura](https://petums.com/papetura/)、[Manifold Garden](https://manifold.garden/presskit/)、[Heaven’s Vault](https://www.inklestudios.com/heavensvault/)、[Paper Trail](https://www.papertrailgame.com/)、[The Gardens Between](https://thegardensbetween.com/) 与 [ESO 夜空全景](https://www.eso.org/public/images/residenza-cc/)。只提炼空间、观察、纸材和节奏方法，没有导入其截图、模型、音乐、文化符号或代码。商业游戏本体、实体参观可能收费，本轮只读取免费公开页面。

ESO 图片是许可为 CC BY 4.0 的未采用候选，不是本作已有素材；本作星空使用原创程序表现，因此没有给运行包新增 ESO 图像或标志。详细事实、许可边界、淘汰方案与最终选择见 [v12 研究记录](../docs/blossom/v12-research.md)。具体完成度与验证状态以当前构建的 QA 证据为准。

## 0.8.0 · 潮汐与远航

本轮海岸书桌、潮石与旧邮亭、小岛、木舟、桅杆、绳索、花帆、船上信袋，以及海上莲、百合、鸢尾、大丽花等造型，均由项目代码生成；海面、木纹、帆布和纸面等新增外观以原创程序几何、材质与纹理完成。新叙事、亲笔信交互、潮汐规则、备舟与航行控制也是项目实现。没有从参考游戏、模型库或素材站复制新增模型、图片、视频或音轨进发布包；既有第三方资源继续按下面的来源与许可使用。

海岸七种情境配乐复用已登记的 VSCO 2 CE 乐器采样，以项目原创的固定旋律、和声、节奏与调度演奏：写信、潮汐、登岛、备舟、6/8 航行、曙光、结束各有编排；不使用参考作品的商业音乐。玩家在回声织信中保存的八拍谱面，按实际音符在离岸时再次演奏。新增封缄、翻纸、解缆、升帆、潮石落步、海上开花与启程声音，使用既有许可采样、接触录音和程序噪声重新组合，没有采集玩家麦克风或请求在线音频生成。

海水环境层由已登记的河流录音经过低通与动态混合制成，与原河流路径共用循环源；它是对现有录音的声音设计，不是新下载或实地录制的海浪音。对应实现为 `src/audio-score.js`、`src/audio-engine.js`；原件、处理哈希与许可仍见下方 VSCO 和 `foley-v8` 记录。

亲笔收信人与正文由玩家输入，作为纯文本存在本机旅途里；TXT 导出同时包含亲笔与项目原创的岑旧信。文字没有发送给第三方服务，其他作品的角色、故事文本与歌词没有被用于生成这封信。

### 本轮新增参考入口：只研究，不作为素材授权

本轮先检查历史研究文档中的域名，再读取以下公开页面。商业案例本身可能收费，本项目只查阅免费公开资料，没有购买游戏或订阅资源。具体事实、设计取舍与许可判断见 [潮汐与远航研究](../docs/blossom/v11-research.md)。

| 新参考网站 | 本作借鉴的方向 | 本轮使用方式 |
|---|---|---|
| [Sail Forth 官方资料](https://www.sailforthgame.com/press/) | 风、帆、速度、船体姿态与航行反馈互相对应 | 阅读公开资料；未复制船只、海岛、音乐或图像 |
| [Okomotive / FAR: Changing Tides](https://www.okomotive.ch/presskit/sheet.php?p=far_changing_tides) | 升桅、调帆等具体准备动作，以及音乐对行动的响应 | 阅读开发商资料；未复制游戏机制代码或资产 |
| [Awaceb / Tchia](https://www.awaceb.com/tchia) | 群岛交通方式与音乐、环境之间的关系 | 研究连续旅程；没有借用角色、文化符号或音轨 |
| [Thunder Lotus / Spiritfarer](https://thunderlotusgames.com/games/spiritfarer/) | 让船承载照料、关系与告别 | 研究叙事组织；没有使用亡灵渡船设定或画面素材 |
| [Hoa 官方资料](https://www.hoathegame.com/presskit) | 3D 生物协作与自然空间的观察性谜题 | 当前页面介绍 Hoa 2；作为公开提案研究，不称已完整试玩 |
| [Quaternius 船只包](https://quaternius.com/packs/ships.html) | 船首、船舷、桅杆和帆的比例层级 | 未下载采用。旧包页仍标 CC0，当前总站为 QAL；不能据此笼统称全站 CC0 |
| [Poly Pizza / Sailboat](https://poly.pizza/m/6okvxHsSdzO) | 简化船模的轮廓与负空间 | 未下载采用。具体页面署名 Poly by Google，标 Creative Commons Attribution；免费不等于免署名 |
| [3DTextures / Wood Planks 010](https://3dtextures.me/2019/01/04/wood-planks-010/) | 木板方向、法线与粗糙度层次 | 未下载采用；仅研究免费单张纹理规格，不采用批量包、4K 或付费源文件 |

许可补充：Quaternius 当前 [QAL 页面](https://quaternius.com/license.html) 标注 2026-08-28 更新，允许免费用于作品但限制作为独立素材再分发；本轮未引入该站文件，因此未给发布包添加 QAL 资产。3DTextures 的 [许可页](https://3dtextures.me/about/) 声明纹理为 CC0，但本轮未下载其纹理。另查证的 [cgbookcase 免费纹理目录](https://www.cgbookcase.com/textures) 只作为后续候选，未采用。公开参考链接不等于它们为本作背书。

## 已有采用素材与处理记录

v8 新增真实脚步与自然环境音：Kenney [Impact Sounds](https://kenney.nl/assets/impact-sounds) 的三种草地、三种混凝土地面脚步及短采矿敲击（在游戏中用于石路/转片触碰）；isaiah658 的 [Ambient Bird Sounds](https://opengameart.org/content/ambient-bird-sounds)；Thimras / Eike Germann 的 [Park ambiences](https://opengameart.org/content/park-ambiences) 河流实录。均由原作者页面明确标为 CC0，匿名免费下载。鸟/河各裁切并交叉淡化为20秒循环，统一单声道22.05kHz PCM16 WAV，九个成品音频合计小于2MB。许可全文、逐文件原件与成品SHA-256、截取区间、采样率和循环处理见 `public/assets/foley-v8`；作者原页、下载原件与可复现脚本见 `../docs/blossom/research/v8-audio`。混凝土脚步并非原作者标注的自然石材，短采矿音也不被称为真实转片录音。没有新增现成音乐；没有声称人工试听。

0.5.0 新增：VSCO 2 Community Edition 的七个真实乐器采样（竖琴高/低区、钢琴、长笛、大提琴、弦乐拨奏、三角铁），录音 Sam Gossner / Simon Dalzell，切分 Elan Hickler / Soundemote，CC0。来自[官方仓库](https://github.com/sgossner/VSCO-2-CE)，原始 Git blob、原文件与处理后 SHA-256、裁剪/重采样信息见 `assets/audio/sources.json`；完整许可随 `assets/audio/VSCO-CC0.txt` 分发。音乐旋律、和声、编配与情境调度为本项目原创，并未使用现成商业游戏配乐。

0.5.0 新增表面：Amal Kumar 的 [Rocky Trail](https://polyhaven.com/a/rocky_trail) 1K 色彩/法线/粗糙度，以及 Rob Tuytel 的 [White Plaster 02](https://polyhaven.com/a/white_plaster_02) 1K 色彩图，均为 Poly Haven CC0。合计 3,748,725 字节，官方 API MD5 已核对且图像完整解码；逐文件 SHA-256、作者、来源见 `assets/v7/source.json`。地形和建筑仍为原创几何，没有下载完整游戏关卡。

|采用内容|作者与来源|许可/处理|
|---|---|---|
|Studio Small 09，1K HDR，1,615,248字节|Sergej Majboroda，[Poly Haven](https://polyhaven.com/a/studio_small_09)|CC0；本地原文件与API来源记录保存在`public/assets/environment`|
|White Plaster 02，1K OpenGL法线652,310字节＋粗糙度295,900字节|Rob Tuytel，[Poly Haven](https://polyhaven.com/a/white_plaster_02)|CC0；仅用于石台/建筑微表面，保留原创底色；原图、SHA/MD5、官方API来源及CC0原文见`public/assets/surfaces`|
|Spruit Sunrise，1K HDR，1,500,948字节|Greg Zaal，[Poly Haven](https://polyhaven.com/a/spruit_sunrise)|CC0；白日室外环境，官方元数据和哈希见public/assets|
|Mossy Rock，1K法线995,727字节＋粗糙度780,918字节|Rob Tuytel，[Poly Haven](https://polyhaven.com/a/mossy_rock)|CC0；地形/岩石/墙/树干微表面；SHA及MD5见public/assets/v5-source-hashes.json|
|Three.js 0.185.0及其官方addons|[Three.js](https://github.com/mrdoob/three)|MIT，依赖中保留许可证；发布包附`THIRD_PARTY_LICENSES.txt`|
|Vite 8.3.8|[Vite](https://github.com/vitejs/vite)|MIT，构建工具，不作为在线服务|
|Playwright 1.65.1|[Playwright](https://github.com/microsoft/playwright)|Apache-2.0，仅本地验证，不打包进运行页|
|花瓣/茎叶/花蕊、场景几何、粒子规则、花瓣厚度/花色/纸面等程序纹理、UI、音符|本项目程序化制作|上列HDR、石膏与岩石贴图为明确登记的外部素材；没有复制参考站的图像、品牌角色或模型；系统字体不随包分发|

HDR SHA-256：`e7cfda5f4e98e623db12b8bfd0184e048488e4855d9c83e2751fb44a32e80c45`。

White Plaster 02 SHA-256：

- `white-plaster-02-normal.jpg`：`eb572ca3630d5bfde72e2601b1f02412da23ca005cd19384dced8690be4cb783`
- `white-plaster-02-roughness.jpg`：`4ff1fe957cd161b07f721fe6c28a9459c8c2e8ec65627a26c16e483a07c80d85`

2026-11-18从[官方文件API](https://api.polyhaven.com/files/white_plaster_02)对应CDN下载。两图均经Pillow完整解码为1024×1024 JPEG，MD5与API一致。合计948,210字节；未下载diffuse、位移或高分辨率包。[许可声明](https://polyhaven.com/license)与完整CC0文本保存在素材目录。具体来源、验证和使用预算见`public/assets/surfaces/source.json`与`README.md`。候选音乐Kounine/Sudo未下载、未使用，不在运行包中。

用户视频保留在原路径，没有被复制进游戏发布包。设计档案中的截图仅用于逐帧研究与对照，不作为本游戏实机图。

设计借鉴与代码授权是不同问题。Sael、Showreel、MotionSites、Garden Eight等公开作品提供观察依据，不意味着其资产可复制。MotionSites付费提示库未采用。主动研究的具体来源、可见证据和限制见[研究档案](../docs/blossom/research-sites-v3.md)、[第四轮一手研究](../docs/blossom/research-v4.md)；Fable射击案例见[证据核查](../docs/blossom/fps-case-v3.md)。

录像工具：FFmpeg（Playwright官方构建1013）由Playwright官方CDN下载至本项目`.tools/playwright`，随包保留`COPYING.LGPLv2.1`。仅用于本机实录编码，不进入`dist`，不在游戏运行时下载。伴随安装的Winldd仅是Playwright依赖检查工具，不作为游戏素材或运行依赖。

v5 阶段的研究与采用决定见 [v5自主研究](../docs/blossom/research-v5.md)，独立案例短试玩只用于观察，没有拷贝作品图像、角色或模型。

0.4.0 / v6 新增四花型与五系列参数、三幅 SVG 加载景、初庭石弧、岸草/旗帜、终庭灯/芽床/帆舟均为本项目原创程序造型。没有新增外购模型、图片或音轨。实际采用、仅研究和访问失败逐项见 [v6 研究索引](../docs/blossom/v6-research-index.md)。
