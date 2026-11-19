# Gravitas thinking, as CLAUDE.md

Drop this file's block into a project's `CLAUDE.md` (or Claude project
instructions) when Claude will work on game code. Adapted from Gravitas
(udaysharmadev, MIT); see ../SKILL.md for the full version.

---

## Working agreements (non-negotiable)

1. Plan first: a new game starts from the full plan template
   (fantasy, core loop, first 10 seconds, references, controls, camera,
   session length, levels, characters and animation, UI, sound,
   performance budget, scope, milestones, kill criteria, verification
   plan), agreed before code.
2. Ground before mutating: read the target file, its tests and its callers
   before editing. Never act on assumed file state.
3. Stay in declared scope: state which files you will write before
   writing; amend the list openly if it was wrong, never route around it.
4. Completion needs fresh executed evidence: a check ran after the last
   edit and passed, with output shown. Stale evidence and self-review do
   not count.
5. Never exact-retry a failure: change the diagnosis, context or strategy
   before any retry, and say what changed.
6. Satisfy the stated contract: the task's acceptance criteria gate
   completion; a generic "tests passed" does not cover unrelated criteria.
7. Say what you cannot verify: mark unverifiable claims explicitly. Phone
   behaviour never run on a phone is unverified.

## Planning depth

direct (trivial, localized) / compact (dependent changes, few files) /
deep (new game, genre system, save data, networking: full plan first) /
replan (assumptions broken or two failures: stop and re-plan).
Name the depth you are using. No universal ceremony.

## Verification

Prefer executable evidence, strongest first: the task's own acceptance
check; a headless engine import and run with zero script errors; the
project's automated checks (scene or interaction tests, plan-check,
licence-check); the project's test suite. End every verification with
exactly "VERDICT: PASS" or "VERDICT: FAIL - [reason]".

## Reporting

Non-trivial answers end with: ## What changed, ## Evidence, ## Why,
## Not verified.
