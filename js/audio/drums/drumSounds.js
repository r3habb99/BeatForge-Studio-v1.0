/**
 * Drum Sound Generators Module
 * Main dispatcher for drum sounds - delegates to individual sound modules
 * Refactored: Config-driven parameters, caching, validation, logging
 */

import {
  playKick,
  playSnare,
  playHiHat,
  playClap,
  playRimShot,
  playCowbell,
  playTom,
  playCrash,
  playRide,
  playShaker,
  playTambourine,
} from "./sounds/index.js";

import { DRUM_CONFIG } from "../../config/audioConfig.js";
import { Logger } from "../../utils/logger.js";
import { Validators } from "../../utils/validators.js";

/**
 * Drum sound dispatcher with caching and validation
 */
const DrumDispatcher = {
  // Cache for drum sound parameters
  parameterCache: new Map(),
  cacheHits: 0,
  cacheMisses: 0,

  /**
   * Generate cache key for drum parameters
   */
  getCacheKey(sound, track) {
    return `${sound}_${track.pan || 0}_${track.vol || 1}`;
  },

  /**
   * Get cached parameters or create new ones
   */
  getParameters(sound, track) {
    if (!DRUM_CONFIG.ENABLE_CACHE) {
      return this.generateParameters(sound, track);
    }

    const cacheKey = this.getCacheKey(sound, track);

    if (this.parameterCache.has(cacheKey)) {
      this.cacheHits++;
      Logger.debug(`Drum parameter cache hit: ${sound}`);
      return this.parameterCache.get(cacheKey);
    }

    this.cacheMisses++;
    const params = this.generateParameters(sound, track);

    // Maintain cache size limit
    if (this.parameterCache.size >= DRUM_CONFIG.MAX_CACHE_SIZE) {
      const firstKey = this.parameterCache.keys().next().value;
      this.parameterCache.delete(firstKey);
    }

    this.parameterCache.set(cacheKey, params);
    return params;
  },

  /**
   * Generate parameters for a drum sound
   */
  generateParameters(sound, track) {
    const config = DRUM_CONFIG[sound.toUpperCase()] || {};
    return {
      ...config,
      velocity: track.velocity || 1.0,
      vol: Math.max(0, Math.min(1, track.vol || 0.7)),
      pan: Math.max(-1, Math.min(1, track.pan || 0)),
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
      maxCacheSize: DRUM_CONFIG.MAX_CACHE_SIZE,
    };
  },

  /**
   * Clear cache
   */
  clearCache() {
    this.parameterCache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    Logger.info("Drum parameter cache cleared");
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
 * Play drum sound - main dispatcher with validation
 * @param {Object} track - The track configuration
 * @param {number} time - The time to play the sound
 */
function playDrum(track, time) {
  try {
    // Validation
    if (!track || !track.sound) {
      Logger.warn("Invalid drum track: missing sound property");
      return false;
    }

    const soundType = track.sound.toLowerCase();

    // Validate time
    const validation = Validators.validateDuration(time, 0, Infinity);
    if (!validation.isValid) {
      Logger.warn(`Invalid drum time: ${validation.errors.join(", ")}`);
      return false;
    }

    // Get cached/computed parameters
    const params = DrumDispatcher.getParameters(soundType, track);
    const velocity = params.velocity || 1.0;
    const vol = params.vol * velocity;

    // Volume validation
    if (vol < 0 || vol > 1) {
      Logger.warn(`Drum volume out of range: ${vol}`);
      return false;
    }

    Logger.debug(
      `Playing drum: ${soundType} at time ${time.toFixed(
        3
      )}s with volume ${vol.toFixed(2)}`
    );

    switch (soundType) {
      case "kick":
        playKick(track, time, vol);
        break;
      case "snare":
        playSnare(track, time, vol);
        break;
      case "hihat":
        playHiHat(track, time, vol);
        break;
      case "clap":
        playClap(track, time, vol);
        break;
      case "rimshot":
        playRimShot(track, time, vol);
        break;
      case "cowbell":
        playCowbell(track, time, vol);
        break;
      case "tom-low":
        playTom(track, time, vol, 80);
        break;
      case "tom-mid":
        playTom(track, time, vol, 150);
        break;
      case "tom-high":
        playTom(track, time, vol, 250);
        break;
      case "crash":
        playCrash(track, time, vol);
        break;
      case "ride":
        playRide(track, time, vol);
        break;
      case "shaker":
        playShaker(track, time, vol);
        break;
      case "tambourine":
        playTambourine(track, time, vol);
        break;
      default:
        Logger.warn(`Unknown drum sound: ${soundType}`);
        return false;
    }

    return true;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.AUDIO_SYNTHESIS_FAILED,
      `Error playing drum sound: ${error.message}`,
      { sound: track?.sound, time },
      error
    );
    return false;
  }
}

export { playDrum, DrumDispatcher };
