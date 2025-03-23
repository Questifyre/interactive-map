# Changelog

All notable changes to this project will be documented in this file.

## Alpha v0.5.0-BN1

This release includes several improvements and refactors aimed at enhancing performance, user experience, and code maintainability. Key changes include:

**Performance Improvements:**

* Made the loading of map and overlay sprites asynchronous. This should improve initial load times and responsiveness.
* Improved the secondary loading screen code and made it not display if the load time is very quick, providing a smoother experience for fast loads.
* Optimized the size of several art assets, reducing the overall footprint of the application.

**User Interface and Experience Enhancements:**

* The "overlays-panel" HTML element is now hidden by default using CSS rules instead of HTML styles. This promotes better separation of concerns.
* Added a script to "index.html" that forces critical loading of content before the page is visible, preventing Flash of Unstyled Content (FOUC) and improving visual stability.
* Replaced the "Reset Zoom" button's icon with a new one that should make its usage more readily apparent.
* Refactored the "Reset Zoom" button to "Reset View" for clarity.
* Zooming and panning have been significantly improved on mobile devices, offering a smoother and more intuitive experience.
* Altered CSS rules for "navbar.css", making it much more readable and easily interacted with on devices using portrait orientation.

**Code Refactoring and Improvements:**

* Removed any unused variables throughout the project, contributing to a cleaner codebase.
* The "main.js" file now loads several DOM elements utilizing variables from "config.js", instead of being hardcoded. This improves configurability and reduces redundancy.
* Refactored the function "setupTooltipListeners" to "setupNavBarTooltipListeners" for better clarity and to reflect its specific purpose.
* Refactored the "resetZoom" function to "resetView" to align with the button's new name.
* All HTML element IDs have been refactored to use kebab-case for consistency and best practices.
* Modified the "loadConfigFile" function in "main.js" to use ternary operators and other logical simplifications, resulting in less verbose code.

**Configuration Changes:**

* **Important:** Refactored the "Enable Reset Zoom" property in "config.json" to "Enable Reset View". **Please update your `config.json` file accordingly!**
* Added the "Page Title" property in "config.json" that allows modification of the page's title displayed in the browser.