# Android performance and QA

The game runs on a phone in someone's hand, on mobile data, at 30% battery.
This skill is about making that the test, not the surprise.

## When to use

Workflow step 4, before any release, and whenever the game grows a new
system (particles, enemies, scrolling). Performance work done late costs
ten times more than budgets kept from the start.

## Budgets (2D and light 3D, low-end Android target)

| Metric | Budget | Why |
|---|---|---|
| Frame time | 60 fps target, never below 30 sustained | Below 30 players feel it as broken |
| Draw calls | under ~200 per frame low-end | Each call is CPU work; they add up silently |
| Triangles on screen | under ~100k low-end | Fill and vertex cost on weak GPUs |
| Texture memory | under ~150 MB | Cheap phones kill apps that hog memory |
| Single texture | 2048x2048 max | Larger breaks old GPUs and wastes memory |
| Skinned bones | under ~50 per character | Skinning is per-frame CPU |
| APK size | under ~100 MB unless justified | Download size decides installs on mobile data |

These are starting budgets, not laws. The point is to have numbers and
measure against them, not to worship these exact ones.

## Measuring in Godot

- **Debug monitors**: Project Settings > Debug > Settings > ... or add
  monitors in code (`Performance.get_monitor(Performance.TIME_FPS)`,
  `RENDER_TOTAL_DRAW_CALLS_IN_FRAME`,
  `RENDER_VIDEO_MEM_USED`). A tiny FPS/draw-call label in a debug build
  pays for itself daily.
- **The profiler and monitors dock** in the editor show frame time spikes;
  profile on the phone via remote deploy, not only on the dev laptop.
- **Renderer**: Compatibility (gl_compatibility) for low-end reach, per
  the pipeline skill. The Mobile renderer earns its cost only with
  mid/high-end targets.

## The big three fixes (in order of usual payoff)

1. **Fewer draw calls**: batch sprites (shared atlases, one material),
   reuse canvases, hide what is off-screen.
2. **Smaller textures**: compress (VRAM compression on import), downscale
   to what the screen can show, atlas instead of many small files.
3. **Less per-frame work**: move work out of `_process` (timers, signals,
   caches), pool nodes instead of instancing/freeing in bursts, stop
   particles and timers on hidden scenes.

## Device QA checklist (Gate 4)

Run on the cheapest phone you target, real hardware, not an emulator:

- [ ] 10-minute continuous session: no crash, no growing slowdown
  (memory leak smell), no heavy heat
- [ ] Rotation: layout holds, no stretched or cropped UI
- [ ] Pause/resume: home button out and back, game pauses and resumes
  clean; audio stops and returns
- [ ] Interruption: receive a call mid-game; the game survives and resumes
- [ ] Fresh install: first-launch flow works (splash, first 10 seconds,
  no dead screens)
- [ ] Airplane mode: nothing hangs waiting on network (unless the game
  states it needs network)
- [ ] Low battery / battery saver mode: still playable
- [ ] No placeholder assets left (run the licence checker with `--root`)

## Honest notes

- Emulators are for iteration speed, not for verdicts. Touch feel, thermals
  and real GPU behaviour only exist on hardware.
- Record what you tested (devices, Android versions, session length) in the
  release notes. "Tested on my phone" is one data point; say which phone.

## Checklist

- [ ] Budgets chosen and written into the project README
- [ ] FPS + draw-call monitor visible in debug builds
- [ ] The big three fixes applied where measurements say to
- [ ] Full device QA checklist passed on the cheapest target phone
- [ ] Test record written into release notes
