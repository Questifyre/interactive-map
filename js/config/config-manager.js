// ==============================
// App Configuration
// ==============================
export let MOBILE_DEVICE;
export let CONFIG_SETTINGS;
export let MAP_FILES;
export let MAP_TOOLTIPS;
export let OVERLAY_FILES;
export let REGION_MUSIC_DATA;

// Zoom & Scale
export let MIN_ZOOM_SCALE = 0.8;
export let MAX_ZOOM_SCALE = 3;
export let MAP_SCALE = {
  distancePerMapPixel: 0.01,
  distanceUnit: "Miles",
};

// ==============================
// Asset Paths
// ==============================
// Core Assets
const toolAssetPath = "assets/tool/";
export const AUDIO_PATH = `${toolAssetPath}audio/`;
export const AMBIANCE_PATH = `${AUDIO_PATH}ambiances/`;
export const MUSIC_PATH = `${AUDIO_PATH}music/`;
export const IMAGES_PATH = `${toolAssetPath}images/`;
const iconPath = `${IMAGES_PATH}icons/`;
export const BUTTON_PATH = `${iconPath}buttons/`;
export const SPRITE_PATH = `${IMAGES_PATH}sprites/`;

// User Content
const userAssetPath = "assets/user/";
const userAudioPath = `${userAssetPath}audio/`;
const userImagesPath = `${userAssetPath}images/`;
const userSpritePath = `${userImagesPath}sprites/`;
export const MAPS_PATH = `${userAssetPath}maps/`;
export const OVERLAYS_PATH = `${MAPS_PATH}overlays/`;
export const REGION_PATH = `${userAudioPath}regions/`;

// ==============================
// DOM Configuration
// ==============================
// Element IDs
const canvasBackgroundID = "canvas-background";
const canvasMapID = "canvas-map";
const canvasWeatherID = "canvas-weather";
const canvasTimeID = "canvas-time";
const canvasStaticOverlaysID = "canvas-static-overlays";
const canvasDynamicOverlaysID = "canvas-dynamic-overlays";

export const AMBIANCE_SLIDER_ID = "ambianceSlider";
export const BOTTOM_NAV_BAR_ID = "bottom-nav-bar";
export const DEV_TOOLS_BUTTON_ID = "dev-tools-button";
export const DEV_TOOLS_PANEL_ID = "dev-tools-panel";
export const HEADER_TEXT_ID = "header-text";
export const KEYBINDINGS_PANEL_ID = "keybindings-panel";
export const LOADING_CONTENT_MAIN_ID = "loading-content-main";
export const LOADING_CONTENT_SECONDARY_ID = "loading-content-secondary";
export const LOADING_SCREEN_MAIN_ID = "loading-screen-main";
export const LOADING_SCREEN_SECONDARY_ID = "loading-screen-secondary";
export const LOADING_TIP_TEXT_ID = "loading-tip-text";
export const MUSIC_SLIDER_ID = "musicSlider";
export const OVERLAY_HEADER_ID = "overlay-header";
export const OVERLAYS_BUTTON_ID = "overlays-button";
export const OVERLAYS_PANEL_ID = "overlays-panel";
export const RESET_VIEW_BUTTON_ID = "reset-view-button";
export const SETTINGS_BUTTON_ID = "settings-button";
export const SETTINGS_PANEL_ID = "settings-panel";
export const SET_TIME_BUTTON_ID = "set-time-button";
export const SOUND_PANEL_ID = "sound-panel";
export const TOGGLE_GRID_BUTTON_ID = "toggle-grid-button";
export const USER_TOOLS_BUTTON_ID = "user-tools-button";
export const USER_TOOLS_PANEL_ID = "user-tools-panel";
export const WEATHER_BUTTON_ID = "weather-button";

// Class Names
export const NAV_BAR_BUTTON_CLASS = "nav-bar-button";
export const PANEL_CHECKMARK_CLASS = "panel-checkmark";
export const PANEL_LIST_ITEM_CLASS = "panel-list-item";
export const PANEL_LIST_ITEM_TEXT_CLASS = "panel-list-item-text";

// Class Selectors
export const PANEL_CHECKMARK_CLASS_SELECTOR = `.${PANEL_CHECKMARK_CLASS}`;
export const PANEL_LIST_ITEM_CLASS_SELECTOR = `.${PANEL_LIST_ITEM_CLASS}`;
export const PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR = `.${PANEL_LIST_ITEM_TEXT_CLASS}`;

