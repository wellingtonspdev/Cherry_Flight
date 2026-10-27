import { createAudioPlayer } from 'expo-audio';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';
import { createAudioService } from './audioServiceV2';
import { AUDIO_SOURCES } from './audioSourcesV2';

function createPlayer(source) {
  if (Platform.OS !== 'web') return createAudioPlayer(source, { updateInterval: 250 });
  // SDK54's Web player discards play()'s promise; keep autoplay rejection catchable with the browser API.
  const media = new Audio(typeof source === 'number' ? Asset.fromModule(source).uri : source.uri || source);
  media.preload = 'auto';
  Object.defineProperties(media, { isLoaded: { get: () => media.readyState >= 2 }, playing: { get: () => !media.paused && !media.ended } });
  media.seekTo = async seconds => { media.currentTime = seconds; };
  media.remove = () => { media.pause(); media.removeAttribute('src'); media.load(); };
  media.load();
  return media;
}
export const audioManager = createAudioService(createPlayer, AUDIO_SOURCES);
