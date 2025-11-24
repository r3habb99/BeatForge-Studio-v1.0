/**
 * Pluck Synthesizer
 * Generates plucked string sounds with fast filter envelope
 */

import { getAudioContext } from '../../audioContext.js';
import { getFreq } from '../../utils/frequency-converter.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play pluck synth sound
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information (note, len, velocity)
 * @param {number} time - The time to play the sound
 * @param {number} duration - The duration of the note
 * @param {number} vol - The volume level
 */
export function playPluckSynth(track, noteInfo, time, duration, vol) {
    const audioCtx = getAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = getFreq(noteInfo.note);

    filter.type = 'lowpass';
    filter.frequency.value = track.cutoff || 3000;
    filter.Q.value = 10;

    // Fast decay envelope
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    // Filter envelope - fast sweep down
    filter.frequency.setValueAtTime(track.cutoff || 3000, time);
    filter.frequency.exponentialRampToValueAtTime((track.cutoff || 3000) * 0.1, time + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    connectTrackOutput(track, gain);

    osc.start(time);
    osc.stop(time + duration);
}

/**
 * Render pluck synth sound in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information
 * @param {number} time - The time to render the sound
 * @param {number} duration - The duration of the note
 * @param {number} vol - The volume level
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderPluckSynth(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = getFreq(noteInfo.note);

    filter.type = 'lowpass';
    filter.frequency.value = track.cutoff || 3000;
    filter.Q.value = 10;

    const t = safeTime(time);
    const safeDur = Math.max(0.1, duration);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + safeDur));

    filter.frequency.setValueAtTime(track.cutoff || 3000, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(100, (track.cutoff || 3000) * 0.1), safeTime(time + 0.1));

    osc.connect(filter);
    filter.connect(gain);
    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);

    osc.start(t);
    osc.stop(safeTime(time + safeDur));
}

