import { CANVAS_ID, IMAGES_PATH, MIN_ZOOM_SCALE, MAX_ZOOM_SCALE } from './config.js';
import { updateRegionSound } from './audio.js';
import { updateClouds, drawWeatherEffects, drawWeatherFilter, updateWeatherEffects, updateWeatherOverlay } from './weather.js';
import { updateDayNightCycle, drawDayNightOverlay } from './daynight.js';
import { drawOverlays } from './overlay.js';

// ==============================
// Canvas Interface Handling
// ==============================

const canvas = document.getElementById(CANVAS_ID);
const ctx = canvas.getContext("2d");
[canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];

// ----- Pan & Zoom Variables -----
let isDragging = false;
let startDragX = 0;
let startDragY = 0;

export let scale = 1;
export let offsetX = 0;
export let offsetY = 0;
export let currentWallpaperMatrix = new DOMMatrix();

// -- Images --
const wallpaper = new Image();
const background = new Image();
background.src = IMAGES_PATH + "map_background.webp";

export function drawWallpaper() {
    // Draw the background over the full screen.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(background, 0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();

    if (wallpaper.complete && wallpaper.naturalWidth && wallpaper.naturalHeight) {
        const imgWidth = wallpaper.naturalWidth;
        const imgHeight = wallpaper.naturalHeight;

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
        const userMatrix = new DOMMatrix().translate(offsetX, offsetY).scale(scale);
        // Combined transform for the wallpaper.
        const combinedMatrix = userMatrix.multiply(baseMatrix);
        currentWallpaperMatrix = combinedMatrix;

        // Draw the wallpaper.
        ctx.save();
        ctx.setTransform(combinedMatrix);
        ctx.drawImage(wallpaper, 0, 0, imgWidth, imgHeight);
        ctx.restore();

        // Create a remapping matrix to convert window coordinates to wallpaper natural coordinates.
        // This matrix maps (0,0) to (0,0) and (window.innerWidth, window.innerHeight) to (imgWidth, imgHeight).
        const remapMatrix = new DOMMatrix().scale(
            imgWidth / window.innerWidth,
            imgHeight / window.innerHeight
        );

        // Compose the transforms so that overlay functions (which use window dimensions)
        // get remapped into wallpaper coordinates and then follow the wallpaper's transform.
        const overlayMatrix = combinedMatrix.multiply(remapMatrix);

        ctx.save();
        ctx.setTransform(overlayMatrix);

        drawWeatherEffects(ctx);
        drawOverlays(ctx);
        drawDayNightOverlay(ctx);
        drawWeatherFilter(ctx);
        ctx.restore();
    }
}

// ------------------------------
// Animation Loop
// ------------------------------
let lastFrameTime = performance.now();
export const animationLoop = (timestamp) => {
    const dt = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;

    updateDayNightCycle(timestamp);
    updateWeatherOverlay(timestamp);

    drawWallpaper();
    updateClouds(dt, timestamp);
    updateWeatherEffects(dt);

    requestAnimationFrame(animationLoop);
};

export function resetZoom() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    drawWallpaper();
}

export function getWallpaper() {
    return wallpaper;
}

// ------------------------------
// Canvas Event Listeners for Panning & Zooming
// ------------------------------

// Only check for Region sound occasionaly, for performance optimization
let lastRegionSoundUpdate = 0;
export function tryUpdateRegionSound() {
    const now = performance.now();
    if (now - lastRegionSoundUpdate >= 1000) {
        updateRegionSound();
        lastRegionSoundUpdate = now;
    }
}

// Canvas interaction controller
const setupCanvasInteractions = (canvas) => {
    let isDragging = false;
    let isPinching = false;
    let startDragX, startDragY;
    let initialDistance, lastScale;

    const CURSOR_GRAB = 'grab';
    const CURSOR_GRABBING = 'grabbing';

    // Common handlers
    const updateCanvas = () => {
        drawWallpaper();
        tryUpdateRegionSound();
    };

    const handleDragStart = (clientX, clientY) => {
        isDragging = true;
        startDragX = clientX - offsetX;
        startDragY = clientY - offsetY;
        canvas.style.cursor = CURSOR_GRABBING;
    };

    const handleDragMove = (clientX, clientY) => {
        if (!isDragging) return;
        offsetX = clientX - startDragX;
        offsetY = clientY - startDragY;
        updateCanvas();
    };

    const handleZoom = (zoomFactor, centerX, centerY) => {
        const constrainedScale = Math.min(Math.max(scale * zoomFactor, MIN_ZOOM_SCALE), MAX_ZOOM_SCALE);
        const scaleRatio = constrainedScale / scale;

        offsetX = centerX - (centerX - offsetX) * scaleRatio;
        offsetY = centerY - (centerY - offsetY) * scaleRatio;
        scale = constrainedScale;

        updateCanvas();
    };

    // Mouse events
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const zoomFactor = 1 + (-e.deltaY * 0.001);
        const rect = canvas.getBoundingClientRect();
        handleZoom(zoomFactor, e.clientX - rect.left, e.clientY - rect.top);
    }, { passive: false });

    canvas.addEventListener('mousedown', e => handleDragStart(e.clientX, e.clientY));

    canvas.addEventListener('mousemove', e => handleDragMove(e.clientX, e.clientY));

    // Touch events
    const handlePinchZoom = (e) => {
        const newDistance = getDistanceBetweenTouches(e);
        const rect = canvas.getBoundingClientRect();
        const [touch1, touch2] = e.touches;

        const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
        const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

        handleZoom(newDistance / initialDistance, centerX, centerY);
    };

    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        if (e.touches.length === 1) {
            handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
        } else if (e.touches.length === 2) {
            isPinching = true;
            initialDistance = getDistanceBetweenTouches(e);
            lastScale = scale;
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
        if (isDragging && e.touches.length === 1) {
            handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        } else if (isPinching && e.touches.length === 2) {
            handlePinchZoom(e);
        }
    }, { passive: false });

    // Cleanup events
    const endInteraction = () => {
        isDragging = false;
        isPinching = false;
        canvas.style.cursor = CURSOR_GRAB;
        tryUpdateRegionSound();
    };

    ['mouseup', 'mouseleave'].forEach(type =>
        canvas.addEventListener(type, endInteraction)
    );

    canvas.addEventListener('touchend', e =>
        e.touches.length === 0 && endInteraction()
    );

    // Helper function
    const getDistanceBetweenTouches = e => Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
    );
};

setupCanvasInteractions(canvas);