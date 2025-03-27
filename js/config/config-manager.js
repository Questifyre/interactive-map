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
export let MAP_SCALE = {
    distancePerMapPixel: 0.01,
    distanceUnit: "Miles"
};

// ==============================
// Canvases
// ==============================

// Element IDs
export const CANVAS_BACKGROUND_ID = "canvas-background";
export const CANVAS_MAP_ID = "canvas-map";
export const CANVAS_OVERLAYS_ID = "canvas-overlays";

// DOMs
export const CANVAS_BACKGROUND = document.getElementById(CANVAS_BACKGROUND_ID);
export const CANVAS_MAP = document.getElementById(CANVAS_MAP_ID);
export const CANVAS_OVERLAYS = document.getElementById(CANVAS_OVERLAYS_ID);

// Tool Asset Paths
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

// User Preferences config
export let KEY_BINDINGS = {
    PAN_UP: 'w',
    PAN_LEFT: 'a',
    PAN_DOWN: 's',
    PAN_RIGHT: 'd',
    TOOLS_NAVBAR_1: '1',
    TOOLS_NAVBAR_2: '2',
    TOOLS_NAVBAR_3: '3',
    TOOLS_NAVBAR_4: '4',
    TOOLS_NAVBAR_5: '5',
    TOOLS_NAVBAR_6: '6',
    TOOLS_NAVBAR_7: '7',
    TOOLS_NAVBAR_8: '8',
};

const defaultKeyBindings = { ...KEY_BINDINGS };

export let VOLUME = {
    MUSIC_VOLUME: 0.2,
    AMBIANCE_VOLUME: 0.3
};

const defaultVolume = { ...VOLUME };

export const ZOOM_SENSITIVITY = 0.6;
export const PAN_THRESHOLD = 5;
export const WHEEL_ZOOM_SPEED = 0.002;

// Music Region Sound configs
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
export const BOTTOM_NAV_BAR_ID = "bottom-nav-bar";
export const MUSIC_SLIDER_ID = "musicSlider";
export const TOGGLE_GRID_BUTTON_ID = "toggle-grid-button";
export const RESET_VIEW_BUTTON_ID = "reset-view-button";
export const WEATHER_BUTTON_ID = "weather-button";
export const SET_TIME_BUTTON_ID = "set-time-button";
export const SOUND_PANEL_ID = "soundPanel";
export const SOUND_PANEL_BUTTON_ID = "sound-panel-button";
export const OVERLAYS_BUTTON_ID = "overlays-button";
export const OVERLAYS_PANEL_ID = "overlays-panel";
export const USER_TOOLS_PANEL_ID = "user-tools-panel";
export const DEV_TOOLS_PANEL_ID = "dev-tools-panel";
export const SETTINGS_BUTTON_ID = "settings-button";
export const USER_TOOLS_BUTTON_ID = "user-tools-button";
export const DEV_TOOLS_BUTTON_ID = "dev-tools-button";
export const HEADER_TEXT_ID = "header-text";
export const OVERLAY_HEADER_ID = "overlay-header";
export const LOADING_SCREEN_MAIN_ID = "loading-screen-main";
export const LOADING_CONTENT_MAIN_ID = "loading-content-main";
export const LOADING_TIP_TEXT_ID = "loading-tip-text";
export const LOADING_SCREEN_SECONDARY_ID = "loading-screen-secondary";
export const LOADING_CONTENT_SECONDARY_ID = "loading-content-secondary";

// DOM Class IDs
export const NAV_BAR_BUTTON_CLASS = "nav-bar-button";
export const PANEL_CHECKMARK_CLASS = "panel-checkmark";
export const PANEL_LIST_ITEM_CLASS = "panel-list-item";
export const PANEL_LIST_ITEM_TEXT_CLASS = "panel-list-item-text";

// DOM Class Selectors
export const PANEL_CHECKMARK_CLASS_SELECTOR = `.${PANEL_CHECKMARK_CLASS}`;
export const PANEL_LIST_ITEM_CLASS_SELECTOR = `.${PANEL_LIST_ITEM_CLASS}`;
export const PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR = `.${PANEL_LIST_ITEM_TEXT_CLASS}`;

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

            // Validate Additional Data
            if (value.Zoom) {
                MIN_ZOOM_SCALE = value.Zoom.Min;
                MAX_ZOOM_SCALE = value.Zoom.Max;
            } else {
                console.log('No Zoom Settings found inside config.json file, using default.');
            }

            if (value["Map Scale"]) {
                const distancePerMapPixel = value["Map Scale"]["Distance Per Map Pixel"] || MAP_SCALE.distancePerMapPixel;
                MAP_SCALE.distancePerMapPixel = distancePerMapPixel;

                const distanceUnit = value["Map Scale"]["Distance Unit"] || MAP_SCALE.distanceUnit;
                MAP_SCALE.distanceUnit = distanceUnit;
            } else {
                console.log('No Scale Settings found inside config.json file, using default.');
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
        key: 'Cloud Sprites',
        required: false,
        action: value => {
            if (Array.isArray(value) && value.length > 0) {
                CLOUD_SPRITE_PATHS = value.map(sprite => `${USER_SPRITE_PATH}clouds/${sprite}`);
            } else {
                console.log('No valid Cloud Sprites found in config.json, using default.');
            }
        }
    },
    {
        key: 'Map Tooltips',
        required: true,
        missingMessage: 'Could not find Map Tooltips Files from configs file',
        action: value => { MAP_TOOLTIPS = value; }
    },
    {
        key: 'Region Music',
        required: true,
        missingMessage: 'Could not find Region Music Files from configs file',
        action: value => { REGION_MUSIC_DATA = value; }
    }
];

const loadUserPreferences = async function () {
    try {
        const response = await fetch('user-prefs.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const userPrefs = await response.json();
        if (!userPrefs.KeyBindings) throw new Error('No KeyBindings section');

        // Validate and merge keybindings
        const userKeyBindings = userPrefs.KeyBindings;
        for (const [key, value] of Object.entries(userKeyBindings)) {
            if (KEY_BINDINGS.hasOwnProperty(key) && typeof value === 'string') {
                KEY_BINDINGS[key] = value.toLowerCase();
            }
        }

        // Validate and merge volume
        const userVolume = userPrefs.Volume;
        if (!userPrefs.Volume) throw new Error('No Volume section');

        for (const [key, value] of Object.entries(userVolume)) {
            if (VOLUME.hasOwnProperty(key) && typeof value === 'number') {
                VOLUME[key] = value;
            }
        }
    } catch (error) {
        console.warn('Using default settings:', error.message);
        KEY_BINDINGS = { ...defaultKeyBindings };
        VOLUME = { ...defaultVolume };
    }
}

const loadConfig = async function () {
    try {
        // Load main config first
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

        // Load user preferences after main config
        await loadUserPreferences();

    } catch (error) {
        console.error('Config/Prefs loading error:', error.message);
        KEY_BINDINGS = { ...defaultKeyBindings };
        VOLUME = { ...defaultVolume };
    }
}

const configLoadPromise = loadConfig();
export { configLoadPromise as CONFIG_LOAD_PROMISE };

