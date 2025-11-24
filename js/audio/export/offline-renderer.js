/**
 * Offline Audio Renderer Module
 * Handles offline rendering of patterns to audio buffers
 */

import { STEP_COUNT } from "../../constants.js";
import { setupOfflineEffects } from "./offline-effects.js";
import { audioBufferToWav, downloadWav } from "./wav-converter.js";

/**
 * Main export function - renders pattern to WAV and downloads
 * @param {Object} state - The application state
 * @param {Array} tracks - The tracks to render
 * @param {Function} renderDrumCallback - Function to render drum sounds
 * @param {Function} renderSynthCallback - Function to render synth sounds
 * @returns {Promise<boolean>} Success status
 */
export async function exportToWAV(
  state,
  tracks,
  renderDrumCallback,
  renderSynthCallback
) {
  try {
    // Calculate duration - render 1 full pattern loop
    const secondsPerBeat = 60.0 / state.bpm;
    const patternDuration = STEP_COUNT * 0.25 * secondsPerBeat;
    // Add extra time for reverb/delay tails
    const duration = patternDuration + 3;

    // Create offline context
    const sampleRate = 44100;
    const offlineCtx = new OfflineAudioContext(
      2,
      sampleRate * duration,
      sampleRate
    );

    // Setup offline effects chain
    const { masterGain, reverbNode, delayNode } =
      setupOfflineEffects(offlineCtx);

    // Get swing value
    const swingInput = document.getElementById("swingInput");
    const swing = swingInput ? parseFloat(swingInput.value) : 0;

    // Check for solo tracks
    const anySolo = tracks.some((t) => t.solo);

    // Schedule all notes
    for (let step = 0; step < STEP_COUNT; step++) {
      const baseTime = step * 0.25 * secondsPerBeat;
      const swingTime = step % 2 !== 0 ? swing * secondsPerBeat : 0;
      const time = baseTime + swingTime;

      tracks.forEach((track) => {
        // Skip muted tracks
        if (track.mute) return;

        // Skip non-solo tracks if any solo is active
        if (anySolo && !track.solo) return;

        if (track.type === "drum" && track.steps[step]) {
          renderDrumCallback(
            offlineCtx,
            track,
            time,
            masterGain,
            reverbNode,
            delayNode
          );
        } else if (track.type === "synth") {
          const notesHere = track.notes.filter((n) => n.step === step);
          notesHere.forEach((note) => {
            const noteDuration = note.len * secondsPerBeat * 0.25;
            renderSynthCallback(
              offlineCtx,
              track,
              note,
              time,
              noteDuration,
              masterGain,
              reverbNode,
              delayNode
            );
          });
        }
      });
    }

    // Render audio
    const renderedBuffer = await offlineCtx.startRendering();

    // Convert to WAV and download
    const wav = audioBufferToWav(renderedBuffer);
    downloadWav(wav, `music-studio-${Date.now()}.wav`);

    return true;
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
}

/**
 * Calculate pattern duration
 * @param {number} bpm - Beats per minute
 * @param {number} stepCount - Number of steps in the pattern
 * @returns {number} Duration in seconds
 */
export function calculatePatternDuration(bpm, stepCount = STEP_COUNT) {
  const secondsPerBeat = 60.0 / bpm;
  return stepCount * 0.25 * secondsPerBeat;
}
