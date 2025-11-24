# 🎵 BeatForge Studio

<div align="center">

![BeatForge Studio](img/BeatForge%20Studio.png)

**A Professional Web-Based Digital Audio Workstation (DAW)**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.ecma-international.org/ecma-262/)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-Enabled-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

[Features](#-features) • [Demo](#-getting-started) • [Documentation](#-documentation) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

**BeatForge Studio** is a powerful, browser-based Digital Audio Workstation (DAW) built with vanilla JavaScript and the Web Audio API. Create professional-quality beats and melodies with an intuitive 16-step sequencer, multiple drum machines, advanced synthesizers, and studio-grade effects—all running directly in your browser with zero installation required.

### ✨ Why BeatForge Studio?

- 🚀 **Zero Installation** - Works directly in your browser
- 🎹 **Professional Tools** - 13 drum sounds + 9 advanced synthesizers
- 🎨 **Beautiful UI** - Modern, responsive design with multiple themes
- 💾 **Auto-Save** - Never lose your work with automatic localStorage persistence
- 📱 **Mobile Ready** - Fully responsive design for tablets and phones
- 🎚️ **Studio Effects** - Reverb, delay, and per-track distortion
- 🎼 **Piano Roll** - Advanced MIDI-style note editor for synth tracks
- 📊 **Real-time Visualizer** - Multiple visualization modes for audio feedback
- ⌨️ **Keyboard Shortcuts** - Professional workflow with extensive shortcuts
- 🎙️ **Recording** - Built-in audio recording and export capabilities

---

## 🎯 Features

### 🥁 Drum Machine

- **13 Drum Sounds**: Kick, Snare, Hi-Hat, Clap, Crash, Ride, Rimshot, Cowbell, Tom (Low/Mid/High), Shaker, Tambourine
- **16-Step Sequencer**: Classic step sequencer interface
- **Per-Track Controls**: Volume, pan, mute, solo, reverb, delay, and distortion
- **Procedural Sound Generation**: All drum sounds synthesized in real-time using Web Audio API

### 🎹 Synthesizers

- **9 Synth Types**:
  - **Basic Synth**: Classic waveform synthesis (sawtooth, square, sine, triangle)
  - **Bass Synth**: Deep, punchy bass sounds
  - **Lead Synth**: Bright, cutting lead tones
  - **Pad Synth**: Lush, atmospheric pads
  - **Pluck Synth**: Sharp, percussive plucks
  - **Organ**: Classic organ emulation
  - **FM Bell**: Frequency modulation bell tones
  - **Sub Bass**: Ultra-low sub-bass frequencies
  - **Acid Bass**: Classic 303-style acid bass
  - **Reese Bass**: Detuned, fat bass sounds

### 🎼 Piano Roll Editor

- **Visual Note Editor**: MIDI-style piano roll for synth tracks
- **Multi-Octave Range**: 3 octaves (C3-B5) for melodic composition
- **Real-time Playback**: Hear notes as you place them
- **Note Management**: Easy add, remove, and edit notes
- **Keyboard Shortcuts**: Delete notes with backspace/delete keys

### 🎚️ Effects & Mixing

- **Global Effects**:
  - Convolution Reverb with adjustable decay time
  - Stereo Delay with feedback control
  - Master volume control
- **Per-Track Effects**:
  - Individual volume and pan controls
  - Track-specific reverb and delay sends
  - Distortion/overdrive effect
- **Mute/Solo System**: Professional mixing workflow
- **Swing Control**: Add groove and timing variation (0-50%)

### 🎨 User Interface

- **4 Theme Options**:
  - Default (Blue accent)
  - Darker (Minimal dark)
  - Cyberpunk (Pink/Purple neon)
  - Neon (Bright neon colors)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Mobile Menu**: Optimized navigation for small screens
- **Tooltips**: Helpful hints throughout the interface
- **Toast Notifications**: Non-intrusive feedback messages
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### 📊 Visualizer

- **3 Visualization Modes**:
  - Frequency Bars (spectrum analyzer)
  - Waveform (oscilloscope)
  - Circular (radial frequency display)
- **Real-time Audio Feedback**: Visual representation of your mix
- **Responsive Canvas**: Adapts to screen size

### 🎙️ Recording & Export

- **Live Recording**: Record your performance in real-time
- **Pause/Resume**: Control recording with pause functionality
- **Export Formats**:
  - WebM audio recording (live performance)
  - WAV export (offline rendering)
- **One-Click Export**: Download your tracks instantly

### ⌨️ Keyboard Shortcuts

- `Space` - Play/Pause
- `Esc` - Close Piano Roll / Close Modals
- `Delete/Backspace` - Clear notes in Piano Roll
- `Ctrl/Cmd + S` - Save state
- `?` - Show keyboard shortcuts overlay

### 💾 State Management

- **Auto-Save**: Automatic localStorage persistence
- **Pattern System**: Save and load multiple patterns
- **State Export/Import**: Backup and restore your projects
- **Clear All**: Reset to default state

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser with ES6 module support:
  - Chrome 61+
  - Firefox 60+
  - Safari 11+
  - Edge 79+

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/beatforge-studio.git
   cd beatforge-studio
   ```

2. **Open in browser**:

   ```bash
   # Simply open the HTML file
   open musicStudio.html

   # Or use a local server (recommended)
   python -m http.server 8000
   # Then navigate to http://localhost:8000/musicStudio.html
   ```

3. **Start creating**:
   - Click "Initialize Audio" to start the audio engine
   - Click on the sequencer grid to add drum beats
   - Click track names to open the piano roll for synth tracks
   - Adjust BPM, swing, and effects to taste
   - Press Play and enjoy!

### Quick Start Guide

1. **Initialize Audio**: Click the "Initialize Audio" button in the Actions menu
2. **Add Drum Beats**: Click on the grid cells to activate steps for drum tracks
3. **Create Melodies**: Click on synth track names (Bass, Lead, Pad, etc.) to open the piano roll
4. **Adjust Settings**:
   - Set your BPM (40-240)
   - Add swing for groove
   - Adjust master volume
5. **Mix Your Track**:
   - Use volume sliders for each track
   - Pan tracks left/right for stereo width
   - Add reverb and delay for depth
   - Use mute/solo for arrangement
6. **Record & Export**:
   - Click the record button to capture your performance
   - Click export to download your track

---

## 📁 Project Structure

```
Music-Studio/
├── musicStudio.html              # Main HTML file
├── css/
│   └── styles.css                # All CSS styles and themes
├── img/
│   └── BeatForge Studio.png      # Logo and assets
├── js/
│   ├── app.js                    # Main application entry point
│   ├── constants.js              # Shared constants
│   ├── audio/                    # Audio engine modules
│   │   ├── audioEngine.js        # Main audio module
│   │   ├── audioContext.js       # Web Audio API context
│   │   ├── effects.js            # Reverb, delay effects
│   │   ├── recorder.js           # Audio recording
│   │   ├── export.js             # WAV export functionality
│   │   ├── routing.js            # Audio routing
│   │   ├── helpers.js            # Audio utilities
│   │   ├── drums/                # Drum synthesis
│   │   │   └── drumSounds.js     # All drum sound generators
│   │   ├── synths/               # Synthesizer engines
│   │   │   └── synthSounds.js    # All synth engines
│   │   └── utils/                # Audio utilities
│   │       ├── impulse-response.js
│   │       └── distortion-curve.js
│   ├── state/                    # State management
│   │   └── stateManager.js       # Application state
│   ├── scheduler/                # Timing and playback
│   │   └── scheduler.js          # Step sequencer scheduler
│   ├── ui/                       # User interface modules
│   │   ├── eventHandlers.js      # Event listeners
│   │   ├── trackRenderer.js      # Track UI rendering
│   │   ├── pianoRoll.js          # Piano roll editor
│   │   ├── visualizer.js         # Audio visualizer
│   │   ├── patternManager.js     # Pattern switching
│   │   ├── trackControls.js      # Track control handlers
│   │   ├── actionsMenu.js        # Actions dropdown menu
│   │   ├── mobileMenu.js         # Mobile navigation
│   │   ├── scrollSync.js         # Synchronized scrolling
│   │   └── controls/             # UI controls
│   │       ├── keyboardShortcuts.js
│   │       └── recordingControls.js
│   ├── utils/                    # Utility modules
│   │   ├── toast.js              # Toast notifications
│   │   ├── tooltip.js            # Tooltip system
│   │   ├── theme.js              # Theme switching
│   │   ├── trackColors.js        # Track color management
│   │   ├── shortcutsOverlay.js   # Shortcuts panel
│   │   └── uiEnhancements.js     # UI improvements
│   └── constants/                # Additional constants
│       └── themes.js             # Theme definitions
└── README.md                     # This file
```

---

## 🏗️ Architecture

### Module System

BeatForge Studio uses **ES6 modules** for clean, maintainable code organization:

```
┌─────────────────────────────────────────────────────────┐
│                   musicStudio.html                      │
│                  (Main HTML Entry)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ├─── css/styles.css (Styling)
                     │
                     └─── js/app.js (Main Module)
                            │
                            ├─── constants.js
                            ├─── state/stateManager.js
                            ├─── scheduler/scheduler.js
                            ├─── audio/audioEngine.js
                            │      ├─── audioContext.js
                            │      ├─── effects.js
                            │      ├─── drums/drumSounds.js
                            │      ├─── synths/synthSounds.js
                            │      ├─── recorder.js
                            │      └─── export.js
                            └─── ui/
                                   ├─── trackRenderer.js
                                   ├─── pianoRoll.js
                                   ├─── visualizer.js
                                   ├─── eventHandlers.js
                                   └─── controls/
```

### Key Technologies

- **Web Audio API**: Professional-grade audio synthesis and processing
- **ES6 Modules**: Modern JavaScript module system
- **LocalStorage API**: Persistent state management
- **Canvas API**: Real-time audio visualization
- **MediaRecorder API**: Audio recording capabilities
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Font Awesome**: Icon library (via CDN)

### Audio Signal Flow

```
┌──────────────┐
│ Drum Tracks  │──┐
└──────────────┘  │
                  │    ┌──────────┐    ┌────────┐    ┌──────────┐
┌──────────────┐  ├───→│  Reverb  │───→│ Delay  │───→│  Master  │───→ Output
│ Synth Tracks │──┘    └──────────┘    └────────┘    │   Gain   │
└──────────────┘                                      └──────────┘
                                                            │
                                                            ├──→ Analyser (Visualizer)
                                                            └──→ Recorder
```

### State Management

The application uses a centralized state management system:

- **Global State**: BPM, playing status, current step, patterns
- **Track State**: Volume, pan, mute, solo, effects per track
- **Pattern State**: Multiple patterns with independent track data
- **Persistence**: Auto-save to localStorage on every change
- **Storage Key**: `gemini_daw_save`

---

## 📚 Documentation

### Core Modules

#### Audio Engine (`js/audio/`)

The audio engine is the heart of BeatForge Studio, handling all sound generation and processing:

- **audioContext.js**: Manages the Web Audio API context and master gain
- **audioEngine.js**: Main audio module that exports all audio functions
- **effects.js**: Implements reverb and delay effects
- **drums/drumSounds.js**: Procedural drum sound synthesis
- **synths/synthSounds.js**: Advanced synthesizer engines
- **recorder.js**: Real-time audio recording
- **export.js**: Offline audio rendering and WAV export

#### State Manager (`js/state/stateManager.js`)

Manages application state and persistence:

- Centralized state object
- Pattern management
- LocalStorage integration
- State import/export
- Track configuration

#### Scheduler (`js/scheduler/scheduler.js`)

Handles precise timing and playback:

- High-precision scheduling using Web Audio API timing
- Swing implementation
- Step sequencer logic
- Note queue management
- Lookahead scheduling for accurate timing

#### UI Modules (`js/ui/`)

Modular UI components:

- **trackRenderer.js**: Renders track headers and sequencer grid
- **pianoRoll.js**: MIDI-style note editor
- **visualizer.js**: Audio visualization
- **eventHandlers.js**: Global event listeners
- **patternManager.js**: Pattern switching UI
- **trackControls.js**: Track control handlers

### Adding New Features

#### Adding a New Drum Sound

1. Open `js/audio/drums/drumSounds.js`
2. Add a new case to the `playDrum()` function
3. Implement sound synthesis using Web Audio API
4. Add the track to the default state in `js/state/stateManager.js`

#### Adding a New Synthesizer

1. Open `js/audio/synths/synthSounds.js`
2. Add a new case to the `playSynth()` function
3. Implement the synth engine with oscillators, filters, and envelopes
4. Add the synth track to the default state

#### Adding a New Effect

1. Open `js/audio/effects.js`
2. Create the effect node in `setupEffects()`
3. Add update functions for effect parameters
4. Export the functions from `audioEngine.js`
5. Add UI controls in `musicStudio.html`

---

## 🎨 Customization

### Themes

BeatForge Studio includes 4 built-in themes. To add a new theme:

1. Open `css/styles.css`
2. Add a new theme variant:

```css
[data-theme="mytheme"] {
  --bg-dark: #yourcolor;
  --bg-panel: #yourcolor;
  --accent: #yourcolor;
  /* ... other variables */
}
```

3. Add the theme to `js/constants/themes.js`
4. The theme will automatically appear in the theme selector

### Track Colors

Track colors are defined using Tailwind CSS classes in `js/state/stateManager.js`:

```javascript
{
  id: 0,
  type: 'drum',
  name: 'Kick',
  color: 'bg-red-500',  // Change this
  // ... other properties
}
```

Available colors: `bg-red-500`, `bg-blue-600`, `bg-purple-500`, etc.

---

## 🔧 Development

### Code Style

- **ES6+**: Modern JavaScript features
- **Modular**: Each file has a single responsibility
- **Documented**: JSDoc comments for all functions
- **Consistent**: Consistent naming and formatting

### File Organization

- **Separation of Concerns**: Audio, UI, and state are separate
- **Module Exports**: Named exports for clarity
- **Import Paths**: Relative imports from module root
- **Constants**: Shared constants in dedicated files

### Best Practices

1. **Audio Context**: Always check if audio context is initialized
2. **Error Handling**: Wrap audio operations in try-catch blocks
3. **Memory Management**: Disconnect audio nodes when done
4. **State Updates**: Always save state after modifications
5. **Event Listeners**: Clean up listeners when components unmount

### Testing

To test the application:

1. Open browser developer tools (F12)
2. Check console for errors
3. Test audio initialization
4. Test all transport controls
5. Test recording and export
6. Test on different browsers
7. Test responsive design on mobile

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 61+     | ✅ Fully Supported |
| Firefox | 60+     | ✅ Fully Supported |
| Safari  | 11+     | ✅ Fully Supported |
| Edge    | 79+     | ✅ Fully Supported |
| Opera   | 48+     | ✅ Fully Supported |

**Note**: Requires Web Audio API and ES6 module support.

---

## 🐛 Troubleshooting

### Audio Not Playing

1. Click "Initialize Audio" button
2. Check browser console for errors
3. Ensure browser supports Web Audio API
4. Check system audio settings
5. Try a different browser

### Recording Not Working

1. Ensure audio is initialized
2. Check browser permissions for audio
3. Try using Chrome/Firefox (best support)
4. Check available disk space

### Performance Issues

1. Close other browser tabs
2. Reduce number of active tracks
3. Lower reverb decay time
4. Disable visualizer
5. Use a modern browser

### State Not Saving

1. Check browser localStorage is enabled
2. Clear browser cache and reload
3. Check available storage space
4. Try manual save (Ctrl+S)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check existing issues first
2. Create a detailed bug report
3. Include browser version and OS
4. Provide steps to reproduce
5. Include console errors if any

### Suggesting Features

1. Check existing feature requests
2. Describe the feature in detail
3. Explain the use case
4. Consider implementation complexity

### Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/beatforge-studio.git

# Create a branch
git checkout -b feature/my-feature

# Make changes and test
# ...

# Commit and push
git add .
git commit -m "Add my feature"
git push origin feature/my-feature
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Web Audio API** - For making browser-based audio possible
- **Tailwind CSS** - For the utility-first CSS framework
- **Font Awesome** - For the icon library
- **MDN Web Docs** - For excellent Web Audio API documentation
- **The Web Audio Community** - For inspiration and knowledge sharing

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/beatforge-studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/beatforge-studio/discussions)
- **Email**: <your.email@example.com>

---

## 🗺️ Roadmap

### Planned Features

- [ ] MIDI file import/export
- [ ] More synthesizer types
- [ ] Additional effects (chorus, phaser, compressor)
- [ ] Automation lanes
- [ ] Multiple patterns per project
- [ ] Collaborative editing
- [ ] Cloud save/load
- [ ] Sample import
- [ ] VST plugin support (via Web Audio)
- [ ] Mobile app version

### Version History

- **v1.0.0** - Initial release with core features
  - 16-step sequencer
  - 13 drum sounds
  - 9 synthesizers
  - Piano roll editor
  - Recording and export
  - Multiple themes
  - Responsive design

---

## 🌐 Deployment

Ready to deploy BeatForge Studio? We've got you covered!

### 📦 Deployment Files Included

All necessary files for production deployment are included:

- ✅ **sitemap.xml** - SEO optimization
- ✅ **robots.txt** - Search engine control
- ✅ **manifest.json** - PWA support
- ✅ **service-worker.js** - Offline functionality
- ✅ **.htaccess** - Apache configuration
- ✅ **netlify.toml** - Netlify deployment
- ✅ **vercel.json** - Vercel deployment

### 🚀 Quick Deploy

**Netlify (Recommended):**

```bash
# Drag & drop at app.netlify.com/drop
# Or connect your Git repository
```

**Vercel:**

```bash
npm i -g vercel
vercel
```

**GitHub Pages:**

```bash
# File is already named index.html - ready to deploy!
# Enable Pages in repository settings
```

### 📚 Deployment Guides

- **[QUICK-DEPLOY.md](QUICK-DEPLOY.md)** - Get online in 5 minutes
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment guide
- **[DEPLOYMENT-FILES.md](DEPLOYMENT-FILES.md)** - Overview of all deployment files

### ⚡ Features After Deployment

- 🌐 **SEO Optimized** - Meta tags, sitemap, structured data
- 📱 **PWA Ready** - Installable on desktop and mobile
- 🚀 **Performance** - Service worker caching, compression
- 🔒 **Secure** - HTTPS, security headers
- 📊 **Analytics Ready** - Easy integration with Google Analytics

### 🎯 Before Deploying

Update your domain in these files:

1. `sitemap.xml`
2. `robots.txt`
3. `index.html` (meta tags)

See [QUICK-DEPLOY.md](QUICK-DEPLOY.md) for detailed instructions.

---

<div align="center">

**Made with ❤️ and Web Audio API**

⭐ Star this repo if you find it useful!

[Back to Top](#-beatforge-studio)

</div>
