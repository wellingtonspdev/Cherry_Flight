import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SKINS, DEFAULT_SKIN } from '../src/game/skinsV2.js';
import {
  createProgress,
  addBobux,
  unlockSkin,
  equipSkin,
} from '../src/game/progressionV2.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Skin catalog and shop transactions work end-to-end', () => {
  let p = createProgress();
  assert.equal(p.bobux, 0);
  assert.equal(p.equippedSkin, DEFAULT_SKIN);
  assert.deepEqual(p.unlockedSkins, [DEFAULT_SKIN]);

  // Earn bobux
  p = addBobux(p, 45);
  assert.equal(p.bobux, 45);

  // Try to buy golden (50 bobux) - should fail
  const failedBuy = unlockSkin(p, 'golden');
  assert.equal(failedBuy.success, false);
  assert.equal(p.bobux, 45);
  assert.equal(p.equippedSkin, DEFAULT_SKIN);

  // Buy sakura (15 bobux) - should succeed, deduct balance, and equip
  const buySakura = unlockSkin(p, 'sakura');
  assert.equal(buySakura.success, true);
  p = buySakura.data;
  assert.equal(p.bobux, 30);
  assert.equal(p.equippedSkin, 'sakura');
  assert.ok(p.unlockedSkins.includes('sakura'));

  // Buy noob (30 bobux) - should succeed and leave 0
  const buyNoob = unlockSkin(p, 'noob');
  assert.equal(buyNoob.success, true);
  p = buyNoob.data;
  assert.equal(p.bobux, 0);
  assert.equal(p.equippedSkin, 'noob');

  // Switch back to classic
  p = equipSkin(p, 'classic');
  assert.equal(p.equippedSkin, 'classic');

  // Try to equip locked skin (yozakura)
  const unchanged = equipSkin(p, 'yozakura');
  assert.equal(unchanged.equippedSkin, 'classic');
});

test('SkinShop component correctly checks unlock success boolean', () => {
  const shopSource = fs.readFileSync(path.join(rootDir, 'src', 'components', 'SkinShopV2.js'), 'utf8');
  assert.ok(
    shopSource.includes('success === true || success?.success'),
    'SkinShopV2 must accept both boolean and object success contracts'
  );
});

test('App navigation and screens register SkinShop', () => {
  const appContent = fs.readFileSync(path.join(rootDir, 'App.js'), 'utf8');
  assert.ok(appContent.includes('name="SkinShop"'), 'App.js must register SkinShop screen');
  assert.ok(appContent.includes('SkinShopV2'), 'App.js must import SkinShopV2');

  const tela1Content = fs.readFileSync(path.join(rootDir, 'src', 'tela1.js'), 'utf8');
  assert.ok(tela1Content.includes("navigate('SkinShop')"), 'Tela1 must have SkinShop navigation trigger');

  const gameFieldContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'GameFieldV2.js'), 'utf8');
  assert.ok(gameFieldContent.includes("navigate('SkinShop')"), 'GameFieldV2 must allow navigating to SkinShop from game result');
});
