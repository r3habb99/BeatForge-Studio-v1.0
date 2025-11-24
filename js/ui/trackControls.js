/**
 * Track Controls Module
 * Handles track parameter updates and control functions
 */

import { getTracks, saveState } from '../state/stateManager.js';

/**
 * Toggle step on/off
 */
export function toggleStep(trackId, step) {
    const track = getTracks().find(t => t.id === trackId);
    track.steps[step] = !track.steps[step];
    saveState();
}

/**
 * Update track parameter
 */
export function updateTrackParam(id, param, value) {
    const track = getTracks().find(t => t.id === id);
    track[param] = parseFloat(value);
}

/**
 * Toggle mute
 */
export function toggleMute(id) {
    const track = getTracks().find(t => t.id === id);
    track.mute = !track.mute;
}

/**
 * Toggle solo
 */
export function toggleSolo(id) {
    const track = getTracks().find(t => t.id === id);
    track.solo = !track.solo;
}

