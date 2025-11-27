# 🎵 BeatForge Studio - Architecture Diagrams

## How to Export These Diagrams

1. **Mermaid Live Editor**: Go to [mermaid.live](https://mermaid.live) and paste each diagram
2. **Export as PNG/SVG**: Use the export button in the live editor
3. **VS Code**: Install "Mermaid Preview" extension to view and export

---

## Diagram 1: System Architecture

```mermaid
flowchart TB
    subgraph Entry["🌐 Entry Point"]
        HTML["index.html"]
        CSS["css/styles.css"]
        SW["service-worker.js"]
    end

    subgraph Core["⚙️ Core Application"]
        APP["js/app.js<br/>Main Entry"]
        CONST["js/constants.js"]
        CONFIG["js/config/audioConfig.js"]
    end

    subgraph Audio["🔊 Audio Engine"]
        AE["audioEngine.js<br/>Main Audio Module"]
        AC["audioContext.js<br/>Web Audio API"]
        EFX["effects.js<br/>Reverb & Delay"]
        REC["recorder.js<br/>Recording"]
        EXP["export.js<br/>WAV Export"]
        
        subgraph Sounds["🎵 Sound Generation"]
            DRUMS["drums/drumSounds.js<br/>13 Drum Sounds"]
            SYNTHS["synths/synthSounds.js<br/>9 Synthesizers"]
        end
    end

    subgraph State["💾 State Management"]
        SM["stateManager.js"]
        LS["localStorage<br/>Auto-persistence"]
    end

    subgraph Scheduler["⏱️ Scheduler"]
        SCH["scheduler.js<br/>Timing & Playback"]
    end

    subgraph UI["🎨 UI Components"]
        TR["trackRenderer.js"]
        PR["pianoRoll.js"]
        VIS["visualizer.js"]
        EH["eventHandlers.js"]
        PM["patternManager.js"]
        TC["trackControls.js"]
        SS["scrollSync.js"]
        MM["mobileMenu.js"]
    end

    HTML --> APP
    HTML --> CSS
    HTML --> SW
    
    APP --> CONST
    APP --> CONFIG
    APP --> AE
    APP --> SM
    APP --> SCH
    APP --> UI

    AE --> AC
    AE --> EFX
    AE --> REC
    AE --> EXP
    AE --> DRUMS
    AE --> SYNTHS

    SM --> LS
    SCH --> AE

    UI --> TR
    UI --> PR
    UI --> VIS
    UI --> EH
    UI --> PM
    UI --> TC
    UI --> SS
    UI --> MM
```

---

## Diagram 2: Audio Signal Flow

```mermaid
flowchart LR
    subgraph Sources["🎵 Sound Sources"]
        OSC["Oscillators<br/>sine, square, saw, triangle"]
        NOISE["Noise Generator<br/>white, pink, brown"]
    end

    subgraph Envelope["📈 Envelope"]
        ADSR["ADSR Envelope<br/>Attack, Decay, Sustain, Release"]
    end

    subgraph Filter["🎛️ Filter"]
        BQ["Biquad Filter<br/>Lowpass, Highpass, Bandpass"]
    end

    subgraph Effects["✨ Effects"]
        REV["Convolver<br/>Reverb"]
        DEL["Delay Node<br/>Echo/Delay"]
    end

    subgraph Master["🔊 Master"]
        MG["Master Gain<br/>Volume Control"]
        ANA["Analyser<br/>Visualization"]
        DEST["Audio Destination<br/>Speakers"]
    end

    OSC --> ADSR
    NOISE --> ADSR
    ADSR --> BQ
    BQ --> REV
    BQ --> DEL
    REV --> MG
    DEL --> MG
    MG --> ANA
    ANA --> DEST
```

---

## Diagram 3: User Interaction Flow

```mermaid
flowchart TB
    START([🎵 User Opens BeatForge])
    INIT["Initialize Audio<br/>Click to start AudioContext"]
    
    subgraph Create["🎹 Create Music"]
        DRUMS["Click Grid<br/>Add Drum Beats"]
        SYNTH["Click Track Name<br/>Open Piano Roll"]
        NOTES["Draw Notes<br/>Create Melodies"]
    end

    subgraph Mix["🎚️ Mix & Adjust"]
        BPM["Set BPM<br/>40-240 range"]
        SWING["Add Swing<br/>Groove feel"]
        VOL["Adjust Volume<br/>Per track"]
        PAN["Pan L/R<br/>Stereo width"]
        FX["Add Effects<br/>Reverb & Delay"]
        MUTE["Mute/Solo<br/>Track isolation"]
    end

    subgraph Export["💾 Save & Export"]
        SAVE["Auto-Save<br/>localStorage"]
        REC["Record<br/>Capture audio"]
        WAV["Export WAV<br/>Download file"]
        JSON["Export JSON<br/>Project backup"]
    end

    subgraph Play["▶️ Playback"]
        PLAY["Play Button<br/>Start sequence"]
        STOP["Stop Button<br/>Pause playback"]
        VIS["Visualizer<br/>See waveform"]
    end

    START --> INIT
    INIT --> Create
    Create --> Mix
    Mix --> Play
    Play --> Export
    
    DRUMS --> Mix
    SYNTH --> NOTES
    NOTES --> Mix
```

---

## Diagram 4: Module Dependencies (Layered)

```mermaid
graph TD
    subgraph Layer1["Layer 1: Entry"]
        A[index.html]
    end

    subgraph Layer2["Layer 2: Main App"]
        B[app.js]
    end

    subgraph Layer3["Layer 3: Core Modules"]
        C[audioEngine.js]
        D[stateManager.js]
        E[scheduler.js]
    end

    subgraph Layer4["Layer 4: Audio Sub-modules"]
        F[audioContext.js]
        G[effects.js]
        H[drumSounds.js]
        I[synthSounds.js]
        J[recorder.js]
        K[export.js]
    end

    subgraph Layer5["Layer 5: UI Components"]
        L[trackRenderer.js]
        M[pianoRoll.js]
        N[visualizer.js]
        O[eventHandlers.js]
        P[patternManager.js]
    end

    subgraph Layer6["Layer 6: Utilities"]
        Q[constants.js]
        R[audioConfig.js]
        S[logger.js]
    end

    A --> B
    B --> C
    B --> D
    B --> E
    B --> L
    B --> M
    B --> N
    B --> O
    B --> P

    C --> F
    C --> G
    C --> H
    C --> I
    C --> J
    C --> K

    E --> C
    E --> D

    L --> D
    M --> C
    N --> F

    C --> Q
    C --> R
    D --> Q
    E --> Q
```

---

## Diagram 5: State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Loading: App Start

    Loading --> Initializing: Load from localStorage
    Loading --> DefaultState: No saved state

    DefaultState --> Ready: Initialize defaults
    Initializing --> Ready: Restore state

    Ready --> Playing: Click Play
    Ready --> Editing: Modify tracks

    Playing --> Ready: Click Stop
    Playing --> Recording: Click Record

    Recording --> Playing: Stop Record
    Recording --> Exporting: Export audio

    Editing --> Ready: Auto-save
    Editing --> PianoRoll: Open synth track

    PianoRoll --> Editing: Close piano roll

    Exporting --> Ready: Download complete

    Ready --> PatternSwitch: Change pattern
    PatternSwitch --> Ready: Pattern loaded

    Ready --> ThemeChange: Switch theme
    ThemeChange --> Ready: Theme applied

    Ready --> [*]: Close app
```

---

## Diagram 6: Feature Overview (Mind Map)

```mermaid
mindmap
  root((BeatForge Studio))
    Instruments
      Drums
        Kick
        Snare
        Hi-Hat
        Toms
        Cymbals
        Percussion
      Synthesizers
        Bass
        Lead
        Pad
        Pluck
        Keys
        Strings
        Brass
        Organ
        FX
    Audio
      Web Audio API
      Real-time Synthesis
      Effects
        Reverb
        Delay
      Recording
      WAV Export
    UI/UX
      16-Step Sequencer
      Piano Roll
      Visualizer
      6 Themes
      Responsive
      Keyboard Shortcuts
    State
      Auto-Save
      Patterns
      Import/Export
      LocalStorage
    PWA
      Offline
      Installable
      Service Worker
```

---

## Diagram 7: Technology Stack

```mermaid
graph LR
    subgraph Frontend["🖥️ Frontend"]
        JS["JavaScript ES6+"]
        CSS["TailwindCSS"]
        HTML5["HTML5"]
    end

    subgraph APIs["🔌 Web APIs"]
        WA["Web Audio API"]
        LS["LocalStorage API"]
        SW["Service Worker API"]
        CA["Canvas API"]
    end

    subgraph Features["⚡ Features"]
        SEQ["16-Step Sequencer"]
        PR["Piano Roll"]
        VIS["Audio Visualizer"]
        REC["Audio Recording"]
        EXP["WAV Export"]
    end

    JS --> WA
    JS --> LS
    JS --> SW
    JS --> CA

    WA --> SEQ
    WA --> REC
    WA --> EXP
    CA --> VIS
    JS --> PR
```

---

## Quick Export Instructions

### Using Mermaid Live Editor

1. Go to **<https://mermaid.live>**
2. Copy any diagram code above (between the triple backticks)
3. Paste in the editor
4. Click **"Actions"** → **"Download PNG"** or **"Download SVG"**

### Using VS Code

1. Install extension: **"Markdown Preview Mermaid Support"**
2. Open this file and use Markdown Preview
3. Right-click diagram to save as image

### Using Figma

1. Export diagrams as SVG from Mermaid Live
2. Import SVG into Figma
3. Customize colors and styling

---

## Recommended Image Sizes for PPT

| Diagram | Recommended Size | Use For |
|---------|------------------|---------|
| System Architecture | 1920x1080 | Full slide |
| Audio Signal Flow | 1600x600 | Half slide |
| User Interaction | 1200x900 | With text |
| Module Dependencies | 1400x1000 | Technical slide |
| State Management | 1200x800 | With explanation |
| Mind Map | 1600x1200 | Overview slide |
| Tech Stack | 1200x600 | Half slide |
