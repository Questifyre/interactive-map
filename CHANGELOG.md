# Changelog

All notable changes to this project will be documented in this file.

## Alpha v0.8.0-EN1 - 29-03-2025

### Canvas Rendering & Layering Overhaul
- Split up the **Overlays Canvas** into two separate canvases:  
  - One for **Static Overlays**  
  - One for **Dynamic Overlays**
- Added a new dedicated canvas for **Weather Effects**.
- Added a new dedicated canvas for **Day Time Effects**.
- Adjusted the **canvas rendering order**, from lowest to highest:
  - **Background** → **Map** → **Weather** → **Time** → **Static Overlays** → **Dynamic Overlays**.

### User Preferences & Settings Overhaul
- **User settings** are no longer stored in `user-prefs.json`.  
  - They are now **exclusively handled via browser cookies**.  
  - All settings are **enabled by default** (but can be toggled).

### UI/UX Changes
- The **Sound Panel** is no longer a standalone button in the **Bottom NavBar**.  
  - It has been moved to the **Settings Panel** as an option.

### Performance Optimization
- Greatly optimized performance across all fronts by implementing more event listeners, optimizing canvas rendering, and applying other efficiency improvements.

### Code Refactoring & Naming Consistency
- Refactored `drawDayNightOverlay()` to `drawDayTimeOverlay()` in `time-of-day-manager.js`.
- Refactored `updateDayNightCycle()` to `updateDayTimeCycle()` in `time-of-day-manager.js`.

### Bug Fixes
- Finally fixed the GitHub favicon issue. It will now properly load as it should.


## Alpha v0.7.0-DN1 - 26-03-2025

### Configuration & Code Consistency
- Swapped several settings in `config.json` around for a more consistent scheme.
- Added new settings in `config.json` to allow setting the map scale for the measurement tool.
- Added a new toggle flag in `config.json` for the **Tools** button.
- Swapped several variables in imports and similar code areas for a more consistent codebase.
- Refactored all possible functions throughout the project with `const`.

### UI/UX & Navigation Enhancements
- The buttons under the Bottom Nav Bar are now dynamically inserted using JS (`navbar-buttons.js`) instead of being prebaked in HTML.
- Disabled buttons are no longer rendered at all (instead of being greyed out), keeping the UI uncluttered.
- Action Shortcuts are now dynamically defined by their hierarchy within elements.
- Refactored the **Tools** navbar (bottom navbar) to **Menu**.
- Shifted the **Developer Mode** button's icon to the **Tools** button, which now features a new icon.

### Feature Updates & New Tools
- Introduced a new **Tools** button that toggles a panel of useful interactive tools for the user.
- Added a "Distance Measurement" tool that allows users to measure the distance between locations using configured scales.

### General Cleanup & Performance
- Performed extensive general code cleanup, organization, and performance optimizations across all fronts.
- Added a very subtle sound effect for regular clicks on UI elements to improve feedback.
- Updated overlays to render over weather and day time effects.

### Code Refactoring & File Renaming
- Refactored `handleDayNightToggle()` to `handleDayTimeToggle()`.
- Refactored `dayNightButton` to `dayTimeButton`.
- Removed "Prototype" from the version note as the application is now considered ready for deployment.
- Refactored the following files:
  - `weather.js` → `weather-manager.js`
  - `ui.js` → `ui-manager.js`
  - `navbar-buttons.js.js` → `bottom-navbar-button-manager.js.js`
  - `map-tooltips.js.js` → `map-tooltips-manager.js`
  - `loading.js` → `loading-screen-manager.js`
  - `header.js` → `header-animation.js`
  - `daynight.js` → `time-of-day-manager.js`
  - `config.js` → `config-manager.js`
  - `classes.js` → `weather-classes.js`
  - `audio.js` → `sound-system.js`
  - `actions.js` → `ui-actions.js`
  - `overlay-tooltips.js` → `map-tooltip-overlay.js`
  - `mouse-tracking.js` → `mouse-tracking-tool.js`
  - `define-map-area.js.js` → `map-area-tool.js.js`
  - `dev-tools.js` → `dev-tools-manager.js`
  - `canvas-touch-interactions.js` → `canvas-gesture-handler.js`
  - `canvas-mouse-interactions.js` → `canvas-mouse-handler.js`
  - `canvas-keyboard-interactions.js` → `canvas-keyboard-handler.js`
  - `canvas-interactions.js` → `canvas-input-manager.js`
  - `popups.js` → `popup-controller.js`

