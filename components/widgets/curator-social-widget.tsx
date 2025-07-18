"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ExternalLink, Hash, Users, Heart, MessageCircle, Shield, Sparkles } from "lucide-react"

interface SocialPost {
  id: string
  platform: string
  author: string
  username: string
  avatar: string
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  hashtags: string[]
  location?: string
  verified: boolean
  trending: boolean
}

interface CuratorSocialWidgetProps {
  theme?: "primary" | "nightlife"
}

export function CuratorSocialWidget({ theme = "primary" }: CuratorSocialWidgetProps) {
  const isPrimary = theme === "primary"
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
  })

  useEffect(() => {
    loadSocialFeed()
  }, [])

  const loadSocialFeed = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/social/aggregated")
      const data = await response.json()
      setPosts(data.posts?.slice(0, 3) || [])

      // Calculate stats
      const totalPosts = data.posts?.length || 0
      const totalLikes = data.posts?.reduce((sum: number, post: SocialPost) => sum + post.likes, 0) || 0
      const totalComments = data.posts?.reduce((sum: number, post: SocialPost) => sum + post.comments, 0) || 0

      setStats({ totalPosts, totalLikes, totalComments })
    } catch (error) {
      console.error("Failed to load social feed:", error)
      // Use fallback data
      const fallbackPosts = getFallbackPosts()
      setPosts(fallbackPosts.slice(0, 3))
      setStats({
        totalPosts: fallbackPosts.length,
        totalLikes: fallbackPosts.reduce((sum, post) => sum + post.likes, 0),
        totalComments: fallbackPosts.reduce((sum, post) => sum + post.comments, 0),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getFallbackPosts = (): SocialPost[] => [
    {
      id: "1",
      platform: "instagram",
      author: "Pattaya Explorer",
      username: "@pattayaexplorer",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Sunset vibes at Pattaya Beach never get old! 🌅",
      image: "/placeholder.svg?height=200&width=300&text=Sunset+Beach",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      likes: 234,
      comments: 18,
      shares: 12,
      hashtags: ["PattayaLife", "Sunset", "Beach"],
      location: "Pattaya Beach",
      verified: true,
      trending: true,
    },
    {
      id: "2",
      platform: "twitter",
      author: "Foodie in Thailand",
      username: "@thaifoodie",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Best som tam I've had in years 🥗",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 89,
      comments: 23,
      shares: 15,
      hashtags: ["StreetFood", "Pattaya"],
      location: "Thepprasit Market",
      verified: false,
      trending: false,
    },
    {
      id: "3",
      platform: "tiktok",
      author: "Travel with Mike",
      username: "@travelwithmike",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Walking Street energy is incredible! 🌃",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: 456,
      comments: 67,
      shares: 89,
      hashtags: ["WalkingStreet", "Nightlife"],
      location: "Walking Street",
      verified: true,
      trending: true,
    },
  ]

  const refreshFeed = async () => {
    await loadSocialFeed()
  }

  const handleViewAll = () => {
    window.location.href = "/social"
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "from-purple-500 to-pink-500"
      case "twitter":
        return "from-blue-400 to-blue-600"
      case "tiktok":
        return "from-gray-800 to-black"
      case "facebook":
        return "from-blue-500 to-blue-700"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  return (
    <Card
      className={`h-full transition-all duration-500 hover:scale-105 cursor-pointer widget-card glow-border ${
        isPrimary
          ? "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-pink-200 hover:shadow-xl hover:shadow-pink-200/50"
          : "bg-gradient-to-br from-purple-800 via-pink-800 to-red-800 border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/30"
      }`}
      onClick={handleViewAll}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className={`flex items-center justify-between text-lg ${isPrimary ? "text-pink-800" : "text-white"}`}
        >
          <div className="flex items-center space-x-2">
            <Hash className="h-5 w-5 animate-pulse" />
            <span>Social Feed</span>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white animate-pulse"
            >
              Live
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-500 animate-pulse" />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                refreshFeed()
              }}
              disabled={isLoading}
              className={`h-6 w-6 ${isPrimary ? "hover:bg-pink-200" : "hover:bg-purple-700"}`}
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                window.open("/social", "_blank")
              }}
              className={`h-6 w-6 ${isPrimary ? "hover:bg-pink-200" : "hover:bg-purple-700"}`}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Moderation Status */}
        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-purple-700">Native + Gemini AI</span>
          </div>
          <Badge variant="outline" className="text-xs border-green-500 text-green-700">
            Filtering: Pattaya Content
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
          <div
            className={`text-center p-2 rounded-lg ${
              isPrimary ? "bg-white/60" : "bg-purple-900/50"
            } animate-bounce-subtle`}
          >
            <Users className={`h-4 w-4 mx-auto mb-1 ${isPrimary ? "text-pink-600" : "text-pink-300"}`} />
            <div className={`text-xs font-bold ${isPrimary ? "text-pink-800" : "text-white"}`}>{stats.totalPosts}</div>
            <div className={`text-xs ${isPrimary ? "text-pink-600" : "text-purple-300"}`}>Posts</div>
          </div>
          <div
            className={`text-center p-2 rounded-lg ${
              isPrimary ? "bg-white/60" : "bg-purple-900/50"
            } animate-bounce-subtle`}
            style={{ animationDelay: "0.1s" }}
          >
            <Heart className={`h-4 w-4 mx-auto mb-1 text-red-500 animate-pulse`} />
            <div className={`text-xs font-bold ${isPrimary ? "text-pink-800" : "text-white"}`}>
              {stats.totalLikes.toLocaleString()}
            </div>
            <div className={`text-xs ${isPrimary ? "text-pink-600" : "text-purple-300"}`}>Likes</div>
          </div>
          <div
            className={`text-center p-2 rounded-lg ${
              isPrimary ? "bg-white/60" : "bg-purple-900/50"
            } animate-bounce-subtle`}
            style={{ animationDelay: "0.2s" }}
          >
            <MessageCircle className={`h-4 w-4 mx-auto mb-1 ${isPrimary ? "text-blue-500" : "text-blue-300"}`} />
            <div className={`text-xs font-bold ${isPrimary ? "text-pink-800" : "text-white"}`}>
              {stats.totalComments}
            </div>
            <div className={`text-xs ${isPrimary ? "text-pink-600" : "text-purple-300"}`}>Comments</div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <div
                className={`animate-spin rounded-full h-8 w-8 border-b-2 mx-auto ${
                  isPrimary ? "border-pink-600" : "border-pink-400"
                }`}
              ></div>
              <p className={`text-sm ${isPrimary ? "text-pink-600" : "text-purple-300"}`}>Loading social feed...</p>
            </div>
          </div>
        )}

        {/* Native Social Feed */}
        {!isLoading && (
          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
            {posts.map((post) => (
              <div
                key={post.id}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  isPrimary ? "bg-white/50 hover:bg-white/70" : "bg-purple-900/30 hover:bg-purple-900/50"
                }`}
              >
                <div className="flex items-start space-x-2">
                  <img
                    src={post.avatar || "/placeholder.svg"}
                    alt={post.author}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-semibold truncate ${isPrimary ? "text-gray-800" : "text-white"}`}>
                        {post.author}
                      </span>
                      <Badge
                        className={`text-xs px-1 py-0 bg-gradient-to-r ${getPlatformColor(post.platform)} text-white`}
                      >
                        {post.platform}
                      </Badge>
                      <span className={`text-xs ${isPrimary ? "text-gray-500" : "text-purple-300"}`}>
                        {formatTimeAgo(post.timestamp)}
                      </span>
                    </div>
                    <p className={`text-xs mb-2 line-clamp-2 ${isPrimary ? "text-gray-700" : "text-purple-100"}`}>
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-3 text-xs">
                      <span
                        className={`flex items-center space-x-1 ${isPrimary ? "text-gray-500" : "text-purple-300"}`}
                      >
                        <Heart className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </span>
                      <span
                        className={`flex items-center space-x-1 ${isPrimary ? "text-gray-500" : "text-purple-300"}`}
                      >
                        <MessageCircle className="h-3 w-3" />
                        <span>{post.comments}</span>
                      </span>
                      {post.trending && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs px-1 py-0">
                          🔥
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-pink-200/30">
          <span className={`text-xs ${isPrimary ? "text-pink-600" : "text-purple-300"}`}>
            Native social aggregation
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleViewAll()
            }}
            className={`text-xs h-6 px-2 ${
              isPrimary
                ? "text-pink-600 hover:text-pink-800 hover:bg-pink-100"
                : "text-purple-300 hover:text-pink-300 hover:bg-purple-700"
            }`}
          >
            View All →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
