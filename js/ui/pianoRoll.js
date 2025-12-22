/**
 * Piano Roll Module
 * Handles piano roll UI and note editing
 */

import { STEP_COUNT, NOTES, OCTAVES } from "../constants.js";
import { getTracks, saveState } from "../state/stateManager.js";
import { playSynth, getAudioContext } from "../audio/audioEngine.js";
import { highlightTrackHeader } from "./trackRenderer.js";
import { showConfirm } from "../utils/confirmModal.js";

let activeSynthId = null;

/**
 * Open piano roll for a synth track
 */
function openPianoRoll(trackId) {
  activeSynthId = trackId;
  const track = getTracks().find((t) => t.id === trackId);
  document.getElementById("pianoRollTitle").innerText = `Editing: ${track.name}`;
  document.getElementById("pianoRollModal").classList.add("open");
  highlightTrackHeader(trackId);
  renderPianoRoll();
}

/**
 * Close piano roll
 */
function closePianoRoll() {
  document.getElementById("pianoRollModal").classList.remove("open");
  activeSynthId = null;
  saveState();
}

/**
 * Render piano roll grid
 */
function renderPianoRoll() {
  if (activeSynthId === null) return;
  const track = getTracks().find((t) => t.id === activeSynthId);
  const keysContainer = document.getElementById("pianoKeys");
  const gridContainer = document.getElementById("pianoGrid");

  keysContainer.innerHTML = "";
  gridContainer.innerHTML = "";

  // Add header row with step numbers
  const headerKeyDiv = document.createElement("div");
  headerKeyDiv.className = "h-8 border-b-2 border-gray-600 bg-gray-800 sticky top-0 z-20";
  keysContainer.appendChild(headerKeyDiv);

  const headerRowDiv = document.createElement("div");
  headerRowDiv.className =
    "h-8 flex min-w-max sticky top-0 z-20 bg-gray-800 border-b-2 border-gray-600";

  for (let s = 0; s < STEP_COUNT; s++) {
    const headerCell = document.createElement("div");
    headerCell.className = `piano-header-cell w-16 h-full border-r border-gray-700 flex items-center justify-center font-bold text-white text-sm ${
      s % 4 === 0 ? "border-l-2 border-l-gray-500" : ""
    }`;
    headerCell.textContent = s + 1;
    headerRowDiv.appendChild(headerCell);
  }
  gridContainer.appendChild(headerRowDiv);

  const allNotes = [];
  // Use OCTAVES constant for piano roll range (reversed for high-to-low display)
  for (let i = OCTAVES.length - 1; i >= 0; i--) {
    const octave = OCTAVES[i];
    for (let n = NOTES.length - 1; n >= 0; n--) {
      allNotes.push(NOTES[n] + octave);
    }
  }

  allNotes.forEach((noteName) => {
    const isBlack = noteName.includes("#");
    const keyDiv = document.createElement("div");
    keyDiv.className = `h-6 border-b border-gray-700 text-[10px] flex items-center justify-end pr-1 ${
      isBlack ? "bg-black text-white" : "bg-white text-black"
    }`;
    keyDiv.innerText = noteName;
    keysContainer.appendChild(keyDiv);

    const rowDiv = document.createElement("div");
    rowDiv.className = "h-6 flex min-w-max relative";

    for (let s = 0; s < STEP_COUNT; s++) {
      const cell = document.createElement("div");
      cell.className = `piano-grid-cell w-16 h-full border-r border-gray-800 ${
        s % 4 === 0 ? "border-l border-l-gray-600" : ""
      }`;

      // Add step number data attribute
      cell.dataset.stepNumber = s + 1;

      const existing = track.notes.find((n) => n.step === s && n.note === noteName);
      if (existing) {
        cell.classList.add("active-note");
      }

      // Add step number label to each cell
      const stepLabel = document.createElement("span");
      stepLabel.className = "step-number piano-step-number";
      stepLabel.textContent = s + 1;
      cell.appendChild(stepLabel);

      cell.onclick = () => toggleNote(track, s, noteName);
      rowDiv.appendChild(cell);
    }
    gridContainer.appendChild(rowDiv);
  });
}

/**
 * Toggle note on/off
 */
function toggleNote(track, step, noteName, velocity = 1.0) {
  const index = track.notes.findIndex((n) => n.step === step && n.note === noteName);

  if (index > -1) {
    track.notes.splice(index, 1);
  } else {
    track.notes = track.notes.filter((n) => n.step !== step);
    track.notes.push({
      step: step,
      note: noteName,
      len: 1,
      velocity: velocity,
    });
  }

  const audioCtx = getAudioContext();
  if (audioCtx && audioCtx.state === "running") {
    try {
      playSynth(track, { note: noteName, len: 1, velocity: velocity }, audioCtx.currentTime, 0.2);
    } catch (error) {
      console.error("Failed to play preview:", error);
    }
  }

  renderPianoRoll();
  saveState();
}

/**
 * Clear all notes for active track
 * Uses custom confirmation modal instead of native confirm()
 */
async function clearAllNotes() {
  if (activeSynthId === null) return;

  const track = getTracks().find((t) => t.id === activeSynthId);
  if (!track) return;

  const confirmed = await showConfirm({
    title: "Clear All Notes",
    message: `Are you sure you want to clear all notes for "${track.name}"? This action cannot be undone.`,
    confirmText: "Clear Notes",
    cancelText: "Cancel",
    danger: true,
  });

  if (confirmed) {
    track.notes = [];
    renderPianoRoll();
    saveState();

    // Announce to screen readers
    if (window.announce) {
      window.announce(`All notes cleared for ${track.name}`);
    }

    // Show toast notification
    if (window.toast) {
      window.toast.warning("Notes Cleared", `All notes have been cleared for ${track.name}`);
    }
  }
}

/**
 * Get active synth ID
 */
function getActiveSynthId() {
  return activeSynthId;
}

export {
  openPianoRoll,
  closePianoRoll,
  renderPianoRoll,
  toggleNote,
  clearAllNotes,
  getActiveSynthId,
};
