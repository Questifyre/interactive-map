import { BUTTON_PATH, DAY, OVERLAY_FADE_DURATION, OVERLAY_PROPERTIES, SET_TIME_BUTTON_ID } from '../config/config-manager.js';
import { hexToRgb, interpolateColor } from '../utilities/utils.js';
import { drawStatuses } from './canvas-manager.js';

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
let isListening = false;

const drawDayTimeOverlay = function (ctx) {
    if (currentTimeOverlayAlpha > 0) {
        ctx.fillStyle = `rgb(${currentTimeOverlayColor.r}, ${currentTimeOverlayColor.g}, ${currentTimeOverlayColor.b})`;
        ctx.globalAlpha = currentTimeOverlayAlpha;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.globalAlpha = 1;
    }
}

const handleOverlaysUpdated = (event) => {
    drawDayTimeOverlay(event.detail.ctx);
}

export const updateDayTimeCycle = function (timestamp) {
    if (fadeStartTime !== null) {
        let progress = (timestamp - fadeStartTime) / OVERLAY_FADE_DURATION;
        drawStatuses.time.mustRedraw = true;

        if (progress >= 1) {
            progress = 1;
            fadeStartTime = null;
            drawStatuses.time.mustRedraw = false;
        }
        currentTimeOverlayAlpha = initialTimeOverlayAlpha + (targetTimeOverlayAlpha - initialTimeOverlayAlpha) * progress;
        currentTimeOverlayColor = interpolateColor(initialTimeOverlayColor, targetTimeOverlayColor, progress);
    }
}

export const handleDayTimeToggle = function () {
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
    drawStatuses.time.mustRedraw = true;

    const dayTimeButton = document.getElementById(SET_TIME_BUTTON_ID);
    if (dayTimeButton) {
        const img = dayTimeButton.querySelector("img");
        if (img) {
            img.src = `${BUTTON_PATH}day_night_${dayNightState}.png`;
        }
    }

    if(newState != 0 && !isListening)
    {
        window.addEventListener('timeUpdated', handleOverlaysUpdated);
        isListening = true;
    }
    else if(newState == 0 && isListening)
    {
        window.removeEventListener('timeUpdated', handleOverlaysUpdated);
        isListening = false;
    }
}