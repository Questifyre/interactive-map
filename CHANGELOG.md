# Changelog

All notable changes to this project will be documented in this file.

## Alpha v0.3.0-ZN1 - 22-03-2025

This release focuses on performance improvements, code refactoring for better maintainability, and UI/UX enhancements.

### Mobile Support

* **Added Touch Support:** The application now support touch panning and zooming.
* **UI/UX Improvements** Increased the size of various UI/UX elements for mobile, specially in Portrait mode.

### Performance Improvements

* **Greatly reduced the sample map asset sizes:** Optimized the size of sample map assets, leading to a smaller overall application footprint and potentially faster loading times.
* **Greatly reduced the size of various image assets:** Image assets across the application have been optimized to reduce their file sizes, improving performance and reducing bandwidth usage.

### Refactorings

* **Renamed "tools-nav-bar" to "bottom-nav-bar":** The navigation bar previously used for tools has been renamed to "bottom-nav-bar" to better reflect its position and purpose within the application.
* **Standardized bottom navbar CSS rules:** The CSS rules for elements within the "bottom-nav-bar" have been refactored to use a generic `nav-bar` class. This provides a consistent styling foundation for future navigation bars within the project.
* **Renamed "overlays-nav-bar" to "overlay-panel":** The navigation bar related to overlays has been refactored and renamed to "overlay-panel", indicating its function as a panel for overlay controls.
* **Split "overlays.css" into "tooltips.css" and "overlays_panel.css":** The CSS rules within the "overlays.css" file have been separated into two more specific files: "tooltips.css" for tooltip-related styles and "overlays_panel.css" for the styles specific to the overlay panel. This improves code organization and maintainability.

### UI/UX Changes

* **Replaced buttons with stylized checkmarks in the "Overlay" panel:** The buttons within the list items of the "Overlay" panel have been replaced with visually appealing and intuitive stylized checkmarks to indicate selection.
* **Dynamic height for "Overlays" panel items:** Items within the "Overlays" panel now dynamically adjust their height based on the amount of text they contain, improving readability for varying content lengths.
* **Disabled text selection under the "Overlays" panel:** Text elements located under the "Overlays" panel are no longer selectable, preventing accidental text highlighting and improving the user experience.
* **Redesigned "Toggle Grid" button icon:** The icon for the "Toggle Grid" button has been redesigned with a focus on aesthetics and clarity, making its function more easily understandable.
* **Redesigned "Rain Weather" icon:** The icon representing "Rain Weather" has been updated with a more visually appealing and easily recognizable design.

## Alpha v0.3.2-ZN2 / ZN3 - 22-03-2025

This release deals with some issues leftover from the last update.

### Performance Improvements

* **Greatly reduced the background asset size:** Optimized the size of background and replaced it with a more fitting artstyle.

### Bug Fixes

* **Fixed Tooltips** Tooltip functionality has been restored.
