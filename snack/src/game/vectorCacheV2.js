import { VECTORS } from './vectorDataV2.js';

export function createVectorCache(compile) {
  const entries = new Map();
  let playing = false;
  const stats = { parses: 0, parsesDuringPlay: 0, chapters: [] };
  function get(key, width = 0, height = 0, part = '') {
    width = Math.round(width); height = Math.round(height);
    const cacheKey = `${key}:${width}:${height}:${part}`;
    if (entries.has(cacheKey)) return entries.get(cacheKey);
    let xml = VECTORS[key];
    if (!xml) throw new Error(`Missing V2 vector: ${key}`);
    if (part === 'sky') xml = xml.replace(/<path\b[^>]*\/>/g, '');
    if (part === 'terrain') xml = `<svg viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">${(xml.match(/<path\b[^>]*\/>/g) || []).join('')}</svg>`;
    const prefix = key.replace(/[^a-zA-Z0-9]/g, '_') + '_';
    xml = xml.replace(/id="([^"]+)"/g, (_, id) => `id="${prefix}${id}"`).replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}${id})`);
    if (width && height && key.startsWith('backgrounds/')) {
      // Keep sun, moon and flowers circular when portrait scenery adapts to a landscape field.
      const ratio = 1080 * height / (1920 * width);
      xml = xml.replace(/<circle\b([^>]*?)\br="([\d.]+)"([^>]*?)\/>/g, (_, a, radius, b) => `<ellipse${a}rx="${Number(radius) * ratio}" ry="${radius}"${b}/>`);
    }
    const value = { key, ast: compile(xml), parsedAt: Date.now() };
    entries.set(cacheKey, value); stats.parses++;
    if (playing) stats.parsesDuringPlay++;
    return value;
  }
  function preload(biome, width, height) {
    const start = Date.now();
    for (const key of Object.keys(VECTORS)) {
      if (key.startsWith('characters/') || key.startsWith(`obstacles/${biome}/`)) get(key);
    }
    const base = `backgrounds/${biome}/`;
    get(base + 'background_base', width, height, 'sky');
    get(base + 'background_base', width, height, 'terrain');
    get(base + 'midground', width, height);
    get(base + 'overlay_fx', width, height);
    get(base + 'foreground_frame');
    get(base + 'background_composite');
    if (stats.chapters.length >= 24) stats.chapters.shift();
    stats.chapters.push({ biome, start, end: Date.now(), width, height });
  }
  return { get, preload, stats, setPlaying(value) { playing = value; } };
}
