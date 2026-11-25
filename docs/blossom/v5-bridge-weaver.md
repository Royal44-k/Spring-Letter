# V5 第三幕：实景风笔织桥

目标是把“按钮选择桥”扩展成可以在水面空间完成的动作：从自己脚下的固定石台起笔，沿悬光逐一送出花尘，到彼岸后松手。动作完成只产生候选建造信号，既有 `setStructure` 继续负责最终安全判断和状态写入。

## 主集成接口

```js
import { createBridgeWeaver } from './bridge-weaver.js';
const weaver = createBridgeWeaver();
scene.add(weaver.group);

const signals = weaver.update(time, dt, {
  player: state.player,
  state,
  gesture, // 世界坐标，主相机射线与 y=.4 平面相交
  interactive: mode === 'play' && focus === 'pool' && !modalPaused,
});
for (const signal of signals) {
  if (signal.type === 'construct') {
    const result = setStructure(state, signal.shape);
    // 主集成按 result.ok 决定声音、字幕与保存。
  }
}
poolHint.textContent = weaver.context.hint;
```

`gesture.position` 使用世界 X/Z，Y 由视觉固定为 `.4`；`gesture.active` 表示风笔仍按住。正常抬手使用 `gesture.released=true`。`released=false` 的活动→非活动变化被视为中断，防止窗口失焦后恢复时误建桥。退出聚焦/打开设置可额外调用 `weaver.cancel()`，不需要更改主线状态。

`context` 每帧更新，包含：

| 字段 | 含义 |
|---|---|
| `available` | 此刻人在合法固定台且可以织桥 |
| `origin` | 当前起笔台 A / M / F / R |
| `status` | idle / drawing / ready / fading / committed / blocked |
| `shape`, `target` | 已由笔画实际方向选定的相邻桥与目标台 |
| `progress` | 有序节点完成度，0..1 |
| `hint` | 当前动作说明或可恢复的错误说明 |
| `anchors` | 当前路线有序世界坐标，含 `passed` / `next` |
| `fade` | 失败笔画淡退比例，0..1 |

`update` 只在一次完整笔画的正常松手时返回 `[{type:'construct',shape}]`，其他时刻为空数组。不会重复发送，也不会把被拒绝的桥偷偷排队到下一座台。`dispose()` 可重复调用。

## 判定规则

使用 `layout.js` 的同一组固定坐标：A(0,-26)、M(0,-32)、F(0,-38)、R(-5,-29)。支持 A↔M、M↔F、R↔M 三条既有结构；M 的三个方向由实际首先经过的悬光选择。

1. 风廊已经完成，且 `state.bridge.support` 为空。站在花桥或叶舟上时不可改建承托自己的结构。
2. 人必须在 `state.bridge.platform` 对应固定台中心 1.2 单位内。入口走廊、远处平台和仅修改当前 UI 选择都不够。
3. 指针在自己台心 0.75 单位内起笔。不能从远处起笔后滑回起点来冒充新笔画。
4. 依次经过五个后续悬光，节点容差 0.5 单位；沿线允许 0.85 单位偏差。帧间连续线段可命中经过的节点，不要求鼠标恰好停在每一个点上。
5. 单帧移动超过 2.15 单位视为断笔，不能从 A 瞬移到 M 直接跳过路径。
6. 人仍站在原固定台，笔尖仍在终点 0.75 单位内，正常抬手才提交。提前抬手、离路、移走人物、失焦、禁用交互或非法坐标都会取消。

失败笔画约 1.1 秒缓退；可以立即重新起笔，不必点击重置。图形不会接管相机事件。现有键盘/按钮入口可作为无障碍辅助保留，但不能绕开 `setStructure` 的承托安全检查。

## 视觉预算

最多四次绘制：一组悬空曲线、一组 18 个花形光珠、一条实际笔画预览、一枚起笔光环。下一颗悬光更暖，已连通部分渐亮；光珠有轻微上下呼吸。进度着色经过平滑追随，节点判定本身仍是严格顺序。预览与主风笔可共存，前者帮助读路径，后者保留玩家手写的细微曲率。

这部分是交互引导和暂态预览，最终花桥实体仍由现有世界模块呈现。若主集成增加花桥逐段长出的动画，应保留即时安全状态判定，避免“视觉已经有桥而承托还未开放”或相反的体验混淆。

## 验证与证据

```text
node --test tests/bridge-weaver.test.js
node tests/bridge-weaver-gpu.cjs
```

7 项纯判定/适配测试通过，覆盖正常完成、M 三向与逆向桥、远处起笔、跨越路线、单帧瞬移、占桥、风廊未解锁、错误平台、提前松手、离路、人物移动、窗口中断、非法坐标、缓退重试和资源销毁。测试核对输入主线状态未被模块写入。

真实 Edge GPU 测试页正常编译所有着色器，经过悬光后只发一次 `bridge_am` 信号，并通过既有 `setStructure`。没有控制台/着色器错误，模块只有四个渲染对象。证据在：

- `spring-letter/evidence/v5-weaver-idle.png`
- `spring-letter/evidence/v5-weaver-drawing.png`
- `spring-letter/evidence/v5-weaver-complete.png`
- `spring-letter/evidence/v5-weaver-gpu-verification.json`

这些截图来自独立模块测试场景，不能替代主游戏中从第一幕步行到第三幕、使用真实鼠标织桥的完整验收。
