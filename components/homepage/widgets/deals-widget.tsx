"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tag, Clock, MapPin, FlameIcon as Fire } from "lucide-react"

interface Deal {
  id: string
  title: string
  business: string
  location: string
  discount: string
  originalPrice: number
  salePrice: number
  timeLeft: string
  category: string
  urgent: boolean
  image: string
}

export function DealsWidget() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [currentDeal, setCurrentDeal] = useState(0)

  useEffect(() => {
    const hotDeals: Deal[] = [
      {
        id: "1",
        title: "Thai Massage Special",
        business: "Luxury Spa Center",
        location: "Central Pattaya",
        discount: "50%",
        originalPrice: 1000,
        salePrice: 500,
        timeLeft: "2h 15m",
        category: "Wellness",
        urgent: true,
        image: "/placeholder.svg?height=80&width=120&text=Massage",
      },
      {
        id: "2",
        title: "Seafood Buffet",
        business: "Ocean View Restaurant",
        location: "Beach Road",
        discount: "30%",
        originalPrice: 899,
        salePrice: 629,
        timeLeft: "1 day",
        category: "Dining",
        urgent: false,
        image: "/placeholder.svg?height=80&width=120&text=Seafood",
      },
      {
        id: "3",
        title: "Diving Course",
        business: "Adventure Dive Center",
        location: "Jomtien Beach",
        discount: "25%",
        originalPrice: 2400,
        salePrice: 1800,
        timeLeft: "3 days",
        category: "Adventure",
        urgent: false,
        image: "/placeholder.svg?height=80&width=120&text=Diving",
      },
    ]
    setDeals(hotDeals)

    // Auto-rotate deals every 4 seconds
    const interval = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % hotDeals.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "wellness":
        return "bg-green-100 text-green-700"
      case "dining":
        return "bg-orange-100 text-orange-700"
      case "adventure":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (deals.length === 0) return <div className="animate-pulse bg-gray-200 rounded-lg h-full"></div>

  const deal = deals[currentDeal]

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center">
          <Fire className="w-4 h-4 mr-2 text-red-500" />
          Hot Deals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Deal Image */}
        <div className="relative">
          <img
            src={deal.image || "/placeholder.svg"}
            alt={deal.title}
            className="w-full h-16 object-cover rounded-lg"
          />
          <Badge
            className={`absolute top-1 left-1 text-xs ${deal.urgent ? "bg-red-500 animate-pulse" : "bg-orange-500"} text-white`}
          >
            -{deal.discount}
          </Badge>
          {deal.urgent && (
            <Badge className="absolute top-1 right-1 text-xs bg-red-600 text-white animate-pulse">URGENT</Badge>
          )}
        </div>

        {/* Deal Info */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-semibold line-clamp-1">{deal.title}</h3>
            <p className="text-xs text-gray-600">{deal.business}</p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-green-600">฿{deal.salePrice}</span>
              <span className="text-xs text-gray-500 line-through">฿{deal.originalPrice}</span>
            </div>
            <Badge variant="secondary" className={`text-xs ${getCategoryColor(deal.category)}`}>
              {deal.category}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{deal.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className={deal.urgent ? "text-red-600 font-medium" : ""}>{deal.timeLeft} left</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs py-2 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center space-x-1">
            <Tag className="w-3 h-3" />
            <span>Claim Deal</span>
          </button>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-1">
          {deals.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentDeal(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentDeal ? "bg-red-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
