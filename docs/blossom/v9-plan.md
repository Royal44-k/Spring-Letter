# 春信异质互动 Implementation Plan

> **For agentic workers:** 使用subagent-driven-development拆分独立玩法模块；用户已授权自主实施。

**Goal:** 用空间投影、连续飞行、声音创作替换重复三庭转轮，交付同一冻结版本。
**Architecture:** moments-controller协调三个独立机制模块；各自数据/输入/三维表现独立，main保留世界漫游与事务保存。
**Tech Stack:** Three.js、Vite、Web Audio、Node tests、隔离浏览器。
**Spec:** v9-design.md。

## 统一接口

`createXMoment({onSound})`返回group（本地原点）、bounds `{min:[x,y,z],max:[x,y,z]}`、cameraOffset `{x,y,z}`；`update(time,dt,{active,reducedMotion,palette})`；`pointer(type,raycaster,event)`（type=down/move/up/cancel，ray为世界射线，group.parent已在三庭世界位置）；`key(event)`；`action(id,value)`；`snapshot()`（JSON，至少ready/progress/hint/selected/controls）；`restore(data)`（可缺省）；`dispose()`。snapshot包含适合保存的draft字段。模块不要创建DOM/持久化/修改main。onSound事件由root路由至已存在的音频系统。

## 工作包

- [x] 光学空间模块、恢复/输入与规则测试。
- [x] 连续纸翼模块、风段/安全点/暂停与规则测试。
- [x] 声音创作模块、真实回放协议/恢复与规则测试。
- [x] 通用控制器与简洁UI；输入按下/移动/释放/取消，镜头分场景。
- [x] main整合，移除重叠旧装置，新旧回信edition兼容，事务提交。
- [x] 实机图像审读、普通输入三幕+结尾、声音、浏览器触屏仿真、存档与持续运行；范围和真实限制见[FINAL_QA.md](../../spring-letter/FINAL_QA.md)。
- [x] 固定0.7 release-i，提升已测字节到dist；生成Windows与浏览器ZIP，完成CRC、解压和全成员HTTP核对，更新文档下载入口与来源登记。证据见[包装记录](../../spring-letter/evidence/v9/package.json)。
- [x] 生产入口完整核对与最终收尾。验证脚本完成URL尾部斜杠正规化后，5192实际服务文件与冻结release-i逐一匹配；没有修改运行文件。见[生产入口记录](../../spring-letter/evidence/v9/production.json)和[FINAL_QA.md](../../spring-letter/FINAL_QA.md)。

## 重点验证

失焦/弹窗/离开清空拖拽和飞行输入；暂停不推进音乐游标；非有限草稿值恢复安全；旧结尾保持旧文字；试听不足不能假完成；画布事件不吞掉正常UI键盘；竖屏不让操作栏覆盖关键空间；真实触摸与鼠标共享规则。
