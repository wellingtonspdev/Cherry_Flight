import { GAME } from './constants.js';
import { checkCollision, checkPairScored, getPlayerHitbox } from './collision.js';
import { LEVEL_CONFIG } from './levelConfigV2.js';

export const CHAPTERS = LEVEL_CONFIG.chapters;
export const LEVELS = LEVEL_CONFIG.levels;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function resolveDifficulty(levelId, width, height, score = 0, endless = false) {
  const level = LEVELS.find(l => l.id === Number(levelId));
  if (!level) throw new RangeError('Unknown campaign level');
  const ramp = endless ? clamp(Math.floor(score / LEVEL_CONFIG.endless.difficultyRampEveryScore) / 10, 0, 1) : 0;
  const speedRatio = level.difficulty.speedWidthPerSecond + ramp * (LEVEL_CONFIG.endless.maxSpeedWidthPerSecond - level.difficulty.speedWidthPerSecond);
  const gapRatio = level.difficulty.gapRatio + ramp * (LEVEL_CONFIG.endless.minGapRatio - level.difficulty.gapRatio);
  const speed = width * speedRatio;
  const topMargin = height * level.difficulty.minTopMarginRatio;
  const bottomMargin = height * level.difficulty.minBottomMarginRatio;
  const hitboxSize = GAME.playerSize - GAME.playerHitboxInset * 2;
  // A narrow field must still fit a trajectory through the obstacle during its crossing time.
  const halfCrossingTime = (GAME.obstacleWidth + hitboxSize) / speed / 2;
  const physicalGap = hitboxSize + GAME.gravity * halfCrossingTime ** 2 / 2 + 4;
  const available = height - topMargin - bottomMargin;
  if (available < physicalGap) throw new RangeError('Game field is too small for safe obstacle geometry');
  const gapSize = Math.min(available, Math.max(height * gapRatio, physicalGap));
  const jumpRise = GAME.jumpVelocity ** 2 / (2 * GAME.gravity);
  return {
    gapSize, speed, spacing: width * level.difficulty.spacingWidthRatio,
    maxDelta: Math.min(height * level.difficulty.maxGapCenterDeltaRatio, jumpRise * 0.8),
    topMargin, bottomMargin, width: GAME.obstacleWidth,
    poolSize: level.obstaclePoolSize, prewarmPairs: level.prewarmPairs,
    targetScore: endless ? Infinity : level.targetScore,
  };
}

export function recordRoundMetric(round, type, detail = {}) {
  const event = { type, at: Date.now(), ...detail };
  if (round.metrics.length >= 256) round.metrics.shift();
  round.metrics.push(event);
  return event;
}

function prepareFuture(round, random) {
  const p = round.params;
  const centerMin = p.topMargin + p.gapSize / 2;
  const centerMax = round.height - p.bottomMargin - p.gapSize / 2;
  const previousCenter = round.lastCenter;
  const min = Math.max(centerMin, previousCenter - p.maxDelta);
  const max = Math.min(centerMax, previousCenter + p.maxDelta);
  const center = clamp(min + clamp(random(), 0, 1) * Math.max(0, max - min), centerMin, centerMax);
  round.lastCenter = center;
  const pair = {
    worldX: round.nextWorldX, x: round.nextWorldX - round.distance,
    center, previousCenter, gapY: center - p.gapSize / 2, gapSize: p.gapSize,
    width: p.width, variant: Math.floor(clamp(random(), 0, 0.999999) * 6),
    biome: round.biome, scored: false, visible: false, preparedAt: Date.now(),
  };
  round.nextWorldX += p.spacing;
  recordRoundMetric(round, 'pair_prepared', { worldX: pair.worldX, biome: pair.biome });
  return pair;
}

