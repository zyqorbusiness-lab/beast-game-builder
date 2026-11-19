# Unity pipeline

Route B. Unity is the right pick for the cases in the decision table in
[godot-android-pipeline](../godot-android-pipeline/SKILL.md): existing C#
experience, Unity-specific assets, or console plans. It is free to start,
but it is a commercial product with accounts, licence terms and a heavier
install. Go in with eyes open.

## When to use

When the decision table says Unity, and only then. If you are here because
"Unity is what big games use", read the table again; that is not a reason
by itself.

## Licence reality (verified November 2026, [unity.com/pricing](https://unity.com/pricing))

- **Unity Personal is free** for individuals, hobbyists and small
  businesses under **$200K USD** revenue or funding in the prior 12 months.
  That covers learning and shipping indie games.
- Unity needs a Unity account and sign-in in the Hub/editor. It is not
  anonymous tooling like Godot.
- Terms change at Unity's discretion. Re-check the pricing page before
  committing a commercial project; do not rely on memory or on this file.

## Setup

1. **Unity Hub** (the installer/manager) from
   [unity.com/download](https://unity.com/download). On Linux, Unity
   provides an official Hub; check the download page for your distro.
2. **Pick an LTS editor.** As of November 2026 the supported lines are
   Unity 6.0 LTS (support through October 2026) and Unity 6.3 LTS (support
   until December 2027), per
   [unity.com/releases/unity-6](https://unity.com/releases/unity-6).
   Prefer the newest LTS line unless a dependency pins you.
3. **Install the Android Build Support module** with the editor (includes
   the SDK/NDK/OpenJDK Unity needs; let Unity manage them rather than
   pointing it at system installs).
4. Sign in, activate the Personal licence from the Hub.

## First Android build

1. New project from the **2D (Core)** or **Universal 3D** template, or the
   mobile templates when offered; start minimal.
2. File > Build Profiles (or Build Settings in older versions): switch
   platform to **Android**.
3. Set the package id (Player Settings > Other Settings > Identification):
   `com.yourname.gamename`, unique per game.
4. Build produces an APK (or AAB for store upload). Install with
   `adb install`, or use Build and Run with the phone connected and USB
   debugging on.
5. First session goal: an empty scene with one cube or sprite on the
   phone's screen. Everything after that is iteration.

## Unity notes for someone coming from Godot

- Scenes and prefabs map to Godot scenes; GameObjects with components map
  to nodes. The mental model transfers, the names do not.
- Scripting is C# (`MonoBehaviour`, `Update`/`FixedUpdate` for Godot's
  `_process`/`_physics_process`).
- Unity's input: the new Input System package or the legacy Input Manager;
  pick one per project, do not mix.
- The editor is heavy. On a modest laptop, Godot will feel much faster;
  close other apps, prefer LTS, and keep projects small while learning.

## Honest notes

- Nothing in this skill is executed in this repo: Unity cannot run in CI
  here. Steps are from Unity's official pages as of November 2026; the Hub
  walks you through anything that has moved.
- Unity's free tier requires you to stay under the revenue threshold and
  follow the current terms, including any splash/branding requirements the
  current version shows in Player Settings.

## Checklist

- [ ] Decision table says Unity, and the reason is written in direction.md
- [ ] Newest LTS line installed with Android Build Support
- [ ] Personal licence eligibility confirmed against the current terms
- [ ] Unique package id set
- [ ] Empty scene built to APK and run on a real phone
