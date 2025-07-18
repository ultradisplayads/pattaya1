interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyGenerator?: (identifier: string) => string
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  async checkLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier
    const now = Date.now()

    let entry = this.limits.get(key)

    // Reset if window has passed
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
      }
    }

    const allowed = entry.count < this.config.maxRequests

    if (allowed) {
      entry.count++
      this.limits.set(key, entry)
    }

    return {
      allowed,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    }
  }

  getStats(identifier: string): { count: number; remaining: number; resetTime: number } | null {
    const key = this.config.keyGenerator ? this.config.keyGenerator(identifier) : identifier
    const entry = this.limits.get(key)

    if (!entry) {
      return null
    }

    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    }
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        this.limits.delete(key)
      }
    }
  }
}

// Google Maps API Rate Limiter - Free tier limits
export const googleMapsLimiter = new RateLimiter({
  maxRequests: 25, // Conservative limit per hour
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (identifier) => `google-maps:${identifier}`,
})

// General API Rate Limiter - 750 calls per day
export const generalApiLimiter = new RateLimiter({
  maxRequests: 31, // ~750/24 hours
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (identifier) => `api:${identifier}`,
})

// Weather API Rate Limiter - OpenWeather free tier: 1000 calls/day
export const weatherApiLimiter = new RateLimiter({
  maxRequests: 40, // Conservative: ~960 calls/day
  windowMs: 60 * 60 * 1000, // 1 hour
})

// Social API Rate Limiter
export const socialApiLimiter = new RateLimiter({
  maxRequests: 15, // Conservative for social APIs
  windowMs: 15 * 60 * 1000, // 15 minutes
})

// Curator API Rate Limiter
export const curatorApiLimiter = new RateLimiter({
  maxRequests: 100, // Generous limit for Curator
  windowMs: 60 * 60 * 1000, // 1 hour
})

// ---- Generic limiters ----------------------------------------------------

// 1 000 requests / HOUR (fits most widget polling needs)
export const hourlyLimiter = new RateLimiter({
  maxRequests: 1_000,
  windowMs: 60 * 60 * 1_000, // 1 h
})

// 10 000 requests / DAY (fallback for bulk or cron jobs)
export const dailyLimiter = new RateLimiter({
  maxRequests: 10_000,
  windowMs: 24 * 60 * 60 * 1_000, // 24 h
})

// Cleanup function to run periodically
export function cleanupRateLimiters(): void {
  googleMapsLimiter.cleanup()
  generalApiLimiter.cleanup()
  weatherApiLimiter.cleanup()
  socialApiLimiter.cleanup()
  curatorApiLimiter.cleanup()
}

// Auto cleanup every 5 minutes
setInterval(cleanupRateLimiters, 5 * 60 * 1000)
