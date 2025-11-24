/**
 * Noise Generator Utility Module
 * Provides functions for generating noise buffers for audio synthesis
 */

import { getAudioContext } from '../audioContext.js';

/**
 * Create a noise buffer for use in audio synthesis
 * @param {number} duration - Duration of the noise buffer in seconds
 * @returns {AudioBuffer} The generated noise buffer
 */
export function createNoiseBuffer(duration) {
    const audioCtx = getAudioContext();
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
}

/**
 * Create a noise buffer for offline audio context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {number} duration - Duration of the noise buffer in seconds
 * @returns {AudioBuffer} The generated noise buffer
 */
export function createOfflineNoiseBuffer(ctx, duration) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
}

