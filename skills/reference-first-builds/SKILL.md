# Reference-first builds ("make a game like X")

When the brief is "make a game like this one", the worst move is opening
the engine immediately. The game you are asked to be like already solved a
hundred design problems; study it first, then build.

## When to use

Any brief that names an existing game, genre touchstone or visual style:
"make something like Free Fire", "a game like this video", "this style".
This skill comes before game-direction-and-scope for those briefs; its
worksheet feeds the direction doc.

## Step 1: gather references, eyes first

1. **Ask the person for material first.** Photos, screen recordings, links,
  the exact moment in a video that made them want the game. Their picks
  tell you what they actually see in it, which is rarely the whole game.
2. **Then find more yourself.** Store pages, official screenshots, gameplay
  videos, reviews that describe the feel. Look at several sources; one
  trailer shows the best 30 seconds, not the game.
3. **Watch for the boring parts.** Menus, loading, the first minute, death
  and retry. That is where players actually live, and where copies fail.

## Step 2: the study worksheet

Fill this before writing any code. It turns "I want it like that" into
buildable facts.

| Question | Your notes |
|---|---|
| Core loop in one sentence? | |
| Camera: top-down / side / first-person / fixed? | |
| Primary control? Secondary? | |
| First 10 seconds after launch? | |
| HUD: what is always on screen, where? | |
| Character: proportions, silhouette, how it moves? | |
| Animation: what moves when the player acts? When idle? | |
| Pacing: how long is one round/session? | |
| Audio mood: busy, sparse, retro, cinematic? | |
| What would you keep? What would you change? | |

The last row matters most: a request to be "like X" is a starting point,
not a spec to duplicate. The changes are what make the game yours.

## Step 3: build or borrow, honestly

For every visual and audio element, decide where it comes from:

- **Make it yourself** (Blender for 3D characters and animation, code or
  a generator for effects) when you can match the quality the game needs.
  Your own work carries no licence risk and fits exactly.
- **Borrow a ready-made asset when it is genuinely better** than what you
  can make in the time you have, and only when its licence allows reuse.
  That is the sources in
  [free-assets-and-licence-check](../free-assets-and-licence-check/SKILL.md):
  Kenney, OpenGameArt, Freesound and similar, each with its licence checked
  and credited.

## The legal line, stated plainly

- **Studying a game is normal and fine.** Every designer does it. Mechanics,
  genre conventions and general ideas are the shared vocabulary of games.
- **A game's name, logo, characters, art, music, text and code are not
  yours**, and finding them on Google, Pinterest or any website does not
  change that. Web availability is not a reuse licence. Pinterest and image
  search are places to look and learn, never places to take assets from.
- So: learn the feel, the mechanics, the camera and the pacing from the
  reference. Recreate characters, art and animation yourself (Blender) or
  license them properly. Never trace, rip or re-upload someone else's
  assets.
- **Keep a visible distance**: your own name, your own logo, your own
  character design, your own colour choices. If a stranger could mistake
  your game for the reference, you are too close.

## Checklist

- [ ] Asked the requester for their reference material before searching
- [ ] Worksheet filled, including what to change, not only what to copy
- [ ] Every borrowed asset comes from a licence-checked source with a
  CREDITS.md row
- [ ] No asset taken from image search, Pinterest or another game's files
- [ ] Name, logo and character design are clearly your own
- [ ] Direction doc written from the worksheet (Gate 0 follows)
