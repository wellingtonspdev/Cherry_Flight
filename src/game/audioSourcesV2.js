if (typeof globalThis.require === 'undefined') globalThis.require = id => id;

export const AUDIO_SOURCES = {
  music: {
    first_bloom: require('../../assets/v2/audio/first_bloom.wav'),
    ye_flashing_lights: require('../../assets/v2/audio/ye_flashing_lights.wav'),
    ye_ghost_town: require('../../assets/v2/audio/ye_ghost_town.wav'),
    sakura_garden: require('../../assets/v2/audio/sakura_garden.wav'),
    ye_stronger: require('../../assets/v2/audio/ye_stronger.wav'),
    eots_we_are_the_people: require('../../assets/v2/audio/eots_we_are_the_people.wav'),
    golden_bloom: require('../../assets/v2/audio/golden_bloom.wav'),
    ye_father_stretch: require('../../assets/v2/audio/ye_father_stretch.wav'),
    ye_heartless: require('../../assets/v2/audio/ye_heartless.wav'),
    yozakura: require('../../assets/v2/audio/yozakura.wav'),
    lofi_garden: require('../../assets/v2/audio/lofi_garden.wav'),
    ye_runaway: require('../../assets/v2/audio/ye_runaway.wav'),
    luolei_yuexinmiao: require('../../assets/v2/audio/luolei_yuexinmiao.wav'),
  },
  sfx: {
    ui: require('../../assets/v2/audio/ui.wav'), jump: require('../../assets/v2/audio/jump.wav'),
    bobux: require('../../assets/v2/audio/sfx_bobux.wav'),
    score: require('../../assets/v2/audio/score.wav'), collision: require('../../assets/v2/audio/collision.wav'),
    checkpoint: require('../../assets/v2/audio/checkpoint.wav'), complete: require('../../assets/v2/audio/complete.wav'),
    unlock: require('../../assets/v2/audio/unlock.wav'), pause: require('../../assets/v2/audio/pause.wav'), resume: require('../../assets/v2/audio/resume.wav'),
  },
};

export const MUSIC_TRACKS = [
  { id: 'auto', title: 'Automático (Por Fase)', artist: 'Trilha sonora padrão de cada nível' },
  { id: 'luolei_yuexinmiao', title: '落泪 (我真的特别爱你)', artist: '月薪喵 (DJ VA Remix)' },
  { id: 'first_bloom', title: 'Show Me How', artist: 'Men I Trust' },
  { id: 'ye_flashing_lights', title: 'Flashing Lights', artist: 'Kanye West' },
  { id: 'ye_ghost_town', title: 'Ghost Town', artist: 'Kanye West' },
  { id: 'sakura_garden', title: 'Walking On A Dream', artist: 'Empire of the Sun' },
  { id: 'ye_stronger', title: 'Stronger', artist: 'Kanye West' },
  { id: 'eots_we_are_the_people', title: 'We Are The People', artist: 'Empire of the Sun' },
  { id: 'golden_bloom', title: 'Inner Light', artist: 'Elderbrook & Bob Moses' },
  { id: 'ye_father_stretch', title: 'Father Stretch My Hands Pt. 1', artist: 'Kanye West' },
  { id: 'ye_heartless', title: 'Heartless', artist: 'Kanye West' },
  { id: 'yozakura', title: 'No Pole', artist: 'Don Toliver' },
  { id: 'lofi_garden', title: 'Affection', artist: 'Jinsang' },
  { id: 'ye_runaway', title: 'Runaway', artist: 'Kanye West' },
];

