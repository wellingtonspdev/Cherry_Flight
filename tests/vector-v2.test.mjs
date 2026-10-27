import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const cache = await import('../src/game/vectorCacheV2.js').catch(() => null);

test('V2 vectors are cached before visible use, with theme-scoped gradient IDs', async () => {
  assert.ok(cache, 'The vector preloader must exist');
  const { VECTORS } = await import('../src/game/vectorDataV2.js');
  assert.equal(Object.keys(VECTORS).length, 76);
  for (const [key, xml] of Object.entries(VECTORS)) assert.equal(xml, fs.readFileSync(new URL('../assets/v2/' + key + '.svg', import.meta.url), 'utf8').replace(/\r\n/g, '\n'));
  const registry = cache.createVectorCache(xml => ({ xml }));
  registry.preload('first_bloom', 844, 390);
  const parsed = registry.stats.parses;
  const a = registry.get('obstacles/first_bloom/trunk_body');
  assert.equal(a, registry.get('obstacles/first_bloom/trunk_body'));
  assert.equal(registry.stats.parses, parsed);
  assert.ok(a.ast.xml.includes('first_bloom_trunk_body_wood'));
  assert.ok(a.ast.xml.includes('url(#obstacles_first_bloom_trunk_body_wood)'));
  const sky = registry.get('backgrounds/first_bloom/background_base', 844, 390, 'sky').ast.xml;
  assert.ok(!sky.includes('<path'));
  assert.ok(sky.includes('<ellipse'));
  const ratio = 1080 * 390 / (1920 * 844);
  assert.ok(sky.includes(`rx="${110 * ratio}"`));
  registry.setPlaying(true);
  registry.preload('first_bloom', 844, 390);
  assert.equal(registry.stats.parsesDuringPlay, 0);
});
