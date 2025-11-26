/**
 * Debounce Utility Module
 * Provides debouncing and throttling functions for event handlers
 * Prevents excessive function calls during rapid events (input, scroll, resize)
 */

/**
 * Debounce function - delays execution until events stop firing
 * Useful for input fields, window resize, and other rapid-fire events
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {Object} options - Debounce options
 * @param {boolean} options.leading - Execute on leading edge
 * @param {boolean} options.trailing - Execute on trailing edge (default: true)
 * @param {number} options.maxWait - Maximum wait time before forced execution
 * @returns {Function} Debounced function
 *
 * @example
 * // Debounce volume slider input
 * const updateVolume = debounce(function(value) {
 *   audioCtx.setVolume(value);
 * }, 100);
 *
 * slider.addEventListener('input', (e) => updateVolume(e.target.value));
 */
export function debounce(func, wait, options = {}) {
  let timeout = null;
  let maxTimeout = null;
  let previous = 0;
  let result;

  const { leading = false, trailing = true, maxWait = null } = options;

  function invokeFunc(time) {
    result = func.apply(this, arguments);
    previous = time;
    timeout = null;
  }

  return function debounced(...args) {
    const time = Date.now();

    // Call on leading edge
    if (!previous && leading) {
      invokeFunc(time);
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    // Handle maxWait - force execution if max wait exceeded
    if (maxWait && time - previous >= maxWait) {
      if (maxTimeout) {
        clearTimeout(maxTimeout);
      }
      invokeFunc(time);
    } else {
      timeout = setTimeout(() => {
        if (trailing) {
          invokeFunc(Date.now());
        } else {
          previous = 0;
          timeout = null;
        }
      }, wait);
    }

    return result;
  };
}

/**
 * Throttle function - limits execution to once per time interval
 * Useful for scroll and resize events that fire frequently
 *
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds between calls
 * @param {Object} options - Throttle options
 * @param {boolean} options.leading - Execute on leading edge (default: true)
 * @param {boolean} options.trailing - Execute on trailing edge (default: true)
 * @returns {Function} Throttled function
 *
 * @example
 * // Throttle scroll handler
 * const onScroll = throttle(function() {
 *   updateUI();
 * }, 100);
 *
 * window.addEventListener('scroll', onScroll);
 */
export function throttle(func, wait, options = {}) {
  const { leading = true, trailing = true } = options;
  let timeout = null;
  let previous = leading ? 0 : Date.now();

  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      // Threshold met
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout && trailing) {
      // Schedule trailing edge
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Request animation frame debounce
 * Useful for animations and smooth visual updates
 *
 * @param {Function} func - Function to debounce
 * @returns {Function} Debounced function
 *
 * @example
 * const onWindowResize = rafDebounce(() => {
 *   updateLayout();
 * });
 *
 * window.addEventListener('resize', onWindowResize);
 */
export function rafDebounce(func) {
  let requestId = null;

  return function (...args) {
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
    }
    requestId = requestAnimationFrame(() => {
      func.apply(this, args);
      requestId = null;
    });
  };
}

/**
 * Create a debounce wrapper for event listeners
 * Automatically manages debounce state
 *
 * @param {Function} handler - Event handler function
 * @param {number} wait - Debounce wait time
 * @returns {Object} Object with handler and cleanup methods
 *
 * @example
 * const slider = document.querySelector('#volume');
 * const handler = createDebouncedHandler((e) => {
 *   updateVolume(e.target.value);
 * }, 100);
 *
 * slider.addEventListener('input', handler.fn);
 *
 * // Cleanup when done:
 * // handler.cancel();
 */
export function createDebouncedHandler(handler, wait = 300) {
  let timeout = null;

  return {
    fn: function (...args) {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        handler.apply(this, args);
        timeout = null;
      }, wait);
    },
    cancel: function () {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
    },
    flush: function (...args) {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      handler.apply(this, args);
      timeout = null;
    },
  };
}

/**
 * Once function - execute only on first call
 * Useful for initialization events
 *
 * @param {Function} func - Function to execute once
 * @returns {Function} Wrapped function
 *
 * @example
 * const initialize = once(() => {
 *   setupAudio();
 * });
 *
 * button.addEventListener('click', initialize);
 */
export function once(func) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = func.apply(this, args);
    }
    return result;
  };
}

/**
 * Delayed function - execute after specified delay
 *
 * @param {Function} func - Function to execute
 * @param {number} delay - Delay in milliseconds
 * @param {Object} args - Arguments to pass to function
 * @returns {number} Timeout ID (can be cleared with clearTimeout)
 *
 * @example
 * delayed(() => console.log('Delayed!'), 1000);
 */
export function delayed(func, delay, ...args) {
  return setTimeout(() => {
    func(...args);
  }, delay);
}

export default {
  debounce,
  throttle,
  rafDebounce,
  createDebouncedHandler,
  once,
  delayed,
};
