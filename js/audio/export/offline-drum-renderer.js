/**
 * Offline Drum Renderer Module
 * Renders drum sounds in offline context for export
 */

import {
    renderKick,
    renderSnare,
    renderHiHat,
    renderClap,
    renderRimShot,
    renderCowbell,
    renderTom,
    renderCrash,
    renderRide,
    renderShaker,
    renderTambourine
} from '../drums/sounds/index.js';

/**
 * Render drum sound in offline context - main dispatcher
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {number} time - The time to render the sound
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function renderDrumSound(ctx, track, time, masterGain, reverbNode, delayNode) {
    const velocity = track.velocity || 1.0;
    const vol = track.vol * velocity;

    switch (track.sound) {
        case 'kick':
            renderKick(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
        case 'snare':
            renderSnare(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
        case 'hihat':
            renderHiHat(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
        case 'clap':
            renderClap(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
        case 'rimshot':
            renderRimShot(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
        case 'cowbell':
            renderCowbell(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
        case 'tom-low':
            renderTom(ctx, track, time, vol, 80, masterGain, reverbNode, delayNode);
            break;
        case 'tom-mid':
            renderTom(ctx, track, time, vol, 150, masterGain, reverbNode, delayNode);
            break;
        case 'tom-high':
            renderTom(ctx, track, time, vol, 250, masterGain, reverbNode, delayNode);
            break;
        case 'crash':
            renderCrash(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
        case 'ride':
            renderRide(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
        case 'shaker':
            renderShaker(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
        case 'tambourine':
            renderTambourine(ctx, track, time, vol, masterGain, reverbNode, delayNode);
            break;
    }
}
