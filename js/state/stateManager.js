/**
 * State Management Module
 * Handles application state, storage, and state-related operations
 * Improved with validation, structuredClone, and extracted configuration
 */

import { Validators, ValidationResult } from "../utils/validators.js";
import { Logger } from "../utils/logger.js";
import {
  STATE_CONFIG,
  UI_CONFIG,
  TRACK_DEFAULTS,
  TRACK_COLORS,
} from "../config/audioConfig.js";
import { STEP_COUNT } from "../constants.js";

/**
 * Deep clone using structuredClone or JSON fallback
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
function deepClone(obj) {
  // Use native structuredClone if available (modern browsers)
  if (typeof structuredClone !== "undefined") {
    return structuredClone(obj);
  }

  // Fallback to JSON method for older browsers
  // Note: This has limitations (no functions, etc.)
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    Logger.warn(
      Logger.WARNING_CODES.MEMORY_WARNING,
      "Failed to deep clone object",
      { error: error.message }
    );
    return obj;
  }
}

/**
 * Default drum track configuration
 */
const DEFAULT_DRUM_TRACKS_CONFIG = [
  {
    id: 0,
    sound: "kick",
    name: "Kick",
    color: "bg-red-500",
    vol: 0.8,
    rev: 0,
    del: 0,
  },
  {
    id: 1,
    sound: "snare",
    name: "Snare",
    color: "bg-yellow-500",
    vol: 0.7,
    rev: 0.2,
    del: 0,
  },
  {
    id: 2,
    sound: "hihat",
    name: "HiHat",
    color: "bg-orange-400",
    vol: 0.6,
    rev: 0,
    del: 0,
  },
  {
    id: 3,
    sound: "clap",
    name: "Clap",
    color: "bg-pink-500",
    vol: 0.7,
    rev: 0.3,
    del: 0,
  },
  {
    id: 4,
    sound: "crash",
    name: "Crash",
    color: "bg-cyan-400",
    vol: 0.5,
    rev: 0.5,
    del: 0,
  },
  {
    id: 5,
    sound: "ride",
    name: "Ride",
    color: "bg-teal-400",
    vol: 0.5,
    rev: 0.2,
    del: 0,
  },
  {
    id: 6,
    sound: "rimshot",
    name: "Rimshot",
    color: "bg-amber-500",
    vol: 0.6,
    rev: 0.1,
    del: 0,
  },
  {
    id: 7,
    sound: "cowbell",
    name: "Cowbell",
    color: "bg-lime-500",
    vol: 0.6,
    rev: 0.2,
    del: 0,
  },
  {
    id: 8,
    sound: "tom-low",
    name: "Tom Low",
    color: "bg-rose-600",
    vol: 0.7,
    rev: 0.1,
    del: 0,
    pan: -0.3,
  },
  {
    id: 9,
    sound: "tom-mid",
    name: "Tom Mid",
    color: "bg-rose-500",
    vol: 0.7,
    rev: 0.1,
    del: 0,
  },
  {
    id: 10,
    sound: "tom-high",
    name: "Tom High",
    color: "bg-rose-400",
    vol: 0.7,
    rev: 0.1,
    del: 0,
    pan: 0.3,
  },
  {
    id: 11,
    sound: "shaker",
    name: "Shaker",
    color: "bg-emerald-400",
    vol: 0.4,
    rev: 0.1,
    del: 0,
    pan: 0.5,
  },
  {
    id: 12,
    sound: "tambourine",
    name: "Tambourine",
    color: "bg-violet-400",
    vol: 0.5,
    rev: 0.2,
    del: 0,
    pan: -0.5,
  },
];

/**
 * Default synth track configuration
 */
