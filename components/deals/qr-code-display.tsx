"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, QrCode, CheckCircle } from "lucide-react"

interface QRCodeDisplayProps {
  qrCodeData: string
  confirmationCode: string
  dealTitle: string
  businessName: string
  onDownload?: () => void
  onCopy?: () => void
}

export function QRCodeDisplay({
  qrCodeData,
  confirmationCode,
  dealTitle,
  businessName,
  onDownload,
  onCopy
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(confirmationCode)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDownload = () => {
    onDownload?.()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-xl">Booking Confirmed!</CardTitle>
        <p className="text-sm text-gray-600">Show this QR code at the venue</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg border inline-block">
            <img
              src={qrCodeData}
              alt="QR Code"
              className="w-48 h-48"
              onError={(e) => {
                // Fallback to placeholder if QR code fails to load
                e.currentTarget.src = "/placeholder.svg?height=200&width=200&text=QR+Code"
              }}
            />
          </div>
        </div>

        {/* Confirmation Code */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Confirmation Code</p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-lg font-mono px-4 py-2">
              {confirmationCode}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="ml-2"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {copied && (
            <p className="text-sm text-green-600">Copied to clipboard!</p>
          )}
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-sm">Booking Details</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-600">Deal:</span> {dealTitle}</p>
            <p><span className="text-gray-600">Venue:</span> {businessName}</p>
            <p><span className="text-gray-600">Code:</span> {confirmationCode}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
          <Button className="flex-1">
            <QrCode className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 text-sm mb-2">How to Use</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Present this QR code at the venue</li>
            <li>• Or show the confirmation code: {confirmationCode}</li>
            <li>• Keep this safe until your visit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
