import { BUTTON_PATH, MAPS_PATH, MAP_FILES, SOUND_PANEL_ID, TOGGLE_GRID_BUTTON_ID } from './config.js';
import { loadWithScreen } from './loading.js';

// ==============================
// User Interface Handling
// ==============================

let gridActive = true;

export function handleGridToggle(wallpaper, drawWallpaperCallback) {
    gridActive = !gridActive;

    if (MAP_FILES && MAP_FILES["Grid"]) {
        wallpaper.src = gridActive ? MAPS_PATH + MAP_FILES["Grid"] : MAPS_PATH + MAP_FILES["Gridless"];
    } else {
        console.error('Couldn\'t switch Map Files! Map File not found.');
    }

    const buttonImageSrc = gridActive ? BUTTON_PATH + "grid_0.png" : BUTTON_PATH + "grid_1.png";
    const gridButton = document.getElementById(TOGGLE_GRID_BUTTON_ID);
    if (gridButton && gridButton.querySelector("img")) {
        gridButton.querySelector("img").src = buttonImageSrc;
    }

    loadWithScreen(async () => {
        wallpaper.onload = drawWallpaperCallback;
    });
}

export function handleSoundPanelToggle() {
    const panel = document.getElementById(SOUND_PANEL_ID);
    if (panel) {
        panel.style.display = (panel.style.display === "none" || panel.style.display === "") ? "block" : "none";
    }
}

export function setupTooltipListeners() {
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

export function enableButton(buttonID) {
    const button = document.getElementById(buttonID);
    if (button) {
        button.disabled = false;
        button.style.cursor = 'pointer';

        const img = button.querySelector('img');
        if (img) {
            img.style.filter = '';
            img.style.opacity = '1';
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