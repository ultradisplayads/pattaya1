"use client"

import { useState } from "react"
import { Percent, Clock, MapPin, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DealsSectionProps {
  theme: "primary" | "nightlife"
}

export function DealsSection({ theme }: DealsSectionProps) {
  const [deals] = useState([
    {
      id: 1,
      title: "50% Off Spa Treatment",
      business: "Luxury Spa Resort",
      discount: "50%",
      originalPrice: 2000,
      salePrice: 1000,
      location: "Central Pattaya",
      expiresIn: "2 days",
      image: "/placeholder.svg?height=120&width=200&text=Spa",
      category: "Wellness",
    },
    {
      id: 2,
      title: "Buy 1 Get 1 Free Dinner",
      business: "Oceanview Restaurant",
      discount: "BOGO",
      originalPrice: 800,
      salePrice: 400,
      location: "Jomtien Beach",
      expiresIn: "5 days",
      image: "/placeholder.svg?height=120&width=200&text=Restaurant",
      category: "Dining",
    },
    {
      id: 3,
      title: "30% Off Island Tour",
      business: "Pattaya Adventures",
      discount: "30%",
      originalPrice: 1500,
      salePrice: 1050,
      location: "Bali Hai Pier",
      expiresIn: "1 week",
      image: "/placeholder.svg?height=120&width=200&text=Island+Tour",
      category: "Tours",
    },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Percent className="h-5 w-5" />
          <span>Hot Deals</span>
          <Badge variant="destructive" className="animate-pulse">
            LIMITED TIME
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => (
            <div key={deal.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={deal.image || "/placeholder.svg"} alt={deal.title} className="w-full h-32 object-cover" />
                <Badge variant="destructive" className="absolute top-2 left-2 font-bold">
                  {deal.discount} OFF
                </Badge>
              </div>

              <div className="p-4">
                <h4 className="font-medium mb-1">{deal.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{deal.business}</p>

                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-bold text-green-600">฿{deal.salePrice}</span>
                  <span className="text-sm text-muted-foreground line-through">฿{deal.originalPrice}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{deal.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Expires in {deal.expiresIn}</span>
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Claim Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
