import { createAndPlayAudio } from "../../audio/sound-system.js";
import { CANVAS_MAP as CANVAS_DYNAMIC_OVERLAYS, MAP_SCALE } from "../../config/config-manager.js";
import { currentWallpaperMatrix, drawStatuses, redrawCanvas } from "../../rendering/canvas-manager.js";
import { createInteractiveMapTooltip } from "../../ui/ui-manager.js";
import { getRelativeCoordinates } from "../../utilities/utils.js";

let isEnabled = false;
let points = [];

const circleRadius = 10;
const lineWidth = 6;
const outlineWidth = 4;
const traceColours = [
  "rgba(125, 33, 230, 0.8)",
  "rgba(53, 33, 230, 0.7)",
  "rgba(255, 255, 255, 0.8)",
];

// Tooltip Elements
let tooltip = null;
let tooltipName = null;
let tooltipDesc = null;
let isVisible = false;

// Caches
let cachedPoints = [];
let lastMousePosition = { x: 0, y: 0 };
let animationFrameId = null;

const getNaturalCoordinates = (eventOrPosition) => {
  let mousePos;
  if (eventOrPosition instanceof Event) {
    mousePos = getRelativeCoordinates(eventOrPosition, CANVAS_DYNAMIC_OVERLAYS);
  } else {
    mousePos = eventOrPosition;
  }

  const point = new DOMPoint(mousePos.x, mousePos.y);
  return currentWallpaperMatrix.inverse().transformPoint(point);
};

const getRelativeCoordinatesFromDOM = (position) => {
  return {
    x: position.x,
    y: position.y,
    // Add fractional scaling compensation if needed
    _x: position.x * window.devicePixelRatio,
    _y: position.y * window.devicePixelRatio,
  };
};

const drawMeasurement = function (ctx) {
  if (!isEnabled || !ctx) return;

  ctx.save();
  ctx.setTransform(currentWallpaperMatrix);

  // Draw connection lines
  if (cachedPoints.length > 1) {
    ctx.beginPath();
    ctx.strokeStyle = traceColours[0];
    ctx.lineWidth = lineWidth;

    cachedPoints.forEach((p, i) => {
      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    });

    ctx.stroke();
  }

  // Draw a preview line from the last point to the mouse position
  if (cachedPoints.length > 0) {
    // Get mouse position in natural coordinates using stored position
    const mousePos = getRelativeCoordinatesFromDOM(lastMousePosition);
    const naturalPos = getNaturalCoordinates(mousePos);
    const lastPoint = cachedPoints[cachedPoints.length - 1];

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(naturalPos.x, naturalPos.y);

    ctx.strokeStyle = traceColours[1];
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  // Draw points
  cachedPoints.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, circleRadius, 0, Math.PI * 2);

    // Set the fill color
    ctx.fillStyle = traceColours[2];
    ctx.fill();

    // Add a black outline
    ctx.strokeStyle = "black";
    ctx.lineWidth = outlineWidth;
    ctx.stroke();
  });

  ctx.restore();
};

const updateCachedPoints = () => {
  cachedPoints = [...points];
  redrawCanvas();
};

const handleMouseDown = (event) => {
  if (event.button === 0) {
    // Left click
    const naturalPos = getNaturalCoordinates(event);
    points.push(naturalPos);
    updateCachedPoints();
    createAndPlayAudio("effects/button_tap_1.mp3", 0.1, true);
  }
  else if (event.button === 2) {
    // Right click
    points = [];
    updateCachedPoints();
    return;
  }
};

// In distance-measurement-tool.js
const calculateRealDistance = (pointA, pointB) => {
  // Calculate distance in natural map pixels
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  const pixelDistance = Math.sqrt(dx * dx + dy * dy);

  // Convert to real-world units
  return pixelDistance * MAP_SCALE.distancePerMapPixel;
};

const handleMouseMove = (event) => {
  if (!tooltip) return;
  drawStatuses.dynamicOverlays.mustRedraw = true;

  // Store mouse position for drawing
  const rect = CANVAS_DYNAMIC_OVERLAYS.getBoundingClientRect();
  lastMousePosition.x = event.clientX - rect.left;
  lastMousePosition.y = event.clientY - rect.top;

  // Cancel any pending frame and request new animation frame
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(() => {
    redrawCanvas();
  });

  const naturalPos = getNaturalCoordinates(event);
  let totalDistance = 0;
  let segmentDistance = 0;

  // Calculate total distance
  if (points.length > 1) {
    for (let i = 1; i < points.length; i++) {
      totalDistance += calculateRealDistance(points[i - 1], points[i]);
    }
  }

  // Calculate distance from last point
  if (points.length > 0) {
    segmentDistance = calculateRealDistance(points[points.length - 1], naturalPos);
  }

  // Update tooltip text
  tooltipDesc.textContent = `Total: ${totalDistance.toFixed(1)} ${MAP_SCALE.distanceUnit}\n`;
  tooltipDesc.textContent += `Current: ${segmentDistance.toFixed(1)} ${MAP_SCALE.distanceUnit}`;

  // Position tooltip relative to canvas
  const xOffset = 15 * window.devicePixelRatio;
  const yOffset = 15 * window.devicePixelRatio;

  tooltip.style.left = `${lastMousePosition.x + xOffset}px`;
  tooltip.style.top = `${lastMousePosition.y + yOffset}px`;

  if (!isVisible) {
    tooltip.classList.add("visible");
    isVisible = true;
  }
};

const createTooltip = () => {
  tooltipName = document.createElement("div");
  tooltipName.style.fontWeight = "bold";
  tooltipName.textContent = "Distance:";

  tooltipDesc = document.createElement("div");
  tooltipDesc.style.whiteSpace = "pre-line";
  tooltipDesc.style.fontWeight = "normal";
  tooltipDesc.style.color = "rgb(204, 204, 204)";
  tooltipDesc.style.fontSize = "0.9em";
  tooltipDesc.textContent += `0 ${MAP_SCALE.distanceUnit}`;

  tooltip = createInteractiveMapTooltip("map-area-tooltip", {
    children: [tooltipName, tooltipDesc],
  });
};

const handleOverlaysUpdated = (event) => {
  drawMeasurement(event.detail.ctx);
};

export const enableDistanceMeasurement = (enable) => {
  if (!MAP_SCALE) return;
  isEnabled = enable;

  if (enable) {
    createTooltip();
    CANVAS_DYNAMIC_OVERLAYS.addEventListener("mousedown", handleMouseDown);
    CANVAS_DYNAMIC_OVERLAYS.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("dynamic-overlays-canvas-updated", handleOverlaysUpdated);
  } else {
    points = [];
    cachedPoints = [];
    CANVAS_DYNAMIC_OVERLAYS.removeEventListener("mousedown", handleMouseDown);
    CANVAS_DYNAMIC_OVERLAYS.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("dynamic-overlays-canvas-updated", handleOverlaysUpdated);
    redrawCanvas();

    if (tooltip) {
      tooltip.remove();
      isVisible = false;
    }
  }
};