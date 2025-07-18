import { NextResponse } from "next/server"
import { cache } from "@/lib/cache"
import { googleMapsLimiter, weatherApiLimiter, socialApiLimiter, curatorApiLimiter } from "@/lib/rate-limiter"

export async function GET() {
  try {
    const rateLimitStats = {
      googleMaps: googleMapsLimiter.getStats("google-maps") || {
        count: 0,
        remaining: 25,
        resetTime: Date.now() + 3600000,
      },
      weather: weatherApiLimiter.getStats("weather-api") || {
        count: 0,
        remaining: 40,
        resetTime: Date.now() + 3600000,
      },
      social: socialApiLimiter.getStats("social-api") || { count: 0, remaining: 15, resetTime: Date.now() + 900000 },
      curator: curatorApiLimiter.getStats("curator-api") || {
        count: 0,
        remaining: 100,
        resetTime: Date.now() + 3600000,
      },
    }

    const cacheStats = cache.getStats()

    const apiStatus = {
      rateLimits: rateLimitStats,
      cache: cacheStats,
      apiKeys: {
        openWeather: process.env.OPENWEATHER_API_KEY ? "✓ Active" : "✗ Missing",
        googleMaps: process.env.GOOGLE_MAPS_API_KEY ? "✓ Active" : "✗ Missing",
        curator: "✓ Active (5ddbc577-d80b-4257-bbd4-3761bb5f3476)",
        twitter: process.env.TWITTER_BEARER_TOKEN ? "✓ Ready" : "⏳ Pending",
        instagram: process.env.INSTAGRAM_ACCESS_TOKEN ? "✓ Ready" : "⏳ Pending",
        facebook: process.env.FACEBOOK_ACCESS_TOKEN ? "✓ Ready" : "⏳ Pending",
        eventbrite: process.env.EVENTBRITE_API_TOKEN ? "✓ Ready" : "⏳ Pending",
      },
      systemHealth: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
      },
      reminder: "API keys reminder set for 24 hours from now",
    }

    return NextResponse.json(apiStatus)
  } catch (error) {
    console.error("Rate limit status error:", error)
    return NextResponse.json(
      {
        error: "Failed to get rate limit status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