const DEFAULT_SYNTH_TRACKS_CONFIG = [
  {
    id: 13,
    synthType: "basic",
    name: "Bass",
    color: "bg-blue-600",
    vol: 0.6,
    wave: "sawtooth",
    cutoff: 600,
  },
  {
    id: 14,
    synthType: "basic",
    name: "Lead",
    color: "bg-purple-500",
    vol: 0.5,
    wave: "square",
    cutoff: 2000,
    rev: 0.4,
    del: 0.3,
  },
  {
    id: 15,
    synthType: "pad",
    name: "Pad",
    color: "bg-indigo-500",
    vol: 0.4,
    cutoff: 1500,
    rev: 0.6,
    del: 0.2,
  },
  {
    id: 16,
    synthType: "pluck",
    name: "Pluck",
    color: "bg-fuchsia-500",
    vol: 0.6,
    cutoff: 3000,
    rev: 0.2,
    del: 0.4,
    pan: 0.3,
  },
  {
    id: 17,
    synthType: "organ",
    name: "Organ",
    color: "bg-amber-600",
    vol: 0.5,
    rev: 0.3,
  },
  {
    id: 18,
    synthType: "fm",
    name: "FM Bell",
    color: "bg-sky-500",
    vol: 0.5,
    rev: 0.5,
    del: 0.3,
    pan: -0.3,
  },
  {
    id: 19,
    synthType: "subbass",
    name: "Sub Bass",
    color: "bg-slate-700",
    vol: 0.7,
  },
  {
    id: 20,
    synthType: "acidbass",
    name: "Acid Bass",
    color: "bg-green-600",
    vol: 0.6,
    cutoff: 200,
    distortion: 0.2,
  },
  {
    id: 21,
    synthType: "reesebass",
    name: "Reese Bass",
    color: "bg-blue-800",
    vol: 0.6,
    cutoff: 800,
    distortion: 0.1,
  },
];

/**
 * Create a drum track object
 */
function createDrumTrack(template) {
  return {
    ...template,
    type: "drum",
    steps: Array(STEP_COUNT).fill(false),
    pan: template.pan ?? 0,
    mute: false,
    solo: false,
    rev: template.rev ?? TRACK_DEFAULTS.DRUM.rev,
    del: template.del ?? TRACK_DEFAULTS.DRUM.del,
    distortion: template.distortion ?? TRACK_DEFAULTS.DRUM.distortion,
  };
}

/**
 * Create a synth track object
 */
function createSynthTrack(template) {
  return {
    ...template,
    type: "synth",
    notes: [],
    pan: template.pan ?? 0,
    mute: false,
    solo: false,
    rev: template.rev ?? TRACK_DEFAULTS.SYNTH.rev,
    del: template.del ?? TRACK_DEFAULTS.SYNTH.del,
    distortion: template.distortion ?? TRACK_DEFAULTS.SYNTH.distortion,
  };
}

/**
 * Create all default tracks
 */
function createDefaultTracks() {
  const drumTracks = DEFAULT_DRUM_TRACKS_CONFIG.map(createDrumTrack);
  const synthTracks = DEFAULT_SYNTH_TRACKS_CONFIG.map(createSynthTrack);
  return [...drumTracks, ...synthTracks];
}

/**
 * Create a default pattern
 */
function createDefaultPattern(id, name = null) {
  return {
    id,
    name: name || `Pattern ${id + 1}`,
    tracks: createDefaultTracks(),
  };
}

/**
 * Initialize default state
 */
const DEFAULT_STATE = {
  bpm: STATE_CONFIG.DEFAULT_BPM,
  isPlaying: false,
  currentStep: 0,
  nextNoteTime: 0,
  timerID: null,
  currentPattern: 0,
  patterns: [createDefaultPattern(0, "Pattern 1")],
};

// --- STATE ---
const state = deepClone(DEFAULT_STATE);

/**
 * Get current tracks
 * @returns {Array} Array of tracks for current pattern
 */
function getTracks() {
  const pattern = state.patterns[state.currentPattern];
  if (!pattern || !Array.isArray(pattern.tracks)) {
    Logger.error(Logger.ERROR_CODES.INVALID_STATE, "Invalid pattern or tracks");
    return [];
  }
  return pattern.tracks;
}

/**
 * Get state object
 * @returns {Object} Current state
 */
function getState() {
  return state;
}

/**
 * Save state to localStorage with validation
 */
