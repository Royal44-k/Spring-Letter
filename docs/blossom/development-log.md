# Execution ledger — plan: D:/AI Game/docs/blossom/execution-plan.md

2026-11-18, Asia/Shanghai.

## Decisions

- User explicitly requested careful design followed by development. Treat this as authorization to execute the refined direction without another procedural approval question.
- Independent project: `D:/AI Game/spring-letter`. Existing game stays outside the edit scope. No Git repository metadata was observed; retain this ledger, tests and screenshots instead of inventing commits or restructuring the old project.
- Follow native main integration with parallel specialist research/modules where bounded interfaces save time. The root owns integration, visual review and verification.
- Work name updated to 花漾年华：待寄出的春信. Preserve prior design documents as history; v3 supplements, rather than erases, reviewed mechanics.
- Standard renderer targets WebGL2/r185. Exact original algorithms and pixel parity are not claimed; visible reference controls and differences are explicitly tracked.

## Progress

- v2 main design and narrative/playability blueprint read; key silver-flower and disturbed-particle original frames re-examined in this turn. Existing 2629-frame analysis reused, not claimed as a fresh full-frame review.
- v3 art direction, release-design main entry and executable task plan written. Source-site, FPS-case and precise free-asset reports completed with access/attribution limits recorded.
- Independent four-act implementation written under `spring-letter/`: botany, particles, deterministic rules, layout, world, input/lifecycle, UI, local storage and Web Audio. This status describes code delivery, not final playthrough acceptance.
- 31 unit tests passed at the integration snapshot provided for this document update. Test totals may increase after further corrections; the final QA entry below must identify the final run and evidence.
- Hero bouquet uses three open heads/two buds, two whorls of curved petals, real closed/open triangle sampling and position/normal morph targets. Eight botany tests previously passed after meaningful initial failures; thin-shell outward-normal regression was found and fixed.
- Downloaded and verified `Studio Small 09` 1K HDR from Poly Haven, Sergej Majboroda, CC0-1.0. SHA-256, official-MD5 match and HDRLoader decode are recorded beside the asset. No paid asset/service was adopted.
- GPU particles are implemented with bounded state textures and a reduced-density fallback. Float render-target support is checked rather than inferred solely from WebGL2 availability.
- P2 was revised after independent review: inner/outer routes now have spatially different wind and a timed calm window; receiving requires release plus low speed. This does not mean every v2 environment-reconfiguration idea has shipped.
- Input review found Shift/OrbitControls modifier behavior and event-order conflicts; capture-phase routing, touch mode separation and day/night water linkage were corrected by integration. Ordinary-input recheck passed for Shift rotation, touch simulation and focus exit; see final QA below.
- P4 local consequence previews and the M-platform preservation projection were added after review. Preview vs. committed seed flight remains a state boundary. Visual clarity and repeated play still need final inspection.
- Closing or reloading after an ending now has a persistent review entry; the completed wind challenge no longer permits an inconsistent reset. The formal-build browser run verified the persistent review entry; completed-reset protection is implemented.
- First-build screenshots exist under `spring-letter/evidence/`. Dossier screenshots are explicitly separated from reference video frames. Earlier screenshots remain development evidence, not claims about the final polished state.
- AMD hardware rendering at a 1280 viewport produced an initial cover-frame interval of about 16.7 ms. This is an initial observation only: not full-route P50/P95, not a GPU timer measurement, and not a cross-device result.

## Task status snapshot

| Task | Implementation | Verification state |
| --- | --- | --- |
| 1. Gameplay state/recovery | Written; rule and corruption tests present | Unit checks passed in the current 31-test snapshot; final suite record pending |
| 2. Hero flower/surface identity | Written; geometry, physical materials, deterministic real-surface sampling | Botany invariants passed; final reference-matched visual review pending |
| 3. Particles/material continuity | GPU path and fallback written | Compilation and first renders inspected; repeated/reversed browser interactions pending final record |
| 4. World/camera/P1/P2 | Four spaces, ordinary movement and first two acts written; two-route wind revision applied | Formal-build ordinary-input four-act completion passed; both-route broader sampling remains |
| 5. Structure/ending | Occupancy guard, allocation, local preview, commit and review written | Three ending combinations and reload/review entrance passed; artistic clarity still under review |
| 6. Quality/review/handoff | Research and source provenance complete; dossier v3 integrated | Final QA, device metrics, latest screenshots and runtime README owned by root integration |

## Formal-build QA evidence — 2026-11-18

Read records: [browser-verification.json](../../spring-letter/evidence/browser-verification.json), timestamp `2026-11-18T05:21:36.628Z`, and [boundary-verification.json](../../spring-letter/evidence/boundary-verification.json). Main-flow checks use ordinary keyboard, pointer and UI input; the read-only snapshot supplies assertions/navigation only. Boundary fixtures deliberately inject lifecycle/storage faults, without forging gameplay completion.

