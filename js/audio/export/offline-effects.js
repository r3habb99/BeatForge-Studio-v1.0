/**
 * Offline Effects Module
 * Sets up audio effects chain for offline rendering
 */

import { createOfflineImpulseResponse } from '../utils/impulse-response.js';

/**
 * Setup offline effects chain for rendering
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @returns {Object} Object containing masterGain, reverbNode, and delayNode
 */
export function setupOfflineEffects(ctx) {
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);

    // Reverb
    const reverbNode = ctx.createConvolver();
    reverbNode.buffer = createOfflineImpulseResponse(ctx, 2, 2);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 1;
    reverbNode.connect(reverbGain);
    reverbGain.connect(masterGain);

    // Delay
    const delayNode = ctx.createDelay(5.0);
    const delayFeedback = ctx.createGain();
    const delayGain = ctx.createGain();
    delayNode.delayTime.value = 0.3;
    delayFeedback.gain.value = 0.4;
    delayGain.gain.value = 1;
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(masterGain);

    return { masterGain, reverbNode, delayNode };
}

