/**
 * HTML Sanitization Utility
 * Prevents XSS attacks by sanitizing user input before rendering
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * Converts special characters to HTML entities
 * 
 * @param {string} str - The string to sanitize
 * @returns {string} Sanitized string safe for innerHTML
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') {
    return '';
  }
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Sanitize an object's string properties recursively
 * Useful for sanitizing entire state objects
 * 
 * @param {object} obj - Object to sanitize
 * @returns {object} Sanitized object
 */
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHTML(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize URL to prevent javascript: protocol attacks
 * 
 * @param {string} url - URL to validate
 * @returns {string|null} Sanitized URL or null if invalid
 */
export function sanitizeURL(url) {
  if (typeof url !== 'string') {
    return null;
  }
  
  // Remove whitespace
  url = url.trim();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return null;
    }
  }
  
  // Allow http, https, and relative URLs
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('./')) {
    return url;
  }
  
  return null;
}

/**
 * Sanitize CSS class names to prevent injection
 * 
 * @param {string} className - Class name to sanitize
 * @returns {string} Sanitized class name
 */
export function sanitizeClassName(className) {
  if (typeof className !== 'string') {
    return '';
  }
  
  // Only allow alphanumeric, hyphens, and underscores
  return className.replace(/[^a-zA-Z0-9-_\s]/g, '');
}

/**
 * Create safe HTML element with sanitized content
 * 
 * @param {string} tag - HTML tag name
 * @param {object} attributes - Element attributes
 * @param {string} content - Text content
 * @returns {HTMLElement} Safe HTML element
 */
export function createSafeElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  // Set attributes safely
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'class') {
      element.className = sanitizeClassName(value);
    } else if (key === 'href' || key === 'src') {
      const safeUrl = sanitizeURL(value);
      if (safeUrl) {
        element.setAttribute(key, safeUrl);
      }
    } else if (typeof value === 'string') {
      element.setAttribute(key, sanitizeHTML(value));
    } else {
      element.setAttribute(key, value);
    }
  }
  
  // Set text content (automatically escaped)
  if (content) {
    element.textContent = content;
  }
  
  return element;
}

