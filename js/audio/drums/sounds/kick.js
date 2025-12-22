/**
 * Kick Drum Sound Generator
 * Generates kick drum sounds using oscillator synthesis
 * PERFORMANCE FIX: Added automatic audio node cleanup to prevent memory leaks
 */

import { getAudioContext } from '../../audioContext.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';
import { createCleanOscillator, createCleanGain } from '../../utils/nodeCleanup.js';

/**
 * Play kick drum sound
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 * @param {number} vol - The volume level
 */
export function playKick(track, time, vol) {
    const audioCtx = getAudioContext();
    const duration = 0.5;

    // PERFORMANCE FIX: Use cleanup-aware node creation
    const osc = createCleanOscillator(audioCtx, duration);
    const gain = createCleanGain(audioCtx, duration);

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + duration);
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.connect(gain);
    connectTrackOutput(track, gain);
    osc.start(time);
    osc.stop(time + duration);

    // Nodes will be automatically cleaned up via onended callback
}

/**
 * Render kick drum sound in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {number} time - The time to render the sound
 * @param {number} vol - The volume level
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderKick(ctx, track, time, vol, masterGain, reverbNode, delayNode) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(150, Math.max(0, time));
    osc.frequency.exponentialRampToValueAtTime(1, Math.max(0.001, time + 0.5));
    gain.gain.setValueAtTime(vol, Math.max(0, time));
    gain.gain.exponentialRampToValueAtTime(0.001, Math.max(0.001, time + 0.5));

    osc.connect(gain);
    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
    osc.start(Math.max(0, time));
    osc.stop(Math.max(0.001, time + 0.5));
}

