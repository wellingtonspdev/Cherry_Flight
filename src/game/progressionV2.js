import { LEVEL_CONFIG } from './levelConfigV2.js';
import { SKINS, DEFAULT_SKIN } from './skinsV2.js';

const scoreValue = value => Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;

export function createProgress() {
  return {
    schemaVersion: 2,
    highestUnlockedLevel: 1,
    lastPlayedLevel: 1,
    lastCompletedLevel: 0,
    levelResults: {},
    endlessUnlocked: false,
    settings: { music: true, sfx: true, haptics: true },
    bobux: 0,
    unlockedSkins: [DEFAULT_SKIN],
    equippedSkin: DEFAULT_SKIN,
  };
}

export function sanitizeProgress(raw) {
  const data = createProgress();
  if (!raw || raw.schemaVersion !== 2) return data;
  for (const key of Object.keys(data.settings)) {
    if (typeof raw.settings?.[key] === 'boolean') data.settings[key] = raw.settings[key];
  }
  let contiguous = true;
  for (const level of LEVEL_CONFIG.levels) {
    const result = raw.levelResults?.[level.id];
    if (result && typeof result === 'object') {
      const bestScore = scoreValue(result.bestScore);
      const completed = contiguous && result.completed === true && bestScore >= level.targetScore;
      data.levelResults[level.id] = { bestScore, completed };
      if (completed) data.lastCompletedLevel = level.id;
      else contiguous = false;
    } else contiguous = false;
  }
  for (const key of ['legacy', 'endless']) {
    if (raw.levelResults?.[key]) data.levelResults[key] = { bestScore: scoreValue(raw.levelResults[key].bestScore) };
  }
  data.highestUnlockedLevel = Math.min(12, data.lastCompletedLevel + 1);
  data.endlessUnlocked = data.lastCompletedLevel === 12;
  data.lastPlayedLevel = Number.isInteger(raw.lastPlayedLevel) && raw.lastPlayedLevel >= 1 && raw.lastPlayedLevel <= data.highestUnlockedLevel
    ? raw.lastPlayedLevel
    : data.highestUnlockedLevel;

  // Bobux wallet and skins
  data.bobux = Number.isInteger(raw.bobux) && raw.bobux >= 0 ? raw.bobux : 0;
  const validSkinIds = new Set(Object.keys(SKINS));
  const rawSkins = Array.isArray(raw.unlockedSkins) ? raw.unlockedSkins : [];
  const unlocked = new Set([DEFAULT_SKIN]);
  for (const s of rawSkins) {
    if (typeof s === 'string' && validSkinIds.has(s)) {
      unlocked.add(s);
    }
  }
  data.unlockedSkins = Array.from(unlocked);
  data.equippedSkin = typeof raw.equippedSkin === 'string' && unlocked.has(raw.equippedSkin)
    ? raw.equippedSkin
    : DEFAULT_SKIN;

  return data;
}

export const isUnlocked = (data, id) => Number.isInteger(id) && id >= 1 && id <= data.highestUnlockedLevel && id <= 12;
export const continueLevel = data => data.lastPlayedLevel;
export const startLevel = (data, id) => isUnlocked(data, id) ? { ...data, lastPlayedLevel: id } : null;

export function addBobux(data, amount) {
  const value = Number.isInteger(amount) && amount > 0 ? amount : 0;
  return sanitizeProgress({ ...data, bobux: data.bobux + value });
}

export function unlockSkin(data, skinId) {
  const skin = SKINS[skinId];
  if (!skin || data.unlockedSkins.includes(skinId) || data.bobux < skin.price) {
    return { data, success: false };
  }
  const next = sanitizeProgress({
    ...data,
    bobux: data.bobux - skin.price,
    unlockedSkins: [...data.unlockedSkins, skinId],
    equippedSkin: skinId,
  });
  return { data: next, success: true };
}

export function equipSkin(data, skinId) {
  if (!data.unlockedSkins.includes(skinId)) return data;
  return sanitizeProgress({ ...data, equippedSkin: skinId });
}

export function recordAttempt(data, id, score, bobuxCollected = 0) {
  if (id === 'endless' ? !data.endlessUnlocked : !isUnlocked(data, id)) return data;
  const bobuxGain = Number.isInteger(bobuxCollected) && bobuxCollected > 0 ? bobuxCollected : 0;
  return sanitizeProgress({
    ...data,
    bobux: data.bobux + bobuxGain,
    levelResults: {
      ...data.levelResults,
      [id]: {
        ...data.levelResults[id],
        bestScore: Math.max(scoreValue(score), data.levelResults[id]?.bestScore || 0),
      },
    },
  });
}

export function completeLevel(data, id, score, bobuxCollected = 0) {
  const level = LEVEL_CONFIG.levels.find(item => item.id === id);
  if (!level || !isUnlocked(data, id) || scoreValue(score) < level.targetScore) return data;
  const wasCompleted = data.levelResults[id]?.completed === true;
  const firstTimeBonus = wasCompleted ? 0 : 5;
  const bobuxGain = (Number.isInteger(bobuxCollected) && bobuxCollected > 0 ? bobuxCollected : 0) + firstTimeBonus;
  const next = recordAttempt(data, id, score, 0);
  return sanitizeProgress({
    ...next,
    bobux: next.bobux + bobuxGain,
    lastPlayedLevel: Math.min(12, id + 1),
    levelResults: {
      ...next.levelResults,
      [id]: { ...next.levelResults[id], completed: true },
    },
  });
}
