import { CANVAS_DYNAMIC_OVERLAYS, MAP_TOOLTIPS } from "../../config/config-manager.js";
import { currentWallpaperMatrix } from "../canvas-manager.js";

let isEnabled = false;
let animationFrameId = null;
const circleRadius = 14;

// Cache transformed coordinates
let cachedCenters = [];

const calculateCenters = function () {
  return MAP_TOOLTIPS.map(tooltip => {
    const { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax } } = tooltip.area;
    return {
      x: (xMin + xMax) / 2,
      y: (yMin + yMax) / 2,
    };
  });
};

export const drawCircles = function (ctx) {
  ctx.save();
  ctx.setTransform(currentWallpaperMatrix);
  cachedCenters.forEach(center => {
    ctx.beginPath();
    ctx.arc(center.x, center.y, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
    ctx.fill();
  });
  ctx.restore();
};

export const toggleAreaCircles = async function () {
  try {
    isEnabled = !isEnabled;
    const ctx = CANVAS_DYNAMIC_OVERLAYS.getContext("2d");

    if (isEnabled) {
      // Calculate fresh coordinates
      cachedCenters = calculateCenters();

      // Set canvas drawing properties
      ctx.globalCompositeOperation = "source-over";
      ctx.zIndex = 10;

      // Start drawing loop
      drawCircles(ctx);
    } else {
      // Stop animation and clear canvas
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, CANVAS_DYNAMIC_OVERLAYS.width, CANVAS_DYNAMIC_OVERLAYS.height);
    }
  } catch (error) {
    console.error("Error in toggleAreaCircles:", error);
    throw error;
  }
};