/**
 * Audio Configuration Module
 * Centralized configuration for all audio system constants
 * Single source of truth for tuning audio parameters
 */

/**
 * Main audio context configuration
 */
export const AUDIO_CONFIG = {
  // Master volume
  MASTER_VOLUME: 0.8,

  // Analyser configuration
  FFT_SIZE: 32768, // Can be adjusted: 2048, 4096, 8192, 16384, 32768
  ANALYSER_SMOOTHING: 0.85,

  // Reverb configuration
  REVERB_DECAY_TIME: 2.0,
  REVERB_DRY_LEVEL: 1.0,
  REVERB_WET_LEVEL: 1.0,

  // Delay configuration
  DELAY_MAX_TIME: 5.0,
  DELAY_TIME: 0.3,
  DELAY_FEEDBACK: 0.4,
  DELAY_DRY_LEVEL: 1.0,
  DELAY_WET_LEVEL: 1.0,

  // Browser compatibility
  FALLBACK_AUDIO_CONTEXT: "webkitAudioContext",
};

/**
 * Scheduler configuration
 */
export const SCHEDULER_CONFIG = {
  // Audio scheduling timing
  SCHEDULE_AHEAD_TIME: 0.5, // Schedule 500ms ahead to prevent dropouts
  LOOKAHEAD_INTERVAL: 25, // Check every 25ms
  MIN_LOOKAHEAD_INTERVAL: 25, // Minimum interval when page is visible
  MAX_LOOKAHEAD_INTERVAL: 100, // Maximum interval when page might be throttled
  THROTTLE_DETECTION_THRESHOLD: 100, // ms - consider browser throttled if gap > this
};

/**
 * Default track configurations
 */
export const TRACK_DEFAULTS = {
  DRUM: {
    vol: 0.7,
    pan: 0,
    mute: false,
    solo: false,
    rev: 0.2,
    del: 0,
    distortion: 0,
  },
  SYNTH: {
    vol: 0.5,
    pan: 0,
    mute: false,
    solo: false,
    rev: 0.2,
    del: 0,
    distortion: 0,
  },
};

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  // Step count in sequencer
  STEP_COUNT: 16,

  // Visual update intervals
  VISUALIZER_UPDATE_INTERVAL: 1000 / 60, // 60 FPS
  SCOPE_BUFFER_SIZE: 4096,

  // Toast notification defaults
  TOAST_DURATION: 3000,
  TOAST_POSITION: "bottom-right",

  // Piano roll configuration
  PIANO_ROLL_OCTAVE_START: 2,
  PIANO_ROLL_OCTAVE_END: 6,
  PIANO_ROLL_SNAP_TO_GRID: true,
};

/**
 * State management configuration
 */
export const STATE_CONFIG = {
  // Storage key
  STORAGE_KEY: "beatforge_state",

  // Default values
  DEFAULT_BPM: 120,
  MIN_BPM: 20,
  MAX_BPM: 300,

  // Pattern limits
  MIN_PATTERNS: 1,
  MAX_PATTERNS: 100,

  // Track limits
  MIN_TRACKS_PER_PATTERN: 1,
  MAX_TRACKS_PER_PATTERN: 32,

  // Swing configuration
  DEFAULT_SWING: 0,
  MIN_SWING: -0.5,
  MAX_SWING: 0.5,
};

/**
 * Noise generation configuration
 */
export const NOISE_CONFIG = {
  // Caching
  ENABLE_CACHE: true,
  MAX_CACHE_SIZE: 10,

  // Duration limits
  MIN_DURATION: 0.001,
  MAX_DURATION: 300,

  // Available noise types
  NOISE_TYPES: {
    WHITE: "white",
    PINK: "pink",
    BROWN: "brown",
  },
};

/**
 * Drum sounds configuration
 * Centralized parameters for all drum synthesizers
 */
