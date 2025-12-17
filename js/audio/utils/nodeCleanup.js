/**
 * Audio Node Cleanup Utility
 * Prevents memory leaks by properly disconnecting audio nodes
 * PERFORMANCE FIX: Ensures all audio nodes are cleaned up after use
 */

import { Logger } from "../../utils/logger.js";

/**
 * Track active audio nodes for cleanup
 */
const activeNodes = new Set();

/**
 * Register an audio node for automatic cleanup
 * @param {AudioNode} node - The audio node to track
 * @param {number} duration - How long the node will be active (in seconds)
 */
export function registerNode(node, duration = 1) {
  if (!node) {
    return;
  }

  activeNodes.add(node);

  // Schedule cleanup after the node is done
  const cleanupTime = duration * 1000 + 100; // Add 100ms buffer
  setTimeout(() => {
    cleanupNode(node);
  }, cleanupTime);
}

/**
 * Clean up a single audio node
 * @param {AudioNode} node - The node to clean up
 */
export function cleanupNode(node) {
  if (!node) {
    return;
  }

  try {
    // Disconnect the node
    if (typeof node.disconnect === "function") {
      node.disconnect();
    }

    // Remove from active set
    activeNodes.delete(node);

    Logger.debug("Audio node cleaned up", {
      nodeType: node.constructor.name,
      activeCount: activeNodes.size,
    });
  } catch (error) {
    Logger.warn("Failed to cleanup audio node", {
      error: error.message,
      nodeType: node?.constructor?.name,
    });
  }
}

/**
 * Clean up all active audio nodes
 * Call this when stopping playback or resetting the app
 */
export function cleanupAllNodes() {
  Logger.info(`Cleaning up ${activeNodes.size} active audio nodes`);

  const nodesToClean = Array.from(activeNodes);
  nodesToClean.forEach((node) => cleanupNode(node));

  activeNodes.clear();
}

/**
 * Create an oscillator with automatic cleanup
 * @param {AudioContext} ctx - The audio context
 * @param {number} duration - How long the oscillator will play
 * @returns {OscillatorNode} The oscillator node
 */
export function createCleanOscillator(ctx, duration) {
  const osc = ctx.createOscillator();

  // Auto-cleanup when oscillator ends
  osc.onended = () => {
    cleanupNode(osc);
  };

  // Fallback cleanup in case onended doesn't fire
  registerNode(osc, duration);

  return osc;
}

/**
 * Create a gain node with automatic cleanup
 * @param {AudioContext} ctx - The audio context
 * @param {number} duration - How long the gain node will be active
 * @returns {GainNode} The gain node
 */
export function createCleanGain(ctx, duration) {
  const gain = ctx.createGain();
  registerNode(gain, duration);
  return gain;
}

/**
 * Create a filter with automatic cleanup
 * @param {AudioContext} ctx - The audio context
 * @param {number} duration - How long the filter will be active
 * @returns {BiquadFilterNode} The filter node
 */
export function createCleanFilter(ctx, duration) {
  const filter = ctx.createBiquadFilter();
  registerNode(filter, duration);
  return filter;
}

/**
 * Get statistics about active nodes
 * @returns {Object} Statistics object
 */
export function getNodeStats() {
  const stats = {
    activeCount: activeNodes.size,
    nodeTypes: {},
  };

  activeNodes.forEach((node) => {
    const type = node.constructor.name;
    stats.nodeTypes[type] = (stats.nodeTypes[type] || 0) + 1;
  });

  return stats;
}

/**
 * Log node statistics (for debugging)
 */
export function logNodeStats() {
  const stats = getNodeStats();
  Logger.info("Audio Node Statistics", stats);
  return stats;
}

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    cleanupAllNodes();
  });
}

