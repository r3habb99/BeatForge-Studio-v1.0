/**
 * Toast Notification System
 * Displays beautiful toast notifications with glassmorphism effects
 */

let toastCounter = 0;

const TOAST_ICONS = {
  success: '<i class="fas fa-check-circle"></i>',
  error: '<i class="fas fa-exclamation-circle"></i>',
  warning: '<i class="fas fa-exclamation-triangle"></i>',
  info: '<i class="fas fa-info-circle"></i>',
};

/**
 * Show a toast notification
 * @param {string} title - Toast title
 * @param {string} message - Toast message (optional)
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 4000)
 */
export function showToast(title, message = '', type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) {
    console.error('Toast container not found');
    return;
  }

  const toastId = `toast-${++toastCounter}`;
  const icon = TOAST_ICONS[type] || TOAST_ICONS.info;

  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      ${message ? `<div class="toast-message">${escapeHtml(message)}</div>` : ''}
    </div>
    <button class="toast-close" aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
  `;

  // Add close button handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toastId));

  // Add to container
  container.appendChild(toast);

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => removeToast(toastId), duration);
  }

  return toastId;
}

/**
 * Remove a toast notification
 * @param {string} toastId - Toast element ID
 */
function removeToast(toastId) {
  const toast = document.getElementById(toastId);
  if (!toast) return;

  toast.classList.add('toast-exit');
  
  // Remove from DOM after animation
  setTimeout(() => {
    toast.remove();
  }, 300);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Convenience methods for different toast types
 */
export const toast = {
  success: (title, message, duration) => showToast(title, message, 'success', duration),
  error: (title, message, duration) => showToast(title, message, 'error', duration),
  warning: (title, message, duration) => showToast(title, message, 'warning', duration),
  info: (title, message, duration) => showToast(title, message, 'info', duration),
};

// Make toast available globally for inline onclick handlers
window.showToast = showToast;
window.toast = toast;

