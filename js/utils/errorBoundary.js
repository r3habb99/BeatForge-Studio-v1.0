/**
 * Global Error Boundary
 * Catches and handles uncaught errors and promise rejections
 * Prevents app crashes and provides user-friendly error messages
 */

import { Logger } from "./logger.js";
import { toast } from "./toast.js";

/**
 * Initialize global error handlers
 * Call this early in app initialization
 */
export function initErrorBoundary() {
  // Handle uncaught JavaScript errors
  window.addEventListener("error", handleGlobalError);

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  // Handle resource loading errors (images, scripts, etc.)
  window.addEventListener(
    "error",
    (event) => {
      if (event.target !== window) {
        handleResourceError(event);
      }
    },
    true
  ); // Use capture phase

  Logger.info("Global error boundary initialized");
}

/**
 * Remove global error handlers
 * Call this during cleanup/shutdown
 */
export function removeErrorBoundary() {
  window.removeEventListener("error", handleGlobalError);
  window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  Logger.info("Global error boundary removed");
}

/**
 * Handle uncaught JavaScript errors
 * @param {ErrorEvent} event - Error event
 */
function handleGlobalError(event) {
  // Log the error with full context
  Logger.error(
    Logger.ERROR_CODES.UNCAUGHT_ERROR,
    event.message || "Uncaught error occurred",
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    },
    event.error
  );

  // Show user-friendly error message
  const userMessage = getUserFriendlyMessage(event.error);
  toast.error("Application Error", userMessage);

  // Prevent default browser error handling
  event.preventDefault();
}

/**
 * Handle unhandled promise rejections
 * @param {PromiseRejectionEvent} event - Promise rejection event
 */
function handleUnhandledRejection(event) {
  const reason = event.reason;

  // Log the rejection
  Logger.error(
    Logger.ERROR_CODES.UNHANDLED_PROMISE,
    reason?.message || "Unhandled promise rejection",
    {
      reason: reason,
      stack: reason?.stack,
    },
    reason
  );

  // Show user-friendly error message
  const userMessage = getUserFriendlyMessage(reason);
  toast.error("Operation Failed", userMessage);

  // Prevent default browser error handling
  event.preventDefault();
}

/**
 * Handle resource loading errors
 * @param {Event} event - Error event
 */
function handleResourceError(event) {
  const target = event.target;
  const resourceType = target.tagName?.toLowerCase() || "resource";
  const resourceSrc = target.src || target.href || "unknown";

  Logger.warn(
    Logger.WARNING_CODES.RESOURCE_LOAD_FAILED,
    `Failed to load ${resourceType}`,
    {
      type: resourceType,
      src: resourceSrc,
    }
  );

  // Don't show toast for resource errors (too noisy)
  // Just log them for debugging
}

/**
 * Convert technical error to user-friendly message
 * @param {Error} error - The error object
 * @returns {string} User-friendly message
 */
function getUserFriendlyMessage(error) {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  const errorMessage = error.message || String(error);

  // Map common errors to user-friendly messages
  const errorMappings = {
    // Audio errors
    NotAllowedError: "Microphone access was denied. Please allow access in your browser settings.",
    NotSupportedError: "Your browser doesn't support this feature. Please use Chrome, Firefox, Safari, or Edge.",
    NotFoundError: "Required audio device not found. Please check your audio settings.",
    
    // Network errors
    NetworkError: "Network connection lost. Please check your internet connection.",
    TypeError: "A technical error occurred. Please refresh the page.",
    
    // Storage errors
    QuotaExceededError: "Storage limit exceeded. Please clear some space or export your projects.",
    
    // Generic fallback
    default: "Something went wrong. Please try again or refresh the page.",
  };

  // Check error name
  if (error.name && errorMappings[error.name]) {
    return errorMappings[error.name];
  }

  // Check error message for keywords
  if (errorMessage.includes("quota")) {
    return errorMappings.QuotaExceededError;
  }
  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return errorMappings.NetworkError;
  }

  // Return generic message
  return errorMappings.default;
}

