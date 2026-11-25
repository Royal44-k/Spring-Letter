const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=n=>JSON.parse(fs.readFileSync(path.join(root,'evidence',n),'utf8'));
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]).sort();
const flow=read('v4-browser-verification.json'),boundary=read('boundary-verification.json'),visual=read('visual-verification.json'),fullscreen=read('fullscreen-verification.json'),audio=read('audio-verification.json'),recording=read('recording-verification.json');
for(const r of [flow,boundary,visual,fullscreen,recording])if(r.errors?.length)throw Error('A verification report contains errors');
if(!audio.passed||audio.checks.some(c=>!c.passed))throw Error('Audio verification did not pass');
const units=fs.readFileSync(path.join(root,'evidence/unit-verification.txt'),'utf8'),unitCount=Number(units.match(/tests\s+(\d+)/)?.[1]),unitPass=Number(units.match(/pass\s+(\d+)/)?.[1]);
if(!unitCount||unitCount!==unitPass)throw Error('Unit verification incomplete');
const files=walk(path.join(root,'dist')).map(f=>({file:path.relative(root,f).replaceAll('\\','/'),bytes:fs.statSync(f).size,sha256:hash(f)}));
const sourceFiles=['src','tests','scripts'].flatMap(dir=>walk(path.join(root,dir))).concat(['index.html','package.json','package-lock.json'].map(f=>path.join(root,f))).map(f=>({file:path.relative(root,f).replaceAll('\\','/'),sha256:hash(f)}));
const manifest={version:JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version,date:new Date().toISOString(),sourceFiles,dist:files,totalBytes:files.reduce((a,f)=>a+f.bytes,0),checks:{units:unitCount,ordinaryFlow:flow.checks.length,boundary:boundary.checks.length,visual:visual.checks.length,fullscreen:fullscreen.checks.length,audioGraph:audio.checks.length},evidence:['v4-browser-verification.json','boundary-verification.json','visual-verification.json','fullscreen-verification.json','audio-verification.json','recording-verification.json','recording-file-validation.json'].map(f=>({file:f,sha256:hash(path.join(root,'evidence',f))}))};
fs.writeFileSync(path.join(root,'evidence/release-manifest.json'),JSON.stringify(manifest,null,2));
const rows=visual.states.map(s=>`|${s.name}|${s.samples}|${s.averageMs.toFixed(2)}|${s.p99Ms.toFixed(2)}|${s.maxMs.toFixed(2)}|`).join('\n');
const report=`# 花漾年华：待寄出的春信 · 0.2.0 验收

2026-11-18。独立四幕可玩章节，设计稿v4。发行目录 **${manifest.totalBytes.toLocaleString('en-US')}字节、${files.length}个文件**，运行素材全部本地化。具体源码、发行文件和证据散列见[发行清单](evidence/release-manifest.json)。

## 本轮实际交付

全屏入口及Alt+Enter/Esc；六段48秒实时序章，可跳过、逐段推进和重看；弥、游絮、岑的身份边界与角色册；三条可操作支线、四条旧记录、会进入个人回信的选择；更丰满柔和的银花、观花近镜、保留开度与视角的花/尘切换；512²真实平面倒影、原创光纹、CC0石材微表面；四区原创合成环境声与左右杯声。没有采购素材或调用付费生成接口。

记忆支线现在有幼芽、内外年轮、闭合时断开的流动与开放时重新贯通的流动；完成后保留玩家选择的姿态。支线镜头已避开石柱和角色遮挡。未醒的游絮不会提前跟随或在杯曲末尾回应。

## 验证与证据

|检查|结果|范围|
|---|---:|---|
|单元/几何/导演状态|${unitCount}/${unitCount}|规则、支撑、保存恢复、花表面身份、材质、散聚回退、取消/重看序章|
|普通输入完整流程|${flow.checks.length}/${flow.checks.length}|四幕、三支线、三结局、四旧记录、刷新保留.4旧花姿态、后期序章演员原点与存档位置隔离|
|浏览器边界|${boundary.checks.length}/${boundary.checks.length}|坏存档/禁用存储、失焦、低档粒子数、旋转、Esc、上下文丢失、仿真触屏|
|视觉交互|${visual.checks.length}/${visual.checks.length}|薄膜/追光、自然花色、半开反向散聚、三次散聚恢复、同后处理PNG导出|
|全屏专项|${fullscreen.checks.length}/${fullscreen.checks.length}|真实进入/退出、Esc不顺带关闭近看/设置、明确拒绝请求的窗口回退|
|隔离原生音频图|${audio.checks.length}/${audio.checks.length}|14个固定节点、声像、10前景声部上限、暂停/静音清队列、释放后零节点|

[流程JSON](evidence/v4-browser-verification.json) · [边界JSON](evidence/boundary-verification.json) · [视觉与帧时](evidence/visual-verification.json) · [全屏JSON](evidence/fullscreen-verification.json) · [声音图JSON](evidence/audio-verification.json) · [单元输出](evidence/unit-verification.txt)。浏览器页面/控制台error与流程失败资源数组为空；不是“无任何warning”的宣称。构建有Three.js合包超过500KB提示，未忽略实际输出大小。

流程只通过普通键鼠和UI推进；只读快照用于断言/导航，没有伪造通关状态。边界检查会明确注入损坏存储、失焦和图形中断。最后的Esc保护在完整流程之后增加，单独四项专项验证通过；之后只调深了自然花的粉/金纹理与细斑，并复跑单元、视觉交互及整段录像，关卡规则未改变。

音频报告是已哈希源码在原生Web Audio中的隔离图检查，**不是最终混音听感评审**。主页面中的解锁/暂停/静音与主循环接线已存在；没有把“没有JS异常”当作声音已达到电影品质。

## 连续实机录像

[打开无声实录](evidence/spring-letter-v4.webm)：包含完整自动序章、实体/花尘反转、三材质与花/尘鉴赏切换，1280×720。序章实测自动完成用时 **${(recording.openingElapsedMs/1000).toFixed(2)}秒**，结束时P1仍未自动解开。使用普通UI输入，未加速、未剪辑、未混入参考视频或渲染概念图；含载入与操作停顿。[记录元数据](evidence/recording-verification.json)。

六张v4-intro截图与v4-final银/晶/自然/点场截图是当前实机；v4-memory-isolated是隔离近景，不冒充最终游戏光照。用户参考帧只在研究文档中展示。

## 当前设备帧时间

${visual.device}；Edge无头，1440×900，均衡档。每个视图预热后约2.2秒采样。下表为浏览器帧间隔，不是GPU timer query，也不是长时压力或多设备测试。录屏在另一次运行完成，不混入性能采样。

|视图|采样帧|平均ms|P99 ms|最大ms|
|---|---:|---:|---:|---:|
${rows}

此设备六个固定视图平均范围为${Math.min(...visual.states.map(s=>s.averageMs)).toFixed(2)}–${Math.max(...visual.states.map(s=>s.averageMs)).toFixed(2)}ms；出现的最大帧间隔也列于表中。不能据此声称所有设备或整场游玩都稳定60fps。完整流程中的截图、全屏与切场间隔不作为上述稳态数据；冷启动、温度与长时内存变化仍需更多设备测试。轻盈档关闭额外镜面相机，并把粒子实际降为128²；标准为256²。

## 质量界限与资料

真实平面反射已实测，但水波/焦散仍为程序近似，不是流体求解或光线追踪。当前尚有建筑重复和明度层级、花朵微细节、首次玩家对记忆证据的理解、声音听感与真实手机适配空间。没有宣称逐像素复刻、完整3A大作、电影成片或未经试玩验证的长篇时长。

[剧本](../docs/blossom/script-v4.md) · [一手研究与免费素材](../docs/blossom/research-v4.md) · [逐项参考差距](../docs/blossom/quality-rubric-v4.md) · [素材总表](ASSET_SOURCES.md)。

[本机游戏](http://127.0.0.1:5192/)；服务器停后双击启动春信.cmd。地址只在这台电脑有效，未公开部署。
`;
fs.writeFileSync(path.join(root,'FINAL_QA.md'),report);
console.log(JSON.stringify({version:manifest.version,bytes:manifest.totalBytes,files:files.length,checks:manifest.checks}));
