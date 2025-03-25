import { CANVAS_MAP } from '../config.js';
import { updateRegionSound } from '../audio.js';

export const CURSOR_GRAB = 'grab';
export const CURSOR_GRABBING = 'grabbing';

// Only check for Region sound occasionaly, for performance optimization
let lastRegionSoundUpdate = 0;
export function tryUpdateRegionSound() {
    const now = performance.now();
    if (now - lastRegionSoundUpdate >= 1000) {
        updateRegionSound();
        lastRegionSoundUpdate = now;
    }
}

export function setMapInteractionSystem(isMobileDevice) {
    if (!isMobileDevice) {
        import('./canvas-mouse-interactions.js')
            .then(module => {
                module.setupMouseSystem(CANVAS_MAP);
            });
        import('./canvas-keyboard-interactions.js')
            .then(module => {
                module.setupKeyboardSystem(CANVAS_MAP);
            });
    } else {
        import('./canvas-touch-interactions.js')
            .then(module => {
                module.setupTouchSystem(CANVAS_MAP);
            });
    }
}