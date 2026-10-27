# Cherry Bloom V2 — Implementation Report

Date: 2026-10-27. Delivery authority: Expo SDK54. Character: Cherry. Orientation: landscape.

## Summary

V2 replaces the V1 full-tree frame renderer with a mutable simulation, pooled modular vectors and imperative Animated positions. Campaign, twelve levels, checkpoints, Continue, Level Select, Endless, settings, four visual kits and original audio are implemented. Required academic screen files and React Navigation remain.

**Publication verification in progress.** Local/official Snack runtime evidence exists; final Git/Vercel revision and freeze are recorded after the publication gate below. This sentence is not delivery approval.

No confirmed open BLOCKER/CRITICAL/MAJOR remains after independent source review. Known tooling advisories and unexecuted physical-device calibration remain disclosed. Browser engine replay, fixture-based entry and native bundle export are distinct kinds of evidence.

## Skills utilizadas

Discovery ran after reading the handoff/code/assets: `npx skills --help` and searches for React Native performance, Expo audio, game development, navigation/AsyncStorage, SVG optimization and debugging/testing. Full logs: `audit-evidence/v2/skills-*.txt`. No redundant global installation.

| Skill | Reason | Actual contribution |
|---|---|---|
| superpowers:systematic-debugging | Reproduce before fixing | Trusted short tap baseline, renderer metrics, SvgAst API/gradient defects, audio race investigation |
| superpowers:test-driven-development | Test nontrivial logic | Engine/vector/progression/audio RED/GREEN logs, deferred SFX pause regression |
| ecc:react-native-patterns | Native effects/storage/navigation | AsyncStorage context, focus/AppState lifecycle, preserved React Navigation |
| react-component-performance | Reduce repeated React work | Imperative frame positions, isolated actors/slots, mount/render counts |
| web-design-guidelines | Responsive/a11y review | Touch targets, labels, focus, landscape screenshots, decorative pointer handling |
| superpowers:requesting-code-review | Independent final review | Fresh reviewer inspected code, corrected an overstated finding and revalidated fixes |

## Environment

Windows/PowerShell; Node24.22.0; npm11.19.1. SDK54 checkout `D:/Cherry_Flight_Release54`, development branch `feat/cherry-bloom-v2`, baseline6101b35. Expo54.0.38, React19.1.0, RN0.81.5, expo-audio1.1.1, expo-asset12.0.14. Independent SDK57 checkout `D:/Cherry_Flight_Release57`. Original SDK58 workspace and incoming handoff remain preserved.

## Architecture

- Academic `tela1.js`–`tela4.js` remain screen entry points; App owns the React Navigation stack and progress provider.
- `engineV2.js` owns pure simulation, collisions, scoring, completion, pooling and constrained generation.
- `levelConfigV2.js` is generated losslessly from authoritative JSON; no difficulty table lives in GameField.
- `GameFieldV2` owns lifecycle/input and semantic React updates. Actor/branch refs update Animated values per frame.
- `progressionV2` validates unlocks/checkpoints; `saveServiceV2` queues writes; provider holds fresh transaction state.
- `vectorCacheV2` precompiles supplied geometry, scopes gradients and bounds cache at256 AST entries.
- `audioServiceV2` centralizes reusable playback; adapter uses Expo Audio natively and HTMLAudio on Web.

## Known findings / core gameplay

Historical tap/movement blockers were already corrected in the incoming SDK54 release. Fresh baseline reproduced a trusted10ms tap successfully (y156 to98.74), so they were not falsely rediscovered as new failures. Historical cause: react-native-web50ms default PressResponder activation delay with only onPressIn. V2 preserves delayPressIn0. No invisible-overlay cause was found.

V2 follows LOADING, READY, PLAYING, PAUSED, GAME_OVER and LEVEL_COMPLETE. Jump/gravity stay stable across all levels; invalid dt is rejected and long dt capped. Collision precedes score. Terminal updates stop, score counts once, and Next waits for the completion save attempt. Storage failure visibly retains session-only progress.

`campaign-planned-trajectories.json` replays input-only paths through the actual engine for all12 configured targets. A finite-horizon greedy bot failed some advanced layouts; that failure was retained as a planner limitation, not promoted to proof of an impossible game. A forward trajectory planner then completed all12 sampled layouts. This proves these executed layouts, not every random seed or twelve real-browser completions.

## Obstacle renderer

Levels1–6 mount4 pairs; Levels7–12/Endless mount5. Stable slot IDs recycle X, gap, biome, scored flag and composition. There are3 additional prepared future descriptors beyond the viewport. Their geometry is prepared and all kit ASTs are cached before a reused mounted slot receives one offscreen; the descriptors are not falsely described as3 extra mounted React pairs. This reconciles the configured4-slot pool with the3-future requirement.

