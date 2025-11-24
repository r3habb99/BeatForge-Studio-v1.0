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

  const barWidth = (canvas.width / dataArray.length) * 2.5;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = dataArray[i] / 2;

    // Create gradient for each bar
    const gradient = ctx.createLinearGradient(
      0,
      canvas.height - barHeight,
      0,
      canvas.height
    );
    const intensity = barHeight / 128;

    gradient.addColorStop(0, `rgba(34, 211, 238, ${0.9 + intensity * 0.1})`);
    gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.9 + intensity * 0.1})`);
    gradient.addColorStop(1, `rgba(147, 51, 234, ${0.9 + intensity * 0.1})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    // Add glow effect on taller bars
    if (barHeight > 20) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(59, 130, 246, ${intensity * 0.8})`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      ctx.shadowBlur = 0;
    }

    x += barWidth + 1;
  }
}

/**
 * Draw waveform
 */
function drawWaveform(ctx, analyser, dataArray, canvas) {
  analyser.getByteTimeDomainData(dataArray);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(59, 130, 246, 0.9)";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "rgba(59, 130, 246, 0.6)";

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
  const radius = Math.min(centerX, centerY) - 10;
  const bars = 64;

  for (let i = 0; i < bars; i++) {
    const barHeight = dataArray[i] / 2;
    const angle = (i / bars) * Math.PI * 2;

    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    const x2 = centerX + Math.cos(angle) * (radius + barHeight);
    const y2 = centerY + Math.sin(angle) * (radius + barHeight);

    const intensity = barHeight / 128;
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, `rgba(147, 51, 234, ${0.8 + intensity * 0.2})`);
    gradient.addColorStop(1, `rgba(34, 211, 238, ${0.8 + intensity * 0.2})`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(59, 130, 246, ${intensity * 0.8})`;

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

  const barWidth = (canvas.width / dataArray.length) * 2.5;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = dataArray[i] / 2;
    const centerY = canvas.height / 2;

    // Create gradient for each bar
    const gradient = ctx.createLinearGradient(
      0,
      centerY - barHeight / 2,
      0,
      centerY + barHeight / 2
    );
    const intensity = barHeight / 128;

    gradient.addColorStop(0, `rgba(34, 211, 238, ${0.9 + intensity * 0.1})`);
    gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.9 + intensity * 0.1})`);
    gradient.addColorStop(1, `rgba(147, 51, 234, ${0.9 + intensity * 0.1})`);

    ctx.fillStyle = gradient;

    // Draw top half
    ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight / 2);
    // Draw bottom half (mirrored)
    ctx.fillRect(x, centerY, barWidth, barHeight / 2);

    // Add glow effect on taller bars
    if (barHeight > 20) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(59, 130, 246, ${intensity * 0.8})`;
      ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight / 2);
      ctx.fillRect(x, centerY, barWidth, barHeight / 2);
      ctx.shadowBlur = 0;
    }

    x += barWidth + 1;
  }
}

export { drawVisualizer, initVisualizerMode };
