import { MAX_ZOOM_SCALE, MIN_ZOOM_SCALE, WHEEL_ZOOM_SPEED } from "../../config/config-manager.js";
import { CANVAS_TRANSFORM, drawMap, setDrawStatuses } from "../../rendering/canvas-manager.js";
import {
  CURSOR_GRAB,
  CURSOR_GRABBING,
  tryUpdateRegionSound,
} from "./canvas-input-manager.js";

// ==============================
// Event Handling Updates - PC
// ==============================

export const disableMouseInputTrick = [false];

export const setupMouseSystem = (canvas) => {
  let isDragging = false;
  let startX, startY, initialOffsetX, initialOffsetY;

  const updateCanvas = () => {
    setDrawStatuses([0, 1, 2, 3], true);
    drawMap();
    tryUpdateRegionSound();
  };

  const handleDragStart = (clientX, clientY) => {
    if (disableMouseInputTrick[0]) return;
    isDragging = true;
    startX = clientX;
    startY = clientY;
    initialOffsetX = CANVAS_TRANSFORM.offsetX;
    initialOffsetY = CANVAS_TRANSFORM.offsetY;
    canvas.style.cursor = CURSOR_GRABBING;
  };

  const handleDragMove = (clientX, clientY) => {
    if (disableMouseInputTrick[0]) return;
    if (!isDragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;
    CANVAS_TRANSFORM.offsetX = initialOffsetX + dx;
    CANVAS_TRANSFORM.offsetY = initialOffsetY + dy;
    updateCanvas();
  };

  const handleZoom = (zoomFactor, centerX, centerY = false) => {
    const scaledZoom = Math.pow(zoomFactor, 1);
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
    "wheel",
    (e) => {
      if (disableMouseInputTrick[0]) return;
      e.preventDefault();
      const zoomFactor = 1 + -e.deltaY * WHEEL_ZOOM_SPEED;
      const rect = canvas.getBoundingClientRect();
      handleZoom(zoomFactor, e.clientX - rect.left, e.clientY - rect.top);
    },
    { passive: false }
  );

  canvas.addEventListener("mousedown", (e) =>
    handleDragStart(e.clientX, e.clientY)
  );
  canvas.addEventListener("mousemove", (e) =>
    handleDragMove(e.clientX, e.clientY)
  );

  const endInteraction = () => {
    if (disableMouseInputTrick[0]) return;
    isDragging = false;
    canvas.style.cursor = CURSOR_GRAB;
    tryUpdateRegionSound();
  };

  document.addEventListener("mouseup", endInteraction);
  canvas.addEventListener("mouseleave", endInteraction);
};