function saveState() {
  try {
    const data = {
      patterns: state.patterns,
      currentPattern: state.currentPattern,
      bpm: state.bpm,
    };

    // Validate BPM before saving
    const bpmResult = Validators.validateBPM(data.bpm);
    if (!bpmResult.isValid) {
      Logger.warn(
        Logger.WARNING_CODES.MEMORY_WARNING,
        "Invalid BPM in state, using default",
        { bpm: data.bpm }
      );
      data.bpm = STATE_CONFIG.DEFAULT_BPM;
    }

    localStorage.setItem(STATE_CONFIG.STORAGE_KEY, JSON.stringify(data));
    Logger.debug("State saved to localStorage", {
      patterns: data.patterns.length,
    });
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.STATE_SAVE_FAILED,
      `Failed to save state: ${error.message}`,
      {},
      error
    );
  }
}

/**
 * Load state from localStorage with error handling
 */
function loadState() {
  try {
    const saved = localStorage.getItem(STATE_CONFIG.STORAGE_KEY);
    if (!saved) {
      Logger.debug("No saved state found in localStorage");
      return;
    }

    const data = JSON.parse(saved);

    // Validate and set BPM
    if (data.bpm !== undefined) {
      const bpmResult = Validators.validateBPM(data.bpm);
      if (bpmResult.isValid) {
        state.bpm = data.bpm;
      } else {
        Logger.warn(
          Logger.WARNING_CODES.MEMORY_WARNING,
          `Invalid BPM in saved state: ${bpmResult.error}`
        );
        state.bpm = STATE_CONFIG.DEFAULT_BPM;
      }
    }

    // Update UI if available
    const bpmInput = document.getElementById("bpmInput");
    if (bpmInput) {
      bpmInput.value = state.bpm;
    }

    // Validate and set pattern
    if (
      data.currentPattern !== undefined &&
      data.currentPattern >= 0 &&
      data.currentPattern < data.patterns?.length
    ) {
      state.currentPattern = data.currentPattern;
    }

    // Validate and set patterns
    if (Array.isArray(data.patterns) && data.patterns.length > 0) {
      const validPatterns = data.patterns.filter((pattern) => {
        const result = Validators.validatePattern(pattern);
        if (!result.isValid) {
          Logger.warn(
            Logger.WARNING_CODES.MEMORY_WARNING,
            `Skipping invalid pattern: ${result.error}`
          );
          return false;
        }
        return true;
      });

      if (validPatterns.length > 0) {
        state.patterns = validPatterns;
        Logger.info("State loaded from localStorage", {
          patterns: validPatterns.length,
        });
      } else {
        Logger.warn(
          Logger.WARNING_CODES.MEMORY_WARNING,
          "No valid patterns found in saved state, using default"
        );
        state.patterns = [createDefaultPattern(0, "Pattern 1")];
      }
    }
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.STATE_LOAD_FAILED,
      `Failed to load state: ${error.message}`,
      {},
      error
    );
  }
}

/**
 * Create new pattern
 * @returns {number} ID of new pattern
 */
function createNewPattern() {
  try {
    const newPattern = createDefaultPattern(
      state.patterns.length,
      `Pattern ${state.patterns.length + 1}`
    );

    // Validate pattern
    const result = Validators.validatePattern(newPattern);
    Validators.throwIfInvalid(result, "createNewPattern");

    state.patterns.push(newPattern);
    saveState();

    Logger.info("New pattern created", {
      id: newPattern.id,
      name: newPattern.name,
    });
    return newPattern.id;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.INVALID_PATTERN,
      `Failed to create new pattern: ${error.message}`,
      {},
      error
    );
    throw error;
  }
}

/**
 * Switch to a different pattern
 * @param {number} patternId - Pattern ID to switch to
 * @returns {boolean} Success
 */
function switchPattern(patternId) {
  try {
    if (patternId < 0 || patternId >= state.patterns.length) {
      Logger.warn(Logger.WARNING_CODES.MEMORY_WARNING, "Invalid pattern ID", {
        patternId,
      });
      return false;
    }

    state.currentPattern = patternId;
    saveState();

    Logger.debug("Pattern switched", { patternId });
    return true;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.INVALID_STATE,
      `Failed to switch pattern: ${error.message}`,
      { patternId },
      error
    );
    return false;
  }
}

