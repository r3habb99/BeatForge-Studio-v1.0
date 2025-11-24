/**
 * Frequency Converter Utility Module
 * Converts musical note names to frequencies
 */

import { NOTES } from '../../constants.js';

/**
 * Convert a note name (e.g., "C4", "A#3") to its frequency in Hz
 * @param {string} noteName - The note name including octave (e.g., "C4", "A#3")
 * @returns {number} The frequency in Hz
 */
export function getFreq(noteName) {
    const octave = parseInt(noteName.slice(-1));
    const key = noteName.slice(0, -1);
    const semitones = NOTES.indexOf(key);
    const a4 = 440;
    const n = semitones + ((octave - 4) * 12) - 9;
    return a4 * Math.pow(2, n / 12);
}

/**
 * Convert a note name to frequency (alias for offline rendering contexts)
 * @param {string} noteName - The note name including octave (e.g., "C4", "A#3")
 * @returns {number} The frequency in Hz
 */
export function getOfflineFreq(noteName) {
    return getFreq(noteName);
}

