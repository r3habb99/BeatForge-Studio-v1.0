/**
 * Offline Synth Renderer Module
 * Renders synthesizer sounds in offline context for export
 */

import {
    renderBasicSynth,
    renderPadSynth,
    renderPluckSynth,
    renderOrgan,
    renderFMSynth,
    renderSubBass,
    renderAcidBass,
    renderReeseBass
} from '../synths/types/index.js';

/**
 * Render synth sound in offline context - main dispatcher
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information (note, len, velocity)
 * @param {number} time - The time to render the sound
 * @param {number} duration - The duration of the note
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderSynthSound(ctx, track, noteInfo, time, duration, masterGain, reverbNode, delayNode) {
    const velocity = noteInfo.velocity || 1.0;
    const vol = track.vol * velocity;

    switch (track.synthType) {
        case 'basic':
            renderBasicSynth(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode);
            break;
        case 'pad':
            renderPadSynth(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode);
            break;
        case 'pluck':
            renderPluckSynth(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode);
            break;
        case 'organ':
            renderOrgan(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode);
            break;
        case 'fm':
            renderFMSynth(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode);
            break;
        case 'sub-bass':
            renderSubBass(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode);
            break;
        case 'acid-bass':
            renderAcidBass(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode);
            break;
        case 'reese-bass':
            renderReeseBass(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode);
            break;
        default:
            renderBasicSynth(ctx, track, noteInfo, time, duration, vol, masterGain, reverbNode, delayNode);
    }
}
