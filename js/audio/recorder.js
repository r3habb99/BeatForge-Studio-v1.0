/**
 * Audio Recorder Module
 * Handles live audio recording using MediaRecorder API
 */

import { getAudioContext, getMasterGain } from "./audioContext.js";

// Recording state
let mediaRecorder = null;
let recordedChunks = [];
let recordingState = "idle"; // idle, recording, paused, stopped
let mediaStreamDestination = null;

/**
 * Initialize the recorder
 */
function initRecorder() {
  const audioCtx = getAudioContext();
  const masterGain = getMasterGain();

  if (!audioCtx || !masterGain) {
    throw new Error(
      "Audio context not initialized. Please initialize audio first."
    );
  }

  try {
    // Create MediaStreamDestination if not already created
    if (!mediaStreamDestination) {
      mediaStreamDestination = audioCtx.createMediaStreamDestination();
      // Connect master gain to the stream destination (in addition to existing connections)
      masterGain.connect(mediaStreamDestination);
    }

    // Create MediaRecorder
    const stream = mediaStreamDestination.stream;
    const options = { mimeType: "audio/webm;codecs=opus" };

    // Check if the mime type is supported, fallback if not
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = "audio/webm";
    }

    mediaRecorder = new MediaRecorder(stream, options);

    // Handle data available event
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    // Handle stop event
    mediaRecorder.onstop = () => {
      console.log("Recording stopped, chunks:", recordedChunks.length);
    };

    console.log("Recorder initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize recorder:", error);
    throw error;
  }
}

/**
 * Start recording
 */
function startRecording() {
  if (!mediaRecorder) {
    initRecorder();
  }

  if (recordingState === "idle" || recordingState === "stopped") {
    // Clear previous recording
    recordedChunks = [];
    recordingState = "recording";
    mediaRecorder.start(100); // Collect data every 100ms
    console.log("Recording started");
    return true;
  } else if (recordingState === "paused") {
    // Resume recording
    recordingState = "recording";
    mediaRecorder.resume();
    console.log("Recording resumed");
    return true;
  }

  return false;
}

/**
 * Pause recording
 */
function pauseRecording() {
  if (
    recordingState === "recording" &&
    mediaRecorder &&
    mediaRecorder.state === "recording"
  ) {
    recordingState = "paused";
    mediaRecorder.pause();
    console.log("Recording paused");
    return true;
  }
  return false;
}

/**
 * Stop recording
 */
function stopRecording() {
  if (
    (recordingState === "recording" || recordingState === "paused") &&
    mediaRecorder
  ) {
    recordingState = "stopped";
    if (mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    console.log("Recording stopped");
    return true;
  }
  return false;
}

/**
 * Get recording state
 */
function getRecordingState() {
  return recordingState;
}

/**
 * Check if there is a recorded audio available
 */
function hasRecording() {
  return recordingState === "stopped" && recordedChunks.length > 0;
}

/**
 * Export recorded audio as WAV file
 */
async function exportRecording(filename) {
  if (!hasRecording()) {
    throw new Error("No recording available to export");
  }

  try {
    // Create blob from recorded chunks
    const blob = new Blob(recordedChunks, { type: "audio/webm" });

    // Download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `recording-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Failed to export recording:", error);
    throw error;
  }
}

export {
  initRecorder,
  startRecording,
  pauseRecording,
  stopRecording,
  getRecordingState,
  hasRecording,
  exportRecording,
};
