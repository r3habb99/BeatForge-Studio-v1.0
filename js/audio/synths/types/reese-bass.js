/**
 * Reese Bass Synthesizer
 * Generates thick, detuned bass sounds using multiple sawtooth oscillators
 */

import { getAudioContext } from '../../audioContext.js';
import { getFreq } from '../../utils/frequency-converter.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play Reese bass sound
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information (note, len, velocity)
 * @param {number} time - The time to play the sound
 * @param {number} duration - The duration of the note
 * @param {number} vol - The volume level
 */
export function playReeseBass(track, noteInfo, time, duration, vol) {
    const audioCtx = getAudioContext();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = track.cutoff || 800;
    filter.Q.value = 5;

    const baseFreq = getFreq(noteInfo.note);
    // Multiple detuned oscillators for thick sound
    const detune = [-10, -5, 0, 5, 10];

    detune.forEach(d => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = baseFreq;
        osc.detune.value = d;
        osc.connect(filter);
        osc.start(time);
        osc.stop(time + duration);
    });

    filter.connect(gain);

    // Envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol * 0.3, time + 0.02); // Lower volume due to multiple oscs
    gain.gain.setValueAtTime(vol * 0.3, time + duration - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    connectTrackOutput(track, gain);
}

/**
 * Render Reese bass sound in offline context
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
export function renderReeseBass(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode) {
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = track.cutoff || 800;
    filter.Q.value = 5;

    const baseFreq = getFreq(noteInfo.note);
    const detune = [-10, -5, 0, 5, 10];

    detune.forEach(d => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = baseFreq;
        osc.detune.value = d;
        osc.connect(filter);

        const t = safeTime(time);
        const safeDur = Math.max(0.1, duration);
        osc.start(t);
        osc.stop(safeTime(time + safeDur));
    });

    filter.connect(gain);

    const t = safeTime(time);
    const safeDur = Math.max(0.1, duration);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol * 0.3, safeTime(time + 0.02));
    gain.gain.setValueAtTime(vol * 0.3, safeTime(time + safeDur - 0.05));
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + safeDur));

    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
}

