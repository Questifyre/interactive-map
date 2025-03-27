import { createAndPlayAudio } from "../../audio/sound-system.js";


const popups = [];
let styleAdded = false;

// Usage example:
// createPopup({
//   id: 'welcome-popup',
//   header: 'Welcome',
//   content: '<span>Your content here</span>',
//   buttons: [
//     { text: 'Close', type: 'close', action: () => console.log('Closed') },
//     { text: 'Confirm', type: 'ok', action: () => console.log('Confirmed') }
//   ]
// });

// Add necessary styles dynamically
const addPopupStyles = function () {
	if (styleAdded) return;

	const style = document.createElement('style');
	style.textContent = `
    .popup {
      z-index: 1000;
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    .popup.fade-out {
      animation: fadeOut 0.3s ease forwards !important;
    }

    /* Other popup styles from previous implementation */
    .popup-content { /* ... */ }
    .popup-header { /* ... */ }
    .popup-close-btn { /* ... */ }
    /* Include all other popup-related styles here */
  `;

	document.head.appendChild(style);
	styleAdded = true;
}

export const removePopup = function (id) {
	const index = popups.findIndex(p => p.id === id);
	if (index === -1) return;

	const popup = popups[index];
	popup.element.classList.add('fade-out');

	popup.element.addEventListener('animationend', () => {
		popup.element.remove();
		popups.splice(index, 1);
	}, { once: true });
}

export const createPopup = function (options) {
	addPopupStyles();

	const popup = document.createElement('div');
	popup.className = 'popup';
	popup.style.display = 'block';

	const id = options.id || `popup-${Date.now()}`;
	popup.id = id;

	const content = document.createElement('div');
	content.className = 'popup-content';

	if (options.header) {
		const header = document.createElement('div');
		header.className = 'popup-header';
		header.textContent = options.header;
		content.appendChild(header);
	}

	const closeBtn = document.createElement('button');
	closeBtn.className = 'popup-close-btn';
	closeBtn.innerHTML = '&times;';
	closeBtn.addEventListener('click', () => removePopup(id));
	content.appendChild(closeBtn);

	if (options.content) {
		const description = document.createElement('div');
		description.className = 'popup-description';
		description.innerHTML = options.content;
		content.appendChild(description);
	}

	if (options.buttons) {
		const buttonContainer = document.createElement('div');
		buttonContainer.className = 'popup-buttons';

		options.buttons.forEach(buttonConfig => {
			const btn = document.createElement('button');
			btn.className = `popup-${buttonConfig.type}-btn`;
			btn.textContent = buttonConfig.text;

			btn.addEventListener('click', () => {
				if (buttonConfig.action) buttonConfig.action();
				if (buttonConfig.close !== false) removePopup(id);
				createAndPlayAudio("effects/button_tap_1.mp3", 0.1, true);
			});

			buttonContainer.appendChild(btn);
		});

		content.appendChild(buttonContainer);
	}

	popup.appendChild(content);
	document.body.appendChild(popup);
	popups.push({ id, element: popup });

	return id;
}

export const activePopups = popups;