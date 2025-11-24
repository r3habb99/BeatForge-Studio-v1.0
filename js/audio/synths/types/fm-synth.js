/**
 * FM Synthesizer
 * Generates sounds using frequency modulation synthesis
 */

import { getAudioContext } from '../../audioContext.js';
import { getFreq } from '../../utils/frequency-converter.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play FM synth sound
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information (note, len, velocity)
 * @param {number} time - The time to play the sound
 * @param {number} duration - The duration of the note
 * @param {number} vol - The volume level
 */
export function playFMSynth(track, noteInfo, time, duration, vol) {
    const audioCtx = getAudioContext();
    const carrier = audioCtx.createOscillator();
    const modulator = audioCtx.createOscillator();
    const modulatorGain = audioCtx.createGain();
    const gain = audioCtx.createGain();

    const baseFreq = getFreq(noteInfo.note);
    carrier.frequency.value = baseFreq;
    modulator.frequency.value = baseFreq * 2; // Modulator at 2x carrier frequency
    modulatorGain.gain.value = baseFreq * 3; // Modulation index

    modulator.connect(modulatorGain);
    modulatorGain.connect(carrier.frequency);
    carrier.connect(gain);

    // Envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.01);
    gain.gain.setValueAtTime(vol, time + duration - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    connectTrackOutput(track, gain);

    carrier.start(time);
    modulator.start(time);
    carrier.stop(time + duration);
    modulator.stop(time + duration);
}

/**
 * Render FM synth sound in offline context
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
export function renderFMSynth(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode) {
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modulatorGain = ctx.createGain();
    const gain = ctx.createGain();

    const baseFreq = getFreq(noteInfo.note);
    carrier.frequency.value = baseFreq;
    modulator.frequency.value = baseFreq * 2;
    modulatorGain.gain.value = baseFreq * 3;

    modulator.connect(modulatorGain);
    modulatorGain.connect(carrier.frequency);
    carrier.connect(gain);

    const t = safeTime(time);
    const safeDur = Math.max(0.1, duration);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, safeTime(time + 0.01));
    gain.gain.setValueAtTime(vol, safeTime(time + safeDur - 0.05));
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + safeDur));

    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);

    carrier.start(t);
    modulator.start(t);
    carrier.stop(safeTime(time + safeDur));
    modulator.stop(safeTime(time + safeDur));
}