export const DRUM_CONFIG = {
  // Kick drum parameters
  KICK: {
    freq_start: 150,
    freq_end: 0.01,
    duration: 0.5,
    curve: "exponential",
  },

  // Snare drum parameters
  SNARE: {
    noise_duration: 0.2,
    noise_filter_type: "highpass",
    noise_filter_freq: 1000,
    tone_type: "triangle",
    tone_freq: 200,
    tone_duration: 0.1,
    tone_volume_scale: 0.5,
    curve: "exponential",
  },

  // Hi-hat parameters
  HIHAT: {
    noise_duration: 0.05,
    noise_filter_type: "highpass",
    noise_filter_freq: 8000,
    curve: "exponential",
  },

  // Clap parameters
  CLAP: {
    noise_duration: 0.15,
    noise_filter_type: "highpass",
    noise_filter_freq: 2000,
    filter_q: 1.0,
    curve: "exponential",
  },

  // Rimshot parameters
  RIMSHOT: {
    freq_start: 800,
    freq_end: 200,
    duration: 0.05,
    tone_type: "square",
    curve: "exponential",
  },

  // Cowbell parameters
  COWBELL: {
    freq_start: 800,
    freq_end: 400,
    duration: 0.15,
    tone_type: "sine",
    harmonics: [1, 1.5, 2],
    curve: "linear",
  },

  // Tom parameters
  TOM: {
    freq_scale: 1.0, // Multiplied by the frequency passed
    duration: 0.15,
    tone_type: "sine",
    curve: "exponential",
  },

  // Crash cymbal parameters
  CRASH: {
    noise_duration: 1.0,
    noise_filter_type: "highpass",
    noise_filter_freq: 4000,
    noise_decay_start: 0.05,
    tone_freqs: [523.25, 659.25, 783.99], // C5, E5, G5
    tone_duration: 0.5,
    curve: "exponential",
  },

  // Ride cymbal parameters
  RIDE: {
    noise_duration: 0.4,
    noise_filter_type: "highpass",
    noise_filter_freq: 3000,
    tone_freq: 600,
    tone_duration: 0.3,
    curve: "exponential",
  },

  // Shaker parameters
  SHAKER: {
    noise_duration: 0.1,
    noise_filter_type: "highpass",
    noise_filter_freq: 4000,
    repetitions: 2,
    curve: "exponential",
  },

  // Tambourine parameters
  TAMBOURINE: {
    noise_duration: 0.15,
    noise_filter_type: "highpass",
    noise_filter_freq: 3000,
    tone_freq: 300,
    tone_duration: 0.1,
    curve: "exponential",
  },

  // Caching
  ENABLE_CACHE: true,
  MAX_CACHE_SIZE: 20,

  // Min/Max constraints
  MIN_DURATION: 0.01,
  MAX_DURATION: 2.0,
  MIN_FREQUENCY: 20,
  MAX_FREQUENCY: 20000,
};

/**
 * Synthesizer sounds configuration
 * Centralized parameters for all synth types
 */
export const SYNTH_CONFIG = {
  // Basic Synth parameters
  BASIC: {
    oscillator_type: "square",
    attack: 0.01,
    decay: 0.1,
    sustain: 0.7,
    release: 0.3,
  },

  // Pad Synth parameters
  PAD: {
    oscillator_type: "sine",
    attack: 0.5,
    decay: 0.3,
    sustain: 0.8,
    release: 0.8,
    filter_cutoff: 2000,
    filter_q: 2,
    vibrato_rate: 5,
    vibrato_amount: 20,
  },

  // Pluck Synth parameters
  PLUCK: {
    oscillator_type: "triangle",
    attack: 0.001,
    decay: 0.4,
    sustain: 0,
    release: 0.2,
    filter_cutoff: 3000,
    filter_q: 1,
  },

  // Organ parameters
  ORGAN: {
    oscillator_type: "sine",
    attack: 0.01,
    decay: 0,
    sustain: 1.0,
    release: 0.1,
    harmonics: [1, 2, 3, 4, 5],
    harmonic_levels: [1.0, 0.5, 0.3, 0.2, 0.1],
  },

  // FM Synth parameters
  FM: {
    carrier_type: "sine",
    modulator_type: "sine",
    attack: 0.01,
    decay: 0.2,
    sustain: 0.6,
    release: 0.3,
    modulation_ratio: 2,
    modulation_index: 5,
  },

  // Sub Bass parameters
  SUB_BASS: {
    oscillator_type: "sine",
    attack: 0.01,
    decay: 0.1,
    sustain: 0.8,
    release: 0.2,
    filter_cutoff: 100,
    filter_q: 1,
  },

  // Acid Bass parameters
  ACID_BASS: {
    oscillator_type: "square",
    attack: 0.01,
    decay: 0.5,
    sustain: 0.5,
    release: 0.3,
    filter_cutoff: 1000,
    filter_q: 8,
    filter_resonance: true,
    filter_modulation: 0.8,
  },

  // Reese Bass parameters
  REESE_BASS: {
    oscillator_type: "sawtooth",
    attack: 0.05,
    decay: 0.2,
    sustain: 0.7,
    release: 0.3,
    filter_cutoff: 800,
    filter_q: 4,
    detuning: 5, // Hz detuning between oscillators
    num_oscillators: 3,
  },

  // Common synth constraints
  MIN_FREQUENCY: 16.35, // C0
  MAX_FREQUENCY: 7040, // B7
  MIN_DURATION: 0.01,
  MAX_DURATION: 60,
  MIN_VELOCITY: 0,
  MAX_VELOCITY: 1,

  // ADSR envelope limits
  MIN_TIME: 0.001,
  MAX_ATTACK: 5,
  MAX_DECAY: 5,
  MAX_RELEASE: 5,

  // Filter parameters
  MIN_FILTER_CUTOFF: 20,
  MAX_FILTER_CUTOFF: 20000,
  MIN_FILTER_Q: 0.1,
  MAX_FILTER_Q: 30,

  // Caching
  ENABLE_CACHE: true,
  MAX_CACHE_SIZE: 50,
};

