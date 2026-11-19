# Gravitas thinking: full plan first, fresh evidence always

A model-neutral working discipline for AI coding agents on game builds,
adapted from the [Gravitas](https://github.com/udaysharmadev/Gravitas)
project (udaysharmadev, MIT). The original Gravitas is a reliability
runtime: hooks, validators and a CLI that *enforce* good habits. Most models
you will brief (Gemini on the web, ChatGPT, Claude, a repo-reading agent)
cannot run that runtime. This skill carries the part that survives without
it: the working agreements, phrased so any model can follow them, a full
game-plan template with a checker script, and a verification hierarchy wired
to this toolkit's own commands.

One honest line before the rules: **these agreements make any model's work
verifiable; they do not turn one model into another model.** No prompt can
do that. What the agreements remove are the failure modes that make
AI-built games look finished when they are not: coding before the plan
exists, ungrounded edits, silent scope creep, "done" with no evidence, and
the same failing export retried forever.

## When to use

Give it to any AI model before it writes or changes game code; read it
before any build, fix or review that uses this toolkit. The plan is
mandatory at the start of every new game: no engine opens before
`plan-check.mjs` passes. To brief a specific model, paste the matching file
from [adapters/](adapters/).

## The loop: plan, playable test, checks, improve

1. **Plan.** Copy [templates/game-plan.md](templates/game-plan.md) into the
   game's folder as `plan.md` and fill every section: fantasy, core loop,
   first 10 seconds, references, main control, camera, session length,
   levels and progression, characters and animation, UI and menus, sound
   and music, performance budget, scope, milestones, kill criteria and the
   verification plan. A plan with TODO markers is not a plan.
2. **Check the plan.** Run
   `node skills/gravitas-thinking/scripts/plan-check.mjs path/to/game/plan.md`.
   It must pass with zero errors before any code is written. This is Gate P
   in [WORKFLOW.md](../../WORKFLOW.md).
3. **Build the smallest playable test.** Placeholder shapes, generated
   sounds, the core loop only. The example project
   ([examples/godot-hello-game](../../examples/godot-hello-game/)) is the
   starting skeleton.
4. **Run the checks.** The verification hierarchy below, strongest first,
   each run fresh after the last edit.
5. **Improve from evidence.** Change what the evidence condemns, re-plan
   when the assumptions break, and re-run the plan check whenever scope
   moves.

## The six working agreements

1. **Ground before mutating.** Read the file you will change, its tests and
   its callers before editing. Never act on assumed file state; open it.
2. **Stay in declared scope.** Before writing, say which files you will
   touch. Writes stay inside that list. If the list was wrong, say so and
   amend it openly; do not route around it.
3. **Completion needs fresh, executed evidence.** "Done" means a check ran
   *after* your last edit and passed, and you paste the output. A green run
   from before the final change does not count. Neither does self-review.
4. **Never exact-retry a failure.** A failed approach may be retried only
   after something material changed: the diagnosis, the context or the
   strategy.
5. **Satisfy the stated contract.** The brief's acceptance criteria gate
   completion. "Tests passed" does not cover an unrelated criterion that
   was asked for.
6. **Say what you cannot verify.** Mark unverifiable claims explicitly and
   downgrade confidence instead of inventing certainty. "Not verified" is a
   normal, expected section of a report. Phone behaviour you never ran on a
   phone is unverified, full stop.

## Planning depth follows risk

No universal ceremony. Pick one and say which:

- **direct**: a trivial, localized change in files you have read.
- **compact**: dependent changes across a few files, moderate uncertainty.
- **deep**: a new game, a genre system, save data, networking, a broad art
  pass. Full plan first, plan agreed, then build.
- **replan**: evidence invalidated the assumptions, the scope grew, or an
  approach has failed twice. Stop and re-plan instead of pushing on.

Every new game starts at **deep**: the full plan template, checked.

## Verification hierarchy (games)

Prefer executable evidence over prose, strongest first:

1. The acceptance check named in the brief, run fresh.
2. The project imports and runs headless with zero script errors:
   `godot --headless --path <project> --import`, then
   `godot --headless --path <project> --quit-after 120`.
3. The project's own automated checks: scene or interaction tests where the
   project has them, `plan-check.mjs` on the plan, `licence-check.mjs` on
   the game's `CREDITS.md`.
4. Repo-level work: `npm run validate`, `npm test`, `npm run check-links`.
5. The device QA checklist in
   [android-performance-and-qa](../android-performance-and-qa/SKILL.md) on a
   real phone. Never write "works on phone" without it.
6. Independent review by a second model, then same-model self-review last;
   self-review alone never counts as completion evidence.

Every verification ends with exactly `VERDICT: PASS` or
`VERDICT: FAIL - [reason] with the failing output`.

## Reporting contract

Every non-trivial answer ends with:

```
## What changed
[files, behaviour]

## Evidence
[actual command output]

## Why
[the key decision's rationale]

## Not verified
[what you did not or could not check]
```

## Per-model adapters

Paste-ready versions of these agreements, shaped for each home:

| File | For |
|---|---|
| [adapters/gemini-saved-instructions.md](adapters/gemini-saved-instructions.md) | Gemini: saved instructions, a Gem, or the top of a Task-mode brief |
| [adapters/claude-md.md](adapters/claude-md.md) | Claude Code / Claude projects: a `CLAUDE.md` or project instruction |
| [adapters/chatgpt-custom-instructions.md](adapters/chatgpt-custom-instructions.md) | ChatGPT custom instructions (fits the length limit) |
| [adapters/agents-snippet.md](adapters/agents-snippet.md) | Repo-reading coding agents (Cursor, Codex, Aider, others): an `AGENTS.md` block |
| [adapters/any-model-prompt.md](adapters/any-model-prompt.md) | Any chat model: one prompt to paste at the start of a coding session |

## Checklist

- [ ] `plan.md` exists in the game folder and `plan-check.mjs` passes with
      zero errors; re-checked after the last scope change.
- [ ] Declared write scope matched the actual writes; amendments were said
      out loud.
- [ ] Every gate claim has fresh executed evidence pasted, not a stale run
      and not self-review.
- [ ] Each verification ended with a `VERDICT:` line.
- [ ] The report carries What changed / Evidence / Why / Not verified.
- [ ] No model-equivalence claims: never "this makes model X think like
      model Y". The rules make work verifiable; models stay themselves.

## Sources

Adapted from Gravitas by udaysharmadev (MIT): the six working agreements,
the planning tiers and the verification hierarchy. The runtime-specific
machinery (`gravitas` CLI, hooks, contract.json, validators) is not
reproduced here; it needs the upstream project. See
[CREDITS.md](CREDITS.md).
