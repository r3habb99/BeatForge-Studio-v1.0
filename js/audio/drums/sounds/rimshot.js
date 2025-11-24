/**
 * Rimshot Sound Generator
 * Generates rimshot sounds using dual oscillators
 */

import { getAudioContext } from '../../audioContext.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play rimshot sound
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 * @param {number} vol - The volume level
 */
export function playRimShot(track, time, vol) {
    const audioCtx = getAudioContext();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.value = 400;
    osc2.frequency.value = 1200;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);

    gain.gain.setValueAtTime(vol * 0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.03);

    connectTrackOutput(track, gain);
    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.03);
    osc2.stop(time + 0.03);
}

/**
 * Render rimshot sound in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {number} time - The time to render the sound
 * @param {number} vol - The volume level
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderRimShot(ctx, track, time, vol, masterGain, reverbNode, delayNode) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.value = 400;
    osc2.frequency.value = 1200;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);

    const t = safeTime(time);
    gain.gain.setValueAtTime(vol * 0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + 0.03));

    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
    osc1.start(t);
    osc2.start(t);
    osc1.stop(safeTime(time + 0.03));
    osc2.stop(safeTime(time + 0.03));
}

