import test from 'node:test';
import assert from 'node:assert/strict';
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
