import {
  CANVAS_BACKGROUND,
  CANVAS_DYNAMIC_OVERLAYS,
  CANVAS_MAP,
  CANVAS_STATIC_OVERLAYS,
  CANVAS_TIME,
  CANVAS_WEATHER,
  IMAGES_PATH,
} from "../config/config-manager.js";

import {
  updateClouds,
  updateWeatherEffects,
  updateWeatherOverlay
} from "./environment/weather/weather-manager.js";

import { updateDayTimeCycle } from "./time-of-day-manager.js";

// ==============================
// Canvas Contexts Initialization
// ==============================
const ctxBg = CANVAS_BACKGROUND.getContext("2d");
const ctxMap = CANVAS_MAP.getContext("2d");
const ctxWeather = CANVAS_WEATHER.getContext("2d");
const ctxTime = CANVAS_TIME.getContext("2d");
export const ctxStaticOverlays = CANVAS_STATIC_OVERLAYS.getContext("2d");
const ctxDynamicOverlays = CANVAS_DYNAMIC_OVERLAYS.getContext("2d");

// Set canvas native resolution to match screen size
const initCanvasResolutions = function () {
  [CANVAS_BACKGROUND, CANVAS_MAP, CANVAS_WEATHER, CANVAS_TIME, CANVAS_STATIC_OVERLAYS, CANVAS_DYNAMIC_OVERLAYS].forEach((canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

initCanvasResolutions();

export const MAP = new Image();
const background = new Image();
background.src = IMAGES_PATH + "map_background.webp";

// Static background initialization (draw once)
background.onload = () => {
  ctxBg.drawImage(
    background,
    0,
    0,
    CANVAS_BACKGROUND.width,
    CANVAS_BACKGROUND.height
  );
};

export let scale = 1;
export let offsetX = 0;
export let offsetY = 0;

export const CANVAS_TRANSFORM = {
  scale: 1,
  offsetX: 0,
  offsetY: 1,
};

export let currentWallpaperMatrix = new DOMMatrix();

// ==============================
// Events
// ==============================

const weatherUpdatedEvent = new CustomEvent('weatherUpdated', {
  detail: { ctx: ctxWeather }
});

const timeUpdatedEvent = new CustomEvent('timeUpdated', {
  detail: { ctx: ctxTime }
});

const staticOverlaysUpdatedEvent = new CustomEvent('staticOverlaysUpdatedEvent', {
  detail: { ctx: ctxStaticOverlays }
});

const dynamicOverlaysUpdatedEvent = new CustomEvent('dynamicOverlaysUpdated', {
  detail: { ctx: ctxDynamicOverlays }
});

// ==============================
// Map & Overlay Drawing
// ==============================

export const drawStatuses = {
  map: { id: 0, mustRedraw: true },
  time: { id: 1, mustRedraw: false },
  staticOverlays: { id: 2, mustRedraw: false },
  dynamicOverlays: { id: 3, mustRedraw: false },
  weather: { id: 4, canRedraw: true },
}

export const drawMap = function () {

  if (MAP.complete && MAP.naturalWidth && MAP.naturalHeight) {
    const imgWidth = MAP.naturalWidth;
    const imgHeight = MAP.naturalHeight;

    // Compute the scale to fit the wallpaper without upscaling.
    const fitScale = Math.min(
      window.innerWidth / imgWidth,
      window.innerHeight / imgHeight,
      1
    );

    // Center the wallpaper.
    const dx = (window.innerWidth - imgWidth * fitScale) / 2;
    const dy = (window.innerHeight - imgHeight * fitScale) / 2;

    // Base transformation: scale and center the wallpaper.
    const baseMatrix = new DOMMatrix().translate(dx, dy).scale(fitScale);
    // User transformation.
    const userMatrix = new DOMMatrix()
      .translate(CANVAS_TRANSFORM.offsetX, CANVAS_TRANSFORM.offsetY)
      .scale(CANVAS_TRANSFORM.scale);
    // Combined transform for the wallpaper.
    const combinedMatrix = userMatrix.multiply(baseMatrix);
    currentWallpaperMatrix = combinedMatrix;

    // Draw map
    if (drawStatuses.map.mustRedraw) {
      ctxMap.clearRect(0, 0, CANVAS_MAP.width, CANVAS_MAP.height);
      ctxMap.save();
      ctxMap.setTransform(combinedMatrix);
      ctxMap.drawImage(MAP, 0, 0, imgWidth, imgHeight);
      ctxMap.restore();
      drawStatuses.map.mustRedraw = false;
    }

    // Create a remapping matrix to convert window coordinates to wallpaper natural coordinates.
    // This matrix maps (0,0) to (0,0) and (window.innerWidth, window.innerHeight) to (imgWidth, imgHeight).
    const remapMatrix = new DOMMatrix().scale(
      imgWidth / window.innerWidth,
      imgHeight / window.innerHeight
    );

    // Draw other canvases (shared transformation)
    const multipliedMatrix = combinedMatrix.multiply(remapMatrix);

    // Weather
    if (drawStatuses.weather.canRedraw) {
      ctxWeather.clearRect(0, 0, CANVAS_WEATHER.width, CANVAS_WEATHER.height);
      ctxWeather.save();
      ctxWeather.setTransform(multipliedMatrix);
      window.dispatchEvent(weatherUpdatedEvent);
      ctxWeather.restore();
    }

    // Time
    if (drawStatuses.time.mustRedraw) {
      ctxTime.clearRect(0, 0, CANVAS_TIME.width, CANVAS_TIME.height);
      ctxTime.save();
      ctxTime.setTransform(multipliedMatrix);
      window.dispatchEvent(timeUpdatedEvent);
      ctxTime.restore();
      drawStatuses.time.mustRedraw = false;
    }

    // Static Overlays
    if (drawStatuses.staticOverlays.mustRedraw) {
      ctxStaticOverlays.clearRect(0, 0, CANVAS_STATIC_OVERLAYS.width, CANVAS_STATIC_OVERLAYS.height);
      ctxStaticOverlays.save();
      ctxStaticOverlays.setTransform(multipliedMatrix);
      window.dispatchEvent(staticOverlaysUpdatedEvent);
      ctxStaticOverlays.restore();
      drawStatuses.staticOverlays.mustRedraw = false;
    }

    // Dynamic Overlays
    if (drawStatuses.dynamicOverlays.mustRedraw) {
      ctxDynamicOverlays.clearRect(0, 0, CANVAS_DYNAMIC_OVERLAYS.width, CANVAS_DYNAMIC_OVERLAYS.height);
      ctxDynamicOverlays.save();
      ctxDynamicOverlays.setTransform(multipliedMatrix);
      window.dispatchEvent(dynamicOverlaysUpdatedEvent);
      ctxDynamicOverlays.restore();
      drawStatuses.dynamicOverlays.mustRedraw = false;
    }
  }
}

// ==============================
// Misc Functions
// ==============================

let lastFrameTime = performance.now();
export const animationLoop = (timestamp) => {
  const dt = (timestamp - lastFrameTime) / 1000;
  lastFrameTime = timestamp;

  updateDayTimeCycle(timestamp);
  updateWeatherOverlay(timestamp);

  drawMap();
  updateClouds(dt, timestamp);
  updateWeatherEffects(dt);

  requestAnimationFrame(animationLoop);
};

export const getMap = function () {
  return MAP;
}

export const setDrawStatuses = async (indexArray, newState) => {
  for (const index of indexArray) {
    const canvasValues = Object.values(drawStatuses);
    for (let i = 0; i < canvasValues.length; i++) {
      const canvas = canvasValues[i];
      if (canvas.id == index && canvas.mustRedraw != newState) {
        canvas.mustRedraw = newState;
      }
    }
  }

  drawMap();
};

export const resetView = function () {
  CANVAS_TRANSFORM.scale = 1;
  CANVAS_TRANSFORM.offsetX = 0;
  CANVAS_TRANSFORM.offsetY = 0;
  setDrawStatuses([0, 1, 2, 3], true);
  drawMap();
}

// Function to be passed as a callback for redrawing
export const redrawCanvas = async () => {
  drawMap();
};

// Window Resize Handler
window.addEventListener("resize", () => {
  initCanvasResolutions();
  resetView();
  ctxBg.drawImage(background, 0, 0);
  setDrawStatuses([0, 1, 2, 3], true);
  drawMap();
});
