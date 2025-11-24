/**
 * Actions Menu Module
 * Handles the actions dropdown menu functionality
 */

import { applyTheme } from "../utils/theme.js";
import { showShortcuts } from "./eventHandlers.js";

/**
 * Initialize actions menu
 */
export function initActionsMenu() {
  const actionsMenuBtn = document.getElementById("actionsMenuBtn");
  const actionsMenu = document.getElementById("actionsMenu");
  const themeOptionsCompact = document.querySelectorAll(
    ".theme-option-compact"
  );
  const showShortcutsBtnMenu = document.getElementById("showShortcutsBtnMenu");

  if (!actionsMenuBtn || !actionsMenu) return;

  // Toggle actions menu
  actionsMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    actionsMenu.classList.toggle("hidden");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!actionsMenu.contains(e.target) && e.target !== actionsMenuBtn) {
      actionsMenu.classList.add("hidden");
    }
  });

  // Handle theme selection from compact options
  themeOptionsCompact.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const theme = option.dataset.theme;
      applyTheme(theme);

      // Update active state
      themeOptionsCompact.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");

      // Show toast notification
      if (window.toast) {
        window.toast.success(
          "Theme Changed",
          `Switched to ${capitalizeFirst(theme)} theme`
        );
      }

      // Close menu after selection
      setTimeout(() => {
        actionsMenu.classList.add("hidden");
      }, 300);
    });
  });

  // Handle shortcuts button click
  if (showShortcutsBtnMenu) {
    showShortcutsBtnMenu.addEventListener("click", () => {
      showShortcuts();
      actionsMenu.classList.add("hidden");
    });
  }

  // Close menu when clicking on action items (except theme options)
  const actionItems = actionsMenu.querySelectorAll(".actions-menu-item");
  actionItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Close menu after a short delay to allow the action to execute
      setTimeout(() => {
        actionsMenu.classList.add("hidden");
      }, 100);
    });
  });
}

/**
 * Update theme options active state
 * @param {string} activeTheme - Currently active theme
 */
export function updateActionsMenuTheme(activeTheme) {
  const themeOptionsCompact = document.querySelectorAll(
    ".theme-option-compact"
  );
  themeOptionsCompact.forEach((option) => {
    if (option.dataset.theme === activeTheme) {
      option.classList.add("active");
    } else {
      option.classList.remove("active");
    }
  });
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
