/**
 * Audio Context Management Module
 * Handles Web Audio API context initialization and analyser
 * Implements singleton pattern for guaranteed single instance
 */

import { Logger } from "../utils/logger.js";
import { Validators } from "../utils/validators.js";
import { AUDIO_CONFIG } from "../config/audioConfig.js";

/**
 * AudioContextManager singleton class
 * Manages Web Audio API context, master gain, and frequency analysis
 */
class AudioContextManager {
  static #instance = null;
  #audioCtx = null;
  #masterGain = null;
  #analyser = null;
  #frequencyData = null;
  #isInitialized = false;
  #isInitializing = false;
  #initPromise = null;

  /**
   * Get singleton instance
   * @returns {AudioContextManager} Singleton instance
   */
  static getInstance() {
    if (!AudioContextManager.#instance) {
      AudioContextManager.#instance = new AudioContextManager();
    }
    return AudioContextManager.#instance;
  }

  /**
   * Initialize the audio context
   * Handles browser compatibility, resume logic, and error handling
   * @returns {Promise<AudioContext>} Initialized audio context
   */
  async initialize() {
    // Return existing context if already initialized
    if (this.#isInitialized && this.#audioCtx) {
      Logger.debug("Audio context already initialized");
      return this.#audioCtx;
    }

    // Return existing promise if initialization is in progress
    if (this.#isInitializing && this.#initPromise) {
      Logger.debug(
        "Audio context initialization in progress, returning existing promise"
      );
      return this.#initPromise;
    }

    this.#isInitializing = true;
    this.#initPromise = this.#initializeInternal();

    try {
      return await this.#initPromise;
    } finally {
      this.#isInitializing = false;
    }
  }

