# WORKFLOW - from idea to a game on a phone

The loop every game in this toolkit follows. Each step names the skill that
owns it and the gate that must pass before moving on. Skipping a gate is how
projects die at 80% done.

## First: the full plan, checked

Skill: [gravitas-thinking](skills/gravitas-thinking/SKILL.md)

No engine opens before the plan exists. Copy
[templates/game-plan.md](skills/gravitas-thinking/templates/game-plan.md)
into the game folder as `plan.md` and fill every section: fantasy, core
loop, first 10 seconds, references, controls, camera, session length,
levels, characters and animation, UI, sound, performance budget, scope,
milestones, kill criteria and the verification plan. The loop from here is
plan, playable test, checks, improve; the skill's six working agreements
govern every step below, and its adapters brief whichever model does the
work.

**Gate P:** `node skills/gravitas-thinking/scripts/plan-check.mjs path/to/game/plan.md`
passes with zero errors. A plan with TODO markers is not a plan.

## 0. Direction (half a page, not a novel)

Skill: [game-direction-and-scope](skills/game-direction-and-scope/SKILL.md)
(if the brief names an existing game, start one step earlier with
[reference-first-builds](skills/reference-first-builds/SKILL.md))

Write the one-page direction doc: the fantasy, the core loop in one sentence,
the main control, the camera, the session length, and three references.
Pick the scope ladder rung: prototype, vertical slice, or v1.

**Gate 0:** the core loop fits in one sentence and you can name what the
player does in the first 10 seconds. If you cannot, the idea is not ready;
shrink it until you can.

## 1. Prototype the fun, ugly

Skills: [touch-controls-and-input](skills/touch-controls-and-input/SKILL.md),
[game-feel-and-juice](skills/game-feel-and-juice/SKILL.md)

Build the core loop with placeholder shapes and generated sounds. No art, no
menus, no story. The example project
([examples/godot-hello-game](examples/godot-hello-game/)) is a starting
point: it already has input, audio buses and a scene flow.

**Gate 1:** the loop is playable on a real phone (not only in the editor)
and at least one person other than the builder played it and understood what
to do without explanation. If the loop is not fun with boxes and beeps, art
will not save it.

## 2. Frame the game around the fun

Skills: [opening-and-login-animation](skills/opening-and-login-animation/SKILL.md),
[game-ui-menus-and-hud](skills/game-ui-menus-and-hud/SKILL.md)

Add the shell: splash/intro animation, main menu, settings (volume sliders
wired to real audio buses), pause, game over, restart. Keep every intro
skippable.

**Gate 2:** a new player can go from app icon to playing in under 10 seconds
after the first launch, and every animation can be skipped with a tap.

## 3. Art and audio pass

Skills: [blender-character-pipeline](skills/blender-character-pipeline/SKILL.md),
[audio-and-sound-effects](skills/audio-and-sound-effects/SKILL.md),
[free-assets-and-licence-check](skills/free-assets-and-licence-check/SKILL.md)

Replace placeholders with real assets: your own Blender work or free assets
with checked licences. Record every asset in the game's `CREDITS.md` the
moment it enters the project, with source URL and licence. Sound first if the
budget forces a choice; players forgive simple art faster than silence.

**Gate 3:** `licence-check.mjs` passes on the game's `CREDITS.md`, and no
asset in the project lacks a line in it.

## 4. Performance and QA on real hardware

Skill: [android-performance-and-qa](skills/android-performance-and-qa/SKILL.md)

Profile on the cheapest phone the game targets, not the dev machine. Hit the
budgets (draw calls, texture memory, frame time) before adding anything else.

**Gate 4:** the QA checklist passes on a real Android phone: 10-minute
session, rotation, pause/resume, incoming interruption, no placeholder
assets left.

## 5. Build and share

Skill: [godot-android-pipeline](skills/godot-android-pipeline/SKILL.md)
(or [unity-pipeline](skills/unity-pipeline/SKILL.md))

Export a signed APK, install it on at least two different phones, and record
what was tested and what was not.

**Gate 5:** the APK installs and runs on two devices, and the release notes
say exactly what was verified and what remains untested.

## The rule that ties it together

Evidence over confidence. Every gate produces an artifact you can point to:
a direction doc, a playtest note, a passing licence check, a profiler
screenshot, a test record. "It should work" is not a gate.
