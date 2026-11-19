#!/usr/bin/env node
// Validate a game's plan.md against the full-plan template: every required
// section present, none empty, none still holding TODO/TBD placeholders.
// Exit 1 on any failure, exit 2 on usage errors.
// Usage: node plan-check.mjs <plan.md> [--json]
import { readFileSync, existsSync } from 'node:fs';

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const file = argv.filter((a) => !a.startsWith('--'))[0];

if (!file || !existsSync(file)) {
  console.error('usage: node plan-check.mjs <plan.md> [--json]');
  process.exit(2);
}

// The sections a full game plan must answer, in template order.
const REQUIRED = [
  'Fantasy',
  'Core loop',
  'First 10 seconds',
  'References',
  'Main control',
  'Camera',
  'Session length',
  'Levels and progression',
  'Characters and animation',
  'UI and menus',
  'Sound and music',
  'Performance budget',
  'Scope',
  'Milestones',
  'Kill criteria',
  'Verification plan',
];
const PLACEHOLDER = /\b(TODO|TBD|FIXME|XXX)\b/i;

const errors = [];
const warnings = [];
const found = {};

// Split the document into heading -> body. A heading's body runs until the
// next heading of any level.
const lines = readFileSync(file, 'utf8').split('\n');
const sections = []; // {name, body}
let current = null;
for (const line of lines) {
  const m = line.match(/^#{1,6}\s+(.+?)\s*$/);
  if (m) {
    if (current) sections.push(current);
    // Normalize: drop a leading "1." style number and trailing punctuation.
    const name = m[1].replace(/^\d+[.)]\s+/, '').replace(/[:\s]+$/, '');
    current = { name, body: [] };
  } else if (current) {
    current.body.push(line);
  }
}
if (current) sections.push(current);

const byName = new Map();
for (const s of sections) {
  const key = s.name.toLowerCase();
  if (!byName.has(key)) byName.set(key, s);
}

for (const req of REQUIRED) {
  const s = byName.get(req.toLowerCase());
  if (!s) {
    errors.push(`missing section: "${req}"`);
    continue;
  }
  found[req] = true;
  const body = s.body.join('\n').trim();
  if (!body) {
    errors.push(`section "${req}" is empty`);
    continue;
  }
  if (PLACEHOLDER.test(body)) {
    errors.push(`section "${req}" still has a TODO/TBD placeholder`);
    continue;
  }
  if (body.length < 20) {
    warnings.push(`section "${req}" is very short (${body.length} chars); a one-word answer is rarely a plan`);
  }
}

// An H1 title that still names no game is a warning, not an error.
const h1 = lines.find((l) => /^#\s+/.test(l));
if (h1 && PLACEHOLDER.test(h1)) {
  warnings.push('the title still has a TODO placeholder; name the game');
}

const result = { ok: errors.length === 0, sections: REQUIRED.length, found: Object.keys(found).length, errors, warnings };
if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  for (const e of errors) console.error(`FAIL  ${e}`);
  for (const w of warnings) console.error(`warn  ${w}`);
  console.log(errors.length === 0
    ? `plan-check: PASS (${REQUIRED.length} sections, ${warnings.length} warning(s))`
    : `plan-check: ${errors.length} failure(s)`);
}
process.exit(errors.length === 0 ? 0 : 1);
