import { CANVAS_MAP, MAP_TOOLTIPS } from '../config.js';
import { currentWallpaperMatrix } from '../canvas/canvas.js';

let isEnabled = false;
let animationFrameId = null;
const circleRadius = 14;

// Cache transformed coordinates
let cachedCenters = [];

function calculateCenters() {
	return MAP_TOOLTIPS.map(tooltip => {
		const { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax } } = tooltip.area;
		return {
			x: (xMin + xMax) / 2,
			y: (yMin + yMax) / 2
		};
	});
}

export function drawCircles(ctx) {
	ctx.save();
	// Apply the same transform as the map
	ctx.setTransform(currentWallpaperMatrix);

	cachedCenters.forEach(center => {
		ctx.beginPath();
		ctx.arc(center.x, center.y, circleRadius, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
		ctx.fill();
	});

	ctx.restore();
}

export async function toggleAreaCircles() {
	try {
		isEnabled = !isEnabled;
		const ctx = CANVAS_MAP.getContext('2d');

		if (isEnabled) {
			// Calculate fresh coordinates
			cachedCenters = calculateCenters();

			// Set canvas drawing properties
			ctx.globalCompositeOperation = 'source-over';
			ctx.zIndex = 10;

			// Start drawing loop
			drawCircles(ctx);
		} else {
			// Stop animation and clear canvas
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
			ctx.clearRect(0, 0, CANVAS_MAP.width, CANVAS_MAP.height);
		}
	} catch (error) {
		console.error('Error in toggleAreaCircles:', error);
		throw error;
	}
}