import {
    CANVAS_ID,
    CONFIG_SETTINGS,
    CONFIG_LOAD_PROMISE,
    DAY_NIGHT_BUTTON_ID,
    MAPS_PATH,
    MAP_FILES,
    OVERLAYS_BUTTON_ID,
    RESET_ZOOM_BUTTON_ID,
    SOUND_PANEL_BUTTON_ID,
    TOGGLE_GRID_BUTTON_ID,
    WEATHER_BUTTON_ID
} from './config.js';

import {
    disableButton,
    handleGridToggle,
    handleSoundPanelToggle,
    setupNavBarTooltipListeners
} from './ui.js';

import { drawWallpaper, getWallpaper, resetView } from './canvas.js';
import { handleDayNightToggle } from './daynight.js';
import { handleWeatherToggle } from './weather.js';
import { toggleOverlays, toggleOverlay } from './overlay.js';
import { setupMainLoadingScreen } from './loading.js';
import { createAndPlayAudio, updateRegionSound } from './audio.js';
import { processMouseMove, processMouseLeave } from './map_tooltips.js';

// ==============================
// Main Script File
// ==============================

// Get the wallpaper image from canvas.js
const wallpaper = getWallpaper();
const canvas = document.getElementById(CANVAS_ID);
const ctx = canvas.getContext('2d');

// Set Misc variables
const EFFECT_PATH = "effects/";

export function startInteractiveMap() {
    // Add event listeners for Tool Nav Bar elements
    document.getElementById(TOGGLE_GRID_BUTTON_ID).addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "toggle_grid.mp3", 0.3);
        handleGridToggle(wallpaper, redrawCanvas);
    });
    document.getElementById(RESET_ZOOM_BUTTON_ID).addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "reset_zoom.mp3", 0.3);
        resetView();
    });
    document.getElementById(DAY_NIGHT_BUTTON_ID).addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "toggle_time.mp3", 0.3);
        handleDayNightToggle();
    });
    document.getElementById(SOUND_PANEL_BUTTON_ID).addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "toggle_sound_panel.mp3", 0.3);
        handleSoundPanelToggle();
    });
    document.getElementById(WEATHER_BUTTON_ID).addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "toggle_weather.mp3", 0.3);
        handleWeatherToggle();
    });
    document.getElementById(OVERLAYS_BUTTON_ID).addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "toggle_overlays.mp3", 0.3);
        toggleOverlays();
    });

    // Interactive Map Location Tooltips
    canvas.addEventListener('mousemove', processMouseMove);
    canvas.addEventListener('mouseleave', processMouseLeave);

    // Add event listeners for each overlay toggle
    document.querySelectorAll('.overlay-list-item').forEach(item => {
        const overlayTextElement = item.querySelector('.overlay-list-item-text');
        if (overlayTextElement) {
            const overlayName = overlayTextElement.textContent;
            item.addEventListener('click', () => {
                if (!item.classList.contains('disabled-overlay-item')) {
                    toggleOverlay(overlayName, redrawCanvas);
                }
            });
        }
    });

    //Misc
    updateRegionSound();
    setupNavBarTooltipListeners();
}

// Function to be passed as a callback for redrawing
const redrawCanvas = async () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWallpaper();
};

// Function to initialize the loading screen after config and wallpaper are ready
async function initializeLoading() {
    await loadConfigFile();

    // Setup loading screen and onload handler BEFORE setting the image source
    setupMainLoadingScreen(wallpaper, redrawCanvas);

    // Set the wallpaper source after attaching the onload handler
    if (MAP_FILES && MAP_FILES["Grid"]) {
        wallpaper.src = MAPS_PATH + MAP_FILES["Grid"];
    } else {
        console.error('MAP_FILES or MAP_FILES["Grid"] is not defined after config load.');
    }
}

// Load config and then initialize loading
initializeLoading();

// Handle User Config File
async function loadConfigFile() {
    await CONFIG_LOAD_PROMISE;
    try {
        if (CONFIG_SETTINGS) {
            let titleSuffix = " | Questifyre"
            document.title = CONFIG_SETTINGS["Page Title"] + titleSuffix ?? document.title + titleSuffix;

            !CONFIG_SETTINGS["Enable Grid Toggle"] && disableButton('toggle-grid-button');
            !CONFIG_SETTINGS["Enable Reset View"] && disableButton('reset-view-button');
            !CONFIG_SETTINGS["Enable Day Time Toggle"] && disableButton('day-night-button');
            !CONFIG_SETTINGS["Enable Sound Panel"] && disableButton('sound-panel-button');
            !CONFIG_SETTINGS["Enable Weather Toggle"] && disableButton('weather-button');
            !CONFIG_SETTINGS["Enable Overlays"] && disableButton('overlays-button');
        }
    } catch (error) {
        console.error('Could not load config settings from configs file:', error);
    }
}

document.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // Prevents the right click context menu from showing
});