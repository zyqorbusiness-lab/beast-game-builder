extends Node2D
## The playable scene: move with the virtual joystick or WASD/arrows,
## collect the orb, pause with P/Escape or the pause button.

const SPEED := 320.0
const PLAYER_MARGIN := 24.0

var score := 0

@onready var _player: CharacterBody2D = $Player
@onready var _collectible: Area2D = $Collectible
@onready var _joystick: Control = $HUD/Joystick
@onready var _score_label: Label = $HUD/ScoreLabel
@onready var _pause_menu: Control = $HUD/PauseMenu


func _ready() -> void:
	var visual: ColorRect = $Player/Visual
	visual.pivot_offset = visual.size / 2.0
	_collectible.body_entered.connect(_on_collectible_body_entered)
	$HUD/PauseButton.pressed.connect(_toggle_pause)
	$HUD/PauseMenu/Center/VBox/ResumeButton.pressed.connect(_toggle_pause)
	$HUD/PauseMenu/Center/VBox/RestartButton.pressed.connect(_on_restart)
	$HUD/PauseMenu/Center/VBox/MenuButton.pressed.connect(_on_menu)
	_move_collectible()
	_update_score()


func _physics_process(_delta: float) -> void:
	var dir: Vector2 = _joystick.direction
	if dir == Vector2.ZERO:
		dir = Input.get_vector(&"move_left", &"move_right", &"move_up", &"move_down")
	_player.velocity = dir * SPEED
	_player.move_and_slide()
	_player.position = _player.position.clamp(
		Vector2(PLAYER_MARGIN, PLAYER_MARGIN),
		get_viewport_rect().size - Vector2(PLAYER_MARGIN, PLAYER_MARGIN))


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed(&"pause"):
		_toggle_pause()


func _on_collectible_body_entered(body: Node2D) -> void:
	if body != _player:
		return
	score += 1
	_update_score()
	App.play_sfx(&"collect")
	_move_collectible()
	_squash_player()


func _squash_player() -> void:
	var visual: ColorRect = $Player/Visual
	var tween := create_tween()
	tween.tween_property(visual, "scale", Vector2(1.25, 0.75), 0.08)
	tween.tween_property(visual, "scale", Vector2.ONE, 0.18)\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)


func _move_collectible() -> void:
	var area := get_viewport_rect().size
	_collectible.position = Vector2(
		randf_range(64.0, area.x - 64.0),
		randf_range(160.0, area.y - 160.0))


func _update_score() -> void:
	_score_label.text = "Score: %d" % score


func _toggle_pause() -> void:
	_pause_menu.visible = not _pause_menu.visible
	get_tree().paused = _pause_menu.visible


func _on_restart() -> void:
	get_tree().paused = false
	get_tree().change_scene_to_file("res://scenes/game.tscn")


func _on_menu() -> void:
	get_tree().paused = false
	get_tree().change_scene_to_file("res://scenes/menu.tscn")
