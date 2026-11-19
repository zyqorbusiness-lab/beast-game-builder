# Build a small rigged low-poly humanoid and export it as glTF (.glb).
# Study object for the beast-game-builder Blender character pipeline:
# model -> armature -> skin -> animate (one looped wave) -> export.
#
# The body is built from overlapping blocks joined into ONE mesh, with
# every joint (shoulders, neck, hips) embedded inside the neighbouring
# block. That is what keeps the silhouette connected at rest and under
# animation: automatic weights blend across the overlaps, so a rotating
# limb never opens a gap. Disjoint floating blocks are the classic
# beginner failure this script exists to avoid.
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
from mathutils import Vector, Quaternion


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
    # size=2.0 cube, so `scale` is each axis's HALF-extent: a block at
    # z=1.05 with scale z=0.50 spans z 0.55..1.55. The layout comments
    # below all use half-extents; getting this wrong halves every part
    # and turns designed overlaps into floating gaps.
    bpy.ops.mesh.primitive_cube_add(size=2.0, location=location)
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
    # Every part overlaps its neighbour; nothing floats.
    parts = []
    # Torso: z 0.55..1.55, x -0.38..0.38, y -0.22..0.22
    parts.append(add_block("torso", (0, 0, 1.05), (0.38, 0.22, 0.50)))
    # Pelvis: z 0.44..0.80, overlaps torso bottom and both legs.
    parts.append(add_block("pelvis", (0, 0, 0.62), (0.32, 0.20, 0.18)))
    # Neck: z 1.34..1.62, wide enough to read as a connector, embedded
    # deep in both the torso top (1.55) and the head bottom (1.46).
    parts.append(add_block("neck", (0, 0, 1.48), (0.13, 0.12, 0.14)))
    # Head: z 1.46..1.94, overlaps the neck by 0.16.
    parts.append(add_block("head", (0, 0, 1.70), (0.24, 0.22, 0.24)))
    # Shoulder caps: centered on the shoulder pivot, half sunk into the
    # torso. They rotate with the arm like a ball joint, so the shoulder
    # stays connected through the whole swing.
    parts.append(add_block("shoulder_l", (-0.26, 0, 1.42), (0.20, 0.18, 0.18)))
    parts.append(add_block("shoulder_r", (0.26, 0, 1.42), (0.20, 0.18, 0.18)))
    # Arms: inner end (x 0.22) reaches past the shoulder pivot into the
    # chest. z 0.70..1.54.
    parts.append(add_block("arm_l", (-0.36, 0, 1.12), (0.14, 0.14, 0.42)))
    parts.append(add_block("arm_r", (0.36, 0, 1.12), (0.14, 0.14, 0.42)))
    # Legs: tops (z 0.64) sunk into the pelvis. z 0.00..0.64.
    parts.append(add_block("leg_l", (-0.14, 0, 0.32), (0.15, 0.15, 0.32)))
    parts.append(add_block("leg_r", (0.14, 0, 0.32), (0.15, 0.15, 0.32)))

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
    spine.head = (0, 0, 0.55)
    spine.tail = (0, 0, 1.50)
    spine.name = "spine"

    head = edit.new("head")
    head.head = (0, 0, 1.50)
    head.tail = (0, 0, 1.95)
    head.parent = spine

    # Shoulder pivots sit deep inside the torso volume (x 0.24, well
    # within the 0.38 half-width), centered in the shoulder cap blocks.
    arm_r = edit.new("arm_r")
    arm_r.head = (0.24, 0, 1.42)
    arm_r.tail = (0.50, 0, 0.85)
    arm_r.parent = spine

    arm_l = edit.new("arm_l")
    arm_l.head = (-0.24, 0, 1.42)
    arm_l.tail = (-0.50, 0, 0.85)
    arm_l.parent = spine

    leg_r = edit.new("leg_r")
    leg_r.head = (0.14, 0, 0.62)
    leg_r.tail = (0.14, 0, 0.06)
    leg_r.parent = spine

    leg_l = edit.new("leg_l")
    leg_l.head = (-0.14, 0, 0.62)
    leg_l.tail = (-0.14, 0, 0.06)
    leg_l.parent = spine

    bpy.ops.object.mode_set(mode="OBJECT")
    return arm


def skin_mesh(body, arm):
    # Automatic weights over the overlapping blocks give smooth blended
    # joints for free; a production character then adds manual
    # weight-paint passes to sharpen the creases.
    body.select_set(True)
    arm.select_set(True)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.parent_set(type="ARMATURE_AUTO")


def world_axis_rotation(arm, bone_name, world_axis, angle):
    # Pose-bone eulers are bone-local, which makes "raise the arm
    # sideways" painful to express. Build the rotation about a world
    # axis instead and convert it into the bone's local space.
    bone = arm.pose.bones[bone_name]
    rest_world = (arm.matrix_world @ bone.bone.matrix_local).to_quaternion()
    world_q = Quaternion(world_axis, angle)
    bone.rotation_mode = "QUATERNION"
    bone.rotation_quaternion = rest_world.inverted() @ world_q @ rest_world


def add_wave_animation(arm):
    # One looped 24-frame wave: the right arm raises sideways-up (a
    # rotation about the world's forward axis) and comes back down.
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="POSE")

    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 24
    scene.render.fps = 24

    forward = Vector((0, 1, 0))  # character faces -Y; rotating about Y lifts sideways
    frames = [(1, 0.0), (7, -1.9), (13, 0.0), (19, -1.9), (24, 0.0)]
    for frame, angle in frames:
        world_axis_rotation(arm, "arm_r", forward, angle)
        bone = arm.pose.bones["arm_r"]
        bone.keyframe_insert(data_path="rotation_quaternion", frame=frame)

    # Mark the action for export.
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
