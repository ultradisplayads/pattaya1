interface RateLimitEntry {
  count: number
  resetTime: number
  cooldownUntil?: number
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>()

  isRateLimited(key: string, maxRequests: number, windowMs: number, cooldownMs?: number): boolean {
    const now = Date.now()
    const entry = this.limits.get(key)

    // Check if in cooldown period
    if (entry?.cooldownUntil && now < entry.cooldownUntil) {
      return true
    }

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
        cooldownUntil: entry?.cooldownUntil && now < entry.cooldownUntil ? entry.cooldownUntil : undefined,
      })
      return false
    }

    if (entry.count >= maxRequests) {
      // Apply cooldown if specified
      if (cooldownMs) {
        entry.cooldownUntil = now + cooldownMs
      }
      return true
    }

    entry.count++
    return false
  }

  getRemainingRequests(key: string, maxRequests: number): number {
    const entry = this.limits.get(key)
    if (!entry) return maxRequests
    return Math.max(0, maxRequests - entry.count)
  }

  getResetTime(key: string): number | null {
    const entry = this.limits.get(key)
    return entry?.resetTime || null
  }

  getCooldownTime(key: string): number | null {
    const entry = this.limits.get(key)
    if (entry?.cooldownUntil && Date.now() < entry.cooldownUntil) {
      return entry.cooldownUntil
    }
    return null
  }

  reset(key: string): void {
    this.limits.delete(key)
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime && (!entry.cooldownUntil || now > entry.cooldownUntil)) {
        this.limits.delete(key)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

// Auto cleanup every minute
if (typeof window === "undefined") {
  setInterval(() => {
    rateLimiter.cleanup()
  }, 60 * 1000)
}

export default rateLimiter
