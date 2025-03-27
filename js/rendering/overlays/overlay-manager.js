import {
    CONFIG_LOAD_PROMISE,
    CONFIG_SETTINGS,
    OVERLAY_FILES,
    OVERLAYS_PANEL_ID,
    OVERLAYS_PATH,
    PANEL_LIST_ITEM_CLASS_SELECTOR,
    PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR
} from '../../config/config-manager.js';

import { loadImageWithCache, loadWithScreen } from '../../ui/components/loading-screen-manager.js';
import { createPanel, disableOverlay, setPanelItemFeedback } from '../../ui/ui-manager.js';
import { redrawCanvas } from '../canvas-manager.js';
import { drawCircles, toggleAreaCircles } from './map-tooltip-overlay.js';

const overlayItems = [
    { id: 'settlements-overlay', name: 'Settlements', state: false },
    { id: 'landmarks-overlay', name: 'Landmarks', state: false },
    { id: 'land-routes-overlay', name: 'Land Routes', state: false },
    { id: 'sea-routes-overlay', name: 'Sea Routes', state: false },
    { id: 'map-tooltips-overlay', name: 'Map Tooltips', state: false }
];

const loadConfigFile = async function () {
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
                overlayItems.forEach((overlay) => {
                    if (OVERLAY_FILES[overlay.name]) {
                        overlay.imagePath = OVERLAY_FILES[overlay.name];
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

export const toggleOverlay = async function (overlayName, drawMapCallback) {
    const overlay = overlayItems.find(t => t.name === overlayName);
    if (!overlay) return;

    overlay.state = !overlay.state;

    try {
        await loadWithScreen(async () => {
            if (overlayName === "Map Tooltips") {
                await toggleAreaCircles();
            } else {
                const imagePath = OVERLAYS_PATH + overlay.imagePath;
                overlay.image = overlay.state
                    ? await loadImageWithCache(imagePath, overlay.image)
                    : null;
            }
            drawMapCallback();
        });
    } catch (error) {
        console.error(`Failed to toggle ${overlayName} Overlay:`, error);
        overlay.state = !overlay.state;
        throw error;
    } finally {
        setPanelItemFeedback(overlayPanel, overlayName, "effects/toggle_overlay.mp3", 0.7);
    }
}

const setItemAction = function (event)
{
    const item = event.target.closest(PANEL_LIST_ITEM_CLASS_SELECTOR);
    if (item) {
        const overlayName = item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent;
        if (overlayName) toggleOverlay(overlayName, redrawCanvas);
    }
}

export const toggleOverlays = function () {
    overlayPanel = document.getElementById(OVERLAYS_PANEL_ID);
    if (overlayPanel) {
        overlayPanel.remove();
    } else {
        overlayPanel = createPanel(
            OVERLAYS_PANEL_ID,
            "Overlays",
            overlayItems,
            setItemAction
        );
    }
}

const drawOverlays = function (ctx) {
    // Draw black filter if any overlay is enabled
    if (overlayItems.find(t => t.state === true)) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    overlayItems.forEach((overlay) => {
        if (overlay.state) {
            // Draw config.json overlays
            if (overlay.image) {
                ctx.drawImage(overlay.image, 0, 0, window.innerWidth, window.innerHeight);
            }

            //Draw dynamic overlays
            if (overlay.name == "Map Tooltips") {
                drawCircles(ctx);
                return;
            }
        }
    });
}

window.addEventListener('overlaysUpdated', (event) => {
    const { ctxOverlays } = event.detail;
    drawOverlays(ctxOverlays);
});