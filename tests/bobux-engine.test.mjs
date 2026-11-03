import test from 'node:test';
import assert from 'node:assert/strict';
import { checkBobuxCollection } from '../src/game/collision.js';
import { createRound, stepRound } from '../src/game/engineV2.js';

test('BOBUX collision detection uses forgiving bounding box and ignores collected coins', () => {
  const pairWithBobux = {
    x: 200,
    width: 68,
    bobux: { x: 220, y: 150, size: 28, collected: false },
  };
  const boxFar = { x: 100, y: 150, width: 32, height: 32 };
  assert.equal(checkBobuxCollection(boxFar, pairWithBobux), false);

  const boxTouching = { x: 200, y: 150, width: 32, height: 32 };
  assert.equal(checkBobuxCollection(boxTouching, pairWithBobux), true);

  // Once collected, further checks return false
  pairWithBobux.bobux.collected = true;
  assert.equal(checkBobuxCollection(boxTouching, pairWithBobux), false);
});

test('Engine spawns bobux in obstacle pairs and emits collection events in stepRound', () => {
  // Use deterministic random returning 0.1 so bobux spawn chance (< 0.65) is triggered
  const round = createRound({ width: 844, height: 354, levelId: 1 }, () => 0.1);
  assert.equal(round.bobuxCount, 0);
  const targetPair = round.pairs.find(p => p.bobux);
  assert.ok(targetPair, 'Pairs after the first should spawn with bobux');
  assert.equal(targetPair.bobux.collected, false);

  round.status = 'PLAYING';
  round.player.x = targetPair.bobux.x;
  round.player.y = targetPair.bobux.y;
  stepRound(round, 0.016);

  assert.equal(targetPair.bobux.collected, true);
  assert.equal(round.bobuxCount, 1);
  const bobuxEvent = round.events.find(e => e.type === 'bobux');
  assert.ok(bobuxEvent, 'Engine should emit bobux event');
  assert.equal(bobuxEvent.count, 1);
});
