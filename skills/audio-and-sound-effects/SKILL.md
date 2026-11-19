# Audio and sound effects

Sound is half the feel of a game and the cheapest half to get right.
Players forgive placeholder graphics; silence reads as broken.

## When to use

Workflow step 1 (generated placeholder sounds in the prototype) and step 3
(real asset pass). Also whenever a player action makes no noise: that is
always a bug.

## Buses first

Set up three buses before adding any sound: **Master > Music** and
**Master > SFX**. Every sound routes to one of them. Then the settings
screen's two volume sliders are just bus volumes, and muting music for
streamers/players is one fader. The example project creates the buses in
its `App` autoload (`scripts/app.gd`) and wires the settings sliders to
them.

## SFX: where to get them free

| Source | Licence | What to know |
|---|---|---|
| [Kenney audio packs](https://kenney.nl/) | CC0 | Clean, consistent game SFX; no attribution required |
| [Freesound](https://freesound.org/help/faq/#licenses) | CC0 / CC-BY 4.0 / CC-BY-NC 4.0 per sound | Check the licence on every sound's page. BY: credit the author. NC: never in anything you might monetize. |
| [OpenGameArt](https://opengameart.org/content/faq) | per asset | Mixed licences; read each asset's page, keep the attribution notice it asks for |
| [jsfxr](https://sfxr.me/) ([source](https://github.com/grumdrig/jsfxr)) | free generator | Procedural retro blips/jumps/explosions in the browser; you own what you generate. Perfect for placeholders that often survive to release. |
| **Generate in code** | yours | The example game synthesizes its jump/collect/click beeps at runtime (`scripts/audio.gd`). Zero downloads, zero licence work, surprisingly usable for arcade games. |

Music: original composition is cleanest; if you use library music, the
same licence rules apply as SFX. Whatever you pick, record it in
`CREDITS.md` with source URL and licence the moment it enters the project.

## Attribution formats (from the sources themselves)

Freesound's own suggested format:

```
"sound1" by user1 ( https://freesound.org/s/soundID/ ) licensed under CCBY 4.0
```

OpenGameArt's suggested format:

```
"[asset name]" by [author] licensed [licence]: [asset url]
```

## Technical rules (Godot 4)

1. **WAV for short SFX, Ogg Vorbis for music.** Short sounds need instant
   decode and tight loop-free playback; music streams. Wrong choice costs
   memory (long WAVs) or latency (compressed SFX).
2. **One AudioStreamPlayer per simultaneous sound, pooled.** A player
   plays one stream at a time; rapid-fire SFX need a small pool (4-8) or
   sounds cut each other off.
3. **Random pitch on repeat sounds.** `pitch_scale = 0.95..1.05` random
   per play keeps the 40th footstep from grating.
4. **Keep music 6-10 dB under SFX peaks** so action feedback always cuts
   through. Mix on the buses, not per-player, so it holds everywhere.
5. **Test on phone speakers, not headphones.** Thin speakers expose harsh
   high frequencies and missing mids that headphones hide.

## Checklist

- [ ] Music and SFX buses exist; every sound routed; settings sliders work
- [ ] Every downloaded sound's licence checked on its own page
- [ ] No CC-BY-NC asset in anything that could ever be monetized
- [ ] Every asset in CREDITS.md with URL, author and licence
- [ ] WAV for SFX, Ogg for music; SFX players pooled
- [ ] Listened on the target phone's speaker
