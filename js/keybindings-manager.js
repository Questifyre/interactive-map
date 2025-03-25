import { buttonActions } from './actions.js';

export function initializeKeyBindings() {
    document.addEventListener('keydown', (e) => {
        const pressedKey = e.key.toLowerCase();
        const actionItem = buttonActions.find(item => item.key.toLowerCase() === pressedKey);

        if (actionItem) {
            e.preventDefault();
            actionItem.action();
        }
    });
}