The first gate is centered and starts at1.1viewport widths, giving reaction time before narrow advanced openings. Subsequent centers obey margins/configured delta and physical safety bounds. Adjacent visual variants differ even for repeated random samples. Supplied JSON values remain unchanged.

Measured complete browser runs use4 total pair mounts,15 pair renders and0 SVG parses during play. Every visible generation has an earlier committed visual-prepared event. Headless runs under shared CPU load contain long frames, up to166.6ms; they are not represented as locked60FPS or physical-device performance proof. No viewport-entry decode/mount pop-in was observed.

## Asset integration

All167 supplied checksums matched; all80 PNGs were visually inspected. Four character states and all4 biomes use authoritative supplied SVG geometry, not approximate replacement drawings. Each obstacle kit contains13 modules, despite the source manifest saying12. Twelve structural/decorative modules render; accent_particles is preloaded but unused. Sixteen layered background sources render; four composites are retained/preparsed reference/fallback resources. PNG exports are preserved reference files, not claimed as displayed runtime images.

Portrait1080×1920 scenery adapts to landscape. Celestial/flower circles are precompensated to remain round; foreground wood stays in edge strips. Midground opacity preserves corridor readability. SvgAst requires its override prop; per-instance scoped gradient IDs prevent hidden navigation screens from making another screen's sky/Cherry transparent. Both observed defects were corrected and tested.

## Progression

First Bloom1–3, Sakura Garden4–6, Golden Bloom7–9, Yozakura10–12. Config controls targets, gap, speed, spacing, safe variation, kit and pool. Completing a valid unlocked level updates result, next unlock and next-level checkpoint. Locked selection is disabled and independently rejected by logic/route guard. Actual browser completion of Level1 unlocks Level2; the public Snack reproduces this.

## Checkpoints

Schema2 stores unlocked/last/completed level data, best results, Endless unlock and settings. It never stores y, velocity, worldX or a frame. Sanitation derives unlocks from contiguous valid completions rather than trusting raw unlock flags. Invalid/oversized/unknown saves fall back safely; V1 best score migrates without granting campaign progress. Writes are ordered and recover after quota failure.

Browser reload/Continue restores Level2 at READY. Three actual retries verify y153,velocity0,score0,time0, initial obstacle positions and3 future pairs. Settings reload preserves Music off independently from SFX on. Fault injection proves corrupt storage and quota failure do not crash gameplay; failed writes surface a warning.

## Endless

All12 progression completions unlock Endless. Actual browser entry uses a clearly labeled contiguous-completion storage fixture, not a claim of twelve browser wins. It starts at Level10 difficulty, uses5 slots, preloads all4 visual chapters, ramps every10 points and clamps speed/gap. Best score is separate; there are no intermediate physics checkpoints. Unit execution verifies ramp bounds and future-only geometry changes. Long natural Endless play through every ramp remains outside the measured browser run.

## Audio

No audio files were supplied. Four original PCM themes and9 SFX were composed locally and reproducibly; no paid generation or third-party recordings. Music volume starts0.35; event mix follows the audio specification.

Actual browser music time wraps twice during a full level. Event evidence covers UI, jump, score, collision, checkpoint, completion, unlock, pause and resume. Music/SFX switches persist independently. Players preload/reuse, pause on lifecycle, and release on exit. Deferred seek callbacks cannot restart a sound after pause/mute/release; an actual failing regression preceded the fix. Automatic background pause is silent.

SDK54's Web AudioPlayer drops the media.play Promise, so the Web adapter uses standard HTMLAudio to catch autoplay rejection. Denied/aborted playback is recorded and does not change game state. Browser fault injection replaces Audio with a throwing backend: the game still enters PLAYING and Cherry moves. Physical audition, Bluetooth latency, iOS silent-switch behavior and actual Expo Go playback were not executed.

## Motion

Idle bob, jump squash/stretch, fall tilt, collision pose/shake, score feedback, completion ring/petals, layered parallax, biome FX and420ms old/new crossfade are integrated. Decorative World loops honor focus/reduced motion; effect components clean up on unmount. Tap crosses noninteractive overlays. CSS transform samples demonstrate visible Cherry movement, not merely logical y changes.

## SDK54

Expo Doctor18/18; expo install --check passes. Web production export and Android/iOS Hermes exports pass. Bundle export is compilation evidence, not native runtime evidence. Actual browser runs cover667×375,844×390 and1366×768. No local Android SDK/adb/emulator was found at the standard configured location; physical Android/iOS execution is NOT EXECUTED.