export function createRound({ width, height, levelId = 1, endless = false }, random = Math.random) {
  if (!(Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0)) throw new RangeError('Invalid game dimensions');
  if (endless) levelId = LEVEL_CONFIG.endless.startDifficultyFromLevel;
  const level = LEVELS.find(l => l.id === Number(levelId));
  const params = resolveDifficulty(levelId, width, height, 0, endless);
  const round = {
    width, height, levelId: level.id, endless, biome: level.assetKit, params,
    status: 'READY', score: 0, elapsed: 0, distance: 0, collision: null,
    player: { x: Math.round(width * GAME.playerXRatio), y: height * 0.5 - GAME.playerSize / 2, velocity: 0 },
    pairs: [], future: [], events: [], metrics: [],
    lastCenter: height / 2, nextWorldX: width * 0.72, ramp: 0,
  };
  for (let i = 0; i < params.poolSize; i++) round.pairs.push({ ...prepareFuture(round, random), id: `pair-${i}`, epoch: 0 });
  for (let i = 0; i < params.prewarmPairs; i++) round.future.push(prepareFuture(round, random));
  return round;
}

export function jumpRound(round) {
  if (round.status !== 'READY' && round.status !== 'PLAYING') return false;
  round.status = 'PLAYING';
  round.player.velocity = GAME.jumpVelocity;
  return true;
}

export function advancePairs(round, dt, random = Math.random) {
  round.distance += round.params.speed * dt;
  for (const pair of round.pairs) {
    pair.x = pair.worldX - round.distance;
    if (pair.x + pair.width < -24) {
      const id = pair.id, epoch = pair.epoch + 1;
      Object.assign(pair, round.future.shift(), { id, epoch });
      pair.x = pair.worldX - round.distance;
      round.future.push(prepareFuture(round, random));
      round.events.push({ type: 'recycle', pair });
    }
    if (!pair.visible && pair.x < round.width) {
      pair.visible = true;
      recordRoundMetric(round, 'pair_visible', { id: pair.id, epoch: pair.epoch, preparedAt: pair.preparedAt });
    }
  }
}

export function stepRound(round, rawDt, random = Math.random) {
  round.events.length = 0;
  if (round.status !== 'PLAYING' || !Number.isFinite(rawDt) || rawDt <= 0) return round;
  const dt = Math.min(rawDt, GAME.maxDeltaTime);
  round.elapsed += dt;
  const oldVelocity = round.player.velocity;
  round.player.velocity = Math.min(oldVelocity + GAME.gravity * dt, GAME.maxFallVelocity);
  round.player.y += (oldVelocity + round.player.velocity) / 2 * dt;
  advancePairs(round, dt, random);
  const box = getPlayerHitbox(round.player.x, round.player.y);
  const collision = checkCollision(box, round.pairs, round.height);
  if (collision.collided) {
    round.status = 'GAME_OVER'; round.collision = collision.reason;
    round.events.push({ type: 'collision', reason: collision.reason });
    return round;
  }
  for (const pair of round.pairs) {
    if (checkPairScored(box.x, pair)) {
      pair.scored = true; round.score++;
      round.events.push({ type: 'score', score: round.score });
    }
  }
  if (round.score >= round.params.targetScore) {
    round.status = 'LEVEL_COMPLETE';
    round.events.push({ type: 'complete', levelId: round.levelId, score: round.score });
  } else if (round.endless) {
    const ramp = Math.floor(round.score / LEVEL_CONFIG.endless.difficultyRampEveryScore);
    if (ramp !== round.ramp) {
      round.ramp = ramp;
      round.params = resolveDifficulty(round.levelId, round.width, round.height, round.score, true);
      const start = CHAPTERS.findIndex(c => c.id === LEVELS[round.levelId - 1].chapter);
      round.biome = CHAPTERS[(start + ramp) % CHAPTERS.length].id;
      const last = round.pairs.reduce((a, b) => a.worldX > b.worldX ? a : b);
      round.lastCenter = last.center;
      round.nextWorldX = last.worldX + round.params.spacing;
      round.future.length = 0;
      for (let i = 0; i < round.params.prewarmPairs; i++) round.future.push(prepareFuture(round, random));
      round.events.push({ type: 'biome', biome: round.biome });
    }
  }
  return round;
}
