# Cherry Bloom V2 — Progression, Checkpoints & Difficulty Implementation Notes

## Architecture
Recommended services/modules:
- `levelConfig.js` — reads centralized level data;
- `progressionService.js` — unlock/complete/select logic;
- `saveService.js` — AsyncStorage schema V2 + migration/fallback;
- `obstacleGenerator.js` — valid gap geometry;
- `obstaclePool.js` — pair recycling/prewarm;
- `assetPreloader.js` — chapter asset readiness;
- `audioService.js` — centralized audio lifecycle.

## Checkpoint rule
Checkpoint is level start only. Never persist physics frame state.

## Save migration
If V1 save exists, preserve best score/settings when safely mappable; initialize campaign unlocks at Level 1. Never crash on malformed JSON.

## Difficulty tuning
Use `LEVEL_CONFIG_V2.json` as baseline. Tuning may change after runtime testing, but monotonic campaign difficulty and safe-gap rules must remain.

## Endless
Unlocked after Level 12. Start around Level 10 difficulty, ramp every 10 score, clamp at configured max speed/min gap.