/**
 * Duplicate a pattern
 * @param {number} patternId - Pattern ID to duplicate
 * @returns {number|null} ID of new pattern or null
 */
function duplicatePattern(patternId) {
  try {
    const pattern = state.patterns[patternId];
    if (!pattern) {
      Logger.warn(Logger.WARNING_CODES.MEMORY_WARNING, "Pattern not found", {
        patternId,
      });
      return null;
    }

    const newPattern = {
      id: state.patterns.length,
      name: `${pattern.name} (Copy)`,
      tracks: deepClone(pattern.tracks),
    };

    // Validate new pattern
    const result = Validators.validatePattern(newPattern);
    Validators.throwIfInvalid(result, "duplicatePattern");

    state.patterns.push(newPattern);
    saveState();

    Logger.info("Pattern duplicated", {
      original: patternId,
      duplicate: newPattern.id,
    });
    return newPattern.id;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.INVALID_PATTERN,
      `Failed to duplicate pattern: ${error.message}`,
      { patternId },
      error
    );
    return null;
  }
}

/**
 * Delete a pattern
 * @param {number} patternId - Pattern ID to delete
 * @returns {boolean} Success
 */
function deletePattern(patternId) {
  try {
    if (state.patterns.length <= STATE_CONFIG.MIN_PATTERNS) {
      Logger.warn(
        Logger.WARNING_CODES.MEMORY_WARNING,
        `Cannot delete pattern - minimum ${STATE_CONFIG.MIN_PATTERNS} pattern required`
      );
      return false;
    }

    if (patternId < 0 || patternId >= state.patterns.length) {
      Logger.warn(Logger.WARNING_CODES.MEMORY_WARNING, "Invalid pattern ID", {
        patternId,
      });
      return false;
    }

    const deletedPattern = state.patterns[patternId];
    state.patterns.splice(patternId, 1);

    // Re-index patterns
    state.patterns.forEach((p, i) => (p.id = i));

    // Adjust current pattern if needed
    if (state.currentPattern >= state.patterns.length) {
      state.currentPattern = state.patterns.length - 1;
    }

    saveState();

    Logger.info("Pattern deleted", {
      id: deletedPattern.id,
      name: deletedPattern.name,
    });
    return true;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.INVALID_STATE,
      `Failed to delete pattern: ${error.message}`,
      { patternId },
      error
    );
    return false;
  }
}

/**
 * Clear all data and reset to default state
 * @returns {boolean} Success
 */
function clearState() {
  try {
    if (
      !confirm(
        "Are you sure you want to clear all notes and reset to default? This cannot be undone!"
      )
    ) {
      return false;
    }

    // Clear localStorage
    localStorage.removeItem(STATE_CONFIG.STORAGE_KEY);

    // Reset all tracks in current pattern to empty
    const currentPattern = state.patterns[state.currentPattern];
    if (currentPattern && currentPattern.tracks) {
      currentPattern.tracks.forEach((track) => {
        if (track.type === "drum") {
          track.steps = Array(STEP_COUNT).fill(false);
        } else {
          track.notes = [];
        }
      });
    }

    // Reset BPM to default
    state.bpm = STATE_CONFIG.DEFAULT_BPM;
    const bpmInput = document.getElementById("bpmInput");
    if (bpmInput) {
      bpmInput.value = state.bpm;
    }

    // Reset to first pattern
    state.currentPattern = 0;

    Logger.info("All data cleared and reset to default");
    return true;
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.INVALID_STATE,
      `Failed to clear state: ${error.message}`,
      {},
      error
    );
    return false;
  }
}

export {
  state,
  getState,
  getTracks,
  saveState,
  loadState,
  createNewPattern,
  switchPattern,
  duplicatePattern,
  deletePattern,
  clearState,
  createDefaultPattern,
  createDefaultTracks,
  deepClone,
};
