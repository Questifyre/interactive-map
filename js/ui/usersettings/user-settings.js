import { PANEL_LIST_ITEM_CLASS_SELECTOR, PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR, SETTINGS_PANEL_ID } from '../../config/config-manager.js';
import { toggleKeybindingsPanel } from '../../input/keybindings-manager.js';
import { createPanel, handleSoundPanelToggle, setPanelItemFeedback } from '../ui-manager.js';

let settingsPanel = document.getElementById(SETTINGS_PANEL_ID);

const settingsItems = [
	{ name: "Keybindings", state: false },
	{ name: "Sound Volume", state: false }
];

export const toggleSettings = function () {
	settingsPanel = document.getElementById(SETTINGS_PANEL_ID);
	if (settingsPanel) {
		settingsPanel.remove();
	} else {
		settingsPanel = createPanel(
			SETTINGS_PANEL_ID,
			"Settings",
			settingsItems.map(item => ({
				name: item.name,
				state: false,
				action: item.action
			})),
			handleSettingsAction
		);
	}
};

const toggleSetting = function (settingName) {
	const setting = settingsItems.find(t => t.name === settingName);
	if (!setting) {
		console.warn(`User Setting "${settingName}" not found`);
		return;
	}

	const wasEnabled = setting.state;
	const enableSetting = !wasEnabled;
	setting.state = enableSetting;

	// Execute tool-specific logic
	switch (settingName) {
		case "Keybindings":
			toggleKeybindingsPanel();
			break;
		case 'Sound Volume':
			handleSoundPanelToggle();
			break;
	}

	setPanelItemFeedback(settingsPanel, settingName, "effects/button_tap_1.mp3", 0.1, true);
}

const handleSettingsAction = function (event) {
	const item = event.target.closest(PANEL_LIST_ITEM_CLASS_SELECTOR);
	if (item) {
		const settingName = item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent;
		if (settingName) toggleSetting(settingName);
	}
};