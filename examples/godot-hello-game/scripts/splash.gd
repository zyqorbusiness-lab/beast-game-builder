extends Control
## Splash screen: short fade in, hold, fade out, then the menu.
## Skippable from the first frame with any tap or key.

const MENU_SCENE := "res://scenes/menu.tscn"

var _finished := false


func _ready() -> void:
	var logo: Label = $Center/VBox/Logo
	logo.modulate.a = 0.0
	var tween := create_tween()
	tween.tween_property(logo, "modulate:a", 1.0, 0.3)\
		.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tween.tween_interval(1.0)
	tween.tween_property(logo, "modulate:a", 0.0, 0.3)\
		.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN)
	tween.tween_callback(_go_to_menu)


func _unhandled_input(event: InputEvent) -> void:
	if event.is_pressed():
		_go_to_menu()


func _go_to_menu() -> void:
	if _finished:
		return
	_finished = true
	App.play_sfx(&"click")
	get_tree().change_scene_to_file(MENU_SCENE)
