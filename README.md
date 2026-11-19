# Beast Game Builder

One free toolkit for designing and building real Android games with an AI
coding agent: **13 craft skills** that teach the work, a **runnable Godot
example game** built from text and code only (no binary assets, CI executes
it), **licence and environment check scripts**, and a **workflow** with
evidence gates before anything ships. Every build starts from a full
written plan, checked by a script, under a model-neutral working
discipline adapted from [Gravitas](https://github.com/udaysharmadev/Gravitas)
(MIT).

Companion to [beast-website-builder](https://github.com/zyqorbusiness-lab/beast-website-builder):
that repo builds premium websites, this one builds games. Same house rules:
free tools only, claims backed by executed checks, credits for every
third-party asset.

| Piece | Tool | Licence / cost |
|---|---|---|
| Engine, primary route | [Godot 4.7](https://godotengine.org/) | MIT, free for any use |
| Engine, route B | [Unity 6 LTS](https://unity.com/) | Free under Unity Personal (< $200K USD revenue/funding in prior 12 months, [terms](https://unity.com/pricing)) |
| 3D characters and animation | [Blender 5.2 LTS](https://www.blender.org/) | GPL; your models and renders stay yours |
| Art and audio | Kenney, OpenGameArt, Freesound, jsfxr | CC0 / CC-BY / per-asset, see [free-assets-and-licence-check](skills/free-assets-and-licence-check/) |

## Quickstart

```bash
git clone <this repo>
cd beast-game-builder

# Repo self-check + smoke tests (Node >= 22, no dependencies)
npm run validate
npm test

# Check a game folder's asset credits for licence gaps
node skills/free-assets-and-licence-check/scripts/licence-check.mjs path/to/game/CREDITS.md

# Check whether this machine is ready to export Android APKs from Godot
node skills/godot-android-pipeline/scripts/check-android-env.mjs

# Run the example game headless for 120 frames (needs a Godot 4.7 binary)
godot --headless --path examples/godot-hello-game --import
godot --headless --path examples/godot-hello-game --quit-after 120
```

New game? Start with [WORKFLOW.md](WORKFLOW.md): the first gate is a
filled [game plan](skills/gravitas-thinking/templates/game-plan.md) that
passes `node skills/gravitas-thinking/scripts/plan-check.mjs path/to/game/plan.md`.
Coding agent? [AGENTS.md](AGENTS.md) is your entry point. Briefing Gemini,
Claude, ChatGPT or another model? Paste the matching adapter from
[skills/gravitas-thinking/adapters/](skills/gravitas-thinking/adapters/).

## What's inside

- **[skills/](skills/README.md)** - 13 self-contained skills. Each is a folder
  with a `SKILL.md` (rules, numbers, reasons), runnable scripts where a script
  is genuinely useful, and a pre-ship checklist. Covers the whole loop:
  a plan-first working discipline with per-model adapters,
  reference-first builds for "like X" briefs, game direction and scope,
  opening/login animation, menus and HUD, touch controls,
  game feel, the Godot Android pipeline, the Unity route, the Blender
  character pipeline, sound effects and music, free assets and licence checks,
  and Android performance/QA.
- **[examples/godot-hello-game/](examples/godot-hello-game/)** - a complete
  Godot 4 project: animated splash screen, main menu, settings with working
  volume sliders, a playable scene with a virtual joystick, pause menu,
  procedurally generated sound effects, and score. Every sound and shape is
  generated in code, so the repo stays text-only and licence-clean.
- **[tools/](tools/)** - `validate.mjs` (repo self-check) and
  `check-links.mjs` (internal Markdown links).
- **[tests/](tests/)** - dependency-free `node:test` smoke tests for every
  shipped script.
- **CI** - the workflow at [tools/ci.yml](tools/ci.yml) (checked in at
  `.github/workflows/ci.yml`) runs on every
  push: repo validation, smoke tests, Markdown link check, and a headless
  Godot job that imports the example project and runs it.
  Edit the workflow and keep the two copies in sync.

## The method in one paragraph

Game decisions come from the skills; engine steps follow the official
pipelines; nothing ships until its gate passes and the evidence exists.
"It works" means: the project imports clean, it runs headless without script
errors, the QA checklist on a real phone passes, and the credits file lists
every asset with its licence. The full loop: [WORKFLOW.md](WORKFLOW.md).

## Honest scope

- **Executed in this repo:** the Node scripts (validate, licence-check,
  android-env-check, new-game scaffold) run in CI, and the Godot example is
  imported and run headless in CI. That proves the project
  loads and its scripts execute; it does not prove it is fun or bug-free on
  a phone. The Blender character script was executed with Blender 5.2.4 LTS
  and its exported .glb verified (mesh, rig, animation clip present).
- **Not executed in this repo:** Android APK export (needs the Android SDK)
  and the Unity pipeline (needs Unity Hub). Each skill says exactly which
  steps were verified against official docs and which you must run yourself.
- Skills teach and scripts check; no toolkit guarantees a good game. Taste,
  playtesting and iteration do that.

## Credits and licence

Original work MIT, (c) 2026 Sujon Hoque (Zyqor Studio) - see [LICENSE](LICENSE).
Third-party tools keep their own licences: Godot is MIT, Blender is GPL,
Unity is proprietary with a free Personal tier. Asset sources and their
licence terms live in [skills/free-assets-and-licence-check](skills/free-assets-and-licence-check/);
full attribution in [NOTICE](NOTICE) and [CREDITS.md](CREDITS.md). This is an
independent bundle; no engine or asset project endorses it.
