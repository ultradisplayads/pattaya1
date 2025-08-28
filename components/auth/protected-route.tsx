"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./auth-provider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireStrapi?: boolean
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireStrapi = false,
  fallback 
}: ProtectedRouteProps) {
  const { user, firebaseUser, loading, syncWithStrapi, getStrapiToken } = useAuth()
  const [strapiLoading, setStrapiLoading] = useState(false)

  useEffect(() => {
    if (requireStrapi && firebaseUser && !getStrapiToken()) {
      setStrapiLoading(true)
      syncWithStrapi().finally(() => setStrapiLoading(false))
    }
  }, [requireStrapi, firebaseUser, getStrapiToken, syncWithStrapi])

  // Show loading spinner while checking authentication
  if (loading || strapiLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Check if user is authenticated
  if (requireAuth && !user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Check if Strapi sync is required
  if (requireStrapi && !getStrapiToken()) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Syncing with Server</h2>
          <p className="text-gray-600 mb-4">Please wait while we sync your account...</p>
          <LoadingSpinner size="md" />
        </div>
      </div>
    )
  }

  return <>{children}</>
} 