## Snack

Official target remains `@wellingtonsp.de/cherry-flight`, accountSnackId a2744c77-4223-45d4-9139-9ae5ff59d0b2, SDK54. QA used a separate alias first. Public Web Preview validated all required routes/credits, trusted10ms input, movement, score8, completion, NextLevel2, locked Level3, reload and Continue. Evidence: snack-final-runtime-results.json and snack-final-checkpoint-restored.json.

The Git import backend rejects binary uploads; generated `snack/` contains43 text files with complete runtime, inline supplied SVGs and identical original WAV bytes as data URIs. This removes that binary-upload path rather than asking the user to import a malformed root. Source/asset repository remains complete. Actual Git reimport of the final main revision is checked separately after push. Snack editor emitted minified p errors; its runtime popup had zero page errors, recorded separately. Native Snack/Expo Go is NOT EXECUTED.

## SDK57

Separate Expo57.0.31 / React19.2.3 / RN0.86.3 manifest and lock. Expo Audio/Asset companions were installed with this checkout's Expo. SDK57 rejects the retired newArchEnabled config key; it was removed only in SDK57. Doctor21/21 and dependency check pass. Actual SDK57 Web Level1 completion, Level2 checkpoint reload and Continue pass. SDK57 is a mirror; it is not used as proof for SDK54 or Snack. SDK58 remains untouched.

## Performance

No full React tree update per frame. Root semantic renders remain far below executed frames; source evidence records counts, wall-clock long frames and visibility preparation. Cache is bounded at256 entries and resize stress verifies the latest chapter/character remain preloaded. Four-state actor changes and stable branch identities isolate work. No game engine/Reanimated dependency was added. Gameplay has priority over extra decorative particles.

## Dependency review

Only SDK-compatible expo-audio and explicit expo-asset peer were added. React Navigation, AsyncStorage, SVG and native screen/safe-area companions remain. No microphone/recording permission is requested by the audio plugin. No npm audit fix --force was run.

npm audit reports7 tooling/transitive advisories (6 high,1 moderate), including node-forge, image-size and PostCSS. Suggested Expo44 downgrade would violate SDK54; it was rejected. These parser/signing/build dependencies are not a public upload endpoint in this static game. They remain a documented tooling risk, not a claim of zero vulnerabilities. SDK57 initially reports5 high advisories independently.

## Acceptance matrix

PASS rows cite executed checks, not source presence alone. Native physical calibration and broad device coverage remain separate limitations.

