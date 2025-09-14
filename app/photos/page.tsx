"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Camera, Heart, Share2, Download, Search, Grid, List, User, MapPin, Clock, TrendingUp, Filter, X } from "lucide-react"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { useAuth } from "@/components/auth/auth-provider"

interface Photo {
  id: number
  caption?: string
  image?: {
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
  author?: {
    id: number
    username: string
    email: string
  }
  hashtags?: Array<{
    id: number
    name: string
    slug: string
    color?: string
  }>
  location?: {
    latitude: number
    longitude: number
    address?: string
    city?: string
    country: string
  }
  likes?: number
  views?: number
  width?: number
  height?: number
  orientation?: 'portrait' | 'landscape' | 'square'
  sponsor_url?: string
  featured?: boolean
  uploaded_at?: string
  approved_at?: string
  createdAt?: string
}

interface Hashtag {
  id: number
  name: string
  slug: string
  usage_count: number
  is_trending: boolean
  color?: string
}

export default function PhotosPage() {
  const { user } = useAuth()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [hashtags, setHashtags] = useState<Hashtag[]>([])
  const [trendingHashtags, setTrendingHashtags] = useState<Hashtag[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest")
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    loadPhotos()
    loadHashtags()
    loadTrendingHashtags()
  }, [selectedHashtag, sortBy])