/**
 * Export/Recording configuration
 */
export const EXPORT_CONFIG = {
  // Audio bit rate
  AUDIO_BIT_DEPTH: 16,
  SAMPLE_RATE: 44100,

  // Export format
  DEFAULT_FORMAT: "wav",
  SUPPORTED_FORMATS: ["wav", "webm", "mp3"],

  // Recording quality
  RECORDING_CHANNELS: 2,
};

/**
 * Performance configuration
 */
export const PERFORMANCE_CONFIG = {
  // Memory limits
  MAX_BUFFER_SIZE: 60 * 44100, // 60 seconds at 44.1kHz
  CIRCULAR_BUFFER_SIZE: 1000,

  // CPU usage thresholds
  HIGH_CPU_THRESHOLD: 80, // Percent
  CRITICAL_CPU_THRESHOLD: 95, // Percent
};

/**
 * Keyboard shortcuts configuration
 */
export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: "space",
  STOP: "Escape",
  RECORD: "r",
  EXPORT: "e",
  CLEAR: "c",
  SHOW_HELP: "?",
  UNDO: "ctrl+z",
  REDO: "ctrl+shift+z",
};

/**
 * Color configuration for tracks
 */
export const TRACK_COLORS = {
  DRUMS: [
    "bg-red-500",
    "bg-yellow-500",
    "bg-orange-400",
    "bg-pink-500",
    "bg-cyan-400",
    "bg-teal-400",
    "bg-amber-500",
    "bg-lime-500",
    "bg-rose-600",
    "bg-rose-500",
    "bg-rose-400",
    "bg-emerald-400",
    "bg-violet-400",
  ],
  SYNTHS: [
    "bg-blue-600",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-fuchsia-500",
    "bg-amber-600",
    "bg-sky-500",
    "bg-slate-700",
    "bg-green-600",
    "bg-blue-800",
  ],
};

/**
 * Feature flags for experimental features
 */
export const FEATURE_FLAGS = {
  ENABLE_ADVANCED_EFFECTS: true,
  ENABLE_UNDO_REDO: false, // Not yet implemented
  ENABLE_MIDI_SUPPORT: false, // Not yet implemented
  ENABLE_COLLABORATION: false, // Not yet implemented
  ENABLE_VST_SUPPORT: false, // Not yet implemented
};

/**
 * Development/Debug configuration
 */
export const DEBUG_CONFIG = {
  ENABLE_LOGGING: false, // Set dynamically by getEnvironment()
  LOG_LEVEL: "INFO", // DEBUG, INFO, WARN, ERROR
  SHOW_PERFORMANCE_METRICS: false,
  SHOW_AUDIO_STATS: false,
};

/**
 * Detect environment without .env file
 * Priority: URL param (?env=development) > localStorage > hostname-based
 *
 * Examples:
 * - http://localhost:3000 → 'development'
 * - http://localhost:3000?env=production → 'production' (override)
 * - https://beatforge.app → 'production'
 * - https://beatforge.app?env=development → 'development' (for testing)
 */
