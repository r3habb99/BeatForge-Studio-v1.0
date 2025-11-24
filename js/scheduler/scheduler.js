/**
 * Scheduler Module
 * Handles timing, scheduling, and playback logic
 */

import { STEP_COUNT } from '../constants.js';
import { getState, getTracks } from '../state/stateManager.js';
import { playDrum, playSynth, getAudioContext } from '../audio/audioEngine.js';

let scheduleAheadTime = 0.1;
let noteQueue = [];
let lastDrawStep = -1;

/**
 * Calculate next note timing
 */
function nextNote() {
    const state = getState();
    const secondsPerBeat = 60.0 / state.bpm;
    const swing = document.getElementById('swingInput').value * secondsPerBeat;

    let swingTime = 0;
    if (state.currentStep % 2 !== 0) swingTime = swing;

    state.nextNoteTime += (0.25 * secondsPerBeat) + swingTime;

    state.currentStep++;
    if (state.currentStep === STEP_COUNT) state.currentStep = 0;
}

/**
 * Schedule a note to be played
 */
function scheduleNote(stepNumber, time) {
    const state = getState();
    noteQueue.push({ note: stepNumber, time: time });

    const tracks = getTracks();
    tracks.forEach(track => {
        if (track.mute) return;

        const anySolo = tracks.some(t => t.solo);
        if (anySolo && !track.solo) return;

        if (track.type === 'drum') {
            if (track.steps[stepNumber]) {
                const secondsPerBeat = 60.0 / state.bpm;
                const swingAmt = document.getElementById('swingInput').value * (secondsPerBeat / 2);
                let finalTime = time;
                if (stepNumber % 2 !== 0) finalTime += swingAmt;

                playDrum(track, finalTime);
            }
        } else if (track.type === 'synth') {
            const notesHere = track.notes.filter(n => n.step === stepNumber);
            notesHere.forEach(n => {
                const durationSeconds = n.len * (60 / state.bpm) * 0.25;
                playSynth(track, n, time, durationSeconds);
            });
        }
    });
}

/**
 * Main scheduler loop
 */
function scheduler() {
    const state = getState();
    if (!state.isPlaying) return;

    const audioCtx = getAudioContext();
    while (state.nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleNote(state.currentStep, state.nextNoteTime);
        nextNote();
    }

    requestAnimationFrame(updateVisuals);
    requestAnimationFrame(scheduler);
}

/**
 * Update visual indicators
 */
function updateVisuals() {
    const state = getState();
    const audioCtx = getAudioContext();
    const currentTime = audioCtx.currentTime;
    let currentStepIndex = -1;

    while (noteQueue.length && noteQueue[0].time < currentTime) {
        currentStepIndex = noteQueue[0].note;
        noteQueue.shift();
    }

    if (currentStepIndex !== -1 && currentStepIndex !== lastDrawStep) {
        lastDrawStep = currentStepIndex;
        document.querySelectorAll('.grid-col').forEach((col, idx) => {
            if (idx === currentStepIndex) col.classList.add('bg-gray-800', 'border-t-2', 'border-blue-500');
            else col.classList.remove('bg-gray-800', 'border-t-2', 'border-blue-500');
        });
    }

    if (state.isPlaying) requestAnimationFrame(updateVisuals);
}

/**
 * Start the scheduler
 */
function startScheduler() {
    requestAnimationFrame(scheduler);
}

/**
 * Reset note queue
 */
function resetNoteQueue() {
    noteQueue = [];
    lastDrawStep = -1;
}

export {
    scheduler,
    startScheduler,
    updateVisuals,
    resetNoteQueue
};

