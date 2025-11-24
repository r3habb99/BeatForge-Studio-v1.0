/**
 * Recording Controls Module
 * Handles recording button controls and state management
 */

import {
  getAudioContext,
  initRecorder,
  startRecording,
  pauseRecording,
  stopRecording,
  getRecordingState,
} from "../../audio/audioEngine.js";

/**
 * Update recording button states based on recording state
 */
export function updateRecordingButtonStates() {
  const recordBtn = document.getElementById("recordBtn");
  const pauseBtn = document.getElementById("pauseRecordBtn");
  const stopBtn = document.getElementById("stopRecordBtn");
  const exportBtn = document.getElementById("exportBtn");

  // Mobile buttons
  const recordBtnMobile = document.getElementById("recordBtnMobile");
  const pauseBtnMobile = document.getElementById("pauseRecordBtnMobile");
  const stopBtnMobile = document.getElementById("stopRecordBtnMobile");
  const exportBtnMobile = document.getElementById("exportBtnMobile");

  const state = getRecordingState();

  switch (state) {
    case "idle":
      if (recordBtn) {
        recordBtn.disabled = false;
        recordBtn.innerHTML = '<i class="fas fa-circle"></i>';
        recordBtn.setAttribute("aria-label", "Start Recording");
      }
      if (pauseBtn) pauseBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = true;
      if (exportBtn) exportBtn.disabled = true;

      // Mobile
      if (recordBtnMobile) recordBtnMobile.disabled = false;
      if (pauseBtnMobile) pauseBtnMobile.disabled = true;
      if (stopBtnMobile) stopBtnMobile.disabled = true;
      if (exportBtnMobile) exportBtnMobile.disabled = true;
      break;

    case "recording":
      if (recordBtn) recordBtn.disabled = true;
      if (pauseBtn) pauseBtn.disabled = false;
      if (stopBtn) stopBtn.disabled = false;
      if (exportBtn) exportBtn.disabled = true;

      // Mobile
      if (recordBtnMobile) recordBtnMobile.disabled = true;
      if (pauseBtnMobile) pauseBtnMobile.disabled = false;
      if (stopBtnMobile) stopBtnMobile.disabled = false;
      if (exportBtnMobile) exportBtnMobile.disabled = true;
      break;

    case "paused":
      if (recordBtn) {
        recordBtn.disabled = false;
        recordBtn.innerHTML = '<i class="fas fa-circle"></i>';
        recordBtn.setAttribute("aria-label", "Resume Recording");
      }
      if (pauseBtn) pauseBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = false;
      if (exportBtn) exportBtn.disabled = true;

      // Mobile
      if (recordBtnMobile) recordBtnMobile.disabled = false;
      if (pauseBtnMobile) pauseBtnMobile.disabled = true;
      if (stopBtnMobile) stopBtnMobile.disabled = false;
      if (exportBtnMobile) exportBtnMobile.disabled = true;
      break;

    case "stopped":
      if (recordBtn) {
        recordBtn.disabled = false;
        recordBtn.innerHTML = '<i class="fas fa-circle"></i>';
        recordBtn.setAttribute("aria-label", "Start Recording");
      }
      if (pauseBtn) pauseBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = true;
      if (exportBtn) exportBtn.disabled = false;

      // Mobile
      if (recordBtnMobile) recordBtnMobile.disabled = false;
      if (pauseBtnMobile) pauseBtnMobile.disabled = true;
      if (stopBtnMobile) stopBtnMobile.disabled = true;
      if (exportBtnMobile) exportBtnMobile.disabled = false;
      break;
  }
}

/**
 * Handle record button click
 */
function handleRecordButton() {
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) {
      alert(
        'Please initialize audio first by clicking the "Initialize Audio" button.'
      );
      return;
    }

    // Initialize recorder if needed
    try {
      initRecorder();
    } catch (error) {
      console.log("Recorder already initialized or initialization not needed");
    }

    // Start or resume recording
    const success = startRecording();
    if (success) {
      console.log("Recording started/resumed");
      updateRecordingButtonStates();
    }
  } catch (error) {
    console.error("Failed to start recording:", error);
    alert(`Recording failed: ${error.message}`);
  }
}

/**
 * Handle pause record button click
 */
function handlePauseRecordButton() {
  try {
    const success = pauseRecording();
    if (success) {
      console.log("Recording paused");
      updateRecordingButtonStates();
    }
  } catch (error) {
    console.error("Failed to pause recording:", error);
    alert(`Pause failed: ${error.message}`);
  }
}

/**
 * Handle stop record button click
 */
function handleStopRecordButton() {
  try {
    const success = stopRecording();
    if (success) {
      console.log("Recording stopped");
      updateRecordingButtonStates();
      alert(
        "Recording stopped! You can now export the recording using the Export button."
      );
    }
  } catch (error) {
    console.error("Failed to stop recording:", error);
    alert(`Stop failed: ${error.message}`);
  }
}

/**
 * Setup all recording controls
 */
export function setupRecordingControls() {
  document
    .getElementById("recordBtn")
    .addEventListener("click", handleRecordButton);
  document
    .getElementById("pauseRecordBtn")
    .addEventListener("click", handlePauseRecordButton);
  document
    .getElementById("stopRecordBtn")
    .addEventListener("click", handleStopRecordButton);
}
