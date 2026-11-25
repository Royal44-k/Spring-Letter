# 春信 v7 · 会呼吸的配乐与声景

2026-11-20。用户明确指出上一版没有应景 BGM，声音不生动。本轮把声音从几根常驻正弦波与偶发单音，改成有和声、乐句、层次变化的本地采样配乐。以下区分已实现、参考依据与尚待主游戏实录确认的部分。

## 研究与采用

- **ABZÛ / Austin Wintory。** 作曲者官方专辑和带文字、乐谱解说的整部配乐，展示了相同世界中不同段落的音色与密度差异。这里借鉴的是让音乐承担场景叙事、保留主题材料再改变编制的思路；没有下载或复制其音乐、旋律、音频素材，也不声称使用同一互动系统。[作曲者专辑](https://austinwintory.bandcamp.com/album/abz)、[官方作品解说](https://www.youtube.com/watch?v=mCL0jRV_xb4)。
- **Web Audio 的双时钟。** Chrome 团队文档说明音符应在 AudioContext 时钟上提前调度，不能把每次 JS/画面回调当成音乐拍点。本实现通过游戏 update 提交 0.55 秒前瞻事件，AudioBufferSource 的 start/stop 使用精确音频时间；主线程出现超过窗口的长停顿时会舍弃过时音符并重新落拍，不突发补播。[Chris Wilson：A tale of two clocks](https://web.dev/articles/audio-scheduling)。
- **VS Chamber Orchestra: Community Edition。** 官方仓库明确以 CC0 提供音源，录制者为 Sam Gossner、Simon Dalzell，剪辑为 Elan Hickler / Soundemote。本次选取七个小样本，实际下载、校验 Git blob、单声道重采样、裁去头部静音、淡出并保存许可。它是免费真实乐器录音，不是“免费试听但不能分发”的商用乐库。[作者仓库](https://github.com/sgossner/VSCO-2-CE)、[CC0 许可](https://github.com/sgossner/VSCO-2-CE/blob/master/LICENSE)。

Versil Studios 介绍页与所试 Audiokinetic ABZÛ 页面本轮访问失败；没有把这两个失败地址当成已阅读证据。付费音乐、生成式配乐服务与收费音源均未使用。

## 写给这个世界的音乐

本轮原创 **16 小节、3/4 拍**主题，以 D 大调与相关小调、九音和六音和弦组织。前四小节先给空间，随后进入长笛呼唤与回应，后八小节改变和声走向并收束。音乐并非每隔数秒抽取一个随机音。

|情景|听觉安排|实际变化|
|---|---|---|
|花庭晨光|柔和立式钢琴、竖琴、大提琴，后段才让长笛进入|76 BPM，低频支撑与分离声像，保留可听见的停顿|
|逐风挑战|原有主题加入拨弦节拍与少量三角铁|100 BPM；只在 challengeActive 时加入节奏层，收集连携有上行回应|
|风廊|同一主题的相关调性展开|86 BPM、较明亮的竖琴和更明显的风底|
|水庭|旋律改交钢琴，降低速度与动态|70 BPM，水声更近；夜间整体柔化|
|终庭与寄出|改变主题起点，保留未完成愿望的余韵|终局68 BPM；完成提示另有六音展开，不把整场景替换为“成功哔声”|
|花尘漂游／写风|竖琴提升一个八度、风底随有效动作抬起|相同和声材料随手势变化，下一小节自然换入新的编配|

曲目、旋律与配器数据位于 `spring-letter/src/audio-score.js`；七个录音样本位于 `public/assets/audio`。音源经过 22,050 Hz 单声道 PCM16 处理，合计约 1.28 MB；完整来源、原件 SHA256、Git blob 与处理后 SHA256 位于 [样本来源](../../spring-letter/public/assets/audio/sources.json)。不同音源文件的八度命名并不统一：已检查频谱，长笛 C4 文件实际约 523 Hz、大提琴 C3 文件实际约 262 Hz，因此播放基音分别按 MIDI72、MIDI60 设置，避免整件乐器错八度。

## 声音如何回应玩家

三条可独立调节的音量通道为 `music`、`sfx`、`ambience`。混响由通道音量之后送出，避免音乐滑到零却仍漏出湿声；已有混响尾音会自然衰减。全局静音与暂停在主音量处静止，并清理当前音符与等待事件。

- 步行产生左右轻微错开的足音；冲刺带气流与高音竖琴，不仅加快原来同一个哔声。
- start、collect、bump、complete、timeout、dash、burst、plant、bridge 各有明确事件音色；连携拾取改变上行音程，失败采用短促钝击／下行钢琴而非刺耳警报。
- 风、水为本地生成并滤波的循环声景；花庭有稀疏的原创三段鸟鸣。环境声音是合成声景，不冒充自然现场录音。
- 前景音符会短时让音乐退后，支线阅读时也降低音乐；保留场景声，不让每次提示都盖住配乐。
- 场景在相关调性间过渡，已调度音符自然结束，新的音色和速度在后续小节进入。暂停后从下一小节继续主题索引，不宣称逐采样恢复暂停点。

## 接口与验证范围

旧接口 `unlock / note / chime / update / setMuted / pause / dispose / getStats` 保持。新增 `event(type,payload)`、`setMix({music,sfx,ambience})`、`ready()`。update 接收 zone/night/opening/branch/ended/moving/speed/dashing/challengeActive/combo/flowerPhase/gestureActive。

`getStats()` 提供已加载样本、加载错误、真实调度数量、当前曲名、音量、持续节点/声源、临时声部、待播事件与过期调度计数。临时声部限制48，环境常驻声源2；这两个值不是继续沿用 v6 的14节点/4声源假定。音乐稍后的浏览器实际输出应另做录音验证，不能只看调用次数。

本模块的5项CPU测试通过：和声/乐句及挑战配器差异、重复unlock不复制音频图、音频时钟前瞻、暂停/静音清理和恢复无积压、事件洪峰的声部上限与销毁、通道音量与混响路径。样本还经过实际解码、频谱和波形检查；这些不是主观听审。

[48秒编配试听](../../spring-letter/evidence/v7-audio/spring-letter-music-showcase.wav)依次各12秒为庭园、挑战、水庭、终庭；另外有四段完整乐章：[庭园](../../spring-letter/evidence/v7-audio/music-garden.wav)、[挑战](../../spring-letter/evidence/v7-audio/music-wind.wav)、[水庭](../../spring-letter/evidence/v7-audio/music-pool.wav)、[终庭](../../spring-letter/evidence/v7-audio/music-finale.wav)。这些由实际乐谱与实际样本离线渲染，使用简化房间回声，明确不是游戏实录。最后一次试听峰值约0.452、RMS约0.057、削波样本0，完整数据见 [试听分析](../../spring-letter/evidence/v7-audio/preview-analysis.json)。没有把波形检查写成“已经听过”。

## 尚存边界

七个单样本的音域拉伸、人工音量包络与有限动态层，无法等同真实乐团演奏；目前没有人物配音、录制拟音组或专业母带处理。浏览器主线程停顿超过0.55秒仍可能造成音乐漏音，但会重新落拍而非积压爆发。具体音量、听感、页面暂停与活动事件联动，以根任务的主游戏真实录音/游玩验证为准。
