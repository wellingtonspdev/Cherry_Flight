const VOLUMES = { jump: 0.45, bobux: 0.6, score: 0.55, collision: 0.7, checkpoint: 0.7, ui: 0.45 };
const BASE_MUSIC_VOLUME = 0.35;

export function createAudioService(createPlayer, sources) {
  let music = null, chapter = '', active = false, failures = 0, generation = 0;
  let effectRevision = 0;
  let preferences = { music: true, sfx: true, selectedMusic: 'auto', musicVolume: 100, sfxVolume: 100 };
  const effects = new Map();
  const events = [];
  const safely = action => {
    try { const result = action(); if (result?.catch) result.catch(() => { failures++; }); }
    catch { failures++; }
  };
  const calcMusicVolume = () => (BASE_MUSIC_VOLUME * (Math.max(0, Math.min(100, preferences.musicVolume ?? 100)) / 100));
  const calcSfxRatio = () => (Math.max(0, Math.min(100, preferences.sfxVolume ?? 100)) / 100);
  const pauseAll = () => { if (music) safely(() => music.pause()); for (const player of effects.values()) safely(() => player.pause()); };
  const api = {
    async prepare(biome) {
      const ticket = ++generation;
      const targetTrack = (preferences.selectedMusic && preferences.selectedMusic !== 'auto' && sources.music?.[preferences.selectedMusic])
        ? preferences.selectedMusic
        : biome;
      if (chapter !== targetTrack || !music) {
        if (music) safely(() => music.remove());
        music = null; chapter = targetTrack;
        safely(() => { music = createPlayer(sources.music[targetTrack]); music.loop = true; music.volume = calcMusicVolume(); });
      }
      for (const [event, source] of Object.entries(sources.sfx)) if (!effects.has(event)) safely(() => {
        const player = createPlayer(source); player.volume = (VOLUMES[event] || 0.6) * calcSfxRatio(); effects.set(event, player);
      });
      // Optional audio has a bounded preload; network or codec failures never block READY.
      const deadline = Date.now() + 1800;
      while (ticket === generation && Date.now() < deadline && [music, ...effects.values()].some(p => p && !p.isLoaded)) await new Promise(resolve => setTimeout(resolve, 30));
      if (active && preferences.music && music && ticket === generation) safely(() => music.play());
    },
    start() { active = true; if (preferences.music && music) safely(() => music.play()); },
    pause() { effectRevision++; active = false; pauseAll(); },
    effect(event) {
      const player = effects.get(event);
      if (!preferences.sfx || (preferences.sfxVolume ?? 100) === 0 || !player) return;
      if (events.length >= 32) events.shift();
      events.push({ event, at: Date.now() });
      const revision = effectRevision;
      safely(() => { player.seekTo(0).then(() => { if (revision === effectRevision && preferences.sfx && effects.get(event) === player) safely(() => player.play()); }).catch(() => { failures++; }); });
    },
    settings(next) {
      const prevSelected = preferences.selectedMusic;
      preferences = { ...preferences, ...next };

      if (music) {
        music.volume = calcMusicVolume();
      }
      const sfxRatio = calcSfxRatio();
      for (const [event, player] of effects.entries()) {
        player.volume = (VOLUMES[event] || 0.6) * sfxRatio;
      }

      if (next.selectedMusic !== undefined && next.selectedMusic !== prevSelected && chapter && sources.music) {
        const nextTarget = (preferences.selectedMusic && preferences.selectedMusic !== 'auto' && sources.music[preferences.selectedMusic])
          ? preferences.selectedMusic
          : chapter;
        if (nextTarget !== chapter) {
          generation++;
          if (music) safely(() => music.remove());
          music = null; chapter = nextTarget;
          safely(() => { music = createPlayer(sources.music[nextTarget]); music.loop = true; music.volume = calcMusicVolume(); });
          if (active && preferences.music && music) safely(() => music.play());
        }
      }
      if (!preferences.music && music) safely(() => music.pause());
      else if (active && music) safely(() => music.play());
      if (!preferences.sfx) effectRevision++;
      if (!preferences.sfx) for (const player of effects.values()) safely(() => player.pause());
    },
    release() {
      generation++; effectRevision++; active = false; pauseAll();
      if (music) safely(() => music.remove()); music = null; chapter = '';
      for (const player of effects.values()) safely(() => player.remove()); effects.clear();
    },
    snapshot() { return { chapter, active, failures, events: [...events], players: (music ? 1 : 0) + effects.size, preferences: { ...preferences }, music: music ? { loaded: music.isLoaded, playing: music.playing, time: music.currentTime, loop: music.loop, volume: music.volume } : null, effects: [...effects].map(([event, player]) => ({ event, loaded: player.isLoaded, playing: player.playing })) }; },
  };
  return api;
}

