import {
  PANEL_LIST_ITEM_CLASS_SELECTOR,
  PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR,
  USER_TOOLS_PANEL_ID,
} from "../../config/config-manager.js";

import { createPanel, setPanelItemFeedback } from "../../ui/ui-manager.js";
import { enableDistanceMeasurement } from "./distance-measurement-tool.js";

// ==============================
// Map Overlays System
// ==============================

let userToolsPanel = document.getElementById(USER_TOOLS_PANEL_ID);
let userToolStates = [
  {
    name: "Measure Distance",
    state: false,
    allowed: true,
    UIStyle: "Toggle",
  },
];

// ==============================
// User Tool Logic
// ==============================

const toggleUserTool = function (toolName) {
  const tool = userToolStates.find(t => t.name === toolName);
  if (!tool) {
    console.warn(`User tool "${toolName}" not found`);
    return;
  }

  const wasEnabled = tool.state;
  const enableTool = !wasEnabled;
  tool.state = enableTool;

  // Execute tool-specific logic
  switch (toolName) {
    case "Measure Distance":
      enableDistanceMeasurement(enableTool);
      break;
  }

  setPanelItemFeedback(userToolsPanel, toolName, "effects/button_tap_1.mp3", 0.1, true);
};

const setItemAction = function (event) {
  const item = event.target.closest(PANEL_LIST_ITEM_CLASS_SELECTOR);
  if (item) {
    const userToolName = item.querySelector(PANEL_LIST_ITEM_TEXT_CLASS_SELECTOR)?.textContent;
    if (userToolName) toggleUserTool(userToolName);
  }
};

export const toggleUserToolsPanel = function () {
  userToolsPanel = document.getElementById(USER_TOOLS_PANEL_ID);
  if (userToolsPanel) {
    userToolsPanel.remove();
  } else {
    userToolsPanel = createPanel(
      USER_TOOLS_PANEL_ID,
      "Tools",
      userToolStates,
      setItemAction,
    );
  }
};