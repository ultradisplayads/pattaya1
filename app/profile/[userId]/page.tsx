"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Heart, Eye, User, MapPin, Clock, ArrowLeft } from "lucide-react"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: number
  username: string
  email: string
  role?: string
  createdAt: string
}

interface UserPhoto {
  id: number
  caption?: string
  image: {
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
  hashtags: Array<{
    id: number
    name: string
    slug: string
    color?: string
  }>
  location: {
    latitude: number
    longitude: number
    address?: string
    city?: string
    country: string
  }
  likes: number
  views: number
  width: number
  height: number
  orientation: 'portrait' | 'landscape' | 'square'
  sponsor_url?: string
  featured: boolean
  uploaded_at: string
  approved_at?: string
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  
  const [user, setUser] = useState<UserProfile | null>(null)
  const [photos, setPhotos] = useState<UserPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (userId) {
      loadUserProfile()
      loadUserPhotos()
    }
  }, [userId])

  const loadUserProfile = async () => {
    try {
      const response = await fetch(buildApiUrl(`users/${userId}`))
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setError("User not found")
      }
    } catch (error) {
      console.error("Failed to load user profile:", error)
      setError("Failed to load user profile")
    }
  }

  const loadUserPhotos = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl(`photos?filters[author][id][$eq]=${userId}&populate=*&sort=uploaded_at:desc`))
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.data || [])
      }
    } catch (error) {
      console.error("Failed to load user photos:", error)
    } finally {
      setLoading(false)
    }
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

  const getTotalLikes = () => {
    return photos.reduce((total, photo) => total + photo.likes, 0)
  }

  const getTotalViews = () => {
    return photos.reduce((total, photo) => total + photo.views, 0)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/photos')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Photos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/photos')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Photos
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-600">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                {user.role && (
                  <Badge variant="secondary" className="mt-1">
                    {user.role}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{photos.length}</div>
                <div className="text-sm text-gray-600">Photos</div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{photos.length}</div>
                <div className="text-sm text-gray-600">Photos</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{getTotalLikes()}</div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-gray-900">{getTotalViews()}</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading photos...</p>
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="relative" onClick={() => router.push(`/photos?photo=${photo.id}`)}>
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
                    <span>{formatTimeAgo(photo.uploaded_at)}</span>
                    {photo.location.address && (
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{photo.location.address}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{photo.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{photo.views}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {photo.hashtags.slice(0, 2).map((hashtag) => (
                        <Badge key={hashtag.id} variant="secondary" className="text-xs">
                          #{hashtag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-600">This user hasn't uploaded any photos to Pattaya Pulse yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
