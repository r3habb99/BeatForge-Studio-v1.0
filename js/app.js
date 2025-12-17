/**
 * Main Application Logic
 * Orchestrates all modules and handles initialization
 * Uses BeatForge namespace to avoid global scope pollution
 */

// Import modules
import {
  initAudio,
  getAudioContext,
  exportToWAV,
  hasRecording,
  exportRecording,
} from "./audio/audioEngine.js";
import { loadState, getState, getTracks, clearState } from "./state/stateManager.js";
import { startScheduler } from "./scheduler/scheduler.js";
import { drawVisualizer, initVisualizerMode } from "./ui/visualizer.js";
import { updatePatternSelector } from "./ui/patternManager.js";
import { renderTracksUI } from "./ui/trackRenderer.js";
import { openPianoRoll, closePianoRoll } from "./ui/pianoRoll.js";
import { setupEventListeners, showShortcuts, closeShortcuts } from "./ui/eventHandlers.js";
import { initScrollSync } from "./ui/scrollSync.js";
import { initMobileMenu } from "./ui/mobileMenu.js";

// Import UI enhancements
import { toast } from "./utils/toast.js";
import { initTheme } from "./utils/theme.js";
import { initTooltips } from "./utils/tooltip.js";
import { initShortcutsOverlay } from "./utils/shortcutsOverlay.js";
import { initTrackColors } from "./utils/trackColors.js";
import { initActionsMenu } from "./ui/actionsMenu.js";
import { Logger } from "./utils/logger.js";
import { initErrorBoundary } from "./utils/errorBoundary.js";

// Import configuration
import { getConfig, getEnvironment, setEnvironment } from "./config/audioConfig.js";

// Import accessibility utilities
import {
  initAccessibility,
  hideLoadingOverlay,
  updateLoadingText,
  announce,
  announceTransport,
} from "./utils/accessibility.js";

// Import confirmation modal
import { showConfirm } from "./utils/confirmModal.js";

// Import input validation
import { initInputValidation } from "./utils/inputValidation.js";

/**
 * Initialize configuration based on environment
 */
function initializeConfig() {
  const environment = getEnvironment();
  const config = getConfig(environment);

  // CRITICAL: Initialize global error boundary FIRST
  initErrorBoundary();

  // Log environment and config status
  Logger.info(`Environment: ${environment}`);
  Logger.info(`Logging enabled: ${config.ENABLE_LOGGING}`);
  Logger.info(`Log level: ${config.LOG_LEVEL}`);

  // Store config globally for access by other modules
  window.BEATFORGE_CONFIG = config;
  window.BEATFORGE_ENV = environment;

  // Expose utilities for dev/debugging
  if (environment === "development") {
    window.setEnvironment = setEnvironment;
    window.getEnvironment = getEnvironment;
    window.getConfig = getConfig;
    console.info(
      "BeatForge environment utilities available: setEnvironment(), getEnvironment(), getConfig()"
    );
    console.info('Usage: setEnvironment("production") then reload page');
  }
}

/**
 * Hide all audio initialization buttons
 */
function hideAllInitAudioButtons() {
  const buttons = [
    document.getElementById("initAudioBtn"),
    document.getElementById("initAudioBtnHeader"),
    document.getElementById("initAudioBtnMobile"),
  ];
  buttons.forEach((btn) => {
    if (btn) btn.classList.add("hidden");
  });
}

/**
 * Show all audio initialization buttons (for retry)
 */
function showAllInitAudioButtons() {
  const buttons = [
    document.getElementById("initAudioBtn"),
    document.getElementById("initAudioBtnHeader"),
    document.getElementById("initAudioBtnMobile"),
  ];
  buttons.forEach((btn) => {
    if (btn) {
      btn.classList.remove("hidden");
      btn.classList.remove("animate-pulse");
    }
  });
}

/**
 * Initialize audio and UI
 */
