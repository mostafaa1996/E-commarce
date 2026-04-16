const delay = require('./delay');

class RateLimiter {
  constructor({ minDelayMs = 1000 } = {}) {
    this.minDelayMs = minDelayMs;
    this.lastRunAt = 0;
  }

  async wait() {
    const now = Date.now();
    const elapsed = now - this.lastRunAt;
    if (elapsed < this.minDelayMs) {
      await delay(this.minDelayMs - elapsed);
    }
    this.lastRunAt = Date.now();
  }
}

module.exports = RateLimiter;
