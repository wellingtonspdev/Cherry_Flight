# Mobile Gameplay Rebalance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Overview
Rebalance Cherry Bloom gameplay specifically for mobile viewports (landscape height 320px–390px). Fix the mathematical mismatch where obstacle gap clearance (49px in L12) was smaller than Cherri's single jump rise (72.4px), making mobile completion humanly impossible. Maintain academic compliance and Snack/Vercel delivery.

## Target Files
- `src/game/constants.js`: Fine-tune `playerHitboxInset`, `gravity`, and `jumpVelocity` for responsive touch ergonomics.
- `src/game/engineV2.js`: Upgrade `resolveDifficulty` with jump-aware `physicalGap` floor formula.
- `docs/LEVEL_CONFIG_V2.json`: Rebalance campaign levels 1–12 (`gapRatio`, `spacingWidthRatio`, `maxGapCenterDeltaRatio`) and endless thresholds.
- `src/game/levelConfigV2.js`: Keep in sync with `LEVEL_CONFIG_V2.json`.
- `tests/game.test.mjs`: Add mobile viewport simulation tests (360x780, 320x640, 390x844) validating jump clearance across all 12 levels.

---

### Task 1: Mathematical Gap Floor in Engine (TDD)
- [ ] Write failing test in `tests/game.test.mjs` verifying that for any mobile screen height (320px–420px), `resolveDifficulty` returns `gapSize >= hitboxSize + jumpRise + 18`.
- [ ] Run test to observe failure with current formula.
- [ ] Update `engineV2.js` `resolveDifficulty` to calculate:
  ```javascript
  const jumpRise = GAME.jumpVelocity ** 2 / (2 * GAME.gravity);
  const physicalGap = hitboxSize + jumpRise + 18;
  ```
- [ ] Ensure `gapSize = Math.min(available, Math.max(height * gapRatio, physicalGap))`.
- [ ] Run test to verify it passes.
- [ ] Commit changes.

---

### Task 2: Rebalance Campaign Level Config (Levels 1–12)
- [ ] Write test verifying monotonic progression and guaranteed human reaction time (>= 1.05s between gates on mobile screens) across all 12 levels.
- [ ] Update `docs/LEVEL_CONFIG_V2.json` and `src/game/levelConfigV2.js`:
  - L1–L3 (First Bloom): `gapRatio` 0.42 -> 0.38, `spacingWidthRatio` 0.65 -> 0.62.
  - L4–L6 (Sakura Garden): `gapRatio` 0.37 -> 0.34, `spacingWidthRatio` 0.60 -> 0.58.
  - L7–L9 (Golden Bloom): `gapRatio` 0.34 -> 0.31, `spacingWidthRatio` 0.58 -> 0.55.
  - L10–L12 (Yozakura): `gapRatio` 0.31 -> 0.28, `spacingWidthRatio` 0.55 -> 0.52.
  - Endless: `minGapRatio` set to 0.27 (was 0.22).
- [ ] Run test suite to verify progression curves and gate clearance.
- [ ] Commit changes.

---

### Task 3: Touch Physics and Forgiving Hitbox Tuning
- [ ] Write test validating hitbox boundaries and jump trajectory apex.
- [ ] In `src/game/constants.js`:
  - Adjust `playerHitboxInset` from 6 to 8 (reduces phantom hits against branch flower caps).
  - Fine-tune `jumpVelocity` to -370 (from -390) and `gravity` to 980 (from 1050), softening arc for mobile touch latency (~80ms).
- [ ] Run unit tests and verify collision edge cases.
- [ ] Commit changes.

---

### Task 4: Verification and Sync Across Baselines
- [ ] Run full test suite (`npm test`).
- [ ] Synchronize updated files to worktrees `D:\Cherry_Flight_Release54` (main / Snack authority) and `D:\Cherry_Flight_Release57`.
- [ ] Verify local execution and Snack bundle validity.
