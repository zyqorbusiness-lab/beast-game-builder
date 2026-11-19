# godot-hello-game

A minimal but complete Godot 4 game shell, built entirely from text and
code: no binary assets, nothing downloaded, nothing to license. Copy this
folder as the starting point for a new game (workflow step 1).

## What it demonstrates

- **Splash screen** (`scenes/splash.tscn`): fade in, hold, fade out,
  skippable with any tap from the first frame, per
  [opening-and-login-animation](../../skills/opening-and-login-animation/SKILL.md).
- **Main menu** (`scenes/menu.tscn`): Play / Settings / Credits / Quit,
  Android back handling, per
  [game-ui-menus-and-hud](../../skills/game-ui-menus-and-hud/SKILL.md).
- **Settings that do something**: Music and SFX sliders wired to real
  audio buses created in the `App` autoload (`scripts/app.gd`).
- **Playable scene** (`scenes/game.tscn`): a floating virtual joystick
  (`scripts/virtual_joystick.gd`) plus WASD/arrow keys, a collectible that
  teleports, score, squash-and-stretch feedback, per
  [touch-controls-and-input](../../skills/touch-controls-and-input/SKILL.md)
  and [game-feel-and-juice](../../skills/game-feel-and-juice/SKILL.md).
- **Pause menu**: resume / restart / quit to menu, game actually pauses.
- **Procedural sound effects**: jump-free sine beeps synthesized at
  runtime in `scripts/app.gd`. Zero downloads, zero licence work.

## Run it

With a Godot 4.7 binary:

```bash
# editor
godot --path examples/godot-hello-game --editor

# headless checks (what CI runs)
godot --headless --path examples/godot-hello-game --import
godot --headless --path examples/godot-hello-game --quit-after 120
```

## What "tested" means here

- **Executed:** the repo's CI imports this project headless and runs it
  for 120 frames (the full splash into the menu), failing on any script
  or scene error. The same commands above run locally.
- **Executed:** `tests/interaction_test.tscn` drives the real scenes
  with synthesized input (16 checks: menu buttons open/close the
  settings and credits panels, Play reaches the game, the joystick
  spawns under the thumb, dragging moves the player, release recentres,
  pause/resume works, main-menu returns without leaving the tree
  paused). It needs a display server for GUI input, so CI runs it
  under xvfb in the godot-example job. Locally:

  ```bash
  xvfb-run -a godot --path examples/godot-hello-game res://tests/interaction_test.tscn
  ```
- **Not executed:** on-device behaviour (touch feel, performance, audio
  output) and the Android APK export. The export pipeline is documented
  in [godot-android-pipeline](../../skills/godot-android-pipeline/SKILL.md).

## Where to go next

- Make it yours: replace the square and the orb with your game's core
  loop. The scene flow and audio wiring stay.
- Android build: [godot-android-pipeline](../../skills/godot-android-pipeline/SKILL.md).
- Real art and audio: [blender-character-pipeline](../../skills/blender-character-pipeline/SKILL.md),
  [audio-and-sound-effects](../../skills/audio-and-sound-effects/SKILL.md).
