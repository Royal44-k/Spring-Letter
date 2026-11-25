# Spring Letter Implementation Plan

> For agentic workers: use executing-plans principles for the main integration and focused parallel implementation where interfaces are independent. Keep a durable ledger. The user explicitly requested refinement followed by development; continue without another procedural approval gate.

**Goal:** Build an independent playable artistic flower-and-particle exploration game, with reference-oriented inspection controls, a complete four-act route and recoverable choices.

**Architecture:** Three.js rendering consumes a deterministic gameplay model. Hero botany, GPU particles, world presentation, input, UI and audio have separate modules. State transitions own progress/collision changes; particles never determine success or player support.

**Tech Stack:** Three.js 0.185.0, Vite 8.3.8, native Web Audio, Node test runner, Playwright 1.65.1. Public CC0 environment asset if successfully obtained.

**Spec:** `docs/blossom/design-proposal.md`, `experience-blueprint.md`, `art-direction-v3.md`, `video-analysis.md`.

## Global Constraints

- Work only in new `D:/AI Game/spring-letter/` plus the research archive. Keep existing game files unchanged.
- Work name: 花漾年华：待寄出的春信. No paid assets, generation APIs, subscriptions or runtime service dependency.
- Source video observation is not proof of source algorithms or FPS. Fidelity and performance remain measured criteria.
- Stable particle identity, reversible bloom/dispersion, deterministic logical puzzles, no unsupported movement over water.
- P3 removal is forbidden when player support depends on it; forbidden requests never queue.
- Two unique finale cores, maximum one per purpose; preview is reversible and never sends seed content. Explicit departure commits.
- Browser-first execution is the implementation choice made under the user's instruction to act. Mobile gets readable/touch controls but support claims depend on device verification.

## Review Focus

1. Blur/visibility/context loss must not leave movement keys held or advance game time; test model time clamp plus browser pause/reload.
2. Corrupt, future-version, out-of-range or unavailable local storage must yield a safe start; test literal corrupt fixtures and round trips.
3. Removing bridge/shield while on its dependent surface must fail without deferred action; model tests cover both support types and return paths.
4. Duplicate core allocation and departure with fewer than two assignments must fail; preview and committed outcome must remain separate.
5. Dragging UI or orbiting cannot also repel particles/ripple water; ordinary pointer/keyboard browser tests verify routing and focus exit.

## File map and shared interfaces

All implementation paths below are inside `spring-letter/`.

- `index.html`, `src/style.css`: meaningful Chinese UI, live-render opening, HUD, controls, journal/settings/ending.
- `src/main.js`: renderer, camera, lifecycle, input routing, interactions and module integration.
- `src/botany.js`: `createBouquet({seed=17,scale=1})` → `{group,setBloom(b),setMaterial(kind,variant),setOpacity(a),sampleSurface(count),update(time),dispose()}`. `kind` = silver/crystal/lily; sample buffers `{closed,open,colors}` use root-local xyz/rgb Float32Array, stable deterministic order. Geometry must use those same endpoints.
- `src/particles.js`: `createSurfaceParticles(renderer,samples,{quality='standard'})` → `{object,update(dt,time,{bloom,dispersion,pointer,night,reducedMotion}),setQuality(q),dispose(),getStats()}`. `pointer` is root-local Vector3 or null; object can share bouquet world transform. No mutations to supplied buffers.
- `src/game-model.js`: `createState()`, `updateBloom(state,b,dt)`, `stepWind(state,input,dt)`, `setStructure(state,target)`, `allocateCore(state,id,purpose)`, `commitLetter(state)`, `serialize(state)`, `restore(raw)`. Pure logic, no Three/DOM/storage imports. Model exact state/interface finalized in its task.
- `src/world.js`: `createWorld()` → `{group,flowers,targets,water,player,companion,update(time,dt,state),ripple(x,z,strength),dispose()}`; support is owned by `src/layout.js`. World coordinates/target map owned by root integration.
- `src/audio.js`: local synthesis, user-gesture unlock, mute/pause, bounded sound instances.
- `tests/model.test.js`, `tests/botany.test.js`: meaningful rule/invariant tests.
- `scripts/smoke.cjs`, `scripts/serve.cjs`: browser verification, local built-game server with local-only binding.
- `public/assets/`, `ASSET_SOURCES.md`: only adopted verified files and attribution/license provenance.

