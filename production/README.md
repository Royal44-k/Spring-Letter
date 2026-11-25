# 《待寄出的春信》制作母本

这个分支以 0.9.1 可玩版为底稿，保留宣传片的实机镜头、可重新剪辑的逐帧画面、声音原件，以及各次实机验证生成的图像。成片与概念图仍可在[首发物料](../spring-letter-promo/首发物料)中找到。

| 内容 | 入口 |
| --- | --- |
| 七组实机镜头、采集记录与连续帧 | [rushes](../spring-letter-promo/work/rushes) |
| 镜头顺序、入出点与字幕 | [edit.json](../spring-letter-promo/work/edit.json) · [剪辑脚本](../spring-letter-promo/work/cut.py) |
| 原始取样与声音处理 | [配乐取样](../spring-letter/.tools/v7-audio) · [环境音与动作音](../docs/blossom/research/v8-audio) |
| 全程操作与花尘材质验证 | [实机行程](../spring-letter/evidence/v12/full-2026-11-23T04-53-23-576Z) · [材质与分档画面](../spring-letter/evidence/v10/render-2026-11-23T06-32-25-833Z) |
| 实机声音样带 | [写信、扬帆与终章](../spring-letter/evidence/v11/audio-1795402325781) · [雨幕温室、沉星天文台与云海花甸](../spring-letter/evidence/v12/audio-2026-11-23T04-59-50-388Z) |
| 早期已经完成的实机录像 | [录像及原始验证记录](archive) |
| 母本文件的 SHA-256 | [校验表](SHA256SUMS.txt) |

要重剪现有原片，剪辑脚本使用 Python、PyAV、NumPy 和 Pillow，字幕使用 Windows 字体。脚本输出到首发物料目录，建议在单独的工作副本操作。若要重新采集，请先按[项目说明](../README.md)安装游戏依赖，启动 5192 端口上的发行版，再从装有 Microsoft Edge 的 Windows 电脑运行游戏采集脚本。

```sh
node spring-letter-promo/work/capture.cjs
python spring-letter-promo/work/cut.py
```

音频原件的作者、下载来源与许可见[资料来源](../spring-letter/ASSET_SOURCES.md)及工作目录内的许可文本。第三方研究视频保留其引用和分析。
