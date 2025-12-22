/**
 * Accessibility Utilities
 * Handles loading overlay, network status, and ARIA announcements
 */

import { Logger } from "./logger.js";

/**
 * Hide loading overlay with smooth transition
 */
export function hideLoadingOverlay() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.classList.add("hidden");
    Logger.info("Loading overlay hidden");
  }
}

/**
 * Show loading overlay
 */
export function showLoadingOverlay() {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.classList.remove("hidden");
  }
}

/**
 * Update loading text
 * @param {string} text - Main loading text
 * @param {string} subtext - Secondary loading text
 */
export function updateLoadingText(text, subtext = "") {
  const loadingText = document.querySelector(".loading-text");
  const loadingSubtext = document.querySelector(".loading-subtext");

  if (loadingText && text) {
    loadingText.textContent = text;
  }
  if (loadingSubtext) {
    loadingSubtext.textContent = subtext;
  }
}

/**
 * Initialize network status indicator
 */
export function initNetworkStatus() {
  const statusElement = document.getElementById("networkStatus");
  if (!statusElement) return;

  function updateStatus() {
    const icon = statusElement.querySelector("i");
    const text = statusElement.querySelector("span");

    if (navigator.onLine) {
      statusElement.classList.remove("show");
      statusElement.classList.add("online");
      if (icon) icon.className = "fas fa-wifi";
      if (text) text.textContent = "Online";

      // Hide after brief display
      setTimeout(() => {
        statusElement.classList.remove("show");
      }, 2000);
    } else {
      statusElement.classList.remove("online");
      statusElement.classList.add("show");
      if (icon) icon.className = "fas fa-wifi-slash";
      if (text) text.textContent = "Offline Mode";
    }
  }

  // Initial check
  if (!navigator.onLine) {
    updateStatus();
  }

  // Listen for network changes
  window.addEventListener("online", () => {
    updateStatus();
    announce("Connection restored. You are now online.");
    Logger.info("Network status: online");
  });

  window.addEventListener("offline", () => {
    updateStatus();
    announce("Connection lost. Working offline.");
    Logger.warn("Network status: offline");
  });

  Logger.info("Network status indicator initialized");
}

/**
 * Announce message to screen readers via ARIA live region
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announce(message, priority = "polite") {
  const announcer = document.getElementById("ariaAnnouncer");
  if (!announcer) return;

  // Set appropriate priority
  announcer.setAttribute("aria-live", priority);

  // Clear and set new message (triggers announcement)
  announcer.textContent = "";

  // Small delay to ensure screen reader picks up the change
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

/**
 * Announce step toggle for screen readers
 * @param {string} trackName - Name of the track
 * @param {number} step - Step number (1-16)
 * @param {boolean} isActive - Whether step is now active
 */
export function announceStepToggle(trackName, step, isActive) {
  const status = isActive ? "activated" : "deactivated";
  announce(`${trackName}, step ${step} ${status}`, "polite");
}

/**
 * Announce note toggle for piano roll
 * @param {string} note - Note name (e.g., "C4")
 * @param {number} step - Step number
 * @param {boolean} isActive - Whether note is now active
 */
export function announceNoteToggle(note, step, isActive) {
  const status = isActive ? "added" : "removed";
  announce(`Note ${note} at step ${step} ${status}`, "polite");
}

/**
 * Announce transport state change
 * @param {string} state - 'playing', 'stopped', 'recording'
 */
export function announceTransport(state) {
  const messages = {
    playing: "Playback started",
    stopped: "Playback stopped",
    recording: "Recording started",
    recordingStopped: "Recording stopped",
  };

  if (messages[state]) {
    announce(messages[state], "assertive");
  }
}

/**
 * Initialize all accessibility features
 */
export function initAccessibility() {
  try {
    initNetworkStatus();

    // Hide loading overlay immediately
    hideLoadingOverlay();

    Logger.info("Accessibility features initialized");
  } catch (err) {
    Logger.error(
      Logger.ERROR_CODES.UI_INITIALIZATION_FAILED,
      "Error initializing accessibility features",
      {},
      err
    );
    // Still try to hide loading overlay even if there's an error
    hideLoadingOverlay();
  }
}

// Expose to global scope for use in HTML handlers
window.announce = announce;
window.hideLoadingOverlay = hideLoadingOverlay;
