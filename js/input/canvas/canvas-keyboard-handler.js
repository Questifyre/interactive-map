import { KEY_BINDINGS, PAN_THRESHOLD } from "../../config/config-manager.js";
import { CANVAS_TRANSFORM, drawMap, setDrawStatuses } from "../../rendering/canvas-manager.js";

let keyBindings = KEY_BINDINGS;
let activeKeys = new Set();
let panInterval = null;

const handleKeyPan = function () {
  const speed = PAN_THRESHOLD * CANVAS_TRANSFORM.scale;

  if (activeKeys.has(keyBindings.PAN_UP)) {
    CANVAS_TRANSFORM.offsetY += speed;
  }
  if (activeKeys.has(keyBindings.PAN_DOWN)) {
    CANVAS_TRANSFORM.offsetY -= speed;
  }
  if (activeKeys.has(keyBindings.PAN_LEFT)) {
    CANVAS_TRANSFORM.offsetX += speed;
  }
  if (activeKeys.has(keyBindings.PAN_RIGHT)) {
    CANVAS_TRANSFORM.offsetX -= speed;
  }

  setDrawStatuses([0, 1, 2, 3], true);
  drawMap();
};

const isEditingText = function () {
  const activeElement = document.activeElement;
  return (
    activeElement.tagName === "INPUT" ||
    activeElement.tagName === "TEXTAREA" ||
    activeElement.isContentEditable
  );
};

export const setupKeyboardSystem = () => {
  document.addEventListener("keydown", (e) => {
    if (isEditingText()) return;

    const key = e.key.toLowerCase();
    if (Object.values(keyBindings).includes(key)) {
      if (!activeKeys.has(key)) {
        activeKeys.add(key);
        if (!panInterval) {
          panInterval = setInterval(handleKeyPan, 16);
        }
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    if (isEditingText()) return;

    const key = e.key.toLowerCase();
    if (activeKeys.has(key)) {
      activeKeys.delete(key);
      if (activeKeys.size === 0 && panInterval) {
        clearInterval(panInterval);
        panInterval = null;
      }
    }
  });
};

window.addEventListener("keybindingsUpdated", (event) => {
  keyBindings = event.detail.newBindings;
});
