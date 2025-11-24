/**
 * Synthesizer Sound Generators Module
 * Main dispatcher for synth sounds - delegates to individual synth type modules
 */

import {
    playBasicSynth,
    playPadSynth,
    playPluckSynth,
    playOrgan,
    playFMSynth,
    playSubBass,
    playAcidBass,
    playReeseBass
} from './types/index.js';

/**
 * Play synthesizer note - main dispatcher
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information (note, len, velocity)
 * @param {number} time - The time to play the sound
 * @param {number} duration - The duration of the note
 */
function playSynth(track, noteInfo, time, duration) {
    const velocity = noteInfo.velocity || 1.0;
    const vol = track.vol * velocity;

    // Route to specific synth type
    switch (track.synthType) {
        case 'pad':
            playPadSynth(track, noteInfo, time, duration, vol);
            break;
        case 'pluck':
            playPluckSynth(track, noteInfo, time, duration, vol);
            break;
        case 'organ':
            playOrgan(track, noteInfo, time, duration, vol);
            break;
        case 'fm':
            playFMSynth(track, noteInfo, time, duration, vol);
            break;
        case 'subbass':
            playSubBass(track, noteInfo, time, duration, vol);
            break;
        case 'acidbass':
            playAcidBass(track, noteInfo, time, duration, vol);
            break;
        case 'reesebass':
            playReeseBass(track, noteInfo, time, duration, vol);
            break;
        default:
            playBasicSynth(track, noteInfo, time, duration, vol);
    }
}

export { playSynth };
