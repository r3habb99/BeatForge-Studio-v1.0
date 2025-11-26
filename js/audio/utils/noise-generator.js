/**
 * Noise Generator Utility Module
 * Provides functions for generating noise buffers for audio synthesis
 * Features: validation, caching, multiple noise types, error handling
 */

import { getAudioContext } from "../audioContext.js";
import { Validators } from "../../utils/validators.js";
import { Logger } from "../../utils/logger.js";
import { NOISE_CONFIG } from "../../config/audioConfig.js";

/**
 * Noise generator cache for performance
 * Stores generated buffers to avoid regeneration
 */
const NOISE_CACHE = new Map();

/**
 * Generate white noise data in a buffer
 * @param {Float32Array} data - Channel data array
 * @private
 */
function generateWhiteNoiseData(data) {
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
}

/**
 * Generate pink noise data in a buffer
 * Pink noise has equal energy per octave
 * @param {Float32Array} data - Channel data array
 * @private
 */
function generatePinkNoiseData(data) {
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;

  for (let i = 0; i < data.length; i++) {
    const white = Math.random();
    b0 = 0.049922035 * white + 0.950066025 * b0;
    b1 = 0.049922035 * white + 0.950066025 * b1;
    b2 = 0.049922035 * white + 0.950066025 * b2;
    b3 = 0.049922035 * white + 0.950066025 * b3;
    b4 = 0.049922035 * white + 0.950066025 * b4;
    b5 = 0.049922035 * white + 0.950066025 * b5;
    b6 = 0.049922035 * white + 0.950066025 * b6;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6) * 0.1;
  }
}

/**
 * Generate brown (red) noise data in a buffer
 * Brown noise has energy inversely proportional to frequency
 * @param {Float32Array} data - Channel data array
 * @private
 */
function generateBrownNoiseData(data) {
  let lastOut = 0;

  for (let i = 0; i < data.length; i++) {
    const white = Math.random();
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5; // Normalize amplitude
  }
}

/**
 * Generate noise in a buffer based on type
 * @param {AudioBuffer} buffer - The audio buffer
 * @param {string} noiseType - Type of noise: 'white', 'pink', 'brown'
 * @private
 */
function generateNoiseBuffer(buffer, noiseType = "white") {
  const data = buffer.getChannelData(0);

  switch (noiseType.toLowerCase()) {
    case NOISE_CONFIG.NOISE_TYPES.PINK:
      generatePinkNoiseData(data);
      break;
    case NOISE_CONFIG.NOISE_TYPES.BROWN:
      generateBrownNoiseData(data);
      break;
    case NOISE_CONFIG.NOISE_TYPES.WHITE:
    default:
      generateWhiteNoiseData(data);
      break;
  }

  return buffer;
}

/**
 * Create a noise buffer for use in audio synthesis
 * Supports caching and multiple noise types
 *
 * @param {number} duration - Duration of the noise buffer in seconds
 * @param {string} [noiseType='white'] - Type of noise: 'white', 'pink', 'brown'
 * @param {boolean} [useCache=true] - Use cached buffer if available
 * @returns {AudioBuffer} The generated noise buffer
 * @throws {Error} If duration is invalid or audio context not initialized
 *
 * @example
 * // Generate white noise for 2 seconds
 * const buffer = createNoiseBuffer(2);
 *
 * @example
 * // Generate pink noise with caching disabled
 * const buffer = createNoiseBuffer(1.5, 'pink', false);
 */
