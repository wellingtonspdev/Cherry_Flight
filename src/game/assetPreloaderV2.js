import { parse } from 'react-native-svg';
import { createVectorCache } from './vectorCacheV2';

export const vectorRegistry = createVectorCache(parse);

export async function preloadChapter(biome, width, height, endless = false) {
  const chapters = endless ? ['first_bloom', 'sakura_garden', 'golden_bloom', 'yozakura'] : [biome];
  for (const chapter of chapters) vectorRegistry.preload(chapter, width, height);
  return vectorRegistry.stats;
}
