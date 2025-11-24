/**
 * WAV Converter Module
 * Handles conversion of AudioBuffer to WAV format
 */

/**
 * Convert AudioBuffer to WAV format
 * @param {AudioBuffer} buffer - The audio buffer to convert
 * @returns {ArrayBuffer} The WAV file data
 */
export function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const data = [];
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        data.push(buffer.getChannelData(i));
    }

    const interleaved = interleave(data);
    const dataLength = interleaved.length * bytesPerSample;
    const headerLength = 44;
    const totalLength = headerLength + dataLength;

    const arrayBuffer = new ArrayBuffer(totalLength);
    const view = new DataView(arrayBuffer);

    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, totalLength - 8, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Write audio data
    floatTo16BitPCM(view, 44, interleaved);

    return arrayBuffer;
}

/**
 * Interleave multiple channel data into a single array
 * @param {Float32Array[]} channelData - Array of channel data
 * @returns {Float32Array} Interleaved audio data
 */
function interleave(channelData) {
    const length = channelData[0].length;
    const result = new Float32Array(length * channelData.length);

    let offset = 0;
    for (let i = 0; i < length; i++) {
        for (let channel = 0; channel < channelData.length; channel++) {
            result[offset++] = channelData[channel][i];
        }
    }
    return result;
}

/**
 * Write a string to a DataView
 * @param {DataView} view - The DataView to write to
 * @param {number} offset - The offset to start writing at
 * @param {string} string - The string to write
 */
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

/**
 * Convert float audio data to 16-bit PCM
 * @param {DataView} view - The DataView to write to
 * @param {number} offset - The offset to start writing at
 * @param {Float32Array} input - The float audio data
 */
function floatTo16BitPCM(view, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

/**
 * Download a WAV file
 * @param {ArrayBuffer} wavData - The WAV file data
 * @param {string} filename - The filename to save as
 */
export function downloadWav(wavData, filename) {
    const blob = new Blob([wavData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

