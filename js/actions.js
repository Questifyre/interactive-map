import {
	KEY_BINDINGS,
	SET_TIME_BUTTON_ID,
	DEV_TOOLS_BUTTON_ID,
	OVERLAYS_BUTTON_ID,
	RESET_VIEW_BUTTON_ID,
	SETTINGS_BUTTON_ID,
	SOUND_PANEL_BUTTON_ID,
	TOGGLE_GRID_BUTTON_ID,
	WEATHER_BUTTON_ID,
} from './config.js';

import {
	handleGridToggle,
	handleSoundPanelToggle,
} from './ui.js';

import { getMap, resetView, redrawCanvas } from './canvas/canvas.js';
import { handleDayNightToggle } from './daynight.js';
import { handleWeatherToggle } from './weather.js';
import { toggleOverlays } from './overlays/overlay-manager.js';
import { toggleDevTools } from './devtools/dev-tools.js';
import { createAndPlayAudio } from './audio.js';

const map = getMap();
const EFFECT_PATH = "effects/";

export const buttonActions = [
	{
		id: TOGGLE_GRID_BUTTON_ID,
		key: KEY_BINDINGS.TOOLS_NAVBAR_1,
		action: () => {
			createAndPlayAudio(EFFECT_PATH + "toggle_grid.mp3", 0.3);
			handleGridToggle(map, redrawCanvas);
		}
	},
	{
		id: RESET_VIEW_BUTTON_ID,
		key: KEY_BINDINGS.TOOLS_NAVBAR_2,
		action: () => {
			createAndPlayAudio(EFFECT_PATH + "reset_view.mp3", 0.3);
			resetView();
		}
	},
	{
		id: SET_TIME_BUTTON_ID,
		key: KEY_BINDINGS.TOOLS_NAVBAR_3,
		action: () => {
			createAndPlayAudio(EFFECT_PATH + "toggle_time.mp3", 0.3);
			handleDayNightToggle();
		}
	},
	{
		id: SOUND_PANEL_BUTTON_ID,
		key: KEY_BINDINGS.TOOLS_NAVBAR_4,
		action: () => {
			createAndPlayAudio(EFFECT_PATH + "toggle_sound_panel.mp3", 0.3);
			handleSoundPanelToggle();
		}
	},
	{
		id: WEATHER_BUTTON_ID,
		key: KEY_BINDINGS.TOOLS_NAVBAR_5,
		action: () => {
			createAndPlayAudio(EFFECT_PATH + "toggle_weather.mp3", 0.3);
			handleWeatherToggle();
		}
	},
	{
		id: OVERLAYS_BUTTON_ID,
		key: KEY_BINDINGS.TOOLS_NAVBAR_6,
		action: () => {
			createAndPlayAudio(EFFECT_PATH + "toggle_overlays.mp3", 0.3);
			toggleOverlays();
		}
	},
	{
		id: SETTINGS_BUTTON_ID,
		key: KEY_BINDINGS.TOOLS_NAVBAR_7,
		action: () => {
			createAndPlayAudio(EFFECT_PATH + "toggle_settings.mp3", 0.3);
			toggleSettings();
		}
	},
	{
		id: DEV_TOOLS_BUTTON_ID,
		key: KEY_BINDINGS.TOOLS_NAVBAR_8,
		action: () => {
			createAndPlayAudio(EFFECT_PATH + "toggle_developer_tools.mp3", 0.3);
			toggleDevTools();
		}
	},
];