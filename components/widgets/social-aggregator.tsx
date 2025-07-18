"use client"

import { useState, useEffect } from "react"
import { Hash, Heart, MessageCircle, Share, ExternalLink, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SocialAggregatorProps {
  theme: "primary" | "nightlife"
}

interface SocialPost {
  id: string
  platform: "twitter" | "instagram" | "facebook" | "tiktok"
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

export function SocialAggregator({ theme }: SocialAggregatorProps) {
  const isPrimary = theme === "primary"
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [selectedHashtag, setSelectedHashtag] = useState("")

  useEffect(() => {
    loadSocialPosts()
    const interval = setInterval(loadSocialPosts, 120000) // Refresh every 2 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Load Curator.io script
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.async = true
    script.charset = "UTF-8"
    script.src = "https://cdn.curator.io/published/800017a1-07e7-4a2d-bb2b-62294df9d279.js"

    const firstScript = document.getElementsByTagName("script")[0]
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript)
    }

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(
        'script[src="https://cdn.curator.io/published/800017a1-07e7-4a2d-bb2b-62294df9d279.js"]',
      )
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, [])

  const loadSocialPosts = async () => {
    try {
      const response = await fetch("/api/social/aggregated")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error("Failed to load social posts:", error)
      setPosts(getFallbackPosts())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackPosts = (): SocialPost[] => [
    {
      id: "1",
      platform: "instagram",
      author: "Pattaya Explorer",
      username: "@pattayaexplorer",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Sunset vibes at Pattaya Beach never get old! 🌅 Perfect evening for a beach walk #PattayaLife #Sunset",
      image: "/placeholder.svg?height=200&width=300&text=Sunset+Beach",
      timestamp: "2024-01-15T18:30:00Z",
      likes: 234,
      comments: 18,
      shares: 12,
      hashtags: ["PattayaLife", "Sunset", "Beach", "Thailand"],
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
      content:
        "Just discovered this amazing street food stall in Pattaya! Best som tam I've had in years 🥗 #StreetFood #Pattaya",
      timestamp: "2024-01-15T16:45:00Z",
      likes: 89,
      comments: 23,
      shares: 15,
      hashtags: ["StreetFood", "Pattaya", "SomTam", "ThaiFood"],
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
      content:
        "Walking Street at night hits different! The energy here is incredible 🌃 #WalkingStreet #PattayaNightlife",
      image: "/placeholder.svg?height=200&width=300&text=Walking+Street",
      timestamp: "2024-01-15T14:20:00Z",
      likes: 456,
      comments: 67,
      shares: 89,
      hashtags: ["WalkingStreet", "PattayaNightlife", "Thailand", "Travel"],
      location: "Walking Street",
      verified: true,
      trending: true,
    },
    {
      id: "4",
      platform: "facebook",
      author: "Pattaya Events",
      username: "pattayaevents",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Don't miss the floating market tour this weekend! Traditional Thai culture at its finest 🛶 #FloatingMarket #Culture",
      image: "/placeholder.svg?height=200&width=300&text=Floating+Market",
      timestamp: "2024-01-15T12:15:00Z",
      likes: 123,
      comments: 34,
      shares: 28,
      hashtags: ["FloatingMarket", "Culture", "Weekend", "Pattaya"],
      location: "Damnoen Saduak",
      verified: true,
      trending: false,
    },
    {
      id: "5",
      platform: "instagram",
      author: "Beach Life Pattaya",
      username: "@beachlifepattaya",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Morning yoga session by the beach 🧘‍♀️ Starting the day right in paradise #YogaLife #BeachYoga #Wellness",
      image: "/placeholder.svg?height=200&width=300&text=Beach+Yoga",
      timestamp: "2024-01-15T07:30:00Z",
      likes: 178,
      comments: 12,
      shares: 8,
      hashtags: ["YogaLife", "BeachYoga", "Wellness", "Pattaya"],
      location: "Jomtien Beach",
      verified: false,
      trending: false,
    },
  ]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === "all" || post.platform === selectedPlatform
    const matchesHashtag =
      !selectedHashtag || post.hashtags.some((tag) => tag.toLowerCase().includes(selectedHashtag.toLowerCase()))
    return matchesSearch && matchesPlatform && matchesHashtag
  })

  const allHashtags = [...new Set(posts.flatMap((post) => post.hashtags))].slice(0, 10)

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "🐦"
      case "instagram":
        return "📸"
      case "facebook":
        return "👥"
      case "tiktok":
        return "🎵"
      default:
        return "📱"
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "bg-blue-500"
      case "instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "facebook":
        return "bg-blue-600"
      case "tiktok":
        return "bg-black"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  const handleViewAll = () => {
    window.location.href = "/social"
  }

  if (loading) {
    return (
      <Card
        className={`transition-all duration-300 ${
          isPrimary
            ? "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200"
            : "bg-gradient-to-br from-purple-800 to-pink-800 border-pink-500/30"
        }`}
      >
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className={`h-6 rounded ${isPrimary ? "bg-pink-200" : "bg-purple-600"}`}></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={`h-4 rounded ${isPrimary ? "bg-pink-100" : "bg-purple-700"}`}></div>
                <div className={`h-16 rounded ${isPrimary ? "bg-pink-100" : "bg-purple-700"}`}></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`transition-all duration-500 hover:scale-105 cursor-pointer ${
        isPrimary
          ? "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 hover:shadow-xl hover:shadow-pink-200/50"
          : "bg-gradient-to-br from-purple-800 to-pink-800 border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/30"
      }`}
      onClick={handleViewAll}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className={`flex items-center justify-between text-lg ${isPrimary ? "text-pink-800" : "text-white"}`}
        >
          <div className="flex items-center space-x-2">
            <Hash className="h-5 w-5" />
            <span>Social Buzz</span>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white animate-pulse"
            >
              Live
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              loadSocialPosts()
            }}
            className={`h-6 w-6 ${isPrimary ? "hover:bg-pink-200" : "hover:bg-purple-700"}`}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex space-x-2">
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 h-8 text-xs ${
                isPrimary ? "bg-white/60 border-pink-200" : "bg-purple-900/50 border-pink-400/30 text-white"
              }`}
            />
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger
                className={`w-20 h-8 text-xs ${
                  isPrimary ? "bg-white/60 border-pink-200" : "bg-purple-900/50 border-pink-400/30 text-white"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="instagram">📸 IG</SelectItem>
                <SelectItem value="twitter">🐦 X</SelectItem>
                <SelectItem value="facebook">👥 FB</SelectItem>
                <SelectItem value="tiktok">🎵 TT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trending Hashtags */}
          <div className="flex flex-wrap gap-1">
            {allHashtags.slice(0, 5).map((hashtag) => (
              <button
                key={hashtag}
                onClick={() => setSelectedHashtag(hashtag === selectedHashtag ? "" : hashtag)}
                className={`text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                  selectedHashtag === hashtag
                    ? isPrimary
                      ? "bg-pink-500 text-white"
                      : "bg-pink-400 text-white"
                    : isPrimary
                      ? "bg-pink-100 text-pink-700 hover:bg-pink-200"
                      : "bg-purple-700/50 text-purple-200 hover:bg-purple-600/50"
                }`}
              >
                #{hashtag}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredPosts.slice(0, 6).map((post) => (
            <div
              key={post.id}
              className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                isPrimary ? "bg-white/70 hover:bg-white/90" : "bg-purple-900/50 hover:bg-purple-900/70"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                // Open social post in new tab
              }}
            >
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs ${getPlatformColor(post.platform)}`}
                    >
                      <span className="text-white text-xs">{getPlatformIcon(post.platform)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium text-sm ${isPrimary ? "text-pink-900" : "text-white"}`}>
                      {post.author}
                    </span>
                    {post.verified && <span className="text-blue-500">✓</span>}
                    <span className={`text-xs ${isPrimary ? "text-pink-600" : "text-purple-300"}`}>
                      {post.username}
                    </span>
                    <span className={`text-xs ${isPrimary ? "text-pink-500" : "text-purple-400"}`}>
                      {formatTimeAgo(post.timestamp)}
                    </span>
                    {post.trending && (
                      <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                        <TrendingUp className="h-2 w-2 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>

                  <p className={`text-sm mb-2 ${isPrimary ? "text-pink-800" : "text-purple-100"}`}>{post.content}</p>

                  {post.image && (
                    <div className="mb-2">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post content"
                        className="w-full h-20 object-cover rounded"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        className={`flex items-center space-x-1 text-xs ${
                          isPrimary ? "text-pink-600 hover:text-pink-800" : "text-purple-300 hover:text-pink-300"
                        }`}
                      >
                        <Heart className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </button>
                      <button
                        className={`flex items-center space-x-1 text-xs ${
                          isPrimary ? "text-pink-600 hover:text-pink-800" : "text-purple-300 hover:text-pink-300"
                        }`}
                      >
                        <MessageCircle className="h-3 w-3" />
                        <span>{post.comments}</span>
                      </button>
                      <button
                        className={`flex items-center space-x-1 text-xs ${
                          isPrimary ? "text-pink-600 hover:text-pink-800" : "text-purple-300 hover:text-pink-300"
                        }`}
                      >
                        <Share className="h-3 w-3" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                    {post.location && (
                      <span className={`text-xs ${isPrimary ? "text-pink-500" : "text-purple-400"}`}>
                        📍 {post.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Curator.io Social Feed */}
        <div className="mt-6 pt-4 border-t border-pink-200/30">
          <h3 className={`text-sm font-semibold mb-3 ${isPrimary ? "text-pink-800" : "text-white"}`}>
            Live Social Feed
          </h3>
          <div
            id="curator-feed-default-feed-layout"
            className={`rounded-lg overflow-hidden ${isPrimary ? "bg-white/50" : "bg-purple-900/30"}`}
            style={{ minHeight: "200px" }}
          >
            <a
              href="https://curator.io"
              target="_blank"
              rel="noopener noreferrer"
              className="crt-logo crt-tag text-xs opacity-70 hover:opacity-100 transition-opacity"
            >
              Powered by Curator.io
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
