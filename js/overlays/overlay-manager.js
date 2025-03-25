import {
    CONFIG_SETTINGS,
    CONFIG_LOAD_PROMISE,
    OVERLAYS_PATH,
    OVERLAY_FILES,
    OVERLAYS_PANEL_ID,
    PANEL_LIST_ITEM_CLASS,
    PANEL_LIST_ITEM_TEXT_CLASS,
    PANEL_LIST_ITEM_CLASS_SELECTOR,
    PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR
} from '../config.js';

import { toggleAreaCircles, drawCircles } from './overlay-tooltips.js';
import { loadWithScreen, loadImageWithCache } from '../loading.js';
import { createAndPlayAudio } from '../audio.js';
import { redrawCanvas } from '../canvas/canvas.js';
import { disableOverlay, updatePanelCheckmarkVisual } from '../ui.js';

// Handle User Config File
let overlayNameMap = {
    "Settlements": "",
    "Landmarks": "",
    "Land Routes": "",
    "Sea Routes": "",
};

async function loadConfigFile() {
    await CONFIG_LOAD_PROMISE;
    try {
        if (CONFIG_SETTINGS) {
            const overlaySettings = CONFIG_SETTINGS["Overlays"];
            if (overlaySettings) {
                if (!overlaySettings["Settlements"]) {
                    disableOverlay('settlements-overlay');
                }

                if (!overlaySettings["Landmarks"]) {
                    disableOverlay('landmarks-overlay');
                }

                if (!overlaySettings["Land Routes"]) {
                    disableOverlay('land-routes-overlay');
                }

                if (!overlaySettings["Sea Routes"]) {
                    disableOverlay('sea-routes-overlay');
                }
            }
            else {
                console.error('Could not find Overlay Settings from configs file:');
            }

            if (OVERLAY_FILES) {
                Object.keys(overlayNameMap).forEach(key => {
                    if (OVERLAY_FILES[key]) {
                        overlayNameMap[key] = OVERLAY_FILES[key];
                    }
                });
            }
        }
    } catch (error) {
        console.error('Could not load config settings from configs file:', error);
    }
}

loadConfigFile();

// ==============================
// Map Overlays System
// ==============================

let overlayPanel = document.getElementById(OVERLAYS_PANEL_ID);
const overlayStates = {};
const overlayImages = {
    'settlements': null,
    'landmarks': null,
    'land_routes': null,
    'sea_routes': null
};

const OVERLAY_ITEMS = [
    { id: 'settlements-overlay', name: 'Settlements', bgAlpha: 0.4 },
    { id: 'landmarks-overlay', name: 'Landmarks', bgAlpha: 0.2 },
    { id: 'land-routes-overlay', name: 'Land Routes', bgAlpha: 0.4 },
    { id: 'sea-routes-overlay', name: 'Sea Routes', bgAlpha: 0.2 },
    { id: 'map-tooltips-overlay', name: 'Map Tooltips', bgAlpha: 0.2 }
];

function createOverlaysPanel() {
    const panel = document.createElement("div");
    panel.id = OVERLAYS_PANEL_ID;
    panel.className = "panel";
    panel.style.display = "flex";

    // Header
    const header = document.createElement("div");
    header.id = "overlays-panel-header";
    header.className = "panel-header";
    header.textContent = "Overlays";
    panel.appendChild(header);

    // Dynamic item creation using DOM API
    OVERLAY_ITEMS.forEach(({ id, name, bgAlpha }) => {
        const item = document.createElement("div");
        item.id = id;
        item.className = PANEL_LIST_ITEM_CLASS;
        item.style.backgroundColor = `rgba(0, 0, 0, ${bgAlpha})`;

        const textSpan = document.createElement("span");
        textSpan.className = PANEL_LIST_ITEM_TEXT_CLASS;
        textSpan.textContent = name;

        const checkmark = document.createElement("button");
        checkmark.className = "panel-checkmark";
        checkmark.classList.toggle('checked', overlayStates[name] || false);
        checkmark.setAttribute("aria-pressed", overlayStates[name] || false);

        item.append(textSpan, checkmark);
        panel.appendChild(item);
    });

    // Event delegation
    panel.addEventListener('click', (event) => {
        const item = event.target.closest(PANEL_LIST_ITEM_CLASS_SELECTOR);
        if (item) {
            const overlayName = item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent;
            if (overlayName) toggleOverlay(overlayName, redrawCanvas);
        }
    });

    document.body.appendChild(panel);
    overlayPanel = panel;
    return panel;
}

export function toggleOverlays() {
    const existingPanel = document.getElementById(OVERLAYS_PANEL_ID);
    if (existingPanel) {
        existingPanel.remove();
    } else {
        createOverlaysPanel();
    }
}

const setSensoryFeedback = function (overlayName) {
    updatePanelCheckmarkVisual(
        overlayPanel,
        PANEL_LIST_ITEM_CLASS_SELECTOR,
        (item) => item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent === overlayName
    );

    createAndPlayAudio("effects/toggle_overlay.mp3", 0.7);
}

export async function toggleOverlay(overlayName, drawMapCallback) {
    const isEnabled = !overlayStates[overlayName];
    overlayStates[overlayName] = isEnabled;

    try {
        await loadWithScreen(async () => {
            if (overlayName === "Map Tooltips") {
                await toggleAreaCircles();
            } else {
                const imagePath = OVERLAYS_PATH + overlayNameMap[overlayName];
                overlayImages[overlayName] = isEnabled
                    ? await loadImageWithCache(imagePath, overlayImages[overlayName])
                    : null;
            }
            drawMapCallback();
        });
    } catch (error) {
        console.error(`Failed to toggle ${overlayName}:`, error);
        overlayStates[overlayName] = !isEnabled;
        throw error;
    } finally {
        setSensoryFeedback(overlayName);
    }
}

export function drawOverlays(ctx) {
    // Draw black filter if any overlay is enabled
    if (Object.values(overlayStates).some(enabled => enabled)) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    // Draw config.json overlays in order
    const overlayOrder = ['Settlements', 'Landmarks', 'Land Routes', 'Sea Routes'];
    overlayOrder.forEach(overlayName => {
        if (overlayStates[overlayName] && overlayImages[overlayName]) {
            ctx.drawImage(overlayImages[overlayName], 0, 0, window.innerWidth, window.innerHeight);
        }
    });

    //Draw dynamic overlays
    if (overlayStates["Map Tooltips"]) {
        drawCircles(ctx);
    }
}