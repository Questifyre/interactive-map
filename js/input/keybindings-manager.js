import { enabledButtonIds } from '../ui/navigation/bottom-navbar-button-manager.js';

export const initializeKeyBindings = function () {
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const numberKey = parseInt(key, 10);

        // Only handle number keys 1-8
        if (isNaN(numberKey) || numberKey < 1 || numberKey > 8) return;

        const buttonIndex = numberKey - 1;
        if (buttonIndex >= enabledButtonIds.length) return;

        const buttonId = enabledButtonIds[buttonIndex];
        const button = document.getElementById(buttonId);

        if (button) {
            e.preventDefault();
            button.click();
        }
    });
};