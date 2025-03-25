import {
    DEV_TOOLS_PANEL_ID,
    PANEL_LIST_ITEM_CLASS,
    PANEL_LIST_ITEM_TEXT_CLASS,
    PANEL_LIST_ITEM_CLASS_SELECTOR,
    PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR,
    PANEL_CHECKMARK_CLASS
} from '../config.js';

import { setMouseTrackingTool } from './mouse-tracking.js';
import { notifyMapAreaTool } from './define-map-area.js';
import { updatePanelCheckmarkVisual } from '../ui.js';
import { createAndPlayAudio } from '../audio.js';

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

function createDevToolsPanel() {
    const panel = document.createElement("div");
    panel.id = DEV_TOOLS_PANEL_ID;
    panel.className = "panel";
    panel.style.display = "flex";

    // Header
    const header = document.createElement("div");
    header.id = "dev-tools-panel-header";
    header.className = "panel-header";
    header.textContent = "Dev Tools";
    panel.appendChild(header);

    // Dynamic item creation using DOM API
    devToolStates.forEach((tool, index) => {
        const item = document.createElement("div");
        item.id = tool.id;
        item.className = PANEL_LIST_ITEM_CLASS;
        item.style.backgroundColor = `rgba(0, 0, 0, ${index % 2 === 0 ? 0.4 : 0.2})`;

        const textSpan = document.createElement("span");
        textSpan.className = PANEL_LIST_ITEM_TEXT_CLASS;
        textSpan.textContent = tool.name;

        const checkmark = document.createElement("button");
        checkmark.className = PANEL_CHECKMARK_CLASS;
        checkmark.classList.toggle('checked', tool.state);
        checkmark.setAttribute("aria-pressed", tool.state);

        item.append(textSpan, checkmark);
        panel.appendChild(item);
    });

    // Event delegation
    panel.addEventListener('click', (event) => {
        const item = event.target.closest(PANEL_LIST_ITEM_CLASS_SELECTOR);
        if (item && !item.classList.contains('disabled-overlay-item')) {
            const toolName = item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent;
            if (toolName) toggleDevTool(toolName);
        }
    });

    document.body.appendChild(panel);
    return panel;
}

function handlePanelClick(event) {
    const item = event.target.closest(PANEL_LIST_ITEM_CLASS_SELECTOR);
    if (!item || item.classList.contains('disabled-overlay-item')) return;

    const toolName = item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent;
    if (toolName) toggleDevTool(toolName);
}

export function toggleDevTools() {
    const existingPanel = document.getElementById(DEV_TOOLS_PANEL_ID);
    if (existingPanel) {
        // Cleanup
        existingPanel.removeEventListener('click', handlePanelClick);
        existingPanel.remove();
    } else {
        createDevToolsPanel();
    }
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
            updateToolVisualState(incompatibleToolName);
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

    updateToolVisualState(toolName);
    createAndPlayAudio("effects/toggle_overlay.mp3", 0.7);
}

function updateToolVisualState(toolName) {
    updatePanelCheckmarkVisual(
        document.getElementById(DEV_TOOLS_PANEL_ID),
        PANEL_LIST_ITEM_CLASS_SELECTOR,
        item => item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent === toolName
    );
}