import test from 'node:test';
import assert from 'node:assert/strict';
const p = await import('../src/game/progressionV2.js').catch(() => null);
const storage = await import('../src/game/saveServiceV2.js').catch(() => null);

test('Campaign unlocks exactly one next checkpoint and rejects locked or unfinished completion', () => {
  assert.ok(p);
  let data = p.createProgress();
  assert.equal(p.isUnlocked(data, 1), true); assert.equal(p.isUnlocked(data, 2), false);
  assert.deepEqual(p.completeLevel(data, 2, 999), data);
  assert.deepEqual(p.completeLevel(data, 1, 7), data);
  data = p.completeLevel(data, 1, 8);
  assert.equal(data.highestUnlockedLevel, 2); assert.equal(p.continueLevel(data), 2);
  assert.equal(p.isUnlocked(data, 3), false);
  assert.deepEqual(p.completeLevel(data, 1, 8), data);
  assert.equal(p.startLevel(data, 3), null);
  data = p.startLevel(data, 1); assert.equal(p.continueLevel(data), 1);
});

test('All twelve configured completions unlock Endless and retain per-level best scores', async () => {
  assert.ok(p);
  const { LEVEL_CONFIG } = await import('../src/game/levelConfigV2.js');
  let data = p.createProgress();
  for (const level of LEVEL_CONFIG.levels) {
    data = p.completeLevel(data, level.id, level.targetScore);
    assert.equal(data.lastCompletedLevel, level.id);
    assert.equal(data.endlessUnlocked, level.id === 12);
  }
  assert.equal(data.highestUnlockedLevel, 12);
  assert.equal(Object.values(data.levelResults).filter(v => v.completed).length, 12);
  data = p.recordAttempt(data, 12, 3); assert.equal(data.levelResults[12].bestScore, 22);
  data = p.recordAttempt(data, 'endless', 47); assert.equal(data.levelResults.endless.bestScore, 47);
});

test('Malformed saves cannot unlock levels and only known schema fields survive', () => {
  assert.ok(p);
  const result = p.sanitizeProgress({ schemaVersion: 2, highestUnlockedLevel: 12, lastPlayedLevel: 90, endlessUnlocked: true, playerY: 10, velocity: -30, levelResults: { 12: { bestScore: 1000, completed: true } }, settings: { music: false, sfx: 'false', haptics: false } });
  assert.equal(result.highestUnlockedLevel, 1); assert.equal(result.lastPlayedLevel, 1);
  assert.equal(result.endlessUnlocked, false); assert.equal(result.settings.music, false);
  assert.equal(result.settings.sfx, true); assert.equal('playerY' in result, false);
  assert.equal('velocity' in result, false);
  assert.deepEqual(p.sanitizeProgress({ schemaVersion: 99 }), p.createProgress());
});

test('Queued storage writes preserve the latest settings and restore checkpoint after reopening', async () => {
  assert.ok(p); assert.ok(storage);
  const map = new Map();
  const backend = { getItem: async key => map.get(key) || null, setItem: async (key, value) => { await new Promise(r => setTimeout(r, 5)); map.set(key, value); } };
  const service = storage.createSaveService(backend);
  let data = p.completeLevel(p.createProgress(), 1, 8);
  const first = service.save(data);
  data = { ...data, settings: { ...data.settings, music: false } };
  await Promise.all([first, service.save(data)]);
  const restored = await storage.createSaveService(backend).load();
  assert.equal(p.continueLevel(restored.data), 2); assert.equal(restored.data.settings.music, false);
  const serialized = map.get(storage.SAVE_KEY);
  assert.ok(!serialized.includes('velocity') && !serialized.includes('worldX'));
  assert.equal(restored.exists, true);
});

test('Corrupt and oversized storage fall back, legacy best is preserved, and write failures recover', async () => {
  assert.ok(p); assert.ok(storage);
  const map = new Map([[storage.SAVE_KEY, '{bad-json'], ['@cherry_bloom_best_score_v1', '31']]);
  let fail = true;
  const backend = { getItem: async key => map.get(key) || null, setItem: async (key, value) => { if (fail) throw new Error('quota'); map.set(key, value); } };
  const service = storage.createSaveService(backend);
  const restored = await service.load();
  assert.equal(restored.data.highestUnlockedLevel, 1); assert.equal(restored.data.levelResults.legacy.bestScore, 31);
  await assert.rejects(service.save(restored.data), /quota/);
  fail = false; await service.save(restored.data);
  assert.equal((await service.load()).data.levelResults.legacy.bestScore, 31);
  map.set(storage.SAVE_KEY, 'x'.repeat(100000));
  assert.equal((await service.load()).data.highestUnlockedLevel, 1);
});
