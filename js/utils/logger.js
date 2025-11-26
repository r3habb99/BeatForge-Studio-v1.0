/**
 * Logger Module
 * Centralized error handling and logging system
 * Provides consistent error tracking, debugging, and log management
 */

/**
 * Logger class with static methods for centralized logging
 */
class Logger {
  /**
   * Error codes for consistent error identification
   */
  static ERROR_CODES = {
    // Audio system errors
    AUDIO_INIT_FAILED: "E001",
    AUDIO_CONTEXT_MISSING: "E002",
    AUDIO_CONTEXT_RESUME_FAILED: "E003",
    AUDIO_NOT_SUPPORTED: "E004",

    // Track/State errors
    INVALID_TRACK: "E101",
    INVALID_PATTERN: "E102",
    INVALID_STATE: "E103",
    STATE_SAVE_FAILED: "E104",
    STATE_LOAD_FAILED: "E105",

    // Audio generation errors
    NOISE_GENERATION_FAILED: "E201",
    SYNTH_GENERATION_FAILED: "E202",
    AUDIO_SYNTHESIS_FAILED: "E203",
    INVALID_BUFFER_DURATION: "E204",

    // Effect errors
    EFFECT_UPDATE_FAILED: "E205",

    // Export/Recording errors
    EXPORT_FAILED: "E301",
    RECORDING_FAILED: "E302",
    EXPORT_ENCODING_FAILED: "E303",

    // UI/Control errors
    UI_INITIALIZATION_FAILED: "E401",
    CONTROL_UPDATE_FAILED: "E402",
    EVENT_HANDLER_FAILED: "E403",

    // Scheduler/Playback errors
    SCHEDULING_FAILED: "E501",
    PLAYBACK_FAILED: "E502",

    // Generic errors
    GENERIC_ERROR: "E999",
  };

  /**
   * Warning codes for non-critical issues
   */
  static WARNING_CODES = {
    LARGE_BUFFER_REQUESTED: "W001",
    HIGH_CPU_USAGE: "W002",
    MEMORY_WARNING: "W003",
    BROWSER_THROTTLING: "W004",
  };

