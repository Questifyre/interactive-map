import {
    CONFIG_LOAD_PROMISE,
    CONFIG_SETTINGS,
    MAP_FILES,
    MAP_TOOLTIPS,
    MAPS_PATH,
} from '../config/config-manager.js';

import { configureAudio, createAndPlayAudio, updateRegionSound } from '../audio/sound-system.js';
import { setMapInteractionSystem } from '../input/canvas/canvas-input-manager.js';
import { initializeKeyBindings } from '../input/keybindings-manager.js';
import { getMap, redrawCanvas } from '../rendering/canvas-manager.js';
import { startHeaderAnimation } from '../ui/components/header-animation.js';
import { setupMainLoadingScreen } from '../ui/components/loading-screen-manager.js';
import { configureBottomNavBarButtons, createBottomNavBarButtons } from '../ui/navigation/bottom-navbar-button-manager.js';
import { setupMapAreaTooltips } from '../ui/tooltips/map-tooltips-manager.js';
import { setupNavBarTooltipListeners } from '../ui/ui-manager.js';

// ==============================
// Main Script File
// ==============================

// Get the map image from canvas.js
const map = getMap();

export const startApplication = function () {

    //Setup Removal of the Intro Popup - Used for welcome messages, update news, etc.
    const introPopup = document.getElementById('intro-popup');
    if (introPopup)
    {
        const introPopupCloseButton = introPopup.querySelector('.popup-close-btn');
        const introPopupSupportButton = introPopup.querySelector('.popup-ok-btn');

        const removeIntroPopup = function () {
            createAndPlayAudio("effects/button_tap_1.mp3", 0.1, true);
            introPopup.classList.add('fade-out');
            introPopup.addEventListener('animationend', () => {
                introPopup.remove();
                setTimeout(startHeaderAnimation, 400);
            }, { once: true });
        }

        const supportProject = function () {
            window.open('https://ko-fi.com/questifyre');
            removeIntroPopup();
        }

        introPopupCloseButton.addEventListener('click', removeIntroPopup);
        introPopupSupportButton.addEventListener('click', supportProject);
    }

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
    configureBottomNavBarButtons();
    initializeKeyBindings();
    setupNavBarTooltipListeners();
    setMapInteractionSystem(isMobileDevice());
    updateRegionSound();

    // Interactive Map Location Tooltips
    if (MAP_TOOLTIPS) {
        setupMapAreaTooltips();
    }
}

// Handle User Config File
const loadConfigFile = async function () {
    await CONFIG_LOAD_PROMISE;
    try {
        if (CONFIG_SETTINGS) {
            // Apply Web Page Name
            const pageTitle = CONFIG_SETTINGS["Page Title"];
            if (pageTitle)
            {
                const titleSuffix = " | Questifyre"
                document.title = pageTitle + titleSuffix ?? document.title + titleSuffix;
                createBottomNavBarButtons(CONFIG_SETTINGS);

                // Currently remove intro popup if not on the Github Sample!
                const introPopup = document.getElementById('intro-popup');
                if (introPopup && pageTitle == '') {
                    introPopup.remove();
                }
            }
        }
    } catch (error) {
        console.error('Could not load config settings from configs file:', error);
    }
}

// Function to initialize the loading screen after config and map are ready
const initializeLoading = async function () {
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

// Prevents the right click context menu from showing
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});