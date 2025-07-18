"use client"

import { useState } from "react"
import { Calendar, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AgeGateProps {
  onVerification?: (verified: boolean) => void
}

export function AgeGate({ onVerification }: AgeGateProps) {
  const [loading, setLoading] = useState(false)

  const handleVerification = async (isOfAge: boolean) => {
    setLoading(true)

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (isOfAge) {
      sessionStorage.setItem("ageVerified", "true")
    }

    onVerification?.(isOfAge)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-amber-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Age Verification Required</CardTitle>
          <p className="text-muted-foreground">
            This website contains content intended for adults only. You must be 18 years or older to continue.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Important Notice:</p>
                <p>
                  By clicking "I am 18 or older", you confirm that you are of legal age to view adult content in your
                  jurisdiction.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handleVerification(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={loading}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {loading ? "Verifying..." : "I am 18 or older"}
            </Button>

            <Button
              onClick={() => handleVerification(false)}
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
              disabled={loading}
            >
              I am under 18
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              This verification helps us comply with local laws and regulations regarding adult content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
