extends Control
## Floating virtual joystick: spawns where the thumb lands in the lower
## half of the screen. Gameplay reads `direction` (Vector2, length 0..1).

signal changed(direction: Vector2)

const RADIUS := 96.0
const KNOB_DEADZONE := 8.0

var direction := Vector2.ZERO

var _touch_index := -1
var _base := Vector2.ZERO

@onready var _base_visual: Control = $Base
@onready var _knob: Control = $Base/Knob


func _ready() -> void:
	_base_visual.visible = false


func _gui_input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed and _touch_index == -1:
			_touch_index = event.index
			_base = event.position
			_base_visual.position = _base - _base_visual.size / 2.0
			_base_visual.visible = true
			_update_knob(Vector2.ZERO)
			accept_event()
		elif not event.pressed and event.index == _touch_index:
			_touch_index = -1
			_base_visual.visible = false
			_set_direction(Vector2.ZERO)
			accept_event()
	elif event is InputEventScreenDrag and event.index == _touch_index:
		_update_knob(event.position - _base)
		accept_event()


func _update_knob(offset: Vector2) -> void:
	var clamped := offset
	if clamped.length() > RADIUS:
		clamped = clamped.normalized() * RADIUS
	_knob.position = _base_visual.size / 2.0 + clamped - _knob.size / 2.0
	if clamped.length() < KNOB_DEADZONE:
		_set_direction(Vector2.ZERO)
	else:
		_set_direction(clamped / RADIUS)


func _set_direction(value: Vector2) -> void:
	direction = value
	changed.emit(value)
