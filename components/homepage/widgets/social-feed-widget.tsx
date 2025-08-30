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
        return "bg-slate-900 text-white"
      case "threads":
        return "bg-neutral-900 text-white"
      case "instagram":
        return "bg-gradient-to-r from-slate-800 to-slate-600 text-white"
      case "bluesky":
        return "bg-sky-700 text-white"
      default:
        return "bg-slate-700 text-white"
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
    <Card className="h-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-1 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-slate-900 tracking-wide">
            Social Feed
          </CardTitle>
          <div className="flex items-center space-x-1">
            <div className="flex space-x-0.5">
            {socialPosts.map((_, index) => (
              <div
                key={index}
                  className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    index === currentPost ? "bg-slate-600" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-2">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Platform Badge */}
          <div className="flex items-center justify-between mb-2">
            <Badge 
              className={`${getPlatformColor(post.platform)} px-1.5 py-0.5 text-xs font-medium tracking-wide rounded-full`}
            >
              {getPlatformIcon(post.platform)} {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
            </Badge>
            <button className="text-slate-400 hover:text-slate-600 transition-colors duration-200">
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Author Info */}
          <div className="flex items-start mb-2">
            <img
              src={post.avatar || "/placeholder.svg"}
              alt={post.author}
              className="w-6 h-6 rounded-full mr-2 ring-1 ring-slate-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="font-medium text-xs text-slate-900 truncate">{post.author}</span>
                {post.verified && (
                  <CheckCircle className="w-2.5 h-2.5 text-blue-600 ml-0.5 flex-shrink-0" />
                )}
              </div>
              <span className="text-xs text-slate-500 truncate block">{post.handle}</span>
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0 ml-1">{post.timestamp}</span>
          </div>

          {/* Content */}
          <p className="text-xs text-slate-700 mb-2 leading-tight line-clamp-1 font-normal">
            {post.content}
          </p>

          {/* Location */}
          {post.location && (
            <div className="flex items-center mb-1 text-xs text-slate-500">
              <MapPin className="w-2.5 h-2.5 mr-0.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{post.location}</span>
            </div>
          )}

          {/* Image */}
          {post.image && (
            <div className="mb-2 overflow-hidden rounded border border-slate-200">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post content"
                className="w-full h-16 object-cover hover:scale-105 transition-transform duration-300"
            />
            </div>
          )}

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {post.hashtags.slice(0, 1).map((tag, index) => (
              <span
                key={index}
                  className="text-xs text-slate-600 hover:text-slate-800 cursor-pointer transition-colors duration-200 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          )}

          {/* Engagement */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-3">
              <button className="flex items-center text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200 group">
                <Heart className="w-2.5 h-2.5 mr-0.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200 group">
                <MessageCircle className="w-2.5 h-2.5 mr-0.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{post.comments}</span>
              </button>
              <button className="flex items-center text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200 group">
                <Repeat2 className="w-2.5 h-2.5 mr-0.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{post.shares}</span>
              </button>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors duration-200">
              <Share className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
