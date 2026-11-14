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
  { id: 'auto', title: 'Automático (Por Fase)', artist: 'Trilha sonora dinâmica de cada nível', durationSec: null, durationFormatted: 'Variável', highlight: 'Sincronizado com cada fase', icon: '⚡', coverColor: '#FF6B8B' },
  { id: 'luolei_yuexinmiao', title: '落泪(我真的特别爱你) (片段版)', artist: '月薪喵', durationSec: 36.0, durationFormatted: '36s', highlight: '我真的特别爱你 为什么你会落泪...', icon: '🐱', coverColor: '#A855F7' },
  { id: 'first_bloom', title: 'Show Me How (Refrão / 片段版)', artist: 'Men I Trust', durationSec: 15.34, durationFormatted: '15s', highlight: 'Show me how you care...', icon: '🌸', coverColor: '#EC4899' },
  { id: 'ye_flashing_lights', title: 'Flashing Lights (Refrão / 片段版)', artist: 'Kanye West', durationSec: 18.0, durationFormatted: '18s', highlight: 'Flashing lights...', icon: '💡', coverColor: '#EAB308' },
  { id: 'ye_ghost_town', title: 'Ghost Town (Refrão / 片段版)', artist: 'Kanye West', durationSec: 19.8, durationFormatted: '20s', highlight: 'Some day I will wear a starry crown...', icon: '⛰️', coverColor: '#6366F1' },
  { id: 'sakura_garden', title: 'Walking On A Dream (Refrão / 片段版)', artist: 'Empire of the Sun', durationSec: 18.7, durationFormatted: '19s', highlight: 'We are always running for the thrill of it...', icon: '🌅', coverColor: '#F97316' },
  { id: 'ye_stronger', title: 'Stronger (Refrão / 片段版)', artist: 'Kanye West', durationSec: 20.4, durationFormatted: '20s', highlight: "N-now th-that don't kill me...", icon: '🤖', coverColor: '#3B82F6' },
  { id: 'eots_we_are_the_people', title: 'We Are The People (Refrão / 片段版)', artist: 'Empire of the Sun', durationSec: 21.0, durationFormatted: '21s', highlight: 'We are the people that rule the world...', icon: '👑', coverColor: '#F59E0B' },
  { id: 'golden_bloom', title: 'Inner Light (Refrão / 片段版)', artist: 'Elderbrook & Bob Moses', durationSec: 20.1, durationFormatted: '20s', highlight: 'I feel your inner light...', icon: '✨', coverColor: '#10B981' },
  { id: 'ye_father_stretch', title: 'Father Stretch My Hands Pt. 1 (Refrão / 片段版)', artist: 'Kanye West', durationSec: 21.4, durationFormatted: '21s', highlight: 'Beautiful morning...', icon: '☀️', coverColor: '#EF4444' },
  { id: 'ye_heartless', title: 'Heartless (Refrão / 片段版)', artist: 'Kanye West', durationSec: 21.7, durationFormatted: '22s', highlight: "In the night I hear 'em talk...", icon: '💔', coverColor: '#8B5CF6' },
  { id: 'yozakura', title: 'No Pole (Refrão / 片段版)', artist: 'Don Toliver', durationSec: 20.9, durationFormatted: '21s', highlight: 'I came in with a pole...', icon: '🌙', coverColor: '#14B8A6' },
  { id: 'lofi_garden', title: 'Affection (Tema / 片段版)', artist: 'Jinsang', durationSec: 22.3, durationFormatted: '22s', highlight: 'Lo-fi chill flute & keys melody...', icon: '🍵', coverColor: '#84CC16' },
  { id: 'ye_runaway', title: 'Runaway (Refrão / 片段版)', artist: 'Kanye West', durationSec: 73.6, durationFormatted: '74s', highlight: "Let's have a toast for the douchebags...", icon: '🎹', coverColor: '#06B6D4' },
];

