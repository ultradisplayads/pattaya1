"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Users } from "lucide-react"

interface BookingFormProps {
  dealId: string
  dealTitle: string
  requiresReservation: boolean
  maxQuantity: number
  onBookingSubmit: (bookingData: any) => void
  onCancel: () => void
}

export function BookingForm({
  dealId,
  dealTitle,
  requiresReservation,
  maxQuantity,
  onBookingSubmit,
  onCancel
}: BookingFormProps) {
  const [quantity, setQuantity] = useState(1)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBookingSubmit({
      dealId,
      quantity,
      customerName,
      customerEmail
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book Your Deal
        </CardTitle>
        <p className="text-sm text-gray-600">{dealTitle}</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Quantity
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="text-center w-20"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {maxQuantity - quantity} spots remaining
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name *</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email *</Label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