function initializeApp() {
  // Initialize config first
  initializeConfig();
  try {
    initAudio();
    drawVisualizer();
    startScheduler();
    hideAllInitAudioButtons();
    loadState();
    renderUI();
    Logger.info("Application initialized successfully");
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.UI_INITIALIZATION_FAILED,
      `Failed to initialize application: ${error.message}`,
      {},
      error
    );
    alert(
      `Audio Initialization Failed: ${error.message}\n\nPlease check your browser settings and ensure audio is not blocked.`
    );
    showAllInitAudioButtons();
    document.getElementById("initAudioBtn").innerText = "Retry Audio Init";
  }
}

/**
 * Render UI
 */
function renderUI() {
  updatePatternSelector();
  renderTracksUI(openPianoRoll);
}

/**
 * Export project to WAV file
 */
async function exportProject() {
  try {
    // Check if audio is initialized
    const audioCtx = getAudioContext();
    if (!audioCtx) {
      alert('Please initialize audio first by clicking the "Initialize Audio" button.');
      return;
    }

    // Get current state and tracks
    const state = getState();
    const tracks = getTracks();

    // Check if there's anything to export
    const hasDrumNotes = tracks.some((t) => t.type === "drum" && t.steps.some((s) => s));
    const hasSynthNotes = tracks.some((t) => t.type === "synth" && t.notes.length > 0);

    if (!hasDrumNotes && !hasSynthNotes) {
      alert("No notes to export! Please add some notes to your pattern first.");
      return;
    }

    // Show progress message
    const exportBtn = document.getElementById("exportBtn");
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i><span>Exporting...</span>';
    exportBtn.disabled = true;

    Logger.info("Starting project export");

    // Check if there's a recording to export
    if (hasRecording()) {
      // Export the recorded audio
      await exportRecording(`music-studio-recording-${Date.now()}.webm`);
      if (window.toast) {
        window.toast.success("Export Complete", "Your recording has been downloaded successfully!");
      } else {
        alert("Recording exported successfully! Your audio file has been downloaded.");
      }
      Logger.info("Recording exported successfully");
    } else {
      // Fallback to offline rendering (old behavior)
      await exportToWAV(state, tracks);
      if (window.toast) {
        window.toast.success(
          "Export Complete",
          "Your audio file has been downloaded successfully!"
        );
      } else {
        alert("Export completed successfully! Your audio file has been downloaded.");
      }
      Logger.info("Project exported to WAV successfully");
    }

    // Restore button
    exportBtn.innerHTML = originalText;
    exportBtn.disabled = false;
  } catch (error) {
    Logger.error(Logger.ERROR_CODES.EXPORT_FAILED, `Export failed: ${error.message}`, {}, error);
    if (window.toast) {
      window.toast.error("Export Failed", error.message || "An error occurred during export");
    } else {
      alert("Export failed: " + error.message);
    }

    // Restore button
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
      exportBtn.innerHTML = '<i class="fas fa-download mr-1"></i><span>Export</span>';
      exportBtn.disabled = false;
    }
  }
}

/**
 * Clear all data and reset to default
 * Uses custom confirmation modal instead of native confirm()
 */
async function clearAllData() {
  const confirmed = await showConfirm({
    title: "Clear All Data",
    message:
      "Are you sure you want to clear all tracks and reset to default? This action cannot be undone.",
    confirmText: "Clear All",
    cancelText: "Cancel",
    danger: true,
  });

  if (confirmed) {
    const cleared = clearState();
    if (cleared) {
      renderUI();
      if (window.toast) {
        window.toast.warning("Data Cleared", "All tracks have been reset");
      }
      Logger.info("All data cleared and reset");
    }
  }
}

/**
 * BeatForge Application Namespace
 * Provides organized access to all public API functions
 * Prevents global scope pollution
 */
