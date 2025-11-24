/**
 * State Management Module
 * Handles application state, storage, and state-related operations
 */

import { STEP_COUNT } from "../constants.js";

// --- STATE ---
const state = {
  bpm: 120,
  isPlaying: false,
  currentStep: 0,
  nextNoteTime: 0,
  timerID: null,
  currentPattern: 0,
  patterns: [
    {
      id: 0,
      name: "Pattern 1",
      tracks: [
        // Drums
        {
          id: 0,
          type: "drum",
          name: "Kick",
          color: "bg-red-500",
          steps: Array(16).fill(false),
          vol: 0.8,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0,
          del: 0,
          distortion: 0,
          sound: "kick",
        },
        {
          id: 1,
          type: "drum",
          name: "Snare",
          color: "bg-yellow-500",
          steps: Array(16).fill(false),
          vol: 0.7,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.2,
          del: 0,
          distortion: 0,
          sound: "snare",
        },
        {
          id: 2,
          type: "drum",
          name: "HiHat",
          color: "bg-orange-400",
          steps: Array(16).fill(false),
          vol: 0.6,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0,
          del: 0,
          distortion: 0,
          sound: "hihat",
        },
        {
          id: 3,
          type: "drum",
          name: "Clap",
          color: "bg-pink-500",
          steps: Array(16).fill(false),
          vol: 0.7,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.3,
          del: 0,
          distortion: 0,
          sound: "clap",
        },
        {
          id: 4,
          type: "drum",
          name: "Crash",
          color: "bg-cyan-400",
          steps: Array(16).fill(false),
          vol: 0.5,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.5,
          del: 0,
          distortion: 0,
          sound: "crash",
        },
        {
          id: 5,
          type: "drum",
          name: "Ride",
          color: "bg-teal-400",
          steps: Array(16).fill(false),
          vol: 0.5,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.2,
          del: 0,
          distortion: 0,
          sound: "ride",
        },
        {
          id: 6,
          type: "drum",
          name: "Rimshot",
          color: "bg-amber-500",
          steps: Array(16).fill(false),
          vol: 0.6,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.1,
          del: 0,
          distortion: 0,
          sound: "rimshot",
        },
        {
          id: 7,
          type: "drum",
          name: "Cowbell",
          color: "bg-lime-500",
          steps: Array(16).fill(false),
          vol: 0.6,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.2,
          del: 0,
          distortion: 0,
          sound: "cowbell",
        },
        {
          id: 8,
          type: "drum",
          name: "Tom Low",
          color: "bg-rose-600",
          steps: Array(16).fill(false),
          vol: 0.7,
          pan: -0.3,
          mute: false,
          solo: false,
          rev: 0.1,
          del: 0,
          distortion: 0,
          sound: "tom-low",
        },
        {
          id: 9,
          type: "drum",
          name: "Tom Mid",
          color: "bg-rose-500",
          steps: Array(16).fill(false),
          vol: 0.7,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.1,
          del: 0,
          distortion: 0,
          sound: "tom-mid",
        },
        {
          id: 10,
          type: "drum",
          name: "Tom High",
          color: "bg-rose-400",
          steps: Array(16).fill(false),
          vol: 0.7,
          pan: 0.3,
          mute: false,
          solo: false,
          rev: 0.1,
          del: 0,
          distortion: 0,
          sound: "tom-high",
        },
        {
          id: 11,
          type: "drum",
          name: "Shaker",
          color: "bg-emerald-400",
          steps: Array(16).fill(false),
          vol: 0.4,
          pan: 0.5,
          mute: false,
          solo: false,
          rev: 0.1,
          del: 0,
          distortion: 0,
          sound: "shaker",
        },
        {
          id: 12,
          type: "drum",
          name: "Tambourine",
          color: "bg-violet-400",
          steps: Array(16).fill(false),
          vol: 0.5,
          pan: -0.5,
          mute: false,
          solo: false,
          rev: 0.2,
          del: 0,
          distortion: 0,
          sound: "tambourine",
        },

        // Synths
        {
          id: 13,
          type: "synth",
          name: "Bass",
          color: "bg-blue-600",
          notes: [],
          vol: 0.6,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.1,
          del: 0,
          distortion: 0,
          wave: "sawtooth",
          cutoff: 600,
          synthType: "basic",
        },
        {
          id: 14,
          type: "synth",
          name: "Lead",
          color: "bg-purple-500",
          notes: [],
          vol: 0.5,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.4,
          del: 0.3,
          distortion: 0,
          wave: "square",
          cutoff: 2000,
          synthType: "basic",
        },
        {
          id: 15,
          type: "synth",
          name: "Pad",
          color: "bg-indigo-500",
          notes: [],
          vol: 0.4,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.6,
          del: 0.2,
          distortion: 0,
          cutoff: 1500,
          synthType: "pad",
        },
        {
          id: 16,
          type: "synth",
          name: "Pluck",
          color: "bg-fuchsia-500",
          notes: [],
          vol: 0.6,
          pan: 0.3,
          mute: false,
          solo: false,
          rev: 0.2,
          del: 0.4,
          distortion: 0,
          cutoff: 3000,
          synthType: "pluck",
        },
        {
          id: 17,
          type: "synth",
          name: "Organ",
          color: "bg-amber-600",
          notes: [],
          vol: 0.5,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.3,
          del: 0,
          distortion: 0,
          synthType: "organ",
        },
        {
          id: 18,
          type: "synth",
          name: "FM Bell",
          color: "bg-sky-500",
          notes: [],
          vol: 0.5,
          pan: -0.3,
          mute: false,
          solo: false,
          rev: 0.5,
          del: 0.3,
          distortion: 0,
          synthType: "fm",
        },
        {
          id: 19,
          type: "synth",
          name: "Sub Bass",
          color: "bg-slate-700",
          notes: [],
          vol: 0.7,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0,
          del: 0,
          distortion: 0,
          synthType: "subbass",
        },
        {
          id: 20,
          type: "synth",
          name: "Acid Bass",
          color: "bg-green-600",
          notes: [],
          vol: 0.6,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.1,
          del: 0,
          distortion: 0.2,
          cutoff: 200,
          synthType: "acidbass",
        },
        {
          id: 21,
          type: "synth",
          name: "Reese Bass",
          color: "bg-blue-800",
          notes: [],
          vol: 0.6,
          pan: 0,
          mute: false,
          solo: false,
          rev: 0.1,
          del: 0,
          distortion: 0.1,
          cutoff: 800,
          synthType: "reesebass",
        },
      ],
    },
  ],
};

