import { useState } from "react"
import { strapiAPI } from "@/lib/strapi-api"
import { useStrapiAPI } from "./use-strapi-api"

export interface BookingData {
  restaurant: number
  customer_name: string
  customer_email: string
  customer_phone: string
  booking_date_time?: string
  quantity?: number
  notes?: string
}

export function useBookings() {
  const { makeAuthenticatedRequest } = useStrapiAPI()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (bookingData: BookingData) => {
    setLoading(true)
    setError(null)

    try {
      const result = await makeAuthenticatedRequest((token) =>
        strapiAPI.createRestaurantBooking(bookingData, token)
      )

      if (result) {
        console.log("[useBookings] Booking created successfully:", result)
        return result
      } else {
        throw new Error("Failed to create booking")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create booking"
      setError(errorMessage)
      console.error("[useBookings] Error creating booking:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createBooking,
    loading,
    error,
  }
}
