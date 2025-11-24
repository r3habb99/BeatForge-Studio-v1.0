/**
 * Shaker Sound Generator
 * Generates shaker sounds using multiple noise bursts
 */

import { getAudioContext } from '../../audioContext.js';
import { createNoiseBuffer, createOfflineNoiseBuffer } from '../../utils/noise-generator.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play shaker sound
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 * @param {number} vol - The volume level
 */
export function playShaker(track, time, vol) {
    const audioCtx = getAudioContext();
    const bursts = 3;
    const burstDuration = 0.02;
    const spacing = 0.015;

    for (let i = 0; i < bursts; i++) {
        const gain = audioCtx.createGain();
        const noise = audioCtx.createBufferSource();
        noise.buffer = createNoiseBuffer(burstDuration);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 6000;

        noise.connect(filter);
        filter.connect(gain);

        gain.gain.setValueAtTime(vol * 0.4, time + (i * spacing));
        gain.gain.exponentialRampToValueAtTime(0.01, time + (i * spacing) + burstDuration);

        connectTrackOutput(track, gain);
        noise.start(time + (i * spacing));
    }
}

/**
 * Render shaker sound in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {number} time - The time to render the sound
 * @param {number} vol - The volume level
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderShaker(ctx, track, time, vol, masterGain, reverbNode, delayNode) {
    const bursts = 3;
    const burstDuration = 0.02;
    const spacing = 0.015;

    for (let i = 0; i < bursts; i++) {
        const gain = ctx.createGain();
        const noise = ctx.createBufferSource();
        noise.buffer = createOfflineNoiseBuffer(ctx, burstDuration);

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 6000;

        noise.connect(filter);
        filter.connect(gain);

        const t = safeTime(time + (i * spacing));
        gain.gain.setValueAtTime(vol * 0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + (i * spacing) + burstDuration));

        connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
        noise.start(t);
    }
}

