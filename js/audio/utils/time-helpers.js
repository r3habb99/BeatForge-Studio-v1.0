/**
 * Time Helpers Utility Module
 * Provides utility functions for safe time value handling in audio scheduling
 */

/**
 * Ensure safe time values for AudioParam scheduling
 * Prevents negative time values which can cause errors in Web Audio API
 * @param {number} t - The time value to make safe
 * @returns {number} The safe time value (minimum 0)
 */
export function safeTime(t) {
    return Math.max(0, t);
}

/**
 * Ensure safe duration values for audio scheduling
 * Prevents very small or negative duration values
 * @param {number} duration - The duration value to make safe
 * @param {number} [minDuration=0.001] - The minimum allowed duration
 * @returns {number} The safe duration value
 */
export function safeDuration(duration, minDuration = 0.001) {
    return Math.max(minDuration, duration);
}

