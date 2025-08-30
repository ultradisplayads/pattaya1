"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Heart, MessageCircle, Eye, User } from "lucide-react"

interface StrapiPhotoGallery {
  id: number
  Title: string
  Image?: {
    id: number
    name: string
    url: string
    formats?: {
      thumbnail?: { url: string }
      small?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
  }
  Author: string
  Location: string
  Likes: number
  Comments: number
  Views: number
  TimeAgo: string
  Category: string
  IsActive: boolean
  Featured: boolean
  Description?: string
  Tags?: string[]
  CameraSettings?: {
    aperture: string
    shutterSpeed: string
    iso: number
    focalLength: string
  }
  LocationCoordinates?: {
    lat: number
    lng: number
  }
  LastUpdated: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function PhotoGalleryWidget() {
  const [photos, setPhotos] = useState<StrapiPhotoGallery[]>([])
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPhotoData()
    const interval = setInterval(loadPhotoData, 180000) // Refresh every 3 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (photos.length > 0) {
      // Auto-rotate photos every 3 seconds
      const interval = setInterval(() => {
        setCurrentPhoto((prev) => (prev + 1) % photos.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [photos])

  const loadPhotoData = async () => {
    try {
      setLoading(true)
      console.log('Fetching photo galleries from Strapi...')
      const response = await fetch("http://localhost:1337/api/photo-galleries?populate=*&sort=LastUpdated:desc")
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          // Transform data to ensure proper structure
          const transformedPhotos = data.data.map((photo: any) => ({
            ...photo,
            // Ensure Image URL is properly formatted
            Image: photo.Image ? {
              ...photo.Image,
              url: photo.Image.url
            } : null
          }))
          setPhotos(transformedPhotos)
        } else {
          setPhotos([])
        }
      } else {
        console.error("Failed to load photo data from Strapi:", response.status)
        setPhotos([])
      }
    } catch (error) {
      console.error("Failed to load photo data:", error)
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-100 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (photos.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-center text-gray-500 py-8">
            No photos available at the moment.
          </div>
        </CardContent>
      </Card>
    )
  }

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
            src={photo.Image ? `http://localhost:1337${photo.Image.url}` : "/placeholder.svg"}
            alt={photo.Title}
            className="w-full h-24 object-cover rounded-lg"
          />
          <Badge variant="secondary" className={`absolute top-2 left-2 text-xs ${getCategoryColor(photo.Category)}`}>
            {photo.Category}
          </Badge>
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentPhoto + 1}/{photos.length}
          </div>
        </div>

        {/* Photo Info */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-semibold line-clamp-1">{photo.Title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-1 min-w-0">
                <User className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{photo.Author}</span>
              </div>
              <span className="flex-shrink-0">{photo.TimeAgo}</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 truncate">📍 {photo.Location}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-500 flex-shrink-0" />
                <span>{photo.Likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3 flex-shrink-0" />
                <span>{photo.Comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 flex-shrink-0" />
                <span>{photo.Views}</span>
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
