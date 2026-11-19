# Game UI: menus and HUD

Menus are how the player reaches the fun; the HUD is how they read the game
while having it. Both fail quietly: nobody praises a good menu, everybody
abandons a bad one.

## When to use

Workflow step 2, after the prototype gate. Revisit whenever a screen has
more than one new button added "just for now".

## Menu flow map

Draw this before building UI. The minimum viable flow for most games:

```
splash -> main menu -> play -> gameplay <-> pause menu -> resume / restart / quit to menu
                  \-> settings (volume, controls)
                  \-> credits
```

Rules:

1. **One obvious primary action per screen.** On the main menu it is Play,
   visually bigger and placed where the thumb rests. If two buttons compete,
   the screen is wrong.
2. **Back always works.** Every screen reaches its parent with the system
   back button/gesture on Android, not only with an on-screen button. In
   Godot, handle `NOTIFICATION_WM_GO_BACK_REQUEST` or map the `ui_cancel`
   action.
3. **Settings must do something real.** A volume slider wired to an audio
   bus is a feature; a slider that moves and changes nothing is a lie.
   Wire Music and SFX sliders to their buses on day one (the example
   project shows how, see `scripts/settings_panel.gd`).
4. **Credits are not optional** the moment any third-party asset ships. The
   licence skill's `CREDITS.md` and the in-game credits screen come from the
   same data.

## HUD on phones

1. **Respect safe areas.** Notches and gesture bars eat screen edges. Keep
   interactive elements inside the safe area; in Godot use
   `DisplayServer.get_display_safe_area()` and anchor Controls to it.
2. **Touch targets 48 dp minimum.** Smaller buttons cause missed taps and
   mis-taps on neighbours. 48 dp is the Android guideline; treat it as a
   floor, not a target.
3. **Thumb zones decide placement.** Primary controls sit in the lower
   half, reachable without moving the grip. Top corners are for glanceable
   info (score, timer), never for buttons pressed mid-action.
4. **Readable at arm's length.** Body text at least 16 sp equivalent;
   score/timer bigger. Test outdoors in daylight on the cheapest target
   phone, brightness mid.
5. **The HUD shows state, the game shows action.** Health, score, ammo,
   timer: always visible or one glance away. Anything the player must
   remember is a design bug the HUD should fix.

## Godot notes

- Build menus from `Control` nodes with anchors and containers
  (`VBoxContainer`, `MarginContainer`); absolute positions break on other
  screen sizes. Set the project stretch mode to `canvas_items` with aspect
  `expand` (the example project's `project.godot` does).
- One `Theme` resource for the whole UI beats per-node overrides: change
  the font once, everywhere updates.
- Keep the HUD a separate `CanvasLayer` above the game world so camera
  movement never drags it.

## Checklist

- [ ] Flow map drawn; no screen more than one tap from its parent
- [ ] Play is the biggest, thumb-reachable button on the main menu
- [ ] Android back button works on every screen
- [ ] Volume sliders change actual bus volumes
- [ ] All touch targets at least 48 dp, all inside the safe area
- [ ] Credits screen lists every third-party asset from CREDITS.md