## Alpha v0.6.0-CN1 - 25-03-2025

This release is a nearly complete rework of the application’s front end while preserving the underlying foundations. It introduces new features for developer productivity and user interactivity, reorganizes code for improved maintainability, and implements several performance and UI enhancements.

### HTML & Asset Loading Updates
- **Favicon Fix:** Added a trailing “?” to the favicon loading line in `index.html` to fix a GitHub Pages favicon error.
- **DOM Updates:** Modified `index.html` to include new DOM elements required for the Developer Tools and Settings panels.

### UI/UX Enhancements
- **Button Updates:**
  - Removed the white outline highlight from buttons to reduce visual clutter, relying on smooth hover animations instead.
  - Replaced the **Day & Night Cycle** button’s icon with a new one for clearer differentiation from the Weather button. *(Keep this change as is!)*
  - Refactored the **Day & Night** button’s label to **Set Time** to better describe its functionality.
- **Dynamic UI Rebuild:** The application now rebuilds its UI when resolution changes. This is especially useful for mobile users.
- **Fallback Styling:** A fallback font has been added to all CSS elements for improved consistency across platforms.

### Developer Tools & Keybindings
- **New Panels:**
  - Added a **Developer Tools** button that toggles a new Developer Tools panel.
  - Added a **Settings** button to open the Settings panel.
- **Configuration Changes:**
  - Introduced two new variables in `config.json`:
    - **Enable Settings:** Toggles the ability to edit map rendering settings.
    - **Developer Mode:** Enables additional developer tools and debugging features.
  - The old `TEST-TrackMousePosition` variable is removed. Its functionality now exists as a toggleable option within the Developer Tools panel.
- **Keybindings & User Preferences:**
  - A new `user-prefs.txt` file now stores local keybindings. In addition to pan keybindings (Pan Up, Left, Down, Right), the following shortcuts have been added:
    - **Toggle Grid** = 1
    - **Reset View** = 2
    - **Set Time** = 3
    - **Sound Panel** = 4
    - **Set Weather** = 5
    - **Overlays** = 6
    - **Settings** = 7
    - **Dev Tools** = 8
  - The keyboard input system for map panning now works regardless of focus but will pause automatically if an input field is active.

### CSS & Front-End Refactoring
- **Panel Styling:**
  - Renamed `overlays-panel.css` to `panel.css` to serve as a universal stylesheet for all panels.
  - Moved the `panel-header` CSS rules from `navbar.css` to `panel.css` for better organization.
- **General Styling:** Added a fallback font across all elements, ensuring a more consistent appearance.

### JavaScript & Codebase Improvements
- **Code Refactoring:**
  - Converted and refactored all JavaScript files to follow the industry-standard kebab-case naming convention.
  - Removed hardcoded DOM element names in functions like `loadConfigFile()` by fully utilizing variables defined in `config.js`.
  - Refactored `RESET_ZOOM_BUTTON_ID` to `RESET_VIEW_BUTTON_ID` to match the new “Reset View” nomenclature.
- **Function Relocation & Consolidation:**
  - Moved `updatePanelCheckmarkVisual` from `overlays.js` to `ui.js` to generalize its application across any checkmark elements.
  - Moved `getRelativeCoordinates` from `map_tooltips.js` to `utils.js` to broaden its utility.
  - Transferred the `redrawCanvas` function from `main.js` to `canvas.js` to centralize canvas-related operations.

### New Features & Enhancements
- **Map Interactions:**
  - Split `canvas.js` into two files—`canvas.js` and `canvas-interactions.js`—and relocated them into a new `canvas` folder. Panning and zooming functionality has been migrated to `canvas-interactions.js`.
- **Developer Tools Folder:** Introduced a new `devtools` folder containing:
  - `define-map-area.js`
  - `dev-tools.js`
  - `mouse-tracking.js`
