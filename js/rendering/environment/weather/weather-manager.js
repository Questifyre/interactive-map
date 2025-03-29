import {
    BASE_MAX_CLOUDS, CLOUD_SPAWN_PROBABILITY,
    LIGHTNING_FLASH_PROBABILITY,
    OVERLAY_FADE_DURATION,
    WEATHER_AUDIO_SOURCES,
    WEATHER_BUTTON_ID,
    WEATHER_CLOUD_MULTIPLIER,
    WEATHER_ICONS,
    WEATHER_RAIN,
    WEATHER_SUNNY
} from '../../../config/config-manager.js';

import { createAndPlayAudio, weatherAudio } from '../../../audio/sound-system.js';
import { interpolateColor, resetAudioPlayer } from '../../../utilities/utils.js';
import { Cloud, Raindrop } from './weather-classes.js';

// ==============================
// Weather System
// ==============================

let weatherState = WEATHER_SUNNY;
let maxClouds = BASE_MAX_CLOUDS;
let raindrops = [];
let lightningFlash = 0;
let lightningTimerInterval = null;
let weatherFadeStartTime = null;
let currentWeatherAlpha = 0;
let targetWeatherAlpha = 0;
let currentWeatherColor = { r: 0, g: 0, b: 0 };
let targetWeatherColor = { r: 0, g: 0, b: 0 };
let initialWeatherAlpha = 0;

const triggerLightningFlash = function () {
    lightningFlash = 1;
    setTimeout(() => lightningFlash = 0.7, 50);
    setTimeout(() => lightningFlash = 0.3, 100);
    setTimeout(() => lightningFlash = 0, 300);
    createAndPlayAudio("weather/lightning.mp3", 0.4);
}

const startLightningTimer = function () {
    if (lightningTimerInterval) {
        clearInterval(lightningTimerInterval);
    }

    lightningTimerInterval = setInterval(() => {
        let rand = Math.random();
        if (weatherState === 3 /* WEATHER_STORM */ && rand < LIGHTNING_FLASH_PROBABILITY) {
            triggerLightningFlash();
        }
    }, 5000);
}

const drawWeatherEffects = function (ctx) {
    // Draw clouds
    clouds.forEach(cloud => cloud.draw(ctx, performance.now()));

    // Draw rain
    if (weatherState >= WEATHER_RAIN) {
        raindrops.forEach(r => r.draw(ctx));
    }

    if (lightningFlash > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${lightningFlash})`;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.restore();
    }
}

const drawWeatherFilter = function (ctx) {
    if (currentWeatherAlpha > 0) {
        ctx.fillStyle = `rgb(${currentWeatherColor.r}, ${currentWeatherColor.g}, ${currentWeatherColor.b})`;
        ctx.globalAlpha = currentWeatherAlpha;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    } else if (weatherState === 1 /* WEATHER_OVERCAST */) {
        ctx.fillStyle = "#808080";
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    } else if (weatherState === 2 /* WEATHER_RAIN */) {
        ctx.fillStyle = "#5a6e7f";
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    } else if (weatherState === 3 /* WEATHER_STORM */) {
        ctx.fillStyle = "#242e38";
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
    ctx.globalAlpha = 1;
}

window.addEventListener('weatherUpdated', (event) => {
    drawWeatherEffects(event.detail.ctx);
    drawWeatherFilter(event.detail.ctx);
});

export const clouds = [];

export const updateClouds = function (dt, currentTime) {
    for (let i = clouds.length - 1; i >= 0; i--) {
        clouds[i].update(dt);
        if (clouds[i].isExpired(currentTime)) {
            clouds.splice(i, 1);
        }
    }
    if (clouds.length < maxClouds && Math.random() < CLOUD_SPAWN_PROBABILITY) {
        clouds.push(new Cloud(currentTime));
    }
}

export const updateWeatherEffects = function (dt) {
    if (weatherState >= WEATHER_RAIN) {
        if (raindrops.length < 200) {
            raindrops.push(new Raindrop());
        }
        raindrops.forEach(r => r.update(dt));
    } else {
        raindrops = [];
    }
}

export const getWeatherState = function () {
    return weatherState;
}

export const handleWeatherToggle = function () {
    weatherState = (weatherState + 1) % 4;
    document.getElementById(WEATHER_BUTTON_ID).querySelector("img").src = WEATHER_ICONS[weatherState];
    maxClouds = (weatherState === 1 /* WEATHER_OVERCAST */) ? BASE_MAX_CLOUDS * WEATHER_CLOUD_MULTIPLIER : BASE_MAX_CLOUDS;

    const weatherSoundSrc = WEATHER_AUDIO_SOURCES[weatherState];
    weatherAudio.loop = true;
    weatherAudio.volume = 0.1;

    if (weatherSoundSrc) {
        weatherAudio.src = weatherSoundSrc;
        resetAudioPlayer(weatherAudio);
        weatherAudio.play().catch(e => console.log("Autoplay blocked:", e));
    } else {
        resetAudioPlayer(weatherAudio);
    }

    weatherFadeStartTime = performance.now();
    initialWeatherAlpha = currentWeatherAlpha;

    if (weatherState === 1 /* WEATHER_OVERCAST */) {
        targetWeatherColor = { r: 128, g: 128, b: 128 }; // #808080
        targetWeatherAlpha = 0.4;
    } else if (weatherState === 2 /* WEATHER_RAIN */) {
        targetWeatherColor = { r: 90, g: 110, b: 127 }; // #5a6e7f
        targetWeatherAlpha = 0.3;
    } else if (weatherState === 3 /* WEATHER_STORM */) {
        targetWeatherColor = { r: 36, g: 46, b: 56 }; // #242e38
        targetWeatherAlpha = 0.5;
        startLightningTimer();
    } else { // WEATHER_SUNNY
        targetWeatherAlpha = 0;
        lightningFlash = 0;

        if (lightningTimerInterval) {
            clearInterval(lightningTimerInterval);
            lightningTimerInterval = null;
        }
    }
}

export const updateWeatherOverlay = function(timestamp) {
    if (weatherFadeStartTime !== null) {
        let progress = (timestamp - weatherFadeStartTime) / OVERLAY_FADE_DURATION;
        if (progress >= 1) {
            progress = 1;
            weatherFadeStartTime = null;
            currentWeatherAlpha = targetWeatherAlpha;
            currentWeatherColor = targetWeatherColor;
        } else if (progress < 0) {
            progress = 0;
        } else {
            currentWeatherAlpha = initialWeatherAlpha + (targetWeatherAlpha - initialWeatherAlpha) * progress;
            currentWeatherColor = interpolateColor(currentWeatherColor, targetWeatherColor, progress);
        }
    }
}