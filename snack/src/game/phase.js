// Cherry Bloom — World Phase Progression
// Source of Truth: CHERRY_BLOOM_DESIGN_SYSTEM.md (Section 4.2 & 9.1)

import { colors } from '../theme/theme.js';

export const PHASES = {
  firstBloom: {
    id: 'firstBloom',
    label: 'FIRST BLOOM',
    subtitle: 'Alvorada no Jardim',
    minScore: 0,
    skyTop: '#BFE8EF',
    skyBottom: '#FFF8F2',
    celestialColor: '#FFF0D0',
    celestialType: 'sun',
    mountainFar: '#D8C3D8',
    mountainNear: '#C4A5C4',
    treeFar: '#E69FB5',
    treeMid: '#D96B8A',
    groundTop: '#4F8A5B',
    groundBottom: '#28533A',
    petalColor: '#F5AFC1',
    hudScrim: 'rgba(37, 26, 32, 0.22)',
    branchVariant: 'lightBlossom',
  },
  sakuraGarden: {
    id: 'sakuraGarden',
    label: 'SAKURA GARDEN',
    subtitle: 'Primavera Radiante',
    minScore: 10,
    skyTop: '#8ED3E6',
    skyBottom: '#FFE3EA',
    celestialColor: '#FFF8F2',
    celestialType: 'sun',
    mountainFar: '#B4B8D8',
    mountainNear: '#949AC4',
    treeFar: '#F5AFC1',
    treeMid: '#E63750',
    groundTop: '#4F8A5B',
    groundBottom: '#28533A',
    petalColor: '#FFE3EA',
    hudScrim: 'rgba(37, 26, 32, 0.25)',
    branchVariant: 'leafyBranch',
  },
  goldenBloom: {
    id: 'goldenBloom',
    label: 'GOLDEN BLOOM',
    subtitle: 'Entardecer Dourado',
    minScore: 20,
    skyTop: '#735A91',
    skyBottom: '#F6A58A',
    celestialColor: '#FFF0D0',
    celestialType: 'sunset',
    mountainFar: '#6E4C7D',
    mountainNear: '#543861',
    treeFar: '#C96A7B',
    treeMid: '#A91532',
    groundTop: '#3B6945',
    groundBottom: '#203E2B',
    petalColor: '#F5AFC1',
    hudScrim: 'rgba(37, 26, 32, 0.34)',
    branchVariant: 'oldBark',
  },
  yozakura: {
    id: 'yozakura',
    label: 'YOZAKURA',
    subtitle: 'Sakura Sob o Luar',
    minScore: 30,
    skyTop: '#1A1932',
    skyBottom: '#292847',
    celestialColor: colors.moon100,
    celestialType: 'moon',
    mountainFar: '#322E59',
    mountainNear: '#232042',
    treeFar: '#734B75',
    treeMid: '#541021',
    groundTop: '#28533A',
    groundBottom: '#163021',
    petalColor: '#F5AFC1',
    hudScrim: 'rgba(255, 248, 242, 0.16)',
    branchVariant: 'nightBranch',
  },
};

export function getPhaseKey(score) {
  if (score >= 30) return 'yozakura';
  if (score >= 20) return 'goldenBloom';
  if (score >= 10) return 'sakuraGarden';
  return 'firstBloom';
}

export function getPhaseConfig(score) {
  const key = getPhaseKey(score);
  return PHASES[key];
}
