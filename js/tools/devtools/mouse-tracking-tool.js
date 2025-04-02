import { CANVAS_MAP } from "../../config/config-manager.js";
import { currentWallpaperMatrix } from "../../rendering/canvas-manager.js";
import { createInteractiveMapTooltip } from "../../ui/ui-manager.js";
import { getRelativeCoordinates } from "../../utilities/utils.js";

// Tooltip
let tooltip;
let tooltipContent;
let isVisible = false;

// Position calculation with boundary checks
const updateTooltipPosition = (event, tooltip) => {
  const { clientX, clientY } = event;
  const { offsetWidth: tw, offsetHeight: th } = tooltip;
  const { innerWidth: ww, innerHeight: wh } = window;
  const offsetX = 10, offsetY = 20;

  let x = clientX + offsetX;
  let y = clientY - th - offsetY;

  // Horizontal boundary checks
  if (x + tw > ww) x = clientX - tw - offsetX;
  if (x < 0) x = offsetX;

  // Vertical boundary checks
  if (y < 0) y = clientY + offsetY;
  if (y + th > wh) y = wh - th - offsetY;

  tooltip.style.transform = `translate3d(${x}px, ${y}px, 0)`;

  if (!isVisible) {
    tooltip.classList.add("visible");
    isVisible = true;
  }
};

const devTrackMouseMove = function (event) {
  // Transform mouse coordinates
  const mousePos = getRelativeCoordinates(event, CANVAS_MAP);
  const point = new DOMPoint(mousePos.x, mousePos.y);
  const transformedPoint = currentWallpaperMatrix.inverse().transformPoint(point);

  // Update content efficiently
  tooltipContent.textContent = `X: ${Math.round(transformedPoint.x)} Y: ${Math.round(transformedPoint.y)}`;

  // Update visibility and position
  requestAnimationFrame(() => updateTooltipPosition(event, tooltip));
};

const devTrackMouseLeave = function () {
  tooltip.classList.remove("visible");
  isVisible = false;
};

const createTooltip = () => {
  tooltipContent = document.createElement("div");
  tooltipContent.style.fontWeight = "bold";

  tooltip = createInteractiveMapTooltip("dev-mouse-coordinates-tooltip", {
    children: [tooltipContent],
  });
};

const removeTooltip = function () {
  tooltip.remove();
  tooltipContent.remove();
};

export const setMouseTrackingTool = function (toolState) {
  if (toolState) {
    createTooltip();
    CANVAS_MAP.addEventListener("mousemove", devTrackMouseMove);
    CANVAS_MAP.addEventListener("mouseleave", devTrackMouseLeave);
  } else {
    CANVAS_MAP.removeEventListener("mousemove", devTrackMouseMove);
    CANVAS_MAP.removeEventListener("mouseleave", devTrackMouseLeave);
    removeTooltip();
  }
};