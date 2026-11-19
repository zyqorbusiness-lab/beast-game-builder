import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const NEW_GAME = join(root, 'skills/game-direction-and-scope/scripts/new-game.mjs');
const LICENCE_CHECK = join(root, 'skills/free-assets-and-licence-check/scripts/licence-check.mjs');
const ENV_CHECK = join(root, 'skills/godot-android-pipeline/scripts/check-android-env.mjs');
const VALIDATE = join(root, 'tools/validate.mjs');
const CHECK_LINKS = join(root, 'tools/check-links.mjs');
const PLAN_CHECK = join(root, 'skills/gravitas-thinking/scripts/plan-check.mjs');
const PLAN_TEMPLATE = join(root, 'skills/gravitas-thinking/templates/game-plan.md');

function run(script, args, { allowFail = false } = {}) {
  try {
    return execFileSync('node', [script, ...args], { encoding: 'utf8' });
  } catch (e) {
    if (allowFail && e.stdout != null) return e.stdout;
    throw e;
  }
}

test('validate.mjs passes on this repo', () => {
  const out = run(VALIDATE, []);
  assert.match(out, /PASS/);
});

test('check-links.mjs passes on this repo', () => {
  const out = run(CHECK_LINKS, []);
  assert.match(out, /PASS/);
});

test('new-game.mjs scaffolds direction.md, CREDITS.md, README.md', () => {
  const dir = mkdtempSync(join(tmpdir(), 'new-game-'));
  const target = join(dir, 'my-game');
  const out = JSON.parse(run(NEW_GAME, ['--name', 'Test Game', '--dir', target, '--json']));
  assert.equal(out.created.length, 3);
  const direction = readFileSync(join(target, 'direction.md'), 'utf8');
  for (const field of ['Fantasy', 'Core loop', 'First 10 seconds', 'Main control', 'No-list', 'Kill criteria']) {
    assert.ok(direction.includes(field), `direction.md missing ${field}`);
  }
  // The scaffolded credits file passes the licence checker (with the example-row warning).
  const credits = run(LICENCE_CHECK, [join(target, 'CREDITS.md'), '--json']);
  assert.equal(JSON.parse(credits).ok, true);
});

test('new-game.mjs refuses a non-empty directory without --force', () => {
  const dir = mkdtempSync(join(tmpdir(), 'new-game-'));
  writeFileSync(join(dir, 'existing.txt'), 'keep me');
  assert.throws(() => run(NEW_GAME, ['--name', 'X', '--dir', dir]));
});

test('licence-check.mjs accepts a valid credits file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'credits-'));
  const file = join(dir, 'CREDITS.md');
  writeFileSync(file, `# CREDITS

| Asset | Author | Licence | Source |
|---|---|---|---|
| assets/sfx/jump.wav | Kenney | CC0 | https://kenney.nl/assets/interface-sounds |
| assets/music/theme.ogg | Some Composer | CC-BY 4.0 | https://freesound.org/s/123456/ |
`);
  const out = JSON.parse(run(LICENCE_CHECK, [file, '--json']));
  assert.equal(out.ok, true);
  assert.equal(out.rows, 2);
});

test('licence-check.mjs fails NC licences under --commercial', () => {
  const dir = mkdtempSync(join(tmpdir(), 'credits-'));
  const file = join(dir, 'CREDITS.md');
  writeFileSync(file, `| Asset | Author | Licence | Source |
|---|---|---|---|
| assets/sfx/hit.wav | Someone | CC-BY-NC 4.0 | https://freesound.org/s/999/ |
`);
  assert.throws(() => run(LICENCE_CHECK, [file, '--commercial']));
  // Without --commercial it is a warning, not a failure.
  const out = JSON.parse(run(LICENCE_CHECK, [file, '--json']));
  assert.equal(out.ok, true);
  assert.equal(out.warnings.length, 1);
});

