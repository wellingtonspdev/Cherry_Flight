import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
const ids = await import('../src/game/vectorIdsV2.js').catch(() => null);

test('V2 SVG gradient IDs are unique per mounted instance, including hidden screens', () => {
  assert.ok(ids, 'SVG instance scoping must exist');
  const original = { props: {}, children: [React.createElement('linearGradient', { id: 'wood' }), React.createElement('path', { fill: 'url(#wood)', d: 'M0 0L10 10' })] };
  const a = ids.scopeVectorIds(original, 'home');
  const b = ids.scopeVectorIds(original, 'game');
  assert.equal(a.children[0].props.id, 'wood_home');
  assert.equal(a.children[1].props.fill, 'url(#wood_home)');
  assert.equal(b.children[0].props.id, 'wood_game');
  assert.equal(b.children[1].props.fill, 'url(#wood_game)');
  assert.equal(original.children[0].props.id, 'wood');
});
