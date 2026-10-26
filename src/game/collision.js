// Cherry Bloom — Pure AABB Collision & Scoring Logic
// Source of Truth: CHERRY_BLOOM_SPECIFICATION_AND_ACCEPTANCE.md (Section 8.5, 8.6, 8.7)

import { GAME } from './constants.js';

/**
 * Pure Axis-Aligned Bounding Box (AABB) intersection check.
 */
export function intersects(boxA, boxB) {
  if (!boxA || !boxB) return false;
  return (
    boxA.x < boxB.x + boxB.width &&
    boxA.x + boxA.width > boxB.x &&
    boxA.y < boxB.y + boxB.height &&
    boxA.y + boxA.height > boxB.y
  );
}

/**
 * Builds the logical collision box for Cherri, inset slightly from visual sprite
 * so decorative stem/leaf tips do not cause unfair hits (Spec 8.6).
 */
export function getPlayerHitbox(playerX, playerY, playerSize = GAME.playerSize, inset = GAME.playerHitboxInset) {
  return {
    x: playerX + inset,
    y: playerY + inset,
    width: Math.max(8, playerSize - inset * 2),
    height: Math.max(8, playerSize - inset * 2),
  };
}

/**
 * Builds top and bottom logical bounding boxes for an obstacle pair.
 * Visual blossoms/leaves on branches never enlarge these boxes (Spec 8.6).
 */
export function getObstaclePairBoxes(pair, playableHeight) {
  const trunkInsetX = 4;
  const width = Math.max(16, pair.width - trunkInsetX * 2);
  const x = pair.x + trunkInsetX;
  const topHeight = Math.max(0, pair.gapY);
  const bottomY = pair.gapY + pair.gapSize;
  const bottomHeight = Math.max(0, playableHeight - bottomY);

  return {
    topBox: {
      x,
      y: 0,
      width,
      height: topHeight,
    },
    bottomBox: {
      x,
      y: bottomY,
      width,
      height: bottomHeight,
    },
  };
}

/**
 * Checks if player collides with ceiling, ground, or any obstacle pair.
 * Returns { collided: boolean, reason: 'ceiling' | 'ground' | 'topBranch' | 'bottomBranch' | null }
 */
export function checkCollision(playerBox, obstaclePairs, playableHeight) {
  if (playerBox.y <= 0) {
    return { collided: true, reason: 'ceiling' };
  }
  if (playerBox.y + playerBox.height >= playableHeight) {
    return { collided: true, reason: 'ground' };
  }

  for (let i = 0; i < obstaclePairs.length; i += 1) {
    const pair = obstaclePairs[i];
    const { topBox, bottomBox } = getObstaclePairBoxes(pair, playableHeight);
    if (intersects(playerBox, topBox)) {
      return { collided: true, reason: 'topBranch' };
    }
    if (intersects(playerBox, bottomBox)) {
      return { collided: true, reason: 'bottomBranch' };
    }
  }

  return { collided: false, reason: null };
}

/**
 * Compatibility helper matching seed signature.
 */
export function playerHitsPair(playerBox, pair, gameHeight) {
  if (playerBox.y <= 0 || playerBox.y + playerBox.height >= gameHeight) return true;
  if (pair.topBox && pair.bottomBox) {
    return intersects(playerBox, pair.topBox) || intersects(playerBox, pair.bottomBox);
  }
  const { topBox, bottomBox } = getObstaclePairBoxes(pair, gameHeight);
  return intersects(playerBox, topBox) || intersects(playerBox, bottomBox);
}

/**
 * Checks if Cherri has safely crossed an obstacle pair to award +1 point once (Spec 8.7).
 */
export function checkPairScored(playerX, pair) {
  if (!pair || pair.scored) return false;
  const pairRightEdge = pair.x + pair.width;
  return playerX > pairRightEdge;
}
