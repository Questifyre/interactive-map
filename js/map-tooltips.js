import { CANVAS_MAP, MAP_TOOLTIPS } from './config.js';
import { currentWallpaperMatrix } from './canvas/canvas.js';
import { getRelativeCoordinates } from './utils.js';

// Tooltip
let tooltip;
let nameElement;
let descElement;

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

// Tooltip setup - Create elements once and setup Event delegation
export function setupMapAreaTooltips() {
     tooltip = document.createElement('div');
     nameElement = document.createElement('div');
     descElement = document.createElement('div');
    tooltip.id = 'map-area-tooltip';
    tooltip.classList.add('interactive-map-tooltip');

    // Configure tooltip structure
    nameElement.style.fontWeight = 'bold';
    descElement.style.fontWeight = 'normal';
    descElement.style.color = 'rgb(204, 204, 204)';
    descElement.style.fontSize = '0.9em';
    tooltip.append(nameElement, descElement);
    document.body.appendChild(tooltip);

    CANVAS_MAP.addEventListener('mousemove', mapTrackMouseMove);
    CANVAS_MAP.addEventListener('mouseleave', mapTrackMouseLeave);
}

// Cache last location to minimize DOM updates
let lastLocation = null;
let isVisible = false;
let hideTimeout = null;

export function mapTrackMouseMove(event) {
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
            nameElement.textContent = currentLocation.name;
            descElement.textContent = currentLocation.description;
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

export function mapTrackMouseLeave() {
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }
    tooltip.classList.remove('visible');
    isVisible = false;
    lastLocation = null;
}