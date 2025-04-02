import {
  DEV_TOOLS_BUTTON_ID,
  OVERLAYS_BUTTON_ID,
  RESET_VIEW_BUTTON_ID,
  SET_TIME_BUTTON_ID,
  SETTINGS_BUTTON_ID,
  TOGGLE_GRID_BUTTON_ID,
  USER_TOOLS_BUTTON_ID,
  WEATHER_BUTTON_ID,
} from "../config/config-manager.js";

import {
  handleGridToggle,
} from "./ui-manager.js";

import { createAndPlayAudio } from "../audio/sound-system.js";
import { getMap, redrawCanvas, resetView } from "../rendering/canvas-manager.js";
import { handleWeatherToggle } from "../rendering/environment/weather/weather-manager.js";
import { toggleOverlays } from "../rendering/overlays/overlay-manager.js";
import { handleDayTimeToggle } from "../rendering/time-of-day-manager.js";
import { toggleDevTools } from "../tools/devtools/dev-tools-manager.js";
import { toggleUserToolsPanel } from "../tools/usertools/user-tools-manager.js";
import { toggleSettings } from "./usersettings/user-settings.js";

const map = getMap();
const EFFECT_PATH = "effects/";

export const buttonActions = [
  {
    id: TOGGLE_GRID_BUTTON_ID,
    action: () => {
      createAndPlayAudio(EFFECT_PATH + "toggle_grid.mp3", 0.3);
      handleGridToggle(map, redrawCanvas);
    },
  },
  {
    id: RESET_VIEW_BUTTON_ID,
    action: () => {
      createAndPlayAudio(EFFECT_PATH + "reset_view.mp3", 0.3);
      resetView();
    },
  },
  {
    id: SET_TIME_BUTTON_ID,
    action: () => {
      createAndPlayAudio(EFFECT_PATH + "toggle_time.mp3", 0.3);
      handleDayTimeToggle();
    },
  },
  {
    id: WEATHER_BUTTON_ID,
    action: () => {
      createAndPlayAudio(EFFECT_PATH + "toggle_weather.mp3", 0.3);
      handleWeatherToggle();
    },
  },
  {
    id: OVERLAYS_BUTTON_ID,
    action: () => {
      createAndPlayAudio(EFFECT_PATH + "toggle_overlays.mp3", 0.3);
      toggleOverlays();
    },
  },
  {
    id: USER_TOOLS_BUTTON_ID,
    action: () => {
      createAndPlayAudio(EFFECT_PATH + "toggle_user_tools.mp3", 0.3);
      toggleUserToolsPanel();
    },
  },
  {
    id: SETTINGS_BUTTON_ID,
    action: () => {
      createAndPlayAudio(EFFECT_PATH + "toggle_settings.mp3", 0.3);
      toggleSettings();
    },
  },
  {
    id: DEV_TOOLS_BUTTON_ID,
    action: () => {
      createAndPlayAudio(EFFECT_PATH + "toggle_developer_tools.mp3", 0.3);
      toggleDevTools();
    },
  },
];