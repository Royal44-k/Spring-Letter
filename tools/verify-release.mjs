import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const game = path.join(root, 'spring-letter');
const json = async file => JSON.parse(await readFile(file, 'utf8'));
const hashes = new Map();
async function verify(file, expected) {
  if (!hashes.has(file)) {
    const digest = createHash('sha256');
    for await (const bytes of createReadStream(file)) digest.update(bytes);
    hashes.set(file, digest.digest('hex'));
  }
  assert.equal(hashes.get(file), expected, path.relative(root, file));
}

const freeze = await json(path.join(game, 'evidence/release-manifest-v13.json'));
const packages = await json(path.join(game, 'evidence/v13/package.json'));
assert.equal(freeze.version, packages.version);
assert.equal(freeze.version, (await json(path.join(game, 'package.json'))).version);
// The historical build also recorded two manifests of the original multi-game workspace.
const shared = new Set(['../package.json', '../package-lock.json']);
for (const item of [...freeze.dist, ...freeze.sources, ...freeze.runtimeFiles, ...packages.packages,
                    ...Object.values(freeze.evidenceHashes)]) {
  if (!shared.has(item.file)) await verify(path.resolve(game, item.file), item.sha256);
}
for (const line of (await readFile(path.join(root, 'SHA256SUMS.txt'), 'utf8')).trim().split(/\r?\n/)) {
  const match = /^([a-f\d]{64})  (.+)$/u.exec(line);
  assert.ok(match, 'Invalid checksum line');
  await verify(path.resolve(root, match[2]), match[1]);
}
console.log(`Spring Letter ${freeze.version} · ${hashes.size} files verified (SHA-256)`);
