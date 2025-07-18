"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Repeat2, Share, MapPin, CheckCircle, ExternalLink } from "lucide-react"

interface SocialPost {
  id: string
  platform: "twitter" | "threads" | "instagram" | "bluesky"
  author: string
  handle: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  location?: string
  verified?: boolean
  hashtags: string[]
  image?: string
}

export function SocialFeedWidget() {
  const [currentPost, setCurrentPost] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const socialPosts: SocialPost[] = [
    {
      id: "1",
      platform: "twitter",
      author: "Pattaya Explorer",
      handle: "@pattayaexplorer",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Just discovered this amazing rooftop bar in Central Pattaya! The sunset views are incredible 🌅 #PattayaNightlife #Thailand",
      timestamp: "2m",
      likes: 124,
      comments: 18,
      shares: 32,
      location: "Central Pattaya",
      verified: true,
      hashtags: ["#PattayaNightlife", "#Thailand"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      platform: "instagram",
      author: "Jomtien Beach Life",
      handle: "@jomtienbeachlife",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Morning yoga session at Jomtien Beach 🧘‍♀️ Perfect way to start the day! The water is crystal clear today ✨",
      timestamp: "15m",
      likes: 89,
      comments: 12,
      shares: 8,
      location: "Jomtien Beach",
      verified: false,
      hashtags: ["#JomtienBeach", "#Yoga", "#MorningVibes"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      platform: "threads",
      author: "Pattaya Foodie",
      handle: "@pattayafoodie",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "This street food vendor near Walking Street serves the BEST pad thai I've ever had! 🍜 Only 60 baht too!",
      timestamp: "32m",
      likes: 156,
      comments: 24,
      shares: 19,
      location: "Walking Street",
      verified: true,
      hashtags: ["#PattayaFood", "#StreetFood", "#PadThai"],
    },
    {
      id: "4",
      platform: "bluesky",
      author: "Digital Nomad Pattaya",
      handle: "@nomadpattaya.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Working from this co-working space in Pattaya with fiber internet and amazing coffee ☕ Perfect for remote work!",
      timestamp: "1h",
      likes: 67,
      comments: 9,
      shares: 15,
      location: "Central Pattaya",
      verified: false,
      hashtags: ["#DigitalNomad", "#RemoteWork", "#Pattaya"],
    },
    {
      id: "5",
      platform: "twitter",
      author: "Pattaya Events",
      handle: "@pattayaevents",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "🎉 TONIGHT: Beach party at Bali Hai Pier! Live DJ, fire shows, and amazing cocktails. Starts at 8PM! #PattayaParty",
      timestamp: "2h",
      likes: 203,
      comments: 45,
      shares: 78,
      location: "Bali Hai Pier",
      verified: true,
      hashtags: ["#PattayaParty", "#BeachParty", "#Tonight"],
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentPost((prev) => (prev + 1) % socialPosts.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [socialPosts.length])

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "bg-blue-500 text-white"
      case "threads":
        return "bg-black text-white"
      case "instagram":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "bluesky":
        return "bg-sky-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "𝕏"
      case "threads":
        return "@"
      case "instagram":
        return "📷"
      case "bluesky":
        return "🦋"
      default:
        return "📱"
    }
  }

  const post = socialPosts[currentPost]

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Social Feed
          </div>
          <div className="flex space-x-1">
            {socialPosts.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentPost ? "bg-blue-500 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div
          className={`transition-all duration-300 ${isAnimating ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"}`}
        >
          {/* Platform Badge */}
          <div className="flex items-center justify-between mb-3">
            <Badge className={`${getPlatformColor(post.platform)} px-2 py-1 text-xs font-medium animate-pulse`}>
              {getPlatformIcon(post.platform)} {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
            </Badge>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Author Info */}
          <div className="flex items-center mb-3">
            <img
              src={post.avatar || "/placeholder.svg"}
              alt={post.author}
              className="w-8 h-8 rounded-full mr-3 ring-2 ring-blue-200 hover:ring-blue-400 transition-all duration-200"
            />
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-900">{post.author}</span>
                {post.verified && <CheckCircle className="w-3 h-3 text-blue-500 ml-1" />}
              </div>
              <span className="text-xs text-gray-500">{post.handle}</span>
            </div>
            <span className="text-xs text-gray-400">{post.timestamp}</span>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">{post.content}</p>

          {/* Location */}
          {post.location && (
            <div className="flex items-center mb-3 text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1 text-red-400" />
              {post.location}
            </div>
          )}

          {/* Image */}
          {post.image && (
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post content"
              className="w-full h-20 object-cover rounded-lg mb-3 hover:scale-105 transition-transform duration-200"
            />
          )}

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {post.hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Engagement */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center hover:text-red-500 cursor-pointer transition-colors duration-200">
                <Heart className="w-3 h-3 mr-1" />
                {post.likes}
              </div>
              <div className="flex items-center hover:text-blue-500 cursor-pointer transition-colors duration-200">
                <MessageCircle className="w-3 h-3 mr-1" />
                {post.comments}
              </div>
              <div className="flex items-center hover:text-green-500 cursor-pointer transition-colors duration-200">
                <Repeat2 className="w-3 h-3 mr-1" />
                {post.shares}
              </div>
            </div>
            <Share className="w-3 h-3 hover:text-blue-500 cursor-pointer transition-colors duration-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
