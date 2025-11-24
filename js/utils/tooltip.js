/**
 * Tooltip System
 * Provides beautiful tooltips with keyboard shortcuts
 */

let activeTooltip = null;
let tooltipTimeout = null;

/**
 * Initialize tooltips for all elements with data-tooltip attribute
 */
export function initTooltips() {
  const elements = document.querySelectorAll('[data-tooltip]');
  
  elements.forEach(element => {
    const text = element.getAttribute('data-tooltip');
    const shortcut = element.getAttribute('data-tooltip-shortcut');
    const position = element.getAttribute('data-tooltip-position') || 'top';
    
    element.addEventListener('mouseenter', (e) => {
      showTooltip(e.target, text, shortcut, position);
    });
    
    element.addEventListener('mouseleave', () => {
      hideTooltip();
    });
  });
}

/**
 * Show tooltip
 * @param {HTMLElement} element - Element to attach tooltip to
 * @param {string} text - Tooltip text
 * @param {string} shortcut - Keyboard shortcut (optional)
 * @param {string} position - Tooltip position: 'top', 'bottom', 'left', 'right'
 */
export function showTooltip(element, text, shortcut = null, position = 'top') {
  // Clear any existing tooltip
  hideTooltip();
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = `tooltip tooltip-${position}`;
  
  // Add text
  const textSpan = document.createElement('span');
  textSpan.textContent = text;
  tooltip.appendChild(textSpan);
  
  // Add shortcut if provided
  if (shortcut) {
    const shortcutSpan = document.createElement('span');
    shortcutSpan.className = 'tooltip-shortcut';
    shortcutSpan.textContent = shortcut;
    tooltip.appendChild(shortcutSpan);
  }
  
  // Position tooltip relative to element
  element.style.position = 'relative';
  element.appendChild(tooltip);
  
  // Show tooltip after a short delay
  tooltipTimeout = setTimeout(() => {
    tooltip.classList.add('show');
  }, 300);
  
  activeTooltip = tooltip;
}

/**
 * Hide active tooltip
 */
export function hideTooltip() {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = null;
  }
  
  if (activeTooltip) {
    activeTooltip.classList.remove('show');
    setTimeout(() => {
      if (activeTooltip && activeTooltip.parentNode) {
        activeTooltip.remove();
      }
      activeTooltip = null;
    }, 200);
  }
}

/**
 * Add tooltip to element programmatically
 * @param {HTMLElement} element - Element to add tooltip to
 * @param {string} text - Tooltip text
 * @param {string} shortcut - Keyboard shortcut (optional)
 * @param {string} position - Tooltip position
 */
export function addTooltip(element, text, shortcut = null, position = 'top') {
  element.setAttribute('data-tooltip', text);
  if (shortcut) {
    element.setAttribute('data-tooltip-shortcut', shortcut);
  }
  element.setAttribute('data-tooltip-position', position);
  
  element.addEventListener('mouseenter', (e) => {
    showTooltip(e.target, text, shortcut, position);
  });
  
  element.addEventListener('mouseleave', () => {
    hideTooltip();
  });
}

// Make functions available globally
window.initTooltips = initTooltips;
window.showTooltip = showTooltip;
window.hideTooltip = hideTooltip;
window.addTooltip = addTooltip;

