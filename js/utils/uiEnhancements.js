/**
 * UI Enhancements Initialization
 * Initializes all modern UI improvements
 */

import { initTheme } from './theme.js';
import { initTooltips } from './tooltip.js';
import { initShortcutsOverlay } from './shortcutsOverlay.js';
import { initTrackColors } from './trackColors.js';

/**
 * Initialize all UI enhancements
 */
export function initUIEnhancements() {
  console.log('🎨 Initializing UI enhancements...');
  
  // Initialize theme system
  try {
    initTheme();
    console.log('✅ Theme system initialized');
  } catch (error) {
    console.error('❌ Theme initialization failed:', error);
  }
  
  // Initialize tooltips
  try {
    initTooltips();
    console.log('✅ Tooltips initialized');
  } catch (error) {
    console.error('❌ Tooltips initialization failed:', error);
  }
  
  // Initialize shortcuts overlay
  try {
    initShortcutsOverlay();
    console.log('✅ Shortcuts overlay initialized');
  } catch (error) {
    console.error('❌ Shortcuts overlay initialization failed:', error);
  }
  
  // Initialize track colors
  try {
    initTrackColors();
    console.log('✅ Track colors initialized');
  } catch (error) {
    console.error('❌ Track colors initialization failed:', error);
  }
  
  console.log('🎉 UI enhancements ready!');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUIEnhancements);
} else {
  initUIEnhancements();
}

export default initUIEnhancements;

