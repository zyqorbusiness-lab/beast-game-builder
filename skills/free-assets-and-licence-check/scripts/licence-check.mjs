#!/usr/bin/env node
// Validate a game's CREDITS.md table: one row per third-party asset with
// Asset | Author | Licence | Source all filled, licence recognized,
// source a URL. With --root, every binary asset file in the project must
// have a matching row. Exit 1 on any failure.
// Usage: node licence-check.mjs <CREDITS.md> [--root <project-dir>] [--commercial] [--json]
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const argv = process.argv.slice(2);
const rootIdx = argv.indexOf('--root');
const root = rootIdx >= 0 ? argv[rootIdx + 1] : null;
const positional = argv.filter((a, i) => !a.startsWith('--') && !(rootIdx >= 0 && i === rootIdx + 1));
const file = positional[0];
const asJson = argv.includes('--json');
const commercial = argv.includes('--commercial');

if (!file || !existsSync(file)) {
  console.error('usage: node licence-check.mjs <CREDITS.md> [--root <dir>] [--commercial] [--json]');
  process.exit(2);
}

const KNOWN_LICENCES = [
  /^CC0/i, /^CC[- ]BY(?!.*(SA|NC))[- ]?\d*\.?\d*/i, /^CC[- ]BY[- ]SA/i,
  /^CC[- ]BY[- ]NC/i, /^GPL[- ]?[23]/i, /^LGPL/i, /^MIT/i, /^Apache[- ]?2/i,
  /^OFL/i, /^BSD/i, /^zlib/i, /^proprietary/i, /^public domain/i,
];
const ASSET_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif',
  '.ogg', '.wav', '.mp3', '.flac',
  '.glb', '.gltf', '.fbx', '.obj',
  '.ttf', '.otf', '.woff', '.woff2',
]);
const SKIP_DIRS = new Set(['node_modules', '.git', '.godot', 'android', 'builds', 'dist']);

const errors = [];
const warnings = [];
const rows = [];

const lines = readFileSync(file, 'utf8').split('\n');
let inTable = false;
let lineNo = 0;
for (const line of lines) {
  lineNo++;
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) { inTable = false; continue; }
  const cells = trimmed.slice(1, -1).split('|').map((c) => c.trim());
  if (cells.every((c) => /^:?-{3,}:?$/.test(c))) { continue; } // separator row
  if (!inTable) {
    // header row: expect the four columns
    const [a, b, c, d] = cells.map((c) => c.toLowerCase());
    if (a === 'asset' && b === 'author' && c === 'licence' && d === 'source') {
      inTable = true;
      continue;
    }
    continue; // some other table, ignore
  }
  if (cells.length < 4) { errors.push(`line ${lineNo}: row has fewer than 4 columns`); continue; }
  const [asset, author, licence, source] = cells;
  rows.push({ lineNo, asset, author, licence, source });

  for (const [label, value] of [['Asset', asset], ['Author', author], ['Licence', licence], ['Source', source]]) {
    if (!value) errors.push(`line ${lineNo}: ${label} is empty`);
  }
  if (/^\(example row/.test(asset)) {
    warnings.push(`line ${lineNo}: example row still present; replace it with a real asset or delete it`);
    continue;
  }
  if (licence && !KNOWN_LICENCES.some((re) => re.test(licence))) {
    errors.push(`line ${lineNo}: unrecognized licence "${licence}"`);
  }
  if (/NC|NonCommercial|Sampling\+/i.test(licence)) {
    const msg = `line ${lineNo}: non-commercial licence "${licence}" on ${asset}`;
    if (commercial) errors.push(`${msg} (not allowed with --commercial)`);
    else warnings.push(`${msg}; never use this if the game might be monetized`);
  }
  if (source && !/^https?:\/\//.test(source)) {
    errors.push(`line ${lineNo}: source is not a URL: "${source}"`);
  }
}

if (rows.length === 0) errors.push('no asset rows found (expected a "| Asset | Author | Licence | Source |" table)');

// Reverse check: asset files on disk must each have a row.
if (root) {
  const listed = new Set(rows.map((r) => r.asset));
  const orphans = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      if (SKIP_DIRS.has(entry)) continue;
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else {
        const ext = entry.slice(entry.lastIndexOf('.')).toLowerCase();
        if (ASSET_EXTENSIONS.has(ext)) {
          const rel = relative(root, full);
          if (!listed.has(rel) && !listed.has('./' + rel)) orphans.push(rel);
        }
      }
    }
  })(root);
  for (const o of orphans) errors.push(`file on disk has no credits row: ${o}`);
}

const ok = errors.length === 0;
if (asJson) {
  console.log(JSON.stringify({ ok, errors, warnings, rows: rows.length }, null, 2));
} else {
  for (const w of warnings) console.log(`WARN  ${w}`);
  for (const e of errors) console.log(`FAIL  ${e}`);
  console.log(ok
    ? `licence check passed: ${rows.length} asset row(s) OK${warnings.length ? `, ${warnings.length} warning(s)` : ''}`
    : `licence check failed: ${errors.length} error(s)`);
}
process.exit(ok ? 0 : 1);
