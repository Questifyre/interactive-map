import {
    BUTTON_PATH,
    MAPS_PATH,
    MAP_FILES,
    PANEL_CHECKMARK_CLASS,
    PANEL_CHECKMARK_CLASS_SELECTOR,
    PANEL_LIST_ITEM_CLASS,
    PANEL_LIST_ITEM_CLASS_SELECTOR,
    PANEL_LIST_ITEM_TEXT_CLASS,
    PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR,
    TOGGLE_GRID_BUTTON_ID
} from '../config/config-manager.js';

import { AMBIANCE_VOLUME, MUSIC_VOLUME, addSoundPanelListeners, createAndPlayAudio, removeSoundPanelListeners } from '../audio/sound-system.js';
import { loadWithScreen } from './components/loading-screen-manager.js';

// ==============================
// User Interface Handling
// ==============================

let gridActive = true;

export const handleGridToggle = async function (wallpaper, drawMapCallback) {
    gridActive = !gridActive;
    const gridButton = document.getElementById(TOGGLE_GRID_BUTTON_ID);
    if (gridButton) {
        const img = gridButton.querySelector("img");
        if (img) {
            img.src = gridActive ? BUTTON_PATH + "grid_0.png" : BUTTON_PATH + "grid_1.png";
        }
    }

    // Async loading with threshold
    await loadWithScreen(async () => {
        await swapWallpaperImage(wallpaper);
        await drawMapCallback();
    });
}

// Dedicated async image loader
const swapWallpaperImage = async function (imgElement) {
    const newSrc = gridActive ? MAPS_PATH + MAP_FILES["Grid"] : MAPS_PATH + MAP_FILES["Gridless"];
    if (imgElement.src === newSrc) return;

    return new Promise((resolve) => {
        imgElement.onload = () => resolve();
        imgElement.src = newSrc;
    });
}

export const handleSoundPanelToggle = function () {
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

export const setupNavBarTooltipListeners = function () {
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

export const disableOverlay = function (overlayID) {
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

export const enableOverlay = function (overlayID) {
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

export const updatePanelCheckmarkVisual = function (rootElement, elementClass, condition) {
    const elementList = rootElement.querySelectorAll(elementClass);
    const item = Array.from(elementList).find(condition);
    if (item) {
        const button = item.querySelector(PANEL_CHECKMARK_CLASS_SELECTOR);
        if (button) {
            button.classList.toggle('checked');
        }
    }
}

export const setPanelItemFeedback = function (panelID, elementName, audioPath, volume, randomPitch) {
    updatePanelCheckmarkVisual(
        panelID,
        PANEL_LIST_ITEM_CLASS_SELECTOR,
        item => item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent === elementName
    );

    if (!audioPath) return;
    createAndPlayAudio(audioPath, volume, randomPitch);
}

export const createPanel = function (panelID, panelHeader, itemList, clickCallback) {
    // Panel
    const panel = document.createElement("div");
    panel.id = panelID;
    panel.className = "panel";
    panel.style.display = "flex";

    // Header
    const header = document.createElement("div");
    header.id = `${panelID}-header`;
    header.className = "panel-header";
    header.textContent = panelHeader;
    panel.appendChild(header);

    // Dynamic item creation using DOM API
    itemList.forEach((item, index) => {
        const newItem = document.createElement("div");
        newItem.id = item.id;
        newItem.className = PANEL_LIST_ITEM_CLASS;
        newItem.style.backgroundColor = `rgba(0, 0, 0, ${index % 2 === 0 ? 0.4 : 0.2})`;

        const textSpan = document.createElement("span");
        textSpan.className = PANEL_LIST_ITEM_TEXT_CLASS;
        textSpan.textContent = item.name;

        const checkmark = document.createElement("button");
        checkmark.className = PANEL_CHECKMARK_CLASS;
        checkmark.classList.toggle('checked', item.state);
        checkmark.setAttribute("aria-pressed", item.state);

        newItem.append(textSpan, checkmark);
        panel.appendChild(newItem);
    });

    // Event delegation
    panel.addEventListener('click', (event) => {
        clickCallback(event);
    });

    document.body.appendChild(panel);
    return panel;
}

export const createInteractiveMapTooltip = (
    id,
    {
        classes = ['interactive-map-tooltip'],
        styles = {},
        children = [],
        appendTo = document.body,
    } = {}
) => {
    if (typeof id !== 'string' || !id) {
        throw new Error('A valid id must be provided');
    }

    const tooltip = document.createElement('div');
    tooltip.id = id;
    classes.forEach(cls => tooltip.classList.add(cls));
    Object.assign(tooltip.style, styles);

    children.forEach(child => tooltip.appendChild(child));
    appendTo.appendChild(tooltip);

    return tooltip;
};
