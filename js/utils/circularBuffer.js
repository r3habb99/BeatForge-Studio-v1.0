/**
 * Circular Buffer Data Structure
 * Provides fixed-size FIFO queue with O(1) push/pop operations
 * Useful for memory-constrained systems and long-running applications
 */

/**
 * CircularBuffer class for efficient queue operations
 * Prevents memory leaks from unbounded arrays
 */
export class CircularBuffer {
  /**
   * Initialize circular buffer
   * @param {number} maxSize - Maximum buffer size
   * @throws {Error} If maxSize is invalid
   */
  constructor(maxSize = 1000) {
    if (maxSize <= 0 || !Number.isInteger(maxSize)) {
      throw new Error("maxSize must be a positive integer");
    }

    this.buffer = new Array(maxSize);
    this.head = 0;
    this.tail = 0;
    this.size = maxSize;
    this.count = 0;
  }

  /**
   * Add item to buffer (enqueue)
   * @param {*} item - Item to add
   * @returns {number} Current count after push
   */
  push(item) {
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.size;

    if (this.count < this.size) {
      this.count++;
    } else {
      // Buffer is full, overwrite oldest item
      this.head = (this.head + 1) % this.size;
    }

    return this.count;
  }

  /**
   * Remove and return item from buffer (dequeue)
   * @returns {*} Item at head or null if empty
   */
  shift() {
    if (this.count === 0) return null;

    const item = this.buffer[this.head];
    this.buffer[this.head] = null; // Allow GC
    this.head = (this.head + 1) % this.size;
    this.count--;

    return item;
  }

  /**
   * Peek at item without removing it
   * @returns {*} Item at head or null if empty
   */
  peek() {
    if (this.count === 0) return null;
    return this.buffer[this.head];
  }

  /**
   * Check if buffer is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.count === 0;
  }

  /**
   * Check if buffer is full
   * @returns {boolean}
   */
  isFull() {
    return this.count === this.size;
  }

  /**
   * Get current size
   * @returns {number}
   */
  getSize() {
    return this.count;
  }

  /**
   * Get maximum capacity
   * @returns {number}
   */
  getCapacity() {
    return this.size;
  }

  /**
   * Clear all items
   */
  clear() {
    for (let i = 0; i < this.count; i++) {
      this.buffer[(this.head + i) % this.size] = null;
    }
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  /**
   * Convert to array (for debugging)
   * @returns {Array}
   */
  toArray() {
    const result = [];
    for (let i = 0; i < this.count; i++) {
      result.push(this.buffer[(this.head + i) % this.size]);
    }
    return result;
  }

  /**
   * Get item at index (for debugging)
   * @param {number} index - Index from head
   * @returns {*}
   */
  at(index) {
    if (index < 0 || index >= this.count) return null;
    return this.buffer[(this.head + index) % this.size];
  }

  /**
   * Get statistics about buffer usage
   * @returns {Object} Buffer statistics
   */
  getStats() {
    return {
      size: this.count,
      capacity: this.size,
      usage: ((this.count / this.size) * 100).toFixed(2) + "%",
      isFull: this.isFull(),
      isEmpty: this.isEmpty(),
    };
  }
}

export default CircularBuffer;
