#!/usr/bin/env node
// Scaffold a new game workspace: direction.md, CREDITS.md, README.md.
// Usage: node new-game.mjs --name "Flood Courier" --dir ~/games/flood-courier [--force]
import { mkdirSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function parseArgs(argv) {
  const args = { force: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force') args.force = true;
    else if (a === '--name') args.name = argv[++i];
    else if (a === '--dir') args.dir = argv[++i];
    else if (a === '--json') args.json = true;
    else { console.error(`unknown argument: ${a}`); process.exit(2); }
  }
  if (!args.name || !args.dir) {
    console.error('usage: node new-game.mjs --name "Game Name" --dir <path> [--force] [--json]');
    process.exit(2);
  }
  return args;
}

function directionTemplate(name) {
  return `# Direction - ${name}

One page. Fill every field before opening the engine (Gate 0 in the
toolkit WORKFLOW).

- **Fantasy:** TODO - what the player gets to be or do. One line.
- **Core loop:** TODO - what the player does, repeatedly, ONE sentence.
- **First 10 seconds:** TODO - exactly what happens when the game opens.
- **Main control:** TODO - tap / swipe / drag / hold (pick one primary).
- **Camera:** TODO - top-down / side / first-person / fixed.
- **Session length:** TODO - how long one play lasts.
- **Three references:** TODO - real games close to this one. "Like X, but Y".
- **No-list:**
  1. TODO - thing this game will not have
  2. TODO
  3. TODO
- **Scope rung:** TODO - prototype / vertical slice / v1
- **Kill criteria:** TODO - what result makes you stop or change the loop
`;
}

function creditsTemplate(name) {
  return `# CREDITS - ${name}

Every third-party asset gets one row, added the moment the file enters the
project. Format and rules:
https://github.com/zyqorbusiness-lab/beast-game-builder/tree/main/skills/free-assets-and-licence-check

| Asset | Author | Licence | Source |
|---|---|---|---|
| (example row - replace) assets/sfx/jump.wav | Kenney | CC0 | https://kenney.nl/assets/interface-sounds |
`;
}

function readmeTemplate(name) {
  return `# ${name}

Built with the beast-game-builder toolkit
(https://github.com/zyqorbusiness-lab/beast-game-builder).

- Direction: direction.md (fill before coding)
- Asset credits: CREDITS.md (every third-party file, one row each)
- Workflow and gates: see the toolkit's WORKFLOW.md
`;
}

const args = parseArgs(process.argv);

if (existsSync(args.dir)) {
  const entries = readdirSync(args.dir);
  if (entries.length > 0 && !args.force) {
    console.error(`refusing: ${args.dir} exists and is not empty (use --force to add files anyway)`);
    process.exit(1);
  }
} else {
  mkdirSync(args.dir, { recursive: true });
}

const created = [];
for (const [file, content] of [
  ['direction.md', directionTemplate(args.name)],
  ['CREDITS.md', creditsTemplate(args.name)],
  ['README.md', readmeTemplate(args.name)],
]) {
  const path = join(args.dir, file);
  if (existsSync(path) && !args.force) continue;
  writeFileSync(path, content);
  created.push(path);
}

if (args.json) {
  console.log(JSON.stringify({ dir: args.dir, created }, null, 2));
} else {
  console.log(`created game workspace at ${args.dir}`);
  for (const p of created) console.log(`  ${p}`);
  console.log('next: fill direction.md, then Gate 0 in the toolkit WORKFLOW.md');
}
