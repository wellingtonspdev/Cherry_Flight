# Mobile Gameplay Rebalance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Overview
Rebalance Cherry Bloom gameplay specifically for mobile viewports (landscape height 320px–390px). Fix the mathematical mismatch where obstacle gap clearance (49px in L12) was smaller than Cherri's single jump rise (72.4px), making mobile completion humanly impossible. Maintain academic compliance and Snack/Vercel delivery.

## Target Files
- `src/game/constants.js`: Fine-tune `playerHitboxInset`, `gravity`, and `jumpVelocity` for responsive touch ergonomics.
- `src/game/engineV2.js`: Upgrade `resolveDifficulty` with jump-aware `physicalGap` floor formula.
- `docs/LEVEL_CONFIG_V2.json`: Rebalance campaign levels 1–12 (`gapRatio`, `spacingWidthRatio`, `maxGapCenterDeltaRatio`) and endless thresholds.
- `src/game/levelConfigV2.js`: Keep in sync with `LEVEL_CONFIG_V2.json`.
- `tests/engine-v2.test.mjs`: Add mobile viewport simulation tests validating jump clearance and reaction time across all 12 levels.

---

### Task 1: Mathematical Gap Floor in Engine (TDD)
- [x] Write failing test in `tests/engine-v2.test.mjs` verifying that for any mobile screen height (320px–390px), `resolveDifficulty` returns `gapSize >= hitboxSize + jumpRise + 18`.
- [x] Run test to observe failure with current formula.
- [x] Update `engineV2.js` `resolveDifficulty` to calculate:
  ```javascript
  const jumpRise = GAME.jumpVelocity ** 2 / (2 * GAME.gravity);
  const physicalGap = hitboxSize + Math.max(jumpRise + 18, transitDrop + 4);
  ```
- [x] Ensure `gapSize = Math.min(available, Math.max(height * gapRatio, physicalGap))`.
- [x] Run test to verify it passes.
- [x] Commit changes.

---

### Task 2: Rebalance Campaign Level Config (Levels 1–12)
- [x] Write test verifying monotonic progression and guaranteed human reaction time (>= 1.0s between gates on mobile screens) across all 12 levels.
- [x] Update `docs/LEVEL_CONFIG_V2.json` and `src/game/levelConfigV2.js`:
  - L1–L3 (First Bloom): `gapRatio` 0.42 -> 0.38, `spacingWidthRatio` 0.65 -> 0.61.
  - L4–L6 (Sakura Garden): `gapRatio` 0.37 -> 0.34, `spacingWidthRatio` 0.59 -> 0.57.
  - L7–L9 (Golden Bloom): `gapRatio` 0.33 -> 0.31, `spacingWidthRatio` 0.56 -> 0.54.
  - L10–L12 (Yozakura): `gapRatio` 0.30 -> 0.28, `spacingWidthRatio` 0.53 -> 0.51.
  - Endless: `minGapRatio` set to 0.27 (was 0.22), max speed 0.56 (was 0.62).
- [x] Run test suite to verify progression curves and gate clearance.
- [x] Commit changes.

---

### Task 3: Touch Physics and Forgiving Hitbox Tuning
- [x] Write test validating hitbox boundaries and jump trajectory apex.
- [x] In `src/game/constants.js`:
  - Adjust `playerHitboxInset` from 6 to 8 (reduces phantom hits against branch flower caps).
  - Fine-tune `jumpVelocity` to -370 (from -390) and `gravity` to 980 (from 1050), softening arc for mobile touch latency (~80ms).
- [x] Run unit tests and verify collision edge cases.
- [x] Commit changes.

---

### Task 4: Verification and Sync Across Baselines
- [x] Run full test suite (`npm test`) — 28 passed, 0 failures.
- [x] Synchronize updated files to Expo SDK 58 production baseline.
- [x] Verify local web build (`npm run build:web`) generates dist with PWA and desktop controls.
