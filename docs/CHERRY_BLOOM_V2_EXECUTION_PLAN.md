# Cherry Bloom V2 — Execution Plan

Date: 2026-10-27. Baseline: main6101b35, SDK54. Worktree: D:/Cherry_Flight_Release54, branch feat/cherry-bloom-v2. Original incoming handoff remains untouched in D:/Cherry_Flight/Cherry_Bloom_V2_Handoff.

## Discovery / constraints

Read every V2 source and existing academic/V1 contracts, code and reports. All167 supplied checksums match. All80 PNGs were inspected, together with the SVG sources. Each obstacle kit actually contains13 modules (the manifest's stated12 is a counting discrepancy). There are no audio recordings in the V2 package. Horizontal orientation and the four academic screen files remain required.

The fresh SDK54 baseline accepts a trusted10ms touch and moves156→98.74, later falls and retries correctly. It has three mounted pairs and setRenderTick every frame, no V2 assets, campaign, checkpoint or audio implementation. Prior PASS results are evidence only for the previous runtime.

## Skills selected after npx discovery

| Skill | Reason | Phase |
|---|---|---|
| superpowers:systematic-debugging | Reproduce input, lifecycle and render defects before changes | Core and QA |
| superpowers:test-driven-development | Pure simulation/progression/persistence/audio failure tests before implementation | Core, progression, audio |
| ecc:react-native-patterns | React Navigation, AsyncStorage, effects and native compatibility | Integration |
| react-component-performance | Isolate physics updates from heavy React trees; count renders/mounts | Renderer and profiling |
| web-design-guidelines | Focus, touch size, contrast, reduced motion and responsive browser inspection | Visual QA |
| superpowers:requesting-code-review | Fresh independent review of the final change before delivery | Final review |

npx skills --help and find searches for React Native/performance, Expo/audio, games, navigation/AsyncStorage, SVG and testing were executed. Existing relevant skills are reused; no redundant global installation. Context7/installed SDK types provide actual SDK54 expo-audio API contracts rather than relying on generic tutorials.

## Execution / interfaces

1. Core: a pure mutable round model, stable physics, bounded dt, input, collision-first scoring, stable pooled slot identities, deterministic tests. Reuse collision helpers and constants. Gate: unit scenarios and browser input/movement/collision/retry.
2. Renderer: Animated values/imperative frame updates, no full-tree state per frame; fixed4/5 slots; three future prepared descriptors; current chapter vector cache before READY. Gate: timestamps prepare/mount precede visible, no mount churn/pop-in in PC trace.
3. Art: generate JS XML registry from supplied SVG without changing sources; cache parsed SVG AST; use all four states and four chapter layer/module kits. Preserve circle proportions when adapting portrait scenery to the approved landscape field. Gate: direct visual comparison of all kits.
4. Progression: lossless JS projection of LEVEL_CONFIG_V2.json;12 levels; target completion once; unlock and level select; locked entry rejection.
5. Checkpoints: schema2, sanitized external storage, queued writes, V1 best-score migration, Continue/close/reopen. No physics serialization.
6. Endless: Level12 unlock, configured bounded ramp/biome rotation, separate best score.
7. Motion: idle/jump/fall/hit, score bounce, bloom ring/petal completion, parallax and biome FX, focus/AppState/reduced-motion lifecycle.
8. Audio: expo-audio SDK54, centralized players reused per event, four original synthesized music loops, V1 original SFX reused plus missing events composed locally. Independent persisted settings; failure never blocks play. Gate: runtime playback status/time, mute, failure, release and chapter switch.
9. SDK54 QA: pure tests, installed version check/Doctor, native/web exports, real browser three landscape sizes, corruption/reload/input/lifecycle tests, visual/renderer evidence and all50 acceptance criteria.
10. Snack: official SDK upload to QA/save path; account target only after gates. Preserve Git import package: no binary upload through broken Git importer, SVG JS registry remains local; optional network-only audio adapter for that import path must be documented and tested. Main app uses local audio modules.
11. SDK57: separate manifest/lock/worktree; mirror only after SDK54+Snack verification, install native companions using its own Expo version.
12. Independent adversarial review; fix real blockers/critical/major; final report and README; publish only validated artifacts under standing authorization, never DNS changes.

## Decisions / reconciliation

- SVG is authoritative and supported by the installed react-native-svg. Use supplied vector geometry with parsed-AST preload instead of forcing critical PNG decode into the gameplay path. PNG exports remain bundled source/fallback references, not claimed as displayed when unused.
- Four/five mounted slots follow config. Three additional prepared future geometry descriptors form the offscreen queue; reassign them only to an already mounted recycled slot. This preserves the requested pool size while guaranteeing a precomputed future buffer even when two slots are simultaneously visible.
- Config values are preserved exactly. Resolved geometry may apply physical safety bounds on unusually small fields; report each necessary tuning change, never hide difficulty constants inside Game.
- V2 backgrounds are portrait sources; adapt scenery coordinates to landscape while keeping celestial/flower circles round and foreground wood restricted to edge strips, so decoration cannot masquerade as a colliding trunk in the corridor.
- No audio files were supplied. Produce short original PCM music/SFX locally, without paid APIs or third-party media. Document authorship and loop boundaries.
- Existing historical reports may quote deprecated naming as evidence. Product source/new documentation uses Cherry.

## Progress ledger

- Phase0: PASS — reference/assets/code discovery, baseline input, npx discovery and skill selection complete.
- Phase1: PASS on SDK54 Web — trusted10ms input, jump, gravity, directed boundary/branch tests, single score, Level1 target8 and terminal stop. Evidence: engine-green.log and core-renderer-results.json.
- Phase2: PASS in the measured Web run —678 frames,26 field renders,15 pair renders,4 total pair mounts,0 vector parses during play; every visible generation had a committed visual-prepared event first. Three long frames, worst116.7ms, are recorded, not hidden or promoted to device FPS proof.
- Phase3: First Bloom integrated and visually inspected; remaining kits use the same source registry but still require individual runtime visual gates. Supplied SVG sources are preserved; an observed SvgAst override API error and cross-screen gradient-ID collision were reproduced and corrected with tests.
- Phase4–8: PASS at documented scopes — twelve actual-engine trajectories, progression/persistence/reload, fixture-unlocked Endless entry, motion/lifecycle, actual music loops and nine SFX. Physical audio calibration remains NOT EXECUTED.
- Phase9: SDK54 Doctor18/18, dependency check,28tests, Web/native export and twelve landscape screenshots pass. No physical native runtime is inferred from export.
- Phase10: Official Snack SDK54 Web Preview passes completion/checkpoint/Continue/navigation; final visual-anchor republication and post-push Git-import retest remain publication steps.
- Phase11: Separate SDK57 Doctor21/21,26tests and Web Level1/checkpoint run pass; manifest/lock remain separate.
- Phase12: Independent review closed its findings and verified final character-anchor math. Final Git/Vercel publication verification and report freeze remain.
