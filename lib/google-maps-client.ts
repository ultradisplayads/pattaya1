import { cache, createCacheKey, CACHE_TTL } from "./cache"
import { googleMapsLimiter } from "./rate-limiter"

interface GoogleMapsConfig {
  apiKey: string
  baseUrl: string
}

interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types: string[]
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  formatted_phone_number?: string
  website?: string
}

interface NearbySearchResult {
  results: PlaceDetails[]
  next_page_token?: string
  status: string
}

class GoogleMapsClient {
  private config: GoogleMapsConfig

  constructor() {
    this.config = {
      apiKey: "AIzaSyBjCsLBDf_hzKBab7dhyJAadII2PrNbFxw",
      baseUrl: "https://maps.googleapis.com/maps/api",
    }

    if (!this.config.apiKey) {
      console.warn("Google Maps API key not configured")
    }
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    // Check rate limit
    const rateLimitResult = await googleMapsLimiter.checkLimit("default")
    if (!rateLimitResult.allowed) {
      throw new Error(
        `Rate limit exceeded. Try again after ${new Date(rateLimitResult.resetTime).toLocaleTimeString()}`,
      )
    }

    const url = new URL(`${this.config.baseUrl}${endpoint}`)
    url.searchParams.set("key", this.config.apiKey)

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async nearbySearch(
    location: { lat: number; lng: number },
    radius = 1000,
    type?: string,
    keyword?: string,
  ): Promise<NearbySearchResult> {
    const cacheKey = createCacheKey(
      "maps-nearby",
      `${location.lat},${location.lng}`,
      radius.toString(),
      type || "all",
      keyword || "",
    )

    // Check cache first
    const cached = cache.get<NearbySearchResult>(cacheKey)
    if (cached) {
      return cached
    }

    const params: Record<string, string> = {
      location: `${location.lat},${location.lng}`,
      radius: radius.toString(),
    }

    if (type) params.type = type
    if (keyword) params.keyword = keyword

    try {
      const result = await this.makeRequest<NearbySearchResult>("/place/nearbysearch/json", params)

      // Cache successful results
      if (result.status === "OK") {
        cache.set(cacheKey, result, CACHE_TTL.MAPS)
      }

      return result
    } catch (error) {
      console.error("Google Maps nearby search error:", error)

      // Return fallback data
      return {
        results: [],
        status: "ERROR",
      }
    }
  }

  async placeDetails(placeId: string, fields?: string[]): Promise<{ result: PlaceDetails; status: string }> {
    const cacheKey = createCacheKey("maps-details", placeId, fields?.join(",") || "basic")

    // Check cache first
    const cached = cache.get<{ result: PlaceDetails; status: string }>(cacheKey)
    if (cached) {
      return cached
    }

    const params: Record<string, string> = {
      place_id: placeId,
    }

    if (fields && fields.length > 0) {
      params.fields = fields.join(",")
    }

    try {
      const result = await this.makeRequest<{ result: PlaceDetails; status: string }>("/place/details/json", params)

      // Cache successful results
      if (result.status === "OK") {
        cache.set(cacheKey, result, CACHE_TTL.MAPS)
      }

      return result
    } catch (error) {
      console.error("Google Maps place details error:", error)

      // Return fallback data
      return {
        result: {} as PlaceDetails,
        status: "ERROR",
      }
    }
  }

  async textSearch(
    query: string,
    location?: { lat: number; lng: number },
    radius?: number,
  ): Promise<NearbySearchResult> {
    const cacheKey = createCacheKey(
      "maps-text-search",
      query,
      location ? `${location.lat},${location.lng}` : "global",
      radius?.toString() || "0",
    )

    // Check cache first
    const cached = cache.get<NearbySearchResult>(cacheKey)
    if (cached) {
      return cached
    }

    const params: Record<string, string> = {
      query,
    }

    if (location) {
      params.location = `${location.lat},${location.lng}`
    }
    if (radius) {
      params.radius = radius.toString()
    }

    try {
      const result = await this.makeRequest<NearbySearchResult>("/place/textsearch/json", params)

      // Cache successful results
      if (result.status === "OK") {
        cache.set(cacheKey, result, CACHE_TTL.MAPS)
      }

      return result
    } catch (error) {
      console.error("Google Maps text search error:", error)

      // Return fallback data
      return {
        results: [],
        status: "ERROR",
      }
    }
  }

  getPhotoUrl(photoReference: string, maxWidth = 400): string {
    if (!this.config.apiKey || !photoReference) {
      return "/placeholder.svg?height=400&width=400&text=No+Image"
    }

    return `${this.config.baseUrl}/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${this.config.apiKey}`
  }

  // Get rate limit status
  getRateLimitStatus() {
    return googleMapsLimiter.getStats("default")
  }
}

export const googleMapsClient = new GoogleMapsClient()
export type { PlaceDetails, NearbySearchResult }
