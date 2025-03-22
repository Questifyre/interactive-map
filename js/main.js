import { CONFIG_SETTINGS, CONFIG_LOAD_PROMISE, MAPS_PATH, MAP_FILES } from './config.js';
import { drawWallpaper, getWallpaper, resetZoom } from './canvas.js';
import { disableButton, handleGridToggle, handleSoundPanelToggle, setupTooltipListeners as setupNavBarTooltipListeners } from './ui.js';
import { handleDayNightToggle } from './daynight.js';
import { handleWeatherToggle } from './weather.js';
import { toggleOverlays, toggleOverlay } from './overlay.js';
import { setupLoadingScreen } from './loading.js';
import { createAndPlayAudio, updateRegionSound } from './audio.js';
import { processMouseMove, processMouseLeave } from './map_tooltips.js';

// ==============================
// Main Script File
// ==============================

// Get the wallpaper image from canvas.js
const wallpaper = getWallpaper();
const canvas = document.getElementById('questifyreInteractiveMap');
const ctx = canvas.getContext('2d');

// Set Misc variables
const EFFECT_PATH = "effects/";

export function startInteractiveMap() {

    // Add event listeners for Tool Nav Bar elements
    document.getElementById('toggleGridButton').addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "toggle_grid.mp3", 0.3);
        handleGridToggle(wallpaper, redrawCanvas);
    });
    document.getElementById('resetZoomButton').addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "reset_zoom.mp3", 0.3);
        resetZoom();
    });
    document.getElementById('dayNightButton').addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "toggle_time.mp3", 0.3);
        handleDayNightToggle();
    });
    document.getElementById('soundPanelButton').addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "toggle_sound_panel.mp3", 0.3);
        handleSoundPanelToggle();
    });
    document.getElementById('weatherButton').addEventListener('click', () => {
        createAndPlayAudio(EFFECT_PATH + "toggle_weather.mp3", 0.3);
        handleWeatherToggle();
    });
    document.getElementById('overlaysButton').addEventListener('click', () => {
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
    setupLoadingScreen(wallpaper, redrawCanvas);

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
            if (!CONFIG_SETTINGS["Enable Grid Toggle"]) {
                disableButton('toggleGridButton');
            }

            if (!CONFIG_SETTINGS["Enable Reset Zoom"]) {
                disableButton('resetZoomButton');
            }

            if (!CONFIG_SETTINGS["Enable Day Time Toggle"]) {
                disableButton('dayNightButton');
            }

            if (!CONFIG_SETTINGS["Enable Sound Panel"]) {
                disableButton('soundPanelButton');
            }

            if (!CONFIG_SETTINGS["Enable Weather Toggle"]) {
                disableButton('weatherButton');
            }

            if (!CONFIG_SETTINGS["Enable Overlays"]) {
                disableButton('overlaysButton');
            }
        }
    } catch (error) {
        console.error('Could not load config settings from configs file:', error);
    }
}

document.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // Prevents the right click context menu from showing
});