import assert from 'node:assert/strict';
import test from 'node:test';
import {
  checkCollision,
  checkPairScored,
  getObstaclePairBoxes,
  getPlayerHitbox,
  intersects,
  playerHitsPair,
} from '../src/game/collision.js';
import { ACADEMIC_INFO, GAME } from '../src/game/constants.js';
import {
  computeRandomGapY,
  createInitialObstacles,
  updateAndRecycleObstacles,
} from '../src/game/createObstacle.js';
import { getPhaseConfig, getPhaseKey } from '../src/game/phase.js';

test('Mandatory academic disclaimer and student metadata are exact (AC-009..AC-012)', () => {
  assert.equal(ACADEMIC_INFO.studentName, 'Wellington Siqueira Porto');
  assert.ok(ACADEMIC_INFO.institution.includes('FATEC'));
  assert.equal(
    ACADEMIC_INFO.course,
    'Desenvolvimento de Software Multiplataforma'
  );
  assert.equal(
    ACADEMIC_INFO.mandatoryDisclaimer,
    'Este site é um projeto acadêmico da FATEC, criado apenas para fins de estudo. Não utilize as informações aqui para uso real.'
  );
});

test('AABB intersection helper detects overlap and separation accurately', () => {
  const boxA = { x: 50, y: 100, width: 40, height: 40 };
  const overlapping = { x: 70, y: 110, width: 40, height: 40 };
  const disjointRight = { x: 95, y: 100, width: 40, height: 40 };
  const touchingEdge = { x: 90, y: 100, width: 40, height: 40 };

  assert.equal(intersects(boxA, overlapping), true);
  assert.equal(intersects(boxA, disjointRight), false);
  assert.equal(intersects(boxA, touchingEdge), false);
});

test('Collision detects top branch, bottom branch, ceiling, ground, and safe corridor (AC-108..AC-110)', () => {
  const playableHeight = 600;
  const pair = {
    id: 'p1',
    x: 90,
    width: 68,
    gapY: 200,
    gapSize: 170,
    scored: false,
  };

  // Safe passage inside gap (gap is 200..370)
  const safePlayer = getPlayerHitbox(95, 250, GAME.playerSize);
  assert.deepEqual(checkCollision(safePlayer, [pair], playableHeight), {
    collided: false,
    reason: null,
  });

  // Top branch hit
  const topHitPlayer = getPlayerHitbox(95, 165, GAME.playerSize);
  assert.deepEqual(checkCollision(topHitPlayer, [pair], playableHeight), {
    collided: true,
    reason: 'topBranch',
  });
  assert.equal(playerHitsPair(topHitPlayer, pair, playableHeight), true);

  // Bottom branch hit
  const bottomHitPlayer = getPlayerHitbox(95, 345, GAME.playerSize);
  assert.deepEqual(checkCollision(bottomHitPlayer, [pair], playableHeight), {
    collided: true,
    reason: 'bottomBranch',
  });

  // Ceiling hit
  const ceilingPlayer = getPlayerHitbox(95, -8, GAME.playerSize);
  assert.deepEqual(checkCollision(ceilingPlayer, [pair], playableHeight), {
    collided: true,
    reason: 'ceiling',
  });

  // Ground hit
  const groundPlayer = getPlayerHitbox(95, playableHeight - 20, GAME.playerSize);
  assert.deepEqual(checkCollision(groundPlayer, [pair], playableHeight), {
    collided: true,
    reason: 'ground',
  });
});

test('Scoring increments once per crossed pair and never before crossing (AC-112, AC-113)', () => {
  const pair = {
    id: 'p1',
    x: 100,
    width: 68,
    gapY: 200,
    gapSize: 170,
    scored: false,
  };

  // Before crossing right edge (168)
  assert.equal(checkPairScored(120, pair), false);
  assert.equal(checkPairScored(168, pair), false);

  // Just crossed right edge
  assert.equal(checkPairScored(169, pair), true);
  pair.scored = true;

  // Subsequent frames do not score again
  assert.equal(checkPairScored(185, pair), false);
});

test('Obstacle generation and recycling stay within valid bounds (AC-105..AC-107)', () => {
  const playableHeight = 600;
  for (let r = 0; r <= 1; r += 0.1) {
    const gapY = computeRandomGapY(playableHeight, GAME.gapSize, () => r);
    assert.ok(gapY >= GAME.topClearance);
    assert.ok(gapY <= playableHeight - GAME.bottomClearance - GAME.gapSize);
  }

  const initial = createInitialObstacles(360, playableHeight, 3, 260, () => 0.5);
  assert.equal(initial.length, 3);
  assert.ok(initial[0].x < initial[1].x && initial[1].x < initial[2].x);

  // Move first obstacle past left edge (nextX + width < -24) so it recycles to the right of the last obstacle
  initial[0].x = -85;
  initial[0].scored = true;
  const updated = updateAndRecycleObstacles(
    initial,
    0.1,
    playableHeight,
    150,
    260,
    () => 0.25
  );

  assert.equal(updated[0].scored, false);
  assert.ok(updated[0].x > updated[2].x);
});

test('Phase progression maps score thresholds accurately (Section 9.1)', () => {
  assert.equal(getPhaseKey(0), 'firstBloom');
  assert.equal(getPhaseKey(9), 'firstBloom');
  assert.equal(getPhaseKey(10), 'sakuraGarden');
  assert.equal(getPhaseKey(19), 'sakuraGarden');
  assert.equal(getPhaseKey(20), 'goldenBloom');
  assert.equal(getPhaseKey(29), 'goldenBloom');
  assert.equal(getPhaseKey(30), 'yozakura');
  assert.equal(getPhaseKey(75), 'yozakura');

  assert.equal(getPhaseConfig(30).label, 'YOZAKURA');
});

test('Landscape gaps fit short game fields and remain playable when recycled', () => {
  for (const height of [284, 324, 354, 444]) {
    for (const random of [0, 0.5, 1]) {
      const gapY = computeRandomGapY(height, GAME.gapSize, () => random);
      assert.ok(gapY >= 0);
      assert.ok(gapY + GAME.gapSize <= height);
      const pairs = createInitialObstacles(844, height, 3, 260, () => random);
      pairs[0].x = -100;
      const recycled = updateAndRecycleObstacles(pairs, 0.016, height, 155, 260, () => random);
      assert.ok(recycled.every(pair => pair.gapY >= 0 && pair.gapY + pair.gapSize <= height));
      assert.equal(checkCollision(getPlayerHitbox(220, gapY + (GAME.gapSize - GAME.playerSize) / 2), [{ ...pairs[1], x: 220 }], height).collided, false);
    }
  }
});
