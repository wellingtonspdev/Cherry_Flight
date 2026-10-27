import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
const engine = await import('../src/game/engineV2.js').catch(() => null);

test('V2 round starts only on input, then integrates jump and gravity', () => {
  assert.ok(engine, 'V2 simulation must exist');
  const r = engine.createRound({ width: 844, height: 354, levelId: 1 }, () => 0.5);
  assert.equal(r.status, 'READY');
  assert.equal(r.pairs.length, 4);
  assert.equal(r.future.length, 3);
  assert.ok(r.future.every(p => p.worldX - r.distance > r.width));
  const y = r.player.y;
  engine.jumpRound(r);
  assert.equal(r.status, 'PLAYING');
  assert.equal(r.player.velocity, -390);
  engine.stepRound(r, 0.016);
  assert.ok(r.player.y < y);
  for (let i = 0; i < 25; i++) engine.stepRound(r, 0.02);
  assert.ok(r.player.velocity > 0);
});

test('V2 dt integration is stable and rejects invalid elapsed time', () => {
  assert.ok(engine);
  const a = engine.createRound({ width: 844, height: 354, levelId: 1 }, () => 0.5);
  const b = engine.createRound({ width: 844, height: 354, levelId: 1 }, () => 0.5);
  engine.jumpRound(a); engine.jumpRound(b);
  for (let i = 0; i < 12; i++) engine.stepRound(a, 1 / 60);
  for (let i = 0; i < 6; i++) engine.stepRound(b, 1 / 30);
  assert.ok(Math.abs(a.player.y - b.player.y) < 0.01);
  const before = a.player.y;
  engine.stepRound(a, NaN); engine.stepRound(a, -1);
  assert.equal(a.player.y, before);
});

test('V2 collision wins before scoring and terminal states cannot advance', () => {
  assert.ok(engine);
  for (const boundary of ['ceiling', 'ground', 'topBranch', 'bottomBranch']) {
    const r = engine.createRound({ width: 844, height: 354, levelId: 1 }, () => 0.5);
    engine.jumpRound(r);
    const p = r.pairs[0];
    p.worldX = r.player.x; p.x = r.player.x;
    r.player.y = boundary === 'ceiling' ? -50 : boundary === 'ground' ? 350 : boundary === 'topBranch' ? p.gapY - 30 : p.gapY + p.gapSize - 15;
    r.player.velocity = 0;
    engine.stepRound(r, 0.001);
    assert.equal(r.status, 'GAME_OVER', boundary);
    assert.equal(r.collision, boundary);
    assert.equal(r.score, 0);
    const end = { y: r.player.y, elapsed: r.elapsed, distance: r.distance };
    engine.jumpRound(r); engine.stepRound(r, 0.05);
    assert.deepEqual({ y: r.player.y, elapsed: r.elapsed, distance: r.distance }, end);
  }
});

test('V2 score is once per pair and completion fires once at the configured target', () => {
  assert.ok(engine);
  const r = engine.createRound({ width: 844, height: 354, levelId: 1 }, () => 0.5);
  engine.jumpRound(r);
  const p = r.pairs[0]; p.worldX = r.player.x - p.width - 1; p.x = p.worldX;
  r.player.y = p.gapY + 30; r.player.velocity = 0;
  engine.stepRound(r, 0.001); assert.equal(r.score, 1);
  engine.stepRound(r, 0.001); assert.equal(r.score, 1);
  r.score = 7; p.scored = false;
  engine.stepRound(r, 0.001);
  assert.equal(r.score, 8); assert.equal(r.status, 'LEVEL_COMPLETE');
  assert.equal(r.events.filter(e => e.type === 'complete').length, 1);
  engine.stepRound(r, 0.001);
  assert.equal(r.events.length, 0);
});

test('V2 pool reuses mounted slot identities and has three constrained future descriptors', () => {
  assert.ok(engine);
  for (let levelId = 1; levelId <= 12; levelId++) {
    for (const height of [284, 354, 732]) {
      let direction = false;
      const random = () => { direction = !direction; return direction ? 0 : 1; };
      const r = engine.createRound({ width: 844, height, levelId }, random);
      const references = [...r.pairs];
      for (let i = 0; i < 1200; i++) {
        engine.advancePairs(r, 0.02, random);
        assert.equal(r.future.length, 3);
        assert.equal(r.pairs.length, levelId >= 7 ? 5 : 4);
        assert.ok(r.pairs.every((p, index) => p === references[index]));
        for (const p of r.future) {
          assert.ok(p.gapY >= r.params.topMargin - 0.001);
          assert.ok(p.gapY + p.gapSize <= height - r.params.bottomMargin + 0.001);
          assert.ok(Math.abs(p.center - p.previousCenter) <= r.params.maxDelta + 0.001);
          assert.ok(p.worldX - r.distance > r.width);
        }
      }
    }
  }
});

test('V2 preserves the supplied configuration and resolves bounded Endless difficulty', async () => {
  assert.ok(engine);
  const { LEVEL_CONFIG } = await import('../src/game/levelConfigV2.js');
  assert.deepEqual(LEVEL_CONFIG, JSON.parse(fs.readFileSync(new URL('../docs/LEVEL_CONFIG_V2.json', import.meta.url), 'utf8')));
  const a = engine.createRound({ width: 844, height: 354, levelId: 10, endless: true }, () => 0.5);
  const b = engine.resolveDifficulty(10, 844, 354, 500, true);
  assert.ok(b.speed > a.params.speed);
  assert.ok(b.speed <= 844 * LEVEL_CONFIG.endless.maxSpeedWidthPerSecond);
  assert.ok(b.gapSize >= 354 * LEVEL_CONFIG.endless.minGapRatio);
});


test('Every level starts with a centered, predictable first opening', () => {
  for (let levelId = 1; levelId <= 12; levelId++) for (const sample of [0, 0.5, 1]) {
    const round = engine.createRound({ width: 844, height: 354, levelId }, () => sample);
    assert.equal(round.pairs[0].center, 177);
  }
});


test('Obstacle compositions do not repeat consecutively even with repeated random samples', () => {
  const round = engine.createRound({ width: 844, height: 354, levelId: 1 }, () => 0);
  const pairs = [...round.pairs, ...round.future];
  for (let i = 1; i < pairs.length; i++) assert.notEqual(pairs[i].variant, pairs[i - 1].variant);
});
