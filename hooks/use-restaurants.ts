import { useState, useEffect } from "react"
import { strapiAPI } from "@/lib/strapi-api"

export interface StrapiRestaurant {
  id: number
  documentId: string
  name: string
  cuisine: string
  rating: number
  priceRange: "budget" | "moderate" | "expensive" | "luxury"
  image?: {
    data?: {
      attributes: {
        url: string
        alternativeText?: string
      }
    }
  }
  location: string
  latitude: number
  longitude: number
  description: string
  features: string[]
  discounts: any[]
  maxDailyBookings: number
  currentDailyBookings: number
  isAllYouCanEat: boolean
  topDiscount: number
  relevanceScore: number
  contact?: string
  openHours?: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<StrapiRestaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await strapiAPI.getRestaurants()
        setRestaurants(data)
        
        console.log("[useRestaurants] Fetched restaurants:", data.length)
      } catch (err) {
        console.error("[useRestaurants] Error fetching restaurants:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch restaurants")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  return { restaurants, loading, error }
}
