import {
  AMBIANCE_PATH,
  AMBIANCE_SLIDER_ID,
  AUDIO_PATH,
  CROSSFADE_DURATION,
  MUSIC_PATH,
  MUSIC_SLIDER_ID,
  REGION_MUSIC_DATA,
  REGION_PATH,
  VOLUME,
} from "../config/config-manager.js";

import { currentWallpaperMatrix } from "../rendering/canvas-manager.js";

// ==============================
// Constant Functions
// ==============================

const playAudio = function (audio) {
  if (audio) {
    audio.play().catch(e => console.log("Autoplay blocked:", e));
  }
  else {
    console.error("No audio found!");
  }
};

const crossfadeTo = function (newRegion) {
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
      oldMusicAudio.volume = MUSIC_VOLUME * (1 - progress);
    }
    newAudio.volume = MUSIC_VOLUME * progress;

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
};

const crossfadeOut = function () {
  if (isCrossfading) return;
  isCrossfading = true;

  const startTime = performance.now();
  const currentMusicAudio = musicAudio;

  const step = () => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / CROSSFADE_DURATION, 1);

    if (!currentMusicAudio.paused) {
      currentMusicAudio.volume = MUSIC_VOLUME * (1 - progress);
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
};

// ==============================
// Audio Configuration
// ==============================

// -- Audio Settings --
export let AMBIANCE_VOLUME = VOLUME.AMBIANCE_VOLUME;
export let MUSIC_VOLUME = VOLUME.MUSIC_VOLUME;

// -- Audio Players --
let ambianceAudio = new Audio(AMBIANCE_PATH + "wind_ambience.mp3");
ambianceAudio.loop = true;
ambianceAudio.volume = AMBIANCE_VOLUME;
playAudio(ambianceAudio);

let musicAudio = new Audio(MUSIC_PATH + "intro_theme.mp3");
musicAudio.volume = MUSIC_VOLUME;
playAudio(musicAudio);

export let weatherAudio = new Audio();
weatherAudio.volume = AMBIANCE_VOLUME;

// ----------
// Region Music
// ----------
let activeSoundRegion = null;
let isCrossfading = false;

// Store the event handler functions
let ambianceSliderHandler;
let musicSliderHandler;

//Await user preference loading before switching volume
const configureAudio = function () {
  AMBIANCE_VOLUME = VOLUME.AMBIANCE_VOLUME;
  MUSIC_VOLUME = VOLUME.MUSIC_VOLUME;

  ambianceAudio.volume = AMBIANCE_VOLUME;
  weatherAudio.volume = AMBIANCE_VOLUME;
  musicAudio.volume = MUSIC_VOLUME;
};

window.addEventListener("application-started", () => {
  configureAudio();
});

// Attach slider event listeners for audio volume
export const addSoundPanelListeners = function () {
  const ambianceSlider = document.getElementById(AMBIANCE_SLIDER_ID);
  const musicSlider = document.getElementById(MUSIC_SLIDER_ID);

  const saveVolumeCookie = () => {
    const volumeData = {
      AMBIANCE_VOLUME: AMBIANCE_VOLUME,
      MUSIC_VOLUME: MUSIC_VOLUME,
    };
    const cookieValue = encodeURIComponent(JSON.stringify(volumeData));
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `volume=${cookieValue}; expires=${expires.toUTCString()}; path=/`;
  };

  ambianceSliderHandler = e => {
    AMBIANCE_VOLUME = parseFloat(e.target.value);
    ambianceAudio.volume = AMBIANCE_VOLUME;
    saveVolumeCookie();
  };

  musicSliderHandler = e => {
    MUSIC_VOLUME = parseFloat(e.target.value);
    musicAudio.volume = MUSIC_VOLUME;
    saveVolumeCookie();
  };

  ambianceSlider.addEventListener("input", ambianceSliderHandler);
  musicSlider.addEventListener("input", musicSliderHandler);
};

// Remove on demand
export const removeSoundPanelListeners = function () {
  const ambianceSlider = document.getElementById(AMBIANCE_SLIDER_ID);
  const musicSlider = document.getElementById(MUSIC_SLIDER_ID);

  if (ambianceSlider && ambianceSliderHandler) {
    ambianceSlider.removeEventListener("input", ambianceSliderHandler);
  }

  if (musicSlider && musicSliderHandler) {
    musicSlider.removeEventListener("input", musicSliderHandler);
  }

  ambianceSliderHandler = null;
  musicSliderHandler = null;
};

export const updateRegionSound = function () {
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
};

window.addEventListener("application-started", () => {
  updateRegionSound();
});

export const createAndPlayAudio = function (path, volume, randomPitch) {
  const audio = new Audio(AUDIO_PATH + path);
  audio.volume = volume;
  if (randomPitch) {
    audio.playbackRate = 0.4 + Math.random() * 0.3;
  };
  playAudio(audio);
};