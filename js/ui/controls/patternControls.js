/**
 * Pattern Controls Module
 * Handles pattern selector controls
 */

import { switchPattern } from '../../state/stateManager.js';

/**
 * Setup pattern selector
 */
export function setupPatternSelector(renderUICallback) {
    const patternSelect = document.getElementById('patternSelect');
    if (patternSelect) {
        patternSelect.addEventListener('change', (e) => {
            switchPattern(parseInt(e.target.value));
            renderUICallback();
        });
    }
}