  const loadPhotos = async () => {
    try {
      setLoading(true)
      let url = buildApiUrl("photos?populate=*")
      
      // Add sorting
      if (sortBy === "newest") {
        url += "&sort=uploaded_at:desc"
      } else {
        url += "&sort=likes:desc"
      }

      // Add hashtag filter
      if (selectedHashtag) {
        url += `&filters[hashtags][name][$eq]=${selectedHashtag}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.data || [])
      }
    } catch (error) {
      console.error("Failed to load photos:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHashtags = async () => {
    try {
      const response = await fetch(buildApiUrl("hashtags?sort=usage_count:desc&pagination[limit]=50"))
      if (response.ok) {
        const data = await response.json()
        setHashtags(data.data || [])
      }
    } catch (error) {
      console.error("Failed to load hashtags:", error)
    }
  }

  const loadTrendingHashtags = async () => {
    try {
      const response = await fetch(buildApiUrl("hashtags/trending?limit=10"))
      if (response.ok) {
        const data = await response.json()
        setTrendingHashtags(data.data || [])
      }
    } catch (error) {
      console.error("Failed to load trending hashtags:", error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPhotos()
      return
    }

    try {
      setLoading(true)
      const response = await fetch(buildApiUrl(`photos?populate=*&filters[$or][0][caption][$containsi]=${searchQuery}&filters[$or][1][hashtags][name][$containsi]=${searchQuery}`))
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.data || [])
      }
    } catch (error) {
      console.error("Failed to search photos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoClick = (photo: Photo) => {
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const filteredPhotos = photos.filter((photo) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      photo.caption?.toLowerCase().includes(query) ||
      photo.hashtags?.some(tag => tag?.name?.toLowerCase().includes(query)) ||
      photo.author?.username?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Camera className="w-8 h-8 mr-3 text-blue-500" />
                Pattaya Pulse
              </h1>
              <p className="text-gray-600">Community-driven photo gallery showcasing authentic moments from Pattaya</p>
            </div>
            <div className="flex items-center space-x-2">
              {user && (
                <Button
                  onClick={() => window.location.href = '/photos/upload'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photos
                </Button>
              )}
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search photos, hashtags, or photographers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            
            {/* Sort Options */}
            <div className="flex gap-2">
              <Button
                variant={sortBy === "newest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("newest")}
              >
                <Clock className="w-4 h-4 mr-1" />
                Newest
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Popular
              </Button>
            </div>
          </div>

          {/* Trending Hashtags */}
          {trendingHashtags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Trending</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((hashtag) => (
                  <Button
                    key={hashtag.id}
                    variant={selectedHashtag === hashtag.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedHashtag(selectedHashtag === hashtag.name ? null : hashtag.name)}
                    className="text-xs"
                  >
                    #{hashtag.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* All Hashtags */}
          {hashtags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by hashtag</span>
                {selectedHashtag && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedHashtag(null)}
                    className="text-xs"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {hashtags.slice(0, 20).map((hashtag) => (
                  <Button
                    key={hashtag.id}
                    variant={selectedHashtag === hashtag.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedHashtag(selectedHashtag === hashtag.name ? null : hashtag.name)}
                    className="text-xs"
                  >
                    #{hashtag.name} ({hashtag.usage_count})
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sponsored Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sponsored By</h3>
          <p className="text-gray-600 text-sm">
            Support local businesses and discover amazing places in Pattaya through our community photos.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading photos...</p>
          </div>
        )}

        {/* Photo Grid */}
        {!loading && (
          <div
            className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
            }
          >
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                {viewMode === "grid" ? (
                  <>
                    <div className="relative" onClick={() => handlePhotoClick(photo)}>
                      <img
                        src={photo.image ? buildStrapiUrl(photo.image.url) : "/placeholder.svg"}
                        alt={photo.caption || "Pattaya photo"}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {photo.featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                          Featured
                        </Badge>
                      )}
                      {photo.sponsor_url && (
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                          Sponsored
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      {photo.caption && (
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{photo.caption}</p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{photo.author?.username || 'Anonymous'}</span>
                        </div>
                        <span>{formatTimeAgo(photo.uploaded_at || photo.createdAt || '')}</span>
                      </div>
                      {photo.location?.address && (
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{photo.location.address}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{photo.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="w-3 h-3" />
                            <span>{photo.views || 0}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {photo.hashtags?.slice(0, 2).map((hashtag) => (
                            <Badge key={hashtag.id} variant="secondary" className="text-xs">
                              #{hashtag?.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="flex p-4" onClick={() => handlePhotoClick(photo)}>
                    <img
                      src={photo.image ? buildStrapiUrl(photo.image.url) : "/placeholder.svg"}
                      alt={photo.caption || "Pattaya photo"}
                      className="w-32 h-24 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          {photo.caption && (
                            <h3 className="font-semibold mb-1">{photo.caption}</h3>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{photo.author?.username || 'Anonymous'}</span>
                            </div>
                            <span>{formatTimeAgo(photo.uploaded_at || photo.createdAt || '')}</span>
                            {photo.location?.address && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{photo.location?.address}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {photo.hashtags?.map((hashtag) => (
                              <Badge key={hashtag.id} variant="outline" className="text-xs">
                                #{hashtag?.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Heart className="w-3 h-3" />
                            <span>{photo.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Share2 className="w-3 h-3" />
                            <span>{photo.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            {user && (
              <Button onClick={() => window.location.href = '/photos/upload'}>
                <Camera className="w-4 h-4 mr-2" />
                Upload Your First Photo
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Floating Upload Button */}
      {user && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => window.location.href = '/photos/upload'}
            size="lg"
            className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Camera className="w-5 h-5 mr-2" />
            Upload
          </Button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-6xl max-h-[90vh] w-full mx-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Image */}
            <div className="relative">
              <img
                src={lightboxPhoto.image ? buildStrapiUrl(lightboxPhoto.image.url) : "/placeholder.svg"}
                alt={lightboxPhoto.caption || "Pattaya photo"}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Photo Info */}
            <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{lightboxPhoto.author?.username || 'Anonymous'}</span>
                </div>
                <span className="text-sm text-gray-500">{formatTimeAgo(lightboxPhoto.uploaded_at || lightboxPhoto.createdAt || '')}</span>
              </div>
              
              {lightboxPhoto.caption && (
                <p className="text-gray-700 mb-3">{lightboxPhoto.caption}</p>
              )}
              
              {lightboxPhoto.location?.address && (
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{lightboxPhoto.location.address}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{lightboxPhoto.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share2 className="w-4 h-4" />
                    <span>{lightboxPhoto.views}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {lightboxPhoto.hashtags?.map((hashtag) => (
                    <Badge key={hashtag.id} variant="secondary" className="text-xs">
                      #{hashtag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
