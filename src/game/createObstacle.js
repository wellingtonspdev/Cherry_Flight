// Cherry Bloom — Obstacle Generation & Recycling
// Source of Truth: CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md (Section 8.2, 8.3)

import { GAME } from './constants.js';

const VARIANTS = ['lightBlossom', 'leafyBranch', 'oldBark', 'nightBranch'];

/**
 * Computes a valid vertical gap Y coordinate within safe playable bounds.
 */
export function computeRandomGapY(playableHeight, gapSize = GAME.gapSize, randomFn = Math.random) {
  const minY = GAME.topClearance;
  const maxY = Math.max(minY + 20, playableHeight - GAME.bottomClearance - gapSize);
  const range = Math.max(1, maxY - minY);
  return Math.round(minY + randomFn() * range);
}

/**
 * Creates a single obstacle pair object.
 */
export function createObstaclePair({
  id,
  x,
  playableHeight,
  gapSize = GAME.gapSize,
  width = GAME.obstacleWidth,
  variantIndex = 0,
  randomFn = Math.random,
}) {
  return {
    id,
    x,
    width,
    gapY: computeRandomGapY(playableHeight, gapSize, randomFn),
    gapSize,
    scored: false,
    variant: VARIANTS[variantIndex % VARIANTS.length],
  };
}

/**
 * Creates the initial pool of obstacle pairs spaced evenly to the right of the screen.
 */
export function createInitialObstacles(
  screenWidth,
  playableHeight,
  count = GAME.obstacleCount,
  spacing = GAME.obstacleSpacing,
  randomFn = Math.random
) {
  const startOffset = Math.max(screenWidth * 1.15, 340);
  const pairs = [];
  for (let i = 0; i < count; i += 1) {
    pairs.push(
      createObstaclePair({
        id: `branch-pair-${i}`,
        x: startOffset + i * spacing,
        playableHeight,
        variantIndex: i,
        randomFn,
      })
    );
  }
  return pairs;
}

/**
 * Advances obstacles horizontally by dt and recycles pairs that leave the left edge.
 */
export function updateAndRecycleObstacles(
  obstaclePairs,
  dt,
   playableHeight,
  speed = GAME.obstacleSpeed,
  spacing = GAME.obstacleSpacing,
  randomFn = Math.random
) {
  const dx = speed * dt;
  let rightmostX = 0;

  for (let i = 0; i < obstaclePairs.length; i += 1) {
    const movedX = obstaclePairs[i].x - dx;
    if (movedX > rightmostX) {
      rightmostX = movedX;
    }
  }

  return obstaclePairs.map((pair, idx) => {
    const nextX = pair.x - dx;
    if (nextX + pair.width < -24) {
      const recycledX = Math.max(rightmostX + spacing, 320);
      rightmostX = recycledX;
      return {
        ...pair,
        x: recycledX,
        gapY: computeRandomGapY(playableHeight, pair.gapSize, randomFn),
        scored: false,
        variant: VARIANTS[(idx + Math.floor(randomFn() * VARIANTS.length)) % VARIANTS.length],
      };
    }
    return {
      ...pair,
      x: nextX,
    };
  });
}
