/**
 * Track Renderer Module
 * Handles rendering of track UI elements
 */

import { STEP_COUNT } from "../constants.js";
import { getTracks } from "../state/stateManager.js";
import {
  toggleStep,
  updateTrackParam,
  toggleMute,
  toggleSolo,
} from "./trackControls.js";

let isInitialRender = true;

/**
 * Highlight track header
 */
function highlightTrackHeader(trackId) {
  const headerContainer = document.getElementById("trackHeaders");
  const headers = headerContainer.querySelectorAll(".track-header-item");

  // Remove previous highlights
  headers.forEach((h) => {
    h.classList.remove(
      "ring-2",
      "ring-blue-500",
      "ring-offset-2",
      "ring-offset-gray-900"
    );
  });

  // Add highlight to selected track
  const targetHeader = headerContainer.querySelector(
    `[data-track-id="${trackId}"]`
  );
  if (targetHeader) {
    targetHeader.classList.add(
      "ring-2",
      "ring-blue-500",
      "ring-offset-2",
      "ring-offset-gray-900"
    );

    // Auto-scroll to the track header if it's not visible
    const container = headerContainer.parentElement; // The scrollable container
    const headerTop = targetHeader.offsetTop;
    const headerBottom = headerTop + targetHeader.offsetHeight;
    const containerScrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Check if header is above visible area
    if (headerTop < containerScrollTop) {
      container.scrollTo({
        top: headerTop - 10,
        behavior: "smooth",
      });
    }
    // Check if header is below visible area
    else if (headerBottom > containerScrollTop + containerHeight) {
      container.scrollTo({
        top: headerBottom - containerHeight + 10,
        behavior: "smooth",
      });
    }
  }
}

/**
 * Check if mobile view
 */
function isMobileView() {
  return window.innerWidth < 768;
}

/**
 * Render all tracks UI
 */
function renderTracksUI(openPianoRollCallback) {
  const headerContainer = document.getElementById("trackHeaders");
  const gridContainer = document.getElementById("gridCanvas");

  // Clear containers on initial render
  if (isInitialRender) {
    headerContainer.innerHTML = "";
    gridContainer.innerHTML = "";
    isInitialRender = false;
  }

  const tracks = getTracks();

  // Check if mobile view
  const mobile = isMobileView();

  if (mobile) {
    // Mobile: Integrated track + sequencer layout
    renderMobileTracks(tracks, headerContainer, openPianoRollCallback);
    // Hide desktop sequencer grid on mobile
    gridContainer.style.display = "none";
  } else {
    // Desktop: Separate track headers and sequencer grid
    renderDesktopTracks(
      tracks,
      headerContainer,
      gridContainer,
      openPianoRollCallback
    );
    gridContainer.style.display = "block";
  }
}

/**
 * Render desktop tracks (original layout)
 */
