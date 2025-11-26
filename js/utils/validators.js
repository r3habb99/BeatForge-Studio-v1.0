/**
 * Validators Module
 * Centralized validation logic for common operations
 * Provides reusable, testable validation functions
 */

/**
 * Validation result object
 */
class ValidationResult {
  constructor(isValid, error = null) {
    this.isValid = isValid;
    this.error = error;
  }

  static valid() {
    return new ValidationResult(true);
  }

  static invalid(error) {
    return new ValidationResult(false, error);
  }
}

/**
 * Validators object with static validation methods
 */
const Validators = {
  /**
   * Validate audio buffer duration
   * @param {number} duration - Duration in seconds
   * @param {Object} options - Validation options
   * @param {number} options.min - Minimum allowed duration (default: 0.001)
   * @param {number} options.max - Maximum allowed duration (default: 300)
   * @returns {ValidationResult} Validation result with optional warning
   */
  validateDuration(duration, options = {}) {
    const { min = 0.001, max = 300 } = options;

    if (typeof duration !== "number") {
      return ValidationResult.invalid(
        `Duration must be a number, got ${typeof duration}`
      );
    }

    if (isNaN(duration)) {
      return ValidationResult.invalid("Duration is NaN");
    }

    if (duration < min) {
      return ValidationResult.invalid(
        `Duration must be at least ${min} seconds`
      );
    }

    if (duration > max) {
      return ValidationResult.invalid(
        `Duration must not exceed ${max} seconds (got ${duration}s)`
      );
    }

    return ValidationResult.valid();
  },

  /**
   * Validate BPM value
   * @param {number} bpm - BPM value
   * @param {Object} options - Validation options
   * @param {number} options.min - Minimum BPM (default: 20)
   * @param {number} options.max - Maximum BPM (default: 300)
   * @returns {ValidationResult} Validation result
   */
  validateBPM(bpm, options = {}) {
    const { min = 20, max = 300 } = options;
    const num = parseFloat(bpm);

    if (isNaN(num)) {
      return ValidationResult.invalid(
        `BPM must be a valid number, got '${bpm}'`
      );
    }

    if (num < min || num > max) {
      return ValidationResult.invalid(
        `BPM must be between ${min} and ${max}, got ${num}`
      );
    }

    return ValidationResult.valid();
  },

  /**
   * Validate track object structure
   * @param {Object} track - Track object to validate
   * @param {Object} options - Validation options
   * @param {boolean} options.strict - Require all fields (default: false)
   * @returns {ValidationResult} Validation result
   */
  validateTrack(track, options = {}) {
    const { strict = false } = options;

    if (!track || typeof track !== "object") {
      return ValidationResult.invalid("Track must be an object");
    }

    const required = ["id", "type", "name"];
    const missing = required.filter((field) => !(field in track));

    if (missing.length > 0) {
      return ValidationResult.invalid(
        `Track missing required fields: ${missing.join(", ")}`
      );
    }

    if (!["drum", "synth"].includes(track.type)) {
      return ValidationResult.invalid(
        `Track type must be 'drum' or 'synth', got '${track.type}'`
      );
    }

    if (typeof track.name !== "string" || track.name.trim().length === 0) {
      return ValidationResult.invalid("Track name must be a non-empty string");
    }

    if (strict) {
      const requiredFields = [
        "id",
        "type",
        "name",
        "color",
        "vol",
        "pan",
        "mute",
        "solo",
        "rev",
        "del",
        "distortion",
      ];
      const missing = requiredFields.filter((field) => !(field in track));
      if (missing.length > 0) {
        return ValidationResult.invalid(
          `Track missing fields in strict mode: ${missing.join(", ")}`
        );
      }
    }

    return ValidationResult.valid();
  },

  /**
   * Validate volume level
   * @param {number} volume - Volume level
   * @param {Object} options - Validation options
   * @param {number} options.min - Minimum volume (default: 0)
   * @param {number} options.max - Maximum volume (default: 1)
   * @returns {ValidationResult} Validation result
   */
  validateVolume(volume, options = {}) {
    const { min = 0, max = 1 } = options;
    const num = parseFloat(volume);

    if (isNaN(num)) {
      return ValidationResult.invalid(
        `Volume must be a valid number, got '${volume}'`
      );
    }

    if (num < min || num > max) {
      return ValidationResult.invalid(
        `Volume must be between ${min} and ${max}, got ${num}`
      );
    }

    return ValidationResult.valid();
  },

  /**
   * Validate pan value
   * @param {number} pan - Pan value (-1 to 1)
   * @returns {ValidationResult} Validation result
   */
  validatePan(pan) {
    const num = parseFloat(pan);

    if (isNaN(num)) {
      return ValidationResult.invalid(
        `Pan must be a valid number, got '${pan}'`
      );
    }

    if (num < -1 || num > 1) {
      return ValidationResult.invalid(
        `Pan must be between -1 and 1, got ${num}`
      );
    }

    return ValidationResult.valid();
  },

  /**
   * Validate array of steps (drum steps)
   * @param {Array} steps - Array of step values
   * @param {Object} options - Validation options
   * @param {number} options.expectedLength - Expected array length
   * @returns {ValidationResult} Validation result
   */
  validateSteps(steps, options = {}) {
    const { expectedLength = 16 } = options;

    if (!Array.isArray(steps)) {
      return ValidationResult.invalid("Steps must be an array");
    }

    if (steps.length !== expectedLength) {
      return ValidationResult.invalid(
        `Steps array must have length ${expectedLength}, got ${steps.length}`
      );
    }

    if (!steps.every((step) => typeof step === "boolean")) {
      return ValidationResult.invalid("All steps must be boolean values");
    }

    return ValidationResult.valid();
  },

  /**
   * Validate synthesizer note object
   * @param {Object} note - Note object { note, len, step, velocity }
   * @returns {ValidationResult} Validation result
   */
  validateSynthNote(note) {
    if (!note || typeof note !== "object") {
      return ValidationResult.invalid("Note must be an object");
    }

    if (typeof note.note !== "number" || note.note < 0 || note.note > 127) {
      return ValidationResult.invalid(
        "Note must be a number between 0 and 127 (MIDI range)"
      );
    }

    if (typeof note.len !== "number" || note.len <= 0) {
      return ValidationResult.invalid("Note length must be a positive number");
    }

    if (typeof note.step !== "number" || note.step < 0) {
      return ValidationResult.invalid(
        "Note step must be a non-negative number"
      );
    }

    if (
      "velocity" in note &&
      (typeof note.velocity !== "number" ||
        note.velocity < 0 ||
        note.velocity > 1)
    ) {
      return ValidationResult.invalid("Note velocity must be between 0 and 1");
    }

    return ValidationResult.valid();
  },

  /**
   * Validate pattern object
   * @param {Object} pattern - Pattern object
   * @returns {ValidationResult} Validation result
   */
  validatePattern(pattern) {
    if (!pattern || typeof pattern !== "object") {
      return ValidationResult.invalid("Pattern must be an object");
    }

    if (typeof pattern.id !== "number" || pattern.id < 0) {
      return ValidationResult.invalid(
        "Pattern id must be a non-negative number"
      );
    }

    if (typeof pattern.name !== "string" || pattern.name.trim().length === 0) {
      return ValidationResult.invalid(
        "Pattern name must be a non-empty string"
      );
    }

    if (!Array.isArray(pattern.tracks)) {
      return ValidationResult.invalid("Pattern tracks must be an array");
    }

    if (pattern.tracks.length === 0) {
      return ValidationResult.invalid("Pattern must have at least one track");
    }

    // Validate each track
    for (const track of pattern.tracks) {
      const trackResult = this.validateTrack(track);
      if (!trackResult.isValid) {
        return trackResult;
      }
    }

    return ValidationResult.valid();
  },

  /**
   * Throw error if validation fails (helper for imperative validation)
   * @param {ValidationResult} result - Result from validation method
   * @param {string} context - Context for error message
   * @throws {Error} If validation failed
   */
  throwIfInvalid(result, context = "") {
    if (!result.isValid) {
      const message = context ? `${context}: ${result.error}` : result.error;
      throw new Error(message);
    }
  },
};

export { Validators, ValidationResult };
