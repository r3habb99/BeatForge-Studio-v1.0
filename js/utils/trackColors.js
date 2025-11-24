/**
 * Track Color Customization System
 * Allows users to customize track colors with presets and custom colors
 */

const TRACK_COLORS_KEY = 'beatforge-track-colors';

// Predefined color presets
export const COLOR_PRESETS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#f43f5e', // Rose
  '#a855f7', // Violet
  '#eab308', // Yellow
  '#22c55e', // Emerald
];

/**
 * Initialize track color system
 */
export function initTrackColors() {
  // Load saved colors
  loadTrackColors();
}

/**
 * Add color picker to a track header
 * @param {HTMLElement} trackHeader - Track header element
 * @param {number} trackIndex - Track index
 */
export function addColorPicker(trackHeader, trackIndex) {
  // Create color button
  const colorBtn = document.createElement('button');
  colorBtn.className = 'track-color-btn';
  colorBtn.setAttribute('aria-label', 'Change track color');
  colorBtn.setAttribute('data-track-index', trackIndex);
  
  // Get saved color or use default
  const savedColor = getTrackColor(trackIndex);
  if (savedColor) {
    trackHeader.style.setProperty('--track-color', savedColor);
    colorBtn.style.background = savedColor;
  }
  
  // Create color picker popup
  const popup = createColorPickerPopup(trackIndex, savedColor);
  
  // Toggle popup on click
  colorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const allPopups = document.querySelectorAll('.color-picker-popup');
    allPopups.forEach(p => {
      if (p !== popup) p.classList.remove('active');
    });
    popup.classList.toggle('active');
  });
  
  trackHeader.appendChild(colorBtn);
  trackHeader.appendChild(popup);
  
  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target !== colorBtn) {
      popup.classList.remove('active');
    }
  });
}

/**
 * Create color picker popup
 * @param {number} trackIndex - Track index
 * @param {string} currentColor - Current track color
 * @returns {HTMLElement} Popup element
 */
function createColorPickerPopup(trackIndex, currentColor) {
  const popup = document.createElement('div');
  popup.className = 'color-picker-popup';
  
  // Create preset colors grid
  const presetsContainer = document.createElement('div');
  presetsContainer.className = 'color-presets';
  
  COLOR_PRESETS.forEach(color => {
    const preset = document.createElement('button');
    preset.className = 'color-preset';
    preset.style.background = color;
    preset.setAttribute('aria-label', `Set color to ${color}`);
    
    if (color === currentColor) {
      preset.classList.add('active');
    }
    
    preset.addEventListener('click', () => {
      setTrackColor(trackIndex, color);
      popup.classList.remove('active');
    });
    
    presetsContainer.appendChild(preset);
  });
  
  popup.appendChild(presetsContainer);
  
  return popup;
}

/**
 * Set track color
 * @param {number} trackIndex - Track index
 * @param {string} color - Color hex code
 */
export function setTrackColor(trackIndex, color) {
  const trackHeader = document.querySelector(`[data-track-index="${trackIndex}"]`)?.closest('.track-header-item');
  if (!trackHeader) return;
  
  // Apply color
  trackHeader.style.setProperty('--track-color', color);
  
  // Update button color
  const colorBtn = trackHeader.querySelector('.track-color-btn');
  if (colorBtn) {
    colorBtn.style.background = color;
  }
  
  // Save to localStorage
  saveTrackColor(trackIndex, color);
  
  // Show toast
  if (window.toast) {
    window.toast.success('Track Color Updated', `Track ${trackIndex + 1} color changed`);
  }
}

/**
 * Save track color to localStorage
 */
function saveTrackColor(trackIndex, color) {
  const colors = JSON.parse(localStorage.getItem(TRACK_COLORS_KEY) || '{}');
  colors[trackIndex] = color;
  localStorage.setItem(TRACK_COLORS_KEY, JSON.stringify(colors));
}

/**
 * Get track color from localStorage
 */
function getTrackColor(trackIndex) {
  const colors = JSON.parse(localStorage.getItem(TRACK_COLORS_KEY) || '{}');
  return colors[trackIndex];
}

/**
 * Load all saved track colors
 */
function loadTrackColors() {
  const colors = JSON.parse(localStorage.getItem(TRACK_COLORS_KEY) || '{}');
  Object.entries(colors).forEach(([index, color]) => {
    const trackHeader = document.querySelector(`[data-track-index="${index}"]`)?.closest('.track-header-item');
    if (trackHeader) {
      trackHeader.style.setProperty('--track-color', color);
    }
  });
}

// Make functions available globally
window.initTrackColors = initTrackColors;
window.addColorPicker = addColorPicker;
window.setTrackColor = setTrackColor;

