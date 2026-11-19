# Game feel and juice

Game feel is why one coin grab satisfies and another feels like paperwork.
The mechanics can be identical; the feedback is the difference. These are
the cheap, proven techniques. Use them on events the player causes.

## When to use

Workflow step 1 (prototype), right after the loop works. Juice is not
polish to add at the end; it is how you find out whether the loop is
actually fun. A prototype with juice is honest; a dry prototype undersells
the idea.

## The toolkit, with numbers

1. **Hit pause.** Freeze or slow the game for 60-120 ms on a big impact
   (a hit, a goal, a near miss). 60 ms reads as punch; over 150 ms reads as
   lag. In Godot: `Engine.time_scale = 0.05` briefly, or pause a single
   subtree.
2. **Screenshake.** Offset the camera with fast-decaying random noise on
   impacts. Start at 4-8 px amplitude, decay over 200-300 ms. Shake on the
   player's success too, lightly; reserve big shakes for big events or they
   stop meaning anything.
3. **Squash and stretch.** Scale the sprite/body along its motion: stretch
   while moving fast, squash on landing or impact. 10-20% scale change,
   recovered over 150-250 ms with a spring or ease-out tween. The cheapest
   way to make a box feel alive.
4. **Particles on every event.** A burst on collect, a puff on land, sparks
   on hit. Small counts (8-20 particles), short lifetimes (0.3-0.8 s), one
   bright colour against the background. `GPUParticles2D` with
   `one_shot = true`, freed when finished.
5. **Sound on everything the player does.** Jump, land, collect, hit, UI
   tap. The audio skill owns sources; the rule here is coverage: any player
   action without a sound within 100 ms feels broken even if it looks fine.
6. **Anticipation and follow-through.** Big actions telegraph: a wind-up
   scale-down or colour flash 100-200 ms before the action, an overshoot
   after. Players read it as weight.
7. **Easing is the difference between robotic and alive.** Linear motion
   reads as machine. Default to ease-out for things arriving, ease-in for
   things leaving, elastic/back sparingly for playfulness. Tween table:

   | Moment | Easing | Duration |
   |---|---|---|
   | UI panel enters | ease-out cubic | 200-300 ms |
   | UI panel leaves | ease-in cubic | 150-250 ms |
   | Collect pop | ease-out back | 150-200 ms |
   | Damage flash | linear, 2-3 flashes | 300 ms total |

## Rules that keep juice honest

- **Juice follows causality.** Effects fire on things the player caused or
  that threaten them. Ambient effects everywhere just hide the signal.
- **Never juice at the cost of control.** Screenshake that moves the aim,
  hit pause during a dodge window, input locked during a celebration:
  feedback that fights the player is a bug.
- **Budget it on the target phone.** 20 bursts at once can hitch a cheap
  device. Cap simultaneous particle systems (pool them), and test with the
  performance skill's budgets.
- **Toggles for sensitivity.** Screenshake and flashing effects need a
  settings toggle; some players get motion sick, and flashing lights are an
  accessibility risk.

## Checklist

- [ ] Every player-caused event has at least one visual and one audio
  feedback
- [ ] Hit pause between 60 and 120 ms where used
- [ ] Screenshake decays under 300 ms and has a settings toggle
- [ ] No feedback effect blocks or redirects player input
- [ ] Particle bursts pooled or one-shot and freed
