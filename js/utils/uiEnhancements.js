/**
 * UI Enhancements Initialization
 * Initializes all modern UI improvements
 */

import { initTheme } from "./theme.js";
import { initTooltips } from "./tooltip.js";
import { initShortcutsOverlay } from "./shortcutsOverlay.js";
import { initTrackColors } from "./trackColors.js";

/**
 * Initialize all UI enhancements
 */
export function initUIEnhancements() {
  // Initialize theme system
  try {
    initTheme();
  } catch (error) {
    console.error("Theme initialization failed:", error);
  }

  // Initialize tooltips
  try {
    initTooltips();
  } catch (error) {
    console.error("Tooltips initialization failed:", error);
  }

  // Initialize shortcuts overlay
  try {
    initShortcutsOverlay();
  } catch (error) {
    console.error("Shortcuts overlay initialization failed:", error);
  }

  // Initialize track colors
  try {
    initTrackColors();
  } catch (error) {
    console.error("Track colors initialization failed:", error);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUIEnhancements);
} else {
  initUIEnhancements();
}

export default initUIEnhancements;
