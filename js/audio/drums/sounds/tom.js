/**
 * Tom Drum Sound Generator
 * Generates tom drum sounds at different pitches (low, mid, high)
 */

import { getAudioContext } from '../../audioContext.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play tom drum sound
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 * @param {number} vol - The volume level
 * @param {number} baseFreq - The base frequency (80=low, 150=mid, 250=high)
 */
export function playTom(track, time, vol, baseFreq = 150) {
    const audioCtx = getAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.value = baseFreq * 3;

    osc.frequency.setValueAtTime(baseFreq, time);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, time + 0.3);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    connectTrackOutput(track, gain);

    osc.start(time);
    osc.stop(time + 0.3);
}

/**
 * Render tom drum sound in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {number} time - The time to render the sound
 * @param {number} vol - The volume level
 * @param {number} baseFreq - The base frequency (80=low, 150=mid, 250=high)
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderTom(ctx, track, time, vol, baseFreq, masterGain, reverbNode, delayNode) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.value = baseFreq * 3;

    const t = safeTime(time);
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, baseFreq * 0.5), safeTime(time + 0.3));

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + 0.3));

    osc.connect(filter);
    filter.connect(gain);
    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);

    osc.start(t);
    osc.stop(safeTime(time + 0.3));
}

