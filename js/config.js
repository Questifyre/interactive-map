// ==============================
// Configuration & Constants
// ==============================

//Config File Settings
export let CONFIG_SETTINGS;
export let MAP_TOOLTIPS;
export let MAP_FILES;
export let OVERLAY_FILES;
export let MIN_ZOOM_SCALE = 0.8;
export let MAX_ZOOM_SCALE = 3;
export let REGION_MUSIC_DATA;

// Tool Asset Paths
export const CANVAS_ID = "questifyre-interactive-map";
export const TOOL_ASSET_PATH = "assets/tool/";
export const AUDIO_PATH = TOOL_ASSET_PATH + "audio/";
export const AMBIANCE_PATH = AUDIO_PATH + "ambiances/";
export const MUSIC_PATH = AUDIO_PATH + "music/";
export const IMAGES_PATH = TOOL_ASSET_PATH + "images/";
export const ICON_PATH = IMAGES_PATH + "icons/";
export const BUTTON_PATH = ICON_PATH + "buttons/";
export const SPRITE_PATH = IMAGES_PATH + "sprites/";

// User Asset Paths
export const USER_ASSET_PATH = "assets/user/";
export const MAPS_PATH = USER_ASSET_PATH + "maps/";
export const OVERLAYS_PATH = MAPS_PATH + "overlays/";
export const USER_AUDIO_PATH = USER_ASSET_PATH + "audio/";
export const REGION_PATH = USER_AUDIO_PATH + "regions/";

const USER_IMAGES_PATH = USER_ASSET_PATH + "images/";
const USER_SPRITE_PATH = USER_IMAGES_PATH + "sprites/";

// Audio configs
export const AMBIANCE_MAX_VOLUME = 0.3;
export const MUSIC_MAX_VOLUME = 0.2;

// Music Region Sound Configs
export const CROSSFADE_DURATION = 1500;
export const OVERLAY_FADE_DURATION = 500;

// Header configs
export const TYPING_SPEED = 150;
export const CHARACTER_FADE_DURATION = 500;
export const HEADER_STAY_DURATION = 2000;
export const CHARACTER_SPACING = "10px";

// Weather states
export const WEATHER_SUNNY = 0;
export const WEATHER_OVERCAST = 1;
export const WEATHER_RAIN = 2;
export const WEATHER_STORM = 3;

// Weather configs
export const BASE_MAX_CLOUDS = 30;
export const WEATHER_CLOUD_MULTIPLIER = 5;
export const CLOUD_SPAWN_PROBABILITY = 0.02;
export const LIGHTNING_FLASH_PROBABILITY = 0.3;

// Day/Night states
export const DAY = 0;
export const DUSK = 1;
export const NIGHT = 2;

// DOM Element IDs
export const AMBIANCE_SLIDER_ID = "ambianceSlider";
export const MUSIC_SLIDER_ID = "musicSlider";
export const TOGGLE_GRID_BUTTON_ID = "toggle-grid-button";
export const RESET_ZOOM_BUTTON_ID = "reset-view-button";
export const WEATHER_BUTTON_ID = "weather-button";
export const DAY_NIGHT_BUTTON_ID = "day-night-button";
export const SOUND_PANEL_ID = "soundPanel";
export const SOUND_PANEL_BUTTON_ID = "sound-panel-button";
export const HEADER_TEXT_ID = "header-text";
export const HEADER_OVERLAY_ID = "header-overlay";
export const OVERLAYS_BUTTON_ID = "overlays-button";
export const OVERLAYS_PANEL = "overlays-panel";
export const LOADING_SCREEN_MAIN_ID = "loading-screen-main";
export const LOADING_CONTENT_MAIN_ID = "loading-content-main";
export const LOADING_TIP_TEXT_ID = "loading-tip-text";
export const LOADING_SCREEN_SECONDARY_ID = "loading-screen-secondary";
export const LOADING_CONTENT_SECONDARY_ID = "loading-content-secondary";

// Cloud sprite paths
const CLOUDS_PATH = SPRITE_PATH + "clouds/";
const defaultCloudSpritePaths = [
    CLOUDS_PATH + "cloud_1.png",
    CLOUDS_PATH + "cloud_2.png",
    CLOUDS_PATH + "cloud_3.png",
    CLOUDS_PATH + "cloud_4.png",
    CLOUDS_PATH + "cloud_5.png"
];

export let CLOUD_SPRITE_PATHS = [...defaultCloudSpritePaths];

// Weather icon paths
export const WEATHER_ICONS = [
    BUTTON_PATH + "weather_0.png",
    BUTTON_PATH + "weather_1.png",
    BUTTON_PATH + "weather_2.png",
    BUTTON_PATH + "weather_3.png"
];

// Day/Night overlay properties
export const OVERLAY_PROPERTIES = [
    { color: "#000000", alpha: 0 }, // Day
    { color: "#a65c53", alpha: 0.3 }, // Dusk
    { color: "#161631", alpha: 0.6 } // Night
];

// Weather audio sources
const WEATHER_PATH = AUDIO_PATH + "weather/";
export const WEATHER_AUDIO_SOURCES = [
    null, // Sunny
    null, // Overcast (no sound)
    WEATHER_PATH + "rain.mp3", // Rain
    WEATHER_PATH + "storm.mp3" // Storm
];

// Load user configs
const configHandlers = [
    {
        key: 'Settings',
        required: true,
        missingMessage: 'No Settings found inside config.json file!',
        action: value => {
            CONFIG_SETTINGS = value;
            if (value.Zoom) {
                MIN_ZOOM_SCALE = value.Zoom.Min;
                MAX_ZOOM_SCALE = value.Zoom.Max;
            } else {
                console.error('No Zoom Settings found inside config.json file!');
            }
        }
    },
    {
        key: 'Maps',
        required: true,
        missingMessage: 'No Map Files found inside config.json file!',
        action: value => { MAP_FILES = value; }
    },
    {
        key: 'Overlays',
        required: true,
        missingMessage: 'Could not find Overlay Files from configs file',
        action: value => { OVERLAY_FILES = value; }
    },
    {
        key: 'Region Music',
        required: true,
        missingMessage: 'Could not find Region Music Files from configs file',
        action: value => { REGION_MUSIC_DATA = value; }
    },
    {
        key: 'Map Tooltips',
        required: true,
        missingMessage: 'Could not find Map Tooltips Files from configs file',
        action: value => { MAP_TOOLTIPS = value; }
    },
    {
        key: 'Cloud Sprites',
        required: false,
        action: value => {
            if (Array.isArray(value) && value.length > 0) {
                CLOUD_SPRITE_PATHS = value.map(sprite => `${USER_SPRITE_PATH}clouds/${sprite}`);
            } else {
                console.log('No valid Cloud Sprites found in config.json, using default.');
            }
        }
    }
];

async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const config = await response.json();
        if (!config) throw new Error('Empty configuration file');

        configHandlers.forEach(handler => {
            const value = config[handler.key];
            if (value === undefined) {
                if (handler.required) console.error(handler.missingMessage);
                return;
            }
            handler.action(value);
        });

    } catch (error) {
        console.error('Error loading config.json:', error.message);
    }
}

const configLoadPromise = loadConfig();
export { configLoadPromise as CONFIG_LOAD_PROMISE };