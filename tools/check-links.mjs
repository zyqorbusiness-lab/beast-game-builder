#!/usr/bin/env node
// Check that internal Markdown links resolve. External URLs are not fetched
// (offline-friendly); only relative links to files/dirs in this repo.
// Exit 1 on any broken internal link.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const SKIP_DIRS = new Set(['node_modules', '.git', '.godot']);

const mdFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (entry.endsWith('.md')) mdFiles.push(full);
  }
})(root);

const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;
let checked = 0;
for (const file of mdFiles) {
  const text = readFileSync(file, 'utf8');
  let m;
  while ((m = LINK_RE.exec(text)) !== null) {
    const target = m[1].split('#')[0].trim();
    if (!target || /^(https?:|mailto:|tel:)/.test(target)) continue;
    const resolved = resolve(dirname(file), decodeURIComponent(target));
    checked++;
    if (!existsSync(resolved)) {
      failures.push(`${file.slice(root.length + 1)}: broken link -> ${m[1]}`);
    }
  }
}

if (failures.length) {
  for (const f of failures) console.error(`FAIL  ${f}`);
  console.error(`\ncheck-links: ${failures.length} broken link(s)`);
  process.exit(1);
}
console.log(`check-links: PASS (${checked} internal links across ${mdFiles.length} Markdown files)`);
