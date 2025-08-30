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

interface StrapiSocialMediaPost {
  id: number
  Platform: "twitter" | "threads" | "instagram" | "bluesky" | "facebook" | "tiktok"
  Author: string
  Handle: string
  Content: string
  Timestamp: string
  Likes: number
  Comments: number
  Shares: number
  Location: string
  Verified: boolean
  Hashtags: string[]
  URL: string
  IsActive: boolean
  Featured: boolean
  Category: string
  Avatar?: {
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
  Image?: {
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
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function SocialFeedWidget() {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSocialPosts()
    const interval = setInterval(fetchSocialPosts, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchSocialPosts = async () => {
    try {
      setLoading(true)
      console.log('Fetching social media posts from Strapi...')
      
      // Call Strapi API to get social media posts sorted by timestamp
      const response = await fetch("http://localhost:1337/api/social-media-posts?populate=*&sort=Timestamp:desc")
      
      if (response.ok) {
        const data = await response.json()
        console.log('Strapi social media posts response:', data)
        
        if (data.data && data.data.length > 0) {
          // Transform Strapi data to match component interface
          const transformedPosts: SocialPost[] = data.data.map((strapiPost: any) => {
            // Get avatar URL with fallback
            let avatarUrl = "/placeholder.svg?height=40&width=40"
            if (strapiPost.Avatar) {
              avatarUrl = `http://localhost:1337${strapiPost.Avatar.url}`
            }

            // Get image URL with fallback
            let imageUrl = undefined
            if (strapiPost.Image) {
              imageUrl = `http://localhost:1337${strapiPost.Image.url}`
            }

            return {
              id: strapiPost.id.toString(),
              platform: strapiPost.Platform as any,
              author: strapiPost.Author,
              handle: strapiPost.Handle,
              avatar: avatarUrl,
              content: strapiPost.Content,
              timestamp: strapiPost.Timestamp || strapiPost.publishedAt,
              likes: strapiPost.Likes,
              comments: strapiPost.Comments,
              shares: strapiPost.Shares,
              location: strapiPost.Location,
              verified: strapiPost.Verified,
              hashtags: strapiPost.Hashtags || [],
              image: imageUrl,
            }
          })
          
          console.log('Transformed social media posts:', transformedPosts)
          setSocialPosts(transformedPosts)
        } else {
          console.log('No social media posts found, using fallback data')
          // Use fallback data if no posts found
          setSocialPosts(getFallbackSocialPosts())
        }
      } else {
        console.error("Failed to fetch social media posts from Strapi:", response.status)
        // Use fallback data on error
        setSocialPosts(getFallbackSocialPosts())
      }
    } catch (error) {
      console.error("Failed to load social media posts:", error)
      // Use fallback data on error
      setSocialPosts(getFallbackSocialPosts())
    } finally {
      setLoading(false)
    }
  }

  const getFallbackSocialPosts = (): SocialPost[] => [
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

  // Show loading state while fetching data
  if (loading) {
    return (
      <Card className="h-full bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              Social Feed
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check if we have posts and current post exists
  if (!socialPosts || socialPosts.length === 0) {
    return (
      <Card className="h-full bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              Social Feed
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-sm">No social media posts available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Social Feed
          </div>
          <Badge variant="secondary" className="text-xs">
            {socialPosts.length} posts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4 max-h-80 overflow-y-auto social-feed-scroll">
          {socialPosts.map((post) => (
            <div key={post.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              {/* Platform Badge */}
              <div className="flex items-center justify-between mb-3">
                <Badge className={`${getPlatformColor(post.platform)} px-2 py-1 text-xs font-medium`}>
                  {getPlatformIcon(post.platform)} {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                </Badge>
                <a href="#" className="text-gray-400">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Author Info */}
              <div className="flex items-center mb-3">
                <img
                  src={post.avatar || "/placeholder.svg"}
                  alt={post.author}
                  className="w-8 h-8 rounded-full mr-3 ring-2 ring-blue-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-gray-900 truncate">{post.author}</span>
                    {post.verified && <CheckCircle className="w-3 h-3 text-blue-500 ml-1 flex-shrink-0" />}
                  </div>
                  <span className="text-xs text-gray-500 truncate block">{post.handle}</span>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{post.timestamp}</span>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-700 mb-3 leading-relaxed line-clamp-2">{post.content}</p>

              {/* Location */}
              {post.location && (
                <div className="flex items-center mb-3 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1 text-red-400 flex-shrink-0" />
                  <span className="truncate">{post.location}</span>
                </div>
              )}

              {/* Image */}
              {post.image && (
                <img
                  src={post.image || "/placeholder.svg"}
                  alt="Post content"
                  className="w-full h-16 object-cover rounded-lg mb-3"
                />
              )}

              {/* Hashtags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {post.hashtags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs text-blue-600 cursor-pointer truncate"
                  >
                    {tag}
                  </span>
                ))}
                {post.hashtags.length > 3 && (
                  <span className="text-xs text-gray-500">+{post.hashtags.length - 3} more</span>
                )}
              </div>

              {/* Engagement */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center cursor-pointer">
                    <Heart className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center cursor-pointer">
                    <MessageCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center cursor-pointer">
                    <Repeat2 className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>{post.shares}</span>
                  </div>
                </div>
                <Share className="w-3 h-3 cursor-pointer flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
