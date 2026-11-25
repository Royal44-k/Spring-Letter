# V5 花尘与风笔：实现、参考和验收

本文件记录实际完成的粒子模块，不将效果研究等同于完成整款游戏。代码范围是 `spring-letter/src/particles.js`、`spring-letter/src/gesture-field.js` 及对应测试；镜头、暗场过渡、玩法与输入绑定由主集成负责。

## 参考回看与主动研究

回看项目已有的原视频逐帧记录，并重新观察粒子原片 `frame-0133`、`frame-0196`、`frame-0560`、`frame-0725`：重点是粉上蓝下、暗背景中的空间表面、局部受力拉出的薄片，以及扰动区之外仍成立的形体。不是将整个物体均匀炸散成星空。原片的人物模型与新作的花朵模型不同，本实现保持花朵的同源采样，并非宣称像素级复制。

补查的一手来源：

- [Dominik Fojcik：Crafting a Dreamy Particle Effect with Three.js and GPGPU，Codrops](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/)。作者介绍将指针位置和移动速度传入 GPGPU 速度着色器。借鉴的是“输入影响速度、形体有记忆”的方法；没有搬运其源码。正文直接打开返回 403，本次能核查的是搜索返回的作者正文片段，不能声称完整审读文章。
- [Pavel Mazhuga 的实验室](https://pavelmazhuga.com/lab/)及其[风场实验](https://pavelmazhuga.com/lab/flow-field/)、[魔杖笔触实验](https://pavelmazhuga.com/lab/magic-wand-cursor/)。作者明确将这些归为 WebGPU/TSL/shader/compute 实验。借鉴连续笔触与流场作为艺术交互的方向，未下载、复制或引入其许可不明的代码、贴图或模型。本次网页文本不能证明其具体算法。
- [Three.js GPUComputationRenderer 官方源码](https://github.com/mrdoob/three.js/blob/master/examples/jsm/misc/GPUComputationRenderer.js)。项目使用本地锁定的 Three.js 0.185.0，`GPUComputationRenderer` 的双缓冲是现有粒子仿真的基础；本地依赖包含 MIT 许可。新增着色器、笔触几何和力场为本项目实现，不需要付费服务或素材账户。

## 三轮美术判断

首轮把球状散开替换为三层螺旋带。它在暗场中有明显留白和粉蓝层次，但全散后呈现多圈示意图，花源的几何身份变弱。实际截图留在 `spring-letter/evidence/v5-particle-ribbons-first.png`，作为被继续改进的阶段证据。

第二轮改为从原花瓣表面的方位角和高度出发，让受风后仍能看见花枝与花瓣的来处：

- 约 36% 采样维持受风扭转的花枝骨架，稀疏呈现。
- 约 44% 采样沿原花瓣方向抽出开放曲面，构成较亮的花尘薄片。
- 约 20% 采样填在骨架和薄片之间，形成轻而细的放射连接。

三种密度都使用相同的稳定采样 ID。散聚只改变目标位置，开合仍插值原始含苞/盛放两套真实采样。粉蓝色来自源表面高度，因此被手拖开后不会突然按世界高度换色。

第三轮对照固定 5197 的受力截图，发现连续经过的花尘中部容易泛白，削弱粉上蓝下的色相关系。热亮改为提升原色亮度并只混入少量暖光，不再把整片受力区推向白色；只有约 4% 的稳定采样有短促闪光峰值。标准档点径略收细，低档仍保持可读性。该调整在 `v5-particles-gpu-weave.png` 中已验证，晚于 5197 固定包，不能算进该包的审美截图结论。

## 实际交互与接口

```js
particles.update(dt, time, {
  bloom, dispersion, opacity, pointer, night, reducedMotion,
  gesture: {
    active: true,
    position: localPosition, // THREE.Vector3，与 particles.object 同坐标系
    velocity: localVelocity, // 坐标单位/秒
    strength: 0.8,           // 归一化，内部限幅 0..1
    mode: 'weave',           // 或 'gather'
  },
});
```

`weave` 在笔触附近放松回位弹簧，让指针速度携带粒子，并加入小幅切向旋转；`gather` 使局部粒子形成柔和的聚束。力场使用有边界的平滑衰减，不会影响远处全部花瓣。按下、输入变化、松开都经过连续包络。松开后力和速度自然衰减，弹簧将采样带回当前开合/散聚目标；粒子模块不需要“点击恢复”事件。

被笔触触及的粒子有热亮值，存在速度纹理的第四通道中，离开笔触后逐渐冷却，能读出刚刚经过的路径。热亮不增加粒子数量或额外绘制调用。极端速度、非有限值、长帧均做限幅；半隐式欧拉积分的小步长最大为 1/60 秒。

质量切换也保持连续：GPU 状态按稳定采样 ID 从旧图集搬到新图集，不能直接按 UV 缩放，否则会打乱点与花瓣的关系。降档保留的 16384 个粒子同时保持当前位置、速度和热亮；升档新增的点从当前散聚目标开始，已有点不跳回花形。旧纹理在新图集复制后释放。

```js
const brush = createGestureField({
  maxPoints: 96, lifetime: 1.8, width: 0.035,
  color: 0xf5c7e8, quality: 'standard',
});
scene.add(brush.group); // 世界输入挂 scene；局部输入挂对应模型的父节点
brush.update(dt, time, { gesture, reducedMotion, opacity: 1 });
brush.setQuality('low');
brush.clear();
brush.dispose();
```

风笔模块只读输入，不绑定鼠标或键盘。两条互相交叉的薄带合为一个 Mesh，环看时不容易完全侧对视线消失；一组 Points 带出少量飘尘，合计最多两个 draw calls。低档省去飘尘且轨迹最多 48 个样本，只保留一个 draw call。连续笔画按距离补采样并设置每帧上限，慢速小幅移动会累计而不会被阈值吃掉。抬手再按下不会连接到旧笔画。

## 验证证据

自动化入口：

```text
cd "D:\AI Game\spring-letter"
node --test tests/particles.test.js tests/gesture-field.test.js
node tests/particles-gpu.cjs
```

GPU 测试默认访问开发服务 `http://127.0.0.1:5194`，可通过 `SPRING_URL` 指定其他 Vite 服务；独立测试页不操纵游戏进度。结果写入 `spring-letter/evidence/v5-particles-gpu-verification.json`。

已通过 8 个 Node 测试：原采样不变、真实降档、输入合法性、松开连续衰减、笔画不跨空连接、样本容量上限、慢速笔触和销毁重复调用。

真实 GPU：Edge，AMD Radeon(TM) Graphics，经 ANGLE D3D11；不是软件渲染器。最新 2026-11-19 02:44 UTC 的 65536 个 GPU 粒子实测：笔触附近 22235 个样本平均位移约 0.527 单位；远处 2166 个样本平均位移为 0；松开 4 秒后整体验证平均回位误差约 4.48e-7 单位；热亮最大值由 0.899 降到 0.00067；状态全部有限，无着色器或页面错误。低档使用 128×128=16384 个状态纹素，风笔下降为 1 次绘制。采样数量随主花几何修订改变，这些数值对应报告时间的实际几何，不应与旧版本数值混作性能提升。

质量重建额外检查：高→低后保留点的位置与速度逐分量误差为 0；低→高后已有点的位置误差也为 0。连续四轮高低切换后渲染器纹理计数保持 8，没有逐次泄漏。

同一真实浏览器还强制走解析回退路径并绘制，覆盖回退着色器、减少动态设置与风笔输入的组合，无编译错误；这不等于已经测遍不支持浮点纹理的硬件。

集成截图：`v5-particle-morph-integration.png` 展示同源银花/点云交接；`v5-particle-scatter-integration.png` 展示新骨架与开放薄片；`v5-particle-brush-integration.png` 展示玩家风笔与局部受热。路径均在 `spring-letter/evidence/`。截图来自主开发服务当时状态，后续主集成继续调整环境光、镜头和字幕样式。

这些是模块功能与稳定性检查，不是全游戏帧率保证。单帧截图和测试页快进不能证明主机、移动端或长时间实际游玩的性能。

## 边界与仍需判断的地方

- 不支持浮点颜色目标的设备使用解析回退：仍有同源形体、流场目标、平滑输入及局部偏移；没有 GPU 分粒子惯性和持久热亮。`getStats().backend` 明示 `analytic-fallback`。
- 粒子不是完整流体或粒子间碰撞模拟；风力是可控的局部艺术力场。这样能稳定回到同一朵花，并控制性能。
- 输入坐标系必须与粒子物体一致。主集成若移动/缩放花束，应正确变换 position 和 velocity；把世界坐标直接传给有位移的局部对象会让笔触错位。
- 暗场、镜头距离、可见实体花透明度、剧情时序由主集成负责。本模块无法单独保证花→尘全流程视觉一致，需要集成截图和实际交互复核。
- GPU 读回测试使用有限的笔触路径；后续若改积分、范围或质量重建流程，需重新运行稳定性测试。
