/**
 * Pad Synthesizer
 * Soft, atmospheric synth with slow attack and multiple detuned oscillators
 */

import { getAudioContext } from '../../audioContext.js';
import { getFreq } from '../../utils/frequency-converter.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play pad synth sound
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information (note, len, velocity)
 * @param {number} time - The time to play the sound
 * @param {number} duration - The duration of the note
 * @param {number} vol - The volume level
 */
export function playPadSynth(track, noteInfo, time, duration, vol) {
    const audioCtx = getAudioContext();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = track.cutoff || 1500;
    filter.Q.value = 2;

    // Multiple detuned oscillators for richness
    const detune = [-7, 0, 7];
    detune.forEach(d => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = getFreq(noteInfo.note);
        osc.detune.value = d;
        osc.connect(filter);
        osc.start(time);
        osc.stop(time + duration);
    });

    filter.connect(gain);

    // Adaptive envelope based on note duration
    // Attack time scales with duration but caps at 0.3s
    const attackTime = Math.min(0.3, duration * 0.2);
    // Release time scales with duration but caps at 0.5s
    const releaseTime = Math.min(0.5, duration * 0.3);
    // Ensure sustain point is after attack
    const sustainStart = time + attackTime;
    const sustainEnd = Math.max(sustainStart, time + duration - releaseTime);

    // Slow attack, sustained, slow release
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol * 0.4, sustainStart);
    gain.gain.setValueAtTime(vol * 0.4, sustainEnd);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    connectTrackOutput(track, gain);
}

/**
 * Render pad synth sound in offline context
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
export function renderPadSynth(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode) {
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.value = track.cutoff || 1500;
    filter.Q.value = 2;

    const t = safeTime(time);
    const safeDur = Math.max(0.6, duration);

    // Adaptive envelope based on note duration
    const attackTime = Math.min(0.3, safeDur * 0.2);
    const releaseTime = Math.min(0.5, safeDur * 0.3);
    const sustainStart = safeTime(time + attackTime);
    const sustainEnd = Math.max(sustainStart, safeTime(time + safeDur - releaseTime));

    const detune = [-7, 0, 7];
    detune.forEach(d => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = getFreq(noteInfo.note);
        osc.detune.value = d;
        osc.connect(filter);
        osc.start(t);
        osc.stop(safeTime(time + safeDur));
    });

    filter.connect(gain);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol * 0.4, sustainStart);
    gain.gain.setValueAtTime(vol * 0.4, sustainEnd);
    gain.gain.exponentialRampToValueAtTime(0.001, safeTime(time + safeDur));

    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
}

