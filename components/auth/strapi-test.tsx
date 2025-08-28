"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { useStrapiAPI } from "@/hooks/use-strapi-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function StrapiTest() {
  const { user, firebaseUser, getStrapiToken, syncWithStrapi } = useAuth()
  const { loading, error, testProtectedEndpoint, getCurrentUser, getServerStatus } = useStrapiAPI()
  const [testResults, setTestResults] = useState<any>(null)

  const handleTestProtected = async () => {
    const result = await testProtectedEndpoint()
    setTestResults({ type: "protected", result })
  }

  const handleTestUser = async () => {
    const result = await getCurrentUser()
    setTestResults({ type: "user", result })
  }

  const handleTestStatus = async () => {
    const result = await getServerStatus()
    setTestResults({ type: "status", result })
  }

  const handleSync = async () => {
    await syncWithStrapi()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Strapi Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Authentication Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Firebase Status</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span>User:</span>
                  <Badge variant={firebaseUser ? "default" : "secondary"}>
                    {firebaseUser ? "Authenticated" : "Not Authenticated"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Email:</span>
                  <span className="text-sm text-gray-600">
                    {firebaseUser?.email || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Strapi Status</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span>Token:</span>
                  <Badge variant={getStrapiToken() ? "default" : "secondary"}>
                    {getStrapiToken() ? "Available" : "Not Available"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>User ID:</span>
                  <span className="text-sm text-gray-600">
                    {user?.strapiUser?.id || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSync} disabled={loading}>
              Sync with Strapi
            </Button>
            <Button onClick={handleTestStatus} disabled={loading}>
              Test Server Status
            </Button>
            <Button onClick={handleTestProtected} disabled={loading}>
              Test Protected Endpoint
            </Button>
            <Button onClick={handleTestUser} disabled={loading}>
              Get Current User
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {testResults && (
            <div className="p-4 bg-gray-50 border rounded-md">
              <h4 className="font-semibold mb-2">
                Test Result: {testResults.type}
              </h4>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(testResults.result, null, 2)}
              </pre>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 