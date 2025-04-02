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
  updateWeatherOverlay,
} from "./environment/weather/weather-manager.js";

import { updateDayTimeCycle } from "./time-of-day-manager.js";

// ==============================
// Canvas Contexts Initialization
// ==============================
// Initializes 2D context on the provided canvas
const initializeCanvasContext = function (canvas) {
  return canvas.getContext("2d");
};

// Context variables
const ctxBg = initializeCanvasContext(CANVAS_BACKGROUND);
const ctxMap = initializeCanvasContext(CANVAS_MAP);
const ctxWeather = initializeCanvasContext(CANVAS_WEATHER);
const ctxTime = initializeCanvasContext(CANVAS_TIME);
const ctxStaticOverlays = initializeCanvasContext(CANVAS_STATIC_OVERLAYS);
const ctxDynamicOverlays = initializeCanvasContext(CANVAS_DYNAMIC_OVERLAYS);

// Set canvas native resolution to match screen size
const initCanvasResolutions = function () {
  [CANVAS_BACKGROUND, CANVAS_MAP, CANVAS_WEATHER, CANVAS_TIME, CANVAS_STATIC_OVERLAYS, CANVAS_DYNAMIC_OVERLAYS].forEach((canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
};

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
    CANVAS_BACKGROUND.height,
  );
};

export const CANVAS_TRANSFORM = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export let currentWallpaperMatrix = new DOMMatrix();

// ==============================
// Events
// ==============================

const weatherUpdatedEvent = new CustomEvent("weather-canvas-updated", {
  detail: { ctx: ctxWeather },
});

const timeUpdatedEvent = new CustomEvent("time-canvas-updated", {
  detail: { ctx: ctxTime },
});

const staticOverlaysUpdatedEvent = new CustomEvent("static-overlays-canvas-updated", {
  detail: { ctx: ctxStaticOverlays },
});

const dynamicOverlaysUpdatedEvent = new CustomEvent("dynamic-overlays-canvas-updated", {
  detail: { ctx: ctxDynamicOverlays },
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
};

const refreshCanvasWithEvent = function (ctx, matrix, event) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.setTransform(matrix);
  window.dispatchEvent(event);
  ctx.restore();
};

export const drawMap = function () {
  if (!MAP.complete || !MAP.naturalWidth) return;

  const imgWidth = MAP.naturalWidth;
  const imgHeight = MAP.naturalHeight;

  // Compute the scale to fit the image without upscaling.
  const fitScale = Math.min(
    window.innerWidth / imgWidth,
    window.innerHeight / imgHeight,
    1,
  );

  // Center the image.
  const dx = (window.innerWidth - imgWidth * fitScale) / 2;
  const dy = (window.innerHeight - imgHeight * fitScale) / 2;

  // Base transformation: scale and center the image.
  const baseMatrix = new DOMMatrix().translate(dx, dy).scale(fitScale);
  // User transformation.
  const userMatrix = new DOMMatrix()
    .translate(CANVAS_TRANSFORM.offsetX, CANVAS_TRANSFORM.offsetY)
    .scale(CANVAS_TRANSFORM.scale);
  // Combined transform for the image.
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

  // Create a remapping matrix to convert window coordinates to image natural coordinates.
  // This matrix maps (0,0) to (0,0) and (window.innerWidth, window.innerHeight) to (imgWidth, imgHeight).
  const remapMatrix = new DOMMatrix().scale(
    imgWidth / window.innerWidth,
    imgHeight / window.innerHeight,
  );

  // Draw other canvases (shared transformation)
  const multipliedMatrix = combinedMatrix.multiply(remapMatrix);

  // Weather
  if (drawStatuses.weather.canRedraw) {
    refreshCanvasWithEvent(ctxWeather, multipliedMatrix, weatherUpdatedEvent);
  }

  // Time
  if (drawStatuses.time.mustRedraw) {
    refreshCanvasWithEvent(ctxTime, multipliedMatrix, timeUpdatedEvent);
    drawStatuses.time.mustRedraw = false;
  }

  // Static Overlays
  if (drawStatuses.staticOverlays.mustRedraw) {
    refreshCanvasWithEvent(ctxStaticOverlays, multipliedMatrix, staticOverlaysUpdatedEvent);
    drawStatuses.staticOverlays.mustRedraw = false;
  }

  // Dynamic Overlays
  if (drawStatuses.dynamicOverlays.mustRedraw) {
    refreshCanvasWithEvent(ctxDynamicOverlays, multipliedMatrix, dynamicOverlaysUpdatedEvent);
    drawStatuses.dynamicOverlays.mustRedraw = false;
  }
};

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
};

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
};

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
