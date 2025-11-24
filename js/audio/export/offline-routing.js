/**
 * Offline Routing Module
 * Handles track output routing for offline rendering
 */

import { makeOfflineDistortionCurve } from '../utils/distortion-curve.js';

/**
 * Connect track output to master and effects in offline context
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {Object} track - The track configuration
 * @param {AudioNode} sourceNode - The source audio node
 * @param {GainNode} masterGain - The master gain node
 * @param {ConvolverNode} reverbNode - The reverb node
 * @param {DelayNode} delayNode - The delay node
 */
export function connectOfflineTrackOutput(ctx, track, sourceNode, masterGain, reverbNode, delayNode) {
    let outputNode = sourceNode;

    // Distortion
    if (track.distortion && track.distortion > 0) {
        const distortion = ctx.createWaveShaper();
        distortion.curve = makeOfflineDistortionCurve(track.distortion * 100);
        distortion.oversample = '4x';

        const preGain = ctx.createGain();
        const postGain = ctx.createGain();
        preGain.gain.value = 1 + track.distortion;
        postGain.gain.value = 1 / (1 + track.distortion * 0.5);

        outputNode.connect(preGain);
        preGain.connect(distortion);
        distortion.connect(postGain);
        outputNode = postGain;
    }

    // Pan
    const panner = ctx.createStereoPanner();
    panner.pan.value = track.pan;
    outputNode.connect(panner);

    // Dry to Master
    const dryGain = ctx.createGain();
    dryGain.gain.value = 1.0;
    panner.connect(dryGain);
    dryGain.connect(masterGain);

    // Send to Reverb
    if (track.rev > 0) {
        const revSend = ctx.createGain();
        revSend.gain.value = track.rev;
        panner.connect(revSend);
        revSend.connect(reverbNode);
    }

    // Send to Delay
    if (track.del > 0) {
        const delSend = ctx.createGain();
        delSend.gain.value = track.del;
        panner.connect(delSend);
        delSend.connect(delayNode);
    }
}

