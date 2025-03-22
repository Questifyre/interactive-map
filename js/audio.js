import {
    AUDIO_PATH,
    AMBIANCE_PATH,
    AMBIANCE_SLIDER_ID,
    AMBIANCE_MAX_VOLUME as configAmbianceMaxVolume,
    CONFIG_SETTINGS,
    CROSSFADE_DURATION,
    MUSIC_PATH,
    MUSIC_SLIDER_ID,
    MUSIC_MAX_VOLUME as configMusicMaxVolume,
    REGION_PATH,
    REGION_MUSIC_DATA
} from './config.js';

import { currentWallpaperMatrix } from './canvas.js';

// ==============================
// Audio Configuration
// ==============================

// -- Audio Settings --
let AMBIANCE_MAX_VOLUME = configAmbianceMaxVolume;
let MUSIC_MAX_VOLUME = configMusicMaxVolume;

// -- Audio Players --
const ambianceAudio = new Audio(AMBIANCE_PATH + "wind_ambience.mp3");
ambianceAudio.loop = true;
ambianceAudio.volume = AMBIANCE_MAX_VOLUME;
playAudio(ambianceAudio);

let musicAudio = new Audio(MUSIC_PATH + "intro_theme.mp3");
musicAudio.volume = MUSIC_MAX_VOLUME;
playAudio(musicAudio);

export let weatherAudio = new Audio();
weatherAudio.volume = AMBIANCE_MAX_VOLUME;

// ----------
// Region Music
// ----------
let activeSoundRegion = null;
let isCrossfading = false;

// Attach slider event listeners for audio volume
document.getElementById(AMBIANCE_SLIDER_ID).addEventListener("input", e => {
    AMBIANCE_MAX_VOLUME = parseFloat(e.target.value);
    ambianceAudio.volume = AMBIANCE_MAX_VOLUME;
});
document.getElementById(MUSIC_SLIDER_ID).addEventListener("input", e => {
    MUSIC_MAX_VOLUME = parseFloat(e.target.value);
    musicAudio.volume = MUSIC_MAX_VOLUME;
});

export function updateRegionSound() {
    if (!REGION_MUSIC_DATA) return;

    // Get view center coordinates
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    // Transform view center coordinates to natural image space using matrix
    const point = new DOMPoint(viewportCenterX, viewportCenterY);
    const invertedMatrix = currentWallpaperMatrix.inverse();
    const transformedPoint = invertedMatrix.transformPoint(point);

    const naturalX = transformedPoint.x;
    const naturalY = transformedPoint.y;

    if (CONFIG_SETTINGS["TEST-TrackMapCenter"]) {
        console.log("Map center in natural coordinates:", naturalX, naturalY);
    }

    const regionFound = REGION_MUSIC_DATA.find(region => {
        const { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax } } = region.area;
        return naturalX >= xMin && naturalX <= xMax &&
            naturalY >= yMin && naturalY <= yMax;
    });

    if (regionFound) {
        if (activeSoundRegion !== regionFound) {
            crossfadeTo(regionFound);
        }
    } else if (activeSoundRegion !== null) {
        crossfadeOut();
    }
}

function crossfadeTo(newRegion) {
    if (isCrossfading) return;
    isCrossfading = true;

    const newAudio = new Audio(REGION_PATH + newRegion["sound path"]);
    newAudio.loop = true;
    newAudio.volume = 0;
    playAudio(newAudio);

    const startTime = performance.now();
    const oldMusicAudio = musicAudio;

    const step = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / CROSSFADE_DURATION, 1);

        if (!oldMusicAudio.paused && oldMusicAudio !== newAudio) {
            oldMusicAudio.volume = MUSIC_MAX_VOLUME * (1 - progress);
        }
        newAudio.volume = MUSIC_MAX_VOLUME * progress;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            if (!oldMusicAudio.paused && oldMusicAudio !== newAudio) {
                oldMusicAudio.pause();
                oldMusicAudio.currentTime = 0;
            }
            musicAudio = newAudio;
            activeSoundRegion = newRegion;
            isCrossfading = false;
        }
    };

    requestAnimationFrame(step);
}

function crossfadeOut() {
    if (isCrossfading) return;
    isCrossfading = true;

    const startTime = performance.now();
    const currentMusicAudio = musicAudio;

    const step = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / CROSSFADE_DURATION, 1);

        if (!currentMusicAudio.paused) {
            currentMusicAudio.volume = MUSIC_MAX_VOLUME * (1 - progress);
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            currentMusicAudio.pause();
            currentMusicAudio.currentTime = 0;
            activeSoundRegion = null;
            isCrossfading = false;
        }
    };

    requestAnimationFrame(step);
}

function playAudio(audio) {
    if (audio) {
        audio.play().catch(e => console.log("Autoplay blocked:", e));
    }
    else {
        console.error("No audio found!");
    }
}

export function createAndPlayAudio(path, volume) {
    const audio = new Audio(AUDIO_PATH + path);
    audio.volume = volume;
    playAudio(audio);
}