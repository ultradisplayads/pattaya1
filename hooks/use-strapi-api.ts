import { useAuth } from "@/components/auth/auth-provider"
import { strapiAPI } from "@/lib/strapi-api"
import { useState, useCallback } from "react"

export function useStrapiAPI() {
  const { getStrapiToken, syncWithStrapi } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeAuthenticatedRequest = useCallback(async <T>(
    requestFn: (token: string) => Promise<T>
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      let token = getStrapiToken()
      
      // If no token, try to sync with Strapi
      if (!token) {
        await syncWithStrapi()
        token = getStrapiToken()
      }

      if (!token) {
        throw new Error("No authentication token available")
      }

      const result = await requestFn(token)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Strapi API error:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [getStrapiToken, syncWithStrapi])

  const testProtectedEndpoint = useCallback(async () => {
    return makeAuthenticatedRequest((token) => 
      strapiAPI.getAuthStatus(token)
    )
  }, [makeAuthenticatedRequest])

  const getCurrentUser = useCallback(async () => {
    return makeAuthenticatedRequest((token) => 
      strapiAPI.getCurrentUser(token)
    )
  }, [makeAuthenticatedRequest])

  const getServerStatus = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await strapiAPI.getServerStatus()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Server status error:", err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    testProtectedEndpoint,
    getCurrentUser,
    getServerStatus,
    makeAuthenticatedRequest,
  }
} 