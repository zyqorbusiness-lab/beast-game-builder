# Skills

Eleven self-contained skills, one per folder. Each `SKILL.md` follows the
same contract: when to use it, the rules with numbers and reasons, and a
pre-ship checklist. Scripts live in the skill's `scripts/` folder and run
with Node >= 22 or Python 3, no dependencies.

| # | Skill | What it owns | Script |
|---|---|---|---|
| 1 | [reference-first-builds](reference-first-builds/SKILL.md) | "Like X" briefs: gather and study references, build-or-borrow, the legal line | - |
| 2 | [game-direction-and-scope](game-direction-and-scope/SKILL.md) | One-page direction doc, scope ladder, kill criteria | `new-game.mjs` scaffolds a game workspace |
| 3 | [opening-and-login-animation](opening-and-login-animation/SKILL.md) | Splash/intro animation, profile flow, skippability | - |
| 4 | [game-ui-menus-and-hud](game-ui-menus-and-hud/SKILL.md) | Menu flow, settings with real volume buses, phone HUD | - |
| 5 | [touch-controls-and-input](touch-controls-and-input/SKILL.md) | Virtual joystick, touch buttons, InputMap, deadzones | - |
| 6 | [game-feel-and-juice](game-feel-and-juice/SKILL.md) | Hit pause, screenshake, squash and stretch, easing | - |
| 7 | [godot-android-pipeline](godot-android-pipeline/SKILL.md) | Godot setup to signed APK on a phone | `check-android-env.mjs` |
| 8 | [unity-pipeline](unity-pipeline/SKILL.md) | When Unity, setup to Android build, Personal licence | - |
| 9 | [blender-character-pipeline](blender-character-pipeline/SKILL.md) | Model, rig, animate, export glTF, import to engine | `make_lowpoly_character.py` |
| 10 | [audio-and-sound-effects](audio-and-sound-effects/SKILL.md) | Buses, SFX vs music, free sources, import settings | - |
| 11 | [free-assets-and-licence-check](free-assets-and-licence-check/SKILL.md) | Asset source table, licence rules, credits format | `licence-check.mjs` |
| 12 | [android-performance-and-qa](android-performance-and-qa/SKILL.md) | Budgets, profiling, device QA checklist | - |

Brief names an existing game? Start with
[reference-first-builds](reference-first-builds/SKILL.md). Otherwise start
with [game-direction-and-scope](game-direction-and-scope/SKILL.md).
[WORKFLOW.md](../WORKFLOW.md) names which skill owns each step.