export function getEnvironment() {
  // 1. Check URL parameter (?env=development)
  const urlParams = new URLSearchParams(window.location.search);
  const urlEnv = urlParams.get("env");
  if (urlEnv && ["development", "staging", "production"].includes(urlEnv)) {
    return urlEnv;
  }

  // 2. Check localStorage (user preference)
  const storedEnv = localStorage.getItem("beatforge_environment");
  if (
    storedEnv &&
    ["development", "staging", "production"].includes(storedEnv)
  ) {
    return storedEnv;
  }

  // 3. Auto-detect from hostname
  const hostname = window.location.hostname;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.")
  ) {
    return "development";
  }
  if (
    hostname.includes("staging") ||
    hostname.includes("dev") ||
    hostname.includes("test")
  ) {
    return "staging";
  }

  // 4. Default to production
  return "production";
}

/**
 * Set environment preference (saves to localStorage)
 */
export function setEnvironment(env) {
  if (["development", "staging", "production"].includes(env)) {
    localStorage.setItem("beatforge_environment", env);
    console.info(
      `[Config] Environment set to: ${env}. Reload page to apply changes.`
    );
    return true;
  }
  console.warn(
    `[Config] Invalid environment: ${env}. Valid options: development, staging, production`
  );
  return false;
}

/**
 * Get configuration by environment
 * Merges all config objects and applies environment-specific overrides
 *
 * @param {string} env - Optional environment override
 * @returns {object} Merged configuration object
 */
export function getConfig(env) {
  // Use provided env or auto-detect
  const currentEnv = env || getEnvironment();

  // Base configuration (all environments)
  const config = {
    ENVIRONMENT: currentEnv,
    ...AUDIO_CONFIG,
    ...SCHEDULER_CONFIG,
    ...UI_CONFIG,
    ...STATE_CONFIG,
    ...NOISE_CONFIG,
    ...EXPORT_CONFIG,
    ...PERFORMANCE_CONFIG,
    ...KEYBOARD_SHORTCUTS,
    ...TRACK_COLORS,
    ...FEATURE_FLAGS,
  };

  // Development-specific overrides
  if (currentEnv === "development") {
    config.DEBUG_ENABLED = true;
    config.ENABLE_LOGGING = true;
    DEBUG_CONFIG.ENABLE_LOGGING = true;
    DEBUG_CONFIG.LOG_LEVEL = "DEBUG";
    config.SHOW_PERFORMANCE_METRICS = true;
    config.SHOW_AUDIO_STATS = true;
    config.LOG_LEVEL = "DEBUG";
  }

  // Staging-specific overrides
  if (currentEnv === "staging") {
    config.DEBUG_ENABLED = false;
    config.ENABLE_LOGGING = true;
    DEBUG_CONFIG.ENABLE_LOGGING = true;
    DEBUG_CONFIG.LOG_LEVEL = "INFO";
    config.SHOW_PERFORMANCE_METRICS = false;
    config.SHOW_AUDIO_STATS = false;
    config.LOG_LEVEL = "INFO";
  }

  // Production-specific overrides
  if (currentEnv === "production") {
    config.DEBUG_ENABLED = false;
    config.ENABLE_LOGGING = false;
    DEBUG_CONFIG.ENABLE_LOGGING = false;
    DEBUG_CONFIG.LOG_LEVEL = "WARN";
    config.SHOW_PERFORMANCE_METRICS = false;
    config.SHOW_AUDIO_STATS = false;
    config.LOG_LEVEL = "WARN";
  }

  return config;
}

/**
 * Update audio configuration at runtime
 */
export function updateAudioConfig(updates = {}) {
  Object.assign(AUDIO_CONFIG, updates);
}

/**
 * Reset all configurations to defaults
 */
export function resetConfig() {
  // This would typically reload from original values
  // For now, it's a placeholder
  console.info("Configuration reset to defaults");
}

export default {
  AUDIO_CONFIG,
  SCHEDULER_CONFIG,
  TRACK_DEFAULTS,
  UI_CONFIG,
  STATE_CONFIG,
  NOISE_CONFIG,
  EXPORT_CONFIG,
  PERFORMANCE_CONFIG,
  KEYBOARD_SHORTCUTS,
  TRACK_COLORS,
  FEATURE_FLAGS,
  DEBUG_CONFIG,
};
