/**
 * Scroll Synchronization Module
 * Synchronizes vertical scrolling between track headers and sequencer panels
 */

let isScrolling = false;

/**
 * Initialize scroll synchronization between track headers and sequencer
 */
function initScrollSync() {
    const trackHeadersPanel = document.getElementById('trackHeaders');
    const sequencerPanel = document.getElementById('sequencerArea');

    if (!trackHeadersPanel || !sequencerPanel) {
        console.warn('Scroll sync: Required elements not found');
        return;
    }

    // Sync sequencer scroll to track headers
    sequencerPanel.addEventListener('scroll', () => {
        if (isScrolling) return;
        
        isScrolling = true;
        
        // Synchronize vertical scroll position
        trackHeadersPanel.scrollTop = sequencerPanel.scrollTop;
        
        // Use requestAnimationFrame to reset the flag
        requestAnimationFrame(() => {
            isScrolling = false;
        });
    });

    // Note: We don't need to sync from trackHeaders to sequencer
    // because trackHeaders no longer has its own scrollbar
    // It will be scrolled programmatically by the sequencer scroll event
}

export { initScrollSync };

