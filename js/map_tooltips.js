import { CONFIG_SETTINGS, MAP_TOOLTIPS, } from './config.js';
import { currentWallpaperMatrix } from './canvas.js';

const canvas = document.getElementById('questifyreInteractiveMap');

function getRelativeCoordinates(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

const tooltip = document.createElement('div');
tooltip.classList.add('map-location-tooltip');
document.body.appendChild(tooltip);

export function processMouseMove(event) {
    if (!CONFIG_SETTINGS) return;
    const mousePos = getRelativeCoordinates(event, canvas);
    let foundLocation = null;

    // Transform mouse coordinates to natural image space
    const point = new DOMPoint(mousePos.x, mousePos.y);
    const invertedMatrix = currentWallpaperMatrix.inverse();
    const transformedPoint = invertedMatrix.transformPoint(point);
    const naturalX = transformedPoint.x;
    const naturalY = transformedPoint.y;

    if (CONFIG_SETTINGS["TEST-TrackMousePosition"]) {
        console.log("Natural coordinates:", naturalX, naturalY);
    }

    if (!MAP_TOOLTIPS) return;

    for (const location of MAP_TOOLTIPS) {
        const { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax } } = location.area;

        if (naturalX >= xMin && naturalX <= xMax && naturalY >= yMin && naturalY <= yMax) {
            foundLocation = location;
            break;
        }
    }

    if (foundLocation) {
        tooltip.innerHTML = `
            <div style="font-weight: bold; color: white; margin-bottom: 5px;">
                ${foundLocation["name"]}
            </div>
            <div style="font-weight: normal; color: rgb(204, 204, 204); font-size: 0.9em;">
                ${foundLocation["description"]}
            </div>
        `;

        tooltip.style.opacity = 1;
        tooltip.style.visibility = 'visible';

        const tooltipHeight = tooltip.offsetHeight;
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipOffsetX = 10;
        const tooltipOffsetY = 20;

        let tooltipX = event.clientX + tooltipOffsetX;
        let tooltipY = event.clientY - tooltipHeight - tooltipOffsetY;

        if (tooltipX + tooltipWidth > window.innerWidth) {
            tooltipX = window.innerWidth - tooltipWidth - tooltipOffsetX;
        }
        if (tooltipX < 0) {
            tooltipX = tooltipOffsetX;
        }
        if (tooltipY < 0) {
            tooltipY = event.clientY + tooltipOffsetY;
        }

        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = `${tooltipY}px`;
    } else {
        tooltip.style.opacity = 0;
        tooltip.style.visibility = 'hidden';
    }
}

export function processMouseLeave() {
    tooltip.style.opacity = 0;
    tooltip.style.visibility = 'hidden';
}

export function toggleRegistry() {
    canLog = !canLog;
}