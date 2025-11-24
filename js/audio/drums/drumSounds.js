/**
 * Drum Sound Generators Module
 * Main dispatcher for drum sounds - delegates to individual sound modules
 */

import {
    playKick,
    playSnare,
    playHiHat,
    playClap,
    playRimShot,
    playCowbell,
    playTom,
    playCrash,
    playRide,
    playShaker,
    playTambourine
} from './sounds/index.js';

/**
 * Play drum sound - main dispatcher
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 */
function playDrum(track, time) {
    const velocity = track.velocity || 1.0;
    const vol = track.vol * velocity;

    switch (track.sound) {
        case 'kick':
            playKick(track, time, vol);
            break;
        case 'snare':
            playSnare(track, time, vol);
            break;
        case 'hihat':
            playHiHat(track, time, vol);
            break;
        case 'clap':
            playClap(track, time, vol);
            break;
        case 'rimshot':
            playRimShot(track, time, vol);
            break;
        case 'cowbell':
            playCowbell(track, time, vol);
            break;
        case 'tom-low':
            playTom(track, time, vol, 80);
            break;
        case 'tom-mid':
            playTom(track, time, vol, 150);
            break;
        case 'tom-high':
            playTom(track, time, vol, 250);
            break;
        case 'crash':
            playCrash(track, time, vol);
            break;
        case 'ride':
            playRide(track, time, vol);
            break;
        case 'shaker':
            playShaker(track, time, vol);
            break;
        case 'tambourine':
            playTambourine(track, time, vol);
            break;
    }
}

export { playDrum };
