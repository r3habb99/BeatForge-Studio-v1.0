/**
 * Tambourine Sound Generator
 * Generates tambourine sounds using filtered noise and metallic jingle
 */

import { getAudioContext } from '../../audioContext.js';
import { createNoiseBuffer, createOfflineNoiseBuffer } from '../../utils/noise-generator.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play tambourine sound
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 * @param {number} vol - The volume level
 */
export function playTambourine(track, time, vol) {
    const audioCtx = getAudioContext();
    const gain = audioCtx.createGain();
    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer(0.2);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 5000;
    filter.Q.value = 5;

    noise.connect(filter);
    filter.connect(gain);

    // Add metallic jingle
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 4000;
    const oscGain = audioCtx.createGain();
    oscGain.gain.value = 0.2;
    osc.connect(oscGain);
    oscGain.connect(gain);

    gain.gain.setValueAtTime(vol * 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    connectTrackOutput(track, gain);
    noise.start(time);
    osc.start(time);
    osc.stop(time + 0.2);
}

/**
 * Render tambourine sound in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {number} time - The time to render the sound
 * @param {number} vol - The volume level
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderTambourine(ctx, track, time, vol, masterGain, reverbNode, delayNode) {
    const gain = ctx.createGain();
    const noise = ctx.createBufferSource();
    noise.buffer = createOfflineNoiseBuffer(ctx, 0.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 5000;
    filter.Q.value = 5;

    noise.connect(filter);
    filter.connect(gain);

    // Add metallic jingle
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 4000;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.2;
    osc.connect(oscGain);
    oscGain.connect(gain);

    const t = safeTime(time);
    gain.gain.setValueAtTime(vol * 0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + 0.2));

    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
    noise.start(t);
    osc.start(t);
    osc.stop(safeTime(time + 0.2));
}

