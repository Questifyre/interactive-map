import {
    CONFIG_SETTINGS,
    CONFIG_LOAD_PROMISE,
    MAP_FILES,
    MAPS_PATH,
    MAP_TOOLTIPS,
} from './config.js';

import {
    setupNavBarTooltipListeners
} from './ui.js';

import { configureAudio, updateRegionSound } from './audio.js';
import { initializeKeyBindings } from './keybindings-manager.js';
import { getMap, redrawCanvas } from './canvas/canvas.js';
import { startHeaderAnimation } from './header.js';
import { setMapInteractionSystem } from './canvas/canvas-interactions.js';
import { setupMainLoadingScreen } from './loading.js';
import { configureNavBarButtons, toggleButtonsFromConfig } from './navbar-buttons.js';
import { setupMapAreaTooltips } from './map-tooltips.js';

// ==============================
// Main Script File
// ==============================

// Get the map image from canvas.js
const map = getMap();

export function startApplication() {

    //Setup Removal of the Intro Popup
    const introPopup = document.getElementById('intro-popup');
    const introPopupCloseButton = introPopup.querySelector('.popup-close-btn');
    const introPopupSupportButton = introPopup.querySelector('.popup-ok-btn');

    function removeIntroPopup() {
        introPopup.classList.add('fade-out');
        introPopup.addEventListener('animationend', () => {
            introPopup.remove();
            setTimeout(startHeaderAnimation, 400);
        }, { once: true });
    }

    function supportProject() {
        window.open('https://ko-fi.com/questifyre');
        removeIntroPopup();
    }

    introPopupCloseButton.addEventListener('click', removeIntroPopup);
    introPopupSupportButton.addEventListener('click', supportProject);

    //Platform specific
    const isMobileDevice = function () {
        // Check for mobile user agent patterns
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i;
        const isMobileUA = mobileRegex.test(navigator.userAgent);

        // Check for touch support AND either mobile user agent or small screen
        const hasTouch = 'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0;

        // Modern browsers support navigator.userAgentData
        const isMobileBranding = navigator.userAgentData?.mobile === true;

        // If any mobile indicators exist and it's not a Windows touch device
        return (isMobileUA || isMobileBranding) &&
            !/Windows NT/i.test(navigator.userAgent) &&
            (hasTouch || window.innerWidth <= 768);
    }

    //Basic functionality initialization
    configureAudio();
    configureNavBarButtons();
    initializeKeyBindings();
    setupNavBarTooltipListeners();
    setMapInteractionSystem(isMobileDevice());
    updateRegionSound();

    // Interactive Map Location Tooltips
    if (MAP_TOOLTIPS)
    {
        setupMapAreaTooltips();
    }
}

// Function to initialize the loading screen after config and map are ready
async function initializeLoading() {
    await loadConfigFile();

    // Setup loading screen and onload handler BEFORE setting the image source
    setupMainLoadingScreen(map, redrawCanvas);

    // Set the map source after attaching the onload handler
    if (MAP_FILES && MAP_FILES["Grid"]) {
        map.src = MAPS_PATH + MAP_FILES["Grid"];
    } else {
        console.error('MAP_FILES or MAP_FILES["Grid"] is not defined after config load.');
    }
}

// Load config and then initialize loading
initializeLoading();

// Handle User Config File
async function loadConfigFile() {
    await CONFIG_LOAD_PROMISE;
    try {
        if (CONFIG_SETTINGS) {
            let titleSuffix = " | Questifyre"
            document.title = CONFIG_SETTINGS["Page Title"] + titleSuffix ?? document.title + titleSuffix;
            toggleButtonsFromConfig(CONFIG_SETTINGS);
        }
    } catch (error) {
        console.error('Could not load config settings from configs file:', error);
    }
}

// Prevents the right click context menu from showing
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});