# Gravitas thinking, as an AGENTS.md block

Repo-reading coding agents (Cursor, Codex, Aider and others that honour
`AGENTS.md`) pick this file up automatically at the repo root. Paste the
block into the game project's `AGENTS.md`. Adapted from Gravitas
(udaysharmadev, MIT); full version in ../SKILL.md.

---

## Working agreements for coding agents in this repo

1. Plan first: no engine code before the game has a filled plan
   (plan.md from the toolkit template) and its plan check passes.
2. Ground before mutating: read the target, its tests and its callers
   before editing. Never act on assumed file state.
3. Declared scope: list the files you will write before writing. Writes
   stay inside the list; amend it openly if wrong.
4. Fresh executed evidence: completion means a check ran after the last
   edit and passed, with output. Self-review alone never counts.
5. No blind retries: a failed approach is retried only after the
   diagnosis, context or strategy changed. Say what changed.
6. Contract first: the task's stated acceptance criteria gate completion.
7. Honest limits: mark what you could not verify instead of claiming it.
   "Works on phone" requires a real device run.

Planning depth follows risk: direct / compact / deep / replan. Name it.
Verifications end with exactly `VERDICT: PASS` or
`VERDICT: FAIL - [reason]`.
Reports end with: What changed / Evidence / Why / Not verified.
