import {
    MAX_ZOOM_SCALE,
    MIN_ZOOM_SCALE,
    PAN_THRESHOLD,
    ZOOM_SENSITIVITY,
} from "../../config/config-manager.js";

import {
    CURSOR_GRAB,
    CURSOR_GRABBING,
    tryUpdateRegionSound,
} from "./canvas-input-manager.js";

import { CANVAS_TRANSFORM, drawMap } from "../../rendering/canvas-manager.js";

// ==============================
// Event Handling Updates - Mobile
// ==============================

export const setupTouchSystem = (canvas) => {
  let isDragging = false;
  let isPinching = false;
  let startX, startY, initialOffsetX, initialOffsetY;
  let initialDistance;

  const updateCanvas = () => {
    drawMap();
    tryUpdateRegionSound();
  };

  const handleDragStart = (clientX, clientY) => {
    isDragging = true;
    startX = clientX;
    startY = clientY;
    initialOffsetX = CANVAS_TRANSFORM.offsetX;
    initialOffsetY = CANVAS_TRANSFORM.offsetY;
    canvas.style.cursor = CURSOR_GRABBING;
  };

  const handleZoom = (zoomFactor, centerX, centerY, isTouch = true) => {
    const sensitivity = isTouch ? ZOOM_SENSITIVITY : 1;
    const scaledZoom = Math.pow(zoomFactor, sensitivity);
    const constrainedScale = Math.min(
      Math.max(CANVAS_TRANSFORM.scale * scaledZoom, MIN_ZOOM_SCALE),
      MAX_ZOOM_SCALE
    );
    const scaleRatio = constrainedScale / CANVAS_TRANSFORM.scale;
    CANVAS_TRANSFORM.offsetX =
      centerX - (centerX - CANVAS_TRANSFORM.offsetX) * scaleRatio;
    CANVAS_TRANSFORM.offsetY =
      centerY - (centerY - CANVAS_TRANSFORM.offsetY) * scaleRatio;
    CANVAS_TRANSFORM.scale = constrainedScale;
    updateCanvas();
  };

  canvas.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        isPinching = true;
        isDragging = false;
        initialDistance = getDistanceBetweenTouches(e);
      }
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (isPinching && e.touches.length === 2) {
        const newDistance = getDistanceBetweenTouches(e);
        const rect = canvas.getBoundingClientRect();
        const centerX =
          (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const centerY =
          (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        handleZoom(newDistance / initialDistance, centerX, centerY, true);
        initialDistance = newDistance;
      } else if (isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        if (Math.hypot(dx, dy) > PAN_THRESHOLD) {
          CANVAS_TRANSFORM.offsetX = initialOffsetX + dx;
          CANVAS_TRANSFORM.offsetY = initialOffsetY + dy;
          updateCanvas();
        }
      }
    },
    { passive: false }
  );

  const endInteraction = () => {
    isDragging = false;
    isPinching = false;
    canvas.style.cursor = CURSOR_GRAB;
    tryUpdateRegionSound();
  };

  const getDistanceBetweenTouches = (e) =>
    Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );

  canvas.addEventListener("touchend", (e) => {
    if (e.touches.length === 0) {
      endInteraction();
      initialDistance = null;
    }
  });
};