function renderDesktopTracks(
  tracks,
  headerContainer,
  gridContainer,
  openPianoRollCallback
) {
  tracks.forEach((track, trackIndex) => {
    // Render track header
    let hDiv = headerContainer.children[trackIndex];
    const needsCreate = !hDiv;

    if (needsCreate) {
      hDiv = document.createElement("div");
      hDiv.dataset.trackId = track.id;
      headerContainer.appendChild(hDiv);
    }

    // Update classes
    hDiv.className = `track-header-item border-b border-gray-800 p-3 flex flex-col justify-between bg-gradient-to-r from-[#1a1a1a] to-[#222] relative`;
    if (track.solo) hDiv.classList.add("border-l-4", "border-yellow-400");
    else
      hDiv.classList.add("border-l-4", track.color.replace("bg-", "border-"));

    // Only update innerHTML if creating new element or if we need to force update
    if (needsCreate || !hDiv.hasAttribute("data-rendered")) {
      hDiv.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="font-bold text-sm truncate flex-1 mr-2">${
                      track.name
                    }</span>
                    <div class="flex gap-1 flex-shrink-0">
                        <button class="mute-btn text-xs w-6 h-6 rounded ${
                          track.mute
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-gray-400"
                        }" aria-label="Mute track">M</button>
                        <button class="solo-btn text-xs w-6 h-6 rounded ${
                          track.solo
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-700 text-gray-400"
                        }" aria-label="Solo track">S</button>
                    </div>
                </div>

                <!-- Volume Control -->
                <div class="flex gap-2 items-center mb-2">
                     <i class="fas fa-volume-down text-xs text-gray-500 flex-shrink-0"></i>
                     <input type="range" class="vol-slider flex-1 min-w-0" min="0" max="1" step="0.05" value="${
                       track.vol
                     }" aria-label="Track volume">
                </div>

                <!-- FX Sends -->
                <div class="flex gap-2 items-center mb-2">
                    <div class="flex items-center gap-1 flex-1 min-w-0">
                        <i class="fas fa-water text-[10px] text-blue-400 flex-shrink-0" title="Reverb"></i>
                        <input type="range" class="rev-slider flex-1 min-w-0 fx-send-slider text-blue-400" min="0" max="1" step="0.1" value="${
                          track.rev
                        }" aria-label="Reverb send">
                    </div>
                    <div class="flex items-center gap-1 flex-1 min-w-0">
                        <i class="fas fa-clock text-[10px] text-purple-400 flex-shrink-0" title="Delay"></i>
                        <input type="range" class="del-slider flex-1 min-w-0 fx-send-slider text-purple-400" min="0" max="1" step="0.1" value="${
                          track.del
                        }" aria-label="Delay send">
                    </div>
                </div>

                <!-- Distortion -->
                <div class="flex gap-2 items-center mb-2">
                    <i class="fas fa-bolt text-[10px] text-orange-400 flex-shrink-0" title="Distortion"></i>
                    <input type="range" class="dist-slider flex-1 min-w-0 fx-send-slider text-orange-400" min="0" max="1" step="0.05" value="${
                      track.distortion || 0
                    }" aria-label="Distortion">
                </div>

                <!-- Edit Button / Track Type -->
                <div class="mt-auto">
                    ${
                      track.type === "synth"
                        ? `<button class="edit-notes-btn px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs rounded text-white w-full border border-gray-600">Edit Notes <i class="fas fa-music ml-1"></i></button>`
                        : `<div class="text-xs text-gray-500 w-full text-center py-1">Drum Track</div>`
                    }
                </div>
            `;
      hDiv.setAttribute("data-rendered", "true");

      // Attach event listeners
      const muteBtn = hDiv.querySelector(".mute-btn");
      const soloBtn = hDiv.querySelector(".solo-btn");
      const volSlider = hDiv.querySelector(".vol-slider");
      const revSlider = hDiv.querySelector(".rev-slider");
      const delSlider = hDiv.querySelector(".del-slider");
      const distSlider = hDiv.querySelector(".dist-slider");
      const editBtn = hDiv.querySelector(".edit-notes-btn");

      if (muteBtn) {
        muteBtn.addEventListener("click", () => {
          toggleMute(track.id);
          highlightTrackHeader(track.id);
          renderTracksUI(openPianoRollCallback);
        });
      }

      if (soloBtn) {
        soloBtn.addEventListener("click", () => {
          toggleSolo(track.id);
          highlightTrackHeader(track.id);
          renderTracksUI(openPianoRollCallback);
        });
      }

      if (volSlider) {
        volSlider.addEventListener("input", (e) => {
          updateTrackParam(track.id, "vol", e.target.value);
        });
      }

      if (revSlider) {
        revSlider.addEventListener("input", (e) => {
          updateTrackParam(track.id, "rev", e.target.value);
        });
      }

      if (delSlider) {
        delSlider.addEventListener("input", (e) => {
          updateTrackParam(track.id, "del", e.target.value);
        });
      }

      if (distSlider) {
        distSlider.addEventListener("input", (e) => {
          updateTrackParam(track.id, "distortion", e.target.value);
        });
      }

      if (editBtn) {
        editBtn.addEventListener("click", () => {
          openPianoRollCallback(track.id);
        });
      }
    } else {
      // Just update button states without re-rendering
      const muteBtn = hDiv.querySelector(".mute-btn");
      const soloBtn = hDiv.querySelector(".solo-btn");

      if (muteBtn) {
        muteBtn.className = `mute-btn text-xs w-6 h-6 rounded ${
          track.mute ? "bg-red-600 text-white" : "bg-gray-700 text-gray-400"
        }`;
      }
      if (soloBtn) {
        soloBtn.className = `solo-btn text-xs w-6 h-6 rounded ${
          track.solo ? "bg-yellow-500 text-black" : "bg-gray-700 text-gray-400"
        }`;
      }
    }

    let rowDiv = gridContainer.children[trackIndex];

    if (!rowDiv) {
      rowDiv = document.createElement("div");
      rowDiv.dataset.trackId = track.id;
      gridContainer.appendChild(rowDiv);
    }

    rowDiv.className = "track-row flex w-full";

    // Add click handler to highlight track when clicking anywhere on the row
    rowDiv.onclick = (e) => {
      // Only highlight if clicking on the row itself or cells, not if event is from button
      if (!e.target.classList.contains("step-btn")) {
        highlightTrackHeader(track.id);
      }
    };

    for (let i = 0; i < STEP_COUNT; i++) {
      let cell = rowDiv.children[i];

      if (!cell) {
        cell = document.createElement("div");
        rowDiv.appendChild(cell);
      }

      cell.className = `grid-col border-r border-b border-gray-800 flex items-center justify-center relative transition-colors`;
      if (i % 4 === 0) cell.classList.add("border-l", "border-l-gray-700");

      if (track.type === "drum") {
        let btn = cell.querySelector(".step-btn");
        if (!btn) {
          btn = document.createElement("button");
          btn.onclick = (e) => {
            e.stopPropagation(); // Prevent row click
            toggleStep(track.id, i);
            highlightTrackHeader(track.id);
            // Re-render after toggle
            renderTracksUI(openPianoRollCallback);
          };
          btn.setAttribute("aria-label", `Step ${i + 1}`);
          cell.innerHTML = "";
          cell.appendChild(btn);
        }
        btn.className = `step-btn w-10 h-10 md:w-12 md:h-12 rounded-sm transition-all ${
          track.steps[i] ? track.color : "bg-gray-800"
        }`;
      } else {
        const notesHere = track.notes.filter((n) => n.step === i);
        if (notesHere.length > 0) {
          cell.innerHTML = `<div class="${track.color} w-full h-5 md:h-6 rounded-sm text-[9px] md:text-[10px] flex items-center justify-center text-white font-bold shadow-lg opacity-90">${notesHere[0].note}</div>`;
        } else {
          cell.innerHTML = "";
        }
        cell.onclick = (e) => {
          e.stopPropagation(); // Prevent row click
          highlightTrackHeader(track.id);
          openPianoRollCallback(track.id);
        };
        cell.style.cursor = "pointer";
        cell.setAttribute("aria-label", `Step ${i + 1} - Click to edit notes`);
      }
    }
  });
}

/**
 * Render mobile tracks (integrated layout with inline sequencer)
 */
function renderMobileTracks(tracks, headerContainer, openPianoRollCallback) {
  // Clear existing content
  headerContainer.innerHTML = "";

  tracks.forEach((track, trackIndex) => {
    // Create track row container
    const trackRow = document.createElement("div");
    trackRow.dataset.trackId = track.id;
    trackRow.className = `mobile-track-row ${track.color.replace(
      "bg-",
      "border-l-"
    )}`;
    if (track.solo) trackRow.classList.add("border-l-yellow-400");

    // Track header section (left side)
    const trackHeader = document.createElement("div");
    trackHeader.className = "mobile-track-header";
    trackHeader.innerHTML = `
            <div class="mobile-track-name" data-track-id="${track.id}">
                <span class="track-name-text">${track.name}</span>
            </div>
            <div class="mobile-track-controls">
                <button class="mobile-mute-btn ${
                  track.mute ? "active" : ""
                }" aria-label="Mute track" data-track-id="${track.id}">
                    M
                </button>
                <button class="mobile-solo-btn ${
                  track.solo ? "active" : ""
                }" aria-label="Solo track" data-track-id="${track.id}">
                    S
                </button>
            </div>
        `;

    // Sequencer section (right side)
    const sequencerSection = document.createElement("div");
    sequencerSection.className = "mobile-sequencer-section";

    // Create step buttons
    for (let i = 0; i < STEP_COUNT; i++) {
      const stepBtn = document.createElement("button");
      stepBtn.className = `mobile-step-btn ${
        track.type === "drum" && track.steps[i] ? track.color : ""
      }`;
      stepBtn.dataset.trackId = track.id;
      stepBtn.dataset.step = i;
      stepBtn.setAttribute("aria-label", `Step ${i + 1}`);

      // For synth tracks, show note indicator
      if (track.type === "synth") {
        const notesHere = track.notes.filter((n) => n.step === i);
        if (notesHere.length > 0) {
          stepBtn.classList.add(track.color);
          stepBtn.innerHTML = `<span class="mobile-note-indicator">${notesHere[0].note}</span>`;
        }
      }

      sequencerSection.appendChild(stepBtn);
    }

    // Assemble track row
    trackRow.appendChild(trackHeader);
    trackRow.appendChild(sequencerSection);
    headerContainer.appendChild(trackRow);

    // Attach event listeners
    const trackNameEl = trackHeader.querySelector(".mobile-track-name");
    const muteBtn = trackHeader.querySelector(".mobile-mute-btn");
    const soloBtn = trackHeader.querySelector(".mobile-solo-btn");
    const stepBtns = sequencerSection.querySelectorAll(".mobile-step-btn");

    // Track name click - open bottom sheet (will implement in Phase 3)
    trackNameEl.addEventListener("click", () => {
      highlightTrackHeader(track.id);
      // TODO: Open bottom sheet with full controls
      console.log("Open bottom sheet for track:", track.id);
    });

    // Mute button
    muteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMute(track.id);
      highlightTrackHeader(track.id);
      renderTracksUI(openPianoRollCallback);
    });

    // Solo button
    soloBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSolo(track.id);
      highlightTrackHeader(track.id);
      renderTracksUI(openPianoRollCallback);
    });

    // Step buttons
    stepBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const step = parseInt(btn.dataset.step);

        if (track.type === "drum") {
          toggleStep(track.id, step);
          highlightTrackHeader(track.id);
          renderTracksUI(openPianoRollCallback);
        } else {
          // For synth tracks, open piano roll
          highlightTrackHeader(track.id);
          openPianoRollCallback(track.id);
        }
      });
    });
  });
}

// Handle window resize to switch between mobile and desktop layouts
let resizeTimeout;
let lastViewMode = isMobileView();

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const currentViewMode = isMobileView();
    if (currentViewMode !== lastViewMode) {
      lastViewMode = currentViewMode;
      isInitialRender = true; // Force full re-render
      // Re-render will be triggered by the app's render cycle
      console.log(
        `View mode changed to: ${currentViewMode ? "mobile" : "desktop"}`
      );
    }
  }, 250);
});

export { renderTracksUI, highlightTrackHeader };
