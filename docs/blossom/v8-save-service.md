# 本地春信保险箱：接线说明

2026-11-21。模块 `spring-letter/src/save-service.js`；不依赖 DOM、Three.js 或服务器。它保护存储事务，不替代 `game-model.restore()` 对玩法的归一化。

## 数据与权威来源

`data = {journey, preferences, resonance, beforeLetter}`，四项都是 **raw JSON 字符串或 null**。journey 不被重新序列化，不丢失未知但合法的字段，包括本轮新增的 letters。journey / beforeLetter / resonance 要求已知 `version:1`；存在的 letters / lettersSent 也须是已知 `version:1` 且 entries 为对象，缺失字段的旧版仍兼容；preferences 沿用现有无版本格式（若显式带版本，只接受 1）。

权威存储是 `spring-letter:archive:v1` 一个键，包内有格式、版本、revision、savedAt、reason、完整 data。没有聚合档时读取旧四个键；读取不迁移、不写入，下一次成功 commit 才落聚合档。提交后镜像旧四键供旧工具兼容，但聚合档始终优先。

主档写入成功但镜像失败时，返回 `ok:true` 与 `warnings`，不能显示“整个存档失败”。主档/备份失败则 `ok:false`。不运行自动清除、不调用网络。

## API

```js
const saves = createSaveService(localStorage);
const result = saves.read();
// 首次 read 建立期望版本。以后 read 只报告，不接受另一页的新版本。
// result = {ok,status,data,summary,revision,backupAvailable,recoveryAvailable,error?}

const current = saves.reload(); // 用户明确重新读取时接受当前版本
const saved = saves.commit({journey:serialize(state), preferences:JSON.stringify(state.settings), resonance:resonance.persist()});
// saved = {ok,code,data,summary,revision,warnings} 或 {ok:false,code,error}

const preview = saves.previewImport(fileText); // 只验证，不写入，不变更 baseline
const imported = saves.importArchive(fileText); // 必须在 UI 确认后调用
const backup = saves.inspectBackup('previous'); // 或 'recovery'
const restored = saves.restoreBackup('previous'); // 必须在 UI 确认后调用
const exported = saves.exportArchive(); // 导出目前存储里的整档
const rescued = saves.exportArchive({journey:serialize(state), preferences:JSON.stringify(state.settings), resonance:resonance.persist()});
// rescued 可在写入失败/冲突时导出当前内存状态，不会替换本地档。
// 成功导出返回 {ok,text,filename,summary}；调用方创建 Blob 下载。
const raw = saves.exportRaw(); // 保全损坏/未来版本的原始内容，供人工诊断
```

`summary = {started,chapter,chapterLabel,ending,branches,exploration,resonanceCompletions,savedAt}`。chapter 0–4，4 表示已寄出。summary 只是展示摘要，不作为推进游戏的依据。

`read.status`：empty / legacy / ready；错误时 invalid / unsupported / unavailable / oversize。`commit.code` 另有 conflict / backup / write。不要仅看 `started` 来判断是否“没有档”；先检查 ok 与 status。

## 新旅程、恢复与失败

新旅程应先构造 fresh，确认后提交：

```js
const result = saves.commit({journey:serialize(fresh), preferences:JSON.stringify(fresh.settings), resonance:existingRecordRaw, beforeLetter:null}, {reason:'new-journey'});
if (result.ok) { /* 再替换内存 state、开始序章 */ }
else { /* 显示 result.error，保留现有 state */ }
```

reason 默认 autosave。`new-journey`、`import`、`restore` 会先固定保存被替换整档到 previous；普通保存不会滚掉 previous。每次有有效旧档的提交同时保存 recovery，供最近一次正常保存恢复。每次恢复也备份当下档，因此可撤销恢复。

损坏/未来档的 autosave 被拒绝。仅显式完整新旅程或完整导入可以替换，而且原始聚合档和旧槽原文必须先备份成功。无法识别的 previous 不能自动还原成新游戏；原始备份继续留在本地，不伪造“已修复”。

