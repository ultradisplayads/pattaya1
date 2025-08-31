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
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"

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
      const response = await fetch(buildApiUrl("youtube-videos?populate=*"))
      
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
      <Card className="h-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-100 rounded-full w-32"></div>
            <div className="h-4 bg-gray-100 rounded-full w-16"></div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-100 rounded-full w-20"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-32 bg-gray-100 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
                    <div className="h-3 bg-gray-100 rounded-full w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (videos.length === 0) {
    return (
      <Card className="h-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 px-6 pt-6">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center mr-3">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
              <span>Featured Videos</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="text-center text-gray-500 py-8 font-medium">
            No videos available at the moment.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="pb-3 px-6 pt-6 flex-shrink-0">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center mr-3">
              <Play className="w-4 h-4 text-white fill-current" />
            </div>
            <span>Featured Videos</span>
          </div>
          <Badge className="text-xs font-medium bg-gray-50 text-gray-600 border-0">
            {videos.length} Videos
          </Badge>
        </CardTitle>
      </CardHeader>
    
      <CardContent className="px-6 pb-6 space-y-6 flex-1 overflow-y-auto widget-content">
        {/* Featured Video Section - Shows first 2 videos */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Featured</h3>
          <div className="space-y-4">
            {videos.slice(0, 2).map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:bg-white border border-gray-100 hover:shadow-sm transition-all duration-200"
                onClick={() => handleVideoClick(video.videoId)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnailUrl ? buildStrapiUrl(video.thumbnailUrl) : "https://via.placeholder.com/320x180/1f2937/ffffff?text=Pattaya+Video"}
                    alt={video.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white bg-opacity-95 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-5 h-5 text-gray-800 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-lg font-medium">
                    {video.duration}
                  </div>
                  {video.promoted && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500 text-white text-xs font-medium rounded-full border-0">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Promoted
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-3 group-hover:text-red-600 transition-colors leading-tight">
                    {video.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="font-medium text-gray-700">{video.channelName}</span>
                    <span className="font-medium">{video.publishedAt}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2 font-medium">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(video.viewCount)}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{formatNumber(video.likeCount)}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
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
          className="w-full text-xs font-medium bg-white border-gray-200 hover:bg-gray-50 transition-colors"
          onClick={() => window.open('https://www.youtube.com/results?search_query=pattaya', '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-2" />
          View All Pattaya Videos
        </Button>
      </CardContent>
    </Card>
  )
}
