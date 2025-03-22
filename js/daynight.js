import { BUTTON_PATH, DAY, DAY_NIGHT_BUTTON_ID, OVERLAY_PROPERTIES, OVERLAY_FADE_DURATION } from './config.js';
import { hexToRgb, interpolateColor } from './utils.js';

// ==============================
// Day & Night Cycle System
// ==============================

let dayNightState = DAY;
let currentTimeOverlayAlpha = 0;
let currentTimeOverlayColor = { r: 0, g: 0, b: 0 };
let targetTimeOverlayAlpha = 0;
let targetTimeOverlayColor = { r: 0, g: 0, b: 0 };
let initialTimeOverlayAlpha = 0;
let initialTimeOverlayColor = { r: 0, g: 0, b: 0 };
let fadeStartTime = null;

export function updateDayNightCycle(timestamp) {
    if (fadeStartTime !== null) {
        let progress = (timestamp - fadeStartTime) / OVERLAY_FADE_DURATION;
        if (progress >= 1) {
            progress = 1;
            fadeStartTime = null;
        }
        currentTimeOverlayAlpha = initialTimeOverlayAlpha + (targetTimeOverlayAlpha - initialTimeOverlayAlpha) * progress;
        currentTimeOverlayColor = interpolateColor(initialTimeOverlayColor, targetTimeOverlayColor, progress);
    }
}

export function drawDayNightOverlay(ctx) {
    if (currentTimeOverlayAlpha > 0) {
        ctx.fillStyle = `rgb(${currentTimeOverlayColor.r}, ${currentTimeOverlayColor.g}, ${currentTimeOverlayColor.b})`;
        ctx.globalAlpha = currentTimeOverlayAlpha;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.globalAlpha = 1;
    }
}

export function handleDayNightToggle() {
    const oldState = dayNightState;
    const newState = (dayNightState + 1) % 3;
    const oldProps = OVERLAY_PROPERTIES[oldState];
    const newProps = OVERLAY_PROPERTIES[newState];

    initialTimeOverlayAlpha = (fadeStartTime === null) ? oldProps.alpha : currentTimeOverlayAlpha;
    initialTimeOverlayColor = (fadeStartTime === null) ? hexToRgb(oldProps.color) : currentTimeOverlayColor;

    targetTimeOverlayAlpha = newProps.alpha;
    targetTimeOverlayColor = hexToRgb(newProps.color);

    dayNightState = newState;
    fadeStartTime = performance.now();

    const dayNightButton = document.getElementById(DAY_NIGHT_BUTTON_ID);
    if (dayNightButton) {
        const img = dayNightButton.querySelector("img");
        if (img) {
            img.src = `${BUTTON_PATH}day_night_${dayNightState}.png`;
        }
    }
}