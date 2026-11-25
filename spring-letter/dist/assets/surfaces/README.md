# White Plaster 02 — 免费表面细节

来自 [Poly Haven / Rob Tuytel](https://polyhaven.com/a/white_plaster_02)，采用 [CC0](https://polyhaven.com/license)。许可原文保存在 `CC0-1.0.txt`；精确下载地址、SHA-256、官方 MD5 与解码结果保存在 `source.json`。2026-11-18 从官方 CDN 下载，无账户、订阅或费用。

| 文件 | 内容 | 传输字节 | 实际解码 |
|---|---|---:|---|
| white-plaster-02-normal.jpg | OpenGL 切线空间法线 | 652,310 | JPEG / 1024 × 1024 / RGB |
| white-plaster-02-roughness.jpg | 粗糙度 | 295,900 | JPEG / 1024 × 1024 / L |

两图共 **948,210 字节（约 0.90 MiB）**。Pillow 完整载入成功，两个 MD5 均与官方 API 相符。未下载 diffuse、位移或 4K/8K 包。

使用范围：白色台座、石拱、浅色建筑。保留现有底色；法线强度建议从 `normalScale = (0.12, 0.12)` 开始。法线和粗糙度都是数据纹理，不设置 sRGB。材质原始横向尺寸约 1 米，重复率须按实际物体尺寸调节，防止微纹理看成巨型岩壑。花、玻璃与水面继续使用各自材质。

内存预算按两张纹理最终以 RGBA8 上传并有完整 mipmap 估算，约 **10.7 MiB**；这是预算估计，不是浏览器实测。首屏若需要压缩总传输量，可在环境出现前异步载入，载入失败保留已有纯色材质。不要把传输文件大小等同于显存。

## v5 古石表面：Mossy Rock

作者 Rob Tuytel，来源 [Poly Haven](https://polyhaven.com/a/mossy_rock)，CC0。2026-11-19 获取 1K OpenGL 法线（995,727 字节）与粗糙度（780,918 字节）；均已完整解码为 1024 × 1024，并核对官方 MD5。用于古石的微表面细节，不下载或冒用网站作品图。官方元数据在本目录，精确地址、SHA-256 与解码结果见 [v5-source-record.json](../v5-source-record.json)。