- **Mouse Coordinate Tracking:** Users can now enable a feature under Developer Tools to display a tooltip with mouse coordinates relative to the map.
- **Map Tool & Sound Configuration:**
  - **Define Map Tooltip Area:** A new, drag-to-configure tool that simplifies adding and managing map tooltips.
  - **Define Region Sound Area:** Similarly, an advanced tool for easily configuring regional sound settings.
  - *Note:* After using these tools, the updated areas are saved to a new version of `config.json`. The user must manually replace the current file and reload the page. The tool automatically clears its cache upon saving or switching tools to prevent duplications.
- **Map Tooltips Overlay:** Added a new overlay that helps users identify the locations of map tooltips, particularly beneficial on mobile devices.
- **HTML & Performance Optimization:**
  - Renamed `overlay.js` to `overlay-manager.js` and moved it into a new `overlays` folder.
  - The header element and main loading screen are now removed from the DOM after their animations complete.
  - Several HTML elements are now created on demand (instead of at load), improving overall performance.

### Performance & Optimization
- Significant improvements have been made across the board to enhance application performance, including smoother tooltips with hardware acceleration and refined code for less verbose and more efficient operations.

## Alpha v0.5.0-BN1 - 23-03-2025

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

## Alpha v0.4.0-AN1 - 22-03-2025

This release introduces improvements to CSS file naming conventions and implements a secondary loading screen for specific operations.

### Code Style Improvements

* **Standardized CSS Filename Convention:** Updated all CSS filenames to utilize hyphens instead of underscores, aligning with industry standard practices.
* **Refactored Loading CSS:** Renamed "loading.css" to "loading-main.css" to better distinguish its purpose.
* **Introduced Secondary Loading CSS:** Added a new CSS file, "loading-secondary.css", to manage the styling for the new secondary loading screen.

## Alpha v0.3.2-ZN2 - 22-03-2025

This release deals with some issues leftover from the last update.

### Performance Improvements
* **Greatly reduced the background asset size:** Optimized the size of background and replaced it with a more fitting artstyle.

### Bug Fixes
* **Fixed Tooltips** Tooltip functionality has been restored.

## Alpha v0.3.0-ZN1 - 22-03-2025

This release focuses on performance improvements, code refactoring for better maintainability, and UI/UX enhancements.

### Mobile Support
* **Added Touch Support:** The application now supports touch panning and zooming.
* **UI/UX Improvements** Increased the size of various UI/UX elements for mobile, especially in Portrait mode.

### Performance Improvements
* **Greatly reduced the sample map asset sizes:** Optimized the size of sample map assets, leading to a smaller overall application footprint and potentially faster loading times.
* **Disabled text selection under the "Overlays" panel:** Text elements located under the "Overlays" panel are no longer selectable, preventing accidental text highlighting and improving the user experience.
* **Redesigned "Toggle Grid" button icon:** The icon for the "Toggle Grid" button has been redesigned with a focus on aesthetics and clarity, making its function more easily understandable.
* **Redesigned "Rain Weather" icon:** The icon representing "Rain Weather" has been updated with a more visually appealing and easily recognizable design.

## Alpha v0.1.0-XN1 > Alpha v0.2.0-YN1 - 21-03-2025

These releases marked the initial versions of the project, primarily uploaded for small-scale testing on real devices and setting up the GitHub repository environment.

At the time, this repository did not yet include a proper CHANGELOG. As a solo developer, my previous experience with version updates followed a patch note approach, where only the latest changes were documented rather than maintaining a cumulative log. This made sense for my previous projects, but now, with this truly public repository, I’m transitioning to a more structured and comprehensive CHANGELOG format.

Starting from Alpha v0.5.0-BN1, all notable changes will be recorded here moving forward. Earlier versions may not have full details, but this CHANGELOG will now serve as a continuous record of the project’s evolution.

Lastly, you may notice that the number of GitHub Page deployments is higher than the number of public commits. This is because I removed the commits for Alpha v0.1.0-XN1 and Alpha v0.2.0-YN1 (along with their respective patch updates) to keep the repository focused on fully functional versions moving forward.

For transparency, I want to emphasize that I will not alter the repository’s history without properly notifying everyone and providing a clear explanation — if it ever becomes necessary at all. Thank you for your understanding.