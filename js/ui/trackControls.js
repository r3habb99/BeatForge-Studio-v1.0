/**
 * Track Controls Module
 * Handles track parameter updates and control functions
 * SECURITY & QUALITY FIX: Added null checks, validation, and error handling
 */

import { getTracks, saveState } from "../state/stateManager.js";
import { Logger } from "../utils/logger.js";
import { Validators } from "../utils/validators.js";

/**
 * Toggle step on/off
 */
export function toggleStep(trackId, step) {
  const track = getTracks().find((t) => t.id === trackId);
  if (!track) {
    Logger.error(
      Logger.ERROR_CODES.INVALID_TRACK,
      `Track ${trackId} not found`
    );
    return false;
  }
  if (step < 0 || step >= track.steps.length) {
    Logger.error(Logger.ERROR_CODES.INVALID_PARAMETER, `Invalid step ${step}`);
    return false;
  }
  track.steps[step] = !track.steps[step];
  saveState();
  return true;
}

/**
 * Update track parameter with validation
 * @param {string} id - Track identifier
 * @param {string} param - Parameter name
 * @param {any} value - Parameter value
 * @returns {boolean} Success status
 */
export function updateTrackParam(id, param, value) {
  try {
    const track = getTracks().find((t) => t.id === id);

    // CRITICAL FIX: Check if track exists
    if (!track) {
      Logger.error(Logger.ERROR_CODES.INVALID_TRACK, `Track not found: ${id}`);
      return false;
    }

    // CRITICAL FIX: Validate numeric value
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      Logger.warn(
        Logger.WARNING_CODES.VALIDATION_WARNING,
        `Invalid numeric value for ${param}: ${value}`
      );
      return false;
    }

    // Validate parameter ranges
    let isValid = true;
    let errorMsg = "";

    switch (param) {
      case "vol":
      case "rev":
      case "del":
      case "distortion":
        if (numValue < 0 || numValue > 1) {
          isValid = false;
          errorMsg = `${param} must be between 0 and 1`;
        }
        break;
      case "pan":
        if (numValue < -1 || numValue > 1) {
          isValid = false;
          errorMsg = `${param} must be between -1 and 1`;
        }
        break;
      default:
        // Allow other parameters without range validation
        break;
    }

    if (!isValid) {
      Logger.warn(Logger.WARNING_CODES.VALIDATION_WARNING, errorMsg);
      return false;
    }

    track[param] = numValue;
    saveState();
    return true;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.OPERATION_FAILED,
      "Failed to update track parameter",
      { id, param, value },
      error
    );
    return false;
  }
}

/**
 * Toggle mute with error handling
 * @param {string} id - Track identifier
 * @returns {boolean} Success status
 */
export function toggleMute(id) {
  try {
    const track = getTracks().find((t) => t.id === id);

    // CRITICAL FIX: Check if track exists
    if (!track) {
      Logger.error(Logger.ERROR_CODES.INVALID_TRACK, `Track not found: ${id}`);
      return false;
    }

    track.mute = !track.mute;
    saveState();
    return true;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.OPERATION_FAILED,
      "Failed to toggle mute",
      { id },
      error
    );
    return false;
  }
}

/**
 * Toggle solo with error handling
 * @param {string} id - Track identifier
 * @returns {boolean} Success status
 */
export function toggleSolo(id) {
  try {
    const track = getTracks().find((t) => t.id === id);

    // CRITICAL FIX: Check if track exists
    if (!track) {
      Logger.error(Logger.ERROR_CODES.INVALID_TRACK, `Track not found: ${id}`);
      return false;
    }

    track.solo = !track.solo;
    saveState();
    return true;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.OPERATION_FAILED,
      "Failed to toggle solo",
      { id },
      error
    );
    return false;
  }
}