// DOM References
export const CANVAS_BACKGROUND = document.getElementById(canvasBackgroundID);
export const CANVAS_MAP = document.getElementById(canvasMapID);
export const CANVAS_WEATHER = document.getElementById(canvasWeatherID);
export const CANVAS_TIME = document.getElementById(canvasTimeID);
export const CANVAS_STATIC_OVERLAYS = document.getElementById(canvasStaticOverlaysID);
export const CANVAS_DYNAMIC_OVERLAYS = document.getElementById(canvasDynamicOverlaysID);

// ==============================
// User Preferences
// ==============================
export let KEY_BINDINGS = {
  PAN_UP: "w",
  PAN_LEFT: "a",
  PAN_DOWN: "s",
  PAN_RIGHT: "d",
};
export const DEFAULT_KEY_BINDINGS = { ...KEY_BINDINGS };

export let VOLUME = {
  MUSIC_VOLUME: 0.2,
  AMBIANCE_VOLUME: 0.3,
};
const defaultVolume = { ...VOLUME };

// Interaction Settings
export const PAN_THRESHOLD = 5;
export const WHEEL_ZOOM_SPEED = 0.002;
export const ZOOM_SENSITIVITY = 0.6;

// ==============================
// Audio/Visual Effects
// ==============================
// Transition Timing
export const CHARACTER_FADE_DURATION = 500;
export const CROSSFADE_DURATION = 1500;
export const HEADER_STAY_DURATION = 2000;
export const OVERLAY_FADE_DURATION = 500;
export const TYPING_SPEED = 150;

// Visual Settings
export const CHARACTER_SPACING = "10px";
export const OVERLAY_PROPERTIES = [
  { color: "#000000", alpha: 0 },    // Day
  { color: "#a65c53", alpha: 0.3 },  // Dusk
  { color: "#161631", alpha: 0.6 },   // Night
];

// ==============================
// Weather System
// ==============================
// States
export const WEATHER_SUNNY = 0;
export const WEATHER_OVERCAST = 1;
export const WEATHER_RAIN = 2;
export const WEATHER_STORM = 3;

// Configuration
export const BASE_MAX_CLOUDS = 30;
export const CLOUD_SPAWN_PROBABILITY = 0.02;
export const LIGHTNING_FLASH_PROBABILITY = 0.3;
export const WEATHER_CLOUD_MULTIPLIER = 5;

// Assets
const weatherPath = `${AUDIO_PATH}weather/`;
export const WEATHER_AUDIO_SOURCES = [
  null,                        // Sunny
  null,                        // Overcast
  `${weatherPath}rain.mp3`,   // Rain
  `${weatherPath}storm.mp3`,   // Storm
];

export const WEATHER_ICONS = [
  `${BUTTON_PATH}weather_0.png`,
  `${BUTTON_PATH}weather_1.png`,
  `${BUTTON_PATH}weather_2.png`,
  `${BUTTON_PATH}weather_3.png`,
];

// ==============================
// Cloud System
// ==============================
const cloudsPath = `${SPRITE_PATH}clouds/`;
const defaultCloudSpritePaths = [
  `${cloudsPath}cloud_1.png`,
  `${cloudsPath}cloud_2.png`,
  `${cloudsPath}cloud_3.png`,
  `${cloudsPath}cloud_4.png`,
  `${cloudsPath}cloud_5.png`,
];
export let CLOUD_SPRITE_PATHS = [...defaultCloudSpritePaths];

