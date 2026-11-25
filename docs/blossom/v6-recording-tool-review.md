# 连续实录工具审查

本轮只进行了 CPU 审查和轻量守卫测试；没有启动浏览器，没有录制或解码视频。当前根的独占 GPU 长跑不受录制工具启动影响。

发现并修正了四个具体边界：

- 原脚本在 browser.close 之后调用 video.saveAs；当前 Playwright 的 Artifact.saveAs 仍需通信通道。现改为 context.close → video.saveAs → browser.close。
- Playwright 1.65.1 默认 registry 指向用户缓存下不存在的 ffmpeg-1013；脚本在首次加载 Playwright 前设置进程内 PLAYWRIGHT_BROWSERS_PATH，实际 registry 现指向项目 .tools/playwright/ffmpeg-1013。已执行该路径的 -version，未安装新依赖或修改全局环境。
- 原规范名截图/报告会在重跑时覆盖；现在每次录制写入 evidence/v6-record-runs/独立标识，只有成功才按字节复制规范名，先保存以前的规范产物，并生成 v6-recording-copy-manifest.json。失败原件留在自己的目录。
- 原解码流程只在解码后计算当前视频散列，可能把同大小替换文件关联到旧构建报告。现在浏览器导出立刻记录 fileSha256，独立解码核验此散列、原始保留副本、录制 JSON 散列及 G 的 JS/CSS 资产散列。

verify-v6-media.py 使用项目已有的 python-deps（PyAV 19.0.2、Pillow 13.0.0），每帧实际解码、检查损坏标记和递增时间戳，联系表包含真实最后一帧。每次解码也独立保留原始结果；元数据测试不会生成 v6-media-decoding.json 或任何替代影像。

复测路径：

- Node：tests/recording-tools.test.js，7/7；会被项目 node --test tests/*.test.js 纳入最终总数。
- Python：scripts/test-v6-media-guards.py，9/9；执行后写 v6-media-tool-guards.json，标明纯元数据守卫，独立于实际解码报告。
- 全量运行须等根长跑完成：D:/NodeJS/node.exe --test tests/*.test.js；另用本机 Python312 执行 scripts/test-v6-media-guards.py。

工具审查证据为 spring-letter/evidence/v6-recording-tool-review.json，包含四个工具/测试文件的 SHA256。运行依赖证据为 v6-recording-runtime-preflight.json。发行清单与 QA/index 的 video/record JSON/decoder 身份约束由另一代理补入；运行 ZIP 本身只含本地游戏与启动器，录像作为独立媒体由 release-manifest.recording 绑定。

后续实际录制仍须根明确交接 GPU；这份工具审查不能当作连续实录或媒体解码通过。

## 实际录制完成（2026-11-19 20:19）

根完成G长跑与最终测试后正式交接GPU。v6-record.cjs已用普通输入从新存档走完六幕自动开场、首花自然散聚、风廊、双桥、两枚种核和memory+season首结局；6项录制断言通过，errors与requestsFailed均为空。没有跳过开场、剪辑、加速或注入进度。

独立原件目录为 spring-letter/evidence/v6-record-runs/2026-11-19T12-16-27-898Z-356002a9。规范录像 spring-letter-v6-uncut-silent.webm 大小68,597,088字节，SHA256=f57d147521215ae407c83c0e21e6486bf56166fce393e8481261aef5d67ac978。24个规范副本（含poster、存档、报告）均按字节复制，副本清单为v6-recording-copy-manifest.json。

JS BAJMaxNn及CSS B12KydA1首尾一致、内容散列与G候选相符。开场48.251秒，录制墙钟176.622秒，FFmpeg元数据175.88秒；它们采用不同起点，不声称精确同步。context和browser已按序关闭，GPU交回根。这里只确认录制与导出，实际全帧解码结果另见根随后执行的v6-media-decoding.json，不能用这段文字提前宣称解码通过。
