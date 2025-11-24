/**
 * BeatForge Studio - Service Worker
 * Provides offline capabilities and performance optimization
 */

const CACHE_NAME = "beatforge-studio-v1.0.0";
const RUNTIME_CACHE = "beatforge-runtime-v1.0.0";

// Files to cache on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/app.js",
  "/js/constants.js",
  "/js/audio/audioEngine.js",
  "/js/audio/audioContext.js",
  "/js/audio/effects.js",
  "/js/audio/recorder.js",
  "/js/audio/export.js",
  "/js/audio/routing.js",
  "/js/audio/helpers.js",
  "/js/audio/drums/drumSounds.js",
  "/js/audio/synths/synthSounds.js",
  "/js/audio/utils/impulse-response.js",
  "/js/audio/utils/distortion-curve.js",
  "/js/state/stateManager.js",
  "/js/scheduler/scheduler.js",
  "/js/ui/eventHandlers.js",
  "/js/ui/trackRenderer.js",
  "/js/ui/pianoRoll.js",
  "/js/ui/visualizer.js",
  "/js/ui/patternManager.js",
  "/js/ui/trackControls.js",
  "/js/ui/actionsMenu.js",
  "/js/ui/mobileMenu.js",
  "/js/ui/scrollSync.js",
  "/js/ui/controls/keyboardShortcuts.js",
  "/js/ui/controls/recordingControls.js",
  "/js/utils/toast.js",
  "/js/utils/tooltip.js",
  "/js/utils/theme.js",
  "/js/utils/trackColors.js",
  "/js/utils/shortcutsOverlay.js",
  "/js/utils/uiEnhancements.js",
  "/js/constants/themes.js",
  "/img/BeatForge Studio.png",
  "/manifest.json",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
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
