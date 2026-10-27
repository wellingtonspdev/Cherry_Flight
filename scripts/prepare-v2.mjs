import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const check = process.argv.includes('--check');
const config = JSON.parse(fs.readFileSync(path.join(root, 'docs/LEVEL_CONFIG_V2.json'), 'utf8'));
assert.equal(config.levels.length, 12);
assert.equal(config.chapters.length, 4);
const vectors = {};
function walk(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, item.name);
    if (item.isDirectory()) walk(full);
    else if (item.name.endsWith('.svg')) {
      const name = path.relative(path.join(root, 'assets/v2'), full).replaceAll(path.sep, '/').replace(/\.svg$/, '');
      vectors[name] = fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n');
    }
  }
}
walk(path.join(root, 'assets/v2'));
assert.equal(Object.keys(vectors).length, 76);
const outputs = {
  'src/game/levelConfigV2.js': '// Generated losslessly from docs/LEVEL_CONFIG_V2.json; run node scripts/prepare-v2.mjs.\nexport const LEVEL_CONFIG = ' + JSON.stringify(config, null, 2) + ';\n',
  'src/game/vectorDataV2.js': '// Generated from the authoritative assets/v2 SVG sources; run node scripts/prepare-v2.mjs.\nexport const VECTORS = ' + JSON.stringify(vectors, null, 2) + ';\n',
};
for (const [name, text] of Object.entries(outputs)) {
  const full = path.join(root, name);
  if (check) assert.equal(fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n'), text, `Stale generated data: ${name}`);
  else fs.writeFileSync(full, text);
}
console.log(`${check ? 'Verified' : 'Generated'} 12 levels and 76 authoritative SVG sources`);
