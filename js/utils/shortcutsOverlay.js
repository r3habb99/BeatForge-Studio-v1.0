/**
 * Keyboard Shortcuts Overlay
 * Persistent, toggleable shortcuts reference panel
 */

const SHORTCUTS_OVERLAY_STATE_KEY = 'beatforge-shortcuts-overlay-state';

/**
 * Initialize shortcuts overlay
 */
export function initShortcutsOverlay() {
  const overlay = document.getElementById('shortcutsOverlay');
  const toggleBtn = document.getElementById('toggleShortcutsOverlay');
  const header = overlay?.querySelector('.shortcuts-overlay-header');
  
  if (!overlay || !toggleBtn || !header) return;
  
  // Load saved state
  const savedState = localStorage.getItem(SHORTCUTS_OVERLAY_STATE_KEY);
  if (savedState === 'visible') {
    overlay.classList.remove('hidden');
  } else if (savedState === 'collapsed') {
    overlay.classList.remove('hidden');
    overlay.classList.add('collapsed');
  }
  
  // Toggle collapse on header click
  header.addEventListener('click', () => {
    overlay.classList.toggle('collapsed');
    saveState(overlay);
  });
  
  // Show overlay on first visit or when ? is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      showOverlay();
    }
  });
  
  // Auto-show on first visit
  if (!savedState) {
    setTimeout(() => {
      showOverlay();
      if (window.toast) {
        window.toast.info('Keyboard Shortcuts', 'Press ? anytime to toggle shortcuts panel');
      }
    }, 2000);
  }
}

/**
 * Show shortcuts overlay
 */
export function showOverlay() {
  const overlay = document.getElementById('shortcutsOverlay');
  if (!overlay) return;
  
  overlay.classList.remove('hidden');
  overlay.classList.remove('collapsed');
  saveState(overlay);
}

/**
 * Hide shortcuts overlay
 */
export function hideOverlay() {
  const overlay = document.getElementById('shortcutsOverlay');
  if (!overlay) return;
  
  overlay.classList.add('hidden');
  saveState(overlay);
}

/**
 * Toggle shortcuts overlay
 */
export function toggleOverlay() {
  const overlay = document.getElementById('shortcutsOverlay');
  if (!overlay) return;
  
  if (overlay.classList.contains('hidden')) {
    showOverlay();
  } else {
    hideOverlay();
  }
}

/**
 * Save overlay state to localStorage
 */
function saveState(overlay) {
  let state = 'hidden';
  
  if (!overlay.classList.contains('hidden')) {
    state = overlay.classList.contains('collapsed') ? 'collapsed' : 'visible';
  }
  
  localStorage.setItem(SHORTCUTS_OVERLAY_STATE_KEY, state);
}

// Make functions available globally
window.initShortcutsOverlay = initShortcutsOverlay;
window.showShortcutsOverlay = showOverlay;
window.hideShortcutsOverlay = hideOverlay;
window.toggleShortcutsOverlay = toggleOverlay;

