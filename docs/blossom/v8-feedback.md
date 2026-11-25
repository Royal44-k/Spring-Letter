# 自愿试玩记录：本地使用说明

2026-11-21。配合 [产品研究中的“下一轮真实玩家验证卡”](v8-product-research.md)使用。问卷只是玩家主动填写的补充反馈，不是自动埋点、留存数据或已经找到市场的证明。本轮没有招募、发送邀请或收集真实玩家记录。

## 玩家看到的流程

打开“试玩记录” → 自己选择操作熟悉程度、是否愿意继续、最喜欢的环节、叶脉理解 1–5 → 可选填写至多 800 字建议 → 预览 → 自己点“下载试玩记录”。

所有主观选择初始为“请选择”，不会默认填“愿意”或高分。“说不准”“暂时不”“暂时没有特别喜欢的环节”都是有效答案。预览前后均可退出，不产生本地持久化，也不影响游戏。返回修改只在当前对话框内保留刚才填写的内容；重新打开从空表单开始。

下载是浏览器本地 JSON 文件，不上传、不发送。玩家自行决定保留或另行分享。界面提示不要填写姓名、联系方式等个人信息；没有身份字段。自由文字仍需由填写者在预览中自行检查，不声称能自动识别一切个人信息。

## 接线

模块：`spring-letter/src/playtest-feedback.js`。

```js
const feedback = createPlaytestFeedback({
  openModal,
  closeModal,
  toast,
  getSummary: () => ({
    version: '0.6.0',
    playedSeconds: activePlaySeconds,
    letters: completedLetters(state.letters).map(letter => letter.id),
    chapter: state.ending ? 4 : state.bridge.solved ? 3 : state.wind.solved ? 2 : state.p1.solved ? 1 : 0,
    ending: state.ending,
    quality: state.settings.quality,
    viewport: {width: innerWidth, height: innerHeight},
  }),
});
// 用户自己点击入口时才打开。
feedback.show();
```

`playedSeconds` 应累计实际游玩时间，排除扉页、菜单暂停与失焦；这不是一份已经持续几天的存档总时长。模块在玩家请求预览时取一次摘要；下载的是刚才预览的同一份内容，期间不偷偷补字段。

允许的样式类：`.feedback-notes`（textarea 宽度/边框）、`.feedback-verbatim`（保留文字换行）、`.feedback-json`（JSON 换行或滚动）。其余沿用现有 modal / row / option / journal-entry。模块没有内嵌样式。

## 数据契约

纯函数 `buildFeedback(answers, summary)` 返回 `{ok:true,data}` 或 `{ok:false,field,error}`。它本身不读取浏览器、时间、存储或网络。

answers 字段：

| 字段 | 值 |
|---|---|
| familiarity | new / sometimes / often |
| continueInterest | yes / unsure / no |
| favorite | leaf-channels / flower-particles / wind-chase / exploration / letters-story / music-atmosphere / none |
| clarity | 显式整数 1–5 |
| notes | 可空字符串，去两端空白后至多 800 个 Unicode 字符 |

session 只保留 version、playedSeconds、letters、chapter、ending、quality、viewport.width / height。版本来自 root 提供的实际版本号；时间取非负整数秒；庭院只保留 rain / wind / tide 且去重；章节 0–4；画质沿用已知三档。未知字段不转发，包括身份、IP、UA、原始存档或额外时间戳。

记录固定格式是 `spring-letter-playtest`、schemaVersion 1。不包含生成时间、账号、设备型号或参与者编号。不应用这些文件推算活跃用户、付费率或总体满意率。

## 已验证范围

6 项纯逻辑检查通过，覆盖白名单与输入不变、未知隐私字段排除、空答案不被正向默认、评分范围、文字长度与字面保留、非法摘要拒绝。源码语法检查通过。尚未做浏览器文件下载、表单焦点和移动布局验收；由主代理在固定候选中完成。
