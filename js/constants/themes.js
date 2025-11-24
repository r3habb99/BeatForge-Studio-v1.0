/**
 * Theme Constants
 * Centralized theme definitions for both mobile and desktop
 */

/**
 * Available themes with their metadata
 * @type {Array<{name: string, value: string, colors: string[], gradient?: string}>}
 */
export const THEMES = [
  {
    name: "Cyberpunk",
    value: "cyberpunk",
    colors: ["#00f0ff", "#ff00ff", "#ffff00"],
    gradient: "linear-gradient(135deg, #0d0221, #ff006e)",
  },
  {
    name: "Neon Nights",
    value: "neon",
    colors: ["#ff006e", "#8338ec", "#3a86ff"],
    gradient: "linear-gradient(135deg, #0a0e27, #00f5ff)",
  },
  {
    name: "Synthwave",
    value: "synthwave",
    colors: ["#ff006e", "#fb5607", "#ffbe0b"],
    gradient: "linear-gradient(135deg, #2b0a3d, #ff006e)",
  },
  {
    name: "Matrix",
    value: "matrix",
    colors: ["#00ff41", "#008f11", "#00ff41"],
    gradient: "linear-gradient(135deg, #0d0d0d, #00ff41)",
  },
  {
    name: "Vaporwave",
    value: "vaporwave",
    colors: ["#ff71ce", "#01cdfe", "#05ffa1"],
    gradient: "linear-gradient(135deg, #1a0033, #ff71ce)",
  },
  {
    name: "Dark Purple",
    value: "dark-purple",
    colors: ["#9d4edd", "#7209b7", "#560bad"],
    gradient: "linear-gradient(135deg, #10002b, #9d4edd)",
  },
  {
    name: "Dark",
    value: "dark",
    colors: ["#121212", "#1e1e1e", "#2a2a2a"],
    gradient: "linear-gradient(135deg, #121212, #1e1e1e)",
  },
  {
    name: "Darker",
    value: "darker",
    colors: ["#0a0a0a", "#141414", "#1a1a1a"],
    gradient: "linear-gradient(135deg, #0a0a0a, #141414)",
  },
  {
    name: "Ocean",
    value: "ocean",
    colors: ["#001f3f", "#0074d9", "#00d9ff"],
    gradient: "linear-gradient(135deg, #001f3f, #00d9ff)",
  },
  {
    name: "Sunset",
    value: "sunset",
    colors: ["#1a0f0f", "#ff6b35", "#f7931e"],
    gradient: "linear-gradient(135deg, #1a0f0f, #ff6b35)",
  },
];

/**
 * Get theme by value
 * @param {string} value - Theme value
 * @returns {object|undefined} Theme object or undefined if not found
 */
export function getThemeByValue(value) {
  return THEMES.find((theme) => theme.value === value);
}

/**
 * Get all theme values
 * @returns {string[]} Array of theme values
 */
export function getThemeValues() {
  return THEMES.map((theme) => theme.value);
}

/**
 * Get all theme names
 * @returns {string[]} Array of theme names
 */
export function getThemeNames() {
  return THEMES.map((theme) => theme.name);
}

