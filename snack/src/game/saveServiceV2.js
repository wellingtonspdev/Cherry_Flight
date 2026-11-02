import { createProgress, sanitizeProgress } from './progressionV2.js';

export const SAVE_KEY = '@cherry_bloom_progress_v2';
export function createSaveService(backend) {
  let queue = Promise.resolve();
  return {
    async load() {
      let data = createProgress(); let exists = false; let warning = '';
      try {
        const raw = await backend.getItem(SAVE_KEY);
        if (raw) {
          if (raw.length > 65536) throw new Error('Save exceeds safe size');
          const parsed = JSON.parse(raw);
          data = sanitizeProgress(parsed); exists = parsed?.schemaVersion === 2;
        }
      } catch { warning = 'Não foi possível restaurar o progresso salvo.'; }
      try {
        const legacy = Number(await backend.getItem('@cherry_bloom_best_score_v1'));
        if (Number.isFinite(legacy) && legacy > 0) data.levelResults.legacy = { bestScore: Math.max(Math.floor(legacy), data.levelResults.legacy?.bestScore || 0) };
      } catch { /* Legacy storage must not prevent a new campaign. */ }
      return { data, exists, warning };
    },
    save(data) {
      const serialized = JSON.stringify(sanitizeProgress(data));
      const write = queue.catch(() => {}).then(() => backend.setItem(SAVE_KEY, serialized));
      queue = write;
      return write;
    },
  };
}
