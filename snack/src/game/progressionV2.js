import { LEVEL_CONFIG } from './levelConfigV2.js';

const scoreValue = value => Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
export function createProgress() {
  return { schemaVersion: 2, highestUnlockedLevel: 1, lastPlayedLevel: 1, lastCompletedLevel: 0,
    levelResults: {}, endlessUnlocked: false, settings: { music: true, sfx: true, haptics: true } };
}
export function sanitizeProgress(raw) {
  const data = createProgress();
  if (!raw || raw.schemaVersion !== 2) return data;
  for (const key of Object.keys(data.settings)) if (typeof raw.settings?.[key] === 'boolean') data.settings[key] = raw.settings[key];
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
  data.lastPlayedLevel = Number.isInteger(raw.lastPlayedLevel) && raw.lastPlayedLevel >= 1 && raw.lastPlayedLevel <= data.highestUnlockedLevel ? raw.lastPlayedLevel : data.highestUnlockedLevel;
  return data;
}
export const isUnlocked = (data, id) => Number.isInteger(id) && id >= 1 && id <= data.highestUnlockedLevel && id <= 12;
export const continueLevel = data => data.lastPlayedLevel;
export const startLevel = (data, id) => isUnlocked(data, id) ? { ...data, lastPlayedLevel: id } : null;
export function recordAttempt(data, id, score) {
  if (id === 'endless' ? !data.endlessUnlocked : !isUnlocked(data, id)) return data;
  return { ...data, levelResults: { ...data.levelResults, [id]: { ...data.levelResults[id], bestScore: Math.max(scoreValue(score), data.levelResults[id]?.bestScore || 0) } } };
}
export function completeLevel(data, id, score) {
  const level = LEVEL_CONFIG.levels.find(item => item.id === id);
  if (!level || !isUnlocked(data, id) || scoreValue(score) < level.targetScore) return data;
  const next = recordAttempt(data, id, score);
  return sanitizeProgress({ ...next, lastPlayedLevel: Math.min(12, id + 1), levelResults: { ...next.levelResults, [id]: { ...next.levelResults[id], completed: true } } });
}
