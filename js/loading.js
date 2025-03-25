import { LOADING_SCREEN_MAIN_ID, LOADING_CONTENT_MAIN_ID, LOADING_TIP_TEXT_ID, LOADING_SCREEN_SECONDARY_ID, LOADING_CONTENT_SECONDARY_ID } from './config.js';
import { animationLoop } from './canvas/canvas.js';
import { startApplication } from './main.js';

// ==============================
// Main Loading Screen Handling
// ==============================
export function setupMainLoadingScreen(wallpaper, drawMapCallback) {
    const loadingScreen = document.getElementById(LOADING_SCREEN_MAIN_ID);
    const loadingContent = document.getElementById(LOADING_CONTENT_MAIN_ID);
    const loadingTipText = document.getElementById(LOADING_TIP_TEXT_ID);

    const loadingMessages = [
        "Consulting the ancient scrolls",
        "Sharpening our quills for mapping",
        "The cartographer is hard at work",
        "Unfurling the parchment of your realm",
        "Gathering the pixels for your design",
        "Summoning the digital ink",
        "The forge is heating up",
        "Mages are weaving the visual tapestry",
        "Goblins are placing every pixel",
        "Beholders are lending their eyes",
        "Rolling initiative for map generation",
        "Venturing into the digital wilderness",
        "Mapping the uncharted territories",
        "Beware, loading may involve dragons",
        "Our party is preparing the map",
        "Joining a Quest of Fyre",
        "Whispers of your world are taking form",
        "Polishing the gems of your creation",
        "Aligning the stars of your custom map",
        "The compass is spinning, almost there",
        "Brewing a potion of map completion",
        "Chanting the spell of visualization",
        "The dice have been cast",
        "Embarking on the loading quest",
        "Your map is materializing",
    ];

    let imageLoaded = false;
    let minimumDelayPassed = false;

    const hideLoadingScreen = () => {
        if (imageLoaded && minimumDelayPassed) {
            let opacity = 1;
            const fadeInterval = setInterval(() => {
                opacity -= 0.02;
                loadingScreen.style.opacity = opacity;
                loadingContent.style.opacity = opacity;

                if (opacity <= -0) {
                    clearInterval(fadeInterval);
                    startApplication();
                    requestAnimationFrame(animationLoop);
                    loadingScreen.remove();
                }
            }, 20);
        }
    };

    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    let currentLoadingText = loadingMessages[randomIndex];
    let ellipsisCounter = 0;
    let ellipsisInterval;
    loadingTipText.textContent = currentLoadingText

    // Function to update the ellipsis
    const dots = ["", ".", "..", "..."];
    const updateEllipsis = () => {
        loadingTipText.textContent = currentLoadingText + dots[ellipsisCounter];
        ellipsisCounter = (ellipsisCounter + 1) % 4;
        if (ellipsisCounter === 0) {
            ellipsisCounter = 1;
        }
    };

    // Start the ellipsis animation
    ellipsisInterval = setInterval(updateEllipsis, 500);

    wallpaper.onload = () => {
        imageLoaded = true;
        drawMapCallback();
        hideLoadingScreen();
    };

    setTimeout(() => {
        minimumDelayPassed = true;
        hideLoadingScreen();
    }, 3000);
}

// ==============================
// Secondary Loading Screen Handling
// ==============================

const loadingScreen = document.getElementById(LOADING_SCREEN_SECONDARY_ID);
const loadingContent = document.getElementById(LOADING_CONTENT_SECONDARY_ID);
const DELAY_MS = 1;

const showLoadingWidget = function () {
    loadingScreen.style.display = 'flex';
    loadingContent.style.display = 'flex';
}

const hideLoadingWidget = function () {
    loadingScreen.style.opacity = 1;
    loadingContent.style.opacity = 1;
    let opacity = 1;
    const fadeInterval = setInterval(() => {
        opacity -= 0.2;
        loadingScreen.style.opacity = opacity;
        loadingContent.style.opacity = opacity;

        if (opacity <= -0) {
            clearInterval(fadeInterval);
            loadingScreen.style.display = 'none';
            loadingContent.style.display = 'none';
        }
    }, 20);
}

export async function loadWithScreen(task) {
    let timeoutId;
    let loadingShown = false;
    let taskCompleted = false;

    timeoutId = setTimeout(() => {
        if (!taskCompleted) {
            showLoadingWidget();
            loadingShown = true;
        }
    }, DELAY_MS);

    try {
        const result = await task();
        taskCompleted = true;
        clearTimeout(timeoutId);
        if (loadingShown) {
            hideLoadingWidget();
        }
        return result;
    } catch (error) {
        taskCompleted = true;
        clearTimeout(timeoutId);
        if (loadingShown) {
            hideLoadingWidget();
        }
        throw error;
    }
}

// ==============================
// Utilities
// ==============================

export async function loadImageWithCache(newSrc, existingImage) {
    if (existingImage?.src === newSrc && existingImage.complete) {
        return existingImage;
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = newSrc;
    });
}