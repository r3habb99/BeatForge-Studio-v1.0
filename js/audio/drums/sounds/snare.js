/**
 * Snare Drum Sound Generator
 * Generates snare drum sounds using noise and oscillator synthesis
 */

import { getAudioContext } from '../../audioContext.js';
import { createNoiseBuffer, createOfflineNoiseBuffer } from '../../utils/noise-generator.js';
import { connectTrackOutput } from '../../routing.js';
import { connectOfflineTrackOutput } from '../../export/offline-routing.js';

/**
 * Play snare drum sound
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 * @param {number} vol - The volume level
 */
export function playSnare(track, time, vol) {
    const audioCtx = getAudioContext();
    const gain = audioCtx.createGain();

    // Noise component
    const noise = audioCtx.createBufferSource();
    noise.buffer = createNoiseBuffer(0.2);
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    noise.start(time);

    // Tone component
    const tone = audioCtx.createOscillator();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(200, time);
    const toneGain = audioCtx.createGain();
    toneGain.gain.setValueAtTime(vol * 0.5, time);
    toneGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    tone.connect(toneGain);
    connectTrackOutput(track, toneGain);
    tone.start(time);
    tone.stop(time + 0.2);

    connectTrackOutput(track, gain);
}

/**
 * Render snare drum sound in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {number} time - The time to render the sound
 * @param {number} vol - The volume level
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderSnare(ctx, track, time, vol, masterGain, reverbNode, delayNode) {
    const gain = ctx.createGain();
    const safeTime = Math.max(0, time);

    // Noise component
    const noise = ctx.createBufferSource();
    noise.buffer = createOfflineNoiseBuffer(ctx, 0.2);
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);

    gain.gain.setValueAtTime(vol, safeTime);
    gain.gain.exponentialRampToValueAtTime(0.001, Math.max(0.001, time + 0.2));
    noise.start(safeTime);

    // Tone component
    const tone = ctx.createOscillator();
    tone.type = 'triangle';
    tone.frequency.setValueAtTime(200, safeTime);
    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(vol * 0.5, safeTime);
    toneGain.gain.exponentialRampToValueAtTime(0.001, Math.max(0.001, time + 0.1));
    tone.connect(toneGain);
    connectOfflineTrackOutput(ctx, track, toneGain, masterGain, reverbNode, delayNode);
    tone.start(safeTime);
    tone.stop(Math.max(0.001, time + 0.2));

    connectOfflineTrackOutput(ctx, track, gain, masterGain, reverbNode, delayNode);
}

