/**
 * Theme Management System
 * Handles theme switching and persistence
 */

const THEME_KEY = "beatforge-theme";
const DEFAULT_THEME = "dark";

/**
 * Initialize theme system
 */
export function initTheme() {
  // Load saved theme or use default
  const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  applyTheme(savedTheme);

  // Setup theme button and menu
  const themeBtn = document.getElementById("themeBtn");
  const themeMenu = document.getElementById("themeMenu");
  const themeOptions = document.querySelectorAll(".theme-option");

  if (!themeBtn || !themeMenu) return;

  // Toggle theme menu
  themeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    themeMenu.classList.toggle("hidden");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!themeMenu.contains(e.target) && e.target !== themeBtn) {
      themeMenu.classList.add("hidden");
    }
  });

  // Handle theme selection
  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const theme = option.dataset.theme;
      applyTheme(theme);
      themeMenu.classList.add("hidden");

      // Show toast notification
      if (window.toast) {
        window.toast.success(
          "Theme Changed",
          `Switched to ${capitalizeFirst(theme)} theme`
        );
      }
    });
  });
}

/**
 * Apply a theme
 * @param {string} themeName - Theme name to apply
 */
export function applyTheme(themeName) {
  // Set data-theme attribute on html element
  if (themeName === "dark") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", themeName);
  }

  // Save to localStorage
  localStorage.setItem(THEME_KEY, themeName);

  // Update active state in menu
  updateThemeMenu(themeName);
}

/**
 * Update theme menu active state
 * @param {string} activeTheme - Currently active theme
 */
function updateThemeMenu(activeTheme) {
  // Update regular theme options
  const themeOptions = document.querySelectorAll(".theme-option");
  themeOptions.forEach((option) => {
    if (option.dataset.theme === activeTheme) {
      option.classList.add("active");
    } else {
      option.classList.remove("active");
    }
  });

  // Update compact theme options in actions menu
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
 * Get current theme
 * @returns {string} Current theme name
 */
export function getCurrentTheme() {
  return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Make theme functions available globally
window.initTheme = initTheme;
window.applyTheme = applyTheme;
window.getCurrentTheme = getCurrentTheme;
