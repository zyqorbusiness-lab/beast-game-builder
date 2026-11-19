# Blender character pipeline

From nothing to an animated 3D character walking around inside your engine.
Blender is GPL free software; whatever you create with it (models,
animations, renders, .blend files) is entirely yours, commercial use
included. Verified against [blender.org/about/license](https://www.blender.org/about/license/)
and the 5.2 LTS line ([blender.org/download/lts](https://www.blender.org/download/lts/)).

## When to use

Workflow step 3, when the game needs custom 3D characters or props that
free asset packs do not cover. Also for learning: one rigged character
teaches you more about game art than ten tutorials watched.

## The pipeline, end to end

1. **Block out the shape.** Start from primitives (cubes, UV spheres),
   never from sculpting. Use a Mirror modifier so you model one side.
   Target low-poly for phones: 500-5,000 triangles for a character reads
   clean and renders fast; dense meshes are for close-up cinematics, not
   gameplay.
2. **Apply scale before anything downstream** (`Ctrl+A` > Scale). Export
   scale bugs (100x too big/small in the engine) are almost always
   unapplied scale.
3. **Rig.** Enable the bundled **Rigify** add-on (Edit > Preferences >
   Add-ons), drop a human meta-rig, align bones to your mesh in Edit mode,
   then Generate Rig. For creatures or simple props, a hand-built armature
   with a handful of bones is often faster.
4. **Skin.** Parent mesh to rig with automatic weights
   (`Ctrl+P` > With Automatic Weights), then fix the bad spots in Weight
   Paint mode. Elbows and knees always need manual passes; plan for it.
5. **Animate.** Keyframe in the Dope Sheet / Action Editor. One action per
   clip (idle, walk, run, wave), pushed to the NLA so the exporter sees
   them as separate clips. Loop points matter: first and last frame of a
   walk cycle must match.
6. **Export glTF (.glb).** File > Export > glTF 2.0. Settings that matter:
   include animations, export each NLA track/action as its own clip,
   apply modifiers. glTF is the format both Godot 4 and Unity import
   natively; avoid FBX round-trips when glTF works.
7. **Import and verify in the engine.** Godot: drag the .glb in, open the
   inherited scene, find the `AnimationPlayer`, play each clip. Unity:
   drop it in Assets, set the rig to Humanoid or Generic on the importer,
   wire clips in an Animator Controller.

## Headless example script

`scripts/make_lowpoly_character.py` builds a small rigged low-poly
humanoid (block body, head, arms, legs, armature, one looping wave
animation) and exports `character.glb`, entirely from code:

```bash
blender -b -P skills/blender-character-pipeline/scripts/make_lowpoly_character.py -- --out /tmp/character.glb
```

Use it to learn the full model-rig-animate-export chain in one readable
file, then open the result in Blender to study the rig. Executed status:
run headless with Blender 5.2.4 LTS on 2026-11-19; the exported .glb
contains one mesh, one skinned armature (6 bones) and the looped "wave"
clip. Treat the output as a study object, not production art.

## Phone budgets for 3D characters

- Triangles: 500-5,000 per on-screen character; total scene under ~100k
  on low-end targets.
- Bones: under ~50 per character; every bone costs CPU per frame.
- Textures: one 1024x1024 atlas per character beats four materials.
- One skinned mesh per character; avoid multiple skinned parts.

## Checklist

- [ ] Scale applied on mesh and armature before export
- [ ] Animations exported as separate clips (visible in the engine's
  animation list)
- [ ] Character plays its clips in the engine, at the right scale
- [ ] Triangle and bone counts inside the phone budgets above
- [ ] The .blend source is kept next to the export, and both are yours
  (Blender output carries no licence duty)
