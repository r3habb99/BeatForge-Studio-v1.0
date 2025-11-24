/**
 * Organ Synthesizer
 * Generates organ sounds using additive synthesis with multiple harmonics
 */

import { getAudioContext } from '../../audioContext.js';
import { getFreq } from '../../utils/frequency-converter.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';
import { safeTime } from '../../utils/time-helpers.js';

/**
 * Play organ sound
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information (note, len, velocity)
 * @param {number} time - The time to play the sound
 * @param {number} duration - The duration of the note
 * @param {number} vol - The volume level
 */
export function playOrgan(track, noteInfo, time, duration, vol) {
    const audioCtx = getAudioContext();
    const gain = audioCtx.createGain();
    
    // Organ drawbar harmonics (1, 2, 3, 4, 6, 8)
    const harmonics = [1, 2, 3, 4, 6, 8];
    const levels = [1.0, 0.5, 0.25, 0.125, 0.0625, 0.03125];

    const baseFreq = getFreq(noteInfo.note);

    harmonics.forEach((harmonic, i) => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = baseFreq * harmonic;
        const oscGain = audioCtx.createGain();
        oscGain.gain.value = levels[i];
        osc.connect(oscGain);
        oscGain.connect(gain);
        osc.start(time);
        osc.stop(time + duration);
    });

    // Slow attack and release for organ character
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol * 0.5, time + 0.02);
    gain.gain.setValueAtTime(vol * 0.5, time + duration - 0.02);
    gain.gain.linearRampToValueAtTime(0, time + duration);

    connectTrackOutput(track, gain);
}

/**
 * Render organ sound in offline context
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
export function renderOrgan(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode) {
    const gain = ctx.createGain();
    const harmonics = [1, 2, 3, 4, 6, 8];
    const levels = [1.0, 0.5, 0.25, 0.125, 0.0625, 0.03125];

    const baseFreq = getFreq(noteInfo.note);

    harmonics.forEach((harmonic, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = baseFreq * harmonic;
        const oscGain = ctx.createGain();
        oscGain.gain.value = levels[i];
        osc.connect(oscGain);
        oscGain.connect(gain);

        const t = safeTime(time);
        const safeDur = Math.max(0.1, duration);
        osc.start(t);
        osc.stop(safeTime(time + safeDur));
    });

    const t = safeTime(time);
    const safeDur = Math.max(0.1, duration);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol * 0.5, safeTime(time + 0.02));
    gain.gain.setValueAtTime(vol * 0.5, safeTime(time + safeDur - 0.02));
    gain.gain.linearRampToValueAtTime(0, safeTime(time + safeDur));

    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
}

