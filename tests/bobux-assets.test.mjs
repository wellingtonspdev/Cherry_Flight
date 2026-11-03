import test from 'node:test';
import assert from 'node:assert/strict';
import { SKINS, DEFAULT_SKIN } from '../src/game/skinsV2.js';
import { VECTORS } from '../src/game/vectorDataV2.js';

test('BOBUX coin and all catalog skin poses are compiled into vector registry', () => {
  assert.equal(DEFAULT_SKIN, 'classic');
  assert.ok(VECTORS['collectibles/bobux_coin'], 'BOBUX coin SVG must exist in vector data');
  const skinIds = Object.keys(SKINS);
  assert.deepEqual(skinIds, ['classic', 'sakura', 'noob', 'golden', 'yozakura']);
  for (const id of skinIds) {
    for (const pose of ['idle', 'jump', 'fall', 'hit']) {
      const key = `characters/${id}_${pose}`;
      assert.ok(VECTORS[key], `Vector key ${key} must exist in compiled vectors`);
    }
  }
});
