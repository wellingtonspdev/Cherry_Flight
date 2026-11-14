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

test('Audio assets contain 12 unique extended level themes and 10 arcade kawaii SFX as valid WAV files', async () => {
  const rootAudio = path.resolve('assets/v2/audio');
  const expectedMusic = [
    'first_bloom', 'ye_flashing_lights', 'ye_ghost_town',
    'sakura_garden', 'ye_stronger', 'eots_we_are_the_people',
    'golden_bloom', 'ye_father_stretch', 'ye_heartless',
    'yozakura', 'lofi_garden', 'ye_runaway',
  ];
  const expectedSfx = ['ui', 'jump', 'bobux', 'score', 'collision', 'checkpoint', 'complete', 'unlock', 'pause', 'resume'];

  for (const name of expectedMusic) {
    const filePath = path.join(rootAudio, `${name}.wav`);
    assert.ok(fs.existsSync(filePath), `Missing music file: ${name}.wav`);
    const stats = fs.statSync(filePath);
    assert.ok(stats.size > 1500000, `BGM ${name}.wav should be an extended loop (>1.5MB), got ${stats.size} bytes`);
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
  for (const name of expectedMusic) {
    assert.ok(sourcesContent.includes(`${name}: require('../../assets/v2/audio/${name}.wav')`), `${name} must be declared in audioSourcesV2.js`);
  }

  const configModule = await import('../src/game/levelConfigV2.js');
  const levelThemes = configModule.LEVEL_CONFIG.levels.map(l => l.audioTheme);
  assert.equal(levelThemes.length, 12, '12 levels must be configured');
  assert.equal(new Set(levelThemes).size, 12, 'All 12 levels must have unique non-repeated soundtracks');
});

test('Custom BGM luolei_yuexinmiao is declared in AUDIO_SOURCES and MUSIC_TRACKS exposes all tracks plus auto', async () => {
  globalThis.require = globalThis.require || (id => id);
  const rootAudio = path.resolve('assets/v2/audio');
  const filePath = path.join(rootAudio, 'luolei_yuexinmiao.wav');
  assert.ok(fs.existsSync(filePath), 'Missing luolei_yuexinmiao.wav');
  assert.ok(fs.statSync(filePath).size > 1500000);

  const sourcesModule = await import('../src/game/audioSourcesV2.js');
  assert.ok(sourcesModule.AUDIO_SOURCES.music.luolei_yuexinmiao, 'luolei_yuexinmiao must be in AUDIO_SOURCES.music');
  assert.ok(Array.isArray(sourcesModule.MUSIC_TRACKS), 'MUSIC_TRACKS must be an array');
  assert.equal(sourcesModule.MUSIC_TRACKS[0].id, 'auto', 'First MUSIC_TRACK must be auto');
  const trackIds = sourcesModule.MUSIC_TRACKS.map(t => t.id);
  assert.ok(trackIds.includes('luolei_yuexinmiao'), 'luolei_yuexinmiao must be in MUSIC_TRACKS');
  for (const key of Object.keys(sourcesModule.AUDIO_SOURCES.music)) {
    assert.ok(trackIds.includes(key), `Track ${key} must be in MUSIC_TRACKS`);
  }
});

test('audioService respects selectedMusic override and avoids resetting track on biome switch', async () => {
  assert.ok(module);
  const playedTracks = [];
  const players = [];
  const service = module.createAudioService(source => {
    const player = { source, isLoaded: true, playing: false, currentTime: 0, play() { this.playing = true; }, pause() { this.playing = false; }, async seekTo(value) { this.currentTime = value; }, remove() { this.removed = true; } };
    players.push(player);
    playedTracks.push(source);
    return player;
  }, {
    music: {
      first_bloom: 'theme_first_bloom',
      sakura_garden: 'theme_sakura',
      luolei_yuexinmiao: 'theme_luolei',
    },
    sfx: { jump: 'jump' },
  });

  // Default auto behavior
  await service.prepare('first_bloom');
  service.start();
  assert.equal(playedTracks[0], 'theme_first_bloom');

  // Change to custom music
  service.settings({ selectedMusic: 'luolei_yuexinmiao' });
  await service.prepare('first_bloom');
  assert.equal(playedTracks[playedTracks.length - 1], 'theme_luolei');

  const countBeforeBiome = playedTracks.length;
  // Biome change in endless mode while custom song is active
  await service.prepare('sakura_garden');
  // Should NOT have created a new player or switched track!
  assert.equal(playedTracks.length, countBeforeBiome);

  // Switch back to auto
  service.settings({ selectedMusic: 'auto' });
  await service.prepare('sakura_garden');
  assert.equal(playedTracks[playedTracks.length - 1], 'theme_sakura');
});

test('audioService dynamically scales musicVolume and sfxVolume independently', async () => {
  assert.ok(module);
  const players = [];
  const service = module.createAudioService(source => {
    const player = { source, isLoaded: true, playing: false, currentTime: 0, volume: 1, play() { this.playing = true; }, pause() { this.playing = false; }, async seekTo(value) { this.currentTime = value; }, remove() { this.removed = true; } };
    players.push(player);
    return player;
  }, {
    music: { first_bloom: 'theme_first_bloom' },
    sfx: { jump: 'sfx_jump', bobux: 'sfx_bobux' },
  });

  await service.prepare('first_bloom');
  service.start();

  const musicPlayer = players[0];
  const jumpPlayer = players[1];
  const bobuxPlayer = players[2];

  // Baseline at default 100% volume
  assert.equal(musicPlayer.volume, 0.35);
  assert.equal(jumpPlayer.volume, 0.45);
  assert.equal(bobuxPlayer.volume, 0.6);

  // Scale down music to 50% and sfx to 40%
  service.settings({ musicVolume: 50, sfxVolume: 40 });
  assert.ok(Math.abs(musicPlayer.volume - 0.175) < 0.001);
  assert.ok(Math.abs(jumpPlayer.volume - 0.18) < 0.001);
  assert.ok(Math.abs(bobuxPlayer.volume - 0.24) < 0.001);

  // Set music volume to 0%
  service.settings({ musicVolume: 0 });
  assert.equal(musicPlayer.volume, 0);

  // Set SFX volume to 100%
  service.settings({ sfxVolume: 100 });
  assert.equal(jumpPlayer.volume, 0.45);
  assert.equal(bobuxPlayer.volume, 0.6);
});



