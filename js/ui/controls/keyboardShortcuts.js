/**
 * Keyboard Shortcuts Module
 * Handles keyboard event listeners and shortcuts
 */

import { saveState } from "../../state/stateManager.js";
import {
  closePianoRoll,
  clearAllNotes,
  getActiveSynthId,
} from "../pianoRoll.js";

/**
 * Show shortcuts modal
 */
export function showShortcuts() {
  document.getElementById("shortcutsModal").classList.add("open");
}

/**
 * Close shortcuts modal
 */
export function closeShortcuts() {
  document.getElementById("shortcutsModal").classList.remove("open");
}

/**
 * Setup shortcuts button
 */
export function setupShortcutsButton() {
  document
    .getElementById("showShortcutsBtn")
    .addEventListener("click", showShortcuts);
}

/**
 * Setup keyboard shortcuts
 */
export function setupKeyboardShortcuts(renderUICallback) {
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;

    const handledKeys = [" ", "Escape", "Delete", "Backspace", "?"];
    if (handledKeys.includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case " ":
        // Always trigger play button (which now toggles play/pause)
        document.getElementById("playBtn").click();
        break;

      case "Escape":
        if (getActiveSynthId() !== null) {
          closePianoRoll();
          renderUICallback();
        } else if (
          document.getElementById("shortcutsModal").classList.contains("open")
        ) {
          closeShortcuts();
        }
        break;

      case "Delete":
      case "Backspace":
        clearAllNotes();
        break;

      case "s":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          saveState();
        }
        break;

      case "?":
        showShortcuts();
        break;
    }
  });
}
