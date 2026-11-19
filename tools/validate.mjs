#!/usr/bin/env node
// Repo self-check. Enforces the structure this repo promises:
// - every skills/<name>/ has a SKILL.md with the contract sections
// - required root files exist
// - package.json parses
// - the Godot example has its core files
// - no third-party binary assets anywhere (this repo is text-only)
// Exit 1 on any failure.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const notes = [];

function fail(msg) { failures.push(msg); }
function ok(cond, msg) { if (!cond) fail(msg); }

// Root files
for (const f of ['README.md', 'WORKFLOW.md', 'AGENTS.md', 'LICENSE', 'NOTICE', 'CREDITS.md', 'package.json', 'skills/README.md']) {
  ok(existsSync(join(root, f)), `missing root file: ${f}`);
}

// package.json parses and has the promised scripts
try {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  for (const s of ['validate', 'test', 'check-links']) {
    ok(pkg.scripts && pkg.scripts[s], `package.json missing script: ${s}`);
  }
} catch (e) {
  fail(`package.json does not parse: ${e.message}`);
}

// Skills contract
const EXPECTED_SKILLS = [
  'reference-first-builds',
  'game-direction-and-scope', 'opening-and-login-animation', 'game-ui-menus-and-hud',
  'touch-controls-and-input', 'game-feel-and-juice', 'godot-android-pipeline',
  'unity-pipeline', 'blender-character-pipeline', 'audio-and-sound-effects',
  'free-assets-and-licence-check', 'android-performance-and-qa',
];
const REQUIRED_SECTIONS = ['## When to use', '## Checklist'];
const skillsDir = join(root, 'skills');
const skillFolders = readdirSync(skillsDir).filter((d) => {
  try { return statSync(join(skillsDir, d)).isDirectory(); } catch { return false; }
});
for (const expected of EXPECTED_SKILLS) {
  ok(skillFolders.includes(expected), `missing skill folder: skills/${expected}`);
}
for (const folder of skillFolders) {
  ok(EXPECTED_SKILLS.includes(folder), `unexpected skill folder: skills/${folder} (add it to EXPECTED_SKILLS in tools/validate.mjs)`);
  const skillMd = join(skillsDir, folder, 'SKILL.md');
  ok(existsSync(skillMd), `skills/${folder} has no SKILL.md`);
  if (!existsSync(skillMd)) continue;
  const text = readFileSync(skillMd, 'utf8');
  ok(/^# .+/m.test(text), `skills/${folder}/SKILL.md has no H1 title`);
  for (const section of REQUIRED_SECTIONS) {
    ok(text.includes(section), `skills/${folder}/SKILL.md missing section "${section}"`);
  }
}

// Scripts that skills promise
for (const script of [
  'skills/game-direction-and-scope/scripts/new-game.mjs',
  'skills/godot-android-pipeline/scripts/check-android-env.mjs',
  'skills/free-assets-and-licence-check/scripts/licence-check.mjs',
  'skills/blender-character-pipeline/scripts/make_lowpoly_character.py',
]) {
  ok(existsSync(join(root, script)), `missing promised script: ${script}`);
}

// Godot example core files
for (const f of [
  'examples/godot-hello-game/project.godot',
  'examples/godot-hello-game/README.md',
  'examples/godot-hello-game/scenes/splash.tscn',
  'examples/godot-hello-game/scenes/menu.tscn',
  'examples/godot-hello-game/scenes/game.tscn',
  'examples/godot-hello-game/scripts/app.gd',
]) {
  ok(existsSync(join(root, f)), `example missing file: ${f}`);
}

// Text-only rule: no binary asset files in the repo.
const BINARY = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ogg', '.wav', '.mp3', '.glb', '.gltf', '.fbx', '.ttf', '.otf', '.zip', '.apk', '.blend']);
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === '.godot') continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else {
      const ext = entry.slice(entry.lastIndexOf('.')).toLowerCase();
      if (BINARY.has(ext)) fail(`binary asset in repo (this repo is text-only): ${full.slice(root.length + 1)}`);
    }
  }
})(root);

// CI reference copy present; if the workflow file is checked in, it must match.
const ci = join(root, '.github/workflows/ci.yml');
const ciRef = join(root, 'tools/ci.yml');
ok(existsSync(ciRef), 'missing tools/ci.yml (CI reference copy)');
if (existsSync(ci)) {
  ok(readFileSync(ci, 'utf8') === readFileSync(ciRef, 'utf8'),
    'tools/ci.yml and .github/workflows/ci.yml differ; keep the two in sync');
} else {
  notes.push('no .github/workflows/ci.yml checked in; tools/ci.yml is the copy to add');
}

if (failures.length) {
  for (const f of failures) console.error(`FAIL  ${f}`);
  console.error(`\nvalidate: ${failures.length} failure(s)`);
  process.exit(1);
}
console.log(`validate: PASS (${EXPECTED_SKILLS.length} skills, example project, text-only rule, CI sync)`);
