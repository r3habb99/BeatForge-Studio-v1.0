/**
 * Storage Quota Management
 * Monitors and manages localStorage usage to prevent quota exceeded errors
 * PRODUCTION FIX: Prevents silent failures when storage is full
 */

import { Logger } from "./logger.js";
import { toast } from "./toast.js";

/**
 * Check storage quota and usage
 * @returns {Promise<Object>} Storage information
 */
export async function checkStorageQuota() {
  try {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;

      return {
        usage,
        quota,
        percentUsed,
        available: quota - usage,
        usageMB: (usage / (1024 * 1024)).toFixed(2),
        quotaMB: (quota / (1024 * 1024)).toFixed(2),
      };
    }

    // Fallback for browsers without Storage API
    return estimateLocalStorageSize();
  } catch (error) {
    Logger.error(
      Logger.ERROR_CODES.STORAGE_ERROR,
      "Failed to check storage quota",
      {},
      error
    );
    return null;
  }
}

/**
 * Estimate localStorage size (fallback method)
 * @returns {Object} Estimated storage information
 */
function estimateLocalStorageSize() {
  let totalSize = 0;

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalSize += localStorage[key].length + key.length;
    }
  }

  // Assume 5MB quota (common limit)
  const assumedQuota = 5 * 1024 * 1024;
  const percentUsed = (totalSize / assumedQuota) * 100;

  return {
    usage: totalSize,
    quota: assumedQuota,
    percentUsed,
    available: assumedQuota - totalSize,
    usageMB: (totalSize / (1024 * 1024)).toFixed(2),
    quotaMB: (assumedQuota / (1024 * 1024)).toFixed(2),
    estimated: true,
  };
}

/**
 * Warn user if storage is nearly full
 * @param {number} threshold - Percentage threshold (default 80%)
 */
export async function warnIfStorageFull(threshold = 80) {
  const info = await checkStorageQuota();

  if (!info) {
    return;
  }

  if (info.percentUsed >= threshold) {
    const message = `Storage is ${info.percentUsed.toFixed(1)}% full (${info.usageMB}MB / ${info.quotaMB}MB)`;

    Logger.warn(Logger.WARNING_CODES.STORAGE_WARNING, message, info);

    if (info.percentUsed >= 90) {
      toast.error(
        "Storage Almost Full",
        "Please export and clear old patterns to free up space."
      );
    } else {
      toast.warning(
        "Storage Warning",
        "Consider exporting your projects to free up space."
      );
    }
  }
}

/**
 * Get size of a specific localStorage item
 * @param {string} key - The localStorage key
 * @returns {number} Size in bytes
 */
export function getItemSize(key) {
  const item = localStorage.getItem(key);
  if (!item) {
    return 0;
  }
  return item.length + key.length;
}

/**
 * Get all localStorage items sorted by size
 * @returns {Array} Array of {key, size, sizeMB} objects
 */
export function getStorageBreakdown() {
  const items = [];

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const size = getItemSize(key);
      items.push({
        key,
        size,
        sizeMB: (size / (1024 * 1024)).toFixed(3),
      });
    }
  }

  return items.sort((a, b) => b.size - a.size);
}

/**
 * Clear old or large items to free up space
 * @param {number} targetMB - Target space to free in MB
 * @returns {number} Actual space freed in bytes
 */
export function freeUpSpace(targetMB = 1) {
  const targetBytes = targetMB * 1024 * 1024;
  let freedBytes = 0;

  const items = getStorageBreakdown();

  // Remove items until we've freed enough space
  for (const item of items) {
    if (freedBytes >= targetBytes) {
      break;
    }

    // Don't remove the main state
    if (item.key === "beatforge_state") {
      continue;
    }

    localStorage.removeItem(item.key);
    freedBytes += item.size;

    Logger.info(`Removed localStorage item: ${item.key} (${item.sizeMB}MB)`);
  }

  return freedBytes;
}

/**
 * Log storage statistics
 */
export async function logStorageStats() {
  const info = await checkStorageQuota();
  const breakdown = getStorageBreakdown();

  Logger.info("Storage Statistics", {
    ...info,
    itemCount: breakdown.length,
    largestItems: breakdown.slice(0, 5),
  });

  return { info, breakdown };
}

