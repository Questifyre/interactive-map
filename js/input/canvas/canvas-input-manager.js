import { updateRegionSound } from "../../audio/sound-system.js";
import { CANVAS_MAP, MOBILE_DEVICE } from "../../config/config-manager.js";

export const CURSOR_GRAB = "grab";
export const CURSOR_GRABBING = "grabbing";

// Only check for Region Sounds occasionaly, for performance optimization
let lastRegionSoundUpdate = 0;
export const tryUpdateRegionSound = function () {
  const now = performance.now();
  if (now - lastRegionSoundUpdate >= 1000) {
    updateRegionSound();
    lastRegionSoundUpdate = now;
  }
};

// Decide which Input System to load for controlling the Map
const setMapInteractionSystem = function (isMobileDevice) {
  if (!isMobileDevice) {
    import("./canvas-mouse-handler.js").then((module) => {
      module.setupMouseSystem(CANVAS_MAP);
    });
    import("./canvas-keyboard-handler.js").then((module) => {
      module.setupKeyboardSystem(CANVAS_MAP);
    });
  } else {
    import("./canvas-gesture-handler.js").then((module) => {
      module.setupTouchSystem(CANVAS_MAP);
    });
  }
};

window.addEventListener("application-started", () => {
  setMapInteractionSystem(MOBILE_DEVICE);
});
