import { CANVAS_MAP, MAP_TOOLTIPS } from '../../config/config-manager.js';
import { currentWallpaperMatrix } from '../../rendering/canvas-manager.js';
import { getRelativeCoordinates } from '../../utilities/utils.js';
import { createInteractiveMapTooltip } from '../ui-manager.js';

// Tooltip Elements
let tooltip;
let tooltipName;
let tooltipDesc;

// Position calculation with boundary checks
const updateTooltipPosition = (event, element) => {
    const { clientX, clientY } = event;
    const { offsetWidth: tw, offsetHeight: th } = element;
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

    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
};

// Cache last location to minimize DOM updates
let lastLocation = null;
let isVisible = false;
let hideTimeout = null;

export const mapTrackMouseMove = function (event) {
    if (!MAP_TOOLTIPS) return;

    // Always update position if visible
    if (isVisible) {
        requestAnimationFrame(() => updateTooltipPosition(event, tooltip));
    }

    // Transform mouse coordinates
    const mousePos = getRelativeCoordinates(event, CANVAS_MAP);
    const point = new DOMPoint(mousePos.x, mousePos.y);
    const transformedPoint = currentWallpaperMatrix.inverse().transformPoint(point);
    const naturalX = transformedPoint.x;
    const naturalY = transformedPoint.y;

    // Find current location
    const currentLocation = MAP_TOOLTIPS.find(location => {
        const { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax } } = location.area;
        return naturalX >= xMin && naturalX <= xMax && naturalY >= yMin && naturalY <= yMax;
    });

    if (currentLocation) {
        // Clear any pending hide operations
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }

        // Update content if needed
        if (currentLocation !== lastLocation) {
            tooltipName.textContent = currentLocation.name;
            tooltipDesc.textContent = currentLocation.description;
            lastLocation = currentLocation;
        }

        // Update visibility state
        if (!isVisible) {
            tooltip.classList.add('visible');
            isVisible = true;
        }
    } else {
        // Only trigger hide if currently visible
        if (isVisible && !hideTimeout) {
            hideTimeout = setTimeout(() => {
                tooltip.classList.remove('visible');
                isVisible = false;
                lastLocation = null;
                hideTimeout = null;
            }, 50);
        }
    }
}

export const mapTrackMouseLeave = function () {
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }
    tooltip.classList.remove('visible');
    isVisible = false;
    lastLocation = null;
}

// Tooltip setup - Create elements once and setup Event delegation
export const setupMapAreaTooltips = () => {
    tooltipName = document.createElement('div');
    tooltipName.style.fontWeight = 'bold';

    tooltipDesc = document.createElement('div');
    tooltipDesc.style.fontWeight = 'normal';
    tooltipDesc.style.color = 'rgb(204, 204, 204)';
    tooltipDesc.style.fontSize = '0.9em';

    tooltip = createInteractiveMapTooltip('map-area-tooltip', {
        children: [tooltipName, tooltipDesc],
    });

    // Attach event listeners to the provided canvas element
    CANVAS_MAP.addEventListener('mousemove', mapTrackMouseMove);
    CANVAS_MAP.addEventListener('mouseleave', mapTrackMouseLeave);

    return tooltip;
};