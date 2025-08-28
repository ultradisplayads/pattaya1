interface RateLimitEntry {
  count: number
  resetTime: number
  cooldownUntil?: number
}

class KeyedRateLimiter {
  private entries = new Map<string, { count: number; resetTime: number }>()
  constructor(private maxRequests: number, private windowMs: number) {}

  private getEntry(key: string) {
    const now = Date.now()
    const existing = this.entries.get(key)
    if (!existing || now > existing.resetTime) {
      const fresh = { count: 0, resetTime: now + this.windowMs }
      this.entries.set(key, fresh)
      return fresh
    }
    return existing
  }

  canMakeCall(key = "global"): boolean {
    const entry = this.getEntry(key)
    return entry.count < this.maxRequests
  }

  recordCall(key = "global"): void {
    const entry = this.getEntry(key)
    entry.count = Math.min(this.maxRequests, entry.count + 1)
  }

  getRemainingCalls(key = "global"): number {
    const entry = this.getEntry(key)
    return Math.max(0, this.maxRequests - entry.count)
  }

  getStats(key = "global") {
    const entry = this.getEntry(key)
    return {
      count: entry.count,
      remaining: Math.max(0, this.maxRequests - entry.count),
      resetTime: entry.resetTime,
    }
  }

  async checkLimit(key = "global") {
    return {
      allowed: this.canMakeCall(key),
      remaining: this.getRemainingCalls(key),
      resetTime: this.getStats(key).resetTime,
    }
  }
}

// Named limiter instances expected by API routes
export const dailyLimiter = new KeyedRateLimiter(1000, 24 * 60 * 60 * 1000)
export const hourlyLimiter = new KeyedRateLimiter(250, 60 * 60 * 1000)

export const googleMapsLimiter = new KeyedRateLimiter(25, 60 * 60 * 1000)
export const weatherApiLimiter = new KeyedRateLimiter(40, 60 * 60 * 1000)
export const socialApiLimiter = new KeyedRateLimiter(15, 15 * 60 * 1000)
export const curatorApiLimiter = new KeyedRateLimiter(100, 60 * 60 * 1000)

// Preserve the old default export shape for any legacy imports
export const rateLimiter = {
  // simple global one-hour limiter with a generous cap
  _impl: new KeyedRateLimiter(1000, 60 * 60 * 1000),
  isRateLimited(key: string, maxRequests: number, windowMs: number) {
    // create a temporary limiter for this check (legacy API)
    const temp = new KeyedRateLimiter(maxRequests, windowMs)
    return !temp.canMakeCall(key)
  },
  getRemainingRequests(key: string, maxRequests: number) {
    // Not tracking per arbitrary limits here; return provided cap as remaining when unused
    return maxRequests
  },
  getResetTime(key: string) {
    return this._impl.getStats(key).resetTime
  },
  getCooldownTime() {
    return null
  },
  reset(key: string) {
    // no-op for legacy API
  },
  cleanup() {
    // no-op; instances are lightweight
  },
}

// Auto cleanup every minute
if (typeof window === "undefined") {
  setInterval(() => {
    rateLimiter.cleanup()
  }, 60 * 1000)
}

export default rateLimiter
