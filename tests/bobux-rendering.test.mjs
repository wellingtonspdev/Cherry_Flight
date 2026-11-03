import test from 'node:test';
import assert from 'node:assert/strict';
import { createVectorCache } from '../src/game/vectorCacheV2.js';

test('preload ensures bobux collectible and all character skins are cached before play', () => {
  const cache = createVectorCache(xml => ({ parsed: true, xml }));
  cache.preload('first_bloom', 844, 390);

  // Collectibles must be preloaded
  assert.equal(cache.stats.parsesDuringPlay, 0);
  cache.setPlaying(true);

  const coin = cache.get('collectibles/bobux_coin');
  assert.ok(coin);
  assert.equal(cache.stats.parsesDuringPlay, 0, 'BOBUX coin must not parse during gameplay');

  const sakuraJump = cache.get('characters/sakura_jump');
  assert.ok(sakuraJump);
  assert.equal(cache.stats.parsesDuringPlay, 0, 'Skins must not parse during gameplay');
});