export function createNoiseBuffer(
  duration,
  noiseType = "white",
  useCache = true
) {
  try {
    // Validate duration
    const durationResult = Validators.validateDuration(duration, {
      min: NOISE_CONFIG.MIN_DURATION,
      max: NOISE_CONFIG.MAX_DURATION,
    });
    Validators.throwIfInvalid(durationResult, "createNoiseBuffer");

    // Get or create audio context
    const audioCtx = getAudioContext();
    if (!audioCtx) {
      Logger.error(
        Logger.ERROR_CODES.AUDIO_CONTEXT_MISSING,
        "Cannot create noise buffer - audio context not initialized"
      );
      throw new Error("Audio context not initialized");
    }

    // Generate cache key
    const cacheKey = `noise_${duration}_${noiseType}`;

    // Check cache if enabled
    if (useCache && NOISE_CONFIG.ENABLE_CACHE && NOISE_CACHE.has(cacheKey)) {
      Logger.debug("Noise buffer cache hit", { duration, noiseType });
      return NOISE_CACHE.get(cacheKey);
    }

    // Calculate buffer size
    const bufferSize = audioCtx.sampleRate * duration;

    // Check memory limit
    if (bufferSize > NOISE_CONFIG.MAX_DURATION * audioCtx.sampleRate) {
      Logger.warn(
        Logger.WARNING_CODES.MEMORY_WARNING,
        "Large noise buffer requested",
        { duration, bufferSize }
      );
    }

    // Create buffer
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);

    // Generate noise data
    generateNoiseBuffer(buffer, noiseType);

    // Cache the buffer if enabled
    if (useCache && NOISE_CONFIG.ENABLE_CACHE) {
      if (NOISE_CACHE.size < NOISE_CONFIG.MAX_CACHE_SIZE) {
        NOISE_CACHE.set(cacheKey, buffer);
        Logger.debug("Noise buffer cached", {
          cacheKey,
          cacheSize: NOISE_CACHE.size,
        });
      } else {
        Logger.warn(
          Logger.WARNING_CODES.MEMORY_WARNING,
          "Noise cache at capacity",
          { maxSize: NOISE_CONFIG.MAX_CACHE_SIZE }
        );
      }
    }

    Logger.debug("Noise buffer created", { duration, noiseType, bufferSize });
    return buffer;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.NOISE_GENERATION_FAILED,
      `Failed to create noise buffer: ${error.message}`,
      { duration, noiseType },
      error
    );
    throw error;
  }
}

/**
 * Create a noise buffer for offline audio context
 * Supports caching and multiple noise types
 *
 * @param {OfflineAudioContext} ctx - The offline audio context
 * @param {number} duration - Duration of the noise buffer in seconds
 * @param {string} [noiseType='white'] - Type of noise: 'white', 'pink', 'brown'
 * @param {boolean} [useCache=true] - Use cached buffer if available
 * @returns {AudioBuffer} The generated noise buffer
 * @throws {Error} If context is invalid or duration is invalid
 *
 * @example
 * // Generate brown noise with offline context
 * const buffer = createOfflineNoiseBuffer(offlineCtx, 3, 'brown');
 */
export function createOfflineNoiseBuffer(
  ctx,
  duration,
  noiseType = "white",
  useCache = true
) {
  try {
    // Validate context
    if (!ctx || typeof ctx.createBuffer !== "function") {
      Logger.error(
        Logger.ERROR_CODES.AUDIO_CONTEXT_MISSING,
        "Invalid offline audio context"
      );
      throw new Error("Invalid offline audio context");
    }

    // Validate duration
    const durationResult = Validators.validateDuration(duration, {
      min: NOISE_CONFIG.MIN_DURATION,
      max: NOISE_CONFIG.MAX_DURATION,
    });
    Validators.throwIfInvalid(durationResult, "createOfflineNoiseBuffer");

    // Generate cache key (include context sample rate for offline)
    const cacheKey = `noise_offline_${duration}_${noiseType}_${ctx.sampleRate}`;

    // Check cache if enabled
    if (useCache && NOISE_CONFIG.ENABLE_CACHE && NOISE_CACHE.has(cacheKey)) {
      Logger.debug("Offline noise buffer cache hit", { duration, noiseType });
      return NOISE_CACHE.get(cacheKey);
    }

    // Calculate buffer size
    const bufferSize = ctx.sampleRate * duration;

    // Create buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);

    // Generate noise data
    generateNoiseBuffer(buffer, noiseType);

    // Cache the buffer if enabled
    if (useCache && NOISE_CONFIG.ENABLE_CACHE) {
      if (NOISE_CACHE.size < NOISE_CONFIG.MAX_CACHE_SIZE) {
        NOISE_CACHE.set(cacheKey, buffer);
        Logger.debug("Offline noise buffer cached", {
          cacheKey,
          cacheSize: NOISE_CACHE.size,
        });
      }
    }

    Logger.debug("Offline noise buffer created", {
      duration,
      noiseType,
      bufferSize,
    });
    return buffer;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.NOISE_GENERATION_FAILED,
      `Failed to create offline noise buffer: ${error.message}`,
      { duration, noiseType },
      error
    );
    throw error;
  }
}

/**
 * Clear the noise buffer cache
 * Useful for memory management during long sessions
 */
export function clearNoiseCache() {
  const previousSize = NOISE_CACHE.size;
  NOISE_CACHE.clear();
  Logger.info("Noise cache cleared", { previousSize });
}

/**
 * Get noise cache statistics
 * @returns {Object} Cache statistics
 */
export function getNoiseCacheStats() {
  return {
    size: NOISE_CACHE.size,
    maxSize: NOISE_CONFIG.MAX_CACHE_SIZE,
    keys: Array.from(NOISE_CACHE.keys()),
  };
}