/**
 * Get current tracks
 */
function getTracks() {
  return state.patterns[state.currentPattern].tracks;
}

/**
 * Get state object
 */
function getState() {
  return state;
}

/**
 * Save state to localStorage
 */
function saveState() {
  const data = {
    patterns: state.patterns,
    currentPattern: state.currentPattern,
    bpm: state.bpm,
  };
  localStorage.setItem("beatforge_state", JSON.stringify(data));
}

/**
 * Load state from localStorage
 */
function loadState() {
  const saved = localStorage.getItem("beatforge_state");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      state.bpm = data.bpm || 120;
      document.getElementById("bpmInput").value = state.bpm;

      if (data.currentPattern !== undefined)
        state.currentPattern = data.currentPattern;
      if (data.patterns) {
        state.patterns = data.patterns;
      }
    } catch (e) {
      console.error("Failed to load state:", e);
    }
  }
}

/**
 * Create new pattern
 */
function createNewPattern() {
  const newPattern = {
    id: state.patterns.length,
    name: `Pattern ${state.patterns.length + 1}`,
    tracks: JSON.parse(JSON.stringify(state.patterns[0].tracks)), // Deep clone
  };
  // Reset all steps and notes in new pattern
  newPattern.tracks.forEach((track) => {
    if (track.type === "drum") {
      track.steps = Array(16).fill(false);
    } else {
      track.notes = [];
    }
  });
  state.patterns.push(newPattern);
  saveState();
  return newPattern.id;
}

/**
 * Switch to a different pattern
 */
function switchPattern(patternId) {
  if (patternId >= 0 && patternId < state.patterns.length) {
    state.currentPattern = patternId;
    saveState();
    return true;
  }
  return false;
}

/**
 * Duplicate a pattern
 */
function duplicatePattern(patternId) {
  const pattern = state.patterns[patternId];
  if (!pattern) return;

  const newPattern = {
    id: state.patterns.length,
    name: `${pattern.name} (Copy)`,
    tracks: JSON.parse(JSON.stringify(pattern.tracks)),
  };
  state.patterns.push(newPattern);
  saveState();
  return newPattern.id;
}

/**
 * Delete a pattern
 */
function deletePattern(patternId) {
  if (state.patterns.length <= 1) {
    alert("Cannot delete the last pattern!");
    return false;
  }
  state.patterns.splice(patternId, 1);
  // Re-index patterns
  state.patterns.forEach((p, i) => (p.id = i));
  if (state.currentPattern >= state.patterns.length) {
    state.currentPattern = state.patterns.length - 1;
  }
  saveState();
  return true;
}

/**
 * Clear all data and reset to default state
 */
function clearState() {
  if (
    !confirm(
      "Are you sure you want to clear all notes and reset to default? This cannot be undone!"
    )
  ) {
    return false;
  }

  // Clear localStorage
  localStorage.removeItem("beatforge_state");

  // Reset all tracks to default (empty)
  state.patterns[state.currentPattern].tracks.forEach((track) => {
    if (track.type === "drum") {
      track.steps = Array(STEP_COUNT).fill(false);
    } else {
      track.notes = [];
    }
  });

  // Reset BPM to default
  state.bpm = 120;
  document.getElementById("bpmInput").value = state.bpm;

  // Reset to first pattern
  state.currentPattern = 0;

  return true;
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
};
