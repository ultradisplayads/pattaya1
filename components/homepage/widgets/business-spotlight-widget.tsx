"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Phone, ExternalLink, Heart } from "lucide-react"

interface Business {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  location: string
  image: string
  description: string
  hours: string
  phone: string
  featured: boolean
  deal?: string
  tags: string[]
}

export function BusinessSpotlightWidget() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [currentBusiness, setCurrentBusiness] = useState(0)

  useEffect(() => {
    const featuredBusinesses: Business[] = [
      {
        id: "1",
        name: "Ocean View Restaurant",
        category: "Fine Dining",
        rating: 4.8,
        reviews: 324,
        location: "Beach Road, Pattaya",
        image: "/placeholder.svg?height=120&width=200&text=Restaurant",
        description: "Authentic Thai cuisine with stunning ocean views. Fresh seafood daily.",
        hours: "11:00 AM - 11:00 PM",
        phone: "+66 38 123 456",
        featured: true,
        deal: "20% off dinner menu",
        tags: ["Seafood", "Thai", "Ocean View"],
      },
      {
        id: "2",
        name: "Sunset Spa & Wellness",
        category: "Health & Beauty",
        rating: 4.9,
        reviews: 189,
        location: "Central Pattaya",
        image: "/placeholder.svg?height=120&width=200&text=Spa",
        description: "Traditional Thai massage and modern wellness treatments in luxury setting.",
        hours: "9:00 AM - 10:00 PM",
        phone: "+66 38 234 567",
        featured: true,
        deal: "Buy 2 get 1 free massage",
        tags: ["Massage", "Wellness", "Luxury"],
      },
      {
        id: "3",
        name: "Adventure Dive Center",
        category: "Water Sports",
        rating: 4.7,
        reviews: 156,
        location: "Jomtien Beach",
        image: "/placeholder.svg?height=120&width=200&text=Diving",
        description: "Professional diving courses and underwater adventures for all levels.",
        hours: "7:00 AM - 6:00 PM",
        phone: "+66 38 345 678",
        featured: true,
        deal: "Free equipment rental",
        tags: ["Diving", "Adventure", "Certified"],
      },
    ]
    setBusinesses(featuredBusinesses)

    // Auto-rotate businesses every 5 seconds
    const interval = setInterval(() => {
      setCurrentBusiness((prev) => (prev + 1) % featuredBusinesses.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (businesses.length === 0) return <div className="animate-pulse bg-gray-200 rounded-lg h-full"></div>

  const business = businesses[currentBusiness]

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Business Spotlight</span>
          <Heart className="w-4 h-4 text-red-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Business Image */}
        <div className="relative">
          <img
            src={business.image || "/placeholder.svg"}
            alt={business.name}
            className="w-full h-24 object-cover rounded-lg"
          />
          {business.featured && (
            <Badge className="absolute top-2 left-2 text-xs bg-yellow-500 text-white">FEATURED</Badge>
          )}
          {business.deal && <Badge className="absolute top-2 right-2 text-xs bg-red-500 text-white">DEAL</Badge>}
        </div>

        {/* Business Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold line-clamp-1">{business.name}</h3>
              <p className="text-xs text-gray-600">{business.category}</p>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{business.rating}</span>
              <span className="text-gray-500">({business.reviews})</span>
            </div>
          </div>

          <p className="text-xs text-gray-700 line-clamp-2">{business.description}</p>

          {/* Deal */}
          {business.deal && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2">
              <p className="text-xs font-medium text-red-700">🎉 {business.deal}</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {business.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Contact Info */}
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{business.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{business.hours}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>{business.phone}</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
            <span>View Details</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-1">
          {businesses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBusiness(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentBusiness ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
