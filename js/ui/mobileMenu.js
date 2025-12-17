/**
 * Mobile Menu Module
 * Handles hamburger menu functionality for mobile devices
 */

import { THEMES } from "../constants/themes.js";

/**
 * Initialize mobile menu
 */
export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const closeMobileMenuBtn = document.getElementById("closeMobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");

  if (!mobileMenuBtn || !mobileMenu || !mobileMenuBackdrop) {
    return;
  }

  // Open menu
  mobileMenuBtn.addEventListener("click", openMobileMenu);

  // Close menu
  closeMobileMenuBtn.addEventListener("click", closeMobileMenu);
  mobileMenuBackdrop.addEventListener("click", closeMobileMenu);

  // Sync mobile menu controls with desktop controls
  syncMobileMenuControls();

  // Setup mobile menu event listeners
  setupMobileMenuEventListeners();
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");

  mobileMenu.classList.add("open");
  mobileMenuBackdrop.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileMenuBackdrop.setAttribute("aria-hidden", "false");

  // Prevent body scroll when menu is open
  document.body.style.overflow = "hidden";
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");

  mobileMenu.classList.remove("open");
  mobileMenuBackdrop.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileMenuBackdrop.setAttribute("aria-hidden", "true");

  // Restore body scroll
  document.body.style.overflow = "";
}

/**
 * Sync mobile menu controls with desktop controls
 */
function syncMobileMenuControls() {
  // Sync master volume
  const masterVol = document.getElementById("masterVol");
  const masterVolMobile = document.getElementById("masterVolMobile");
  if (masterVol && masterVolMobile) {
    masterVolMobile.value = masterVol.value;
  }

  // Sync swing
  const swingInput = document.getElementById("swingInput");
  const swingInputMobile = document.getElementById("swingInputMobile");
  if (swingInput && swingInputMobile) {
    swingInputMobile.value = swingInput.value;
  }

  // Sync pattern selector
  const patternSelect = document.getElementById("patternSelect");
  const patternSelectMobile = document.getElementById("patternSelectMobile");
  if (patternSelect && patternSelectMobile) {
    patternSelectMobile.innerHTML = patternSelect.innerHTML;
    patternSelectMobile.value = patternSelect.value;
  }

  // Sync audio initialization button visibility
  const initAudioBtn = document.getElementById("initAudioBtn");
  const initAudioBtnMobile = document.getElementById("initAudioBtnMobile");
  if (initAudioBtn && initAudioBtnMobile) {
    // If desktop button is hidden, hide mobile button too
    if (initAudioBtn.classList.contains("hidden")) {
      initAudioBtnMobile.classList.add("hidden");
    }
  }
}

/**
 * Setup mobile menu event listeners
 */
function setupMobileMenuEventListeners() {
  // Master volume sync
  const masterVolMobile = document.getElementById("masterVolMobile");
  const masterVol = document.getElementById("masterVol");
  if (masterVolMobile && masterVol) {
    masterVolMobile.addEventListener("input", (e) => {
      masterVol.value = e.target.value;
      masterVol.dispatchEvent(new Event("input"));
    });
  }

  // Swing sync
  const swingInputMobile = document.getElementById("swingInputMobile");
  const swingInput = document.getElementById("swingInput");
  if (swingInputMobile && swingInput) {
    swingInputMobile.addEventListener("input", (e) => {
      swingInput.value = e.target.value;
      swingInput.dispatchEvent(new Event("input"));
    });
  }

  // Pattern selector sync
  const patternSelectMobile = document.getElementById("patternSelectMobile");
  const patternSelect = document.getElementById("patternSelect");
  if (patternSelectMobile && patternSelect) {
    patternSelectMobile.addEventListener("change", (e) => {
      patternSelect.value = e.target.value;
      patternSelect.dispatchEvent(new Event("change"));
    });
  }

  // Recording controls sync
  syncRecordingControls();

  // Theme button - show mobile theme selector
  const themeBtnMobile = document.getElementById("themeBtnMobile");
  if (themeBtnMobile) {
    themeBtnMobile.addEventListener("click", (e) => {
      e.stopPropagation();
      showMobileThemeSelector();
    });
  }

  // Initialize Audio button (critical for mobile)
  const initAudioBtnMobile = document.getElementById("initAudioBtnMobile");
  if (initAudioBtnMobile) {
    initAudioBtnMobile.addEventListener("click", () => {
      // Trigger click on the main init audio button
      const initAudioBtn = document.getElementById("initAudioBtn");
      if (initAudioBtn) {
        initAudioBtn.click();
        // Hide the mobile init button after initialization
        initAudioBtnMobile.classList.add("hidden");
        closeMobileMenu();
      }
    });
  }

  // Export button
  const exportBtnMobile = document.getElementById("exportBtnMobile");
  if (exportBtnMobile) {
    exportBtnMobile.addEventListener("click", () => {
      if (window.exportProject) {
        window.exportProject();
        closeMobileMenu();
      }
    });
  }

  // Clear all button
  const clearAllBtnMobile = document.getElementById("clearAllBtnMobile");
  if (clearAllBtnMobile) {
    clearAllBtnMobile.addEventListener("click", () => {
      if (window.clearAllData) {
        window.clearAllData();
        closeMobileMenu();
      }
    });
  }

  // Shortcuts button
  const shortcutsBtnMobile = document.getElementById("shortcutsBtnMobile");
  if (shortcutsBtnMobile) {
    shortcutsBtnMobile.addEventListener("click", () => {
      if (window.showShortcuts) {
        window.showShortcuts();
        closeMobileMenu();
      }
    });
  }
}

