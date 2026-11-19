# Build a small rigged low-poly humanoid and export it as glTF (.glb).
# Study object for the beast-game-builder Blender character pipeline:
# model -> armature -> skin -> animate (one looped wave) -> export.
#
# Run headless:
#   blender -b -P make_lowpoly_character.py -- --out /tmp/character.glb
#
# Tested target: Blender 4.x/5.x bpy API. The script avoids version-sensitive
# calls where possible; if your Blender renamed an operator, the error line
# names it.

import bpy
import sys
import math
from mathutils import Vector


def parse_out_path():
    argv = sys.argv
    if "--" in argv:
        after = argv[argv.index("--") + 1:]
        if "--out" in after:
            return after[after.index("--out") + 1]
    return "/tmp/character.glb"


def clean_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def add_block(name, location, scale):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    # Bevel every edge a little so the blocks read as character, not crates.
    bevel = obj.modifiers.new(name="soft_edges", type="BEVEL")
    bevel.width = 0.04
    bevel.segments = 2
    return obj


def build_body():
    parts = []
    parts.append(add_block("torso", (0, 0, 1.1), (0.35, 0.2, 0.45)))
    parts.append(add_block("head", (0, 0, 1.75), (0.22, 0.2, 0.22)))
    parts.append(add_block("arm_l", (-0.5, 0, 1.15), (0.12, 0.12, 0.4)))
    parts.append(add_block("arm_r", (0.5, 0, 1.15), (0.12, 0.12, 0.4)))
    parts.append(add_block("leg_l", (-0.15, 0, 0.35), (0.14, 0.14, 0.35)))
    parts.append(add_block("leg_r", (0.15, 0, 0.35), (0.14, 0.14, 0.35)))

    # Join into one mesh (one skinned mesh per character, per the skill).
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join()
    body = bpy.context.active_object
    body.name = "character"
    return body


def build_armature():
    bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
    arm = bpy.context.active_object
    arm.name = "rig"
    edit = arm.data.edit_bones

    spine = edit["Bone"]
    spine.head = (0, 0, 0.7)
    spine.tail = (0, 0, 1.5)
    spine.name = "spine"

    head = edit.new("head")
    head.head = (0, 0, 1.5)
    head.tail = (0, 0, 1.95)
    head.parent = spine

    arm_r = edit.new("arm_r")
    arm_r.head = (0.3, 0, 1.4)
    arm_r.tail = (0.55, 0, 1.0)
    arm_r.parent = spine

    arm_l = edit.new("arm_l")
    arm_l.head = (-0.3, 0, 1.4)
    arm_l.tail = (-0.55, 0, 1.0)
    arm_l.parent = spine

    leg_r = edit.new("leg_r")
    leg_r.head = (0.15, 0, 0.7)
    leg_r.tail = (0.15, 0, 0.05)
    leg_r.parent = spine

    leg_l = edit.new("leg_l")
    leg_l.head = (-0.15, 0, 0.7)
    leg_l.tail = (-0.15, 0, 0.05)
    leg_l.parent = spine

    bpy.ops.object.mode_set(mode="OBJECT")
    return arm


def skin_mesh(body, arm):
    # Automatic weights get a blocky character 90% there; a production
    # character then needs manual weight-paint passes on the joints.
    body.select_set(True)
    arm.select_set(True)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.parent_set(type="ARMATURE_AUTO")


def add_wave_animation(arm):
    # One looped 24-frame wave: rotate the right arm bone up and down.
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="POSE")
    bone = arm.pose.bones["arm_r"]
    bone.rotation_mode = "XYZ"

    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 24
    scene.render.fps = 24

    frames = [(1, 0.0), (7, -2.2), (13, 0.0), (19, -2.2), (24, 0.0)]
    for frame, angle in frames:
        bone.rotation_euler = (0.0, angle, 0.0)
        bone.keyframe_insert(data_path="rotation_euler", frame=frame)

    # Linear-ish loops read better with smooth interpolation; set BEZIER
    # handles automatically (default) and mark the action for export.
    action = arm.animation_data.action
    action.name = "wave"
    bpy.ops.object.mode_set(mode="OBJECT")


def export_glb(path):
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        export_animations=True,
        export_animation_mode="ACTIONS",
        export_apply=True,          # apply modifiers on export
        export_yup=True,            # +Y up, what Godot and Unity expect
    )


def main():
    out = parse_out_path()
    clean_scene()
    body = build_body()
    arm = build_armature()
    skin_mesh(body, arm)
    add_wave_animation(arm)
    export_glb(out)
    print("exported rigged character to " + out)


main()
