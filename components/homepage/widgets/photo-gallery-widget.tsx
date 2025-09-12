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
  overlay_text?: string
  overlay_position?: string
  overlay_text_color?: string
  overlay_background_color?: string
  overlay_font_size?: number
  sponsor_url?: string
}

export function PhotoGalleryWidget() {
  const [photos, setPhotos] = useState<StrapiPhotoGallery[]>([])
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<StrapiPhotoGallery | null>(null)

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (lightboxOpen && lightboxPhoto) {
        if (event.key === 'Escape') {
          closeLightbox()
        } else if (event.key === 'ArrowLeft') {
          const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
          setLightboxPhoto(photos[prevIndex])
        } else if (event.key === 'ArrowRight') {
          const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
          const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
          setLightboxPhoto(photos[nextIndex])
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, lightboxPhoto, photos])

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

  const getOverlayPosition = (position: string) => {
    switch (position) {
      case "Top-Left":
        return "top-2 left-2"
      case "Top-Right":
        return "top-2 right-2"
      case "Bottom-Left":
        return "bottom-2 left-2"
      case "Bottom-Right":
        return "bottom-2 right-2"
      case "Center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      default:
        return "bottom-2 right-2"
    }
  }

  const handlePhotoClick = (photo: StrapiPhotoGallery) => {
    if (photo.sponsor_url) {
      window.open(photo.sponsor_url, '_blank')
    } else {
      setLightboxPhoto(photo)
      setLightboxOpen(true)
    }
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setLightboxPhoto(null)
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
        <div className="relative cursor-pointer" onClick={() => handlePhotoClick(photo)}>
          <img
            src={photo.Image ? buildStrapiUrl(photo.Image.url) : "/placeholder.svg"}
            alt={photo.Title}
            className="w-full h-64 object-cover rounded-2xl shadow-sm hover:opacity-90 transition-opacity"
          />
          <Badge className={`absolute top-3 left-3 text-xs ${getCategoryColor(photo.Category)} border-0 font-medium`}>
            {photo.Category}
          </Badge>
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
            {currentPhoto + 1}/{photos.length}
          </div>
          
          {/* Overlay Text */}
          {photo.overlay_text && (
            <div
              className={`absolute ${getOverlayPosition(photo.overlay_position || 'Bottom-Right')} px-3 py-2 rounded-lg font-medium text-sm shadow-lg`}
              style={{
                color: photo.overlay_text_color || '#FFFFFF',
                backgroundColor: photo.overlay_background_color || 'rgba(0,0,0,0.6)',
                fontSize: `${photo.overlay_font_size || 1.2}rem`
              }}
            >
              {photo.overlay_text}
            </div>
          )}
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
      
      {/* Lightbox Modal */}
      {lightboxOpen && lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image */}
            <div className="relative">
              <img
                src={lightboxPhoto.Image ? buildStrapiUrl(lightboxPhoto.Image.url) : "/placeholder.svg"}
                alt={lightboxPhoto.Title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              
              {/* Navigation Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
                      setLightboxPhoto(photos[prevIndex])
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = photos.findIndex(p => p.id === lightboxPhoto.id)
                      const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
                      setLightboxPhoto(photos[nextIndex])
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Overlay Text in Lightbox */}
              {lightboxPhoto.overlay_text && (
                <div
                  className={`absolute ${getOverlayPosition(lightboxPhoto.overlay_position || 'Bottom-Right')} px-4 py-3 rounded-lg font-medium text-lg shadow-lg`}
                  style={{
                    color: lightboxPhoto.overlay_text_color || '#FFFFFF',
                    backgroundColor: lightboxPhoto.overlay_background_color || 'rgba(0,0,0,0.6)',
                    fontSize: `${(lightboxPhoto.overlay_font_size || 1.2) * 1.2}rem`
                  }}
                >
                  {lightboxPhoto.overlay_text}
                </div>
              )}
            </div>
            
            {/* Photo Info in Lightbox */}
            <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{lightboxPhoto.Title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{lightboxPhoto.Author}</span>
                </div>
                <span className="font-medium">{lightboxPhoto.TimeAgo}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">📍 {lightboxPhoto.Location}</p>
              {lightboxPhoto.Description && (
                <p className="text-sm text-gray-700 mb-3">{lightboxPhoto.Description}</p>
              )}
              
              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="font-medium">{lightboxPhoto.Likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">{lightboxPhoto.Comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{lightboxPhoto.Views}</span>
                  </div>
                </div>
                <Badge className={`text-xs ${getCategoryColor(lightboxPhoto.Category)} border-0 font-medium`}>
                  {lightboxPhoto.Category}
                </Badge>
              </div>
              
              {/* Submit Your Photo Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    // Navigate to photo submission page or open modal
                    window.open('/photos', '_blank')
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Submit Your Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