跨标签页：每次提交前和备份后再次比较原文 token；冲突不改主档。`read()` 不清除冲突，`reload()` 才接受新基线。UI 收到冲突后，应暂停自动写入并提供“重新读取已保存旅途”和“导出当前旅途”，不能先 reload 再把旧内存状态保存。localStorage 没有真正的 CAS；这里是旧写入检测，不是跨进程强事务锁。

基线匹配后，完全相同的 autosave 返回 `ok:true,code:'unchanged'`，不递增 revision、不更新备份；扉页初始化偏好不会无端阻断另一页游玩。legacy 的第一次提交仍迁移。显式 new-journey/import/restore 不走这个跳过路径。

`exportArchive(patch)` 的缺省项使用本页最后接受的整档，因此冲突后的内存旅程不会混入另一页面的启程前 checkpoint。无参数 exportArchive 明确导出最新磁盘整档。reload 和本页成功 commit 更新这份内存整档基线；普通 read 仅报告，不更新它。

导入最多 1 MiB UTF-8；每份内嵌 JSON 深度至多 32、树节点 50,000，拒绝危险原型键、非法 JSON、非对象、未知未来版本。所有拒绝在写入前完成。导入预览后确认仍应再次 `importArchive(text)` 验证原文，而不是提交界面可变对象。

## root 集成必须覆盖的入口

- 初始化与扉页继续按钮从 read 取 journey，只有 ok 才交给 restore；读取偏好时可用映射适配器把 preferences/journey 交给现有 readPreferences。
- 所有旅程、偏好、追风纪录、启程前检查点写入统一 commit；不要遗留 main 中的 localStorage.setItem 跳过权威档。
- `beforeLetter` 在启程前提交，回到启程前读取这个字段；新旅程显式清除，避免引用另一场旅途。
- 导入/恢复成功后，reload → restore journey → 重新应用偏好、音频、花型、画质、resonance、carried → resetPresentation。不要只更新 localStorage，让旧内存下一帧又写回。
- 旧 SAVE_KEY 保留给兼容；开发测试向旧槽注入数据时，需使用全新的隔离浏览器/同时清空聚合档，避免误以为迁移失败。

## 已执行的模块验证

18 项 Node 检查通过：旧四槽无写迁移、未知合法字段保留、误新局整档恢复、固定/滚动备份分离、多标签页冲突与显式 reload、损坏与未来档保全、只读导入预览、大小/深度/原型键限制、备份和主档配额错误、镜像失败区分、备份期间冲突、存储失败后内存旅程导出、嵌套 letters 未来版本拒绝、相同偏好不写入、冲突导出不混入他页 checkpoint。未用浏览器验证本轮 UI 接线，完整输入路线与导入/恢复交互需由主代理完成。

## 对话框模块

`src/save-panel.js` 导出 `createSavePanel({service,openModal,closeModal,getPayload,onLoaded,toast})`，返回 `show()`、`confirmNew(callback)`、`notifyFailure(result)`。

- show 展示本机状态、章节、时间、两种恢复点。导入先异步读文件与预览，再单独确认；取消不会写入。关闭窗口后到达的异步读结果被丢弃。
- confirmNew 仅确认，不自行创建游戏；存在旅途或读取失败时先展示说明，确定后关闭对话框并调用 callback，由 root 完成带备份的 commit。
- onLoaded(result) 在成功 import/restore/重新读取后调用；result 是 service.reload() 的结果，调用前已关闭对话框。root 应据此替换内存状态并应用偏好。
- getPayload() 返回当前希望导出的 rawbundle。**在扉页时应返回磁盘上的 data，而不是未开始的 createState；游玩中返回内存旅途。** 否则“导出当前旅途”可能导出空局。
- notifyFailure 对重复错误去重，避免五秒自动保存产生反复弹窗。冲突提示不自动 reload。
- imported JSON 仅进入服务验证和 `textContent` 摘要；`innerHTML` 只使用本地固定模板。Blob 下载不经过网络。

另 5 项非浏览器对话框逻辑检查通过：误重开取消、文件预览取消/确认、读文件中关闭、预览后多页冲突、重复失败去重。它们使用最小 DOM 适配器验证处理器和真实存档服务，不证明浏览器布局或真实文件选择器行为。
