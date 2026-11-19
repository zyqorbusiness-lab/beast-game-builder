extends Node
## App autoload: audio buses, procedural SFX, input actions.
## Created once at launch; every scene uses it.

const POOL_SIZE := 6

var _players: Array[AudioStreamPlayer] = []
var _next_player := 0
var _sfx_cache: Dictionary = {}


func _ready() -> void:
	_setup_audio()
	_setup_input()


# --- Audio -----------------------------------------------------------------

func _setup_audio() -> void:
	_ensure_bus(&"Music")
	_ensure_bus(&"SFX")
	for i in POOL_SIZE:
		var player := AudioStreamPlayer.new()
		player.bus = &"SFX"
		add_child(player)
		_players.append(player)


func _ensure_bus(bus_name: StringName) -> void:
	if AudioServer.get_bus_index(bus_name) != -1:
		return
	AudioServer.add_bus()
	var idx := AudioServer.bus_count - 1
	AudioServer.set_bus_name(idx, bus_name)
	AudioServer.set_bus_send(idx, &"Master")


## Set a bus volume from a 0..1 slider value.
func set_bus_volume(bus_name: StringName, linear: float) -> void:
	var idx := AudioServer.get_bus_index(bus_name)
	if idx == -1:
		return
	AudioServer.set_bus_volume_db(idx, linear_to_db(maxf(linear, 0.0001)))


func get_bus_volume_linear(bus_name: StringName) -> float:
	var idx := AudioServer.get_bus_index(bus_name)
	if idx == -1:
		return 1.0
	return db_to_linear(AudioServer.get_bus_volume_db(idx))


## Play one of the generated sound effects: click, collect, start.
func play_sfx(kind: StringName) -> void:
	if _players.is_empty():
		return
	if not _sfx_cache.has(kind):
		_sfx_cache[kind] = _make_sfx(kind)
	var player := _players[_next_player]
	_next_player = (_next_player + 1) % POOL_SIZE
	player.stream = _sfx_cache[kind]
	player.pitch_scale = randf_range(0.95, 1.05)
	player.play()


## Synthesize a short decaying sine tone: no recordings, no licence work.
func _make_sfx(kind: StringName) -> AudioStreamWAV:
	match kind:
		&"click":
			return _make_tone(880.0, 0.06)
		&"collect":
			return _make_tone(1318.5, 0.10)
		&"start":
			return _make_tone(523.25, 0.16)
		_:
			return _make_tone(660.0, 0.08)


func _make_tone(freq: float, duration: float, volume: float = 0.4) -> AudioStreamWAV:
	var sample_rate := 22050
	var frames := int(sample_rate * duration)
	var data := PackedByteArray()
	data.resize(frames * 2)
	for i in frames:
		var t := float(i) / sample_rate
		var envelope := 1.0 - float(i) / frames
		var sample := sin(TAU * freq * t) * envelope * volume
		data.encode_s16(i * 2, int(clampf(sample, -1.0, 1.0) * 32767.0))
	var stream := AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = sample_rate
	stream.data = data
	return stream


# --- Input -----------------------------------------------------------------

func _setup_input() -> void:
	_bind_keys(&"move_left", [KEY_A, KEY_LEFT])
	_bind_keys(&"move_right", [KEY_D, KEY_RIGHT])
	_bind_keys(&"move_up", [KEY_W, KEY_UP])
	_bind_keys(&"move_down", [KEY_S, KEY_DOWN])
	_bind_keys(&"pause", [KEY_ESCAPE, KEY_P])


func _bind_keys(action: StringName, keys: Array) -> void:
	if not InputMap.has_action(action):
		InputMap.add_action(action, 0.2)
	for key in keys:
		var already := false
		for existing in InputMap.action_get_events(action):
			if existing is InputEventKey and existing.physical_keycode == key:
				already = true
		if not already:
			var event := InputEventKey.new()
			event.physical_keycode = key
			InputMap.action_add_event(action, event)
