/**
 * Scheduler Module
 * Handles timing, scheduling, and playback logic
 *
 * ARCHITECTURE:
 * - Audio scheduling loop runs on setTimeout (25ms interval) for precise, high-frequency timing
 * - Visual updates run on requestAnimationFrame (~60fps) for smooth UI updates
 * - These loops are independent to prevent visual rendering from blocking audio scheduling
 * - Uses CircularBuffer for memory-efficient note queue management
 */

import { STEP_COUNT } from "../constants.js";
import { getState, getTracks } from "../state/stateManager.js";
import { playDrum, playSynth, getAudioContext } from "../audio/audioEngine.js";
import { CircularBuffer } from "../utils/circularBuffer.js";
import { Logger } from "../utils/logger.js";
import { SCHEDULER_CONFIG } from "../config/audioConfig.js";

// Audio scheduling configuration
let scheduleAheadTime = SCHEDULER_CONFIG.SCHEDULE_AHEAD_TIME;
let lookaheadInterval = SCHEDULER_CONFIG.LOOKAHEAD_INTERVAL;
let minLookaheadInterval = SCHEDULER_CONFIG.MIN_LOOKAHEAD_INTERVAL;
let maxLookaheadInterval = SCHEDULER_CONFIG.MAX_LOOKAHEAD_INTERVAL;

// State tracking with CircularBuffer for memory efficiency
let noteQueue = new CircularBuffer(
  SCHEDULER_CONFIG.CIRCULAR_BUFFER_SIZE || 1000
);
let lastDrawStep = -1;
let schedulerTimeoutId = null; // Track the scheduler timeout for cleanup
let lastSchedulerTime = 0; // Track last scheduler execution time for adaptive scheduling

/**
 * Calculate next note timing
 */
function nextNote() {
  const state = getState();
  const secondsPerBeat = 60.0 / state.bpm;
  const swing = document.getElementById("swingInput").value * secondsPerBeat;

  let swingTime = 0;
  if (state.currentStep % 2 !== 0) swingTime = swing;

  state.nextNoteTime += 0.25 * secondsPerBeat + swingTime;

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
  tracks.forEach((track) => {
    if (track.mute) return;

    const anySolo = tracks.some((t) => t.solo);
    if (anySolo && !track.solo) return;

    if (track.type === "drum") {
      if (track.steps[stepNumber]) {
        const secondsPerBeat = 60.0 / state.bpm;
        const swingAmt =
          document.getElementById("swingInput").value * (secondsPerBeat / 2);
        let finalTime = time;
        if (stepNumber % 2 !== 0) finalTime += swingAmt;

        playDrum(track, finalTime);
      }
    } else if (track.type === "synth") {
      const notesHere = track.notes.filter((n) => n.step === stepNumber);
      notesHere.forEach((n) => {
        const durationSeconds = n.len * (60 / state.bpm) * 0.25;
        playSynth(track, n, time, durationSeconds);
      });
    }
  });
}

/**
 * Main audio scheduler loop
 * Runs independently on setTimeout for precise, high-frequency timing
 * This ensures audio scheduling is not blocked by visual rendering
 *
 * ADAPTIVE SCHEDULING:
 * - Detects when browser throttles setTimeout (e.g., when tab is inactive)
 * - Adjusts scheduling interval dynamically to maintain audio buffer
 * - Increased lookahead buffer (500ms) prevents dropouts during throttling
 */
function scheduler() {
  const state = getState();

  // Clear any existing timeout
  if (schedulerTimeoutId) {
    clearTimeout(schedulerTimeoutId);
    schedulerTimeoutId = null;
  }

  // Stop if not playing
  if (!state.isPlaying) return;

  try {
    const audioCtx = getAudioContext();
    const currentTime = performance.now();

    // Detect if browser is throttling setTimeout
    // If more than 100ms has passed since last call, we're being throttled
    const timeSinceLastCall =
      lastSchedulerTime > 0 ? currentTime - lastSchedulerTime : 0;
    const isThrottled =
      timeSinceLastCall > SCHEDULER_CONFIG.THROTTLE_DETECTION_THRESHOLD;

    // Adaptive interval: use longer interval if being throttled
    const adaptiveInterval = isThrottled
      ? maxLookaheadInterval
      : minLookaheadInterval;

    lastSchedulerTime = currentTime;

    // Schedule all notes that fall within the lookahead window
    while (state.nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
      scheduleNote(state.currentStep, state.nextNoteTime);
      nextNote();
    }

    // Log buffer statistics if in debug mode
    if (noteQueue.getSize() > noteQueue.getCapacity() * 0.8) {
      Logger.warn(
        Logger.WARNING_CODES.HIGH_CPU_USAGE,
        "Note queue buffer nearing capacity",
        noteQueue.getStats()
      );
    }

    // Schedule next scheduler iteration using setTimeout for precise timing
    // This runs independently of the visual update loop
    schedulerTimeoutId = setTimeout(scheduler, adaptiveInterval);
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.SCHEDULING_FAILED,
      `Scheduler error: ${error.message}`,
      {},
      error
    );
  }
}

/**
 * Update visual indicators
 * Runs on requestAnimationFrame for smooth 60fps visual updates
 * This is separate from the audio scheduler to prevent blocking
 */
function updateVisuals() {
  const state = getState();

  // Stop visual updates if not playing
  if (!state.isPlaying) return;

  try {
    const audioCtx = getAudioContext();
    const currentTime = audioCtx.currentTime;
    let currentStepIndex = -1;

    // Process note queue to find current step
    while (!noteQueue.isEmpty()) {
      const note = noteQueue.peek();
      if (note && note.time < currentTime) {
        currentStepIndex = note.note;
        noteQueue.shift();
      } else {
        break;
      }
    }

    // Update visual indicators only when step changes
    if (currentStepIndex !== -1 && currentStepIndex !== lastDrawStep) {
      lastDrawStep = currentStepIndex;
      document.querySelectorAll(".grid-col").forEach((col, idx) => {
        if (idx === currentStepIndex)
          col.classList.add("bg-gray-800", "border-t-2", "border-blue-500");
        else
          col.classList.remove("bg-gray-800", "border-t-2", "border-blue-500");
      });
    }

    // Continue visual updates on next animation frame
    requestAnimationFrame(updateVisuals);
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.SCHEDULING_FAILED,
      `Visual update error: ${error.message}`,
      {},
      error
    );
  }
}

/**
 * Start the scheduler and visual update loops
 * Audio scheduler runs on setTimeout, visuals on requestAnimationFrame
 */
function startScheduler() {
  // Start the audio scheduling loop (high-frequency setTimeout)
  scheduler();

  // Start the visual update loop (requestAnimationFrame)
  requestAnimationFrame(updateVisuals);
}

/**
 * Stop the scheduler
 * Cleans up the setTimeout to prevent memory leaks
 */
function stopScheduler() {
  if (schedulerTimeoutId) {
    clearTimeout(schedulerTimeoutId);
    schedulerTimeoutId = null;
  }
}

/**
 * Reset note queue
 */
function resetNoteQueue() {
  noteQueue.clear();
  lastDrawStep = -1;
}

export {
  scheduler,
  startScheduler,
  stopScheduler,
  updateVisuals,
  resetNoteQueue,
};
