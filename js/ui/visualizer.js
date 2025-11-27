/**
 * Visualizer Module
 * Handles audio frequency visualization with multiple modes
 */

import { getAnalyser } from "../audio/audioEngine.js";

// Visualizer modes
const MODES = {
  BARS: "bars",
  WAVEFORM: "waveform",
  CIRCULAR: "circular",
  MIRROR_BARS: "mirror",
};

const MODE_ICONS = {
  bars: "fa-chart-bar",
  waveform: "fa-wave-square",
  circular: "fa-circle-notch",
  mirror: "fa-align-center",
};

// Visualizer colors
const COLORS = {
  cyan: "34, 211, 238",
  blue: "59, 130, 246",
  indigo: "99, 102, 241",
  purple: "147, 51, 234",
};

// Visualizer dimensions and settings
const VISUALIZER_CONFIG = {
  barWidthMultiplier: 2.5,
  barGap: 1,
  minBarHeight: 1,
  circularBars: 64,
  circularPadding: 10,
  lineWidth: 2,
  circularLineWidth: 3,
  shadowBlur: 15,
  circularShadowBlur: 8,
};

let currentMode = MODES.BARS;
let animationId = null;

/**
 * Initialize visualizer mode switcher
 */
function initVisualizerMode() {
  const modeBtn = document.getElementById("visualizerModeBtn");
  if (!modeBtn) return;

  modeBtn.addEventListener("click", () => {
    // Cycle through modes
    const modes = Object.values(MODES);
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    currentMode = modes[nextIndex];

    // Update button icon
    const icon = modeBtn.querySelector("i");
    if (icon) {
      icon.className = `fas ${MODE_ICONS[currentMode]}`;
    }

    // Show toast notification
    if (window.toast) {
      const modeNames = {
        bars: "Frequency Bars",
        waveform: "Waveform",
        circular: "Circular Spectrum",
        mirror: "Mirror Bars",
      };
      window.toast.info("Visualizer Mode", modeNames[currentMode]);
    }
  });
}

/**
 * Draw audio visualizer
 */
function drawVisualizer() {
  const canvas = document.getElementById("visualizer");
  if (!canvas) {
    return;
  }

  const canvasCtx = canvas.getContext("2d");
  const analyser = getAnalyser();

  if (!analyser) {
    return;
  }

  const bufferLength = analyser.frequencyBinCount;
  const frequencyData = new Uint8Array(bufferLength);
  const waveformData = new Uint8Array(analyser.fftSize);

  function draw() {
    animationId = requestAnimationFrame(draw);

    if (!analyser) return;

    // Clear canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw based on current mode
    switch (currentMode) {
      case MODES.BARS:
        drawFrequencyBars(canvasCtx, analyser, frequencyData, canvas);
        break;
      case MODES.WAVEFORM:
        drawWaveform(canvasCtx, analyser, waveformData, canvas);
        break;
      case MODES.CIRCULAR:
        drawCircular(canvasCtx, analyser, frequencyData, canvas);
        break;
      case MODES.MIRROR_BARS:
        drawMirrorBars(canvasCtx, analyser, frequencyData, canvas);
        break;
    }
  }

  draw();
}

/**
 * Draw frequency bars (original mode)
 */
function drawFrequencyBars(ctx, analyser, dataArray, canvas) {
  analyser.getByteFrequencyData(dataArray);

  const barWidth =
    (canvas.width / dataArray.length) * VISUALIZER_CONFIG.barWidthMultiplier;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = Math.max(
      dataArray[i] / 2,
      VISUALIZER_CONFIG.minBarHeight
    );
    const intensity = barHeight / 128;

    // Create gradient for each bar
    const gradient = ctx.createLinearGradient(
      0,
      canvas.height - barHeight,
      0,
      canvas.height
    );

    gradient.addColorStop(0, `rgba(${COLORS.cyan}, 1)`);
    gradient.addColorStop(0.5, `rgba(${COLORS.blue}, 1)`);
    gradient.addColorStop(1, `rgba(${COLORS.indigo}, 1)`);

    // Add glow effect
    ctx.shadowBlur = VISUALIZER_CONFIG.shadowBlur;
    ctx.shadowColor = `rgba(${COLORS.blue}, ${0.6 + intensity * 0.4})`;

    ctx.fillStyle = gradient;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    ctx.shadowBlur = 0;

    x += barWidth + VISUALIZER_CONFIG.barGap;
  }
}

