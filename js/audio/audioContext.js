/**
 * Audio Context Management Module
 * Handles Web Audio API context initialization and analyser
 */

let audioCtx;
let masterGain;
let analyser;
let frequencyData;

/**
 * Initialize the audio context
 */
function initAudioContext() {
  if (audioCtx) return audioCtx;

  try {
    // Check browser compatibility
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      throw new Error(
        "Web Audio API is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge."
      );
    }

    audioCtx = new AudioContext();

    // Master gain
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.8;

    // Analyser for frequency visualization
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // Handle page visibility changes to prevent audio context suspension
    // This prevents browser throttling from affecting audio playback
    setupPageVisibilityHandler();

    return audioCtx;
  } catch (error) {
    console.error("Failed to initialize audio context:", error);
    throw error;
  }
}

/**
 * Setup page visibility handler to prevent audio context suspension
 * Browsers may throttle setTimeout when tab is inactive, causing audio dropouts
 */
function setupPageVisibilityHandler() {
  document.addEventListener("visibilitychange", async () => {
    if (!audioCtx) return;

    if (document.hidden) {
      // Page is hidden - audio context may get suspended by browser
      console.log("Page hidden - audio context state:", audioCtx.state);
    } else {
      // Page is visible again - resume audio context if suspended
      if (audioCtx.state === "suspended") {
        try {
          await audioCtx.resume();
          console.log("Audio context resumed after page became visible");
        } catch (error) {
          console.error("Failed to resume audio context:", error);
        }
      }
    }
  });
}

/**
 * Get audio context
 */
function getAudioContext() {
  return audioCtx;
}

/**
 * Get master gain node
 */
function getMasterGain() {
  return masterGain;
}

/**
 * Get analyser node
 */
function getAnalyser() {
  return analyser;
}

/**
 * Get frequency data array for audio visualization
 */
function getFrequencyData() {
  if (analyser && frequencyData) {
    analyser.getByteFrequencyData(frequencyData);
    return frequencyData;
  }
  return null;
}

/**
 * Update master volume
 */
function updateMasterVolume(value) {
  if (masterGain) {
    const vol = parseFloat(value);
    if (!isNaN(vol)) {
      masterGain.gain.value = vol;
    }
  }
}

/**
 * Resume audio context if suspended
 */
async function resumeAudioContext() {
  if (audioCtx && audioCtx.state === "suspended") {
    await audioCtx.resume();
  }
}

export {
  initAudioContext,
  getAudioContext,
  getMasterGain,
  getAnalyser,
  getFrequencyData,
  updateMasterVolume,
  resumeAudioContext,
};
