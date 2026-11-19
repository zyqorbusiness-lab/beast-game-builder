# Opening and login animation

The first thing a player sees. A good opening sets the game's tone in
seconds and then gets out of the way. A bad one is an unskippable 15-second
logo parade that teaches the player to hate the game before playing it.

## When to use

Workflow step 2 (frame the game), once the core loop is fun. Also whenever
an intro animation exists that nobody has timed with a stopwatch.

## Rules

1. **Skippable, always.** Every intro animation ends instantly on tap or
   any button. No exceptions, not even "but the story". Put the skip in on
   day one; retrofitting it is harder.
2. **Short.** First-launch intro: 2-4 seconds of animation, then the menu.
   Studio/logo splash: under 1.5 seconds, and only on cold start, never on
   resume. If your splash needs 5 seconds to look cool, cut it to the best
   2.
3. **Animate while loading, not instead of loading.** The splash exists to
   cover the first scene load. Preload the menu behind the animation so the
   transition is instant when the player taps.
4. **Say the game's name and show its face.** The intro should show the
   game title in the game's own style (its font, its colours, its mood).
   A generic spinning logo is a wasted first impression.
5. **Motion recipe that works:** fade in (200-300 ms), hold with a subtle
   pulse or parallax drift (1-2 s), quick fade or slide out (200-400 ms).
   Ease out on entrances, ease in on exits. Bounce easing reads playful,
   cubic reads clean.
6. **Sound helps more than length.** One short logo sting or whoosh over a
   2-second intro feels more polished than a longer silent animation. Route
   it through the SFX bus so the volume slider controls it.

## "Login" screens: what is honest to build

Players mean different things by "login screen". Three tiers:

- **Profile select (offline, build this first).** "Who is playing?" with
  saved local profiles (name, progress). No network, no password, works in
  airplane mode. The example project shows the flow: splash to menu to
  playing.
- **Online account (needs a backend).** Real accounts need a server that
  stores credentials safely. That is a service, not a game feature: it has
  running costs, privacy duties and abuse handling. Free tiers exist, but
  each is a product with its own terms; pick deliberately, not by default.
- **Never fake it.** A login form that accepts anything, or stores
  passwords in plain text locally, teaches bad habits and leaks data. If
  there is no backend, there is no password field. Profile select covers
  the actual need for most small games.

## Implementation notes (Godot 4)

- Animate with `AnimationPlayer` for anything you want to tweak visually,
  or `SceneTreeTween` in code for simple fades/slides. The example project's
  `scenes/splash.tscn` + `scripts/splash.gd` show the tween version,
  including the tap-to-skip.
- Change scenes with `get_tree().change_scene_to_file(...)`. For heavy
  menus, load in the background with `ResourceLoader.load_threaded_request`
  during the splash.
- Pause the intro's timers when the app loses focus; a splash that
  continues under an incoming call feels broken.

## Checklist

- [ ] Intro is skippable with one tap from the first frame
- [ ] Cold-start splash under 1.5 s, first-launch intro under 4 s
- [ ] Menu is loaded by the time the animation ends
- [ ] Intro sound goes through the SFX bus
- [ ] No password field without a real backend
- [ ] Timed with a stopwatch on a real phone, not estimated
