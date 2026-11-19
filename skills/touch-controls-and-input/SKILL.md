# Touch controls and input

On a phone, the controls are the game. A great loop with a bad joystick
plays like a bad game; an average loop with controls that disappear under
the fingers plays like a good one.

## When to use

Workflow step 1 (prototype). Input is part of the core loop, so it exists
from the first build. Revisit after every playtest where a player blames
themselves for a mistake the controls caused.

## Rules

1. **One primary input.** The direction skill picked it: tap, swipe, drag,
   or hold. Design around it. Every extra simultaneous input halves the
   audience that can play one-handed.
2. **Fixed controls lie, floating controls forgive.** A virtual joystick
   that spawns where the thumb lands (floating) beats a fixed pad for most
   action games: thumbs land in different places on different phones and
   hands. Fixed pads suit games where position itself is the skill.
3. **Deadzone 0.2 for analog input.** Below 0.15 stick noise triggers
   drift; above 0.3 the stick feels dead. Start at 0.2, tune per game.
4. **Input must not depend on frame rate.** Read input and apply movement
   in `_physics_process`, multiply by `delta`. A game that runs faster on a
   120 Hz phone is a bug, not a bonus.
5. **Desktop parity for free.** Map keyboard (and gamepad, cheap to add) to
   the same actions. You test on a laptop a hundred times more than on the
   phone; if the desktop build is unplayable, testing stops.
6. **Never read taps that started on UI.** Buttons and joysticks consume
   their events; gameplay code must not also see them. In Godot, UI
   Controls set `mouse_filter` to `STOP` and gameplay input lives behind
   `_unhandled_input`.

## The virtual joystick recipe (Godot 4)

The example project ships one (`scripts/virtual_joystick.gd`). The shape of
it:

- A `Control` covering the lower screen half, listening for `gui_input`.
- On press: record the touch point as the stick base, show base and knob.
- On drag: `offset = current - base`, clamp length to the knob radius
  (48-64 px at base resolution), normalized direction = offset / radius.
- On release: hide, direction back to zero.
- Gameplay reads `joystick.direction` (a `Vector2`, length 0..1). Multiply
  by speed and `delta`. That is the whole contract: the joystick owns touch
  state, the game owns movement.

Details that separate good from bad:

- Clamp the knob visually and the direction numerically to the same radius,
  or the visual and the response disagree.
- Let direction magnitude scale speed (push a little to walk), unless the
  game is digital by design.
- Give the knob a small dead zone of its own (about 8 px) so resting thumbs
  do not drift the character.

## InputMap hygiene

Define actions (`move_left`, `jump`, `pause`) instead of reading raw keys
in gameplay code. Then keyboards, gamepads and remapping screens all work
against the same names. Bind keys in one place (the example does it in the
`App` autoload) so the binding list is auditable.

## Checklist

- [ ] One primary input; every other input is optional or secondary
- [ ] Joystick deadzone around 0.2, knob radius clamped consistently
- [ ] Movement uses `_physics_process` and `delta`
- [ ] Keyboard mapping works on the desktop build
- [ ] UI touches never leak into gameplay input
- [ ] Played one-handed on a real phone for a full session