// Load user configs
const configHandlers = [
  {
    key: "Settings",
    required: true,
    missingMessage: "No Settings found inside config.json file!",
    action: value => {
      CONFIG_SETTINGS = value;

      // Validate Zoom Data
      if (value.Zoom) {
        MIN_ZOOM_SCALE = value.Zoom.Min;
        MAX_ZOOM_SCALE = value.Zoom.Max;
      } else {
        console.log("No Zoom Settings found inside config.json file, using default.");
      }

      // Validate Map Scale Data
      if (value["Map Scale"]) {
        const distancePerMapPixel = value["Map Scale"]["Distance Per Map Pixel"] || MAP_SCALE.distancePerMapPixel;
        MAP_SCALE.distancePerMapPixel = distancePerMapPixel;

        const distanceUnit = value["Map Scale"]["Distance Unit"] || MAP_SCALE.distanceUnit;
        MAP_SCALE.distanceUnit = distanceUnit;
      } else {
        console.log("No Scale Settings found inside config.json file, using default.");
      }
    },
  },
  {
    key: "Maps",
    required: true,
    missingMessage: "No Map Files found inside config.json file!",
    action: value => { MAP_FILES = value; },
  },
  {
    key: "Overlays",
    required: true,
    missingMessage: "Could not find Overlay Files from configs file",
    action: value => { OVERLAY_FILES = value; },
  },
  {
    key: "Cloud Sprites",
    required: false,
    action: value => {
      if (Array.isArray(value) && value.length > 0) {
        CLOUD_SPRITE_PATHS = value.map(sprite => `${userSpritePath}clouds/${sprite}`);
      } else {
        console.log("No valid Cloud Sprites found in config.json, using default.");
      }
    },
  },
  {
    key: "Map Tooltips",
    required: true,
    missingMessage: "Could not find Map Tooltips Files from configs file",
    action: value => { MAP_TOOLTIPS = value; },
  },
  {
    key: "Region Music",
    required: true,
    missingMessage: "Could not find Region Music Files from configs file",
    action: value => { REGION_MUSIC_DATA = value; },
  },
];

const loadUserSettings = async function () {
  try {
    const keyBindingsCookie = document.cookie.split("; ").find(row => row.startsWith("keybindings="));
    if (keyBindingsCookie) {
      try {
        const savedBindings = JSON.parse(decodeURIComponent(keyBindingsCookie.split("=")[1]));
        KEY_BINDINGS = { ...DEFAULT_KEY_BINDINGS, ...savedBindings };
      } catch {
        console.log("Invalid KeyBindings Cookie. Reverting to default.");
        KEY_BINDINGS = { ...DEFAULT_KEY_BINDINGS };
      }
    } else {
      console.log("No KeyBindings cookie found. Using default keybinding settings.");
    }

    const volumeCookie = document.cookie.split("; ").find(row => row.startsWith("volume="));
    if (volumeCookie) {
      try {
        const savedVolume = JSON.parse(decodeURIComponent(volumeCookie.split("=")[1]));
        for (const [key, value] of Object.entries(savedVolume)) {
          if (Object.prototype.hasOwnProperty.call(VOLUME, key) && typeof value === "number") {
            VOLUME[key] = value;
          }
        }
      } catch (error) {
        console.log("Invalid Volume Cookie. Reverting to default volume settings."), error.message;
      }
    } else {
      console.log("No Volume cookie found. Using default volume settings.");
    }
  } catch (error) {
    console.warn("Could not process user settings cookies. Using default.", error.message);
    KEY_BINDINGS = { ...DEFAULT_KEY_BINDINGS };
    VOLUME = { ...defaultVolume };
  }
};

//Platform specific
const isMobileDevice = function () {
  // Check for mobile user agent patterns
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i;
  const isMobileUA = mobileRegex.test(navigator.userAgent);

  // Check for touch support AND either mobile user agent or small screen
  const hasTouch = "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  // Modern browsers support navigator.userAgentData
  const isMobileBranding = navigator.userAgentData?.mobile === true;

  // If any mobile indicators exist and it's not a Windows touch device
  return (isMobileUA || isMobileBranding) &&
    !/Windows NT/i.test(navigator.userAgent) &&
    (hasTouch || window.innerWidth <= 768);
};

const loadConfig = async function () {
  try {
    // Load main config first
    const response = await fetch("config.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const config = await response.json();
    if (!config) throw new Error("Empty configuration file");

    configHandlers.forEach(handler => {
      const value = config[handler.key];
      if (value === undefined) {
        if (handler.required) console.error(handler.missingMessage);
        return;
      }
      handler.action(value);
    });

    // Load user settings after main config
    await loadUserSettings();

    // Determine user device type
    MOBILE_DEVICE = isMobileDevice();

  } catch (error) {
    console.error("Config/Settings loading error:", error.message);
    KEY_BINDINGS = { ...DEFAULT_KEY_BINDINGS };
    VOLUME = { ...defaultVolume };
  }
};

const configLoadPromise = loadConfig();
export { configLoadPromise as CONFIG_LOAD_PROMISE };

