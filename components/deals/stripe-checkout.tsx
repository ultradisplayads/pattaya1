"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Lock, Shield, CheckCircle } from "lucide-react"

interface StripeCheckoutProps {
  dealTitle: string
  amount: number
  currency: string
  onPaymentSuccess: (paymentData: any) => void
  onPaymentError: (error: string) => void
  onCancel: () => void
}

export function StripeCheckout({
  dealTitle,
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}: StripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("card")

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // TODO: Integrate with Stripe
      // This is a placeholder implementation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful payment
      onPaymentSuccess({
        paymentId: "pi_" + Math.random().toString(36).substring(2, 15),
        amount,
        currency,
        status: "succeeded"
      })
    } catch (error) {
      onPaymentError("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2
    }).format(amount / 100)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
        <p className="text-sm text-gray-600">Complete your purchase</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{dealTitle}</span>
              <span className="font-medium">{formatAmount(amount)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatAmount(amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-blue-600"
              />
              <CreditCard className="h-5 w-5" />
              <span>Credit/Debit Card</span>
            </label>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Secure Payment</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-blue-700">
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>PCI Compliant</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Pay {formatAmount(amount)}
            </>
          )}
        </Button>

        {/* Cancel Button */}
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full"
        >
          Cancel
        </Button>

        {/* Security Notice */}
        <p className="text-xs text-gray-500 text-center">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </CardContent>
    </Card>
  )
}
