# 资产索引

## 游戏与发行

| 内容 | 位置 |
| --- | --- |
| 场景、人物、花卉与粒子 | [游戏源码](spring-letter/src)。地图、花瓣、桥、船、海上花路等由几何、材质和动画代码构建。 |
| 贴图、光照、乐器与环境音 | [运行时素材](spring-letter/public/assets) · [制作、出处及许可](spring-letter/ASSET_SOURCES.md) · [随包许可文本](spring-letter/THIRD_PARTY_LICENSES.txt) |
| 可部署网站与下载包 | [冻结的静态站点](spring-letter/dist) · [0.9.1 的两个 ZIP](spring-letter/releases) |
| 设计与研究 | [叙事与关卡脚本](docs/blossom/script-v4.md) · [新地图设计](docs/blossom/v12-design.md) · [历版设计和经验记录](docs/blossom) · [参考网站目录](docs/blossom/reference-websites-2026-11-23.md) |
| 回归与实机验收 | [自动化用例](spring-letter/tests) · [0.9.1 发行证据](spring-letter/evidence/v13) · [冻结清单](spring-letter/evidence/release-manifest-v13.json) |

## 宣传与制作

[首发文件夹](spring-letter-promo/首发物料)按发布顺序编号。01 和 02 为实机宣传片及封面，03 和 04 为两幅无字概念图，05 是实机对照图，06 至 08 为文案、标签和首次发布指南，09 为互动开发合作案例卡。[完整首发包](spring-letter-promo/春信-小红书首发物料.zip)方便一次下载。

[制作母本分支](https://github.com/Royal44-k/Spring-Letter/tree/production-assets)保存大体积的可编辑原料。以下目录在该分支内保留采集、剪辑和声音处理脚本原用的相对路径。

| 内容 | 母本分支中的位置 |
| --- | --- |
| 实机镜头、逐帧画面、剪辑时间线和检查记录 | [宣传片工作目录](https://github.com/Royal44-k/Spring-Letter/tree/production-assets/spring-letter-promo/work) |
| 自然录音及动作音原件、处理脚本 | [环境音工作目录](https://github.com/Royal44-k/Spring-Letter/tree/production-assets/docs/blossom/research/v8-audio) |
| 配乐取样、乐谱与来源记录 | [配乐母本](https://github.com/Royal44-k/Spring-Letter/tree/production-assets/spring-letter/.tools/v7-audio) |
| 已完成的早期实机录制 | [历史录像与录制记录](https://github.com/Royal44-k/Spring-Letter/tree/production-assets/production/archive) |

如需单独取用母本，可以在本机克隆制作分支。

```sh
git clone --single-branch --branch production-assets https://github.com/Royal44-k/Spring-Letter.git Spring-Letter-production
```

网上找到的两段参考视频和第三方网站截图仅作内部视觉研究，再分发许可尚未确认。仓库收录[逐段分析](docs/blossom/video-analysis.md)、参考链接和本项目自行制作的成品。历史研究文稿中的本机路径、旧版号和当时的测试结论保留原貌。当前发行版本以根目录的下载入口为准。
