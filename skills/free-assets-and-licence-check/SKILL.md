# Free assets and licence check

Free assets make small games possible. Licences make them safe. The rule
of this toolkit: an asset enters the project only together with its
credits line. No line, no asset.

## When to use

Workflow step 3, and continuously: every time any file you did not make
enters the project, and again before every release (Gate 3 runs the
checker).

## The sources and their licences

Verified November 2026 against each site's own terms page:

| Source | Licence | Attribution | Terms page |
|---|---|---|---|
| [Kenney](https://kenney.nl/) | CC0 (public domain) | Not required; a "Kenney" mention is welcome | [kenney.nl/support](https://kenney.nl/support) |
| [OpenGameArt](https://opengameart.org/) | Per asset: CC0, CC-BY, CC-BY-SA, GPL, others | Follow each asset's Copyright/Attribution Notice | [opengameart.org/content/faq](https://opengameart.org/content/faq) |
| [Freesound](https://freesound.org/) | Per sound: CC0, CC-BY 4.0, CC-BY-NC 4.0 | Required for BY; format on the FAQ | [freesound.org/help/faq/#licenses](https://freesound.org/help/faq/#licenses) |
| [jsfxr](https://sfxr.me/) | You own your generated sounds | None | [github.com/grumdrig/jsfxr](https://github.com/grumdrig/jsfxr) |

Rules that keep you safe:

1. **NC (non-commercial) is a trap.** If there is any chance the game is
   ever monetized (ads, paid, donations), CC-BY-NC and Sampling+ assets
   are unusable. Treat them as off-limits by default.
2. **CC-BY means credit, every time, in the game.** The credits screen and
   `CREDITS.md` must name the author, the asset, the licence and the
   source URL. "Found it on the internet" is not a licence.
3. **Share-alike (SA) spreads.** CC-BY-SA and GPL assets can force your
   derivative asset under the same licence. Fine if deliberate; a surprise
   if not. Prefer CC0 and CC-BY for game assets.
4. **Trust the asset page, not the site.** Sites host mixed licences; the
   licence lives on each asset's own page. Check that page, not the site's
   homepage slogan.
5. **Screenshot the licence** (or copy its text) into your project's
   records when you download. Pages change; your record is your proof.

## The credits format

One Markdown table in the game's `CREDITS.md`. This exact column set is
what the checker validates:

```markdown
| Asset | Author | Licence | Source |
|---|---|---|---|
| assets/sfx/jump.wav | Kenney | CC0 | https://kenney.nl/assets/interface-sounds |
| assets/music/theme.ogg | Some Composer | CC-BY 4.0 | https://freesound.org/s/123456/ |
```

A row for every third-party file, plus a row for your own generated work
(mark it MIT or your choice). The example project's
[CREDITS.md](../../CREDITS.md) shows a filled one.

## The checker

```bash
node skills/free-assets-and-licence-check/scripts/licence-check.mjs path/to/game/CREDITS.md
```

Checks, per row: all four columns filled, the licence recognized
(CC0 / CC-BY / CC-BY-SA / GPL / MIT / Apache-2.0 / OFL / proprietary),
NC licences flagged as errors when `--commercial` is passed, the source is
a URL, and (with `--root <dir>`) every asset file under the project has a
row whose path matches. Exit code 1 on any failure, so CI and Gate 3 can
enforce it.

## Checklist

- [ ] Every third-party file has a CREDITS.md row with all four columns
- [ ] Every licence checked on the asset's own page
- [ ] No NC-licensed asset in a game that might be monetized
- [ ] Licence text/screenshot saved at download time
- [ ] `licence-check.mjs` passes, and runs again before every release
- [ ] In-game credits screen generated from the same data
