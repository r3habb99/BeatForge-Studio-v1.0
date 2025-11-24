/**
 * Actions Menu Module
 * Handles the actions dropdown menu functionality
 */

import { applyTheme } from "../utils/theme.js";
import { showShortcuts } from "./eventHandlers.js";
import { THEMES } from "../constants/themes.js";

/**
 * Initialize actions menu
 */
export function initActionsMenu() {
  const actionsMenuBtn = document.getElementById("actionsMenuBtn");
  const actionsMenu = document.getElementById("actionsMenu");
  const showShortcutsBtnMenu = document.getElementById("showShortcutsBtnMenu");

  if (!actionsMenuBtn || !actionsMenu) return;

  // Generate theme options dynamically
  generateThemeOptions();

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

  // Theme option event listeners will be attached in generateThemeOptions()

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
 * Generate theme options dynamically from THEMES constant
 */
function generateThemeOptions() {
  const themeOptionsGrid = document.getElementById("themeOptionsGrid");
  if (!themeOptionsGrid) return;

  // Clear existing options
  themeOptionsGrid.innerHTML = "";

  // Generate theme buttons
  THEMES.forEach((theme) => {
    const button = document.createElement("button");
    button.dataset.theme = theme.value;
    button.className = "theme-option-compact";

    // Create preview span with gradient
    const preview = document.createElement("span");
    preview.className = "theme-preview-compact";
    preview.style.background = theme.gradient;

    // Create name span
    const name = document.createElement("span");
    name.className = "theme-name-compact";
    name.textContent = theme.name;

    button.appendChild(preview);
    button.appendChild(name);

    // Add click event listener
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      applyTheme(theme.value);

      // Update active state
      const allOptions = themeOptionsGrid.querySelectorAll(
        ".theme-option-compact"
      );
      allOptions.forEach((opt) => opt.classList.remove("active"));
      button.classList.add("active");

      // Show toast notification
      if (window.toast) {
        window.toast.success(
          "Theme Changed",
          `Switched to ${theme.name} theme`
        );
      }

      // Close menu after selection
      const actionsMenu = document.getElementById("actionsMenu");
      setTimeout(() => {
        actionsMenu?.classList.add("hidden");
      }, 300);
    });

    themeOptionsGrid.appendChild(button);
  });

  // Set active theme
  const currentTheme = window.getCurrentTheme?.() || "dark";
  const activeButton = themeOptionsGrid.querySelector(
    `[data-theme="${currentTheme}"]`
  );
  if (activeButton) {
    activeButton.classList.add("active");
  }
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
