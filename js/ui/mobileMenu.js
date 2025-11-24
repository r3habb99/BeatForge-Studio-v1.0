/**
 * Mobile Menu Module
 * Handles hamburger menu functionality for mobile devices
 */

/**
 * Initialize mobile menu
 */
export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const closeMobileMenuBtn = document.getElementById("closeMobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");

  if (!mobileMenuBtn || !mobileMenu || !mobileMenuBackdrop) {
    console.warn("Mobile menu elements not found");
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

  // Theme button - toggle theme menu
  const themeBtnMobile = document.getElementById("themeBtnMobile");
  const themeBtn = document.getElementById("themeBtn");
  const themeMenu = document.getElementById("themeMenu");

  if (themeBtnMobile && themeBtn && themeMenu) {
    themeBtnMobile.addEventListener("click", (e) => {
      e.stopPropagation();

      const isHidden = themeMenu.classList.contains("hidden");

      // Toggle theme menu visibility
      themeMenu.classList.toggle("hidden");

      if (isHidden) {
        // Opening the menu - position it relative to the mobile button
        const rect = themeBtnMobile.getBoundingClientRect();
        themeMenu.style.position = "fixed";
        themeMenu.style.left = `${rect.left}px`;
        themeMenu.style.top = `${rect.bottom + 5}px`;
        themeMenu.style.right = "auto";
        themeMenu.style.zIndex = "1001"; // Above mobile menu and backdrop
      } else {
        // Closing the menu - reset styles
        themeMenu.style.position = "";
        themeMenu.style.left = "";
        themeMenu.style.top = "";
        themeMenu.style.right = "";
        themeMenu.style.zIndex = "";
      }
    });

    // Close theme menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !themeMenu.contains(e.target) &&
        e.target !== themeBtnMobile &&
        !themeMenu.classList.contains("hidden")
      ) {
        themeMenu.classList.add("hidden");
        // Reset styles
        themeMenu.style.position = "";
        themeMenu.style.left = "";
        themeMenu.style.top = "";
        themeMenu.style.right = "";
        themeMenu.style.zIndex = "";
      }
    });

    // Close mobile menu when theme is selected
    const themeOptions = themeMenu.querySelectorAll(".theme-option");
    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        // Hide theme menu immediately
        themeMenu.classList.add("hidden");
        // Reset styles
        themeMenu.style.position = "";
        themeMenu.style.left = "";
        themeMenu.style.top = "";
        themeMenu.style.right = "";
        themeMenu.style.zIndex = "";

        // Close mobile menu after a small delay to see the theme change
        setTimeout(() => {
          closeMobileMenu();
        }, 300);
      });
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
    pauseRecordBtnMobile.addEventListener("click", () =>
      pauseRecordBtn.click()
    );
  }
  if (stopRecordBtn && stopRecordBtnMobile) {
    stopRecordBtnMobile.addEventListener("click", () => stopRecordBtn.click());
  }
}

export { openMobileMenu, closeMobileMenu, syncMobileMenuControls };
