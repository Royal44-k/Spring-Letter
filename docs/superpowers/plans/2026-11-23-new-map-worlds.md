# Spring Letter New Map Worlds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship three genuinely new, distinct 3D locations with independent interactions and a readable region map in 0.9.0.

**Architecture:** Pure atlas state transitions consume shared spatial definitions. A self-contained controller owns one active new world and integrates through the existing scene, camera, input, audio and archive boundaries. Preserve all original chapters and earned letters.

**Tech Stack:** Existing Three.js 0.185, Vite 8.3.8, Node tests, isolated Playwright/Edge QA. No paid assets or new runtime dependency.

**Spec:** ../../blossom/v12-design.md

## Global Constraints

- Independent of 金沙; 1 opening + 12 primary actions + original sea ending.
- Three new spaces must differ in terrain, silhouette, lighting, foliage and mechanic.
- Existing archive version 1 remains accepted; new nested atlas state is normalized.
- Preserve 0.8.0 served dist until new candidate verification succeeds.
- No mutable test API or synthetic progress injection for final full play.

## Review Focus

- Reopening or leaving a location mid-action must retain earned progress without stuck keys.
- Walking colliders must agree with real ground, especially floating-island gaps and landing heights.
- Right/middle orbit and touching UI must not accidentally solve puzzles or trigger jumps.
- Completed legacy saves must visibly offer new locations without overwriting letters or ending.
- Repeated map switching must not grow GPU resources, leave old objects visible or break audio.

### Task 1: Shared definitions and pure progression

Files: src/atlas-content.js, src/atlas-model.js, src/game-model.js; tests/atlas-model.test.js.

Interface: ATLAS_LOCATIONS, CONSERVATORY_BEDS, OBSERVATORY_DAIS, ATLAS_STARS, CLOUD_ISLANDS; createAtlasState(), restoreAtlasState(raw), atlasCommand(state,type,payload), stepAtlas(state,dt,input), atlasGroundHeight(location,x,z), atlasStatus(state), atlasComplete(state).

- [x] Define unique coordinates, metadata and narrative relics in content.
- [x] Write failing meaningful tests for butterfly distance/arrival, constellation order/undo, grounded jump/glide/respawn, save roundtrip and malformed input.
- [x] Implement pure bounded model and serialize/restore atlas through game-model.
- [x] Run Node model tests; validate all islands reachable with actual step inputs.

### Task 2: Three independent environments

Files: src/atlas-world.js (+ focused atlas-world-*.js helpers if needed), tests/atlas-world.test.js.

Interface: createAtlasWorld() returns group, setLocation(id), update(time,dt,state), snapshot(), dispose(); shared spatial definitions match model. Each new group has named landmarks and bounded geometry; update is presentation only.

- [x] Build forest conservatory, moon observatory and cloud meadow with different layouts and original geometry.
- [x] Reuse courier only, not old terrain/landmarks; use merged/instanced vegetation.
- [x] Check finite geometry, ground extents, unique landmark inventory and disposal via CPU tests.
- [x] Visually inspect actual GPU shots and revise occlusion, lighting and plant placement.

### Task 3: Controller, regional map and runtime integration

Files: src/atlas-controller.js, src/atlas.css, src/main.js, src/voyage-content.js, index.html; tests/atlas-integration.test.js.

Interface: createAtlasController({getState,onStart,onExit,onSave,onSound,onContinue,onMap,onPhoto}) returns group, active, start(id,{resume}), stop(), cancel(), handleKey(event), pointer(phase,raycaster,event), camera(aspect), update(time,dt,{camera,interactive}), snapshot(), musicState().

- [x] Implement actual walk/gesture/jump controls with accessible touch and keyboard alternatives.
- [x] Add spatial regional map cards/SVG route and cover new-region entrance; continued saves keep their progress.
- [x] Integrate active-only camera, fog/light, input isolation, pause and context loss.
- [x] Sequence original five actions → three maps → coast for new journey; preserve old coast continuation.
- [x] Test new and old archive boundaries, UI escape/return and no key leaks.

### Task 4: Audio, narrative and presentation review

Files: src/audio-score.js, src/audio-engine.js, atlas content/CSS, README.md, ASSET_SOURCES.md, docs/blossom/v12-research.md.

- [x] Compose distinct free local sampled scores and event feedback per map; retain mix/mute.
- [x] Use source research with at least seven new visible external references.
- [x] Audit world identities, controls, legibility and map discoverability across desktop and touch sizes.

### Task 5: Verification and release

Files: scripts/v12-*.cjs, evidence/v12, FINAL_QA.md, release/build/package scripts.

- [x] Build an isolated frozen candidate; run all Node tests.
- [ ] Actual UI travel to and solve all new maps; refresh mid-way; connect to writing/old letter/boat/sea ending.
- [ ] Three-quality graphics, context recovery, portrait/landscape input, audio signal, repeated-location memory and old bug regressions.
- [ ] Review and correct failures, then freeze final exact build and bind fresh evidence hashes.
- [ ] Back up old dist, publish local original URL, verify every served file, package and verify extracted files/HTTP.

No Git repository is present; retain candidate manifests, source hashes, previous dist and evidence instead of claiming commits.

This plan is frozen with the release inputs before the remaining GPU and packaging steps run. Their final statuses and artifact identities are recorded in spring-letter/FINAL_QA.md and evidence/release-manifest-v12.json; do not rewrite this frozen planning snapshot after verification.
