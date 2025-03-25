import {
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
    disableButton,
} from './ui.js';

import { buttonActions } from './actions.js';

const setButtonListeners = function () {
    buttonActions.forEach(({ id, action }) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', action);
        }
    });
}

export function toggleButtonsFromConfig(configSettings) {
    !configSettings["Enable Grid Toggle"] && disableButton(TOGGLE_GRID_BUTTON_ID);
    !configSettings["Enable Reset View"] && disableButton(RESET_VIEW_BUTTON_ID);
    !configSettings["Enable Day Time Toggle"] && disableButton(SET_TIME_BUTTON_ID);
    !configSettings["Enable Sound Panel"] && disableButton(SOUND_PANEL_BUTTON_ID);
    !configSettings["Enable Weather Toggle"] && disableButton(WEATHER_BUTTON_ID);
    !configSettings["Enable Overlays"] && disableButton(OVERLAYS_BUTTON_ID);
    !configSettings["Enable Settings"] && disableButton(SETTINGS_BUTTON_ID);
    !configSettings["Developer Mode"] && disableButton(DEV_TOOLS_BUTTON_ID);
}

export function configureNavBarButtons() {
    setButtonListeners();
}