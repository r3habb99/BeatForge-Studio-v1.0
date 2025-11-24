/**
 * Distortion Curve Generator Utility Module
 * Creates distortion curves for waveshaper effects
 */

/**
 * Create a distortion curve for waveshaper effect
 * @param {number} amount - The amount of distortion (0-100+)
 * @returns {Float32Array} The distortion curve
 */
export function makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1;
        curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
}

/**
 * Create a distortion curve for offline rendering context
 * @param {number} amount - The amount of distortion (0-100+)
 * @returns {Float32Array} The distortion curve
 */
export function makeOfflineDistortionCurve(amount) {
    return makeDistortionCurve(amount);
}

