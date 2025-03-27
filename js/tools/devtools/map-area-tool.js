import { createAndPlayAudio } from "../../audio/sound-system.js";
import { CANVAS_MAP } from "../../config/config-manager.js";
import { disableMouseInputTrick } from "../../input/canvas/canvas-mouse-handler.js";
import { currentWallpaperMatrix } from "../../rendering/canvas-manager.js";
import { createPopup, removePopup } from "../../ui/components/popup-controller.js"; //TEMP
import { getRelativeCoordinates } from "../../utilities/utils.js";
import { devToolStates } from "./dev-tools-manager.js";

let areas = [];
let drawing = false;
let startScreenX, startScreenY;
let startTransformedX, startTransformedY;
let currentBox = null;

// Configuration object for tool prompts
const TOOL_PROMPTS = {
  "Define Map Tooltip Area": {
    id: "define-map-area-tooltip-prompt",
    conflictingPrompts: ["define-map-region-sound-prompt"],
    fields: [
      { label: "Tooltip Name:", id: "tooltipName", type: "text", tag: "input" },
      {
        label: "Tooltip Description:",
        id: "tooltipDesc",
        type: null,
        tag: "textarea",
      },
    ],
    buttons: [
      {
        id: "promptMapAreaTooltipCancel",
        text: "Cancel",
        className: "btn-cancel",
      },
      { id: "promptMapAreaTooltipOK", text: "OK", className: "btn-ok" },
    ],
  },
  "Define Region Sound Area": {
    id: "define-map-region-sound-prompt",
    conflictingPrompts: ["define-map-area-tooltip-prompt"],
    fields: [
      { label: "Sound Path:", id: "soundPath", type: "text", tag: "input" },
    ],
    buttons: [
      {
        id: "promptMapSoundRegionCancel",
        text: "Cancel",
        className: "btn-cancel",
      },
      { id: "promptMapSoundRegionOK", text: "OK", className: "btn-ok" },
    ],
  },
};

const cancelDrawing = function () {
  disableMouseInputTrick[0] = false;
  drawing = false;
  if (currentBox) {
    currentBox.remove();
    currentBox = null;
  }
}

