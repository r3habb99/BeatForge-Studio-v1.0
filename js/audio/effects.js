/**
 * Audio Effects Module
 * Handles reverb, delay, and distortion effects
 * Refactored: Config-driven parameters, validation, error logging
 */

import { getAudioContext, getMasterGain, getAnalyser } from "./audioContext.js";
import { createImpulseResponse } from "./utils/impulse-response.js";
import { AUDIO_CONFIG } from "../config/audioConfig.js";
import { Logger } from "../utils/logger.js";

/**
 * Effects state manager with validation
 */
const EffectsManager = {
  reverbNode: null,
  reverbGain: null,
  delayNode: null,
  delayFeedback: null,
  delayGain: null,
  isInitialized: false,

  /**
   * Initialize effects based on config
   */
  initialize() {
    try {
      const audioCtx = getAudioContext();
      const masterGain = getMasterGain();

      // Validation
      if (!audioCtx) {
        throw new Error("Audio context not initialized");
      }
      if (!masterGain) {
        throw new Error("Master gain not available");
      }

      Logger.info("Initializing audio effects with config...");

      // Setup Reverb (Convolution)
      this.reverbNode = audioCtx.createConvolver();
      this.reverbGain = audioCtx.createGain();

      // Use config values for reverb
      this.reverbNode.buffer = createImpulseResponse(
        AUDIO_CONFIG.REVERB_DECAY_TIME,
        2,
        false
      );
      this.reverbGain.gain.value = AUDIO_CONFIG.REVERB_DRY_LEVEL;

      this.reverbNode.connect(this.reverbGain);
      this.reverbGain.connect(masterGain);

      // Setup Delay
      this.delayNode = audioCtx.createDelay(AUDIO_CONFIG.DELAY_MAX_TIME);
      this.delayFeedback = audioCtx.createGain();
      this.delayGain = audioCtx.createGain();

      // Use config values for delay
      this.delayNode.delayTime.value = AUDIO_CONFIG.DELAY_TIME;
      this.delayFeedback.gain.value = AUDIO_CONFIG.DELAY_FEEDBACK;
      this.delayGain.gain.value = AUDIO_CONFIG.DELAY_DRY_LEVEL;

      this.delayNode.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(masterGain);

      // Connect the analyser
      const analyser = getAnalyser();
      if (analyser) {
        masterGain.connect(analyser);
        analyser.connect(audioCtx.destination);
        Logger.info("Analyser connected to audio chain");
      } else {
        Logger.warn(
          "Analyser not available, connecting master directly to destination"
        );
        masterGain.connect(audioCtx.destination);
      }

      this.isInitialized = true;
      Logger.info("Audio effects initialized successfully");

      return true;
    } catch (error) {
      Logger.error(
        Logger.ERROR_CODES.AUDIO_INIT_FAILED,
        `Failed to initialize effects: ${error.message}`,
        { reverbNode: this.reverbNode, delayNode: this.delayNode },
        error
      );
      throw new Error("Could not initialize audio effects");
    }
  },

  /**
   * Get reverb node with validation
   */
  getReverbNode() {
    if (!this.isInitialized || !this.reverbNode) {
      Logger.warn("Attempted to get reverb node before initialization");
      return null;
    }
    return this.reverbNode;
  },

  /**
   * Get delay node with validation
   */
  getDelayNode() {
    if (!this.isInitialized || !this.delayNode) {
      Logger.warn("Attempted to get delay node before initialization");
      return null;
    }
    return this.delayNode;
  },

  /**
   * Update reverb decay time with validation
   * @param {number|string} value - Decay time in seconds (0.1 to 10)
   */
  updateReverbTime(value) {
    try {
      const decayTime = parseFloat(value);

      // Manual validation for reverb time range
      if (isNaN(decayTime) || decayTime < 0.1 || decayTime > 10) {
        Logger.warn(
          `Invalid reverb time: ${value}. Must be between 0.1 and 10`
        );
        return false;
      }

      if (this.reverbNode) {
        this.reverbNode.buffer = createImpulseResponse(decayTime, 2, false);
        Logger.debug(`Reverb decay time updated to ${decayTime}s`);
        return true;
      }

      Logger.warn("Reverb node not initialized");
      return false;
    } catch (error) {
      Logger.error(
        Logger.ERROR_CODES.EFFECT_UPDATE_FAILED,
        `Error updating reverb time: ${error.message}`,
        { value },
        error
      );
      return false;
    }
  },

  /**
   * Update delay time with validation
   * @param {number|string} value - Delay time in seconds (0.01 to DELAY_MAX_TIME)
   */
  updateDelayTime(value) {
    try {
      const delayTime = parseFloat(value);

      // Manual validation for delay time range
      if (
        isNaN(delayTime) ||
        delayTime < 0.01 ||
        delayTime > AUDIO_CONFIG.DELAY_MAX_TIME
      ) {
        Logger.warn(
          `Invalid delay time: ${value}. Must be between 0.01 and ${AUDIO_CONFIG.DELAY_MAX_TIME}`
        );
        return false;
      }

      const audioCtx = getAudioContext();
      if (this.delayNode && audioCtx) {
        this.delayNode.delayTime.linearRampToValueAtTime(
          delayTime,
          audioCtx.currentTime + 0.1
        );
        Logger.debug(`Delay time updated to ${delayTime}s`);
        return true;
      }

      Logger.warn("Delay node not initialized");
      return false;
    } catch (error) {
      Logger.error(
        Logger.ERROR_CODES.EFFECT_UPDATE_FAILED,
        `Error updating delay time: ${error.message}`,
        { value },
        error
      );
      return false;
    }
  },

  /**
   * Update delay feedback with validation
   * @param {number} value - Feedback amount (0 to 0.95)
   */
  updateDelayFeedback(value) {
    try {
      const feedback = parseFloat(value);

      // Validation: prevent feedback >= 1 (infinite loop)
      if (feedback < 0 || feedback >= 1) {
        Logger.warn(`Invalid delay feedback: ${feedback}. Must be 0 to 0.95`);
        return false;
      }

      if (this.delayFeedback) {
        this.delayFeedback.gain.value = feedback;
        Logger.debug(`Delay feedback updated to ${feedback}`);
        return true;
      }

      Logger.warn("Delay feedback node not initialized");
      return false;
    } catch (error) {
      Logger.error(
        Logger.ERROR_CODES.EFFECT_UPDATE_FAILED,
        `Error updating delay feedback: ${error.message}`,
        { value },
        error
      );
      return false;
    }
  },

  /**
   * Update reverb amount (dry/wet mix)
   * @param {number} value - Reverb mix (0 to 1, where 1 = 100% wet)
   */
  updateReverbAmount(value) {
    try {
      const amount = parseFloat(value);

      if (amount < 0 || amount > 1) {
        Logger.warn(`Invalid reverb amount: ${amount}. Must be 0 to 1`);
        return false;
      }

      if (this.reverbGain) {
        this.reverbGain.gain.value = amount;
        Logger.debug(`Reverb amount updated to ${amount}`);
        return true;
      }

      Logger.warn("Reverb gain node not initialized");
      return false;
    } catch (error) {
      Logger.error(
        Logger.ERROR_CODES.EFFECT_UPDATE_FAILED,
        `Error updating reverb amount: ${error.message}`,
        { value },
        error
      );
      return false;
    }
  },

  /**
   * Update delay amount (dry/wet mix)
   * @param {number} value - Delay mix (0 to 1, where 1 = 100% wet)
   */
  updateDelayAmount(value) {
    try {
      const amount = parseFloat(value);

      if (amount < 0 || amount > 1) {
        Logger.warn(`Invalid delay amount: ${amount}. Must be 0 to 1`);
        return false;
      }

      if (this.delayGain) {
        this.delayGain.gain.value = amount;
        Logger.debug(`Delay amount updated to ${amount}`);
        return true;
      }

      Logger.warn("Delay gain node not initialized");
      return false;
    } catch (error) {
      Logger.error(
        Logger.ERROR_CODES.EFFECT_UPDATE_FAILED,
        `Error updating delay amount: ${error.message}`,
        { value },
        error
      );
      return false;
    }
  },

  /**
   * Reset all effects to config defaults
   */
  reset() {
    try {
      Logger.info("Resetting effects to config defaults");

      if (this.reverbGain) {
        this.reverbGain.gain.value = AUDIO_CONFIG.REVERB_DRY_LEVEL;
      }

      if (this.delayNode) {
        this.delayNode.delayTime.value = AUDIO_CONFIG.DELAY_TIME;
      }

      if (this.delayFeedback) {
        this.delayFeedback.gain.value = AUDIO_CONFIG.DELAY_FEEDBACK;
      }

      if (this.delayGain) {
        this.delayGain.gain.value = AUDIO_CONFIG.DELAY_DRY_LEVEL;
      }

      Logger.info("Effects reset successfully");
      return true;
    } catch (error) {
      Logger.error(
        Logger.ERROR_CODES.EFFECT_UPDATE_FAILED,
        `Error resetting effects: ${error.message}`,
        {},
        error
      );
      return false;
    }
  },

  /**
   * Get current effects status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      reverbTime: this.reverbNode
        ? this.reverbNode.buffer.length / 44100
        : null,
      delayTime: this.delayNode ? this.delayNode.delayTime.value : null,
      delayFeedback: this.delayFeedback ? this.delayFeedback.gain.value : null,
      reverbAmount: this.reverbGain ? this.reverbGain.gain.value : null,
      delayAmount: this.delayGain ? this.delayGain.gain.value : null,
    };
  },
};

/**
 * Setup effects (backward compatible wrapper)
 */
function setupEffects() {
  return EffectsManager.initialize();
}

/**
 * Get reverb node (backward compatible wrapper)
 */
function getReverbNode() {
  return EffectsManager.getReverbNode();
}

/**
 * Get delay node (backward compatible wrapper)
 */
function getDelayNode() {
  return EffectsManager.getDelayNode();
}

/**
 * Update reverb decay time (backward compatible wrapper)
 */
function updateReverbTime(value) {
  return EffectsManager.updateReverbTime(value);
}

/**
 * Update delay time (backward compatible wrapper)
 */
function updateDelayTime(value) {
  return EffectsManager.updateDelayTime(value);
}

/**
 * Update delay feedback (backward compatible wrapper)
 */
function updateDelayFeedback(value) {
  return EffectsManager.updateDelayFeedback(value);
}

export {
  // Main functions (backward compatible)
  setupEffects,
  getReverbNode,
  getDelayNode,
  updateReverbTime,
  updateDelayTime,
  updateDelayFeedback,

  // New functions
  EffectsManager,
};

// Re-export distortion curve utility for backward compatibility
export { makeDistortionCurve } from "./utils/distortion-curve.js";
