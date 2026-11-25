const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.resolve(root,f),'utf8')),proof=read('evidence/v8/release-evidence.json'),build=read('evidence/v8/build-'+proof.candidate+'.json');
const data=Object.fromEntries(['play','mobile','visual','soak','legacy','saves','static','keepsake','audio','audioAnalysis'].map(k=>[k,read(proof[k])]));for(const k of ['play','mobile','visual','soak','legacy','saves','static','keepsake','audio'])assert.equal(data[k].passed,true,k);
const unit=fs.readFileSync(path.join(root,proof.units),'utf8');assert.match(unit,/fail\s+0/);const total=unit.match(/tests\s+(\d+)/)[1],entry=path.posix.basename(build.entry),audio=data.audioAnalysis,loading=data.visual.observations[0].loadingTiming;
const windows=data.soak.samples.map(s=>s.frameWindow).filter(Boolean),maxField=key=>Math.max(...windows.map(w=>w[key]));
const text=`# 0.6.0 · 来信之庭 验证记录

2026-11-21。冻结候选 **${proof.candidate}**，脚本 **${build.entry}**，样式 **${build.style}**。以下运行证据属于这套候选；发行复制已测字节，打包与正式5192地址另外核对。旧0.5证据和发行包保留，不作为本轮通过的替代。

## 玩法与保存

新隔离浏览器以普通WASD、鼠标和可见按钮完成三庭：雨庭转石接老树；风庭避开旧井接迎客灯；回访雨庭改写新芽；潮庭双源接新声。实际检查预览不写完成、键盘撤销与提示、菜单暂停、回信后下一步、已回信庭院的显式追踪及花尘往返。随后沿陆路返回旧台、手绘两段桥、步行到终庭、拿取和安放两种核、取消预览后确认寄出，再刷新续玩。共 **${data.play.checks.length} 项**，没有注入通关进度或调用状态设置器。

旧玩法兼容路线另以新旅途普通输入完成三庭追风与回巢、手绘桥、种核及结尾，共 **${data.legacy.checks.length} 项**。它验证旧路线仍能推进，不等于新玩家能自行理解或觉得有趣。

存档UI **${data.saves.checks.length} 项**：实际JSON下载、新旅途取消与备份、上一封恢复、导入预览/取消/确认、损坏和未来版本拒绝、两页面冲突保护、原本拒绝localStorage的隔离环境中明确选择临时游玩并导出/导入。恢复测试使用前一次普通通关真正获得的档案，没有伪造解锁。

## 画面、触屏与个人留存

${data.visual.switches.length} 个花型/光学系列组合实际切换，保留 ${data.visual.observations.length} 张图与快照；检查首次按需准备、散聚自然返回、夜色与轻缓动态。图像审读包括源花/流路可读性、人物布料与邮袋、来信和出口布局；近看棋盘时人物及游絮不再挡住石片。没有宣称参考视频逐像素复刻或商业AAA质量。

390×844 Chromium触屏仿真 **${data.mobile.checks.length} 项**，覆盖三庭点石/撤销、愿望全文入口、可滚动回信选项、源花碰触，以及关面板后真实触摸行走。不是物理手机测试。另 **${data.keepsake.checks.length} 项** 覆盖Alt+Enter/Esc全屏、1440×1040春信明信片和原始风景PNG下载、自愿反馈表的空值/预览/修改/本地导出。反馈测试使用明确标为自动化样本的答案，不能当真实用户研究。

## 真实声音

实际游戏AudioContext输出录制 **${data.audio.checks.length} 项检查**；完整解码分析 **${Object.keys(audio.checks).length} 项检查**。七种乐器与九个新音效的真实请求、解码和哈希有记录。包括短按落脚、持续草/石轮换、停止、雨庭转石与回信、主花散聚/风笔、静音和菜单暂停。

分析报告：[实际混音检查](${proof.audioAnalysis.replace(/\.json$/,'.md')})。没有用离线编曲替代实录，也没有人工听感审听结论。该录音不含可选追风或潮庭两种回信；潮庭同音高动机的齐拍/半拍差异由纯编曲与事件调度测试覆盖。

常驻音频为16节点/3播放源，前景最多48声部。静音和暂停分别检查增益输出与AudioContext时钟；音量分析不被称为LUFS、true peak或设备听感认证。

## 工程与部署

Node规则/存档/布局/资源生命周期检查 **${total}/${total} 通过**。连续普通输入运行 **${data.soak.elapsedSeconds.toFixed(1)} 秒、${data.soak.cycles} 轮**，反复追风、雨庭源花散聚、20组合切换、静音、菜单和续玩；同阶段几何/纹理/程序数量在预热基线容差内，音频节点和声部队列有界。诊断计数不等同底层GPU内存采样。

1280×800 下的 ${windows.length} 个重叠诊断窗口中位帧间隔约16.7毫秒；最差窗口p95为 ${maxField('p95Ms').toFixed(1)} 毫秒、p99为 ${maxField('p99Ms').toFixed(1)} 毫秒，最大间隔 ${maxField('maxMs').toFixed(1)} 毫秒，超过50毫秒比例最高 ${(maxField('over50Ms')*100).toFixed(2)}%。长间隔出现在包含批量换花型的窗口，后续轮次仍有约451–518毫秒的峰值；未做调用栈归因。窗口互相重叠，不能加总成独立样本，也不能据此宣称稳定60帧或无卡顿。换花型仍需继续优化。

本次视觉检查首次页面准备记录 ${(loading.totalMs/1000).toFixed(2)} 秒，加载幕结束 ${(loading.overlayHiddenMs/1000).toFixed(2)} 秒。只代表当前电脑、当前驱动缓存状态；没有跨设备/冷驱动基准结论。首次选择其他复杂花色仍有准备过程，之后复用。颜色采样优化的独立CPU对照见 ../docs/blossom/v8-performance.md。

静态根路径与 /embed/spring-letter/ 子目录均通过渲染、纹理、7乐器+9音效及来源链接验证。整套候选共 ${build.files.length} 文件、${build.files.reduce((n,f)=>n+f.bytes,0).toLocaleString('en-US')} 字节，不依赖远程运行服务。ZIP解压与逐文件HTTP校验结果在 evidence/v8/package.json；正式入口一致性在 evidence/v8/production.json（发行后生成）。

本机启动器已增加Node可用性检查；隔离副本强制指向不存在的Node后，返回1并显示安装说明，没有启动浏览器。见 evidence/v8/launcher-check.json。这不是干净Windows安装测试。工具链与仅项目版本元数据调整见 evidence/v8/toolchain.json。

## 证据索引

${Object.entries(proof).filter(([k])=>k!=='candidate').map(([k,v])=>'- '+k+': '+v).join('\n')}

## 仍需真人与目标设备验证

20分钟旅程是设计目标，不是盲测统计。尚未招募真实玩家、证明留存/付费意愿、完成物理移动设备测试或人工听感审听。8–12人招募文案、无引导观察脚本、受众假设与内部决策阈值保存在 ../docs/blossom/v8-product-release.md；这些资料已准备，不代表活动已执行。
`;
const old=path.join(root,'FINAL_QA.md'),backup=path.join(root,'.history/FINAL_QA-v7.md');if(!fs.existsSync(backup)&&fs.existsSync(old))fs.copyFileSync(old,backup);fs.writeFileSync(old,text);console.log('Wrote FINAL_QA.md for '+entry);
