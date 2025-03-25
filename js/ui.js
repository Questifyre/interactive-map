import {
    BUTTON_PATH,
    MAPS_PATH,
    MAP_FILES,
    PANEL_CHECKMARK_CLASS_SELECTOR,
    TOGGLE_GRID_BUTTON_ID
} from './config.js';

import { addSoundPanelListeners, removeSoundPanelListeners, AMBIANCE_VOLUME, MUSIC_VOLUME } from './audio.js';
import { loadWithScreen } from './loading.js';

// ==============================
// User Interface Handling
// ==============================

let gridActive = true;
const gridButton = document.getElementById(TOGGLE_GRID_BUTTON_ID);
const updateGridButtonVisual = function () {
    const buttonImageSrc = gridActive ? BUTTON_PATH + "grid_0.png" : BUTTON_PATH + "grid_1.png";
    if (gridButton && gridButton.querySelector("img")) {
        gridButton.querySelector("img").src = buttonImageSrc;
    }
}

export async function handleGridToggle(wallpaper, drawMapCallback) {
    gridActive = !gridActive;
    updateGridButtonVisual();

    // Async loading with threshold
    await loadWithScreen(async () => {
        await swapWallpaperImage(wallpaper);
        await drawMapCallback();
    });
}

// Dedicated async image loader
async function swapWallpaperImage(imgElement) {
    const newSrc = gridActive ? MAPS_PATH + MAP_FILES["Grid"] : MAPS_PATH + MAP_FILES["Gridless"];
    if (imgElement.src === newSrc) return;

    return new Promise((resolve) => {
        imgElement.onload = () => resolve();
        imgElement.src = newSrc;
    });
}

export function handleSoundPanelToggle() {
    let panel = document.getElementById("soundPanel");

    // If the panel doesn't exist, create it dynamically
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "soundPanel";
        panel.className = "sound-panel";
        panel.innerHTML = `
            <div class="sound-widget" id="musicWidget">
                <img src="assets/tool/images/icons/buttons/music_slider.png" alt="Music">
                <input type="range" id="musicSlider" min="0" max="1" step="0.01" value="${MUSIC_VOLUME}">
            </div>
            <div class="sound-widget" id="ambianceWidget">
                <img src="assets/tool/images/icons/buttons/ambiance_slider.png" alt="Ambiance">
                <input type="range" id="ambianceSlider" min="0" max="1" step="0.01" value="${AMBIANCE_VOLUME}">
            </div>
        `;
        document.body.appendChild(panel);
        // Set to visible initially after creation
        panel.style.display = "block";
        addSoundPanelListeners();
    } else {
        //Remove panel for optimization
        panel.remove();
        removeSoundPanelListeners();
    }
}

export function setupNavBarTooltipListeners() {
    const navBarButtons = document.querySelectorAll('.nav-bar-button');
    const highlightMarkup = '*';

    navBarButtons.forEach(button => {
        let tooltipElement = null;

        button.addEventListener('mouseover', function () {
            const tooltipText = this.getAttribute('data-tooltip');
            if (!tooltipText) return;

            tooltipElement = document.createElement('div');
            tooltipElement.classList.add('custom-tooltip-highlight');

            const parts = tooltipText.split(highlightMarkup);
            parts.forEach((part, index) => {
                const span = document.createElement('span');
                span.textContent = part;
                if (index % 2 !== 0) {
                    span.classList.add('tooltip-highlighted');
                }
                tooltipElement.appendChild(span);
            });

            document.body.appendChild(tooltipElement);

            const buttonRect = this.getBoundingClientRect();
            const tooltipRect = tooltipElement.getBoundingClientRect();

            // Position the tooltip above the button (adjust as needed)
            const top = buttonRect.top - tooltipRect.height - 10;
            const left = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);

            tooltipElement.style.position = 'fixed';
            tooltipElement.style.top = `${top}px`;
            tooltipElement.style.left = `${left}px`;
            tooltipElement.style.zIndex = 1001; // Ensure it's above other elements

            tooltipElement.style.opacity = 1;
            tooltipElement.style.visibility = 'visible';
        });

        button.addEventListener('mouseout', function () {
            if (tooltipElement) {
                tooltipElement.remove();
                tooltipElement = null;
            }
        });
    });
}

export function disableButton(buttonID) {
    const button = document.getElementById(buttonID);
    if (button) {
        button.disabled = true;
        button.style.cursor = 'default';

        const img = button.querySelector('img');
        if (img) {
            img.style.filter = 'grayscale(100%)';
            img.style.opacity = '0.6';
        }
    } else {
        console.error(`Button with ID "${buttonID}" not found.`);
    }
}

export function disableOverlay(overlayID) {
    const listItem = document.getElementById(overlayID);
    if (listItem) {
        listItem.classList.add('disabled-overlay-item');

        const img = listItem.querySelector('.non-interactive-button img');
        if (img) {
            img.style.filter = 'grayscale(100%)';
            img.style.opacity = '0.6';
        }
    } else {
        console.error(`Overlay list item with ID "${overlayID}" not found.`);
    }
}

export function enableOverlay(overlayID) {
    const listItem = document.getElementById(overlayID);
    if (listItem) {
        listItem.classList.remove('disabled-overlay-item');

        const img = listItem.querySelector('.non-interactive-button img');
        if (img) {
            img.style.filter = '';
            img.style.opacity = '1';
        }
    } else {
        console.error(`Overlay list item with ID "${overlayID}" not found.`);
    }
}

export function updatePanelCheckmarkVisual(rootElement, elementClass, condition) {
    const elementList = rootElement.querySelectorAll(elementClass);
    const item = Array.from(elementList).find(condition);
    if (item) {
        const button = item.querySelector(PANEL_CHECKMARK_CLASS_SELECTOR);
        if (button) {
            button.classList.toggle('checked');
        }
    }
}