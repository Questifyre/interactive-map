import {
    DEV_TOOLS_PANEL_ID,
    PANEL_LIST_ITEM_CLASS_SELECTOR,
    PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR
} from '../../config/config-manager.js';
import { createPanel, setPanelItemFeedback } from '../../ui/ui-manager.js';

import { notifyMapAreaTool } from './map-area-tool.js';
import { setMouseTrackingTool } from './mouse-tracking-tool.js';

// ==============================
// Dev Tools State & Configuration
// ==============================

export let devToolStates = [
    {
        name: "Mouse Coordinate Tracking",
        state: false,
        incompatibilities: []
    },
    {
        name: "Define Map Tooltip Area",
        state: false,
        incompatibilities: ["Define Region Sound Area"]
    },
    {
        name: "Define Region Sound Area",
        state: false,
        incompatibilities: ["Define Map Tooltip Area"]
    },
];

// ==============================
// Panel Management
// ==============================

let devToolsPanel;

const setItemAction = function (event) {
    const item = event.target.closest(PANEL_LIST_ITEM_CLASS_SELECTOR);
    if (item && !item.classList.contains('disabled-overlay-item')) {
        const toolName = item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent;
        if (toolName) toggleDevTool(toolName);
    }
}

export function toggleDevTools() {
    devToolsPanel = document.getElementById(DEV_TOOLS_PANEL_ID);
    if (devToolsPanel) {
        // Cleanup
        devToolsPanel.removeEventListener('click', handlePanelClick);
        devToolsPanel.remove();
    } else {
        devToolsPanel = createPanel(
            DEV_TOOLS_PANEL_ID,
            "Dev Tools",
            devToolStates,
            setItemAction
        );
    }
}

const handlePanelClick = function (event) {
    const item = event.target.closest(PANEL_LIST_ITEM_CLASS_SELECTOR);
    if (!item || item.classList.contains('disabled-overlay-item')) return;

    const toolName = item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent;
    if (toolName) toggleDevTool(toolName);
}

// ==============================
// Dev Tool Logic
// ==============================

export function toggleDevTool(toolName) {
    const tool = devToolStates.find(t => t.name === toolName);
    if (!tool) {
        console.warn(`Dev tool "${toolName}" not found`);
        return;
    }

    const wasEnabled = tool.state;
    const enableTool = !wasEnabled;

    // Handle incompatibilities
    tool.incompatibilities.forEach(incompatibleToolName => {
        const incompatibleTool = devToolStates.find(t => t.name === incompatibleToolName);
        if (incompatibleTool?.state) {
            incompatibleTool.state = false;
            setPanelItemFeedback(devToolsPanel, incompatibleToolName);
        }
    });

    // Update tool state
    tool.state = enableTool;

    // Execute tool-specific logic
    switch (toolName) {
        case "Mouse Coordinate Tracking":
            setMouseTrackingTool(enableTool);
            break;
        case "Define Map Tooltip Area":
        case "Define Region Sound Area":
            notifyMapAreaTool(toolName, enableTool);
            break;
    }

    setPanelItemFeedback(devToolsPanel, toolName, "effects/button_tap_1.mp3", 0.1, true);
}