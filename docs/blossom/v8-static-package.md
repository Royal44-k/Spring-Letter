# 可移动的静态网页包

2026-11-21。本轮只准备本地发行能力，没有上传、部署、登录服务或创建付费资源。固定候选的构建与浏览器验证由主代理继续完成。

## 为什么要改

原来 HDR、贴图、采样和游戏内许可链接从 `/assets/...` 或站点根目录加载。把游戏放在 `https://host/games/spring/` 时，这些路径会跑到 `https://host/assets/...`。itch.io 的官方说明也明确：HTML 游戏在子目录 iframe 中运行，根绝对路径会离开游戏目录；多文件游戏应将入口 index.html 和全部所需文件一起打包。[itch.io HTML5 文档](https://itch.io/docs/creators/html5)

Vite 的 `base:'./'` 使生成的 bundle 路径相对于文件；动态拼接的运行时资源仍需自己处理，不能只改构建选项。[Vite 构建文档](https://vite.dev/guide/build#public-base-path)

## 实际修改

- `src/asset-url.js`：`assetUrl(path, baseURI=document.baseURI)`，将包内相对文件解析到 index 所在目录。根部署与任意静态子目录使用同一份代码；查询参数与片段不成为资源路径的一部分。document.baseURI 是浏览器用于解析相对 URL 的基址。[MDN baseURI](https://developer.mozilla.org/en-US/docs/Web/API/Node/baseURI)
- `src/main.js`：仅新增 resolver import，替换两张 HDR 与四张微表面纹理的加载路径，并将素材/许可链接改为 `./ASSET_SOURCES.md`、`./THIRD_PARTY_LICENSES.txt`。其余游戏逻辑未在此任务中修改。
- `src/audio-engine.js`：仅新增 import，并将七种采样的 fetch 路径交给 resolver；本轮新增回信音效与调度逻辑保持原样。
- `src/atmosphere-garden.js`：仅新增 import，并将四张颜色/地表纹理路径交给 resolver。
- `vite.config.js`：新增 `base:'./'`，没有增添依赖。
- `scripts/build-v8.cjs`：固定候选的源清单纳入 vite.config.js，避免更改 base 却沿用旧构建证明。

resolver 只接受包内普通相对文件名；拒绝根绝对路径、外部 URL、父目录、反斜线、编码跳转、查询参数和片段。当前打包文件名均为 ASCII，保持文件名大小写一致。资源与游戏页位于同一基址，不引入 CDN。

无 DOM 的 Node 规则测试得到验证后的 `./assets/...`，这只是测试用相对地址，不是 Node 网络加载的兼容层。实际游玩要求 HTTP(S)，显式 file:// 基址会被拒绝；不承诺双击 dist/index.html 可玩。

## 后续打包与验收

网页 ZIP 应以 `index.html`、`assets/`、`ASSET_SOURCES.md`、`THIRD_PARTY_LICENSES.txt` 等 **dist 内文件直接作为根目录**，不能在 HTML 入口之前再包一层“dist”。Node 启动器仍属于另一个本机发行包，不需要放进网页包。

固定新候选后，在本地服务器同时从 `/` 与 `/games/spring/index.html` 运行，逐个核对脚本、样式、HDR、表面图、七种采样和两份许可链接；体验实际开始、音频解锁与全屏。只在根地址通过不算完成嵌入路径验收。若使用目录地址，服务器应提供正常的末尾斜线目录解析。

后续脚本读取构建 entry/style 时应允许 `./assets/...`，用 `new URL(entry, pageURL)` 解析；不要再假设构建结果必为 `/assets/...`。路径能力调整不等于已经在 itch.io 或其他第三方平台验收。

## 已做检查

6 项 resolver/实际表面加载器检查，连同音频与地表回归共 **17 / 17 通过**。覆盖根 HTTP、HTTPS 子目录、index 文件名与 query/hash、文档基址、Node 无 DOM fallback、非法路径和 file:// 拒绝；实际采样 fetch 与表面 loader 均在模拟嵌入基址下请求游戏目录内文件。语法检查通过；`rg` 检查 src/index 中无遗留 `/assets/` 加载路径。

没有运行构建、浏览器或发布。本记录是代码与模块检查，不替代主代理后续固定候选的 HTTP 响应与实机验证。

## 最终发行补记

上述段落记录模块实现阶段。最终release-d已在根路径与 `/embed/spring-letter/` 各完成一次真实WebGL、纹理、七乐器、九新音效及许可链接检查，见 [HTTP运行报告](../../spring-letter/evidence/v8/static-2026-11-21T05-54-26-359Z/report.json)。

浏览器ZIP的入口直接位于根部；桌面ZIP包含本地服务与启动器，需要已有Node。两包各解压后核对52个文件的散列，并通过真正的HTTP服务逐文件读取相同字节。包大小、SHA-256与校验结果见 [发行包记录](../../spring-letter/evidence/v8/package.json)。本机5192已推广并检查，同版本 [正式入口记录](../../spring-letter/evidence/v8/production.json) 可查。未上传或发布到外网平台。
