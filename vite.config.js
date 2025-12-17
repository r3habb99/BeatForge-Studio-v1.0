import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
      output: {
        manualChunks: {
          audio: [
            "./js/audio/audioEngine.js",
            "./js/audio/audioContext.js",
            "./js/audio/effects.js",
            "./js/audio/recorder.js",
          ],
          ui: [
            "./js/ui/trackRenderer.js",
            "./js/ui/pianoRoll.js",
            "./js/ui/visualizer.js",
            "./js/ui/eventHandlers.js",
          ],
          state: ["./js/state/stateManager.js", "./js/scheduler/scheduler.js"],
          utils: [
            "./js/utils/logger.js",
            "./js/utils/validators.js",
            "./js/utils/sanitize.js",
            "./js/utils/debounce.js",
          ],
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  preview: {
    port: 8080,
    open: true,
  },
  optimizeDeps: {
    include: [],
  },
});

