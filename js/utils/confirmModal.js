/**
 * Custom Confirmation Modal
 * Replaces native confirm() with a themed, accessible modal dialog
 */

import { sanitizeHTML } from "./sanitize.js";

let activeModal = null;

/**
 * Show a confirmation modal
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.message - Modal message
 * @param {string} options.confirmText - Confirm button text (default: "Confirm")
 * @param {string} options.cancelText - Cancel button text (default: "Cancel")
 * @param {string} options.confirmClass - Confirm button CSS class (default: "btn-danger")
 * @param {boolean} options.danger - If true, uses danger styling (default: false)
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
 */
export function showConfirm(options = {}) {
  return new Promise((resolve) => {
    // Close any existing modal
    closeConfirmModal();
    
    const {
      title = "Confirm Action",
      message = "Are you sure you want to proceed?",
      confirmText = "Confirm",
      cancelText = "Cancel",
      danger = false,
    } = options;

    // Create modal container
    const modal = document.createElement("div");
    modal.className = "confirm-modal-overlay";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "confirm-modal-title");
    modal.setAttribute("aria-describedby", "confirm-modal-message");

    const confirmBtnClass = danger 
      ? "bg-red-600 hover:bg-red-500 focus:ring-red-500" 
      : "bg-blue-600 hover:bg-blue-500 focus:ring-blue-500";

    modal.innerHTML = `
      <div class="confirm-modal-content">
        <h2 id="confirm-modal-title" class="confirm-modal-title">${sanitizeHTML(title)}</h2>
        <p id="confirm-modal-message" class="confirm-modal-message">${sanitizeHTML(message)}</p>
        <div class="confirm-modal-actions">
          <button type="button" class="confirm-modal-btn confirm-modal-cancel" id="confirmModalCancel">
            ${sanitizeHTML(cancelText)}
          </button>
          <button type="button" class="confirm-modal-btn confirm-modal-confirm ${confirmBtnClass}" id="confirmModalConfirm">
            ${sanitizeHTML(confirmText)}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    activeModal = modal;

    // Get buttons
    const confirmBtn = modal.querySelector("#confirmModalConfirm");
    const cancelBtn = modal.querySelector("#confirmModalCancel");

    // Focus confirm button
    setTimeout(() => confirmBtn.focus(), 50);

    // Handle confirm
    const handleConfirm = () => {
      closeConfirmModal();
      resolve(true);
    };

    // Handle cancel
    const handleCancel = () => {
      closeConfirmModal();
      resolve(false);
    };

    // Attach event listeners
    confirmBtn.addEventListener("click", handleConfirm);
    cancelBtn.addEventListener("click", handleCancel);

    // Handle Escape key
    const handleKeydown = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      } else if (e.key === "Tab") {
        // Trap focus within modal
        const focusableEls = modal.querySelectorAll("button");
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    modal._keydownHandler = handleKeydown;

    // Handle backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) handleCancel();
    });

    // Animate in
    requestAnimationFrame(() => modal.classList.add("open"));
  });
}

/**
 * Close the active confirmation modal
 */
export function closeConfirmModal() {
  if (activeModal) {
    if (activeModal._keydownHandler) {
      document.removeEventListener("keydown", activeModal._keydownHandler);
    }
    activeModal.classList.remove("open");
    setTimeout(() => {
      if (activeModal && activeModal.parentNode) {
        activeModal.remove();
      }
      activeModal = null;
    }, 200);
  }
}

// Expose to global scope for use in HTML handlers
window.showConfirm = showConfirm;
window.closeConfirmModal = closeConfirmModal;

