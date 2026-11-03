# BOBUX Collectibles & Skin Shop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Roblox-inspired collectible currency named "BOBUX" to in-game obstacle gaps and an in-game Skin Shop to unlock and equip Cherry character skins, fully integrated with Expo SDK 58 and existing save persistence.

**Architecture:** 
- The collectible BOBUX is attached to recycled obstacle pairs in `engineV2.js`, maintaining 60 FPS without additional React re-renders or GC spikes.
- Collision detection in `collision.js` triggers audio/haptics and accumulates session BOBUX, which are saved to `AsyncStorage` via atomic transactions in `progressionV2.js` on both win (`LEVEL_COMPLETE`) and loss (`GAME_OVER`).
- A new landscape-optimized `SkinShopV2` modal screen allows players to view animated skin previews, spend BOBUX to unlock skins, and equip active skins across all screens.

**Tech Stack:** React Native 0.88 / Expo SDK 58, `react-native-svg` (AST pre-compilation), React Native `Animated` (`useNativeDriver: true`), `@react-native-async-storage/async-storage`, Node.js native test runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-11-02-bobux-collectibles-and-skins-design.md`

## Global Constraints
- Target platform: Expo SDK 58 on branch `main` (`react-native-web` 0.21.4, React 19.3.0).
- Academic strings and disclaimers in `src/game/constants.js` must remain strictly untouched.
- All game visuals must use the pre-compiled `vectorDataV2.js` pipeline (`parsesDuringPlay: 0`) to prevent mobile frame drops.
- Game layout must remain strictly landscape (`orientation: 'landscape'`) and mobile touch-friendly.
- Zero npm dependencies added (use existing React Native, SVG, and AsyncStorage).

## Review Focus
1. **Save Schema Migration:** Existing user saves without `bobux` or `unlockedSkins` fields must migrate cleanly without losing campaign progress or throwing errors.
2. **Hitbox Generosity:** The BOBUX hitbox must be forgiving (`36x36 dp` collision vs `28x28 dp` visual) so touching the edge awards the coin without feeling clunky.
3. **Obstacle Recycle Reset:** Recycled obstacles in `advancePairs` must reset `bobux.collected = false` and recalculate position so coins do not disappear or duplicate across cycles.
4. **Insufficient Funds Handling:** Attempting to unlock a skin without enough BOBUX must cleanly return `false` without modifying wallet balance or unlocking the item.
5. **Skin Fallback:** If an invalid or unpurchased skin ID is passed to `CherryV2`, it must safely fall back to `'classic'` without crashing the renderer.

---

### Task 1: Vector Assets & Skins Catalog Definition

**Files:**
- Create: `assets/v2/collectibles/bobux_coin.svg`
- Create: `src/game/skinsV2.js`
- Modify: `scripts/prepare-v2.mjs`
- Test: `tests/bobux-assets.test.mjs`

**Interfaces:**
- Produces: `SKINS` catalog in `src/game/skinsV2.js`:
  ```javascript
  export const SKINS = {
    classic: { id: 'classic', name: 'Cherry Clássica', price: 0, description: 'Cereja rubi original do Bloom Garden' },
    sakura: { id: 'sakura', name: 'Sakura Spirit', price: 15, description: 'Rosa pastel com pétala reluzente' },
    noob: { id: 'noob', name: 'Blox Noob', price: 30, description: 'Homenagem ao clássico visual Noob' },
    golden: { id: 'golden', name: 'Golden Bobux', price: 50, description: 'Cereja banhada a ouro com insígnia hexagonal' },
    yozakura: { id: 'yozakura', name: 'Cyber Yozakura', price: 80, description: 'Estética neon noturna futurista' },
  };
  ```
- Produces: SVG assets compiled into `src/game/vectorDataV2.js`:
  - `collectibles/bobux_coin`
  - `characters/<skin>_<pose>` for skin in `['classic', 'sakura', 'noob', 'golden', 'yozakura']` and pose in `['idle', 'jump', 'fall', 'hit']`

- [ ] **Step 1: Write the failing test in `tests/bobux-assets.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { SKINS } from '../src/game/skinsV2.js';
import { VECTORS } from '../src/game/vectorDataV2.js';

