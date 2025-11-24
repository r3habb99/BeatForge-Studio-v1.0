# BeatForge Studio - Project Structure

This document describes the refactored file structure of the BeatForge Studio web-based DAW using ES6 modules.

## 📁 Project Structure

```
Music-Studio/
├── musicStudio.html          # Main HTML file (UI structure only)
├── css/
│   └── styles.css            # All CSS styles and custom properties
├── js/
│   ├── constants.js          # Shared constants (ES6 module)
│   ├── app.js                # Main application logic (ES6 module)
│   └── audio/
│       └── audioEngine.js    # Web Audio API synthesis and effects (ES6 module)
└── README_STRUCTURE.md       # This file
```

## 📄 File Descriptions

### `musicStudio.html`

- **Purpose**: Contains the HTML structure and UI elements
- **Content**:
  - Header with transport controls
  - Track headers section
  - Sequencer grid area
  - Global effects footer
  - Piano roll modal
  - Keyboard shortcuts modal
- **Dependencies**: Links to external CSS and JS module

### `css/styles.css`

- **Purpose**: All styling and visual design
- **Content**:
  - CSS custom properties (color scheme, variables)
  - Component styles (buttons, sliders, grids)
  - Modal transitions
  - Scrollbar customization
  - Accessibility features (focus states, screen reader utilities)

### `js/constants.js` ⭐ NEW

- **Purpose**: Centralized constants shared across modules
- **Content**:
  - `STEP_COUNT`: Number of steps in sequencer (16)
  - `NOTES`: Array of musical notes
  - `OCTAVES`: Octave range for piano roll
- **Exports**: ES6 named exports
- **Used by**: `app.js`, `audioEngine.js`

### `js/app.js`

- **Purpose**: Main application logic and user interface management
- **Content**:
  - Application state management
  - UI rendering functions
  - Sequencer scheduler
  - Piano roll editor
  - User interaction handlers
  - LocalStorage persistence
  - Keyboard shortcuts
  - Event listeners setup
- **Imports**:
  - Constants from `constants.js`
  - Audio functions from `audio/audioEngine.js`
- **Exports**: Functions to global scope for HTML inline handlers

### `js/audio/audioEngine.js`

- **Purpose**: Web Audio API synthesis and effects processing
- **Content**:
  - Audio context initialization
  - Drum synthesis (kick, snare, hi-hat)
  - Synthesizer engine (oscillators, filters, envelopes)
  - Effects chain (reverb, delay)
  - Audio routing and mixing
  - Frequency conversion utilities
  - Effect parameter controls
- **Imports**: Constants from `constants.js`
- **Exports**:
  - `initAudio`
  - `playDrum`
  - `playSynth`
  - `updateReverbTime`
  - `updateDelayTime`
  - `updateDelayFeedback`
  - `updateMasterVolume`
  - `getAudioContext`
  - `getAnalyser`
  - `resumeAudioContext`

## 🔄 Module Dependencies

```
musicStudio.html
    ├── css/styles.css
    └── js/app.js (type="module")
            ├── imports constants.js
            └── imports audio/audioEngine.js
                    └── imports constants.js
```

## 🎯 Key Features by Module

### Constants (`constants.js`)

- ✅ Centralized configuration
- ✅ Shared across all modules
- ✅ Easy to maintain and update

### Audio Engine (`audioEngine.js`)

- ✅ Web Audio API initialization
- ✅ Drum synthesis (procedural sound generation)
- ✅ Synth engine with waveforms and filters
- ✅ Convolution reverb with procedural impulse response
- ✅ Stereo delay with feedback
- ✅ Audio routing and panning
- ✅ Master gain control
- ✅ ES6 module exports

### Application Logic (`app.js`)

- ✅ 16-step sequencer
- ✅ 5-track mixer (3 drums + 2 synths)
- ✅ Piano roll editor for synth tracks
- ✅ Real-time visual feedback
- ✅ BPM and swing controls
- ✅ Mute/Solo functionality
- ✅ Auto-save to localStorage
- ✅ Keyboard shortcuts
- ✅ Frequency visualizer
- ✅ ES6 module imports
- ✅ Global function exposure for HTML handlers

### Styles (`styles.css`)

- ✅ Dark theme with custom color scheme
- ✅ Responsive grid layout
- ✅ Custom range sliders
- ✅ Modal animations
- ✅ Accessibility features

## 🚀 Usage

Simply open `musicStudio.html` in a modern web browser that supports ES6 modules. The application will:

1. Load all CSS styles from `css/styles.css`
2. Load the main app module from `js/app.js`
3. App module imports constants and audio engine
4. Initialize the audio engine
5. Start the application logic
6. Restore any previously saved state from localStorage

## 🔧 Development

To modify the application:

- **UI/Layout changes**: Edit `musicStudio.html`
- **Styling changes**: Edit `css/styles.css`
- **Constants changes**: Edit `js/constants.js`
- **Audio/synthesis changes**: Edit `js/audio/audioEngine.js`
- **Application logic changes**: Edit `js/app.js`

## 📝 Notes

- **ES6 Modules**: All JavaScript files use ES6 import/export syntax
- **Module Loading**: Only `app.js` is loaded in HTML with `type="module"`
- **Global Functions**: Functions called from HTML inline handlers are exposed via `window` object
- **No Duplication**: Constants are defined once in `constants.js` and imported where needed
- **Browser Compatibility**: Requires a modern browser with ES6 module support
- **LocalStorage key**: `gemini_daw_save`
