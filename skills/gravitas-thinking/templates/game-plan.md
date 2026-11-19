# Game plan - TODO game name

The full plan, written before any code. Fill every section; a TODO left
standing fails `plan-check.mjs` (Gate P in the toolkit WORKFLOW). Keep it
to one or two pages: a plan you cannot finish reading is a scope problem.

## Fantasy

TODO - what the player gets to be or do. One line.
"You are a delivery driver in a city that floods."

## Core loop

TODO - what the player does, repeatedly, ONE sentence. If the loop needs
two sentences, the game is two games; pick one.

## First 10 seconds

TODO - exactly what happens when the game opens. Players quit faster than
you think; the first 10 seconds carry the whole game.

## References

TODO - two to four real games closest to this one, with what you take from
each ("the drift feel from X", "the menu flow from Y"). For a "like X"
brief, follow the reference-first-builds skill: study gameplay, camera,
character and animation from real footage, and never copy proprietary
characters, logos or assets.

## Main control

TODO - one primary input: tap, swipe, drag or tilt. Phone games with three
simultaneous inputs lose most players.

## Camera

TODO - top-down, side, first-person or fixed. The camera decides half the
art budget.

## Session length

TODO - how long one play lasts. Hypercasual: under a minute. Level-based:
two to five minutes.

## Levels and progression

TODO - how many levels or waves for v1, what changes between them, how
difficulty ramps, what unlocks. Name the first five levels explicitly.

## Characters and animation

TODO - which characters exist, how each is made (own Blender work or free
assets with checked licences), and the animations each needs: idle, move,
the one signature action. List them per character.

## UI and menus

TODO - the screens in order: splash (skippable), main menu, settings with
real volume sliders, HUD during play, pause, game over, restart. Note the
HUD elements and where they sit on a phone screen.

## Sound and music

TODO - the sound list: one effect per core-loop action, one music loop,
the buses they route to (music, SFX, UI). Generated or free sources, named.

## Performance budget

TODO - the cheapest target phone, then the budgets: frame time, draw
calls, texture memory, APK size. Numbers, not "should run fine".

## Scope

TODO - the scope ladder rung: prototype, vertical slice or v1, and the
no-list: three things this game will NOT have.

## Milestones

TODO - the ordered steps, smallest playable first. Expected shape:
1. playable core-loop test (placeholder art), 2. checks pass, 3. improve
from evidence, 4. shell (menus, settings), 5. art and audio pass,
6. device QA, 7. APK.

## Kill criteria

TODO - what result makes you stop or change the loop ("playtester does not
understand the goal after two rounds", "core loop not fun with boxes and
beeps").

## Verification plan

TODO - the exact commands that prove each milestone: headless import and
run, the project's scene/interaction tests, plan-check, licence-check, and
which claims need a real phone before they may be made.
