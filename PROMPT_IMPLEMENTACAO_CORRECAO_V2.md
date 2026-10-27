# Prompt — Cherry Bloom V2 Full Correction, Implementation & Fast Delivery

You are the implementation/correction agent for **Cherry Bloom V2**. Work autonomously through diagnosis, correction, implementation, validation and delivery preparation. Do not stop at a plan when the repository and references provide enough information to act.

## 0. Source-of-truth order
1. academic activity brief;
2. `CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE_V2.md`;
3. `CHERRY_BLOOM_DESIGN_SYSTEM_V2.md`;
4. `docs/LEVEL_CONFIG_V2.json`;
5. `docs/PROGRESSION_CHECKPOINTS_V2.md`;
6. `docs/OBSTACLE_RENDERING_PERFORMANCE_V2.md`;
7. `docs/AUDIO_V2.md`;
8. `docs/ASSET_MANIFEST_V2.md`;
9. SDK54/57 technical stack docs;
10. existing code.

The official protagonist name is **Cherry**. Replace user-facing “Cherri”.

## 1. Discovery + skills (mandatory)
Before editing:
- inspect Git/status/branch;
- read every V2 reference completely;
- inspect implementation and assets;
- reproduce current gameplay bugs;
- then execute the installed skills discovery using `npx skills` (or equivalent toolkit command);
- select only skills useful for React Native/Expo, game loop/debugging, UI/visual QA, performance, audio, persistence/testing;
- record chosen skills and use them.

## 2. Known blockers to verify first
- tap may not work;
- Cherry may not move;
- old “Cherri” naming may exist;
- visual assets may not match planned V2;
- future trunks may render/decode too late, especially PC/web.

Do root-cause analysis; do not patch blindly.

## 3. Execution priority
### P0 — Make core gameplay reliable
Fix tap/input, READY→PLAYING, jump, gravity, dt integration, collision, score, Game Over, retry and navigation cleanup. No later feature is allowed to hide a broken core.

### P1 — Fix obstacle renderer/performance
Implement chapter asset preload, fixed obstacle pool, at least 3 future pairs prewarmed, recycling, transform-based movement, safe visual/collision separation. Confirm no visible trunk pop-in on PC/web.

### P2 — Integrate V2 visual assets
Use `assets/v2/`. Each chapter must load its own obstacle kit/background/overlay. Prefer supplied PNG exports for fastest SDK54/Snack path; retain SVGs as source. Do not use old green-pipe or placeholder trunk visuals.

### P3 — Campaign + difficulty
Load 12 levels from centralized config. Implement safe obstacle generation using gap ratio, speed, spacing, max gap-center delta and safe margins. Do not scatter difficulty magic numbers across components.

### P4 — Checkpoints + persistence
Implement level-based checkpoint/save schema V2. Continue must resume at a valid level start. Locked levels cannot launch. Completing Level 12 unlocks Endless Bloom. Never persist mid-frame physics.

### P5 — Audio
Implement centralized audio lifecycle: four chapter music themes + UI/jump/score/collision/checkpoint/level-complete/unlock/pause SFX. Persist music/SFX preferences. Audio errors must not block gameplay.

### P6 — Motion/FX
Cherry states, score bounce, checkpoint bloom ring, level-complete petals, chapter-specific overlay FX. Decorative overlays must never intercept touch.

## 4. Academic architecture constraints
Keep `tela1.js`, `tela2.js`, `tela3.js`, `tela4.js` and React Navigation. SDK54 is delivery authority. SDK57 is only a separate local mirror.

## 5. Asset preload contract
After level selection:
`LOADING -> preload chapter assets/audio -> prepare obstacle pool -> READY -> PLAYING`.
No gameplay-critical image should first decode when already entering the viewport.

## 6. Obstacle pool contract
Minimum 4 pairs (5 allowed in later levels). Each recycled pair receives:
- new X after furthest pair;
- valid gap center/size;
- current biome visual variant;
- `scored=false`.
Do not destroy/recreate every pass.

## 7. Safe generator contract
Clamp next gap center against previous using `maxGapCenterDeltaRatio`; enforce top/bottom margins. The generator must not produce impossible consecutive transitions.

## 8. Campaign contract
- Levels 1–3 First Bloom
- 4–6 Sakura Garden
- 7–9 Golden Bloom
- 10–12 Yozakura
- Endless after 12
Use `LEVEL_CONFIG_V2.json` as baseline.

## 9. Checkpoint contract
Persist level progress/results/settings. Continue opens the last valid unlocked/played level in READY. Corrupt save falls back safely to Level 1.

## 10. Audio contract
Preload/reuse players when practical. Loop chapter music. One-shot SFX must not allocate continuously. Stop/release audio on Game unmount. Add independent music/SFX toggles.

## 11. Validation gates
For every gate use `PASS / FAIL / PARTIAL / NOT EXECUTED`, with evidence.

### Core
Tap, Cherry movement, gravity/jump, collision, score, Game Over, retry.

### Performance
No trunk pop-in; pool/prewarm exists; no recurring mount/decode hitch.

### Progression
12 levels, monotonic difficulty, safe gaps, completion/unlock, level select, Endless unlock.

### Persistence
close/reopen preserves unlocks/settings; Continue works; corrupt save safe fallback.

### Visual
all 4 chapter kits/backgrounds; Cherry naming; no green pipes/placeholders; overlays readable/non-interactive.

### Audio
4 chapter themes + required SFX + mute lifecycle + failure-safe behavior.

### Delivery
SDK54 `expo install --check`; Expo Doctor; runtime; Snack; visual inspection. Only after SDK54 PASS mirror/fix SDK57.

## 12. Review phase
After implementation perform adversarial review against all V2 acceptance criteria. Try to falsify every PASS. Fix confirmed BLOCKER/CRITICAL/MAJOR findings and retest.

## 13. Final report
Create `CHERRY_BLOOM_V2_IMPLEMENTATION_REPORT.md` with:
- skills used;
- root causes fixed;
- architecture changes;
- asset integration;
- 12-level progression/checkpoint status;
- renderer performance evidence;
- audio status;
- SDK54/Snack evidence;
- SDK57 mirror status;
- full acceptance matrix;
- remaining limitations.

Only state:
`FINAL AUDIT: PASS` and `READY FOR DELIVERY: YES`
when every mandatory V2/academic gate has evidence and no BLOCKER/CRITICAL remains. Then freeze delivery branch.
