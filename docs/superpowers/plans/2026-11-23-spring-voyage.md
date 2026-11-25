# Spring Letter Voyage Implementation Plan

> **For agentic workers:** Use the task interfaces below; root integrates and validates serial GPU sessions. Independent bridge audit, research, and world art run in parallel.

**Goal:** Deliver the nine-part spring-letter journey and a playable flower-sea voyage with a ceremonial dawn ending.

**Architecture:** Keep existing first five mechanics. Add deterministic voyage model, a dedicated 3D shore/boat/sea presentation and a focused controller mounted from main.js. Preserve version-one saves by extending optional voyage data.

**Tech Stack:** Existing Three.js 0.185.0, Vite 8.3.8, native DOM, Node tests and local Playwright.

**Spec:** ../../blossom/v11-design.md

## Global Constraints
- Independent from 金沙; free sources only; >=7 newly researched non-repeated websites opened in side browser.
- One opening + nine main interactions + one ending; retain existing content.
- No NaN/alpha regressions; own letter is plain text; preserve user archives.

## Review Focus
- Old ended saves must reach the new shoreline without losing prior works.
- Pausing, browser blur and reload must clear held steering/dragging and preserve earned progress.
- Portrait/short-height layouts must not cover action objects or trap reading controls.
- Sea geometry/shaders must remain finite and visibly 3D at all qualities.
- Tide recovery must not strand a player or erase the predecessor letter.

### 1. Trace and repair flower-bridge obstruction
- [ ] Identify actual mesh/material and before state; add geometry/regression check.
- [ ] Implement narrow fix; verify original navigation and underside/side views.
- Owner: bridge audit agent; root visual reproduction.

### 2. Research and narrative
- [ ] Deduplicate previous source domains, verify at least seven new primary sources, open in side browser.
- [ ] Record concrete methods, licensing, chapter effects in v11-research.md.
- [ ] Update opening, guide, map and ending language around a continuous voyage.

### 3. Deterministic voyage state
- [ ] Create src/voyage-model.js and tests/voyage-model.test.js.
- [ ] Exports createVoyageState(), restoreVoyageState(data), voyageCommand(state,command,payload), stepVoyage(state,dt,input), voyageStageInfo(state), TIDE_STONES, BOAT_DOCK.
- [ ] Include written letter/seal, shore walking and safe tide checkpoint, predecessor letter receipt, boat rigging, directional sailing and a deliberate dawn departure. Invalid, oversized and obsolete saves sanitize safely.
- [ ] Add optional voyage to game-model serialize/restore without invalidating existing archive shape.

### 4. World presentation
- [ ] Create src/voyage-world.js. Export createVoyageWorld() returning group, update(time,dt,view), camera(view,aspect), interactables, snapshot(), dispose().
- [ ] View fields: stage, player:{x,z}, boat:{x,z,heading,speed}, tide:0..1, sail:0..1, ropes:[boolean,boolean], progress:0..1, blooms:[{x,z,kind,age}], quality, reducedMotion, sealed, predecessor.
- [ ] Original shore desk, tidal stones, old letter shelter, island, wooden boat with rigging, animated sail, broad finite ocean, distant islands, sunrise and 3D flowers; instancing/merged geometry where appropriate.
- [ ] Coordinates: writing shore centered (0,5), desk (0,1); tidal trail from (0,-3) through old shelter (0,-13) to island (0,-26); boat dock (3,-29), voyage forward -Z ending around -180. Root model owns authoritative walkable path and stage conditions.

### 5. Controller and integration
- [ ] Create src/voyage-controller.js and src/voyage.css. Plain-text draft, seal drag and keyboard, tide hints and key/touch walking, readable old letter, boat rope/hoist controls, sail steering and flower seed gestures, ending actions.
- [ ] Main integration: create/update/camera/input/visibility, handoff from seeds, save every major step, resume controls, pause handling, readonly diagnostics. Existing world is hidden only while new chapter owns scene.
- [ ] Revise main map/HUD/help and story-content; new chapter count genuine rather than counting a menu as gameplay.

### 6. End-to-end verification and delivery
- [ ] Unit suite, isolated immutable build, actual new journey and full previous core play.
- [ ] GPU canvas valid through shore/tide/island/rigging/sailing/dawn/ending, 3 quality settings and responsive input checks.
- [ ] Reload per stage, old saves and paused-input checks, independent source review.
- [ ] Publish verified local dist preserving old hashed assets; update version, release ZIPs, research/design/QA docs and screenshot evidence.

## Execution ledger
- 2026-11-23: User supplied concrete ending and authorized autonomous continuation. Existing browser implementation reused. Root handles integration and serial GPU checks; parallel agents limited to distinct source ownership.
