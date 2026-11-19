# Game direction and scope

The skill that decides what the game is and, more importantly, what it is
not. Most failed game projects fail here: the idea never got small enough to
finish.

## When to use

At the start of every game, before any engine is opened. Revisit when a
project has been "almost done" for weeks: the answer is usually a scope cut
this skill should have forced earlier.

## The one-page direction doc

Half a page to one page, no more. Write it in the project's `direction.md`
(the scaffold script below creates it). Fields:

1. **Fantasy** - what the player gets to be or do. One line.
   "You are a delivery driver in a city that floods."
2. **Core loop** - what the player does, repeatedly, in one sentence.
   "Steer through traffic, grab parcels, reach the drop-off before the
   water rises." If the loop needs two sentences, the game is two games.
   Pick one.
3. **First 10 seconds** - exactly what happens when the game opens. Players
   quit faster than you think; the first 10 seconds carry the whole game.
4. **Main control** - one primary input. Tap, swipe, drag, or tilt. Phone
   games with three simultaneous inputs lose most players.
5. **Camera** - top-down, side, first-person, fixed. The camera decides half
   the art budget.
6. **Session length** - how long one play lasts. Hypercasual: under a
   minute. Midcore: 3-10 minutes. This sets level size and save frequency.
7. **Three references** - real games close to what you want. "Like X, but
   Y" is the fastest sentence in game design.
8. **The no-list** - three things this game explicitly will not have. This
   list protects the project from feature creep more than any other field.

## The scope ladder

Pick the rung before building. Never climb mid-project without a deliberate
decision.

- **Prototype** (days): one level, placeholder shapes, generated sounds.
  Goal: prove the loop is fun. Throwaway code is fine.
- **Vertical slice** (weeks): one level at full quality: real art, real
  audio, menus, game feel. Goal: prove the game is worth finishing. This is
  what you show people.
- **V1** (months): the full game: all levels, progression, settings,
  polish, store page if publishing. Only start v1 with a slice people
  actually asked to keep playing.

## Kill criteria

Decide these while you still like the idea:

- If the prototype is not fun after two real iterations on the loop (not on
  the art), kill it or change the loop, not the colours.
- If the vertical slice gets polite interest but no "can I play more",
  the loop is still the problem.
- A direction doc older than the project that no longer matches the game is
  a smell: either the doc or the game drifted. Fix one.

## Script: scaffold a new game workspace

```bash
node skills/game-direction-and-scope/scripts/new-game.mjs \
  --name "Flood Courier" --dir ~/games/flood-courier
```

Creates `direction.md` (all fields above, marked TODO), an empty
`CREDITS.md` in the format the licence checker expects, and a `README.md`
that points back to this repo's workflow.

## Checklist

- [ ] `direction.md` exists and every field is filled, including the no-list
- [ ] Core loop is one sentence
- [ ] Scope rung is chosen and written down
- [ ] First 10 seconds are described concretely, not "menu opens"
- [ ] Kill criteria are decided before building
