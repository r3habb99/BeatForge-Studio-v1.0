/**
 * Audio Effects Module
 * Handles reverb, delay, and distortion effects
 */

import { getAudioContext, getMasterGain, getAnalyser } from './audioContext.js';
import { createImpulseResponse } from './utils/impulse-response.js';

let reverbNode, reverbGain;
let delayNode, delayFeedback, delayGain;

/**
 * Setup reverb and delay effects
 */
function setupEffects() {
    const audioCtx = getAudioContext();
    const masterGain = getMasterGain();
    
    if (!audioCtx || !masterGain) {
        throw new Error('Audio context not initialized');
    }

    try {
        // Reverb (Convolution)
        reverbNode = audioCtx.createConvolver();
        reverbNode.buffer = createImpulseResponse(2, 2, false);
        reverbGain = audioCtx.createGain();
        reverbGain.gain.value = 1;
        reverbNode.connect(reverbGain);
        reverbGain.connect(masterGain);

        // Delay
        delayNode = audioCtx.createDelay(5.0);
        delayFeedback = audioCtx.createGain();
        delayGain = audioCtx.createGain();

        delayNode.delayTime.value = 0.3;
        delayFeedback.gain.value = 0.4;
        delayGain.gain.value = 1;

        delayNode.connect(delayFeedback);
        delayFeedback.connect(delayNode);
        delayNode.connect(delayGain);
        delayGain.connect(masterGain);

        // Connect the analyser from audioContext to the audio chain
        const analyser = getAnalyser();
        if (analyser) {
            masterGain.connect(analyser);
            analyser.connect(audioCtx.destination);
        } else {
            // Fallback: connect master directly to destination
            masterGain.connect(audioCtx.destination);
        }
    } catch (error) {
        console.error('Failed to setup effects:', error);
        throw new Error('Could not initialize audio effects');
    }
}



/**
 * Get reverb node
 */
function getReverbNode() {
    return reverbNode;
}

/**
 * Get delay node
 */
function getDelayNode() {
    return delayNode;
}

/**
 * Update reverb decay time
 */
function updateReverbTime(value) {
    if (reverbNode) {
        reverbNode.buffer = createImpulseResponse(parseFloat(value), 2, false);
    }
}

/**
 * Update delay time
 */
function updateDelayTime(value) {
    const audioCtx = getAudioContext();
    if (delayNode && audioCtx) {
        delayNode.delayTime.linearRampToValueAtTime(parseFloat(value), audioCtx.currentTime + 0.1);
    }
}

/**
 * Update delay feedback
 */
function updateDelayFeedback(value) {
    if (delayFeedback) {
        delayFeedback.gain.value = parseFloat(value);
    }
}

export {
    setupEffects,
    getReverbNode,
    getDelayNode,
    updateReverbTime,
    updateDelayTime,
    updateDelayFeedback
};

// Re-export distortion curve utility for backward compatibility
export { makeDistortionCurve } from './utils/distortion-curve.js';