| ID | Criterion | State | Evidence |
|---|---|---|---|
| V2-AC01 | SDK 54 project boots. | PASS | Metro SDK54 + core/progression browser runs; export-web.log |
| V2-AC02 | React Navigation works across required screens. | PASS | snack-final-runtime-results.json; Instructions/Credits/Home/Game navigation |
| V2-AC03 | `tela1.js`–`tela4.js` remain present/functional. | PASS | Four academic wrappers remain; browser navigation and academic test |
| V2-AC04 | Credits content and mandatory disclaimer are exact. | PASS | Academic exact-string test and visible Snack disclaimer |
| V2-AC05 | Snack import/runtime validated. | PASS | snack-final-runtime-results.json; official account alias, SDK54; public Web Preview |
| V2-AC06 | tap starts/impulses Cherry reliably. | PASS | Trusted Chromium touchStart/touchEnd10ms; READY to PLAYING |
| V2-AC07 | Cherry visibly moves every frame while playing. | PASS | endless-lifecycle-runtime.json: actual SVG ancestor transforms change |
| V2-AC08 | gravity/jump use dt-safe logic. | PASS | engine-v2 tests: invalid dt, capped dt,30/60Hz; browser gravity/jump |
| V2-AC09 | collisions work top/bottom/obstacles. | PASS | Actual engine ceiling/ground/topBranch/bottomBranch scenarios; browser Game Over |
| V2-AC10 | score increments once per passed pair. | PASS | 27-test suite,12 engine replay targets and browser score8 |
| V2-AC11 | retry fully resets level state. | PASS | endless-lifecycle-runtime.json: three full retries; position/velocity/score/time/slots |
| V2-AC12 | no future trunk pop-in on PC/web preview. | PASS | Every visible generation has committed visual-prepared metric first; no new SVG parse |
| V2-AC13 | at least 4 pooled pairs exist. | PASS | Runtime4 slots Levels1/4 and5 Levels7/10/Endless; fixed IDs |
| V2-AC14 | at least 3 future pairs are prepared offscreen. | PASS | Runtime future queue3, all x beyond viewport; queue semantics explained below |
| V2-AC15 | biome assets are preloaded before PLAYING. | PASS | Vector chapter preload precedes READY;0 parses during play |
| V2-AC16 | obstacles recycle rather than recreate per pass. | PASS | Browser4 total pair mounts across a complete level, stable recycled slots |
| V2-AC17 | decorations do not create misleading collision bounds. | PASS | Visual inspection; decorations clipped to trunk bounds; AABB regression scenarios |
| V2-AC18 | 12 level configs load from centralized data. | PASS | Lossless LEVEL_CONFIG_V2.json projection equality test |
| V2-AC19 | Levels 1–12 use increasing difficulty values. | PASS | All12 centralized configs; decreasing gap/spacing, increasing speed; engine execution |
| V2-AC20 | safe generator never violates configured margins/delta. | PASS | Generator bound tests across12levels/3heights/1200steps, plus sampled feasible trajectories |
| V2-AC21 | target score completes each level exactly once. | PASS | campaign-planned-trajectories.json: exact12 targets; terminal one-time unit regression |
| V2-AC22 | completing a level unlocks next. | PASS | Progression tests plus actual Level1/NextLevel2 checkpoint |
| V2-AC23 | locked levels cannot start. | PASS | Level3 disabled in browser; startLevel/route guards and locked-completion test |
| V2-AC24 | Level 12 unlocks Endless Bloom. | PASS | Twelve progression completions test; actual Endless entry with contiguous-completion storage fixture |
| V2-AC25 | checkpoint persists at level granularity. | PASS | checkpoint-restored.json and snack-final-checkpoint-restored.json |
| V2-AC26 | Continue returns to valid last/unlocked level at READY. | PASS | Reload/Continue opens Level2 at READY |
| V2-AC27 | app restart preserves unlocks/results/settings. | PASS | Reload preserves unlock/results; fault-runtime.json preserves Music off/SFX on |
| V2-AC28 | corrupt save falls back safely to Level 1. | PASS | fault-runtime.json: corrupt JSON falls back to Level1 and remains playable |
| V2-AC29 | retry never resumes mid-frame/mid-obstacle. | PASS | Three retries restore initial geometry, y153,velocity0,time0; no mid-frame serialization |
| V2-AC30 | protagonist is named Cherry everywhere user-facing. | PASS | Global product-source search: no deprecated character spelling; Cherry visible |
| V2-AC31 | First Bloom uses its V2 asset kit. | PASS | visual-*-level-1.png; authoritative SVG kit and live rendering |
| V2-AC32 | Sakura Garden uses its V2 asset kit. | PASS | visual-*-level-4.png; authoritative SVG kit and live rendering |
| V2-AC33 | Golden Bloom uses its V2 asset kit. | PASS | visual-*-level-7.png; authoritative SVG kit and live rendering |
| V2-AC34 | Yozakura uses its V2 asset kit. | PASS | visual-*-level-10.png; authoritative SVG kit and live rendering |
| V2-AC35 | backgrounds/overlays do not obstruct gameplay readability. | PASS | Four biomes inspected at667×375,844×390,1366×768 after crossfade |
| V2-AC36 | obstacles use branch/trunk identity, never green pipe visuals. | PASS | Live modular wooden branches/caps/leaves/blossoms; source supplied unchanged |
| V2-AC37 | Cherry idle/jump/fall/hit states are visible and performant. | PASS | Actual idle/jump/fall/hit SVG states, transform/pose updates and browser play |
| V2-AC38 | score feedback exists. | PASS | Visible score updates and HUD/actor feedback during completed browser level |
| V2-AC39 | checkpoint/level-complete FX exists. | PASS | Completion screenshot, bloom ring/particles and completion event after target |
| V2-AC40 | decorative overlays have `pointerEvents="none"` or equivalent. | PASS | Trusted touch through READY/decorations; overlays and effects pointerEvents none |
| V2-AC41 | chapter music can loop. | PASS | audio-lifecycle-runtime.json: actual music timeline wraps twice |
| V2-AC42 | jump/score/collision/checkpoint/UI SFX work. | PASS | audio-events.json: all9 event types, loaded reusable players; engine-driven score/completion |
| V2-AC43 | music and SFX can be disabled independently. | PASS | Independent player preference tests and actual switches/reload |
| V2-AC44 | navigating away stops/releases gameplay audio. | PASS | Retained post-exit snapshot: RAF stopped, elapsed frozen, music inactive; release unit test |
| V2-AC45 | audio initialization failure does not break gameplay. | PASS | fault-runtime.json: Audio constructor throws, gameplay still PLAYING; unit failure tests |
| V2-AC46 | Expo Doctor is clean or every warning is documented. | PASS | expo-doctor.log:18/18 |
| V2-AC47 | `expo install --check` passes for SDK 54. | PASS | expo-install-check.log: Dependencies are up to date |
| V2-AC48 | visual inspection passes on small and regular mobile widths. | PASS | Twelve screenshots:4 biomes ×3 landscape sizes; controls remain scroll-accessible |
| V2-AC49 | PC/web preview has no trunk decode/render stall. | PASS | Pool metrics and0 vector parses during play; long-frame limitations disclosed |
| V2-AC50 | independent adversarial review finds no open BLOCKER/CRITICAL. | PASS | INDEPENDENT_REVIEW.md: findings closed; no open BLOCKER/CRITICAL/MAJOR found |

