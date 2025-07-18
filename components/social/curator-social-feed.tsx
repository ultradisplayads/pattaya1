"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ExternalLink, Heart, MessageCircle, Share, MapPin, Clock } from "lucide-react"

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

export function CuratorSocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSocialPosts()
  }, [])

  const fetchSocialPosts = async () => {
    try {
      const response = await fetch("/api/social/aggregated")
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Failed to fetch social posts:", error)
      // Use fallback data
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
      content:
        "Sunset vibes at Pattaya Beach never get old! 🌅 Perfect evening for a beach walk and some amazing street food.",
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
      content: "Just discovered this amazing street food stall in Pattaya! Best som tam I've had in years 🥗",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 89,
      comments: 23,
      shares: 15,
      hashtags: ["StreetFood", "Pattaya", "SomTam"],
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
      content: "Walking Street at night hits different! The energy here is incredible 🌃",
      image: "/placeholder.svg?height=200&width=300&text=Walking+Street",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: 456,
      comments: 67,
      shares: 89,
      hashtags: ["WalkingStreet", "PattayaNightlife"],
      location: "Walking Street",
      verified: true,
      trending: true,
    },
  ]

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "twitter":
        return "bg-blue-500"
      case "tiktok":
        return "bg-black"
      case "facebook":
        return "bg-blue-600"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Social Feed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Social Feed
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Live
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSocialPosts}
              className="text-purple-600 hover:text-purple-800"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">
            Stay connected with the latest social media posts from around Pattaya. See what's trending, discover new
            places, and connect with the community.
          </p>
        </CardContent>
      </Card>

      {/* Social Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.avatar || "/placeholder.svg"}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm">{post.author}</h4>
                      {post.verified && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          ✓
                        </Badge>
                      )}
                      <Badge className={`text-xs text-white ${getPlatformColor(post.platform)}`}>{post.platform}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">{post.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(post.timestamp)}</span>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-3">
                <p className="text-sm text-gray-800 mb-2">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Post content"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Location */}
              {post.location && (
                <div className="flex items-center space-x-1 mb-3">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{post.location}</span>
                </div>
              )}

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.hashtags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
                    <Share className="h-4 w-4" />
                    <span className="text-xs">{post.shares}</span>
                  </button>
                </div>
                {post.trending && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                    🔥 Trending
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Native social media aggregation</span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
