"use client"

import { useState } from "react"
import { Star, MapPin, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RecommendedPicksProps {
  theme: "primary" | "nightlife"
}

export function RecommendedPicks({ theme }: RecommendedPicksProps) {
  const [recommendations] = useState([
    {
      id: 1,
      name: "Sanctuary of Truth",
      category: "Attraction",
      rating: 4.8,
      reviews: 2341,
      image: "/placeholder.svg?height=100&width=150&text=Sanctuary",
      location: "North Pattaya",
      openHours: "8:00 AM - 6:00 PM",
      featured: true,
    },
    {
      id: 2,
      name: "Floating Market",
      category: "Shopping",
      rating: 4.6,
      reviews: 1876,
      image: "/placeholder.svg?height=100&width=150&text=Market",
      location: "Jomtien",
      openHours: "9:00 AM - 8:00 PM",
      featured: false,
    },
    {
      id: 3,
      name: "Nong Nooch Garden",
      category: "Nature",
      rating: 4.7,
      reviews: 3102,
      image: "/placeholder.svg?height=100&width=150&text=Garden",
      location: "South Pattaya",
      openHours: "8:00 AM - 6:00 PM",
      featured: true,
    },
  ])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((item) => (
          <div key={item.id} className="flex space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium truncate">{item.name}</h4>
                    {item.featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                    <span className="text-xs text-muted-foreground">({item.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.openHours}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