test('BOBUX coin and all catalog skin poses are compiled into vector registry', () => {
  assert.ok(VECTORS['collectibles/bobux_coin'], 'BOBUX coin SVG must exist in vector data');
  const skinIds = Object.keys(SKINS);
  assert.deepEqual(skinIds, ['classic', 'sakura', 'noob', 'golden', 'yozakura']);
  for (const id of skinIds) {
    for (const pose of ['idle', 'jump', 'fall', 'hit']) {
      const key = `characters/${id}_${pose}`;
      assert.ok(VECTORS[key], `Vector key ${key} must exist in compiled vectors`);
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/bobux-assets.test.mjs`
Expected: FAIL (modules not found or vectors missing)

- [ ] **Step 3: Implement SVG assets, skins catalog, and update `scripts/prepare-v2.mjs`**
  - Create `assets/v2/collectibles/bobux_coin.svg` with gold hexagon geometry, inner rounded square cutout, and gradient styling.
  - Create `src/game/skinsV2.js` exporting `SKINS` and `DEFAULT_SKIN = 'classic'`.
  - Update `scripts/prepare-v2.mjs` to generate skin variants (colors, tints, accessories) based on the authoritative `cherry_<pose>.svg` base assets so all 5 skins maintain identical hitbox and alignment metrics.
  - Run `node scripts/prepare-v2.mjs` to populate `src/game/vectorDataV2.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/bobux-assets.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/v2/collectibles/bobux_coin.svg src/game/skinsV2.js scripts/prepare-v2.mjs src/game/vectorDataV2.js tests/bobux-assets.test.mjs
git commit -m "feat: add bobux coin svg and skin variants catalog"
```

---

### Task 2: Collectible Spawn & Collision Logic in Engine (TDD)

**Files:**
- Modify: `src/game/collision.js`
- Modify: `src/game/engineV2.js`
- Test: `tests/bobux-engine.test.mjs`

**Interfaces:**
- Consumes: `GAME` from `src/game/constants.js`
- Produces in `src/game/collision.js`:
  ```javascript
  export function checkBobuxCollection(playerBox, pair): boolean
  ```
- Produces in `src/game/engineV2.js`:
  - `pair.bobux = { x, y, size: 28, collected: false } | null`
  - `round.bobuxCount: number`
  - Event `{ type: 'bobux', count: number, pairId: string }` on collision in `stepRound`.

- [ ] **Step 1: Write the failing test in `tests/bobux-engine.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkBobuxCollection } from '../src/game/collision.js';
import { createRound, stepRound } from '../src/game/engineV2.js';
import { GAME } from '../src/game/constants.js';

test('BOBUX collision detection uses forgiving bounding box', () => {
  const pairWithBobux = {
    x: 200,
    width: 68,
    bobux: { x: 220, y: 150, size: 28, collected: false },
  };
  const boxFar = { x: 100, y: 150, width: 32, height: 32 };
  assert.equal(checkBobuxCollection(boxFar, pairWithBobux), false);

  const boxTouching = { x: 200, y: 150, width: 32, height: 32 };
  assert.equal(checkBobuxCollection(boxTouching, pairWithBobux), true);
});

test('Engine spawns bobux in obstacle pairs and emits collection events', () => {
  const round = createRound({ width: 844, height: 354, levelId: 1 }, () => 0.1);
  round.status = 'PLAYING';
  // Fast forward player into a pair's bobux
  const targetPair = round.pairs.find(p => p.bobux);
  assert.ok(targetPair, 'At least one pair should spawn with bobux');
  round.player.x = targetPair.bobux.x;
  round.player.y = targetPair.bobux.y;
  stepRound(round, 0.016);
  assert.equal(targetPair.bobux.collected, true);
  assert.equal(round.bobuxCount, 1);
  const bobuxEvent = round.events.find(e => e.type === 'bobux');
  assert.ok(bobuxEvent);
  assert.equal(bobuxEvent.count, 1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/bobux-engine.test.mjs`
Expected: FAIL (`checkBobuxCollection` is not a function)

- [ ] **Step 3: Implement `checkBobuxCollection` and integrate into `engineV2.js`**
  - In `src/game/collision.js`, implement `checkBobuxCollection(playerBox, pair)`: checks overlap against `pair.bobux` if `!pair.bobux.collected`, with +4dp inset margin.
  - In `src/game/engineV2.js`, in `prepareFuture`:
    - If `round.nextWorldX > round.width * 1.5` and `random() < 0.65`:
      - Attach `bobux = { x: round.nextWorldX + p.width / 2 - 14, y: center - 14, size: 28, collected: false }`.
    - In `advancePairs`: when recycling an obstacle, preserve or generate a new `bobux` with `collected = false`.
    - In `stepRound`: call `checkBobuxCollection`. If collected, set `pair.bobux.collected = true`, increment `round.bobuxCount`, push `{ type: 'bobux', count: round.bobuxCount }`.
    - In `createRound`: initialize `round.bobuxCount = 0`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/bobux-engine.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/game/collision.js src/game/engineV2.js tests/bobux-engine.test.mjs
git commit -m "feat: add bobux spawning and collision logic to game engine"
```

---

### Task 3: Progression, Wallet & Skin State Persistence (TDD)

**Files:**
- Modify: `src/game/progressionV2.js`
- Modify: `src/game/ProgressProviderV2.js`
- Test: `tests/bobux-progression.test.mjs`

**Interfaces:**
- Consumes: `SKINS` from `src/game/skinsV2.js`
- Produces in `src/game/progressionV2.js`:
  ```javascript
  export function createProgress(): ProgressData
  export function sanitizeProgress(raw: any): ProgressData
  export function addBobux(data: ProgressData, amount: number): ProgressData
  export function unlockSkin(data: ProgressData, skinId: string): { data: ProgressData, success: boolean }
  export function equipSkin(data: ProgressData, skinId: string): ProgressData
  export function completeLevel(data: ProgressData, id: number, score: number, bobuxCollected?: number): ProgressData
  export function recordAttempt(data: ProgressData, id: number | string, score: number, bobuxCollected?: number): ProgressData
  ```
- Produces in `src/game/ProgressProviderV2.js`:
  - Context values: `unlockSkin(skinId)`, `equipSkin(skinId)`, `addBobux(amount)`.

- [ ] **Step 1: Write the failing test in `tests/bobux-progression.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { createProgress, sanitizeProgress, addBobux, unlockSkin, equipSkin, completeLevel, recordAttempt } from '../src/game/progressionV2.js';

test('Progress initializes wallet with 0 bobux and classic skin equipped', () => {
  const p = createProgress();
  assert.equal(p.bobux, 0);
  assert.deepEqual(p.unlockedSkins, ['classic']);
  assert.equal(p.equippedSkin, 'classic');
});

test('Skin purchase validates wallet and prevents double-unlocking', () => {
  let p = createProgress();
  // Trying to unlock 15-bobux sakura skin with 0 bobux fails
  const failed = unlockSkin(p, 'sakura');
  assert.equal(failed.success, false);
  assert.equal(failed.data.bobux, 0);

  // Add 20 bobux and unlock
  p = addBobux(p, 20);
  assert.equal(p.bobux, 20);
  const bought = unlockSkin(p, 'sakura');
  assert.equal(bought.success, true);
  assert.equal(bought.data.bobux, 5); // 20 - 15
  assert.ok(bought.data.unlockedSkins.includes('sakura'));
  assert.equal(bought.data.equippedSkin, 'sakura');

  // Can equip classic again
  const equippedClassic = equipSkin(bought.data, 'classic');
  assert.equal(equippedClassic.equippedSkin, 'classic');
});

test('Completing a level awards collected bobux plus first-time completion bonus of 5', () => {
  let p = createProgress();
  p = completeLevel(p, 1, 8, 3);
  // Level 1 targetScore is 8. 3 collected + 5 bonus = 8 bobux
  assert.equal(p.bobux, 8);

  // Re-completing level 1 gives only collected bobux (no repeat bonus)
  p = completeLevel(p, 1, 9, 2);
  assert.equal(p.bobux, 10);
});

test('Game over attempt awards collected bobux', () => {
  let p = createProgress();
  p = recordAttempt(p, 1, 4, 3);
  assert.equal(p.bobux, 3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/bobux-progression.test.mjs`
Expected: FAIL (`addBobux`, `unlockSkin`, `equipSkin` not defined)

- [ ] **Step 3: Implement wallet & skins functions in `progressionV2.js` and `ProgressProviderV2.js`**
  - Update `createProgress`: add `bobux: 0`, `unlockedSkins: ['classic']`, `equippedSkin: 'classic'`.
  - Update `sanitizeProgress`: validate and clamp `bobux`, filter `unlockedSkins` to valid entries in `SKINS`, ensure `unlockedSkins` always includes `'classic'`, ensure `equippedSkin` is in `unlockedSkins`.
  - Implement `addBobux(data, amount)`.
  - Implement `unlockSkin(data, skinId)`: checks price, deducts balance, adds to `unlockedSkins`, equips.
  - Implement `equipSkin(data, skinId)`: validates ownership.
  - Update `completeLevel(data, id, score, bobux = 0)`: credit `bobux`, plus +5 if level was not previously completed.
  - Update `recordAttempt(data, id, score, bobux = 0)`: credit `bobux`.
  - Expose `unlockSkin`, `equipSkin`, `addBobux` in `ProgressProviderV2.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/bobux-progression.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/game/progressionV2.js src/game/ProgressProviderV2.js tests/bobux-progression.test.mjs
git commit -m "feat: implement bobux wallet and skin persistence"
```

---

### Task 4: In-Game Rendering & HUD Updates

**Files:**
- Modify: `src/components/BloomBranchV2.js`
- Modify: `src/components/ScoreHUD.js`
- Modify: `src/components/CherryV2.js`
- Modify: `src/components/GameFieldV2.js`
- Modify: `src/game/assetPreloaderV2.js`
- Test: `tests/bobux-rendering.test.mjs`

**Interfaces:**
- Consumes: `VECTORS` from `src/game/vectorDataV2.js`
- Consumes: `ProgressContext` for active `equippedSkin`
- Produces:
  - Floating BOBUX rendering in `BloomBranchV2.js` inside obstacle corridor.
  - BOBUX counter pill in `ScoreHUD.js`.
  - `CherryV2` and `PlayerActorV2` accepting `skin` string prop.

- [ ] **Step 1: Write the failing test in `tests/bobux-rendering.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { preloadChapter, vectorRegistry } from '../src/game/assetPreloaderV2.js';

test('preloadChapter preloads bobux collectible and equipped skins', async () => {
  const stats = await preloadChapter('first_bloom', 844, 390, false, 'sakura');
  assert.ok(stats.entries > 0);
  const coin = vectorRegistry.get('collectibles/bobux_coin');
  assert.ok(coin);
  const skinAsset = vectorRegistry.get('characters/sakura_idle');
  assert.ok(skinAsset);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/bobux-rendering.test.mjs`
Expected: FAIL (preloadChapter missing skin argument or coin not cached)

- [ ] **Step 3: Implement components rendering**
  - In `src/game/assetPreloaderV2.js`: ensure `collectibles/bobux_coin` and all poses of the current skin are preloaded before game start.
  - In `src/components/BloomBranchV2.js`:
    - If `visual.bobux && !visual.bobux.collected`, render `<VectorAsset assetKey="collectibles/bobux_coin" width={28} height={28} />` at relative `top: visual.bobux.y` and centered horizontal offset.
  - In `src/components/ScoreHUD.js`:
    - Add a BOBUX counter pill showing `🪙 {bobuxCount || 0}` alongside the main score.
  - In `src/components/CherryV2.js`:
    - Pass `skin = 'classic'` prop to `VectorAsset assetKey={"characters/" + skin + "_" + pose}`.
  - In `src/components/GameFieldV2.js`:
    - Read `progress.data.equippedSkin`, pass to `PlayerActorV2`.
    - Listen for `event.type === 'bobux'`, trigger sound `score` and haptics.
    - Pass `round.bobuxCount` to `progress.complete()` and `progress.attempt()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/bobux-rendering.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/BloomBranchV2.js src/components/ScoreHUD.js src/components/CherryV2.js src/components/GameFieldV2.js src/game/assetPreloaderV2.js tests/bobux-rendering.test.mjs
git commit -m "feat: render bobux coins in branches and skin in player actor"
```

---

### Task 5: Skin Shop Screen & Menu Navigation

**Files:**
- Create: `src/components/SkinShopV2.js`
- Modify: `App.js`
- Modify: `src/tela1.js`
- Modify: `src/components/GameResultV2.js`
- Test: `tests/bobux-shop-integration.test.mjs`

**Interfaces:**
- Consumes: `useProgress()` (`data.bobux`, `data.unlockedSkins`, `data.equippedSkin`, `unlockSkin`, `equipSkin`)
- Consumes: `SKINS` from `src/game/skinsV2.js`
- Produces:
  - Screen `SkinShop` registered in `App.js`.
  - "SKIN SHOP" button in `Tela1` menu.
  - BOBUX reward breakdown in `GameResultV2`.

- [ ] **Step 1: Write the failing test in `tests/bobux-shop-integration.test.mjs`**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { SKINS } from '../src/game/skinsV2.js';

test('Skin catalog contains valid pricing, titles, and keys for shop display', () => {
  for (const [id, skin] of Object.entries(SKINS)) {
    assert.equal(skin.id, id);
    assert.ok(skin.name.length > 0);
    assert.ok(typeof skin.price === 'number' && skin.price >= 0);
    assert.ok(skin.description.length > 0);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/bobux-shop-integration.test.mjs`
Expected: PASS or FAIL depending on keys.

- [ ] **Step 3: Implement `SkinShopV2.js` and navigation links**
  - Create `src/components/SkinShopV2.js`:
    - Landscape container with Back button `← VOLTAR`.
    - Header showing total `🪙 BOBUX: {data.bobux}`.
    - Horizontal or grid carousel of cards:
      - Animated preview of `CherryV2` with the skin in idle bobbing.
      - Skin name and description.
      - Action button:
        - If `equippedSkin === skin.id`: `EQUIPADO` (disabled, green tint).
        - If `unlockedSkins.includes(skin.id)`: `EQUIPAR` (primary button).
        - If not unlocked: `COMPRAR ({skin.price} BOBUX)` (disabled if `data.bobux < skin.price`).
  - In `App.js`: Add `<Stack.Screen name="SkinShop" component={SkinShopV2} />`.
  - In `src/tela1.js`: Add button `BOBUX SHOP` with balance indicator.
  - In `src/components/GameResultV2.js`: Show `+X BOBUX Coletados` and button `SHOP` to jump straight to the store.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/bobux-shop-integration.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SkinShopV2.js App.js src/tela1.js src/components/GameResultV2.js tests/bobux-shop-integration.test.mjs
git commit -m "feat: add skin shop screen and integrate into navigation flow"
```

---

### Task 6: Full Verification, Regression Test & Production Web Build

**Files:**
- Modify: `package.json` (if script update needed)
- Test: All tests in `tests/*.test.mjs`

- [ ] **Step 1: Run complete test suite**

Run: `npm test`
Expected: All tests PASS with zero regressions across campaign, progression, audio, vectors, and bobux features.

- [ ] **Step 2: Build web distribution**

Run: `npm run build:web`
Expected: Clean export to `dist/` with PWA assets and compiled bundle without errors.

- [ ] **Step 3: Commit final integration**

```bash
git add .
git commit -m "feat: complete bobux collectibles and skin shop feature"
```
