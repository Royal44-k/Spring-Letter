# 0.8.0《潮汐与远航》实际实现对照

记录日期：2026-11-23。范围是独立游戏《花漾年华：待寄出的春信》，与金沙项目无关。本文对照实际源码、已留存的浏览器站点记录与设计稿；不把研究提案、静态代码检查或旧截图当作最终实机验收。

本次核对基于 [candidate-f 构建清单](../../spring-letter/evidence/v11/build-candidate-f.json)（2026-11-23，北京时间）。重新核对的 `main.js`、`world.js`、`story-content.js` 及四个 `voyage-*.js` 源文件与清单中的 SHA-256 一致。该候选包含备舟阶段的右键／中键环看保护：环看拖动不再触发解缆，备舟镜头也实际应用环看角度。九段流程和操作对应关系保持不变。码头新增连续可走的木栈道，船体移到岛岸外的水上泊位；实际步行、登船和环绕视角已单独核查。

[candidate-f 单元测试日志](../../spring-letter/evidence/v11/units-candidate-f.log) 记录 548 项通过、0 失败、0 跳过。这是已运行的 Node 测试结果，不代表 GPU、完整实机流程或最终发布检查已完成。运行结果、最终发布构建、输入方式与设备覆盖，统一见 [FINAL_QA.md](../../spring-letter/FINAL_QA.md)。

## 一段序章、九段主要行动、一个终章

实际结构为既有花庭五段与新增海岸四段相接。开场赏花、散聚、风笔和可选支线没有计入九个主要环节。

| 顺序 | 实际内容与玩家动作 | 主要源码 |
|---|---|---|
| 情境序章《借来的春天》 | 六段镜头与文字交代方舟、花尘中醒来的弥、岑的委托，并提前提出“路的尽头有海，也写一封自己的信”；可跳过、可重看。 | [story-content.js](../../spring-letter/src/story-content.js)、[story-director.js](../../spring-letter/src/story-director.js) |
| 1 花光暗房 | 摆放树、窗、花三张透光花笺，改变真实构图，再留下回应。 | [moment-rain.js](../../spring-letter/src/moment-rain.js) |
| 2 纸翼渡风 | 持续控制纸翼方向与高度，穿过风门。 | [moment-wind.js](../../spring-letter/src/moment-wind.js) |
| 3 回声织信 | 用三声部编排八拍、留白与回听，保存玩家实际谱面。 | [moment-tide.js](../../spring-letter/src/moment-tide.js) |
| 4 借花为桥 | 将有限花尘织为可通行的渡路，在石台之间规划下一段。 | [bridge-weaver.js](../../spring-letter/src/bridge-weaver.js)、[world.js](../../spring-letter/src/world.js) |
| 5 留下两处春天 | 搬运两枚种核、选择安放位置；出发前预览并确认安排，也能取消再改。确认后转入写信，不再直接弹出旧结局。 | [delivery.js](../../spring-letter/src/delivery.js)、[main.js](../../spring-letter/src/main.js) |
| 6 写给未曾谋面的人 | 输入自己的收信人与正文，点击或拖动花印封缄；仍在书桌时可拆封修改，再收信走向潮脊。 | [voyage-controller.js](../../spring-letter/src/voyage-controller.js)、[voyage-model.js](../../spring-letter/src/voyage-model.js) |
| 7 潮汐留下的旧信 | 观察涨退潮、走低石与高台；在半途邮亭阅读并明确收下岑的旧信，随后抵达小岛。危险时回最近高台，信不丢失。阅读面板有“先合上”操作。 | [voyage-model.js](../../spring-letter/src/voyage-model.js)、[voyage-content.js](../../spring-letter/src/voyage-content.js) |
| 8 岸边的一叶舟 | 在岛上走近小码头登船，解开两侧缆绳、持续拉索升帆；两封信、两根缆绳和完整升帆都是离岸条件。 | [voyage-controller.js](../../spring-letter/src/voyage-controller.js)、[voyage-world.js](../../spring-letter/src/voyage-world.js) |
| 9 一路繁花向海 | 持续掌舵、调帆、缓行、撒花种；帆角影响航速，沿途渐入晨光。曾保存的八拍春声在离岸后回响。 | [voyage-model.js](../../spring-letter/src/voyage-model.js)、[audio-score.js](../../spring-letter/src/audio-score.js) |
| 终章《收信人，尚在远方》 | 到达曙光后再亲手选择“带着两封信，驶向曙光”。船缓缓前移、镜头拉远，结束页显示玩家原文；可下载两封信、留影、继续看海或重访花庭。 | [voyage-controller.js](../../spring-letter/src/voyage-controller.js)、[voyage-world.js](../../spring-letter/src/voyage-world.js) |

九段标题与路线清单实际来自 [voyage-content.js](../../spring-letter/src/voyage-content.js)，花庭地图由 `main.js` 结合完成状态展示。剧情关系是“先理解别人的牵挂，再写自己的话，承接上一任的托付，带着两封信离开”，而不是九个互不相干的按钮小游戏。

## 用户重点与具体落点

**花桥的绿色波浪墙。** 已删除旧 `shieldSail` 竖向波浪曲面，而非只换颜色。原曲面与叶渡共用材质，显现完成后变为不透明，形成约 2.35 米高的挡墙。现存 `shieldRM` 只保留低矮可走的叶渡，旧存档键保留，可见名称改为“叶渡”。几何回归依据见 [花桥审查](v11-bridge-audit.md) 与 [bridge-presentation.test.js](../../spring-letter/tests/bridge-presentation.test.js)；实机修复结论以最终验收为准。

