import { BOTTOM_NAV_BAR_ID, NAV_BAR_BUTTON_CLASS } from '../../config/config-manager.js';
import { buttonActions } from '../ui-actions.js';

export let enabledButtonIds = [];

export const createBottomNavBarButtons = function (settings) {
    const buttons = [
        {
            name: 'Enable Grid Toggle',
            id: 'toggle-grid-button',
            tooltip: 'Toggle the *Hex Grid* between *On* / *Off*.',
            img: {
                src: 'assets/tool/images/icons/buttons/grid_0.png',
            }
        },
        {
            name: 'Enable Reset View',
            id: 'reset-view-button',
            tooltip: 'Reset *Pan* and *Zoom* to *Default*.',
            img: {
                src: 'assets/tool/images/icons/buttons/reset_view.png',
            }
        },
        {
            name: 'Enable Day Time Toggle',
            id: 'set-time-button',
            tooltip: 'Toggle the *Day Time* between *Day*, *Dusk* or *Night*.',
            img: {
                src: 'assets/tool/images/icons/buttons/day_night_0.png',
            }
        },
        {
            name: 'Enable Sound Panel',
            id: 'sound-panel-button',
            tooltip: 'Configure *Audio Volume*.',
            img: {
                src: 'assets/tool/images/icons/buttons/sound_panel.png',
            }
        },
        {
            name: 'Enable Weather Toggle',
            id: 'weather-button',
            tooltip: 'Toggle the *Weather* between *Clear*, *Overcast*, *Rain* and *Storm*.',
            img: {
                src: 'assets/tool/images/icons/buttons/weather_0.png',
            }
        },
        {
            name: 'Enable Overlays',
            id: 'overlays-button',
            tooltip: 'Enable various *Overlays*, to identify specific parts of the *World*.',
            img: {
                src: 'assets/tool/images/icons/buttons/overlays.png',
            }
        },
        {
            name: 'Enable User Tools',
            id: 'user-tools-button',
            tooltip: 'Enable various *Tools*, to interact with the *Map*.',
            img: {
                src: 'assets/tool/images/icons/buttons/user_tools.png',
            }
        },
        {
            name: 'Enable Settings',
            id: 'settings-button',
            tooltip: 'Configure *Map Settings*.',
            img: {
                src: 'assets/tool/images/icons/buttons/settings.png',
            }
        },
        {
            name: 'Developer Mode',
            id: 'dev-tools-button',
            tooltip: 'Enable various *Developer Tools* for *Setting Up* the *Map*.',
            img: {
                src: 'assets/tool/images/icons/buttons/developer_tools.png',
            }
        }
    ];

    const navBar = document.getElementById(BOTTOM_NAV_BAR_ID);
    let shortcutCounter = 1;

    buttons.forEach(buttonConfig => {
        if (settings[buttonConfig.name]) {
            // Create button element
            const button = document.createElement('button');
            button.className = NAV_BAR_BUTTON_CLASS;
            button.id = buttonConfig.id;

            // Update tooltip with dynamic shortcut number
            const dynamicTooltip = buttonConfig.tooltip + ` (Shortcut: *${shortcutCounter}*)`
            button.setAttribute('data-tooltip', dynamicTooltip);

            // Create image element
            const img = document.createElement('img');
            img.src = buttonConfig.img.src;
            if (buttonConfig.img.alt) img.alt = buttonConfig.img.alt;

            button.appendChild(img);
            navBar.appendChild(button);

            enabledButtonIds.push(buttonConfig.id);
            shortcutCounter++;
        }
    });
};

const setButtonListeners = function () {
    buttonActions.forEach(({ id, action }) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', action);
        }
    });
};

export const configureBottomNavBarButtons = function () {
    setButtonListeners();
};