"use client"

import { Star, MapPin, Clock, ExternalLink, Heart, Camera } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface EnhancedRecommendedPicksProps {
  theme: "primary" | "nightlife"
}

export function EnhancedRecommendedPicks({ theme }: EnhancedRecommendedPicksProps) {
  const isPrimary = theme === "primary"

  const picks = [
    {
      name: "Sanctuary of Truth",
      category: "Attraction",
      rating: 4.8,
      reviews: 2847,
      image: "/placeholder.svg?height=80&width=120&text=Sanctuary",
      description: "Magnificent wooden temple showcasing traditional Thai architecture",
      distance: "2.5 km",
      openUntil: "6:00 PM",
      price: "₿500",
      featured: true,
      photos: 156,
    },
    {
      name: "Floating Market Experience",
      category: "Market",
      rating: 4.6,
      reviews: 1923,
      image: "/placeholder.svg?height=80&width=120&text=Market",
      description: "Traditional market experience with local food and crafts",
      distance: "8.2 km",
      openUntil: "4:00 PM",
      price: "₿200",
      featured: false,
      photos: 89,
    },
    {
      name: "Nong Nooch Tropical Garden",
      category: "Garden",
      rating: 4.7,
      reviews: 3421,
      image: "/placeholder.svg?height=80&width=120&text=Garden",
      description: "Beautiful botanical garden with cultural shows",
      distance: "15 km",
      openUntil: "6:00 PM",
      price: "₿600",
      featured: true,
      photos: 234,
    },
  ]

  const handleViewAll = () => {
    window.location.href = "/recommendations"
  }

  const handlePickClick = (pick: any) => {
    window.location.href = `/attractions/${pick.name.toLowerCase().replace(/\s+/g, "-")}`
  }

  return (
    <Card
      className={`transition-all duration-500 hover:scale-105 cursor-pointer group ${
        isPrimary
          ? "bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-violet-200 hover:shadow-xl hover:shadow-violet-200/50"
          : "bg-gradient-to-br from-purple-800 to-pink-800 border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/30"
      }`}
      onClick={handleViewAll}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className={`flex items-center justify-between text-lg ${isPrimary ? "text-violet-800" : "text-white"}`}
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Star className="h-5 w-5 fill-current text-yellow-500" />
              <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-30 animate-pulse"></div>
            </div>
            <span>Pattaya1 Recommends</span>
            <Badge
              variant="secondary"
              className={`${isPrimary ? "bg-violet-100 text-violet-800" : "bg-pink-500/20 text-pink-300"}`}
            >
              Editor's Choice
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              handleViewAll()
            }}
            className={`h-6 w-6 ${isPrimary ? "hover:bg-violet-200" : "hover:bg-purple-700"}`}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {picks.map((pick, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden ${
              isPrimary ? "bg-white/70 hover:bg-white/90" : "bg-purple-900/50 hover:bg-purple-900/70"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handlePickClick(pick)
            }}
          >
            {pick.featured && (
              <div className="absolute top-2 right-2 z-10">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs"
                >
                  ⭐ Featured
                </Badge>
              </div>
            )}

            <div className="flex space-x-3">
              <div className="relative flex-shrink-0">
                <Image
                  src={pick.image || "/placeholder.svg"}
                  alt={pick.name}
                  width={80}
                  height={60}
                  className="rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded flex items-center space-x-1">
                  <Camera className="h-2 w-2" />
                  <span>{pick.photos}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`font-medium text-sm line-clamp-1 ${isPrimary ? "text-violet-900" : "text-white"}`}>
                    {pick.name}
                  </h4>
                  <div className="flex items-center space-x-1 ml-2">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    <span className={`text-xs font-medium ${isPrimary ? "text-violet-700" : "text-purple-200"}`}>
                      {pick.rating}
                    </span>
                  </div>
                </div>

                <p className={`text-xs mb-2 line-clamp-2 ${isPrimary ? "text-violet-600" : "text-purple-200"}`}>
                  {pick.description}
                </p>

                <div
                  className={`flex items-center justify-between text-xs ${
                    isPrimary ? "text-violet-600" : "text-purple-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{pick.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{pick.openUntil}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${isPrimary ? "text-violet-800" : "text-pink-300"}`}>
                      {pick.price}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Add to favorites
                      }}
                    >
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className={`text-xs mt-1 ${isPrimary ? "text-violet-500" : "text-purple-400"}`}>
                  {pick.reviews.toLocaleString()} reviews • {pick.category}
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className={`w-full mt-3 ${
            isPrimary
              ? "border-violet-300 text-violet-700 hover:bg-violet-100"
              : "border-pink-400 text-pink-300 hover:bg-purple-700"
          }`}
          onClick={(e) => {
            e.stopPropagation()
            handleViewAll()
          }}
        >
          View All Recommendations
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}
