import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRound, jumpRound, stepRound, LEVELS } from '../../src/game/engineV2.js';
import { shouldJump } from './campaign-controller.mjs';
let seed = 20261027;
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
const results = [];
for (const level of LEVELS) {
 for (let attempt = 1; attempt <= 5; attempt++) {
  const round = createRound({ width: 844, height: 354, levelId: level.id }, random);
  jumpRound(round); let inputs = 1;
  for (let frame = 0; frame < 7200 && round.status === 'PLAYING'; frame++) {
    if (shouldJump(round)) { jumpRound(round); inputs++; }
    stepRound(round, 1 / 60, random);
  }
  results.push({ attempt, level: level.id, status: round.status, score: round.score, elapsed: round.elapsed, inputs, collision: round.collision });
  console.log(JSON.stringify(results.at(-1)));
  if (round.status === 'LEVEL_COMPLETE') { assert.equal(round.score, level.targetScore); break; }
  assert.ok(attempt < 5, 'Controller failed to complete this level within five independent layouts');
 }
}
fs.writeFileSync('audit-evidence/v2/campaign-simulation.json', JSON.stringify({ evidence: 'Pure actual engine driven by input decisions; separate from browser/device proof.', results }, null, 2));
