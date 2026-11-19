# Godot Android pipeline

The primary engine route: Godot 4 project to a signed APK installed on a
phone. Verified against the official docs (Godot 4.7, November 2026):
[Exporting for Android](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html).

## When to use

Any new game, by default. Godot is MIT, free for any use including
commercial, needs no account, and exports Android builds from Linux,
Windows and macOS. Choose the Unity route only for the reasons its skill
names.

## Which engine, honestly

| Situation | Route |
|---|---|
| Default: 2D or moderate 3D, small team, free-forever tooling | Godot |
| Existing Unity/C# experience or codebase | Unity |
| A specific Unity-only asset/plugin the game depends on | Unity |
| Console ports planned (Godot console export needs third parties) | Unity |
| Everything else | Godot |

## Setup, in order

1. **Godot editor.** Download 4.7.x stable from
   [godotengine.org/download](https://godotengine.org/download/). No
   installer, no account. The matching **export templates** install from
   inside the editor (Editor > Manage Export Templates) and must match the
   editor version exactly.
2. **OpenJDK 17.** The Android docs recommend JDK 17 for stability; higher
   versions work but 17 is the tested path.
3. **Android SDK** with these packages (per the 4.7 docs):
   platform-tools 35.0.0+, build-tools 35.0.1, platform android-35,
   command-line tools (latest), CMake 3.10.2.4988404, NDK r28b
   (28.1.13356709). Via Android Studio's SDK manager or the `sdkmanager`
   one-liner quoted in the docs. On Linux do not use the distribution's
   packaged SDK; it is usually outdated.
4. **Point Godot at both.** Editor Settings: Java SDK Path and Android SDK
   Path (the SDK dir must contain `platform-tools/adb`).
5. **Run the checker** below; it reports what is present and what is
   missing before you fight the export dialog.

```bash
node skills/godot-android-pipeline/scripts/check-android-env.mjs
```

## Export to a phone

1. Project > Export, add an **Android** preset. Set a unique package id
   (`com.yourname.gamename`; never leave the default).
2. Debug builds sign with the debug keystore automatically
   (`~/.android/debug.keystore`, created by the SDK). Release builds need
   your own keystore; back it up somewhere safe, losing it means you can
   never update the app again.
3. Launcher icons: main icon at least 192x192, adaptive icon background and
   foreground at least 432x432, critical elements inside the center 66 dp
   safe circle (per the docs' adaptive icon rules).
4. Enable developer mode + USB debugging on the phone, plug in, and use
   the editor's one-click deploy, or `adb install build.apk`.
5. Renderer choice for phones: **Compatibility (gl_compatibility)** for
   broad low-end support; Mobile renderer when you target mid/high-end and
   need its features. The example project uses Compatibility.

## Honest notes

- The Android APK **export** is not executed in this toolkit; this
  pipeline is documented from the official Godot docs. The env checker
  runs anywhere and reports which export prerequisites are present.
- "Could not install to device" with a package-name clash means an app
  with the same id but a different key is installed; uninstall it first
  (documented in the Godot docs).
- C# projects can export to Android from Godot 4.2+ but support is marked
  experimental in the docs; GDScript is the tested path for phones.

## Checklist

- [ ] Editor and export templates are the exact same version
- [ ] `check-android-env.mjs` passes
- [ ] Unique package id set
- [ ] Adaptive icon foreground/background at 432x432+, safe zone respected
- [ ] Release keystore created and backed up before first release build
- [ ] APK installed and launched on a real phone
