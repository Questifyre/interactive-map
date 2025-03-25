import {
    KEY_BINDINGS,
    PAN_THRESHOLD,
} from '../config.js';

import { CANVAS_TRANSFORM, drawMap } from './canvas.js';

let activeKeys = new Set();
let panInterval = null;

function handleKeyPan() {
    const speed = PAN_THRESHOLD * CANVAS_TRANSFORM.scale;

    if (activeKeys.has(KEY_BINDINGS.PAN_UP)) {
        CANVAS_TRANSFORM.offsetY += speed;
    }
    if (activeKeys.has(KEY_BINDINGS.PAN_DOWN)) {
        CANVAS_TRANSFORM.offsetY -= speed;
    }
    if (activeKeys.has(KEY_BINDINGS.PAN_LEFT)) {
        CANVAS_TRANSFORM.offsetX += speed;
    }
    if (activeKeys.has(KEY_BINDINGS.PAN_RIGHT)) {
        CANVAS_TRANSFORM.offsetX -= speed;
    }

    drawMap();
}

function isEditingText() {
    const activeElement = document.activeElement;
    return activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable;
}

export const setupKeyboardSystem = () => {
    document.addEventListener('keydown', (e) => {
        if (isEditingText()) return;

        const key = e.key.toLowerCase();
        if (Object.values(KEY_BINDINGS).includes(key)) {
            e.preventDefault();
            if (!activeKeys.has(key)) {
                activeKeys.add(key);
                if (!panInterval) {
                    panInterval = setInterval(handleKeyPan, 16);
                }
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (isEditingText()) return;

        const key = e.key.toLowerCase();
        if (activeKeys.has(key)) {
            activeKeys.delete(key);
            if (activeKeys.size === 0 && panInterval) {
                clearInterval(panInterval);
                panInterval = null;
            }
        }
    });
}