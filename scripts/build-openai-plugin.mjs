#!/usr/bin/env node
// Builds the upload ZIP for OpenAI's plugin portal from plugins/cookre.
//
//   node scripts/build-openai-plugin.mjs [--without-claude]
//
// Plain Node, no dependencies; it shells out to `zip`. The ZIP is written to
// dist/cookre-openai-<version>.zip (dist/ is gitignored). By default it carries both vendors'
// manifests; --without-claude leaves out .claude-plugin/ and .mcp.json, for the case where the
// portal's checks flag them. It refuses to write if any file looks like it holds a secret.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'plugins/cookre');
const withoutClaude = process.argv.includes('--without-claude');
const CLAUDE_FILES = ['.claude-plugin', '.mcp.json'];

const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bsk-[A-Za-z0-9_-]{20,}/,
  /\bghp_[A-Za-z0-9]{30,}/,
  /\bxox[abp]-[A-Za-z0-9-]{10,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\b(?:password|passphrase|secret|api[_-]?key|token)\b\s*["']?\s*[:=]\s*["'][^"'\s]{8,}/i,
];

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

const manifest = JSON.parse(readFileSync(join(source, 'plugin.json'), 'utf8'));
const included = files(source)
  .map((path) => relative(source, path))
  .filter((path) => !path.startsWith('.DS_Store') && !path.endsWith('/.DS_Store'))
  .filter((path) => !(withoutClaude && CLAUDE_FILES.some((name) => path === name || path.startsWith(`${name}/`))))
  .sort();

const problems = [];
for (const path of included) {
  if (/\.(png|jpe?g|gif|webp)$/i.test(path)) continue;
  const text = readFileSync(join(source, path), 'utf8');
  for (const pattern of SECRET_PATTERNS) if (pattern.test(text)) problems.push(`${path} matches ${pattern}`);
}
if (problems.length > 0) {
  console.error(`Refusing to build: possible secrets.\n  ${problems.join('\n  ')}`);
  process.exit(1);
}

// Everything the manifest points at must be in the package.
const referenced = [];
const collect = (value) => {
  if (typeof value === 'string' && value.startsWith('./')) referenced.push(value.slice(2));
  else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
};
collect(manifest.extensions);
const missing = referenced.filter((path) => !included.includes(path));
if (missing.length > 0) {
  console.error(`Refusing to build: plugin.json names files that are missing: ${missing.join(', ')}`);
  process.exit(1);
}

const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });
const zip = join(dist, `cookre-openai-${manifest.version}.zip`);
rmSync(zip, { force: true });
// The package's files sit at the ZIP's root, with plugin.json first-level.
execFileSync('zip', ['-X', '-q', zip, ...included], { cwd: source, stdio: 'inherit' });
console.log(`${relative(root, zip)} (${statSync(zip).size} bytes)${withoutClaude ? ', without Claude files' : ''}`);
for (const path of included) console.log(`  ${path}`);