  /**
   * Log levels
   */
  static LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  };

  static #instance = null;
  static #logLevel = Logger.LOG_LEVELS.INFO;
  static #enableConsole = true;
  static #enableRemote = false;
  static #logs = [];
  static #maxLogs = 500; // Keep last 500 logs in memory

  /**
   * Get logger instance (singleton)
   */
  static getInstance() {
    if (!Logger.#instance) {
      Logger.#instance = new Logger();
    }
    return Logger.#instance;
  }

  /**
   * Initialize logger configuration
   * @param {Object} config - Configuration object
   * @param {number} config.logLevel - Log level threshold
   * @param {boolean} config.enableConsole - Log to console
   * @param {boolean} config.enableRemote - Send errors to remote service
   * @param {number} config.maxLogs - Maximum logs to keep in memory
   */
  static configure(config = {}) {
    if (config.logLevel !== undefined) Logger.#logLevel = config.logLevel;
    if (config.enableConsole !== undefined)
      Logger.#enableConsole = config.enableConsole;
    if (config.enableRemote !== undefined)
      Logger.#enableRemote = config.enableRemote;
    if (config.maxLogs !== undefined) Logger.#maxLogs = config.maxLogs;
  }

  /**
   * Add log entry
   */
  static #addLog(level, code, message, context = {}) {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      code,
      message,
      context,
      url: typeof window !== "undefined" ? window.location.href : "node",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "node",
    };

    Logger.#logs.push(log);

    // Keep only last maxLogs entries
    if (Logger.#logs.length > Logger.#maxLogs) {
      Logger.#logs.shift();
    }

    return log;
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {Object} context - Additional context
   */
  static debug(message, context = {}) {
    if (Logger.#logLevel > Logger.LOG_LEVELS.DEBUG) return;

    if (Logger.#enableConsole) {
      console.debug(`[DEBUG] ${message}`, context);
    }

    Logger.#addLog(Logger.LOG_LEVELS.DEBUG, "DEBUG", message, context);
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {Object} context - Additional context
   */
  static info(message, context = {}) {
    if (Logger.#logLevel > Logger.LOG_LEVELS.INFO) return;

    if (Logger.#enableConsole) {
      console.info(`[INFO] ${message}`, context);
    }

    Logger.#addLog(Logger.LOG_LEVELS.INFO, "INFO", message, context);
  }

  /**
   * Log warning
   * @param {string} code - Warning code
   * @param {string} message - Warning message
   * @param {Object} context - Additional context
   */
  static warn(code, message, context = {}) {
    if (Logger.#logLevel > Logger.LOG_LEVELS.WARN) return;

    if (Logger.#enableConsole) {
      console.warn(`[${code}] ${message}`, context);
    }

    Logger.#addLog(Logger.LOG_LEVELS.WARN, code, message, context);
  }

  /**
   * Log error
   * @param {string} code - Error code from ERROR_CODES
   * @param {string} message - Error message
   * @param {Object} context - Additional context (stack trace, etc)
   * @param {Error} error - Original error object
   */
  static error(code, message, context = {}, error = null) {
    if (Logger.#logLevel > Logger.LOG_LEVELS.ERROR) return;

    const fullContext = {
      ...context,
      stack: error?.stack || null,
    };

    if (Logger.#enableConsole) {
      console.error(`[${code}] ${message}`, fullContext);
    }

    const log = Logger.#addLog(
      Logger.LOG_LEVELS.ERROR,
      code,
      message,
      fullContext
    );

    // Send to remote service if enabled
    if (Logger.#enableRemote) {
      Logger.#sendToRemote(log);
    }

    return log;
  }

  /**
   * Send error to remote logging service
   * @private
   */
  static #sendToRemote(log) {
    // Implement your remote logging endpoint here
    // Example: send to Sentry, LogRocket, CloudWatch, etc.
    try {
      // Placeholder for remote service integration
      // fetch('https://your-logging-service.com/api/logs', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(log)
      // });
    } catch (err) {
      console.error("Failed to send log to remote service:", err);
    }
  }

  /**
   * Get all logs
   * @returns {Array} Array of log entries
   */
  static getLogs() {
    return [...Logger.#logs];
  }

  /**
   * Get logs filtered by level
   * @param {number} level - Log level threshold
   * @returns {Array} Filtered logs
   */
  static getLogsByLevel(level) {
    return Logger.#logs.filter((log) => log.level >= level);
  }

  /**
   * Get logs filtered by code
   * @param {string} code - Error/warning code
   * @returns {Array} Filtered logs
   */
  static getLogsByCode(code) {
    return Logger.#logs.filter((log) => log.code === code);
  }

  /**
   * Clear all logs
   */
  static clearLogs() {
    Logger.#logs = [];
  }

  /**
   * Export logs as JSON
   * @returns {string} JSON string of logs
   */
  static exportLogs() {
    return JSON.stringify(Logger.#logs, null, 2);
  }

  /**
   * Export logs as CSV
   * @returns {string} CSV string of logs
   */
  static exportLogsAsCSV() {
    if (Logger.#logs.length === 0) return "No logs";

    const headers = ["Timestamp", "Level", "Code", "Message", "Context", "URL"];
    const rows = Logger.#logs.map((log) => [
      log.timestamp,
      log.level,
      log.code,
      log.message,
      JSON.stringify(log.context).replace(/"/g, '""'), // Escape quotes
      log.url,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return csv;
  }

  /**
   * Create a performance timer
   * @param {string} label - Timer label
   * @returns {Object} Timer object with end() method
   */
  static startTimer(label) {
    const start = performance.now();
    return {
      end: (context = {}) => {
        const duration = performance.now() - start;
        Logger.info(`Timer [${label}]: ${duration.toFixed(2)}ms`, {
          duration,
          ...context,
        });
        return duration;
      },
    };
  }
}

export { Logger };
