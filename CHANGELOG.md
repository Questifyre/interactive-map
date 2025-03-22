# Changelog

All notable changes to this project will be documented in this file.

## Alpha v0.4.0-AN1 - 22-03-2025

This release introduces improvements to CSS file naming conventions and implements a secondary loading screen for specific operations.

### Code Style Improvements

* **Standardized CSS Filename Convention:** Updated all CSS filenames to utilize hyphens instead of underscores, aligning with industry standard practices.
* **Refactored Loading CSS:** Renamed "loading.css" to "loading-main.css" to better distinguish its purpose.
* **Introduced Secondary Loading CSS:** Added a new CSS file, "loading-secondary.css", to manage the styling for the new secondary loading screen.

### Refactorings

* **Updated Loading Screen Configuration:** The "config.js" file now includes DOM Element IDs for both primary and secondary loading screens.
* **Improved Loading Logic:** The "loading.js" script has been updated to utilize the DOM Element IDs defined in "config.js", replacing previously hardcoded values.

### New Features

* **Implemented Secondary Loading Screen:** Introduced a "secondary loading screen" widget that is displayed during the loading process when toggling the map grid and overlays, providing visual feedback to the user.