/**
 * Effects Controls Module
 * Handles master volume and effects parameter controls
 */

import {
  updateMasterVolume,
  updateReverbTime,
  updateDelayTime,
  updateDelayFeedback,
} from "../../audio/audioEngine.js";

/**
 * Setup master volume control with mobile sync
 */
export function setupMasterVolumeControl() {
  const masterVol = document.getElementById("masterVol");
  const masterVolMobile = document.getElementById("masterVolMobile");

  if (masterVol) {
    masterVol.addEventListener("input", (e) => {
      try {
        updateMasterVolume(e.target.value);
        // Sync mobile control
        if (masterVolMobile) {
          masterVolMobile.value = e.target.value;
        }
      } catch (error) {
        console.error("Failed to set master volume:", error);
      }
    });
  } else {
    console.warn("Master volume control not found");
  }

  // Setup mobile control to sync with desktop
  if (masterVolMobile) {
    masterVolMobile.addEventListener("input", (e) => {
      try {
        updateMasterVolume(e.target.value);
        // Sync desktop control
        if (masterVol) {
          masterVol.value = e.target.value;
        }
      } catch (error) {
        console.error("Failed to set master volume from mobile:", error);
      }
    });
  }
}

/**
 * Setup reverb time control
 */
export function setupReverbControl() {
  const reverbTime = document.getElementById("reverbTime");
  if (reverbTime) {
    reverbTime.addEventListener("input", (e) => {
      try {
        const result = updateReverbTime(e.target.value);
        if (!result) {
          console.warn(
            "Reverb time update returned false - effects may not be initialized"
          );
        }
      } catch (error) {
        console.error("Failed to update reverb time:", error);
      }
    });

    // Also listen for 'change' event for better mobile support
    reverbTime.addEventListener("change", (e) => {
      try {
        updateReverbTime(e.target.value);
      } catch (error) {
        console.error("Failed to update reverb time on change:", error);
      }
    });
  } else {
    console.warn("Reverb time control not found");
  }
}

/**
 * Setup delay time control
 */
export function setupDelayTimeControl() {
  const delayTime = document.getElementById("delayTime");
  if (delayTime) {
    delayTime.addEventListener("input", (e) => {
      try {
        const result = updateDelayTime(e.target.value);
        if (!result) {
          console.warn(
            "Delay time update returned false - effects may not be initialized"
          );
        }
      } catch (error) {
        console.error("Failed to update delay time:", error);
      }
    });

    // Also listen for 'change' event for better mobile support
    delayTime.addEventListener("change", (e) => {
      try {
        updateDelayTime(e.target.value);
      } catch (error) {
        console.error("Failed to update delay time on change:", error);
      }
    });
  } else {
    console.warn("Delay time control not found");
  }
}

/**
 * Setup delay feedback control
 */
export function setupDelayFeedbackControl() {
  const delayFeedback = document.getElementById("delayFeedback");
  if (delayFeedback) {
    delayFeedback.addEventListener("input", (e) => {
      try {
        const result = updateDelayFeedback(e.target.value);
        if (!result) {
          console.warn(
            "Delay feedback update returned false - effects may not be initialized"
          );
        }
      } catch (error) {
        console.error("Failed to update delay feedback:", error);
      }
    });

    // Also listen for 'change' event for better mobile support
    delayFeedback.addEventListener("change", (e) => {
      try {
        updateDelayFeedback(e.target.value);
      } catch (error) {
        console.error("Failed to update delay feedback on change:", error);
      }
    });
  } else {
    console.warn("Delay feedback control not found");
  }
}

/**
 * Setup all effects controls
 */
export function setupEffectsControls() {
  setupMasterVolumeControl();
  setupReverbControl();
  setupDelayTimeControl();
  setupDelayFeedbackControl();
  console.log("Effects controls initialized");
}
