/**
 * Main Application Logic
 * Orchestrates all modules and handles initialization
 */

// Import modules
import { initAudio, getAudioContext, exportToWAV, hasRecording, exportRecording } from './audio/audioEngine.js';
import { loadState, getState, getTracks, clearState } from './state/stateManager.js';
import { startScheduler } from './scheduler/scheduler.js';
import { drawVisualizer } from './ui/visualizer.js';
import { updatePatternSelector } from './ui/patternManager.js';
import { renderTracksUI } from './ui/trackRenderer.js';
import { openPianoRoll, closePianoRoll } from './ui/pianoRoll.js';
import { setupEventListeners, showShortcuts, closeShortcuts } from './ui/eventHandlers.js';
import { initScrollSync } from './ui/scrollSync.js';

/**
 * Initialize audio and UI
 */
function initializeApp() {
    try {
        initAudio();
        drawVisualizer();
        startScheduler();
        document.getElementById('initAudioBtn').classList.add('hidden');
        loadState();
        renderUI();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        alert(`Audio Initialization Failed: ${error.message}\n\nPlease check your browser settings and ensure audio is not blocked.`);
        document.getElementById('initAudioBtn').classList.remove('hidden');
        document.getElementById('initAudioBtn').classList.remove('animate-pulse');
        document.getElementById('initAudioBtn').innerText = 'Retry Audio Init';
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
        const hasDrumNotes = tracks.some(t => t.type === 'drum' && t.steps.some(s => s));
        const hasSynthNotes = tracks.some(t => t.type === 'synth' && t.notes.length > 0);

        if (!hasDrumNotes && !hasSynthNotes) {
            alert('No notes to export! Please add some notes to your pattern first.');
            return;
        }

        // Show progress message
        const exportBtn = document.getElementById('exportBtn');
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i><span>Exporting...</span>';
        exportBtn.disabled = true;

        // Check if there's a recording to export
        if (hasRecording()) {
            // Export the recorded audio
            await exportRecording(`music-studio-recording-${Date.now()}.webm`);
            alert('Recording exported successfully! Your audio file has been downloaded.');
        } else {
            // Fallback to offline rendering (old behavior)
            await exportToWAV(state, tracks);
            alert('Export completed successfully! Your audio file has been downloaded.');
        }

        // Restore button
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
    } catch (error) {
        console.error('Export failed:', error);
        alert('Export failed: ' + error.message);

        // Restore button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.innerHTML = '<i class="fas fa-download mr-1"></i><span>Export</span>';
            exportBtn.disabled = false;
        }
    }
}

/**
 * Clear all data and reset to default
 */
function clearAllData() {
    const cleared = clearState();
    if (cleared) {
        renderUI();
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners(initializeApp, renderUI);
    renderUI();
    initScrollSync();
});

// Initialize audio button
document.getElementById('initAudioBtn').addEventListener('click', initializeApp);

// --- EXPOSE FUNCTIONS TO GLOBAL SCOPE FOR HTML INLINE HANDLERS ---
// Only expose functions that are called from HTML inline handlers
window.openPianoRoll = openPianoRoll;
window.closePianoRoll = closePianoRoll;
window.showShortcuts = showShortcuts;
window.closeShortcuts = closeShortcuts;
window.exportProject = exportProject;
window.clearAllData = clearAllData;
