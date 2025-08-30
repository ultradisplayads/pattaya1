"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { 
  Play, 
  Pause, 
  ThumbsUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Clock,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Video {
  id: string
  title: string
  thumbnail: string
  description: string
  views: number
  likes: number
  dislikes: number
  promoted?: boolean
  tags: string[]
  duration: string
  channelName: string
  publishedAt: string
}

const mockVideos: Video[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Pattaya Beach Sunset - Amazing Views",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Pattaya+Sunset",
    description: "Beautiful sunset views from Pattaya Beach with stunning ocean vistas",
    views: 15420,
    likes: 892,
    dislikes: 23,
    promoted: true,
    tags: ["pattaya", "beach", "sunset", "travel"],
    duration: "3:45",
    channelName: "Pattaya Explorer",
    publishedAt: "2 days ago",
  },
  {
    id: "jNQXAC9IVRw",
    title: "Best Street Food in Pattaya 2024",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Street+Food",
    description: "Discover the most delicious street food in Pattaya's local markets",
    views: 8750,
    likes: 654,
    dislikes: 12,
    tags: ["food", "pattaya", "street food", "thai cuisine"],
    duration: "8:22",
    channelName: "Food Adventures",
    publishedAt: "1 week ago",
  },
  {
    id: "M7lc1UVf-VE",
    title: "Pattaya Nightlife Guide 2024",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Nightlife",
    description: "Complete guide to Pattaya's vibrant nightlife scene and entertainment",
    views: 23100,
    likes: 1205,
    dislikes: 45,
    promoted: true,
    tags: ["nightlife", "pattaya", "entertainment", "bars"],
    duration: "12:15",
    channelName: "Night Explorer",
    publishedAt: "3 days ago",
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Top 10 Hotels in Pattaya",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Hotels",
    description: "Best accommodation options in Pattaya for every budget and preference",
    views: 12300,
    likes: 789,
    dislikes: 18,
    tags: ["hotels", "pattaya", "accommodation", "travel"],
    duration: "6:30",
    channelName: "Travel Guide",
    publishedAt: "5 days ago",
  },
  {
    id: "abc123def",
    title: "Water Sports Adventure in Pattaya",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Water+Sports",
    description: "Exciting water sports activities and adventures in Pattaya",
    views: 8900,
    likes: 567,
    dislikes: 15,
    tags: ["water sports", "adventure", "pattaya", "activities"],
    duration: "5:15",
    channelName: "Adventure Zone",
    publishedAt: "4 days ago",
  },
  {
    id: "xyz789ghi",
    title: "Pattaya Temple Tour - Cultural Experience",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Temples",
    description: "Explore the beautiful temples and cultural sites of Pattaya",
    views: 6700,
    likes: 423,
    dislikes: 8,
    tags: ["temples", "culture", "pattaya", "tourism"],
    duration: "7:45",
    channelName: "Cultural Explorer",
    publishedAt: "1 week ago",
  },
]

const trendingTags = ["pattaya", "beach", "nightlife", "food", "travel", "hotels", "sunset", "entertainment"]

export function YouTubeWidget() {
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
    setIsPlaying(true)
    // In a real app, you would open the video player or navigate to YouTube
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
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
                onClick={() => handleVideoClick(video.id)}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
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
                      <span>{formatNumber(video.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{formatNumber(video.likes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{formatNumber(video.likes / 10)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Videos Section */}
        {videos.length > 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">More Videos</h3>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0"
                  onClick={scrollLeft}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-8 h-8 p-0"
                  onClick={scrollRight}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {videos.slice(2).map((video) => (
                <div
                  key={video.id}
                  className="group cursor-pointer flex-shrink-0 w-64 bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 text-gray-800 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="font-medium text-gray-700">{video.channelName}</span>
                      <span>{video.publishedAt}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(video.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{formatNumber(video.likes)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Trending</h3>
          <div className="flex flex-wrap gap-1">
            {trendingTags.slice(0, 6).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                #{tag}
              </Badge>
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
