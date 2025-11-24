/**
 * Acid Bass Synthesizer
 * Generates acid bass sounds with resonant filter sweep (TB-303 style)
 */

import { getAudioContext } from '../../audioContext.js';
import { getFreq } from '../../utils/frequency-converter.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play acid bass sound
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information (note, len, velocity)
 * @param {number} time - The time to play the sound
 * @param {number} duration - The duration of the note
 * @param {number} vol - The volume level
 */
export function playAcidBass(track, noteInfo, time, duration, vol) {
    const audioCtx = getAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = getFreq(noteInfo.note);

    filter.type = 'lowpass';
    filter.Q.value = 15; // High resonance for acid sound

    const cutoffStart = track.cutoff || 500;
    const cutoffPeak = Math.min(cutoffStart * 4, 5000);

    // Filter envelope - fast sweep up then down
    filter.frequency.setValueAtTime(cutoffStart, time);
    filter.frequency.exponentialRampToValueAtTime(cutoffPeak, time + 0.05);
    filter.frequency.exponentialRampToValueAtTime(cutoffStart, time + duration);

    // Amplitude envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.01);
    gain.gain.setValueAtTime(vol, time + duration - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    connectTrackOutput(track, gain);

    osc.start(time);
    osc.stop(time + duration);
}

/**
 * Render acid bass sound in offline context
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
export function renderAcidBass(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = getFreq(noteInfo.note);

    filter.type = 'lowpass';
    filter.Q.value = 15;

    const t = safeTime(time);
    const safeDur = Math.max(0.1, duration);
    const cutoffStart = track.cutoff || 500;
    const cutoffPeak = Math.min(cutoffStart * 4, 5000);

    filter.frequency.setValueAtTime(cutoffStart, t);
    filter.frequency.exponentialRampToValueAtTime(cutoffPeak, safeTime(time + 0.05));
    filter.frequency.exponentialRampToValueAtTime(Math.max(100, cutoffStart), safeTime(time + safeDur));

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, safeTime(time + 0.01));
    gain.gain.setValueAtTime(vol, safeTime(time + safeDur - 0.05));
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + safeDur));

    osc.connect(filter);
    filter.connect(gain);
    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);

    osc.start(t);
    osc.stop(safeTime(time + safeDur));
}

