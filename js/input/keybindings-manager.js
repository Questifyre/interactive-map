import { KEY_BINDINGS, KEYBINDINGS_PANEL_ID } from "../config/config-manager.js";
import { enabledButtonIds } from "../ui/navigation/bottom-navbar-button-manager.js";
import { createPanel, setPanelItemFeedback } from "../ui/ui-manager.js";

const initializeKeyBindings = function () {
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    const numberKey = parseInt(key, 10);

    // Only handle number keys
    if (isNaN(numberKey)) return;

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

window.addEventListener("application-started", () => {
  initializeKeyBindings();
});

let activeInput = null;

export const toggleKeybindingsPanel = function () {
  const existingPanel = document.getElementById(KEYBINDINGS_PANEL_ID);
  if (existingPanel) {
    existingPanel.remove();
  } else {
    createKeybindingsPanel();
  }
};

function getKeyDisplay(key) {
  const displayMap = {
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
    space: "␣",
  };
  return displayMap[key] || key.toUpperCase();
}

function createKeybindingsPanel() {
  const bindingsItems = Object.entries(KEY_BINDINGS).map(([action, key]) => ({
    name: action,
    key: getKeyDisplay(key),
    state: false,
    UIStyle: "Key",
  }));

  createPanel(
    KEYBINDINGS_PANEL_ID,
    "Keybindings",
    bindingsItems,
    handleKeybindingAction,
    {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  );
}

function handleKeybindingAction(event) {
  const listItem = event.target.closest(".panel-list-item");
  if (listItem && !activeInput) {
    activeInput = listItem;
    listItem.classList.add("editing");
    const keyDisplay = listItem.querySelector(".panel-list-item-key");
    keyDisplay.textContent = "_";

    const handleKeyPress = (e) => {
      e.preventDefault();
      let newKey = e.key.toLowerCase();

      // Allow any key that's not a modifier
      if (!["control", "alt", "shift", "meta"].includes(newKey)) {
        KEY_BINDINGS[listItem.dataset.action] = newKey;
        keyDisplay.textContent = getKeyDisplay(newKey);
        saveBindingsToCookie();
        listItem.classList.remove("editing");
        window.removeEventListener("keydown", handleKeyPress);
        activeInput = null;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    setPanelItemFeedback(listItem, listItem.dataset.action, "effects/button_tap_1.mp3", 0.1);
  }
}

export async function saveBindingsToCookie() {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `keybindings=${encodeURIComponent(JSON.stringify(KEY_BINDINGS))}; expires=${expires.toUTCString()}; path=/`;

  const keyBindingsUpdatedEvent = new CustomEvent("keybindingsUpdated", {
    detail: { newBindings: KEY_BINDINGS },
  });

  window.dispatchEvent(keyBindingsUpdatedEvent);
}