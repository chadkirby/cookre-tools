#!/usr/bin/env node
// Fails unless the plugin's three manifests name the same version: the portable (OpenAI)
// plugin.json, Claude's .claude-plugin/plugin.json, and its entry in the Claude marketplace.
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));

const marketplace = read('.claude-plugin/marketplace.json');
const entry = marketplace.plugins.find((plugin) => plugin.name === 'cookre');
const versions = {
  'plugins/cookre/plugin.json': read('plugins/cookre/plugin.json').version,
  'plugins/cookre/.claude-plugin/plugin.json': read('plugins/cookre/.claude-plugin/plugin.json').version,
  '.claude-plugin/marketplace.json (cookre)': entry?.version,
};
if (new Set(Object.values(versions)).size !== 1) {
  console.error('Plugin versions disagree:');
  for (const [path, version] of Object.entries(versions)) console.error(`  ${path}: ${version}`);
  process.exit(1);
}
console.log(`All manifests at ${Object.values(versions)[0]}`);
