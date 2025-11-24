/**
 * Audio Routing Module
 * Handles track output routing to master and effects
 */

import { getAudioContext, getMasterGain } from './audioContext.js';
import { getReverbNode, getDelayNode } from './effects.js';
import { makeDistortionCurve } from './utils/distortion-curve.js';

/**
 * Connect track output to master and effects sends
 */
function connectTrackOutput(track, sourceNode) {
    const audioCtx = getAudioContext();
    const masterGain = getMasterGain();
    const reverbNode = getReverbNode();
    const delayNode = getDelayNode();
    
    let outputNode = sourceNode;

    // Distortion (if enabled)
    if (track.distortion && track.distortion > 0) {
        const distortion = audioCtx.createWaveShaper();
        distortion.curve = makeDistortionCurve(track.distortion * 100);
        distortion.oversample = '4x';

        const preGain = audioCtx.createGain();
        const postGain = audioCtx.createGain();
        preGain.gain.value = 1 + track.distortion;
        postGain.gain.value = 1 / (1 + track.distortion * 0.5);

        outputNode.connect(preGain);
        preGain.connect(distortion);
        distortion.connect(postGain);
        outputNode = postGain;
    }

    // Pan
    const panner = audioCtx.createStereoPanner();
    panner.pan.value = track.pan;
    outputNode.connect(panner);

    // Dry to Master
    const dryGain = audioCtx.createGain();
    dryGain.gain.value = 1.0;
    panner.connect(dryGain);
    dryGain.connect(masterGain);

    // Send to Reverb
    if (track.rev > 0) {
        const revSend = audioCtx.createGain();
        revSend.gain.value = track.rev;
        panner.connect(revSend);
        revSend.connect(reverbNode);
    }

    // Send to Delay
    if (track.del > 0) {
        const delSend = audioCtx.createGain();
        delSend.gain.value = track.del;
        panner.connect(delSend);
        delSend.connect(delayNode);
    }
}

export {
    connectTrackOutput
};

