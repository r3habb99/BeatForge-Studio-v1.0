/**
 * Hi-Hat Sound Generator
 * Generates hi-hat sounds using filtered noise
 */

import { getAudioContext } from '../../audioContext.js';
import { createNoiseBuffer, createOfflineNoiseBuffer } from '../../utils/noise-generator.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play hi-hat sound
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 * @param {number} vol - The volume level
 */
export function playHiHat(track, time, vol) {
    const audioCtx = getAudioContext();
    const gain = audioCtx.createGain();
    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer(0.1);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5000;

    noise.connect(filter);
    filter.connect(gain);

    gain.gain.setValueAtTime(vol * 0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    connectTrackOutput(track, gain);
    noise.start(time);
}

/**
 * Render hi-hat sound in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {number} time - The time to render the sound
 * @param {number} vol - The volume level
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderHiHat(ctx, track, time, vol, masterGain, reverbNode, delayNode) {
    const gain = ctx.createGain();
    const noise = ctx.createBufferSource();
    noise.buffer = createOfflineNoiseBuffer(ctx, 0.1);

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5000;

    noise.connect(filter);
    filter.connect(gain);

    const t = safeTime(time);
    gain.gain.setValueAtTime(vol * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + 0.05));

    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
    noise.start(t);
}

