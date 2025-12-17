/**
 * Landing Page Content Configuration
 * Centralized content data for the landing page
 */

import {
  FEATURE_ICONS,
  ICON_COLORS,
  EFFECT_ICONS,
  STATS,
  APP_INFO,
  URLS,
} from "../constants/landing.js";

// Hero Section
export const heroContent = {
  badge: {
    icon: "fa-bolt",
    text: "Web-Based DAW",
  },
  title: {
    main: "Create Professional",
    gradient: "Music",
    suffix: "in Your Browser",
  },
  subtitle: `${APP_INFO.NAME} is a powerful digital audio workstation featuring a ${STATS.SEQUENCER_STEPS}-step sequencer, ${STATS.DRUM_SOUNDS} drum sounds, ${STATS.SYNTHESIZERS} synthesizers, and studio-grade effects. No downloads required.`,
  cta: {
    primary: {
      icon: "fa-play",
      text: "Launch Studio",
      href: URLS.DAW,
    },
    secondary: {
      text: "Explore Features",
      icon: "fa-arrow-down",
      href: "#features",
    },
  },
  stats: [
    { number: STATS.DRUM_SOUNDS, label: "Drum Sounds" },
    { number: STATS.SYNTHESIZERS, label: "Synthesizers" },
    { number: STATS.SEQUENCER_STEPS, label: "Step Sequencer" },
  ],
};

// Features Section
export const featuresContent = {
  header: {
    title: "Powerful Features",
    subtitle: "Everything you need to create professional music",
  },
  features: [
    {
      icon: FEATURE_ICONS.SEQUENCER,
      iconColor: ICON_COLORS.BLUE,
      title: "16-Step Sequencer",
      description:
        "Intuitive grid-based sequencer for creating complex patterns with ease. Perfect for drums and melodic sequences.",
    },
    {
      icon: FEATURE_ICONS.PIANO_ROLL,
      iconColor: ICON_COLORS.PURPLE,
      title: "Piano Roll Editor",
      description:
        "Full-featured piano roll for precise note editing. Create melodies, chords, and intricate musical phrases.",
    },
    {
      icon: FEATURE_ICONS.AUTO_SAVE,
      iconColor: ICON_COLORS.GREEN,
      title: "Auto-Save",
      description:
        "Your work is automatically saved to local storage. Never lose your creative progress again.",
    },
    {
      icon: FEATURE_ICONS.EXPORT,
      iconColor: ICON_COLORS.ORANGE,
      title: "Export Audio",
      description:
        "Record and export your creations as high-quality audio files. Share your music with the world.",
    },
    {
      icon: FEATURE_ICONS.THEMES,
      iconColor: ICON_COLORS.PINK,
      title: "Multiple Themes",
      description:
        "Personalize your workspace with beautiful themes including Cyberpunk, Neon, Ocean, and Sunset.",
    },
    {
      icon: FEATURE_ICONS.RESPONSIVE,
      iconColor: ICON_COLORS.CYAN,
      title: "Responsive Design",
      description:
        "Create music anywhere on any device. Fully optimized for desktop, tablet, and mobile.",
    },
  ],
};

// Drum Sounds
export const drumSounds = [
  { name: "Kick Drum", color: "#ef4444" },
  { name: "Snare Drum", color: "#f97316" },
  { name: "Hi-Hat Closed", color: "#eab308" },
  { name: "Hi-Hat Open", color: "#22c55e" },
  { name: "Clap", color: "#06b6d4" },
  { name: "Tom High", color: "#3b82f6" },
  { name: "Tom Mid", color: "#8b5cf6" },
  { name: "Tom Low", color: "#ec4899" },
  { name: "Crash", color: "#f43f5e" },
  { name: "Ride", color: "#14b8a6" },
  { name: "Rim Shot", color: "#a855f7" },
  { name: "Cowbell", color: "#f59e0b" },
  { name: "Shaker", color: "#84cc16" },
];

