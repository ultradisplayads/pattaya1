"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Heart, MessageCircle, Eye, User } from "lucide-react"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"

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
      const response = await fetch(buildApiUrl("photo-galleries?populate=*&sort=LastUpdated:desc"))
      
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
        return "bg-green-50 text-green-700"
      case "food":
        return "bg-orange-50 text-orange-700"
      case "culture":
        return "bg-purple-50 text-purple-700"
      case "nightlife":
        return "bg-pink-50 text-pink-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  if (loading) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-100 rounded-full w-28"></div>
            <div className="h-24 bg-gray-50 rounded-2xl"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded-full"></div>
              <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (photos.length === 0) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-base font-medium text-gray-900 flex items-center">
            <Camera className="w-4 h-4 mr-2 text-gray-600" />
            Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="text-center text-gray-400 py-12">
            <p className="text-sm font-medium">No photos available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const photo = photos[currentPhoto]

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Global Sponsorship Banner */}
      <SponsorshipBanner widgetType="photos" />
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-base font-medium text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="w-4 h-4 mr-2 text-gray-600" />
            Photo Gallery
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {photos.length} photos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-4">
        {/* Photo */}
        <div className="relative">
          <img
            src={photo.Image ? buildStrapiUrl(photo.Image.url) : "/placeholder.svg"}
            alt={photo.Title}
            className="w-full h-24 object-cover rounded-2xl shadow-sm"
          />
          <Badge className={`absolute top-3 left-3 text-xs ${getCategoryColor(photo.Category)} border-0 font-medium`}>
            {photo.Category}
          </Badge>
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
            {currentPhoto + 1}/{photos.length}
          </div>
        </div>

        {/* Photo Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 leading-tight">{photo.Title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <div className="flex items-center space-x-1 min-w-0">
                <User className="w-3 h-3 flex-shrink-0" />
                <span className="truncate font-medium">{photo.Author}</span>
              </div>
              <span className="flex-shrink-0 font-medium">{photo.TimeAgo}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 font-medium">📍 {photo.Location}</p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-400 flex-shrink-0" />
                <span className="font-medium">{photo.Likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3 flex-shrink-0" />
                <span className="font-medium">{photo.Comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 flex-shrink-0" />
                <span className="font-medium">{photo.Views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center space-x-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhoto(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentPhoto ? "bg-gray-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
