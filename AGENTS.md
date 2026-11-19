# AGENTS.md - entry point for AI coding agents

You are an AI coding agent working in this repository or using it to build a
game. Read this first.

## How this repo is organized

- `skills/` - the craft. Each skill folder has a `SKILL.md` with rules,
  numbers and reasons, plus scripts where a script beats prose. Read the
  skill for the step you are on before writing code for that step.
- `WORKFLOW.md` - the order of work and the gate before each next step.
  Follow it; do not jump to art before the prototype gate passes.
- `examples/godot-hello-game/` - a working Godot 4 project that demonstrates
  the shell every game needs (splash, menu, settings, gameplay, pause).
  Copy it as a starting point instead of scaffolding from zero.
- `tools/`, `tests/` - repo self-checks. Run `npm run validate` and
  `npm test` after changing anything structural.

## Working discipline

The discipline in full lives in
[skills/gravitas-thinking](skills/gravitas-thinking/SKILL.md), adapted from
Gravitas (MIT): six working agreements, planning depth by risk, and a
verification hierarchy. Its [adapters](skills/gravitas-thinking/adapters/)
brief Gemini, Claude, ChatGPT or any other model with the same rules. The
short version:

1. **Declare your write scope.** Before editing, state the files you plan to
   create or change. Stay inside it; expand it explicitly if the work
   demands more.
2. **Execute before you claim.** "Done" means you ran the check the skill
   names: import passes, the scene runs headless, the licence check is
   green. If you could not run it, say exactly that and name what was not
   executed. Never write "tested" for "I read the code".
3. **Cite sources for engine facts.** Versions, export requirements and
   licence terms change. Check the official doc the skill links before
   repeating a requirement, and update the skill if the doc moved on.
4. **Preserve credits.** Every third-party asset enters the project's
   `CREDITS.md` with source URL and licence the moment it is added. Code
   that deletes or orphans a credits line is a bug.
5. **Free tools only.** Do not introduce paid assets, paid plugins or paid
   services. If a task seems to need one, stop and flag it.
6. **No engine-religion.** Godot is the primary route; Unity is a first-class
   route for the cases its skill names. Pick per the decision table in
   [skills/godot-android-pipeline](skills/godot-android-pipeline/SKILL.md)
   and say which you picked and why.

## The first session with a new game

1. Read `WORKFLOW.md` and `skills/gravitas-thinking/SKILL.md`. If the brief
   names an existing game, read `skills/reference-first-builds/SKILL.md`
   next; otherwise `skills/game-direction-and-scope/SKILL.md`.
2. Write the full plan with the human from
   `skills/gravitas-thinking/templates/game-plan.md`. Do not start coding
   before Gate P passes: `plan-check.mjs` runs clean on the plan.
3. Copy `examples/godot-hello-game/` as the project skeleton.
4. Build the core loop ugly. Prototype gate first, pretty later.
