/**
 * Synthesizer Sound Generators Module
 * Main dispatcher for synth sounds - delegates to individual synth type modules
 * Refactored: Config-driven parameters, caching, validation, logging
 */

import {
  playBasicSynth,
  playPadSynth,
  playPluckSynth,
  playOrgan,
  playFMSynth,
  playSubBass,
  playAcidBass,
  playReeseBass,
} from "./types/index.js";

import { SYNTH_CONFIG } from "../config/audioConfig.js";
import { Logger } from "../utils/logger.js";
import { Validators } from "../utils/validators.js";

/**
 * Synth sound dispatcher with caching and validation
 */
const SynthDispatcher = {
  // Cache for synth sound parameters
  parameterCache: new Map(),
  noteCache: new Map(),
  cacheHits: 0,
  cacheMisses: 0,

  /**
   * Generate cache key for synth parameters
   */
  getParameterCacheKey(synthType, track) {
    return `${synthType}_${track.pan || 0}_${track.vol || 1}_${
      track.cutoff || 0
    }_${track.resonance || 0}`;
  },

  /**
   * Generate cache key for note
   */
  getNoteCacheKey(note, velocity) {
    return `${note}_${velocity}`;
  },

  /**
   * Get cached parameters or create new ones
   */
  getParameters(synthType, track) {
    if (!SYNTH_CONFIG.ENABLE_CACHE) {
      return this.generateParameters(synthType, track);
    }

    const cacheKey = this.getParameterCacheKey(synthType, track);

    if (this.parameterCache.has(cacheKey)) {
      this.cacheHits++;
      Logger.debug(`Synth parameter cache hit: ${synthType}`);
      return this.parameterCache.get(cacheKey);
    }

    this.cacheMisses++;
    const params = this.generateParameters(synthType, track);

    // Maintain cache size limit
    if (this.parameterCache.size >= SYNTH_CONFIG.MAX_CACHE_SIZE) {
      const firstKey = this.parameterCache.keys().next().value;
      this.parameterCache.delete(firstKey);
    }

    this.parameterCache.set(cacheKey, params);
    return params;
  },

  /**
   * Generate parameters for a synth sound
   */
  generateParameters(synthType, track) {
    const configKey = synthType.toUpperCase().replace("-", "_");
    const config = SYNTH_CONFIG[configKey] || SYNTH_CONFIG.BASIC || {};

    return {
      ...config,
      velocity: track.velocity || 1.0,
      vol: Math.max(0, Math.min(1, track.vol || 0.5)),
      pan: Math.max(-1, Math.min(1, track.pan || 0)),
      cutoff: track.cutoff || config.filter_cutoff || 2000,
      resonance: track.resonance || 0,
    };
  },

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? ((this.cacheHits / total) * 100).toFixed(2) : 0;
    return {
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      hitRate: `${hitRate}%`,
      cacheSize: this.parameterCache.size,
      maxCacheSize: SYNTH_CONFIG.MAX_CACHE_SIZE,
    };
  },

  /**
   * Clear cache
   */
  clearCache() {
    this.parameterCache.clear();
    this.noteCache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    Logger.info("Synth parameter cache cleared");
  },

  /**
   * Reset cache statistics
   */
  resetStats() {
    this.cacheHits = 0;
    this.cacheMisses = 0;
  },
};

/**
 * Play synthesizer note - main dispatcher with validation
 * @param {Object} track - The track configuration
 * @param {Object} noteInfo - Note information (note, len, velocity)
 * @param {number} time - The time to play the sound
 * @param {number} duration - The duration of the note
 */
function playSynth(track, noteInfo, time, duration) {
  try {
    // Validation
    if (!track || !track.synthType) {
      Logger.warn("Invalid synth track: missing synthType property");
      return false;
    }

    if (!noteInfo || noteInfo.note === undefined) {
      Logger.warn("Invalid note info: missing note property");
      return false;
    }

    // Validate time
    const timeValidation = Validators.validateDuration(time, 0, Infinity);
    if (!timeValidation.isValid) {
      Logger.warn(`Invalid synth time: ${timeValidation.errors.join(", ")}`);
      return false;
    }

    // Validate duration
    const durationValidation = Validators.validateDuration(
      duration,
      SYNTH_CONFIG.MIN_DURATION,
      SYNTH_CONFIG.MAX_DURATION
    );
    if (!durationValidation.isValid) {
      Logger.warn(
        `Invalid synth duration: ${durationValidation.errors.join(", ")}`
      );
      return false;
    }

    // Validate note frequency
    if (
      noteInfo.note < SYNTH_CONFIG.MIN_FREQUENCY ||
      noteInfo.note > SYNTH_CONFIG.MAX_FREQUENCY
    ) {
      Logger.warn(`Note frequency out of range: ${noteInfo.note}Hz`);
      return false;
    }

    const synthType = track.synthType.toLowerCase();
    const params = SynthDispatcher.getParameters(synthType, track);
    const velocity = params.velocity || 1.0;
    const vol = params.vol * velocity;

    // Volume validation
    if (vol < 0 || vol > 1) {
      Logger.warn(`Synth volume out of range: ${vol}`);
      return false;
    }

    Logger.debug(
      `Playing synth: ${synthType} at note ${noteInfo.note.toFixed(
        2
      )}Hz, time ${time.toFixed(3)}s, duration ${duration.toFixed(3)}s`
    );

    // Route to specific synth type
    switch (synthType) {
      case "pad":
        playPadSynth(track, noteInfo, time, duration, vol);
        break;
      case "pluck":
        playPluckSynth(track, noteInfo, time, duration, vol);
        break;
      case "organ":
        playOrgan(track, noteInfo, time, duration, vol);
        break;
      case "fm":
        playFMSynth(track, noteInfo, time, duration, vol);
        break;
      case "subbass":
        playSubBass(track, noteInfo, time, duration, vol);
        break;
      case "acidbass":
        playAcidBass(track, noteInfo, time, duration, vol);
        break;
      case "reesebass":
        playReeseBass(track, noteInfo, time, duration, vol);
        break;
      default:
        Logger.debug(`Unknown synth type: ${synthType}, using basic synth`);
        playBasicSynth(track, noteInfo, time, duration, vol);
    }

    return true;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.AUDIO_SYNTHESIS_FAILED,
      `Error playing synth sound: ${error.message}`,
      { synthType: track?.synthType, note: noteInfo?.note, time, duration },
      error
    );
    return false;
  }
}

export { playSynth, SynthDispatcher };
