/**
 * Clap Sound Generator
 * Generates hand clap sounds using filtered noise with multiple delays
 */

import { getAudioContext } from '../../audioContext.js';
import { createNoiseBuffer, createOfflineNoiseBuffer } from '../../utils/noise-generator.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play clap sound
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 * @param {number} vol - The volume level
 */
export function playClap(track, time, vol) {
    const audioCtx = getAudioContext();
    const delays = [0, 0.01, 0.02, 0.03];

    delays.forEach(delay => {
        const gain = audioCtx.createGain();
        const noise = audioCtx.createBufferSource();
        noise.buffer = createNoiseBuffer(0.05);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 2;

        noise.connect(filter);
        filter.connect(gain);

        gain.gain.setValueAtTime(vol * 0.7, time + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, time + delay + 0.05);

        connectTrackOutput(track, gain);
        noise.start(time + delay);
    });
}

/**
 * Render clap sound in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {number} time - The time to render the sound
 * @param {number} vol - The volume level
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderClap(ctx, track, time, vol, masterGain, reverbNode, delayNode) {
    const delays = [0, 0.01, 0.02, 0.03];

    delays.forEach(delay => {
        const gain = ctx.createGain();
        const noise = ctx.createBufferSource();
        noise.buffer = createOfflineNoiseBuffer(ctx, 0.05);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 2;

        noise.connect(filter);
        filter.connect(gain);

        const t = safeTime(time + delay);
        gain.gain.setValueAtTime(vol * 0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + delay + 0.05));

        connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
        noise.start(t);
    });
}

