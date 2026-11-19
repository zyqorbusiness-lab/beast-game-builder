extends Node
## Interaction test: drives the real scenes with synthesized touch/mouse
## input and asserts what happens. GUI input needs a display server; on a
## headless machine wrap it in xvfb:
##
##   xvfb-run -a godot --path examples/godot-hello-game res://tests/interaction_test.tscn
##
## (Plain `godot --headless` parses scenes fine but does not deliver
## synthesized GUI input to buttons and controls.)
##
## Exit code 0 = all passed, 1 = at least one failure. Prints one
## PASS/FAIL line per check. Not covered on purpose: the Quit button
## (it would end this runner) and slider drags (settings sliders are
## wired in menu.gd and exercised by hand/on device).

const MENU_SCENE := "res://scenes/menu.tscn"

var _failures: Array[String] = []
var _passes := 0


func _ready() -> void:
	await get_tree().process_frame
	await get_tree().process_frame
	await _test_menu_panels()
	await _test_play_opens_game()
	await _test_joystick_moves_player()
	await _test_pause_and_resume()
	await _test_back_to_menu()
	_finish()


func _check(ok: bool, label: String) -> void:
	if ok:
		_passes += 1
		print("PASS: " + label)
	else:
		_failures.append(label)
		print("FAIL: " + label)


func _finish() -> void:
	print("interaction test: %d passed, %d failed" % [_passes, _failures.size()])
	get_tree().quit(1 if _failures.size() > 0 else 0)


func _frames(n: int) -> void:
	for i in n:
		await get_tree().process_frame


func _click(pos: Vector2) -> void:
	var press := InputEventMouseButton.new()
	press.button_index = MOUSE_BUTTON_LEFT
	press.pressed = true
	press.position = pos
	Input.parse_input_event(press)
	await _frames(2)
	var release := InputEventMouseButton.new()
	release.button_index = MOUSE_BUTTON_LEFT
	release.pressed = false
	release.position = pos
	Input.parse_input_event(release)
	await _frames(3)


func _touch(pos: Vector2) -> void:
	var ev := InputEventScreenTouch.new()
	ev.index = 0
	ev.pressed = true
	ev.position = pos
	Input.parse_input_event(ev)
	await _frames(2)


func _drag_to(pos: Vector2) -> void:
	var ev := InputEventScreenDrag.new()
	ev.index = 0
	ev.position = pos
	Input.parse_input_event(ev)
	await _frames(2)


func _release(pos: Vector2) -> void:
	var ev := InputEventScreenTouch.new()
	ev.index = 0
	ev.pressed = false
	ev.position = pos
	Input.parse_input_event(ev)
	await _frames(2)


func _button_center(path: NodePath) -> Vector2:
	var node := get_tree().current_scene.get_node(path) as Control
	return node.get_global_rect().get_center()


func _open_menu() -> void:
	# Instance the menu as the tree's current scene so its own
	# change_scene_to_file calls replace it, not this runner.
	var menu: Node = load(MENU_SCENE).instantiate()
	get_tree().root.add_child(menu)
	get_tree().current_scene = menu
	await _frames(3)


func _test_menu_panels() -> void:
	await _open_menu()
	var scene := get_tree().current_scene
	_check(scene.name == "Menu", "menu scene loads")

	await _click(_button_center("Center/Buttons/SettingsButton"))
	_check(scene.get_node("SettingsPanel").visible, "settings button opens settings panel")
	await _click(_button_center("SettingsPanel/VBox/BackButton"))
	_check(not scene.get_node("SettingsPanel").visible, "back closes settings panel")

	await _click(_button_center("Center/Buttons/CreditsButton"))
	_check(scene.get_node("CreditsPanel").visible, "credits button opens credits panel")
	await _click(_button_center("CreditsPanel/VBox/BackButton"))
	_check(not scene.get_node("CreditsPanel").visible, "back closes credits panel")


func _test_play_opens_game() -> void:
	await _click(_button_center("Center/Buttons/PlayButton"))
	var switched := false
	for i in 60:
		await get_tree().process_frame
		if get_tree().current_scene.name == "Game":
			switched = true
			break
	_check(switched, "play button opens the game scene")


func _test_joystick_moves_player() -> void:
	var game := get_tree().current_scene
	var player := game.get_node("Player") as CharacterBody2D
	var start := player.position
	# Thumb lands in the lower half: the floating joystick spawns there.
	await _touch(Vector2(180, 1000))
	var joystick := game.get_node("HUD/Joystick")
	_check(joystick.get_node("Base").visible, "joystick base appears where the thumb lands")
	for i in 10:
		await _drag_to(Vector2(180 + 9 * (i + 1), 1000))
	_check(joystick.direction.x > 0.5, "dragging right sets joystick direction (x = %.2f)" % joystick.direction.x)
	# Let physics apply the movement.
	await _frames(30)
	await _release(Vector2(270, 1000))
	var moved := player.position.x - start.x
	_check(moved > 15.0, "player moves right under joystick input (dx = %.1f)" % moved)
	_check(joystick.direction == Vector2.ZERO, "releasing the thumb recentres the joystick")


func _test_pause_and_resume() -> void:
	var game := get_tree().current_scene
	await _click(_button_center("HUD/PauseButton"))
	_check(get_tree().paused, "pause button pauses the tree")
	_check(game.get_node("HUD/PauseMenu").visible, "pause menu becomes visible")
	await _click(_button_center("HUD/PauseMenu/Center/VBox/ResumeButton"))
	_check(not get_tree().paused, "resume button unpauses the tree")
	_check(not game.get_node("HUD/PauseMenu").visible, "pause menu hides on resume")


func _test_back_to_menu() -> void:
	await _click(_button_center("HUD/PauseButton"))
	await _click(_button_center("HUD/PauseMenu/Center/VBox/MenuButton"))
	var back := false
	for i in 60:
		await get_tree().process_frame
		if get_tree().current_scene.name == "Menu":
			back = true
			break
	_check(back, "main-menu button returns to the menu")
	_check(not get_tree().paused, "tree is not left paused after returning to menu")
