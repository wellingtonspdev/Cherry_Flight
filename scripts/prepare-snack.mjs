import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const output = path.join(root, 'snack');
const check = process.argv.includes('--check');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
assert.match(pkg.dependencies.expo, /54\./, 'Generate the Snack package from the SDK54 delivery checkout');
const config = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));
delete config.expo.web?.favicon;

const files = new Map();
files.set('App.js', fs.readFileSync(path.join(root, 'App.js'), 'utf8'));
function walk(directory, relative = '') {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const name = path.posix.join(relative, item.name);
    if (item.isDirectory()) walk(path.join(directory, item.name), name);
    else files.set(name, fs.readFileSync(path.join(directory, item.name), 'utf8'));
  }
}
walk(path.join(root, 'src'), 'src');
files.set('package.json', JSON.stringify({
  name: 'cherry-bloom-snack',
  version: pkg.version,
  private: true,
  main: pkg.main,
  scripts: { start: 'expo start', web: 'expo start --web' },
  dependencies: pkg.dependencies,
}, null, 2) + '\n');
files.set('app.json', JSON.stringify(config, null, 2) + '\n');
files.set('README.md', `# Cherry Bloom — importação SDK54\n\nPacote gerado por \`node scripts/prepare-snack.mjs\` a partir da entrega SDK54. Contém o jogo completo: App, quatro telas, componentes, física, navegação e tema. Os desenhos de runtime são SVG/Views; não exigem os PNGs/WAVs de referência.\n\nImportar no Snack: https://github.com/wellingtonspdev/Cherry_Flight/tree/main/snack\n\nNão editar estas cópias manualmente. Código, arte de referência, PWA e auditoria completos ficam na raiz do repositório.\n`);

const normalize = text => text.replace(/\r\n/g, '\n');
for (const [name, contents] of files) {
  assert.ok(/\.(js|json|md)$/.test(name), `Unsupported import file: ${name}`);
  for (const match of contents.matchAll(/(?:from\s*|require\(\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
    const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(name), match[1]));
    assert.ok(files.has(dependency) || files.has(dependency + '.js'), `Missing local import: ${name} -> ${dependency}`);
  }
  const destination = path.join(output, name);
  if (check) assert.equal(normalize(fs.readFileSync(destination, 'utf8')), normalize(contents), `Stale Snack export: ${name}`);
  else {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, contents);
  }
}
const actual = [];
function inspect(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, item.name);
    if (item.isDirectory()) inspect(full);
    else actual.push(path.relative(output, full).replaceAll(path.sep, '/'));
  }
}
inspect(output);
assert.deepEqual(actual.sort(), [...files.keys()].sort(), 'Snack export contains unexpected files');
console.log(`${check ? 'Verified' : 'Generated'} ${files.size} text-only SDK54 import files`);
