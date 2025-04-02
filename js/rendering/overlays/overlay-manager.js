import {
  CONFIG_LOAD_PROMISE,
  CONFIG_SETTINGS,
  OVERLAY_FILES,
  OVERLAYS_PANEL_ID,
  OVERLAYS_PATH,
  PANEL_LIST_ITEM_CLASS_SELECTOR,
  PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR,
} from "../../config/config-manager.js";

import { loadImageWithCache, loadWithScreen } from "../../ui/components/loading-screen-manager.js";
import { createPanel, disableOverlay, setPanelItemFeedback } from "../../ui/ui-manager.js";
import { drawStatuses } from "../canvas-manager.js";
import { drawCircles, toggleAreaCircles } from "./map-tooltip-overlay.js";

const overlayItems = [
  { id: "settlements-overlay", name: "Settlements", state: false, type: "static", UIStyle: "Toggle" },
  { id: "landmarks-overlay", name: "Landmarks", state: false, type: "static", UIStyle: "Toggle" },
  { id: "land-routes-overlay", name: "Land Routes", state: false, type: "static", UIStyle: "Toggle" },
  { id: "sea-routes-overlay", name: "Sea Routes", state: false, type: "static", UIStyle: "Toggle" },
  { id: "map-tooltips-overlay", name: "Map Tooltips", state: false, type: "dynamic", UIStyle: "Toggle" },
];

const loadConfigFile = async function () {
  await CONFIG_LOAD_PROMISE;
  try {
    if (CONFIG_SETTINGS) {
      const overlaySettings = CONFIG_SETTINGS["Overlays"];
      if (overlaySettings) {
        if (!overlaySettings["Settlements"]) {
          disableOverlay("settlements-overlay");
        }

        if (!overlaySettings["Landmarks"]) {
          disableOverlay("landmarks-overlay");
        }

        if (!overlaySettings["Land Routes"]) {
          disableOverlay("land-routes-overlay");
        }

        if (!overlaySettings["Sea Routes"]) {
          disableOverlay("sea-routes-overlay");
        }
      }
      else {
        console.error("Could not find Overlay Settings from configs file:");
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
    console.error("Could not load config settings from configs file:", error);
  }
};

loadConfigFile();

// ==============================
// Map Overlays System
// ==============================

let overlayPanel = document.getElementById(OVERLAYS_PANEL_ID);
let activeStaticOverlays = 0;
let activeDynamicOverlays = 0;
let isStaticListening = false;
let isDynamicListening = false;

const handleStaticOverlaysUpdated = (event) => {
  const ctx = event.detail.ctx;

  // Draw filter if ANY overlays exist
  if (activeStaticOverlays + activeDynamicOverlays > 0) {
    // Force Redraw if Dynamic Canvas Filter exists
    if (activeDynamicOverlays > 0) {
      drawStatuses.dynamicOverlays.mustRedraw = true;
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  // Draw static overlays
  overlayItems.filter(o => o.type === "static" && o.state).forEach(overlay => {
    if (overlay.image) {
      ctx.drawImage(overlay.image, 0, 0, window.innerWidth, window.innerHeight);
    }
  });
};

const handleDynamicOverlays = (event) => {
  const ctx = event.detail.ctx;

  // Only draw filter if there's NO static overlays but we have dynamic ones
  if (activeStaticOverlays === 0 && activeDynamicOverlays > 0) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  // Draw dynamic overlays
  overlayItems.filter(o => o.type === "dynamic" && o.state).forEach(overlay => {
    if (overlay.name === "Map Tooltips") {
      drawCircles(ctx);
    }
  });
};

export const toggleOverlay = async (overlayName) => {
  const overlay = overlayItems.find(t => t.name === overlayName);
  if (!overlay) return;

  overlay.state = !overlay.state;
  if (overlay.type === "static") {
    activeStaticOverlays += overlay.state ? 1 : -1;
  } else {
    activeDynamicOverlays += overlay.state ? 1 : -1;
  }

  // Optimized event listener management
  if (overlay.type === "static") {
    if (activeStaticOverlays > 0 && !isStaticListening) {
      window.addEventListener("static-overlays-canvas-updated", handleStaticOverlaysUpdated);
      isStaticListening = true;
    } else if (activeStaticOverlays === 0 && isStaticListening) {
      window.removeEventListener("static-overlays-canvas-updated", handleStaticOverlaysUpdated);
      isStaticListening = false;
    }
  } else {
    if (overlay.state && !isDynamicListening) {
      window.addEventListener("dynamic-overlays-canvas-updated", handleDynamicOverlays);
      isDynamicListening = true;
    } else if (!overlay.state && isDynamicListening) {
      window.removeEventListener("dynamic-overlays-canvas-updated", handleDynamicOverlays);
      isDynamicListening = false;
    }
  }

  try {
    await loadWithScreen(async () => {
      if (overlayName === "Map Tooltips") {
        await toggleAreaCircles();
      } else if (overlay.imagePath) {
        const imagePath = OVERLAYS_PATH + overlay.imagePath;
        overlay.image = overlay.state
          ? await loadImageWithCache(imagePath, overlay.image)
          : null;
      }

      // Force Canvas Redraw
      if (overlay.type === "static") {
        drawStatuses.staticOverlays.mustRedraw = true;
      }
      else {
        drawStatuses.dynamicOverlays.mustRedraw = true;
      }
    });
  } catch (error) {
    console.error(`Failed to toggle ${overlayName} Overlay:`, error);
    overlay.state = !overlay.state;

    if (overlay.type === "static") {
      activeStaticOverlays += overlay.state ? 1 : -1;
    } else {
      activeDynamicOverlays += overlay.state ? 1 : -1;
    }

    throw error;
  } finally {
    setPanelItemFeedback(overlayPanel, overlayName, "effects/toggle_overlay.mp3", 0.7);
  }
};

const setItemAction = function (event) {
  const item = event.target.closest(PANEL_LIST_ITEM_CLASS_SELECTOR);
  if (item) {
    const overlayName = item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent;
    if (overlayName) toggleOverlay(overlayName);
  }
};

export const toggleOverlays = function () {
  overlayPanel = document.getElementById(OVERLAYS_PANEL_ID);
  if (overlayPanel) {
    overlayPanel.remove();
  } else {
    overlayPanel = createPanel(
      OVERLAYS_PANEL_ID,
      "Overlays",
      overlayItems,
      setItemAction,
    );
  }
};