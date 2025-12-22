/**
 * Input Validation Utilities
 * Provides validation feedback for form inputs
 */

/**
 * Validate BPM input
 * @param {HTMLInputElement} input - The BPM input element
 * @returns {boolean} - Whether the input is valid
 */
export function validateBPM(input) {
  const value = parseInt(input.value, 10);
  const min = parseInt(input.min, 10) || 40;
  const max = parseInt(input.max, 10) || 240;
  
  if (isNaN(value) || value < min || value > max) {
    setInvalid(input, `BPM must be between ${min} and ${max}`);
    return false;
  }
  
  setValid(input);
  return true;
}

/**
 * Validate numeric range input (sliders, etc.)
 * @param {HTMLInputElement} input - The input element
 * @returns {boolean} - Whether the input is valid
 */
export function validateRange(input) {
  const value = parseFloat(input.value);
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 1;
  
  if (isNaN(value) || value < min || value > max) {
    setInvalid(input, `Value must be between ${min} and ${max}`);
    return false;
  }
  
  setValid(input);
  return true;
}

/**
 * Set input to invalid state with error message
 * @param {HTMLInputElement} input - The input element
 * @param {string} message - Error message to display
 */
export function setInvalid(input, message = "") {
  input.classList.remove("valid");
  input.classList.add("invalid");
  input.setAttribute("aria-invalid", "true");
  
  // Create or update error message
  const parent = input.parentElement;
  let errorEl = parent.querySelector(".input-error-message");
  
  if (message) {
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "input-error-message";
      errorEl.setAttribute("role", "alert");
      parent.classList.add("control-group-validated");
      parent.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }
}

/**
 * Set input to valid state
 * @param {HTMLInputElement} input - The input element
 */
export function setValid(input) {
  input.classList.remove("invalid");
  input.classList.add("valid");
  input.setAttribute("aria-invalid", "false");
  
  // Remove error message if exists
  const parent = input.parentElement;
  const errorEl = parent.querySelector(".input-error-message");
  if (errorEl) {
    errorEl.remove();
    parent.classList.remove("control-group-validated");
  }
  
  // Remove valid class after animation
  setTimeout(() => {
    input.classList.remove("valid");
  }, 2000);
}

/**
 * Clear validation state
 * @param {HTMLInputElement} input - The input element
 */
export function clearValidation(input) {
  input.classList.remove("invalid", "valid");
  input.removeAttribute("aria-invalid");
  
  const parent = input.parentElement;
  const errorEl = parent.querySelector(".input-error-message");
  if (errorEl) {
    errorEl.remove();
    parent.classList.remove("control-group-validated");
  }
}

/**
 * Initialize validation for all control inputs
 */
export function initInputValidation() {
  // BPM input validation
  const bpmInput = document.getElementById("bpmInput");
  if (bpmInput) {
    bpmInput.addEventListener("blur", () => validateBPM(bpmInput));
    bpmInput.addEventListener("input", () => {
      // Clear error on input, validate on blur
      clearValidation(bpmInput);
    });
  }
  
  // Range inputs (swing, volume)
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  rangeInputs.forEach((input) => {
    input.addEventListener("change", () => validateRange(input));
  });
}

// Expose to global scope
window.validateBPM = validateBPM;
window.validateRange = validateRange;
window.setInvalid = setInvalid;
window.setValid = setValid;

