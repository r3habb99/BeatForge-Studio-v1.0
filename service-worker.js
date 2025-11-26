/**
 * BeatForge Studio - Service Worker
 * Provides offline capabilities and performance optimization
 */

const CACHE_NAME = "beatforge-studio-v1.0.2";
const RUNTIME_CACHE = "beatforge-runtime-v1.0.2";

// Files to cache on install
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/constants.js",

  // Config
  "./js/config/audioConfig.js",

  // Audio Engine
  "./js/audio/audioEngine.js",
  "./js/audio/audioContext.js",
  "./js/audio/effects.js",
  "./js/audio/recorder.js",
  "./js/audio/export.js",
  "./js/audio/routing.js",
  "./js/audio/helpers.js",

  // Drums
  "./js/audio/drums/drumSounds.js",
  "./js/audio/drums/sounds/index.js",
  "./js/audio/drums/sounds/kick.js",
  "./js/audio/drums/sounds/snare.js",
  "./js/audio/drums/sounds/hihat.js",
  "./js/audio/drums/sounds/clap.js",
  "./js/audio/drums/sounds/rimshot.js",
  "./js/audio/drums/sounds/cowbell.js",
  "./js/audio/drums/sounds/tom.js",
  "./js/audio/drums/sounds/crash.js",
  "./js/audio/drums/sounds/ride.js",
  "./js/audio/drums/sounds/shaker.js",
  "./js/audio/drums/sounds/tambourine.js",

  // Synths
  "./js/audio/synths/synthSounds.js",
  "./js/audio/synths/types/index.js",
  "./js/audio/synths/types/basic-synth.js",
  "./js/audio/synths/types/pad-synth.js",
  "./js/audio/synths/types/pluck-synth.js",
  "./js/audio/synths/types/organ.js",
  "./js/audio/synths/types/fm-synth.js",
  "./js/audio/synths/types/acid-bass.js",
  "./js/audio/synths/types/reese-bass.js",
  "./js/audio/synths/types/sub-bass.js",

  // Audio Utils
  "./js/audio/utils/impulse-response.js",
  "./js/audio/utils/distortion-curve.js",
  "./js/audio/utils/noise-generator.js",
  "./js/audio/utils/frequency-converter.js",
  "./js/audio/utils/time-helpers.js",

  // Export
  "./js/audio/export/offline-renderer.js",
  "./js/audio/export/offline-drum-renderer.js",
  "./js/audio/export/offline-synth-renderer.js",
  "./js/audio/export/offline-effects.js",
  "./js/audio/export/offline-routing.js",
  "./js/audio/export/wav-converter.js",

  // State & Scheduler
  "./js/state/stateManager.js",
  "./js/scheduler/scheduler.js",

  // UI
  "./js/ui/eventHandlers.js",
  "./js/ui/trackRenderer.js",
  "./js/ui/pianoRoll.js",
  "./js/ui/visualizer.js",
  "./js/ui/patternManager.js",
  "./js/ui/trackControls.js",
  "./js/ui/actionsMenu.js",
  "./js/ui/mobileMenu.js",
  "./js/ui/scrollSync.js",

  // UI Controls
  "./js/ui/controls/keyboardShortcuts.js",
  "./js/ui/controls/recordingControls.js",
  "./js/ui/controls/playbackControls.js",
  "./js/ui/controls/patternControls.js",
  "./js/ui/controls/effectsControls.js",

  // Utils
  "./js/utils/toast.js",
  "./js/utils/tooltip.js",
  "./js/utils/theme.js",
  "./js/utils/trackColors.js",
  "./js/utils/shortcutsOverlay.js",
  "./js/utils/uiEnhancements.js",
  "./js/utils/logger.js",
  "./js/utils/validators.js",
  "./js/utils/circularBuffer.js",
  "./js/utils/debounce.js",

  // Constants
  "./js/constants/themes.js",

  // Assets
  "./img/BeatForge Studio.png",
  "./manifest.json",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Cache files individually to handle missing files gracefully
        return Promise.allSettled(
          STATIC_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`Failed to cache ${url}:`, err.message);
              return null;
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version
        return cachedResponse;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the new response
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page or fallback
          return new Response("Offline - Please check your connection", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
    })
  );
});

// Message event - handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
