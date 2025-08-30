"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { 
  Play, 
  ThumbsUp, 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StrapiYouTubeVideo {
  id: number
  title: string
  description: string
  videoId: string
  thumbnailUrl: string | null
  duration: string
  viewCount: number
  likeCount: number
  publishedAt: string
  channelName: string
  category: string
  promoted: boolean
  featured: boolean
  comments: number
}

export function YouTubeWidget() {
  const [videos, setVideos] = useState<StrapiYouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
    const interval = setInterval(fetchVideos, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:1337/api/youtube-videos?populate=*")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('YouTube videos data received:', data)
      
      if (data.data && Array.isArray(data.data)) {
        const mappedData = data.data.map((item: any) => ({
          id: item.id,
          title: item.Title,
          description: item.Description,
          videoId: item.VideoId,
          thumbnailUrl: item.Thumbnail,
          duration: item.Duration,
          viewCount: item.Views,
          likeCount: item.Likes,
          publishedAt: item.publishedAt,
          channelName: item.ChannelName,
          category: item.Category,
          promoted: item.Promoted,
          featured: item.Featured,
          comments: item.Comments,
        }))
        setVideos(mappedData)
      } else {
        console.warn('No YouTube videos data found or invalid format')
        setVideos([])
      }
    } catch (error) {
      console.error("Failed to fetch YouTube videos from Strapi:", error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) {
      return '0'
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 gap-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (videos.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-current" />
            </div>
            <span>Featured Videos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-center text-gray-500 py-8">
            No videos available at the moment.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-current" />
            </div>
            <span>Featured Videos</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {videos.length} Videos
          </Badge>
        </CardTitle>
      </CardHeader>
    
      <CardContent className="p-4 pt-0 space-y-4 flex-1 overflow-y-auto widget-content">
        {/* Featured Video Section - Shows first 2 videos */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Featured</h3>
          <div className="grid grid-cols-1 gap-3">
            {videos.slice(0, 2).map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                onClick={() => handleVideoClick(video.videoId)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnailUrl ? `http://localhost:1337${video.thumbnailUrl}` : "https://via.placeholder.com/320x180/1f2937/ffffff?text=Pattaya+Video"}
                    alt={video.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-gray-800 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  {video.promoted && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-orange-500 text-white text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Promoted
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">{video.channelName}</span>
                    <span>{video.publishedAt}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(video.viewCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{formatNumber(video.likeCount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{formatNumber(video.comments)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs"
          onClick={() => window.open('https://www.youtube.com/results?search_query=pattaya', '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-2" />
          View All Pattaya Videos
        </Button>
      </CardContent>
    </Card>
  )
}
