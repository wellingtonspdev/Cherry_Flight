import test from 'node:test';
import { execFileSync } from 'node:child_process';

test('SDK54 Snack import package matches runtime and has no asset-upload inputs', () => {
  execFileSync(process.execPath, ['scripts/prepare-snack.mjs', '--check'], { stdio: 'pipe' });
});
