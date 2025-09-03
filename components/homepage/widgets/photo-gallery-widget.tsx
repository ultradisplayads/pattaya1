"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Heart, MessageCircle, Eye, User } from "lucide-react"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"

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

export function PhotoGalleryWidget({ isExpanded = false, onToggleExpand }: { isExpanded?: boolean; onToggleExpand?: () => void }) {
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
    const colors: { [key: string]: string } = {
      Nature: "bg-green-500 text-white",
      Urban: "bg-blue-500 text-white",
      Portrait: "bg-purple-500 text-white",
      Landscape: "bg-orange-500 text-white",
      Street: "bg-gray-500 text-white",
      Wildlife: "bg-red-500 text-white",
      Architecture: "bg-indigo-500 text-white",
      Travel: "bg-pink-500 text-white",
      Food: "bg-yellow-500 text-white",
      Fashion: "bg-rose-500 text-white"
    }
    return colors[category] || "bg-gray-500 text-white"
  }

  if (loading) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-base font-medium text-gray-900 flex items-center">
            <Camera className="w-4 h-4 mr-2 text-gray-600" />
            Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
    <>
      {!isExpanded ? (
        // Compact Photo Gallery View
        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4 px-6 pt-6">
            <CardTitle className="text-base font-medium text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <Camera className="w-4 h-4 mr-2 text-gray-600" />
                Photo Gallery
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">
                  {photos.length} photos
                </span>
                {onToggleExpand && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleExpand()
                    }}
                    className="h-8 px-3 text-xs font-medium bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105 shadow-sm rounded-lg border"
                    title="Expand widget"
                  >
                    {isExpanded ? 'Less' : 'More'}
                  </button>
                )}
              </div>
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
      ) : (
        // Expanded Photo Gallery View
        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4 px-6 pt-6">
            <CardTitle className="text-base font-medium text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <Camera className="w-4 h-4 mr-2 text-gray-600" />
                Photo Gallery - Full View
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">
                  {photos.length} photos
                </span>
                {onToggleExpand && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleExpand()
                    }}
                    className="h-8 px-3 text-xs font-medium bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105 shadow-sm rounded-lg border"
                    title="Collapse widget"
                  >
                    Less
                  </button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-6">
            {/* Large Featured Photo */}
            <div className="relative">
              <img
                src={photo.Image ? buildStrapiUrl(photo.Image.url) : "/placeholder.svg"}
                alt={photo.Title}
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
              <Badge className={`absolute top-4 left-4 text-sm ${getCategoryColor(photo.Category)} border-0 font-medium`}>
                {photo.Category}
              </Badge>
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">
                {currentPhoto + 1}/{photos.length}
              </div>
            </div>

            {/* Enhanced Photo Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">{photo.Title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate font-medium">{photo.Author}</span>
                  </div>
                  <span className="flex-shrink-0 font-medium">{photo.TimeAgo}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 font-medium">📍 {photo.Location}</p>

              {photo.Description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {photo.Description}
                </p>
              )}

              {/* Enhanced Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="font-medium">{photo.Likes} likes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{photo.Comments} comments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{photo.Views} views</span>
                  </div>
                </div>
              </div>

              {/* Camera Settings if available */}
              {photo.CameraSettings && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Camera Settings</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Aperture:</span> {photo.CameraSettings.aperture}
                    </div>
                    <div>
                      <span className="font-medium">Shutter:</span> {photo.CameraSettings.shutterSpeed}
                    </div>
                    <div>
                      <span className="font-medium">ISO:</span> {photo.CameraSettings.iso}
                    </div>
                    <div>
                      <span className="font-medium">Focal Length:</span> {photo.CameraSettings.focalLength}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags if available */}
              {photo.Tags && photo.Tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photo.Tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Enhanced Navigation dots */}
            <div className="flex justify-center space-x-3">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhoto(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentPhoto ? "bg-gray-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Photo Grid Preview */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">All Photos</h4>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {photos.map((photoItem, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhoto(index)}
                    className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
                      index === currentPhoto ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                  >
                    <img
                      src={photoItem.Image ? buildStrapiUrl(photoItem.Image.url) : "/placeholder.svg"}
                      alt={photoItem.Title}
                      className="w-full h-20 object-cover"
                    />
                    {index === currentPhoto && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