// Synthesizers
export const synthesizers = [
  { name: "Sine Wave", color: "#3b82f6" },
  { name: "Square Wave", color: "#8b5cf6" },
  { name: "Sawtooth Wave", color: "#ec4899" },
  { name: "Triangle Wave", color: "#f59e0b" },
  { name: "FM Synth", color: "#10b981" },
  { name: "AM Synth", color: "#06b6d4" },
  { name: "Pluck Synth", color: "#f43f5e" },
  { name: "Membrane Synth", color: "#84cc16" },
  { name: "Metal Synth", color: "#a855f7" },
];

// Sounds Section
export const soundsContent = {
  header: {
    title: "Professional Sound Library",
    subtitle: "High-quality drums and synthesizers at your fingertips",
  },
  categories: [
    {
      icon: "fa-drum",
      title: "Drum Sounds",
      sounds: drumSounds,
    },
    {
      icon: "fa-wave-square",
      title: "Synthesizers",
      sounds: synthesizers,
    },
  ],
};

// Effects Section
export const effectsContent = {
  header: {
    title: "Studio-Grade Effects",
    subtitle: "Professional audio processing tools",
  },
  effects: [
    {
      icon: EFFECT_ICONS.REVERB,
      title: "Reverb Room",
      description:
        "Add depth and space to your sounds with customizable room reverb. Control decay time and wet/dry mix.",
    },
    {
      icon: EFFECT_ICONS.DELAY,
      title: "Delay Echo",
      description:
        "Create rhythmic echoes and ambient textures. Adjust delay time and feedback for creative effects.",
    },
    {
      icon: EFFECT_ICONS.DISTORTION,
      title: "Distortion Drive",
      description:
        "Add warmth and grit to your sounds. Perfect for drums, bass, and aggressive synth lines.",
    },
    {
      icon: EFFECT_ICONS.FILTER,
      title: "Filter Sweep",
      description:
        "Shape your sound with high-pass and low-pass filters. Create dynamic sweeps and movement.",
    },
    {
      icon: EFFECT_ICONS.COMPRESSOR,
      title: "Compressor",
      description:
        "Control dynamics and add punch to your mix. Essential for professional-sounding productions.",
    },
    {
      icon: EFFECT_ICONS.CHORUS,
      title: "Chorus",
      description:
        "Thicken and widen your sounds with lush chorus effects. Add depth to synths and pads.",
    },
    {
      icon: EFFECT_ICONS.PHASER,
      title: "Phaser",
      description:
        "Create sweeping, psychedelic effects. Perfect for adding movement and character to any sound.",
    },
    {
      icon: EFFECT_ICONS.BITCRUSHER,
      title: "Bitcrusher",
      description:
        "Add lo-fi, retro character to your sounds. Reduce bit depth for vintage digital effects.",
    },
  ],
};

// Footer Content
export const footerContent = {
  brand: {
    name: APP_INFO.NAME,
    tagline: APP_INFO.TAGLINE,
    description:
      "Create professional music directly in your browser. No downloads, no installations, just pure creativity.",
  },
  links: {
    product: [
      { text: "Features", href: "#features" },
      { text: "Sound Library", href: "#sounds" },
      { text: "Effects", href: "#effects" },
      { text: "Launch Studio", href: URLS.DAW },
    ],
    resources: [
      { text: "Documentation", href: "#" },
      { text: "Tutorials", href: "#" },
      { text: "Community", href: "#" },
      { text: "Support", href: "#" },
    ],
    company: [
      { text: "About", href: "#" },
      { text: "GitHub", href: URLS.GITHUB },
      { text: "Report Issue", href: URLS.ISSUES },
      { text: "Privacy", href: "#" },
    ],
  },
  social: [
    { icon: "fa-github", href: URLS.GITHUB, label: "GitHub" },
    { icon: "fa-twitter", href: "#", label: "Twitter" },
    { icon: "fa-discord", href: "#", label: "Discord" },
    { icon: "fa-youtube", href: "#", label: "YouTube" },
  ],
  copyright: `© ${new Date().getFullYear()} ${APP_INFO.NAME}. All rights reserved.`,
};
