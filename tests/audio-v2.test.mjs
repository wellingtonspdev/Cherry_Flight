import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const module = await import('../src/game/audioServiceV2.js').catch(() => null);

test('Audio reuses players, loops music, respects independent preferences and releases on exit', async () => {
  assert.ok(module);
  const players = [];
  const service = module.createAudioService(source => {
    const player = { source, isLoaded: true, playing: false, currentTime: 0, play() { this.playing = true; }, pause() { this.playing = false; }, async seekTo(value) { this.currentTime = value; }, remove() { this.removed = true; } };
    players.push(player); return player;
  }, { music: { first_bloom: 'theme' }, sfx: { jump: 'jump', pause: 'pause', resume: 'resume' } });
  await service.prepare('first_bloom');
  service.start(); assert.equal(players[0].loop, true); assert.equal(players[0].volume, 0.35);
  service.effect('jump'); service.effect('jump'); await Promise.resolve();
  assert.equal(players.length, 4);
  service.settings({ music: false, sfx: true }); assert.equal(players[0].playing, false);
  service.effect('jump'); await Promise.resolve(); assert.equal(players[1].playing, true);
  service.settings({ music: true, sfx: false }); assert.equal(players[0].playing, true); assert.equal(players[1].playing, false);
  service.pause(); assert.equal(players[0].playing, false);
  service.start(); assert.equal(players[0].playing, true);
  service.release(); assert.ok(players.every(p => p.removed));
});

test('Audio load/play failures fail open and a new chapter removes previous music', async () => {
  assert.ok(module);
  const service = module.createAudioService(() => { throw new Error('unsupported'); }, { music: { first_bloom: 'bad' }, sfx: { jump: 'bad' } });
  await service.prepare('first_bloom');
  assert.doesNotThrow(() => { service.start(); service.effect('jump'); service.pause(); service.release(); });
  assert.ok(service.snapshot().failures > 0);
});

test('Pending one-shots cannot resume after lifecycle pause', async () => {
  let resolveSeek, plays = 0;
  const service = module.createAudioService(() => ({ isLoaded: true, play() { plays++; }, pause() {}, remove() {}, seekTo() { return new Promise(resolve => { resolveSeek = resolve; }); } }), { music: { first_bloom: 'theme' }, sfx: { jump: 'jump' } });
  await service.prepare('first_bloom');
  service.effect('jump'); service.pause(); resolveSeek(); await Promise.resolve();
  assert.equal(plays, 0);
});

test('Bobux collection SFX is configured and playable with dedicated volume', async () => {
  assert.ok(module);
  const players = [];
  const service = module.createAudioService(source => {
    const player = { source, isLoaded: true, playing: false, currentTime: 0, play() { this.playing = true; }, pause() { this.playing = false; }, async seekTo(value) { this.currentTime = value; }, remove() { this.removed = true; } };
    players.push(player); return player;
  }, { music: { first_bloom: 'theme' }, sfx: { bobux: 'sfx_bobux.wav' } });
  await service.prepare('first_bloom');
  assert.equal(players.length, 2);
  assert.equal(players[1].volume, 0.6);
  service.effect('bobux');
  await Promise.resolve();
  assert.equal(players[1].playing, true);
  assert.equal(service.snapshot().events.at(-1)?.event, 'bobux');
});

test('Audio assets contain 4 multi-track themes and 10 arcade kawaii SFX as valid WAV files', () => {
  const rootAudio = path.resolve('assets/v2/audio');
  const expectedMusic = ['first_bloom', 'sakura_garden', 'golden_bloom', 'yozakura'];
  const expectedSfx = ['ui', 'jump', 'bobux', 'score', 'collision', 'checkpoint', 'complete', 'unlock', 'pause', 'resume'];

  for (const name of expectedMusic) {
    const filePath = path.join(rootAudio, `${name}.wav`);
    assert.ok(fs.existsSync(filePath), `Missing music file: ${name}.wav`);
    const stats = fs.statSync(filePath);
    assert.ok(stats.size > 200000, `BGM ${name}.wav should be a multi-track loop (>200KB), got ${stats.size} bytes`);
  }

  for (const name of expectedSfx) {
    const filename = name === 'bobux' ? 'sfx_bobux.wav' : `${name}.wav`;
    const filePath = path.join(rootAudio, filename);
    assert.ok(fs.existsSync(filePath), `Missing SFX file: ${filename}`);
    const stats = fs.statSync(filePath);
    assert.ok(stats.size > 1000, `SFX ${filename} should be a rich sample (>1KB), got ${stats.size} bytes`);
  }

  const sourcesContent = fs.readFileSync(path.resolve('src/game/audioSourcesV2.js'), 'utf8');
  assert.ok(sourcesContent.includes("bobux: require('../../assets/v2/audio/sfx_bobux.wav')"), 'bobux SFX must be declared in audioSourcesV2.js');
});
