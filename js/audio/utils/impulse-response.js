/**
 * Impulse Response Generator Utility Module
 * Creates impulse responses for reverb effects
 */

import { getAudioContext } from '../audioContext.js';

/**
 * Create a procedural reverb impulse response
 * @param {number} duration - Duration of the impulse response in seconds
 * @param {number} decay - Decay factor for the reverb tail
 * @param {boolean} reverse - Whether to reverse the impulse response
 * @returns {AudioBuffer} The generated impulse response buffer
 */
export function createImpulseResponse(duration, decay, reverse) {
    const audioCtx = getAudioContext();
    const sampleRate = audioCtx.sampleRate;
    const length = sampleRate * duration;
    const impulse = audioCtx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
        let n = reverse ? length - i : i;
        left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    
    return impulse;
}

/**
 * Create impulse response for offline audio context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {number} duration - Duration of the impulse response in seconds
 * @param {number} decay - Decay factor for the reverb tail
 * @returns {AudioBuffer} The generated impulse response buffer
 */
export function createOfflineImpulseResponse(ctx, duration, decay) {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
        left[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        right[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    
    return impulse;
}

