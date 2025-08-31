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
        return "bg-green-500/10 text-green-600 border-green-200"
      case "dining":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "adventure":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  if (deals.length === 0) return <div className="animate-pulse bg-gray-100 rounded-lg h-full"></div>

  const deal = deals[currentDeal]

  return (
    <Card className="h-full bg-white/95 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-6">
        <CardTitle className="text-[15px] font-medium text-gray-900 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
          <span>Deals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Deal Image */}
        <div className="relative">
          <img
            src={deal.image || "/placeholder.svg"}
            alt={deal.title}
            className="w-full h-16 object-cover rounded-lg"
          />
          <Badge
            className={`absolute top-1 left-1 text-[11px] px-2 py-0.5 font-medium border rounded-full ${
              deal.urgent ? "bg-red-500/10 text-red-600 border-red-200" : "bg-orange-500/10 text-orange-600 border-orange-200"
            }`}
          >
            -{deal.discount}
          </Badge>
          {deal.urgent && (
            <Badge className="absolute top-1 right-1 text-[11px] px-2 py-0.5 font-medium bg-red-500/10 text-red-600 border border-red-200 rounded-full">
              Urgent
            </Badge>
          )}
        </div>

        {/* Deal Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1">{deal.title}</h3>
            <p className="text-[13px] text-gray-600">{deal.business}</p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-green-600">฿{deal.salePrice}</span>
              <span className="text-[11px] text-gray-400 line-through">฿{deal.originalPrice}</span>
            </div>
            <Badge className={`text-[11px] px-2 py-0.5 font-medium border rounded-full ${getCategoryColor(deal.category)}`}>
              {deal.category}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-[11px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{deal.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span className={deal.urgent ? "text-red-600 font-medium" : ""}>{deal.timeLeft} left</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-orange-500/10 text-orange-600 text-[13px] py-2 rounded-lg hover:bg-orange-500/20 transition-all duration-200 flex items-center justify-center gap-1.5 border border-orange-200 font-medium">
            <Tag className="w-3.5 h-3.5" />
            <span>Claim Deal</span>
          </button>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-1">
          {deals.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentDeal(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                index === currentDeal ? "bg-orange-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