**两封信与小岛、船的先后顺序。** 模型阻止未封缄就离开书桌、未收旧信就越过后半段潮脊，以及缺少任一封信就登船或启航。自己的信是玩家实际输入的纯文本；岑的旧信是一封完整的固定叙事文本。信袋可回看，两封信通过本地 UTF-8 TXT 下载；游戏不向外部邮箱或服务器寄信。已完成旧结局的存档可继续新增海岸篇，旧回信与档案保留，具体兼容检查仍查最终报告。

**海上繁花有三维形态。** 新世界使用莲、百合、鸢尾、大丽花四种不同程序几何，具有曲面花瓣、花心与叶托，并非二维贴花或只给同一网格换色。静态海上花群与航行生成的花迹共同构图；种核组合改变花海配色和花形排列。主动撒种沿用所封花印的莲、百合或鸢尾，预置花群另含大丽花。海面、帆、船体、角色、游絮和信袋均由真实三维场景呈现。

**结束的仪式。** 不是到达里程后立刻替玩家结束。玩家在曙光前再次决定启程，结束页的实际标题为“信尚未抵达，春天已经上路。”其中保留实际收信人与正文，落款为“弥 与 游絮，途中”。两封信在同一个信袋内，三维船上有两只信封；岑的全文可在信袋与下载文本中阅读，结束页没有并排铺开两封全文。

**交互与声音。** 海岸走动使用跟随角色的镜头，也可环看、回正；航行用方向输入掌舵、调帆，有触屏等价控件。写信、候潮、登岛、备舟、航行、曙光和结尾有不同原创编排，复用已登记的免费乐器采样；帆船段采用六拍律动。海上环境声由既有流水录音滤波混合，不宣称新增了实录海浪素材。声音实现见 [audio-engine.js](../../spring-letter/src/audio-engine.js)。

## 实际打开的八个新站点

以下八项取自 [侧边浏览器记录 reference-browser.json](../../spring-letter/evidence/v11/reference-browser.json)，包含实际标签页 ID、页面标题和 URL。重新检索本目录早于 V11 的 `.md` 与 `.html`，八个域名均无命中。这里只证明已打开与研究公开页面，不声称购买或完整试玩参考作品。

| 浏览器 ID | 实际打开入口 | 本作提炼的方法 |
|---|---|---|
| 1 | [Sail Forth 官方资料](https://www.sailforthgame.com/press/) | 风、帆角、舵向与船速的连续反馈。 |
| 3 | [FAR: Changing Tides / Okomotive](https://www.okomotive.ch/presskit/sheet.php?p=far_changing_tides) | 解缆与升帆成为真正的离岸准备。 |
| 4 | [Tchia / Awaceb](https://www.awaceb.com/tchia) | 玩家已有的乐句与交通转换继续参与旅程。 |
| 6 | [Hoa 官方资料](https://www.hoathegame.com/presskit) | 生物、植物轮廓和场景尺度的可读性；当前页介绍 Hoa 2，不能当作已完整试玩的发行作品。 |
| 7 | [Quaternius Ships Pack](https://quaternius.com/packs/ships.html) | 船体、船首、桅杆、帆的比例层级。 |
| 8 | [3DTextures 许可页](https://3dtextures.me/about/) | 免费纹理许可与材质区分的方法。 |
| 9 | [Poly Pizza Sailboat](https://poly.pizza/m/6okvxHsSdzO) | 简化船模通过轮廓与负空间保持辨识度。 |
| 10 | [cgbookcase 免费纹理目录](https://www.cgbookcase.com/textures) | PBR 材质结构与后续免费候选资源。 |

[研究记录](v11-research.md) 另外查阅了 Spiritfarer；它不在上述实际成功打开的八页记录中，因此不计入这八个浏览器站点。研究页与浏览器记录的清单目的不同，不应混用。新船、海岸、花群与材质均由本项目程序构造；上述站点没有素材被下载后植入本轮版本。Quaternius 旧包页与现行 QAL、Poly Pizza 按模型署名的许可差异仍按研究记录保留；“免费参考”不等于获得复制商业美术的许可。

## 与设计提案的差异及真实边界

- 九段是有限篇幅的独立可玩章节，航线有边界与终点；不是无限海洋、开放世界或完整航海模拟。结尾前移是最多约 40 秒、20 个场景单位的呈现动画，之后保留海面和环境动效，不宣称可以无限驶向新海域。
- 研究曾提出游絮预先在高石停驻、主动提示潮汐时机。实际游絮跟随角色，安全恢复与石面显隐已实现，独立寻路和潮汐引导行为尚未实现。
- 花瓣是有空间曲率的双面曲面，并没有制作完整实体厚度或组织级透光。帆的波动和船体浮动是受控动画，不是完整布料与流体耦合模拟。
- 种核组合已影响海上花群的配色和形态排列；设计中“各组合专属结语”未实现，当前共享同一段结尾正文。写信也不自动把前三段作品拼贴进正文，玩家可以自己表达，八拍作品通过声音回响。
- 触屏控件、键盘操作、暂停和状态恢复已在代码中实现；不能据此替代实体手机、人类首次试玩、音频听感或长时性能验证。是否好玩、自然完成时长、商业用户群和付费意愿仍需观察真实玩家。
- 原参考视频的视觉分析与旧版证据继续留档；本次没有把“逐帧完全一致”“电影或 AAA 级别”“细节无可挑剔”写成已被证明的结论。

继续阅读：[操作与存档说明](../../spring-letter/README.md) · [素材来源与许可](../../spring-letter/ASSET_SOURCES.md) · [实际验收与限制](../../spring-letter/FINAL_QA.md)。
