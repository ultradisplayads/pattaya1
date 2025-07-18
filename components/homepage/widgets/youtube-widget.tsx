"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Play, Pause, ThumbsUp, ThumbsDown, Search, TrendingUp, Eye, Heart, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    thumbnail: "/placeholder.svg?height=180&width=320",
    description: "Beautiful sunset views from Pattaya Beach",
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
    thumbnail: "/placeholder.svg?height=180&width=320",
    description: "Discover the most delicious street food in Pattaya",
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
    thumbnail: "/placeholder.svg?height=180&width=320",
    description: "Complete guide to Pattaya's vibrant nightlife scene",
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
    thumbnail: "/placeholder.svg?height=180&width=320",
    description: "Best accommodation options in Pattaya for every budget",
    views: 12300,
    likes: 789,
    dislikes: 18,
    tags: ["hotels", "pattaya", "accommodation", "travel"],
    duration: "6:30",
    channelName: "Travel Guide",
    publishedAt: "5 days ago",
  },
]

const trendingTags = ["pattaya", "beach", "nightlife", "food", "travel", "hotels", "sunset", "entertainment"]

export function YouTubeWidget() {
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(mockVideos)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [videos.length])

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    setSearchQuery(query)
    const filtered = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.description.toLowerCase().includes(query.toLowerCase()) ||
        video.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
    )
    setFilteredVideos(filtered)
  }

  // Handle like/dislike
  const handleLike = async (videoId: string) => {
    setVideos((prev) => prev.map((video) => (video.id === videoId ? { ...video, likes: video.likes + 1 } : video)))
    // In real app, make API call here
  }

  const handleDislike = async (videoId: string) => {
    setVideos((prev) =>
      prev.map((video) => (video.id === videoId ? { ...video, dislikes: video.dislikes + 1 } : video)),
    )
    // In real app, make API call here
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const promotedVideos = videos.filter((video) => video.promoted)
  const currentVideo = videos[currentCarouselIndex]

  return (
    <Card className="youtube-widget h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Play className="w-5 h-5 text-red-500" />
            YouTube Videos
            <Badge variant="secondary" className="ml-2">
              Live
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm">
            <TrendingUp className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search videos..."
            className="pl-10 h-8 text-sm"
          />
        </div>

        {/* Trending Tags */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Trending Tags</h4>
          <div className="flex flex-wrap gap-1">
            {trendingTags.slice(0, 6).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-1 cursor-pointer hover:bg-blue-50">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Video Carousel */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Featured Video</h4>
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <img
              src={currentVideo.thumbnail || "/placeholder.svg"}
              alt={currentVideo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white hover:bg-opacity-20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-black bg-opacity-70 text-white p-2 rounded text-xs">
                <div className="font-medium line-clamp-1">{currentVideo.title}</div>
                <div className="text-gray-300 flex items-center gap-2 mt-1">
                  <span className="truncate">{currentVideo.channelName}</span>
                  <span>•</span>
                  <span>{formatViews(currentVideo.views)} views</span>
                  <span>•</span>
                  <span className="truncate">{currentVideo.publishedAt}</span>
                </div>
              </div>
            </div>
            {currentVideo.promoted && (
              <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">Promoted</Badge>
            )}
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-center gap-1">
            {videos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentCarouselIndex ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => setCurrentCarouselIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">More Videos</h4>
          <div className="grid grid-cols-2 gap-2">
            {filteredVideos.slice(0, 4).map((video) => (
              <div key={video.id} className="group cursor-pointer">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video mb-1">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {video.duration}
                  </div>
                  {video.promoted && (
                    <Badge className="absolute top-1 left-1 bg-yellow-500 text-black text-xs">Promoted</Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-medium line-clamp-2 leading-tight">{video.title}</h5>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">{formatViews(video.views)} views</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(video.id)
                        }}
                        className="flex items-center gap-1 hover:text-blue-500"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{video.likes}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDislike(video.id)
                        }}
                        className="flex items-center gap-1 hover:text-red-500"
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>{video.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Video Analytics</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xs font-medium">{formatViews(videos.reduce((sum, v) => sum + v.views, 0))}</div>
              <div className="text-xs text-gray-500">Total Views</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-xs font-medium">{videos.reduce((sum, v) => sum + v.likes, 0)}</div>
              <div className="text-xs text-gray-500">Total Likes</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-xs font-medium">{videos.length}</div>
              <div className="text-xs text-gray-500">Videos</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
