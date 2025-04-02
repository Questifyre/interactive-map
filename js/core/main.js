import {
  CONFIG_LOAD_PROMISE,
  CONFIG_SETTINGS,
  MAP_FILES,
  MAP_TOOLTIPS,
  MAPS_PATH,
} from "../config/config-manager.js";

import { createAndPlayAudio } from "../audio/sound-system.js";
import { getMap, redrawCanvas } from "../rendering/canvas-manager.js";
import { startHeaderAnimation } from "../ui/components/header-animation.js";
import { setupMainLoadingScreen } from "../ui/components/loading-screen-manager.js";
import { createBottomNavBarButtons } from "../ui/navigation/bottom-navbar-button-manager.js";
import { setupMapAreaTooltips } from "../ui/tooltips/map-tooltips-manager.js";

// ==============================
// Main Script File
// ==============================

// Get the map image from canvas.js
const map = getMap();

const startApplication = function () {
  //Setup Removal of the Intro Popup - Used for welcome messages, update news, etc.
  const introPopup = document.getElementById("intro-popup");
  if (introPopup) {
    const introPopupCloseButton = introPopup.querySelector(".popup-close-btn");
    const introPopupSupportButton = introPopup.querySelector(".popup-ok-btn");

    const removeIntroPopup = function () {
      createAndPlayAudio("effects/button_tap_1.mp3", 0.1, true);
      introPopup.classList.add("fade-out");
      introPopup.addEventListener("animationend", () => {
        introPopup.remove();
        setTimeout(startHeaderAnimation, 400);
      }, { once: true });
    };

    const supportProject = function () {
      window.open("https://ko-fi.com/questifyre");
      removeIntroPopup();
    };

    introPopupCloseButton.addEventListener("click", removeIntroPopup);
    introPopupSupportButton.addEventListener("click", supportProject);
  }
  else // Start the intro header immediately if not on sample
  {
    setTimeout(startHeaderAnimation, 400);
  }

  // We have to forcefully load "map-tooltips-manager.js" because some browsers won't load it if there's no hardlink.
  if(MAP_TOOLTIPS)
  {
    setupMapAreaTooltips();
  }
};

window.addEventListener("application-started", () => {
  startApplication();
});

// Handle User Config File
const loadConfigFile = async function () {
  try {
    await CONFIG_LOAD_PROMISE;

    if (CONFIG_SETTINGS) {
      createBottomNavBarButtons(CONFIG_SETTINGS);

      // Handle page title configuration
      const titleSuffix = "| Questifyre";
      const pageTitle = CONFIG_SETTINGS["Page Title"];
      if (pageTitle) {
        document.title = `${pageTitle} ${titleSuffix}`;
      }
      else {
        document.title = `$"Interactive Map" ${titleSuffix}`;
      }

      // Handle intro popup removal
      const introPopup = document.getElementById("intro-popup");
      if (introPopup) {
        const isSampleMap = CONFIG_SETTINGS["Page Title"] === "Sample Map";
        if (!isSampleMap) {
          introPopup.remove();
        }
      }
    }
  } catch (error) {
    console.error("Could not load config settings from configs file:", error);
  }
};

// Function to initialize the loading screen after config and map are ready
const initializeLoading = async function () {
  await loadConfigFile();

  // Setup loading screen and onload handler BEFORE setting the image source
  setupMainLoadingScreen(map, redrawCanvas);

  // Set the map source after attaching the onload handler
  if (MAP_FILES && MAP_FILES["Grid"]) {
    map.src = MAPS_PATH + MAP_FILES["Grid"];
  } else {
    console.error("MAP_FILES or MAP_FILES[\"Grid\"] is not defined after config load.");
  }
};

// Load config and then initialize loading
initializeLoading();

// Prevents the right click context menu from showing
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});