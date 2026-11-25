# 《花漾年华：待寄出的春信》设计与制作档案

独立新主题，与金沙项目无关。2026-11-18，当前主入口为v3制作定稿。原《花尘之间》是前期工作名；v2设计与评审继续保留为详细依据，当前实现与验收状态以v3和开发记录为准。

## 阅读入口

- [图文主入口](index.html)：保留原有设计阅读与参考切换，新增当前进度、本机试玩入口和单独标注的首版实机截图。
- [当前制作定稿v3](release-design-v3.md)：名称与主题、四幕操作因果、视频复刻矩阵、免费路线、当前差距。
- [视觉制作规格](art-direction-v3.md) · [执行计划](execution-plan.md) · [开发与验收记录](development-log.md)。
- [指定网站与主动扩展研究](research-sites-v3.md) · [具体免费资源](free-assets-v3.md) · [Fable案例版本复核](fps-case-v3.md)。
- [本机试玩](http://127.0.0.1:5192/)：只在本地服务器运行时有效；项目目录为 `D:/AI Game/spring-letter/`。
- [完整游戏设计](design-proposal.md)：世界、角色、玩法、地图、输入、免费路线、预算、阶段与验收。
- [叙事与可玩体验蓝图](experience-blueprint.md)：四幕证据链、风廊双解、结构调度、三种终局组合、预演与恢复。
- [本轮补充研究](research-depth.md)：Outer Wilds、COCOON、Gorogoa的第一方创作资料及方法转化。
- [逐帧视频分析](video-analysis.md)：两段共2629帧，观察事实、原始输入说明与F01–F08矩阵。
- [近期案例核查](research-cases.md)：Fable 5.2、Saltline、Abyssal Garden及艺术游戏的第一方证据与限制。
- [免费资源与架构](resources-architecture.md)：许可证、渲染版本、稳定粒子映射、成本与降级。
- [可复用制作手册](knowledge-playbook.md)：方法、技术配方、评审记录、资源登记模板。

## 完成与未完成

已完成研究、全帧解码、全帧缩略图通览、关键帧放大、设计与独立评审；独立项目已写入花材、粒子、四幕规则、场景、输入、存档与声音。本文更新时33项单元测试通过，首版实机截图已有记录。正式构建的16项浏览器流程检查和8项边界检查已通过，包括正常输入四幕、三结局与重载回看；最终视觉、完整场景性能和首次玩家体验仍在精修与验收，不能把通关当作全部品质指标通过。没有采购或调用收费媒体生成服务。

v3沿用原有2629帧证据，并复看关键原尺寸帧，没有将复用资料计为再次逐帧审阅。方舟背景、双杯私人意象、游絮自主回应和四类决策继续沿用v2蓝图；v3新增实际素材、代码验证、交互修复和明确差距。原v1.1设计保存在`archive/`；`notes-narrative.md`与`notes-playability.md`是整合前建议，不取代主提案与蓝图。

文档、分析与参考证据位于此目录；新游戏源码位于独立 `D:/AI Game/spring-letter/`，没有改作金沙续篇。桌面浏览器已作为首个平台执行，其他设备的支持程度仍以实际测试为准。

## 证据目录

```text
video/blossom/summary.json             百合文件元数据与完整性
video/blossom/frame-metrics.csv        1052行帧数据
video/blossom/all-frames-*.jpg          11张全帧表
video/blossom/overview-*.jpg            5张概览
video/blossom/detail/                  关键原尺寸帧
video/particles/summary.json           粒子文件元数据与完整性
video/particles/frame-metrics.csv      1577行帧数据
video/particles/all-frames-*.jpg        16张全帧表
video/particles/overview-*.jpg          7张概览
video/particles/detail/                关键原尺寸帧
video/detail-index.json                放大帧索引
tools/analyze_references.py            全帧分析脚本
tools/extract_details.py               原尺寸帧提取脚本
tools/build_dossier.py                 本地阅读页生成脚本
```

分析使用PyAV 19.0.2，安装在本目录`tools/python-deps/`，不依赖付费API；NumPy、Pillow来自已提供的Python环境。完整重跑会重新读取原视频并覆盖本目录的派生分析文件。先查看脚本内输入路径，再用包含NumPy/Pillow的Python运行；脚本会加入本地PyAV依赖路径。

图文阅读页的版式、参考帧与实机截图均来自本地文件；直接用浏览器打开`index.html`即可阅读，无账号或构建服务要求。外部研究链接需要联网，本机试玩链接需要启动服务器。文档按钮用于证据阅读与设计推演，不是假装在文档里运行了游戏。全部Markdown仍是可编辑正文。

v2阅读页增加“两核三用途”规则推演，用于比较设计后果，明确不作为游戏实机或玩法原型。首页模板、追加样式与推演脚本保存在`tools/dossier-template.html`、`tools/dossier-v2.css`、`tools/dossier-choices.js`，由`tools/build_dossier.py`生成阅读页。

v3生成器把当前新增文档纳入页面清单，并将同档案中的Markdown链接改成HTML；跨目录的项目README仍保留真实`.md`链接。项目README存在时，首页才显示其链接，防止文件浏览出现不存在的地址。运行已有Python执行 `tools/build_dossier.py`即可重建；无需安装第三方渲染包。局部链接检查另见 `document-verification-v3.json`。

## 交付核验

原视频SHA-256复核一致，CSV帧号连续、时间戳唯一且数量与解码摘要相符，详见[视频核验记录](video-verification.json)。

v1阅读页的核验记录见`document-verification.json`；v2另记为`document-verification-v2.json`；v3的生成与本地链接记录为`document-verification-v3.json`，避免混淆版本。文档检查只证明对应阅读和链接条件，不能证明游戏已达到参考品质。

v2实际检查结果：本机Edge经Playwright打开9个阅读页，内部资源和锚点完整，无脚本异常或外部网络请求，1440px与390px均无页面横向溢出；8种原帧切换、3种终局组合推演、键盘激活及庭院折叠均正常。已查看桌面封面、组合推演与窄屏推演截图。

v3实际检查结果：生成17个HTML页面，400余项本地链接、图片与锚点检查无缺失；全部标题使用新名称，项目README链接指向存在的源文件。Edge以本地文件打开首页和定稿页，1440px／390px未出现页面横向溢出；原帧切换和组合推演仍可操作，没有页面脚本错误或外部网络请求。桌面与窄屏截图已保存并查看；这次没有把外部研究链接逐个重新联网验证，也没有把文档检查记为游戏通关。

v2独立建造复查已通过；三项修正及静态可达推演见[制作手册](knowledge-playbook.md)和[设计状态核验](design-state-audit.json)。游戏的连续变形、操作手感、时序恢复和可玩性仍待实机验证。

## 当前版本 v4 / 可玩0.2.0

从[index.html](index.html)打开实机录像、[情景剧本](script-v4.md)、[自主研究](research-v4.md)、[验收标尺](quality-rubric-v4.md)与[当前QA](../../spring-letter/FINAL_QA.md)。v2/v3保留作设计迭代历史，不能用旧性能或旧测试数字覆盖当前报告。