## Findings

| ID | Severity/category | Cause and evidence | Fix/revalidation | Status |
|---|---|---|---|---|
| V2-REV01 | MAJOR / technical debt | V1 full-tree setRenderTick each frame and3-slot baseline | Mutable engine + actor/slot refs; measured mounts/renders | PASS |
| V2-REV02 | MAJOR / specification divergence | Campaign, checkpoint, selection and Endless absent | Config-driven12 levels, guarded progression, schema2; pure/browser evidence | PASS |
| V2-REV03 | MAJOR / visual divergence | Supplied V2 art not used in V1 | Authoritative vectors in4 kits/scenery/4 Cherry poses; twelve screenshots | PASS |
| V2-REV04 | MAJOR / specification divergence | Music/SFX/preferences absent, no supplied recordings | Original PCM, centralized manager, looping/event/settings/failure checks | PASS |
| V2-REV05 | MAJOR / confirmed implementation bug | SvgAst direct width props ignored; duplicate defs across hidden screens | override prop and instance IDs; RED/GREEN + visual retest | PASS |
| V2-REV06 | MINOR / confirmed implementation bug | seekTo Promise could play SFX after pause | Revision cancellation; deferred seek RED/GREEN | PASS |
| V2-REV07 | MINOR / technical debt | Resize cached unlimited background dimensions | LRU256;400-width stress test | PASS |
| V2-REV08 | MINOR / risk | Keyboard retry could overlap saving | Saving guard + reset; reviewer withdrew its overstated disabled-pause consequence | PASS |
| V2-REV09 | MAJOR / risk | Advanced first gate arrived before comfortable opening-flight adjustment | Centered first gate offscreen1.1W; all12 sampled engine trajectories completed | PASS |
| V2-REV10 | MINOR / configuration bug | SDK57 rejects newArchEnabled copied from SDK54 | Removed only from57; Doctor21/21 | PASS |
| V2-REV11 | MINOR / dependency risk |7 SDK54 tooling advisories; no compatible force-fix established | Audit retained; isolate dev tooling/untrusted inputs; no forced SDK downgrade | PARTIAL |
| V2-REV12 | MINOR / missing evidence | No physical Android/iOS calibration or native Snack audition | Native bundles pass; actual device/Expo Go still required for platform-specific assurance | NOT EXECUTED |

Historical tap and immobility causes/evidence remain in CHERRY_BLOOM_REVIEW_REPORT.md. Naming search found no deprecated character spelling in active product source; historical quotations remain evidence, not UI copy.

## Fixes / correction plan

P0 gameplay and lifecycle, P1 academic/SDK54/Snack, P2 identity/progression/assets/audio are implemented and checked at the scopes above. Optional P3 polish was limited to lightweight authored motion/FX. Remaining work is physical calibration, additional random-seed/human playtesting and tracking build-tool advisories. Do not redesign the approved art or change SDK54 to silence incompatible audit suggestions.

## Publication

Pending final Git/Vercel revision recording and Git-import retest. DNS/Cloudflare records are intentionally left for later domain configuration.

## Remaining limitations

- No real Android/iOS device, emulator or native Expo Go test; exported bundles do not substitute for it.
- Twelve successful deterministic engine layouts do not mathematically prove all random sequences or human difficulty calibration.
- Web long frames occurred under shared CPU load; no locked-FPS, battery or native-memory claim.
- Native Snack data-URI audio and physical audibility remain unexecuted.
- Offline PWA resources depend on previous visits/cache; optional missing audio fails open.
- Tooling advisories remain documented.

## Final audit

FINAL AUDIT: PARTIAL — final publication verification pending.
READY FOR DELIVERY: NO — freeze follows the final publication gate.
