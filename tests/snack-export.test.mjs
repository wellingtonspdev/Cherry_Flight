import test from 'node:test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

test('SDK54 Snack import package matches runtime and has no asset-upload inputs', (t) => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.dependencies?.expo?.includes('54.')) {
    t.skip('Snack export check is scoped to the SDK54 delivery baseline');
    return;
  }
  execFileSync(process.execPath, ['scripts/prepare-snack.mjs', '--check'], { stdio: 'pipe' });
});