test('licence-check.mjs fails empty cells and non-URL sources', () => {
  const dir = mkdtempSync(join(tmpdir(), 'credits-'));
  const file = join(dir, 'CREDITS.md');
  writeFileSync(file, `| Asset | Author | Licence | Source |
|---|---|---|---|
| assets/a.png |  | CC0 | the internet |
`);
  const out = JSON.parse(run(LICENCE_CHECK, [file, '--json'], { allowFail: true }));
  assert.equal(out.ok, false);
  assert.ok(out.errors.length >= 2);
});

test('licence-check.mjs --root flags asset files with no credits row', () => {
  const dir = mkdtempSync(join(tmpdir(), 'credits-root-'));
  mkdirSync(join(dir, 'assets'));
  writeFileSync(join(dir, 'assets', 'orphan.png'), 'fake png bytes');
  const file = join(dir, 'CREDITS.md');
  writeFileSync(file, `| Asset | Author | Licence | Source |
|---|---|---|---|
| assets/listed.png | Kenney | CC0 | https://kenney.nl/ |
`);
  const out = JSON.parse(run(LICENCE_CHECK, [file, '--root', dir, '--json'], { allowFail: true }));
  assert.equal(out.ok, false);
  assert.ok(out.errors.some((e) => e.includes('orphan.png')));
});

const PLAN_SECTIONS = [
  'Fantasy', 'Core loop', 'First 10 seconds', 'References', 'Main control',
  'Camera', 'Session length', 'Levels and progression',
  'Characters and animation', 'UI and menus', 'Sound and music',
  'Performance budget', 'Scope', 'Milestones', 'Kill criteria',
  'Verification plan',
];

function filledPlan() {
  return ['# Game plan - Flood Courier', ...PLAN_SECTIONS.map(
    (s) => `## ${s}\n\nA real answer for ${s}, long enough to be a plan.\n`,
  )].join('\n');
}

test('plan-check.mjs passes a fully filled plan', () => {
  const dir = mkdtempSync(join(tmpdir(), 'plan-'));
  const file = join(dir, 'plan.md');
  writeFileSync(file, filledPlan());
  const out = JSON.parse(run(PLAN_CHECK, [file, '--json']));
  assert.equal(out.ok, true);
  assert.equal(out.found, PLAN_SECTIONS.length);
  assert.equal(out.errors.length, 0);
});

test('plan-check.mjs fails the shipped template while it holds TODOs', () => {
  // The template must fail until every placeholder is replaced; this pins
  // the template and the checker to the same section list.
  const out = JSON.parse(run(PLAN_CHECK, [PLAN_TEMPLATE, '--json'], { allowFail: true }));
  assert.equal(out.ok, false);
  assert.equal(out.found, PLAN_SECTIONS.length);
  assert.ok(out.errors.length >= PLAN_SECTIONS.length - 1);
  assert.throws(() => run(PLAN_CHECK, [PLAN_TEMPLATE]));
});

test('plan-check.mjs fails a plan with missing sections', () => {
  const dir = mkdtempSync(join(tmpdir(), 'plan-'));
  const file = join(dir, 'plan.md');
  writeFileSync(file, '# Game plan - Half Done\n\n## Fantasy\n\nYou are a courier in a flooding city.\n');
  const out = JSON.parse(run(PLAN_CHECK, [file, '--json'], { allowFail: true }));
  assert.equal(out.ok, false);
  assert.ok(out.errors.some((e) => e.includes('missing section: "Kill criteria"')));
  assert.ok(out.errors.some((e) => e.includes('missing section: "Verification plan"')));
});

test('check-android-env.mjs reports JSON on any machine', () => {
  const out = JSON.parse(run(ENV_CHECK, ['--json']));
  assert.ok(Array.isArray(out.checks));
  assert.ok(out.checks.length >= 5);
  for (const c of out.checks) {
    assert.equal(typeof c.ok, 'boolean');
  }
});
