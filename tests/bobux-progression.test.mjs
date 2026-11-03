import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProgress,
  sanitizeProgress,
  addBobux,
  unlockSkin,
  equipSkin,
  completeLevel,
  recordAttempt,
} from '../src/game/progressionV2.js';

test('Progress initializes wallet with 0 bobux and classic skin equipped', () => {
  const p = createProgress();
  assert.equal(p.bobux, 0);
  assert.deepEqual(p.unlockedSkins, ['classic']);
  assert.equal(p.equippedSkin, 'classic');
});

test('Sanitize handles legacy saves and invalid values safely', () => {
  const legacy = {
    schemaVersion: 2,
    highestUnlockedLevel: 3,
    lastPlayedLevel: 3,
    lastCompletedLevel: 2,
    levelResults: { 1: { bestScore: 10, completed: true }, 2: { bestScore: 12, completed: true } },
    endlessUnlocked: false,
    settings: { music: true, sfx: true, haptics: true },
  };
  const sanitized = sanitizeProgress(legacy);
  assert.equal(sanitized.bobux, 0);
  assert.deepEqual(sanitized.unlockedSkins, ['classic']);
  assert.equal(sanitized.equippedSkin, 'classic');

  // Corrupt values are normalized
  const corrupt = sanitizeProgress({
    ...legacy,
    bobux: -50,
    unlockedSkins: ['unknown_skin', 123],
    equippedSkin: 'unknown_skin',
  });
  assert.equal(corrupt.bobux, 0);
  assert.deepEqual(corrupt.unlockedSkins, ['classic']);
  assert.equal(corrupt.equippedSkin, 'classic');
});

test('Skin purchase validates wallet and prevents double-unlocking', () => {
  let p = createProgress();
  const failed = unlockSkin(p, 'sakura');
  assert.equal(failed.success, false);
  assert.equal(failed.data.bobux, 0);

  p = addBobux(p, 20);
  assert.equal(p.bobux, 20);
  const bought = unlockSkin(p, 'sakura');
  assert.equal(bought.success, true);
  assert.equal(bought.data.bobux, 5); // 20 - 15
  assert.ok(bought.data.unlockedSkins.includes('sakura'));
  assert.equal(bought.data.equippedSkin, 'sakura');

  // Equipping classic
  const equippedClassic = equipSkin(bought.data, 'classic');
  assert.equal(equippedClassic.equippedSkin, 'classic');

  // Equipping locked skin fails
  const equipLocked = equipSkin(equippedClassic, 'golden');
  assert.equal(equipLocked.equippedSkin, 'classic');
});

test('Completing a level awards collected bobux plus first-time completion bonus of 5', () => {
  let p = createProgress();
  p = completeLevel(p, 1, 8, 3);
  assert.equal(p.bobux, 8); // 3 collected + 5 bonus

  // Re-completing level 1 gives only collected bobux (no second bonus)
  p = completeLevel(p, 1, 9, 2);
  assert.equal(p.bobux, 10); // 8 + 2
});

test('Game over attempt awards collected bobux', () => {
  let p = createProgress();
  p = recordAttempt(p, 1, 4, 3);
  assert.equal(p.bobux, 3);
});
