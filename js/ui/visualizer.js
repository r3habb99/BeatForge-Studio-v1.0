/**
 * Visualizer Module
 * Handles audio frequency visualization
 */

import { getAnalyser } from '../audio/audioEngine.js';

/**
 * Draw audio visualizer
 */
function drawVisualizer() {
    const canvas = document.getElementById("visualizer");
    if (!canvas) {
        console.warn('Visualizer canvas not found');
        return;
    }

    const canvasCtx = canvas.getContext("2d");
    const analyser = getAnalyser();

    if (!analyser) {
        console.warn('Analyser not initialized yet');
        return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);

        if (!analyser) return;

        analyser.getByteFrequencyData(dataArray);

        // Clear with transparent background (CSS gradient shows through)
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            // Create gradient for each bar (cyan to blue to purple)
            const gradient = canvasCtx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
            const intensity = barHeight / 128; // 0 to 1

            // Vibrant light colors based on intensity
            gradient.addColorStop(0, `rgba(34, 211, 238, ${0.9 + intensity * 0.1})`); // Cyan top
            gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.9 + intensity * 0.1})`); // Blue middle
            gradient.addColorStop(1, `rgba(147, 51, 234, ${0.9 + intensity * 0.1})`); // Purple bottom

            canvasCtx.fillStyle = gradient;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            // Add glow effect on taller bars
            if (barHeight > 20) {
                canvasCtx.shadowBlur = 10;
                canvasCtx.shadowColor = `rgba(59, 130, 246, ${intensity * 0.8})`;
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                canvasCtx.shadowBlur = 0;
            }

            x += barWidth + 1;
        }
    }

    console.log('Visualizer initialized successfully');
    draw();
}

export {
    drawVisualizer
};