  /**
   * Internal initialization logic
   * @private
   * @returns {Promise<AudioContext>}
   */
  async #initializeInternal() {
    try {
      // Check browser compatibility
      const AudioContext =
        window.AudioContext || window[AUDIO_CONFIG.FALLBACK_AUDIO_CONTEXT];
      if (!AudioContext) {
        const error = new Error(
          "Web Audio API is not supported in this browser. " +
            "Please use a modern browser like Chrome, Firefox, Safari, or Edge."
        );
        Logger.error(Logger.ERROR_CODES.AUDIO_NOT_SUPPORTED, error.message);
        throw error;
      }

      // Create audio context
      this.#audioCtx = new AudioContext();
      Logger.info("Audio context created", {
        state: this.#audioCtx.state,
        sampleRate: this.#audioCtx.sampleRate,
        baseLatency: this.#audioCtx.baseLatency,
      });

      // Setup master gain node
      this.#masterGain = this.#audioCtx.createGain();
      this.#masterGain.gain.value = AUDIO_CONFIG.MASTER_VOLUME;
      Logger.debug("Master gain node created", {
        gain: AUDIO_CONFIG.MASTER_VOLUME,
      });

      // Setup analyser node for frequency visualization
      this.#analyser = this.#audioCtx.createAnalyser();
      this.#analyser.fftSize = AUDIO_CONFIG.FFT_SIZE;
      this.#analyser.smoothingTimeConstant = AUDIO_CONFIG.ANALYSER_SMOOTHING;
      this.#frequencyData = new Uint8Array(this.#analyser.frequencyBinCount);
      Logger.debug("Analyser node created", {
        fftSize: AUDIO_CONFIG.FFT_SIZE,
        frequencyBinCount: this.#analyser.frequencyBinCount,
      });

      // Setup page visibility handler
      this.#setupPageVisibilityHandler();

      // Resume audio context if suspended (user interaction required in most browsers)
      if (this.#audioCtx.state === "suspended") {
        await this.#audioCtx.resume();
        Logger.info("Audio context resumed after initialization");
      }

      this.#isInitialized = true;
      Logger.info("Audio context initialization complete");
      return this.#audioCtx;
    } catch (error) {
      Logger.error(
        Logger.ERROR_CODES.AUDIO_INIT_FAILED,
        `Audio context initialization failed: ${error.message}`,
        { errorType: error.name },
        error
      );
      this.#isInitialized = false;
      throw error;
    }
  }

  /**
   * Setup page visibility handler to prevent audio context suspension
   * Browsers may throttle setTimeout when tab is inactive
   * @private
   */
  #setupPageVisibilityHandler() {
    document.addEventListener("visibilitychange", async () => {
      if (!this.#audioCtx) return;

      if (document.hidden) {
        Logger.info("Page hidden - audio context state", {
          state: this.#audioCtx.state,
        });
      } else {
        // Page is visible again - resume audio context if suspended
        if (this.#audioCtx.state === "suspended") {
          try {
            await this.#audioCtx.resume();
            Logger.info("Audio context resumed after page became visible");
          } catch (error) {
            Logger.error(
              Logger.ERROR_CODES.AUDIO_CONTEXT_RESUME_FAILED,
              `Failed to resume audio context: ${error.message}`,
              {},
              error
            );
          }
        }
      }
    });
  }

  /**
   * Get the audio context instance
   * @returns {AudioContext} Audio context or null if not initialized
   * @throws {Error} If audio context is not initialized
   */
  getContext() {
    if (!this.#audioCtx) {
      const error = new Error(
        "Audio context not initialized. Call initialize() first."
      );
      Logger.error(Logger.ERROR_CODES.AUDIO_CONTEXT_MISSING, error.message);
      throw error;
    }
    return this.#audioCtx;
  }

  /**
   * Get master gain node
   * @returns {GainNode} Master gain node
   * @throws {Error} If audio context is not initialized
   */
  getMasterGain() {
    if (!this.#masterGain) {
      const error = new Error(
        "Master gain not initialized. Call initialize() first."
      );
      Logger.error(Logger.ERROR_CODES.AUDIO_CONTEXT_MISSING, error.message);
      throw error;
    }
    return this.#masterGain;
  }

  /**
   * Get analyser node for frequency visualization
   * @returns {AnalyserNode} Analyser node
   * @throws {Error} If audio context is not initialized
   */
  getAnalyser() {
    if (!this.#analyser) {
      const error = new Error(
        "Analyser not initialized. Call initialize() first."
      );
      Logger.error(Logger.ERROR_CODES.AUDIO_CONTEXT_MISSING, error.message);
      throw error;
    }
    return this.#analyser;
  }

  /**
   * Get frequency data array for audio visualization
   * Updates and returns the frequency data
   * @returns {Uint8Array|null} Frequency data array or null if not initialized
   */
  getFrequencyData() {
    if (!this.#analyser || !this.#frequencyData) {
      return null;
    }
    this.#analyser.getByteFrequencyData(this.#frequencyData);
    return this.#frequencyData;
  }

  /**
   * Update master volume
   * @param {number} value - Volume level (0 to 1)
   * @throws {Error} If volume is invalid
   */
  updateMasterVolume(value) {
    const volumeResult = Validators.validateVolume(value);
    Validators.throwIfInvalid(volumeResult, "updateMasterVolume");

    if (this.#masterGain) {
      this.#masterGain.gain.value = parseFloat(value);
      Logger.debug("Master volume updated", { volume: parseFloat(value) });
    }
  }

  /**
   * Resume audio context if suspended
   * User interaction is required to resume suspended context
   * @returns {Promise<void>}
   */
  async resumeContext() {
    if (!this.#audioCtx) {
      Logger.error(
        Logger.ERROR_CODES.AUDIO_CONTEXT_MISSING,
        "Audio context not initialized"
      );
      throw new Error("Audio context not initialized");
    }

    if (this.#audioCtx.state === "suspended") {
      try {
        await this.#audioCtx.resume();
        Logger.info("Audio context manually resumed");
      } catch (error) {
        Logger.error(
          Logger.ERROR_CODES.AUDIO_CONTEXT_RESUME_FAILED,
          `Failed to resume audio context: ${error.message}`,
          {},
          error
        );
        throw error;
      }
    }
  }

  /**
   * Get audio context state
   * @returns {string} State: 'suspended', 'running', 'closed'
   */
  getContextState() {
    return this.#audioCtx?.state || "uninitialized";
  }

  /**
   * Check if audio context is initialized
   * @returns {boolean}
   */
  isInitialized() {
    return this.#isInitialized && this.#audioCtx !== null;
  }

  /**
   * Get audio context info
   * @returns {Object} Context information
   */
  getContextInfo() {
    if (!this.#audioCtx) {
      return { initialized: false };
    }

    return {
      initialized: this.#isInitialized,
      state: this.#audioCtx.state,
      sampleRate: this.#audioCtx.sampleRate,
      baseLatency: this.#audioCtx.baseLatency,
      outputLatency: this.#audioCtx.outputLatency,
      currentTime: this.#audioCtx.currentTime,
      fftSize: this.#analyser?.fftSize,
      frequencyBinCount: this.#analyser?.frequencyBinCount,
    };
  }
}

// Export functions for backward compatibility
export async function initAudioContext() {
  const manager = AudioContextManager.getInstance();
  return await manager.initialize();
}

export function getAudioContext() {
  const manager = AudioContextManager.getInstance();
  return manager.getContext();
}

export function getMasterGain() {
  const manager = AudioContextManager.getInstance();
  return manager.getMasterGain();
}

export function getAnalyser() {
  const manager = AudioContextManager.getInstance();
  return manager.getAnalyser();
}

export function getFrequencyData() {
  const manager = AudioContextManager.getInstance();
  return manager.getFrequencyData();
}

export function updateMasterVolume(value) {
  const manager = AudioContextManager.getInstance();
  manager.updateMasterVolume(value);
}

export async function resumeAudioContext() {
  const manager = AudioContextManager.getInstance();
  return await manager.resumeContext();
}

export function isAudioInitialized() {
  const manager = AudioContextManager.getInstance();
  return manager.isInitialized();
}

// Export the manager class for direct access if needed
export { AudioContextManager };
