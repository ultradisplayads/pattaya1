"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Download, QrCode, CheckCircle, XCircle } from "lucide-react"

interface Booking {
  id: string
  deal: {
    deal_title: string
    business: {
      name: string
    }
  }
  status: string
  purchase_date: string
  quantity: number
  total_amount: number
  confirmation_code?: string
}

export function UserBookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch bookings from API
    setBookings([])
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading bookings...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Bookings</h2>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No bookings found.</p>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle>{booking.deal.deal_title}</CardTitle>
                  <p className="text-sm text-gray-600">{booking.deal.business.name}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p>Status: {booking.status}</p>
                      <p>Amount: ฿{booking.total_amount}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
