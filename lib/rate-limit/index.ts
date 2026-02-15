interface RateLimitConfig {
  interval: number; // milliseconds
  maxRequests: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(private config: RateLimitConfig) {}

  async check(key: string): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now();
    const windowStart = now - this.config.interval;

    // Get existing requests for this key
    const timestamps = this.requests.get(key) || [];

    // Filter out requests outside the current window
    const validTimestamps = timestamps.filter(t => t > windowStart);

    // Check if limit is exceeded
    if (validTimestamps.length >= this.config.maxRequests) {
      return {
        success: false,
        remaining: 0,
      };
    }

    // Add current request
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);

    return {
      success: true,
      remaining: this.config.maxRequests - validTimestamps.length,
    };
  }

  reset(key: string): void {
    this.requests.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.interval;

    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(t => t > windowStart);
      
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }
}

// Pre-configured rate limiters
export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 60,
});

export const aiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 20,
});

// Cleanup old entries every 5 minutes
setInterval(() => {
  apiRateLimiter.cleanup();
  aiRateLimiter.cleanup();
}, 5 * 60 * 1000);
