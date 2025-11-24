/**
 * Event Handlers Module
 * Orchestrates all UI event listeners and controls
 * This module now delegates to specialized control modules
 */

import { setupPlaybackControls, updatePlayButtonUI } from './controls/playbackControls.js';
import { setupRecordingControls } from './controls/recordingControls.js';
import { setupEffectsControls } from './controls/effectsControls.js';
import { setupKeyboardShortcuts, showShortcuts, closeShortcuts, setupShortcutsButton } from './controls/keyboardShortcuts.js';
import { setupPatternSelector } from './controls/patternControls.js';

/**
 * Setup all event listeners
 * Delegates to specialized control modules for better organization
 */
function setupEventListeners(initializeAppCallback, renderUICallback) {
    // Setup playback controls (play, stop, BPM)
    setupPlaybackControls(initializeAppCallback);

    // Setup recording controls
    setupRecordingControls();

    // Setup effects controls (master volume, reverb, delay)
    setupEffectsControls();

    // Setup keyboard shortcuts
    setupShortcutsButton();
    setupKeyboardShortcuts(renderUICallback);

    // Setup pattern selector
    setupPatternSelector(renderUICallback);
}

export {
    setupEventListeners,
    updatePlayButtonUI,
    showShortcuts,
    closeShortcuts
};

