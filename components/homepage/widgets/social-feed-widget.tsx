"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, MessageCircle, Repeat2, Share, MapPin, CheckCircle, ExternalLink, Hash, Users, Shield, Sparkles, RefreshCw, X } from "lucide-react"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"
import { motion, AnimatePresence } from "framer-motion"

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

interface SocialFeedWidgetProps {
  theme?: "primary" | "nightlife"
}

export function SocialFeedWidget({ theme = "primary" }: SocialFeedWidgetProps) {
  const isPrimary = theme === "primary"
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
  })

  useEffect(() => {
    fetchSocialPosts()
    const interval = setInterval(fetchSocialPosts, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchSocialPosts = async () => {
    try {
      setLoading(true)
      console.log('Fetching social media posts from Strapi...')
      
      // Call Strapi API to fetch 1 post directly from Twitter (no caching)
      const response = await fetch(buildApiUrl("social-feed/fetch-one"))
      
      if (response.ok) {
        const data = await response.json()
        console.log('Strapi social feed response:', data)
        
        if (data.data && data.data.posts && data.data.posts.length > 0) {
          // Transform Strapi data to match component interface
          const transformedPosts: SocialPost[] = data.data.posts.map((strapiPost: any) => {
            // Get avatar URL with fallback
            let avatarUrl = "/placeholder.svg?height=40&width=40"
            if (strapiPost.Avatar) {
              avatarUrl = buildStrapiUrl(strapiPost.Avatar.url)
            }

            // Get image URL with fallback
            let imageUrl = undefined
            if (strapiPost.Image) {
              imageUrl = buildStrapiUrl(strapiPost.Image.url)
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
          
          // Calculate stats
          const totalPosts = transformedPosts.length
          const totalLikes = transformedPosts.reduce((sum, post) => sum + post.likes, 0)
          const totalComments = transformedPosts.reduce((sum, post) => sum + post.comments, 0)
          setStats({ totalPosts, totalLikes, totalComments })
        } else {
          console.log('No social media posts found, using fallback data')
          // Use fallback data if no posts found
          const fallbackData = getFallbackSocialPosts()
          setSocialPosts(fallbackData)
          
          // Calculate stats for fallback data
          const totalPosts = fallbackData.length
          const totalLikes = fallbackData.reduce((sum, post) => sum + post.likes, 0)
          const totalComments = fallbackData.reduce((sum, post) => sum + post.comments, 0)
          setStats({ totalPosts, totalLikes, totalComments })
        }
      } else {
        console.error("Failed to fetch social media posts from Strapi:", response.status)
        // Use fallback data on error
        const fallbackData = getFallbackSocialPosts()
        setSocialPosts(fallbackData)
        
        // Calculate stats for fallback data
        const totalPosts = fallbackData.length
        const totalLikes = fallbackData.reduce((sum, post) => sum + post.likes, 0)
        const totalComments = fallbackData.reduce((sum, post) => sum + post.comments, 0)
        setStats({ totalPosts, totalLikes, totalComments })
      }
    } catch (error) {
      console.error("Failed to load social media posts:", error)
      // Use fallback data on error
      const fallbackData = getFallbackSocialPosts()
      setSocialPosts(fallbackData)
      
      // Calculate stats for fallback data
      const totalPosts = fallbackData.length
      const totalLikes = fallbackData.reduce((sum, post) => sum + post.likes, 0)
      const totalComments = fallbackData.reduce((sum, post) => sum + post.comments, 0)
      setStats({ totalPosts, totalLikes, totalComments })
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

  const refreshFeed = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    await fetchSocialPosts()
  }

  const handleViewAll = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "from-blue-400 to-blue-600"
      case "threads":
        return "from-gray-800 to-black"
      case "instagram":
        return "from-purple-500 to-pink-500"
      case "bluesky":
        return "from-sky-400 to-sky-600"
      default:
        return "from-gray-400 to-gray-600"
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

  // Enhanced card class name with glassmorphism
  const enhancedCardClassName = (isPrimary: boolean) => `
    h-full flex flex-col overflow-hidden transition-all duration-500 widget-card pointer-events-auto relative
    ${isPrimary 
      ? "bg-gradient-to-br from-white/90 via-pink-50/80 to-purple-50/70 backdrop-blur-xl border border-white/60 shadow-xl hover:shadow-2xl hover:shadow-pink-200/30" 
      : "bg-gradient-to-br from-purple-900/90 via-pink-900/80 to-red-900/70 backdrop-blur-xl border border-pink-400/40 shadow-xl hover:shadow-2xl hover:shadow-pink-400/40"
    }
    rounded-3xl
  `

  // Background pattern overlay
  const backgroundPattern = (isPrimary: boolean) => (
    <div className="absolute inset-0 opacity-10 rounded-3xl overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${
          isPrimary
          ? "from-pink-600/20 via-transparent to-purple-600/20" 
          : "from-purple-400/30 via-transparent to-pink-400/30"
      }`} />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, ${
          isPrimary ? 'rgba(236, 72, 153, 0.15)' : 'rgba(168, 85, 247, 0.2)'
        } 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${
          isPrimary ? 'rgba(147, 51, 234, 0.15)' : 'rgba(236, 72, 153, 0.2)'
        } 0%, transparent 50%)`
      }} />
            </div>
  )

  // Enhanced header with floating animation - optimized for widget size
  const enhancedHeader = (isPrimary: boolean, loading: boolean, refreshFeed: any, handleViewAll: any) => (
    <CardHeader className="pb-2 flex-shrink-0 relative z-10">
      <CardTitle className={`flex items-center justify-between text-sm ${
        isPrimary ? "text-slate-800" : "text-white"
      }`}>
            <div className="flex items-center space-x-2">
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative"
            >
              <Hash className="h-4 w-4 text-pink-500" />
            </motion.div>
            <div className="absolute inset-0 h-4 w-4 text-pink-400 animate-ping opacity-20">
              <Hash className="h-4 w-4" />
            </div>
          </div>
          <span className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent text-sm">
            Social Feed
          </span>
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          >
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 shadow-lg font-semibold px-2 py-0.5 rounded-full text-xs">
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-1 bg-white rounded-full mr-1"
              />
              LIVE
            </Badge>
          </motion.div>
          </div>
        <div className="flex items-center space-x-1">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity 
            }}
          >
            <Shield className="h-3 w-3 text-emerald-500" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={refreshFeed}
              disabled={loading}
              className={`h-6 w-6 rounded-lg backdrop-blur-sm transition-all duration-200 ${
                isPrimary 
                  ? "hover:bg-white/70 border border-white/40 hover:border-white/60" 
                  : "hover:bg-purple-700/50 border border-purple-400/30 hover:border-purple-300/50"
              }`}
            >
              <motion.div
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw className="h-3 w-3" />
              </motion.div>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewAll}
              className={`h-6 w-6 rounded-lg backdrop-blur-sm transition-all duration-200 ${
                isPrimary 
                  ? "hover:bg-white/70 border border-white/40 hover:border-white/60" 
                  : "hover:bg-purple-700/50 border border-purple-400/30 hover:border-purple-300/50"
              }`}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </motion.div>
          </div>
        </CardTitle>
      </CardHeader>
  )

  // Enhanced AI moderation status with floating effect - optimized for widget size
  const enhancedModerationStatus = (isPrimary: boolean) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between p-2 rounded-xl backdrop-blur-md border transition-all duration-300 ${
        isPrimary 
          ? "bg-white/70 border-white/50 hover:bg-white/80" 
          : "bg-purple-800/50 border-purple-400/30 hover:bg-purple-800/60"
      }`}
    >
      <div className="flex items-center space-x-1.5">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Sparkles className="h-3 w-3 text-purple-500" />
        </motion.div>
        <span className={`text-xs font-semibold ${
          isPrimary ? "text-purple-700" : "text-purple-200"
        }`}>
          Native + Gemini AI
        </span>
          </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Badge 
          variant="outline" 
          className="text-xs border-emerald-500/50 text-emerald-700 bg-emerald-50/80 backdrop-blur-sm font-semibold px-2 py-0.5 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 bg-emerald-500 rounded-full mr-1"
          />
            Filtering: Pattaya Content
          </Badge>
      </motion.div>
    </motion.div>
  )

  // Enhanced stats row with staggered animations - optimized for widget size
  const enhancedStatsRow = (isPrimary: boolean, stats: any) => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-3 gap-2 mb-3"
    >
      {[
        { icon: Users, value: stats.totalPosts, label: "Posts", color: "pink", delay: 0 },
        { icon: Heart, value: stats.totalLikes.toLocaleString(), label: "Likes", color: "red", delay: 0.1 },
        { icon: MessageCircle, value: stats.totalComments, label: "Comments", color: "blue", delay: 0.2 }
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: stat.delay,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            scale: 1.05, 
            y: -2,
            transition: { duration: 0.2 }
          }}
          className={`text-center p-2 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
            isPrimary 
              ? "bg-white/70 border-white/50 hover:bg-white/80 hover:shadow-lg" 
              : "bg-purple-800/50 border-purple-400/30 hover:bg-purple-800/60 hover:shadow-lg"
          }`}
        >
          <motion.div
            animate={{ 
              scale: stat.color === 'red' ? [1, 1.1, 1] : 1,
              rotate: stat.color === 'pink' ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          >
            <stat.icon className={`h-4 w-4 mx-auto mb-1 ${
              stat.color === 'pink' ? (isPrimary ? 'text-pink-600' : 'text-pink-300') :
              stat.color === 'red' ? 'text-red-500' :
              isPrimary ? 'text-blue-500' : 'text-blue-300'
            }`} />
          </motion.div>
          <motion.div 
            className={`text-sm font-bold ${isPrimary ? "text-slate-800" : "text-white"}`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: stat.delay }}
          >
            {stat.value}
          </motion.div>
          <div className={`text-xs font-medium ${isPrimary ? "text-slate-600" : "text-purple-200"}`}>
            {stat.label}
            </div>
        </motion.div>
      ))}
    </motion.div>
  )

  // Enhanced social post cards - optimized for widget size
  const enhancedSocialPost = (post: any, index: number, isPrimary: boolean, getPlatformColor: any) => (
    <motion.div
              key={post.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      }}
      className={`p-2 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer group ${
        isPrimary 
          ? "bg-white/60 border-white/50 hover:bg-white/80 hover:shadow-lg" 
          : "bg-purple-800/40 border-purple-400/30 hover:bg-purple-800/60 hover:shadow-lg"
      }`}
    >
      {/* Subtle glow effect on hover */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        isPrimary 
          ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10" 
          : "bg-gradient-to-r from-purple-400/20 to-pink-400/20"
      }`} />
      
      <div className="relative flex items-start space-x-2">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
                <img
                  src={post.avatar || "/placeholder.svg"}
                  alt={post.author}
            className="w-6 h-6 rounded-full object-cover border border-white/50 shadow-sm"
                />
        </motion.div>
                <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-1">
            <span className={`text-xs font-bold truncate ${
              isPrimary ? "text-slate-800" : "text-white"
            }`}>
                      {post.author}
                    </span>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
                    >
              <Badge className={`text-xs px-1 py-0.5 bg-gradient-to-r ${getPlatformColor(post.platform)} text-white border-0 shadow-sm rounded-full font-semibold`}>
                      {post.platform}
                    </Badge>
            </motion.div>
            {post.verified && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="h-3 w-3 text-blue-500" />
              </motion.div>
            )}
            <span className={`text-xs font-medium ${
              isPrimary ? "text-slate-500" : "text-purple-200"
            }`}>
                      {post.timestamp}
                    </span>
                  </div>
          <p className={`text-xs mb-2 line-clamp-2 leading-relaxed ${
            isPrimary ? "text-slate-700" : "text-purple-100"
          }`}>
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-3 text-xs">
            <motion.span
              whileHover={{ scale: 1.1 }}
              className={`flex items-center space-x-1 cursor-pointer ${
                isPrimary ? "text-slate-600 hover:text-red-600" : "text-purple-200 hover:text-red-400"
              }`}
                    >
                      <Heart className="h-3 w-3" />
              <span className="font-semibold">{post.likes}</span>
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className={`flex items-center space-x-1 cursor-pointer ${
                isPrimary ? "text-slate-600 hover:text-blue-600" : "text-purple-200 hover:text-blue-400"
              }`}
                    >
                      <MessageCircle className="h-3 w-3" />
              <span className="font-semibold">{post.comments}</span>
            </motion.span>
                  </div>
                </div>
              </div>
    </motion.div>
  )

  // Enhanced loading state
  const enhancedLoadingState = (isPrimary: boolean) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={enhancedCardClassName(isPrimary)}
    >
      {backgroundPattern(isPrimary)}
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className={`flex items-center justify-between text-lg ${
          isPrimary ? "text-slate-800" : "text-white"
        }`}>
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Hash className="h-5 w-5 text-pink-500" />
            </motion.div>
            <span>Social Feed</span>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                Live
              </Badge>
            </motion.div>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className={`mx-auto w-10 h-10 rounded-full border-3 border-t-transparent ${
                isPrimary ? "border-pink-600" : "border-pink-400"
              }`}
            />
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`text-sm font-medium ${
                isPrimary ? "text-pink-600" : "text-purple-300"
              }`}
            >
              Loading social feed...
            </motion.p>
        </div>
        </div>
      </CardContent>
    </motion.div>
  )

  // Enhanced quick actions footer - optimized for widget size
  const enhancedFooter = (isPrimary: boolean, handleViewAll: any) => (
    <div className={`flex justify-between items-center pt-2 border-t transition-colors duration-300 ${
      isPrimary ? "border-pink-200/50" : "border-purple-400/30"
    }`}>
      <span className={`text-xs font-medium ${
        isPrimary ? "text-pink-600" : "text-purple-300"
      }`}>
            Native social aggregation
          </span>
      <motion.div
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
      >
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleViewAll}
          className={`text-xs h-6 px-2 font-semibold rounded-lg transition-all duration-200 ${
              isPrimary
              ? "text-pink-600 hover:text-pink-800 hover:bg-pink-100/70 border border-pink-200/50 hover:border-pink-300"
              : "text-purple-300 hover:text-pink-300 hover:bg-purple-700/50 border border-purple-400/30 hover:border-purple-300"
          }`}
        >
          View All 
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-1"
          >
            →
          </motion.span>
          </Button>
      </motion.div>
    </div>
  )

  // Show loading state while fetching data
  if (loading) {
    return enhancedLoadingState(isPrimary)
  }

  // Check if we have posts and current post exists
  if (!socialPosts || socialPosts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={enhancedCardClassName(isPrimary)}
      >
        {backgroundPattern(isPrimary)}
        {enhancedHeader(isPrimary, loading, refreshFeed, handleViewAll)}
        <CardContent className="space-y-4 relative z-10">
          <div className="flex items-center justify-center h-32">
            <p className={`text-sm font-medium ${isPrimary ? "text-pink-600" : "text-purple-300"}`}>No social media posts available</p>
        </div>
      </CardContent>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={enhancedCardClassName(isPrimary)}
      >
        {backgroundPattern(isPrimary)}
        {/* Global Sponsorship Banner */}
        <SponsorshipBanner widgetType="social" />
        {enhancedHeader(isPrimary, loading, refreshFeed, handleViewAll)}
        <CardContent className="space-y-3 flex flex-col flex-1 min-h-0 overflow-hidden pointer-events-auto relative z-10">
          {/* Enhanced AI Moderation Status */}
          {enhancedModerationStatus(isPrimary)}

          {/* Enhanced Stats Row */}
          {enhancedStatsRow(isPrimary, stats)}

          {/* Enhanced Social Feed Posts - Show only first 2 posts in widget */}
          <div className="space-y-2 flex-1 min-h-0 overflow-y-auto social-feed-scroll pointer-events-auto">
            {socialPosts.slice(0, 2).map((post, index) => enhancedSocialPost(post, index, isPrimary, getPlatformColor))}
            {socialPosts.length > 2 && (
              <div className={`text-center p-2 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all duration-200 ${
                isPrimary ? "bg-white/40 hover:bg-white/60" : "bg-purple-800/30 hover:bg-purple-800/50"
              }`}
              onClick={handleViewAll}
              >
                <span className={`text-xs font-medium ${isPrimary ? "text-slate-600 hover:text-slate-800" : "text-purple-300 hover:text-purple-100"}`}>
                  +{socialPosts.length - 2} more posts • Click to view all
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Quick Actions Footer */}
          {enhancedFooter(isPrimary, handleViewAll)}
        </CardContent>
      </motion.div>

    {/* Social Feed Modal - Weather Widget Style */}
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl border border-gray-100 shadow-2xl bg-gradient-to-br from-slate-50 via-white to-pink-50">
        {/* Header - Clean and minimal */}
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/10 to-purple-600/20 rounded-2xl flex items-center justify-center">
                <Hash className="h-8 w-8 text-pink-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-semibold text-gray-900 mb-1">
                  Social Feed
                </DialogTitle>
                <p className="text-sm text-gray-500">
                  Live social media updates from Pattaya • {stats.totalPosts} Posts
                </p>
              </div>
            </div>
            
            {/* Stats badge */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-pink-50 border border-pink-200 rounded-full">
                <span className="text-sm font-medium text-pink-700">
                  {stats.totalLikes.toLocaleString()} Likes
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Main content - Single scroll area */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          {/* Hero Section - Stats prominently displayed */}
          <div className="text-center mb-6 p-6 rounded-2xl border border-gray-200/60 bg-gradient-to-br from-pink-50 via-white to-purple-50">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-1">{stats.totalPosts}</div>
                <div className="text-sm font-medium text-gray-600">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-500 mb-1">{stats.totalLikes.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-600">Total Likes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-1">{stats.totalComments}</div>
                <div className="text-sm font-medium text-gray-600">Total Comments</div>
              </div>
            </div>
            
            {/* AI Status */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-600">Powered by Native + Gemini AI</span>
            </div>
          </div>

          {/* Social Posts Grid - Full Width */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {socialPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={post.avatar || "/placeholder.svg"}
                      alt={post.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-gray-900 text-base">{post.author}</span>
                      <Badge
                        className={`text-xs px-3 py-1 bg-gradient-to-r ${getPlatformColor(post.platform)} text-white rounded-full font-semibold`}
                      >
                        {post.platform}
                      </Badge>
                      {post.verified && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                    {post.location && (
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{post.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-2 hover:text-red-600 transition-colors cursor-pointer">
                        <Heart className="h-4 w-4" />
                        <span className="font-semibold">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-semibold">{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-green-600 transition-colors cursor-pointer">
                        <Share className="h-4 w-4" />
                        <span className="font-semibold">{post.shares}</span>
                      </div>
                      <span className="ml-auto text-xs">{post.timestamp}</span>
                    </div>
                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.hashtags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Modal Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </motion.div>
                <span className="text-sm font-semibold text-gray-700">Powered by Native + Gemini AI</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshFeed}
                disabled={loading}
                className="px-4 py-2 font-semibold"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh Feed
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
