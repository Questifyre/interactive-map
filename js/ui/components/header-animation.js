import {
    CHARACTER_FADE_DURATION,
    CHARACTER_SPACING,
    CONFIG_SETTINGS,
    HEADER_STAY_DURATION,
    HEADER_TEXT_ID,
    OVERLAY_HEADER_ID,
    TYPING_SPEED
} from '../../config/config-manager.js';

// ==============================
// Intro Header Configurations
// ==============================

const fadeOutHeader = () => {
    const headerElement = document.getElementById(HEADER_TEXT_ID);
    if (!headerElement) return;
    let opacity = 1;
    const fadeOutDuration = 500; // Duration of the fade out
    const startTime = performance.now();

    const step = () => {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        if (elapsedTime < fadeOutDuration) {
            opacity = 1 - (elapsedTime / fadeOutDuration);
            headerElement.style.opacity = opacity;
            requestAnimationFrame(step);
        } else {
            const headerOverlay = document.getElementById(OVERLAY_HEADER_ID);
            if (headerOverlay) {
                headerOverlay.remove();
            }
        }
    };
    requestAnimationFrame(step);
};

const animateCharacterFadeIn = (element, duration) => {
    let startTime = performance.now();

    const step = () => {
        let elapsedTime = performance.now() - startTime;
        let progress = Math.min(elapsedTime / duration, 1); // Ensure opacity is between 0 and 1

        element.style.opacity = progress; // Smoothly transition opacity

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
};

export const startHeaderAnimation = () => {
    const headerElement = document.getElementById(HEADER_TEXT_ID);
    if (!headerElement) {
        console.error(`Element with id "${HEADER_TEXT_ID}" not found.`);
        return;
    }

    if (!CONFIG_SETTINGS) return;

    const headerText = CONFIG_SETTINGS["Welcome Header"];
    if (!headerText || (headerText && headerText == "")) return;

    headerElement.innerHTML = "";
    const characters = headerText.split("");

    characters.forEach((char, index) => {
        const charSpan = document.createElement("span");
        charSpan.textContent = char;
        charSpan.style.opacity = 0;
        charSpan.style.display = "inline-block";
        charSpan.style.marginRight = (index === characters.length - 1 ? "0" : CHARACTER_SPACING);
        headerElement.appendChild(charSpan);

        // Each letter starts fading in at a staggered delay
        setTimeout(() => {
            animateCharacterFadeIn(charSpan, CHARACTER_FADE_DURATION);
        }, index * TYPING_SPEED);
    });

    // Schedule fade-out after all animations finish
    setTimeout(fadeOutHeader, HEADER_STAY_DURATION + (characters.length * TYPING_SPEED));
};