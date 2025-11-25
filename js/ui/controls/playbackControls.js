/**
 * Playback Controls Module
 * Handles play, pause, stop, and BPM controls
 */

import { getState, saveState } from "../../state/stateManager.js";
import {
  resumeAudioContext,
  getAudioContext,
} from "../../audio/audioEngine.js";
import { startScheduler, stopScheduler } from "../../scheduler/scheduler.js";

/**
 * Update play button UI
 */
export function updatePlayButtonUI(isPlaying) {
  const playBtn = document.getElementById("playBtn");
  const icon = playBtn.querySelector("i");

  if (isPlaying) {
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
    playBtn.setAttribute("aria-label", "Pause (Spacebar)");
  } else {
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
    playBtn.setAttribute("aria-label", "Play (Spacebar)");
  }
}

/**
 * Setup play button event listener
 */
export function setupPlayButton(initializeAppCallback) {
  document.getElementById("playBtn").addEventListener("click", async () => {
    try {
      const state = getState();

      // Initialize audio if not already done
      const audioCtx = getAudioContext();
      if (!audioCtx) {
        initializeAppCallback();
      }

      // Toggle play/pause
      if (state.isPlaying) {
        // Pause - stop the scheduler to prevent memory leaks
        state.isPlaying = false;
        stopScheduler();
        updatePlayButtonUI(false);
      } else {
        // Play
        await resumeAudioContext();
        state.isPlaying = true;
        if (state.currentStep === 0) {
          state.nextNoteTime = getAudioContext().currentTime;
        }
        startScheduler();
        updatePlayButtonUI(true);
      }
    } catch (error) {
      console.error("Failed to toggle playback:", error);
      alert(`Playback Error: ${error.message}`);
      const state = getState();
      state.isPlaying = false;
      stopScheduler();
      updatePlayButtonUI(false);
    }
  });
}

/**
 * Setup stop button event listener
 */
export function setupStopButton() {
  document.getElementById("stopBtn").addEventListener("click", () => {
    const state = getState();
    state.isPlaying = false;
    state.currentStep = 0;
    stopScheduler(); // Clean up the scheduler timeout
    document
      .querySelectorAll(".grid-col")
      .forEach((c) =>
        c.classList.remove("bg-gray-800", "border-t-2", "border-blue-500")
      );
    updatePlayButtonUI(false);
  });
}

/**
 * Setup BPM input event listener
 */
export function setupBPMInput() {
  document.getElementById("bpmInput").addEventListener("change", (e) => {
    const state = getState();
    const newBpm = parseInt(e.target.value);
    if (isNaN(newBpm) || newBpm < 40 || newBpm > 240) {
      alert("BPM must be between 40 and 240");
      e.target.value = state.bpm;
      return;
    }
    state.bpm = newBpm;
    saveState();
  });
}

/**
 * Setup all playback controls
 */
export function setupPlaybackControls(initializeAppCallback) {
  setupPlayButton(initializeAppCallback);
  setupStopButton();
  setupBPMInput();
}
