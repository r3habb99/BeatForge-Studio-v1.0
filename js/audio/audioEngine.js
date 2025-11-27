/**
 * Audio Engine Module
 * Main entry point - re-exports all audio functionality from sub-modules
 */

// Import from sub-modules
import {
  initAudioContext,
  getAudioContext,
  getAnalyser,
  getFrequencyData,
  updateMasterVolume,
  resumeAudioContext,
  isAudioInitialized,
} from "./audioContext.js";

import {
  setupEffects,
  updateReverbTime,
  updateDelayTime,
  updateDelayFeedback,
} from "./effects.js";

import { playDrum } from "./drums/drumSounds.js";
import { playSynth } from "./synths/synthSounds.js";
import { exportToWAV } from "./export.js";
import {
  initRecorder,
  startRecording,
  pauseRecording,
  stopRecording,
  getRecordingState,
  hasRecording,
  exportRecording,
} from "./recorder.js";

/**
 * Initialize the audio context and effects chain
 */
function initAudio() {
  try {
    initAudioContext();
    setupEffects();
    return true;
  } catch (error) {
    console.error("Failed to initialize audio:", error);
    throw error;
  }
}

// Export all public functions
export {
  initAudio,
  playDrum,
  playSynth,
  updateReverbTime,
  updateDelayTime,
  updateDelayFeedback,
  updateMasterVolume,
  getAudioContext,
  getAnalyser,
  getFrequencyData,
  resumeAudioContext,
  isAudioInitialized,
  exportToWAV,
  initRecorder,
  startRecording,
  pauseRecording,
  stopRecording,
  getRecordingState,
  hasRecording,
  exportRecording,
};
