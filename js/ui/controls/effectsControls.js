/**
 * Effects Controls Module
 * Handles master volume and effects parameter controls
 */

import {
    updateMasterVolume,
    updateReverbTime,
    updateDelayTime,
    updateDelayFeedback
} from '../../audio/audioEngine.js';

/**
 * Setup master volume control
 */
export function setupMasterVolumeControl() {
    document.getElementById('masterVol').addEventListener('input', (e) => {
        try {
            updateMasterVolume(e.target.value);
        } catch (error) {
            console.error('Failed to set master volume:', error);
        }
    });
}

/**
 * Setup reverb time control
 */
export function setupReverbControl() {
    document.getElementById('reverbTime').addEventListener('input', (e) => {
        updateReverbTime(e.target.value);
    });
}

/**
 * Setup delay time control
 */
export function setupDelayTimeControl() {
    document.getElementById('delayTime').addEventListener('input', (e) => {
        updateDelayTime(e.target.value);
    });
}

/**
 * Setup delay feedback control
 */
export function setupDelayFeedbackControl() {
    document.getElementById('delayFeedback').addEventListener('input', (e) => {
        updateDelayFeedback(e.target.value);
    });
}

/**
 * Setup all effects controls
 */
export function setupEffectsControls() {
    setupMasterVolumeControl();
    setupReverbControl();
    setupDelayTimeControl();
    setupDelayFeedbackControl();
}