const saveAreasToFile = async function () {
  disableMouseInputTrick[0] = false;
  const activeTool = devToolStates.find((tool) => tool.state);
  if (!activeTool) return;

  let configKey;
  if (activeTool.name === "Define Map Tooltip Area") {
    configKey = "Map Tooltips";
  } else if (activeTool.name === "Define Region Sound Area") {
    configKey = "Region Music";
  } else {
    return;
  }

  try {
    // Read existing config
    const response = await fetch("config.json");
    const config = await response.json();

    // Add new areas to the appropriate section
    config[configKey] = [...(config[configKey] || []), ...areas];

    // Create and trigger download
    const data = JSON.stringify(config, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error saving areas:", error);
  } finally {
    areas = [];
  }
}

const handleMouseDown = function (event) {
  if (event.button === 0) {
    // Left click
    disableMouseInputTrick[0] = true;
    event.preventDefault();
    const mousePos = getRelativeCoordinates(event, CANVAS_MAP);
    const point = new DOMPoint(mousePos.x, mousePos.y);
    const transformedPoint = currentWallpaperMatrix
      .inverse()
      .transformPoint(point);

    startScreenX = mousePos.x;
    startScreenY = mousePos.y;
    startTransformedX = transformedPoint.x;
    startTransformedY = transformedPoint.y;

    currentBox = document.createElement("div");
    currentBox.id = "dev-map-area-box";
    currentBox.style.zIndex = 290;
    currentBox.style.position = "absolute";
    currentBox.style.left = `${startScreenX}px`;
    currentBox.style.top = `${startScreenY}px`;
    currentBox.style.width = "0";
    currentBox.style.height = "0";
    currentBox.style.border = "2px solid rgba(30, 144, 255, 0.7)";
    currentBox.style.backgroundColor = "rgba(0, 102, 255, 0.3)";
    currentBox.style.pointerEvents = "none";
    CANVAS_MAP.parentNode.appendChild(currentBox);

    drawing = true;
  } else if (event.button === 2) {
    // Right click
    cancelDrawing();
  } else if (event.button === 1) {
    // Middle click
    event.preventDefault();
    if (areas.length > 0) {
      saveAreasToFile();
    }
  }
}

const handleMouseMove = function (event) {
  if (!drawing) return;

  const mousePos = getRelativeCoordinates(event, CANVAS_MAP);
  const currentX = mousePos.x;
  const currentY = mousePos.y;

  const left = Math.min(startScreenX, currentX);
  const top = Math.min(startScreenY, currentY);
  const width = Math.abs(currentX - startScreenX);
  const height = Math.abs(currentY - startScreenY);

  currentBox.style.left = `${left}px`;
  currentBox.style.top = `${top}px`;
  currentBox.style.width = `${width}px`;
  currentBox.style.height = `${height}px`;
}

const handleMouseUp = async function (event) {
  if (!drawing || event.button !== 0) return;
  disableMouseInputTrick[0] = false;
  drawing = false;

  const mousePos = getRelativeCoordinates(event, CANVAS_MAP);
  const point = new DOMPoint(mousePos.x, mousePos.y);
  const transformedPoint = currentWallpaperMatrix
    .inverse()
    .transformPoint(point);
  const endTransformedX = transformedPoint.x;
  const endTransformedY = transformedPoint.y;

  const minX = Math.min(startTransformedX, endTransformedX);
  const maxX = Math.max(startTransformedX, endTransformedX);
  const minY = Math.min(startTransformedY, endTransformedY);
  const maxY = Math.max(startTransformedY, endTransformedY);

  const activeTool = devToolStates.find((tool) => tool.state);
  if (!activeTool) return;

  let entry;
  if (activeTool.name === "Define Map Tooltip Area") {
    const result = await showMapTooltipPrompt();
    if (result && (result.name || result.description)) {
      entry = {
        name: result.name,
        description: result.description,
        area: {
          x: { min: Math.round(minX), max: Math.round(maxX) },
          y: { min: Math.round(minY), max: Math.round(maxY) },
        },
      };
    }
  } else if (activeTool.name === "Define Region Sound Area") {
    const soundPath = await showSoundPathPrompt();
    if (soundPath !== null && soundPath != "") {
      entry = {
        "sound path": soundPath,
        area: {
          x: { min: Math.round(minX), max: Math.round(maxX) },
          y: { min: Math.round(minY), max: Math.round(maxY) },
        },
      };
    }
  }

  if (entry) areas.push(entry);

  if (currentBox) {
    currentBox.remove();
    currentBox = null;
  }
}

// Unified event listener management
const eventHandlers = {
  add: () => {
    CANVAS_MAP.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  },
  remove: () => {
    CANVAS_MAP.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    CANVAS_MAP.removeEventListener("contextmenu", (e) => e.preventDefault());
  },
};

// Generic prompt creation function
const createPrompt = function ({ id, fields, buttons }) {
  const promptDiv = document.createElement("div");
  promptDiv.id = id;
  promptDiv.className = "prompt";

  const contentDiv = document.createElement("div");
  contentDiv.className = "prompt-content";

  fields.forEach(({ label, id, type, tag }) => {
    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", id);
    labelEl.textContent = label;

    const inputEl = document.createElement(tag);
    inputEl.id = id;
    if (type) inputEl.type = type;

    contentDiv.appendChild(labelEl);
    contentDiv.appendChild(inputEl);
  });

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "prompt-buttons";

  buttons.forEach(({ id, text, className }) => {
    const button = document.createElement("button");
    button.id = id;
    button.className = className;
    button.textContent = text;
    buttonDiv.appendChild(button);
  });

  contentDiv.appendChild(buttonDiv);
  promptDiv.appendChild(contentDiv);
  document.body.appendChild(promptDiv);
}

const removePrompt = (id) => {
  const prompt = document.getElementById(id);
  prompt?.parentNode?.removeChild(prompt);
};

const createPromptHandler = function (config) {
  return () => {
    return new Promise((resolve) => {
      const prompt = document.getElementById(config.promptId);
      const inputs = config.inputSelectors.map((sel) =>
        document.querySelector(sel)
      );

      const cleanUp = () => {
        prompt.style.display = "none";
        document.body.removeEventListener("keydown", handleKeyPress);
        config.buttonIds.forEach((id) => {
          document
            .getElementById(id)
            .removeEventListener("click", clickHandlers[id]);
        });
        createAndPlayAudio("effects/button_tap_1.mp3", 0.1, true);
      };

      const handleOK = () => {
        cleanUp();
        resolve(config.resultHandler(...inputs.map((input) => input.value)));
      };

      const handleCancel = () => {
        cleanUp();
        resolve(null);
      };

      const handleKeyPress = (e) => {
        if (e.key === "Enter") handleOK();
        if (e.key === "Escape") handleCancel();
      };

      const clickHandlers = {
        [config.buttonIds[0]]: handleCancel,
        [config.buttonIds[1]]: handleOK,
      };

      // Initialize prompt
      prompt.style.display = "block";
      inputs[0].select();

      // Set up event listeners
      document.body.addEventListener("keydown", handleKeyPress);
      config.buttonIds.forEach((id) => {
        document
          .getElementById(id)
          .addEventListener("click", clickHandlers[id]);
      });
    });
  };
}

// Configured prompts
const showMapTooltipPrompt = createPromptHandler({
  promptId: "define-map-area-tooltip-prompt",
  inputSelectors: ["#tooltipName", "#tooltipDesc"],
  buttonIds: ["promptMapAreaTooltipCancel", "promptMapAreaTooltipOK"],
  resultHandler: (name, description) => ({ name, description }),
});

const showSoundPathPrompt = createPromptHandler({
  promptId: "define-map-region-sound-prompt",
  inputSelectors: ["#soundPath"],
  buttonIds: ["promptMapSoundRegionCancel", "promptMapSoundRegionOK"],
  resultHandler: (path) => path,
});

// TEMP
const popupWarnings = {
  "Define Map Tooltip Area": false,
  "Define Region Sound Area": false,
};
//END TEMP

export const notifyMapAreaTool = function (toolName, toolState) {
  const config = TOOL_PROMPTS[toolName];
  if (!config) return;

  //TEMP
  if (toolState && !popupWarnings[toolName]) {
    createPopup({
      id: `${config.id}-popup`,
      header: "Instructions",
      content:
        "<span>What Is This Tool?<br><br>This tool lets you mark areas on your map to display tooltips or play region-specific sounds.<br><br>How to Use It<br><br>• Left Mouse Button: Click and drag to create a box that defines the area. When you release the button, a prompt will appear for you to enter details about the area.<br><br>• Right Mouse Button: Click to cancel the area creation process.<br><br>• Middle Mouse Button: Click to save your changes. This downloads a new config.json file that includes your current settings and any new areas.<br><br>Important Warning<br><br>Web browsers limit JavaScript's access to your file system for security reasons. This means:<br><br>• Automatic Overwrites Are Not Allowed: The tool cannot directly update your config.json file.<br><br>• Manual Update Required: When you save, the tool downloads an updated config.json. However, your session's areas are then cleared to avoid duplication. You must manually overwrite your existing config.json with the downloaded file and then reload the application to apply the changes safely.<br><br>This approach ensures that you remain in control of your file system while still being able to update your map settings.</span>",
      buttons: [
        { text: "×", type: "close" },
        { text: "OK", type: "ok" },
      ],
    });
    popupWarnings[toolName] = true;
  } else if (!toolState && popupWarnings[toolName]) {
    removePopup(`${config.id}-popup`);
  }
  //END TEMP

  if (toolState) {
    // Create prompt if not exists
    if (!document.getElementById(config.id)) {
      createPrompt(config);
    }

    // Remove conflicting prompts
    config.conflictingPrompts.forEach(removePrompt);

    // Set up interaction
    eventHandlers.add();
    areas = [];
  } else {
    // Clean up
    removePrompt(config.id);
    eventHandlers.remove();
    cancelDrawing();
  }
}
