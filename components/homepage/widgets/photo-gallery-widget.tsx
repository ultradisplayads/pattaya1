"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Heart, MessageCircle, Eye, User } from "lucide-react"

interface Photo {
  id: string
  image: string
  title: string
  author: string
  location: string
  likes: number
  comments: number
  views: number
  timeAgo: string
  category: string
}

export function PhotoGalleryWidget() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [currentPhoto, setCurrentPhoto] = useState(0)

  useEffect(() => {
    const recentPhotos: Photo[] = [
      {
        id: "1",
        image: "/placeholder.svg?height=150&width=200&text=Sunset",
        title: "Golden Hour at Jomtien",
        author: "PhotoPro",
        location: "Jomtien Beach",
        likes: 124,
        comments: 18,
        views: 890,
        timeAgo: "2h ago",
        category: "Landscape",
      },
      {
        id: "2",
        image: "/placeholder.svg?height=150&width=200&text=Food",
        title: "Street Food Paradise",
        author: "FoodieShots",
        location: "Walking Street",
        likes: 89,
        comments: 12,
        views: 456,
        timeAgo: "4h ago",
        category: "Food",
      },
      {
        id: "3",
        image: "/placeholder.svg?height=150&width=200&text=Culture",
        title: "Traditional Thai Dance",
        author: "CultureLens",
        location: "Cultural Center",
        likes: 156,
        comments: 23,
        views: 1200,
        timeAgo: "6h ago",
        category: "Culture",
      },
      {
        id: "4",
        image: "/placeholder.svg?height=150&width=200&text=Nightlife",
        title: "Neon Nights",
        author: "NightShooter",
        location: "Central Pattaya",
        likes: 203,
        comments: 34,
        views: 1500,
        timeAgo: "8h ago",
        category: "Nightlife",
      },
    ]
    setPhotos(recentPhotos)

    // Auto-rotate photos every 3 seconds
    const interval = setInterval(() => {
      setCurrentPhoto((prev) => (prev + 1) % recentPhotos.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "landscape":
        return "bg-green-100 text-green-700"
      case "food":
        return "bg-orange-100 text-orange-700"
      case "culture":
        return "bg-purple-100 text-purple-700"
      case "nightlife":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (photos.length === 0) return <div className="animate-pulse bg-gray-200 rounded-lg h-full"></div>

  const photo = photos[currentPhoto]

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center">
          <Camera className="w-4 h-4 mr-2" />
          Photo Gallery
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Photo */}
        <div className="relative">
          <img
            src={photo.image || "/placeholder.svg"}
            alt={photo.title}
            className="w-full h-24 object-cover rounded-lg"
          />
          <Badge variant="secondary" className={`absolute top-2 left-2 text-xs ${getCategoryColor(photo.category)}`}>
            {photo.category}
          </Badge>
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentPhoto + 1}/{photos.length}
          </div>
        </div>

        {/* Photo Info */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-semibold line-clamp-1">{photo.title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>{photo.author}</span>
              </div>
              <span>{photo.timeAgo}</span>
            </div>
          </div>

          <p className="text-xs text-gray-600">📍 {photo.location}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-500" />
                <span>{photo.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>{photo.comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{photo.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-1">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhoto(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentPhoto ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