/**
 * Draw waveform
 */
function drawWaveform(ctx, analyser, dataArray, canvas) {
  analyser.getByteTimeDomainData(dataArray);

  ctx.lineWidth = VISUALIZER_CONFIG.lineWidth;
  ctx.strokeStyle = `rgba(${COLORS.blue}, 0.9)`;
  ctx.shadowBlur = VISUALIZER_CONFIG.shadowBlur;
  ctx.shadowColor = `rgba(${COLORS.blue}, 0.6)`;

  ctx.beginPath();

  const sliceWidth = (canvas.width * 1.0) / dataArray.length;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

/**
 * Draw circular spectrum
 */
function drawCircular(ctx, analyser, dataArray, canvas) {
  analyser.getByteFrequencyData(dataArray);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - VISUALIZER_CONFIG.circularPadding;
  const bars = VISUALIZER_CONFIG.circularBars;

  for (let i = 0; i < bars; i++) {
    const barHeight = dataArray[i] / 2;
    const angle = (i / bars) * Math.PI * 2;

    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    const x2 = centerX + Math.cos(angle) * (radius + barHeight);
    const y2 = centerY + Math.sin(angle) * (radius + barHeight);

    const intensity = barHeight / 128;
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(
      0,
      `rgba(${COLORS.purple}, ${0.8 + intensity * 0.2})`
    );
    gradient.addColorStop(1, `rgba(${COLORS.cyan}, ${0.8 + intensity * 0.2})`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = VISUALIZER_CONFIG.circularLineWidth;
    ctx.shadowBlur = VISUALIZER_CONFIG.circularShadowBlur;
    ctx.shadowColor = `rgba(${COLORS.blue}, ${intensity * 0.8})`;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
}

/**
 * Draw mirror bars
 */
function drawMirrorBars(ctx, analyser, dataArray, canvas) {
  analyser.getByteFrequencyData(dataArray);

  const barWidth =
    (canvas.width / dataArray.length) * VISUALIZER_CONFIG.barWidthMultiplier;
  let x = 0;
  const centerY = canvas.height / 2;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = Math.max(
      dataArray[i] / 2,
      VISUALIZER_CONFIG.minBarHeight
    );
    const intensity = barHeight / 128;

    // Create gradient for top half (from center going up)
    const topGradient = ctx.createLinearGradient(
      0,
      centerY,
      0,
      centerY - barHeight / 2
    );
    topGradient.addColorStop(0, `rgba(${COLORS.blue}, 1)`);
    topGradient.addColorStop(0.5, `rgba(${COLORS.cyan}, 1)`);
    topGradient.addColorStop(1, `rgba(${COLORS.indigo}, 1)`);

    // Create gradient for bottom half (from center going down)
    const bottomGradient = ctx.createLinearGradient(
      0,
      centerY,
      0,
      centerY + barHeight / 2
    );
    bottomGradient.addColorStop(0, `rgba(${COLORS.blue}, 1)`);
    bottomGradient.addColorStop(0.5, `rgba(${COLORS.cyan}, 1)`);
    bottomGradient.addColorStop(1, `rgba(${COLORS.indigo}, 1)`);

    // Add glow effect
    ctx.shadowBlur = VISUALIZER_CONFIG.shadowBlur;
    ctx.shadowColor = `rgba(${COLORS.blue}, ${0.6 + intensity * 0.4})`;

    // Draw top half with its gradient
    ctx.fillStyle = topGradient;
    ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight / 2);

    // Draw bottom half (mirrored) with its gradient
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(x, centerY, barWidth, barHeight / 2);

    ctx.shadowBlur = 0;

    x += barWidth + VISUALIZER_CONFIG.barGap;
  }
}

export { drawVisualizer, initVisualizerMode };