const BeatForge = {
  // Version and metadata
  VERSION: "1.0.0",
  NAME: "BeatForge Studio",

  // UI Functions
  UI: {
    openPianoRoll,
    closePianoRoll,
    showShortcuts,
    closeShortcuts,
    renderUI,
  },

  // Project Functions
  Project: {
    exportProject,
    clearAllData,
    loadState,
    getState,
    getTracks,
  },

  // Initialization
  initialize: initializeApp,
  isInitialized: () => getAudioContext() !== null,

  // Logger access for debugging
  logger: Logger,

  // Helper function to get API documentation
  help: function () {
    console.log(
      "%c BeatForge Studio API Documentation",
      "color: #4CAF50; font-size: 16px; font-weight: bold;"
    );
    console.log(
      "%cUI Functions:%c\n" +
        "  BeatForge.UI.openPianoRoll() - Open piano roll editor\n" +
        "  BeatForge.UI.closePianoRoll() - Close piano roll editor\n" +
        "  BeatForge.UI.showShortcuts() - Show keyboard shortcuts\n" +
        "  BeatForge.UI.closeShortcuts() - Close shortcuts overlay\n" +
        "  BeatForge.UI.renderUI() - Re-render the UI",
      "color: #2196F3; font-weight: bold;",
      "color: inherit;"
    );
    console.log(
      "%cProject Functions:%c\n" +
        "  BeatForge.Project.exportProject() - Export current project\n" +
        "  BeatForge.Project.clearAllData() - Clear all data\n" +
        "  BeatForge.Project.getState() - Get application state\n" +
        "  BeatForge.Project.getTracks() - Get current tracks",
      "color: #2196F3; font-weight: bold;",
      "color: inherit;"
    );
    console.log(
      "%cInitialization:%c\n" +
        "  BeatForge.initialize() - Initialize the application\n" +
        "  BeatForge.isInitialized() - Check if initialized",
      "color: #2196F3; font-weight: bold;",
      "color: inherit;"
    );
  },
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  // Initialize accessibility features first (shows loading overlay)
  updateLoadingText("Initializing BeatForge Studio...", "Loading UI components");

  // Initialize UI enhancements first
  try {
    initTheme();
    initTooltips();
    initShortcutsOverlay();
    initTrackColors();
    initMobileMenu();
    initActionsMenu();
    initVisualizerMode();
    Logger.info("UI enhancements initialized");
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.UI_INITIALIZATION_FAILED,
      `UI enhancements initialization failed: ${error.message}`,
      {},
      error
    );
  }

  // Initialize app
  setupEventListeners(initializeApp, renderUI);
  renderUI();
  initScrollSync();

  // Initialize accessibility (network status, ARIA regions) and hide loading
  initAccessibility();

  // Initialize input validation
  initInputValidation();

  // Announce app ready to screen readers
  announce("BeatForge Studio loaded. Press Tab to navigate controls.");
});

// Initialize audio button (desktop - in actions menu)
document.getElementById("initAudioBtn").addEventListener("click", initializeApp);

// Initialize audio button (mobile - visible in header)
const initAudioBtnHeader = document.getElementById("initAudioBtnHeader");
if (initAudioBtnHeader) {
  initAudioBtnHeader.addEventListener("click", () => {
    initializeApp();
    // Hide all init audio buttons after initialization
    initAudioBtnHeader.classList.add("hidden");
    const initAudioBtnMobile = document.getElementById("initAudioBtnMobile");
    if (initAudioBtnMobile) {
      initAudioBtnMobile.classList.add("hidden");
    }
  });
}

// --- EXPOSE NAMESPACE TO GLOBAL SCOPE ---
// Only expose the BeatForge namespace to prevent pollution
window.BeatForge = BeatForge;

// For backward compatibility with existing HTML inline handlers
// These will be updated in a future step
window.openPianoRoll = openPianoRoll;
window.closePianoRoll = closePianoRoll;
window.showShortcuts = showShortcuts;
window.closeShortcuts = closeShortcuts;
window.exportProject = exportProject;
window.clearAllData = clearAllData;