/**
 * Show mobile theme selector
 */
function showMobileThemeSelector() {
  // Create theme selector modal
  const modal = document.createElement("div");
  modal.id = "mobileThemeModal";
  modal.className = "fixed inset-0 z-[1002] flex items-center justify-center p-4";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";

  const content = `
    <div class="bg-gray-900 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-white">Select Theme</h3>
        <button id="closeMobileThemeModal" class="text-gray-400 hover:text-white text-2xl leading-none">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${THEMES.map(
          (theme) => `
          <button class="mobile-theme-option p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all" data-theme="${
            theme.value
          }">
            <div class="flex gap-1 mb-2">
              ${theme.colors
                .map(
                  (color) =>
                    `<div class="w-8 h-8 rounded" style="background-color: ${color}"></div>`
                )
                .join("")}
            </div>
            <div class="text-white text-sm font-medium">${theme.name}</div>
          </button>
        `
        ).join("")}
      </div>
    </div>
  `;

  modal.innerHTML = content;
  document.body.appendChild(modal);

  // Close modal on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Close button
  const closeBtn = modal.querySelector("#closeMobileThemeModal");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  // Theme selection
  const themeOptions = modal.querySelectorAll(".mobile-theme-option");
  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const themeName = option.dataset.theme;

      // Apply theme using the global setTheme function
      if (window.setTheme) {
        window.setTheme(themeName);
      }

      // Show toast notification
      if (window.toast) {
        window.toast.success(
          "Theme Changed",
          `Applied ${option.querySelector(".text-white").textContent} theme`
        );
      }

      // Close modal
      modal.remove();

      // Close mobile menu after a small delay
      setTimeout(() => {
        closeMobileMenu();
      }, 300);
    });
  });
}

/**
 * Sync recording controls between mobile and desktop
 */
function syncRecordingControls() {
  const recordBtn = document.getElementById("recordBtn");
  const recordBtnMobile = document.getElementById("recordBtnMobile");
  const pauseRecordBtn = document.getElementById("pauseRecordBtn");
  const pauseRecordBtnMobile = document.getElementById("pauseRecordBtnMobile");
  const stopRecordBtn = document.getElementById("stopRecordBtn");
  const stopRecordBtnMobile = document.getElementById("stopRecordBtnMobile");

  if (recordBtn && recordBtnMobile) {
    recordBtnMobile.addEventListener("click", () => recordBtn.click());
  }
  if (pauseRecordBtn && pauseRecordBtnMobile) {
    pauseRecordBtnMobile.addEventListener("click", () => pauseRecordBtn.click());
  }
  if (stopRecordBtn && stopRecordBtnMobile) {
    stopRecordBtnMobile.addEventListener("click", () => stopRecordBtn.click());
  }
}

export { openMobileMenu, closeMobileMenu, syncMobileMenuControls };
