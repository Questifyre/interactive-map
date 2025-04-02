import { CANVAS_MAP, MAP_TOOLTIPS, MOBILE_DEVICE } from "../../config/config-manager.js";
import { currentWallpaperMatrix } from "../../rendering/canvas-manager.js";
import { getRelativeCoordinates } from "../../utilities/utils.js";
import { createInteractiveMapTooltip } from "../ui-manager.js";

// Tooltip Elements
let tooltip;
let tooltipName;
let tooltipDesc;

// Tooltip state management
let lastLocation = null;
let isVisible = false;
let hideTimeout = null;

// Helper functions
const getNaturalCoordinates = (event) => {
  const mousePos = getRelativeCoordinates(event, CANVAS_MAP);
  const point = new DOMPoint(mousePos.x, mousePos.y);
  const transformedPoint = currentWallpaperMatrix.inverse().transformPoint(point);
  return { naturalX: transformedPoint.x, naturalY: transformedPoint.y };
};

const getCurrentLocation = (naturalX, naturalY) => {
  return MAP_TOOLTIPS?.find(location => {
    const { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax } } = location.area;
    return naturalX >= xMin && naturalX <= xMax && naturalY >= yMin && naturalY <= yMax;
  });
};

// Position calculation with boundary checks
const updateTooltipPosition = (event, element) => {
  const { clientX, clientY } = event;
  const { offsetWidth: tw, offsetHeight: th } = element;
  const { innerWidth: ww, innerHeight: wh } = window;
  const offsetX = 10, offsetY = 20;

  let x = clientX + offsetX;
  let y = clientY - th - offsetY;

  // Boundary checks
  x = Math.min(Math.max(x, offsetX), ww - tw - offsetX);
  y = Math.min(Math.max(y, offsetY), wh - th - offsetY);

  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
};

// Common visibility handler
const handleVisibility = (currentLocation, event) => {
  if (currentLocation) {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    if (currentLocation !== lastLocation) {
      tooltipName.textContent = currentLocation.name;
      tooltipDesc.textContent = currentLocation.description;
      lastLocation = currentLocation;
    }

    if (!isVisible) {
      tooltip.classList.add("visible");
      isVisible = true;
    }

    if (event) {
      requestAnimationFrame(() => updateTooltipPosition(event, tooltip));
    }
  } else if (isVisible && !hideTimeout) {
    hideTimeout = setTimeout(() => {
      tooltip.classList.remove("visible");
      isVisible = false;
      lastLocation = null;
      hideTimeout = null;
    }, 50);
  }
};

// PC Event Handler
const handleMouseMove = (event) => {
  const { naturalX, naturalY } = getNaturalCoordinates(event);
  handleVisibility(getCurrentLocation(naturalX, naturalY), event);
};

// Mobile Event Handler
const handleCanvasTouch = (event) => {
  if (event.touches.length !== 1) return;
  const { naturalX, naturalY } = getNaturalCoordinates(event.touches[0]);
  handleVisibility(getCurrentLocation(naturalX, naturalY), event.touches[0]);
};

// Tooltip setup
export const setupMapAreaTooltips = () => {
  tooltipName = document.createElement("div");
  tooltipName.style.fontWeight = "bold";

  tooltipDesc = document.createElement("div");
  tooltipDesc.style.fontWeight = "normal";
  tooltipDesc.style.color = "rgb(204, 204, 204)";
  tooltipDesc.style.fontSize = "0.9em";

  tooltip = createInteractiveMapTooltip("map-area-tooltip", {
    children: [tooltipName, tooltipDesc],
  });

  // Device-specific event listeners
  if (!MOBILE_DEVICE) {
    CANVAS_MAP.addEventListener("mousemove", handleMouseMove);
  } else {
    CANVAS_MAP.addEventListener("touchstart", handleCanvasTouch);
  }
};