## Task 1: Gameplay state and recovery

- [x] Write tests for P1 hold tolerance; wind return on escape; P3 occupied bridge/shield refusal and return path; core uniqueness/preview/commit; malformed/future saves.
- [x] Run tests and observe feature-missing failure, then implement model functions and state schema.
- [x] Run `node --test tests/model.test.js`, all passing; log the actual count and fixture behavior.

## Task 2: Hero flower and surface identity

- [x] Write geometry tests for deterministic surface samples, finite endpoints, reversible bloom that does not translate stem roots, and independent material changes.
- [x] Implement three open flower heads/two buds, six real curved petals per head, fine stems/leaves/stamens and physical material presets.
- [x] Produce samples from actual triangles and transforms, not an unrelated procedural point cloud. Run tests.
- [x] Integrate a fixed hero view, inspect bright/night silver/crystal/natural states with screenshots, revise geometry/materials based on the images.

## Task 3: Particles and material continuity

- [x] Implement GPU position/velocity simulation using closed/open surface textures, spring/damping, bounded repulsion and controlled noise; use appropriate renderer capability checks.
- [x] Match flower-to-points opacity timing and root transform; partial bloom scatter uses current pose; low-quality fallback retains shape and local response.
- [x] Browser exercise partial reversals, repeated scatter/regather, orbit, zoom and pointer exit; record errors, draw count and frame times. Inspect screenshots, not only build output.

## Task 4: World, camera and P1/P2 route

- [x] Build shallow-water courtyards, arch/cloth shapes, authored camera reveals, hero and companion, signal and cups with visual beats.
- [x] Wire WASD/arrow movement, surface support, E focus, wheel bloom, Q dispersion, Space shaping, pointer repulsion; route UI/camera input exclusively.
- [x] Implement P1 path opening and two P2 routes, local failure restore, voluntary companion approach after force release; save checkpoints.
- [x] Ordinary input browser traversal from new game through P2; unit suite and production build pass.

## Task 5: Structural puzzle, choices and complete ending

- [x] Build safe-platform/temporary-structure puzzle with occupied-dependency guard; map each valid state to visible geometry and support.
- [x] Build the three finale purposes, two unique cores, reversible local previews, explicit departure and checkpoint replay.
- [x] Connect optional discoveries, journal/review, reference gallery, day/night/materials/orbit/zoom, accessible controls and locally saved photo.
- [x] Complete an ordinary-input run to ending; verify all three core combinations and save/reload behavior.

## Task 6: Quality, review and handoff

- [x] Run standalone unit suite, build, local production server and browser smoke. Check desktop/narrow UI, console, failed resources, pause/restore and basic touch controls.
- [x] Capture six representative views and a normal-input run/sequence. Record measured performance with environment details, distinguish headless software render from physical GPU.
- [x] Fresh independent review of production code/rules and evidence. Fix material issues, verify regressions and repeat only affected checks.
- [x] Ship launcher, README with honest implemented/unfinished matrix, sources, design links, evidence and durable development log. Do not label the result AAA or perfect reference parity without proof.

## Self-review

The four-act model, hero/pixel fidelity, knowledge/companionship, free tools and lifecycle have assigned tasks. Interfaces share root-local positions and model-owned progress; renderer modules do not mutate puzzle state. No repository metadata was found in the existing workspace; use a separate project folder and file-based ledger rather than fabricate commits or alter the old project's repository setup. Tests focus on gameplay invariants; CSS/content and material taste use browser inspection.

## Delivery gate — first playable build

All six implementation tasks are completed for the first playable scope. See [final QA](../../spring-letter/FINAL_QA.md) for 33 unit checks, 16 ordinary-input flow checks, 8 lifecycle/storage checks and 5 visual-interaction checks. Completed implementation tasks are not a claim of pixel parity, final 30–45 minute scope, first-time player validation, or film-quality rendering. The narrower P2 route implementation and remaining art/content work are listed explicitly in v3.