| Check | Actual result | Scope / remaining work |
| --- | --- | --- |
| Unit checks | 33 passed after focused silver-material and surface-control update | Root retains final console/build records; rerun affected checks after later changes |
| Formal-build ordinary-input flow | 16 checks passed; no errors or failed resources reported | Four acts, first ending, two alternative endings and reload/review; not a first-time human playtest |
| P1 and P2 | Range-input unlock and pointer-only light delivery passed | Inner/outer spatial wind differs in rules; broader normal-input sampling of both strategies remains |
| P3 occupancy and route | Occupied recall refused, not queued, second bridge reaches F | Correctness evidence does not replace animation/art review |
| Finale preview / commit / replay | Duplicate destination refused; preview uncommitted; three endings and saved review entrance passed | Latest local-preview visuals remain subject to fixed-view review |
| Pause and focus | Settings clear movement and pause; blur/focus do not restore stale keys | Additional pointer-cancel/rare input combinations may still need device testing |
| Storage and failure | Malformed JSON safe start; unavailable storage still playable; context loss gives reload instructions | This does not mean context is silently rebuilt without reload |
| Quality / touch | Low mode uses actual 128×128 GPU state; Shift rotation and range-focus Esc passed; emulated touch completes P1 | Real phone hardware not verified |
| Layout | Narrow layout has no horizontal overflow in browser check | Full device/browser matrix not claimed |
| Dossier | 17 HTML pages generated; local targets/anchors and 1440/390 layout checked | [document-verification-v3.json](document-verification-v3.json); project README now exists and is linked |

## Performance evidence and its limit

Formal-build sample: `1440×900`, `ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001681) Direct3D11 vs_5_0 ps_5_0, D3D11)`, final dust-gallery segment, 180 frame intervals. Standard `gpu-spring`, 256×256 state texture, 65,536 active particles. Mean **20.51 ms**, P99 **25.9 ms**, maximum **28 ms**. This is approximately 49 fps by the mean interval, not stable full-game 60 fps. Recorded draw counts are for this dust-gallery segment, not the complete world.

The earlier 1280 cover observation around16.7 ms is retained only as an early observation. Browser frame intervals are not direct GPU timer-query measurements; no full-route worst-transition, all-DPR or physical-phone claim follows from either sample. P50/P95 and other devices were not recorded in this JSON.

## Final visual QA — still open

- Latest silver/crystal/natural/dust images must be compared against the corresponding original frames, with fixed camera and exposure.
- Focused silver polish has now landed: original linear grayscale UV thickness waves feed physical iridescence, with adjusted substrate/clearcoat. Optional finite/clamped surface controls preserve material/geometry identities. Two added regression tests pass, raising the full suite from31 to33. Rebuilt fixed-view screenshots are still required to accept the visible effect.
- Full continuous reversal/scatter/recovery sequences, first-time player comprehension, richer soundscape and the exact finished playtime are not certified by the 24 browser checks.
- Keep reference frames labelled reference and new renders labelled first-build footage. Do not convert these successes into claims of pixel parity, movie rendering or commercial AAA completion.

## Final first-playable handoff — 2026-11-18

The final ordinary-input production run passed all 16 checks at 2026-11-18T05:37:30.886Z. The final unit suite passed 33/33. Five additional visual-interaction checks passed at 2026-11-18T05:39:00.863Z, including partial reversal, three scatter/regather cycles and same-composer PNG export. Eight boundary checks remain the recorded lifecycle/storage evidence.

Silver thin-film polish, surface sliders, chase light, water skimming, completed-wind reset hiding and same-postprocessing photo export landed. Three material presets are compiled/rendered behind the loading screen to reduce first-switch compilation stalls. Latest fixed views were regenerated and inspected; 01–19 are actual local renders, not reference frames. Reference fidelity remains a qualitative work-in-progress, with remaining gaps explicitly described.

Final serving address is http://127.0.0.1:5192/ running the built dist, not the Vite development server. Startup, provenance, sources, exact dependency declarations/derived lock, manifest hashes and known limits are provided. [Final QA](../../spring-letter/FINAL_QA.md) contains the authoritative latest performance table and delivery scope. Earlier performance samples above are retained as dated history.

## v4设计 / 0.2.0可玩章节精修 — 2026-11-18

新增全屏入口、浏览器真实状态同步与Esc保护；48秒六镜头实景开场，可跳过/重看；原创角色弥、游絮与岑旧记录；三种支线动作（杯声创作、扫光显字、保护/停滞对照）和个人回信。支线不改变两核三用途，沿用版本1存档并兼容旧档。

主动研究Samorost3、Creaks、Sword of the Sea、SEASON/Jusant作者资料、Bruno、Codrops、A Short Hike和Botany Manor。采用Poly Haven CC0石材微表面，记录官方哈希；未购买素材或启用付费生成。物理银花瓣肩/膜厚、自然花粉/金颜色、固定镜头构图、低预算真实平面反射与四区合成声部实际落地。FFmpeg编码工具通过Playwright官方CDN安装在本项目.tools，不进入dist，使用免费编码方案。

独立复核发现并修复：支线入口遮挡保形协议旧记录；续读的花姿被导演缓存覆盖；后期重看序章演员缺席；未醒游絮提前跟随；修改杯曲误覆盖旧曲；静止指针覆盖键盘扫光；旧字幕串到新支线；石柱/角色挡住支线实物。普通键鼠通关验证四旧记录可集齐、.4花姿刷新保留、演出不移动存档角色。

当前47项单元、28项正常流程、8边界、5视觉交互、4全屏、11隔离音频图通过，具体时间/范围以FINAL_QA为准。录制完整自动序章与花尘鉴赏，录像无声，未冒充最终听感评审。

操作记录：本轮曾有一次构建命令误在工作区根目录运行，重生成原项目dist；未改原项目源码。随后所有春信构建均显式使用D:/AI Game/spring-letter，未把两个项目代码或内容合并。
