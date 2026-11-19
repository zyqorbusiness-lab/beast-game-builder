extends Control
## Main menu: Play, Settings (real bus volumes), Credits, Quit.
## Back (ui_cancel) closes an open panel instead of quitting.

const GAME_SCENE := "res://scenes/game.tscn"

@onready var _settings: Control = $SettingsPanel
@onready var _credits: Control = $CreditsPanel


func _ready() -> void:
	$Center/Buttons/PlayButton.pressed.connect(_on_play)
	$Center/Buttons/SettingsButton.pressed.connect(_on_settings)
	$Center/Buttons/CreditsButton.pressed.connect(_on_credits)
	$Center/Buttons/QuitButton.pressed.connect(_on_quit)
	$SettingsPanel/VBox/BackButton.pressed.connect(_on_back)
	$CreditsPanel/VBox/BackButton.pressed.connect(_on_back)

	var music_slider: HSlider = $SettingsPanel/VBox/MusicSlider
	var sfx_slider: HSlider = $SettingsPanel/VBox/SFXSlider
	music_slider.value = App.get_bus_volume_linear(&"Music")
	sfx_slider.value = App.get_bus_volume_linear(&"SFX")
	music_slider.value_changed.connect(func(v: float) -> void: App.set_bus_volume(&"Music", v))
	sfx_slider.value_changed.connect(func(v: float) -> void:
		App.set_bus_volume(&"SFX", v)
		App.play_sfx(&"click"))


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed(&"ui_cancel"):
		if _settings.visible or _credits.visible:
			_on_back()
		else:
			_on_quit()


func _on_play() -> void:
	App.play_sfx(&"start")
	get_tree().change_scene_to_file(GAME_SCENE)


func _on_settings() -> void:
	App.play_sfx(&"click")
	_settings.visible = true


func _on_credits() -> void:
	App.play_sfx(&"click")
	_credits.visible = true


func _on_back() -> void:
	_settings.visible = false
	_credits.visible = false


func _on_quit() -> void:
	get_tree().quit()
