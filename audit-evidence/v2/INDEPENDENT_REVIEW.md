# Independent adversarial review — V2

Reviewed 2026-10-27, SDK54 working tree `D:/Cherry_Flight_Release54`, base `6101b35`, core `ffb576e` plus current progression/audio changes. Read-only source review; this report is the only file written by reviewer.

## Verdict

No BLOCKER/CRITICAL or demonstrated MAJOR found in the reviewed engine/progression/save/game-screen flow. This is a source-review result, not full acceptance: Snack, production and physical native-device playback/performance remain unexecuted by this reviewer.

## Findings

1. **CLOSED — retry/save state.** Revalidated `GameFieldV2.js:68,149`: new-round initialization resets saving and retry rejects pending saves, including keyboard invocation. Correction to original review: PAUSED GameResult does not receive the saving prop, so the original claimed disabled Resume/Home consequence was overstated and is withdrawn. The stale flag path is defensively closed; no remaining actionable finding.

2. **RESOLVED — dimension-specific vector cache growth.** Revalidated `vectorCacheV2.js:10-11,26-27`: hits refresh Map insertion order and insertion evicts the least-recently-used entry above256. This closes unbounded retained AST growth. Parent reports viewport stress PASS; reviewer inspected source, without repeating stress.

3. **RESOLVED — pending SFX after pause/mute/release.** Revalidated `audioServiceV2.js:30,36-37,43,47`: effect captures effectRevision; pause, SFX mute and release invalidate it. Pending seek continuation requires matching revision and live map identity. `GameFieldV2.js:162` uses silent automatic pause on background AppState. Parent reports deferred-seek test PASS; reviewer inspected source without rerunning it.
## Focused observations

- Frame callbacks read mutable `roundRef` and `settingsRef`; no stale gameplay/progress closure defect identified. Loading checks cancellation after preload and audio await, and navigation/unmount clears RAF. Retried scene initialization explicitly prepares reused branch refs and resets actor state.
- Save sanitation derives unlocks from contiguous valid completions and caps external scores; queued writes preserve ordering. Failed persistence is surfaced while in-memory progress remains available.
- No physically impossible Level11/12 gap was proved. Collision uses a 60dp inset trunk plus36dp player hitbox, i.e.96dp crossing span. At667dp width, Level11 crossing lasts about0.277s; a centered ballistic apex needs about10.1dp vertical travel versus roughly48.75dp available in a339dp playable field. Individual gates are feasible. This does not prove every consecutive random arrangement or human playability; the beam controller's death is inconclusive because it prunes state bins, imposes its own jump restriction and optimizes only a finite horizon.
- Campaign completion is collision-first and terminal stepping stops; score marking prevents duplicate awards. Endless changes future geometry after existing mounted pairs, avoiding an immediate geometry swap inside the current gate.

## Validation limits

No edits to product source, no publishing, no broad suite rerun. Existing parent browser/Doctor/test results were context, not independently repeated. No claim of all12 real-browser completions, native physical calibration, production audio, cache-memory measurement or Snack acceptance.

## Final revalidation disposition

All prior actionable findings are closed; **no open BLOCKER/CRITICAL/MAJOR identified**. Brief final source diff inspected; no broad tests or product mutations performed.

Read `campaign-planned-trajectories.json`: supplied input-only actual-engine replay evidence contains LEVEL_COMPLETE results for all12 deterministic sampled levels. This supersedes the earlier beam-controller failure as evidence of those sampled trajectories' reachability; it does not prove every random arrangement or twelve browser completions. Parent additionally reports browser music wrap/SFX, corrupt-save/audio-backend/storage-quota fail-open, and SnackQA Level1 completion/checkpoint reload PASS. Those runtime results were not independently repeated and do not establish physical-device calibration/performance or production acceptance.

## Final character-anchor delta — CLOSED

Independently inspected constants, Actor nesting, VectorAsset preserveAspectRatio and new engine test. All four source poses share viewBox160×150 and body ellipse(78,88;55,52). At64×64, xMidYMid meet gives scale0.4 and vertical letterbox2. Thus body center is(-7.2+78×0.4, -13.2+2+88×0.4)=(24,24), with axis-aligned extents44×41.6: x=[2,46], y=[3.2,44.8], larger than logical hitbox bounds[6,42] on both axes. The inner48×48 normal-flow frame preserves center(24,24) for tilt/squash/bounce while the outer frame retains existing physics translation. Only gameplay Actor changes; menu component default remains48. No physics/collision constants changed. Existing new test covers all four source anchors and axis extents.

Precision: the ellipse's axis-aligned bounds enclose the36×36 hitbox bounds; its curved silhouette does not contain the hitbox corners, and squash/rotation intentionally alter visible bounds. This remains an AABB gameplay approximation, not pixel-mask collision. No new blocker/critical found. No runtime or broad test rerun; final published visual bytes still require the parent's planned republication checks.
