import {
    CANVAS_BACKGROUND,
    CANVAS_MAP,
    CANVAS_OVERLAYS,
    IMAGES_PATH,
} from '../config.js';

import {
    updateClouds,
    drawWeatherEffects,
    drawWeatherFilter,
    updateWeatherEffects,
    updateWeatherOverlay
} from '../weather.js';

import { updateDayNightCycle, drawDayNightOverlay } from '../daynight.js';
import { drawOverlays } from '../overlays/overlay-manager.js';

// ==============================
// Canvas Contexts Initialization
// ==============================
const ctxBg = CANVAS_BACKGROUND.getContext("2d");
const ctxMap = CANVAS_MAP.getContext("2d");
const ctxOverlays = CANVAS_OVERLAYS.getContext("2d");

// Set canvas native resolution to match screen size
function initCanvasResolutions() {
    [CANVAS_BACKGROUND, CANVAS_MAP, CANVAS_OVERLAYS].forEach(canvas => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

initCanvasResolutions();

const map = new Image();
const background = new Image();
background.src = IMAGES_PATH + "map_background.webp";

// Static background initialization (draw once)
background.onload = () => {
    ctxBg.drawImage(background, 0, 0, CANVAS_BACKGROUND.width, CANVAS_BACKGROUND.height);
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
// Map & Overlay Drawing
// ==============================

export function drawMap() {
    // Clear previous frame
    ctxMap.clearRect(0, 0, CANVAS_MAP.width, CANVAS_MAP.height);
    ctxOverlays.clearRect(0, 0, CANVAS_OVERLAYS.width, CANVAS_OVERLAYS.height);

    if (map.complete && map.naturalWidth && map.naturalHeight) {
        const imgWidth = map.naturalWidth;
        const imgHeight = map.naturalHeight;

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
        const userMatrix = new DOMMatrix().translate(CANVAS_TRANSFORM.offsetX, CANVAS_TRANSFORM.offsetY).scale(CANVAS_TRANSFORM.scale);
        // Combined transform for the wallpaper.
        const combinedMatrix = userMatrix.multiply(baseMatrix);
        currentWallpaperMatrix = combinedMatrix;

        // Draw map
        ctxMap.save();
        ctxMap.setTransform(combinedMatrix);
        ctxMap.drawImage(map, 0, 0, imgWidth, imgHeight);
        ctxMap.restore();

        // Create a remapping matrix to convert window coordinates to wallpaper natural coordinates.
        // This matrix maps (0,0) to (0,0) and (window.innerWidth, window.innerHeight) to (imgWidth, imgHeight).
        const remapMatrix = new DOMMatrix().scale(
            imgWidth / window.innerWidth,
            imgHeight / window.innerHeight
        );

        // Draw overlays (shared transformation)
        const overlayMatrix = combinedMatrix.multiply(remapMatrix);
        ctxOverlays.save();
        ctxOverlays.setTransform(overlayMatrix);
        drawWeatherEffects(ctxOverlays);
        drawOverlays(ctxOverlays);
        drawDayNightOverlay(ctxOverlays);
        drawWeatherFilter(ctxOverlays);
        ctxOverlays.restore();
    }
}

// ==============================
// Misc Functions
// ==============================

let lastFrameTime = performance.now();
export const animationLoop = (timestamp) => {
    const dt = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;

    updateDayNightCycle(timestamp);
    updateWeatherOverlay(timestamp);

    drawMap();
    updateClouds(dt, timestamp);
    updateWeatherEffects(dt);

    requestAnimationFrame(animationLoop);
};

export function getMap() {
    return map;
}

export function resetView() {
    CANVAS_TRANSFORM.scale = 1;
    CANVAS_TRANSFORM.offsetX = 0;
    CANVAS_TRANSFORM.offsetY = 0;
    drawMap();
}

// Function to be passed as a callback for redrawing
export const redrawCanvas = async () => {
    ctxMap.clearRect(0, 0, CANVAS_MAP.width, CANVAS_MAP.height);
    ctxOverlays.clearRect(0, 0, CANVAS_OVERLAYS.width, CANVAS_OVERLAYS.height);
    drawMap();
};

// Window Resize Handler
window.addEventListener('resize', () => {
    initCanvasResolutions();
    resetView();
    ctxBg.drawImage(background, 0, 0);
    drawMap();
});