"use client"

import { useState, useEffect } from "react"
import { Clock, Eye, MessageCircle, Heart, ExternalLink, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  publishedAt: string
  readTime: string
  views: number
  comments: number
  likes: number
  category: string
  image: string
  trending: boolean
  featured: boolean
  url: string
}

interface EnhancedBlogMarqueeProps {
  theme: "primary" | "nightlife"
}

export function EnhancedBlogMarquee({ theme }: EnhancedBlogMarqueeProps) {
  const isPrimary = theme === "primary"
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      const response = await fetch("/api/blog-posts/recent")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error)
      setPosts(getFallbackPosts())
    }
  }

  const getFallbackPosts = (): BlogPost[] => [
    {
      id: "1",
      title: "Ultimate Guide to Pattaya's Hidden Beach Gems",
      excerpt: "Discover secluded beaches beyond the crowds where crystal clear waters meet pristine sand...",
      author: "Sarah Chen",
      publishedAt: "2024-01-15T10:30:00Z",
      readTime: "8 min read",
      views: 2847,
      comments: 23,
      likes: 156,
      category: "Travel",
      image: "/placeholder.svg?height=200&width=300&text=Hidden+Beaches",
      trending: true,
      featured: true,
      url: "/blog/hidden-beach-gems",
    },
    {
      id: "2",
      title: "Street Food Paradise: 15 Must-Try Local Delicacies",
      excerpt:
        "From som tam to mango sticky rice, explore the authentic flavors that make Pattaya a foodie destination...",
      author: "Mike Thompson",
      publishedAt: "2024-01-14T16:45:00Z",
      readTime: "6 min read",
      views: 1923,
      comments: 34,
      likes: 89,
      category: "Food",
      image: "/placeholder.svg?height=200&width=300&text=Street+Food",
      trending: true,
      featured: false,
      url: "/blog/street-food-guide",
    },
    {
      id: "3",
      title: "Nightlife Evolution: How Pattaya's Scene is Changing",
      excerpt: "The transformation of Walking Street and emergence of new entertainment districts...",
      author: "Alex Rodriguez",
      publishedAt: "2024-01-14T12:20:00Z",
      readTime: "10 min read",
      views: 3421,
      comments: 67,
      likes: 234,
      category: "Nightlife",
      image: "/placeholder.svg?height=200&width=300&text=Nightlife+Scene",
      trending: false,
      featured: true,
      url: "/blog/nightlife-evolution",
    },
    {
      id: "4",
      title: "Digital Nomad's Guide to Working from Pattaya",
      excerpt: "Best co-working spaces, reliable internet, and work-life balance in Thailand's beach city...",
      author: "Emma Wilson",
      publishedAt: "2024-01-13T14:30:00Z",
      readTime: "7 min read",
      views: 1567,
      comments: 45,
      likes: 123,
      category: "Lifestyle",
      image: "/placeholder.svg?height=200&width=300&text=Digital+Nomad",
      trending: false,
      featured: false,
      url: "/blog/digital-nomad-guide",
    },
    {
      id: "5",
      title: "Sustainable Tourism: Eco-Friendly Activities in Pattaya",
      excerpt: "Responsible travel options that support local communities and protect the environment...",
      author: "David Park",
      publishedAt: "2024-01-13T09:15:00Z",
      readTime: "5 min read",
      views: 892,
      comments: 18,
      likes: 67,
      category: "Environment",
      image: "/placeholder.svg?height=200&width=300&text=Eco+Tourism",
      trending: false,
      featured: false,
      url: "/blog/sustainable-tourism",
    },
    {
      id: "6",
      title: "Luxury Resorts vs Budget Hostels: Where to Stay",
      excerpt: "Complete accommodation guide covering every budget from backpacker to luxury traveler...",
      author: "Lisa Chang",
      publishedAt: "2024-01-12T18:45:00Z",
      readTime: "9 min read",
      views: 2156,
      comments: 52,
      likes: 178,
      category: "Accommodation",
      image: "/placeholder.svg?height=200&width=300&text=Accommodation",
      trending: true,
      featured: false,
      url: "/blog/accommodation-guide",
    },
    {
      id: "7",
      title: "Cultural Festivals and Events Calendar 2024",
      excerpt: "Don't miss these traditional celebrations and modern festivals happening throughout the year...",
      author: "Tom Anderson",
      publishedAt: "2024-01-12T11:30:00Z",
      readTime: "4 min read",
      views: 1234,
      comments: 29,
      likes: 95,
      category: "Culture",
      image: "/placeholder.svg?height=200&width=300&text=Festivals",
      trending: false,
      featured: true,
      url: "/blog/festivals-calendar",
    },
    {
      id: "8",
      title: "Adventure Sports: Thrills Beyond the Beach",
      excerpt: "Skydiving, jet skiing, parasailing and more adrenaline-pumping activities...",
      author: "Jake Miller",
      publishedAt: "2024-01-11T15:20:00Z",
      readTime: "6 min read",
      views: 1789,
      comments: 41,
      likes: 134,
      category: "Adventure",
      image: "/placeholder.svg?height=200&width=300&text=Adventure+Sports",
      trending: false,
      featured: false,
      url: "/blog/adventure-sports",
    },
    {
      id: "9",
      title: "Shopping Districts: From Markets to Malls",
      excerpt: "Navigate Pattaya's diverse shopping scene from traditional markets to modern shopping centers...",
      author: "Anna Kim",
      publishedAt: "2024-01-11T08:45:00Z",
      readTime: "7 min read",
      views: 1456,
      comments: 33,
      likes: 112,
      category: "Shopping",
      image: "/placeholder.svg?height=200&width=300&text=Shopping",
      trending: false,
      featured: false,
      url: "/blog/shopping-guide",
    },
    {
      id: "10",
      title: "Transportation Guide: Getting Around Like a Local",
      excerpt: "Master the songthaew system, motorbike taxis, and other local transport options...",
      author: "Carlos Mendez",
      publishedAt: "2024-01-10T13:15:00Z",
      readTime: "5 min read",
      views: 987,
      comments: 22,
      likes: 78,
      category: "Transportation",
      image: "/placeholder.svg?height=200&width=300&text=Transportation",
      trending: false,
      featured: false,
      url: "/blog/transportation-guide",
    },
    {
      id: "11",
      title: "Health and Wellness: Spas and Medical Tourism",
      excerpt: "World-class medical facilities and traditional Thai wellness treatments...",
      author: "Dr. Rachel Green",
      publishedAt: "2024-01-10T10:30:00Z",
      readTime: "8 min read",
      views: 1678,
      comments: 38,
      likes: 145,
      category: "Health",
      image: "/placeholder.svg?height=200&width=300&text=Wellness",
      trending: true,
      featured: false,
      url: "/blog/health-wellness",
    },
    {
      id: "12",
      title: "Photography Spots: Instagram-Worthy Locations",
      excerpt: "Capture the perfect shot at these stunning locations throughout Pattaya...",
      author: "Sophie Turner",
      publishedAt: "2024-01-09T16:20:00Z",
      readTime: "6 min read",
      views: 2345,
      comments: 56,
      likes: 189,
      category: "Photography",
      image: "/placeholder.svg?height=200&width=300&text=Photography",
      trending: true,
      featured: true,
      url: "/blog/photography-spots",
    },
    {
      id: "13",
      title: "Family-Friendly Activities and Attractions",
      excerpt: "Fun activities that kids and adults will enjoy together in Pattaya...",
      author: "Mark Johnson",
      publishedAt: "2024-01-09T12:45:00Z",
      readTime: "7 min read",
      views: 1567,
      comments: 42,
      likes: 123,
      category: "Family",
      image: "/placeholder.svg?height=200&width=300&text=Family+Fun",
      trending: false,
      featured: false,
      url: "/blog/family-activities",
    },
    {
      id: "14",
      title: "Seasonal Weather Guide: When to Visit Pattaya",
      excerpt: "Understanding the climate patterns to plan your perfect trip timing...",
      author: "Weather Expert",
      publishedAt: "2024-01-08T14:30:00Z",
      readTime: "4 min read",
      views: 1123,
      comments: 25,
      likes: 87,
      category: "Weather",
      image: "/placeholder.svg?height=200&width=300&text=Weather+Guide",
      trending: false,
      featured: false,
      url: "/blog/weather-guide",
    },
    {
      id: "15",
      title: "Local Business Spotlight: Supporting Community",
      excerpt: "Meet the entrepreneurs and local businesses that make Pattaya special...",
      author: "Community Reporter",
      publishedAt: "2024-01-08T09:15:00Z",
      readTime: "6 min read",
      views: 834,
      comments: 19,
      likes: 65,
      category: "Business",
      image: "/placeholder.svg?height=200&width=300&text=Local+Business",
      trending: false,
      featured: false,
      url: "/blog/local-business",
    },
  ]

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const duplicatedPosts = [...posts, ...posts] // Duplicate for seamless loop

  return (
    <div className="w-full overflow-hidden py-4">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className={`text-xl font-bold ${isPrimary ? "text-gray-800" : "text-white"}`}>Latest from Pattaya1 Blog</h2>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          15 New Posts
        </Badge>
      </div>

      <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div
          className={`flex space-x-4 ${isPaused ? "" : "animate-marquee"}`}
          style={{
            width: `${duplicatedPosts.length * 320}px`,
            animationDuration: `${duplicatedPosts.length * 8}s`,
          }}
        >
          {duplicatedPosts.map((post, index) => (
            <div
              key={`${post.id}-${index}`}
              className={`flex-shrink-0 w-80 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer group ${
                isPrimary
                  ? "bg-white shadow-lg hover:shadow-xl border border-gray-200"
                  : "bg-purple-900/80 shadow-lg hover:shadow-xl border border-pink-500/30"
              }`}
              onClick={() => window.open(post.url, "_blank")}
            >
              <div className="relative">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={320}
                  height={180}
                  className="w-full h-45 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex space-x-2">
                  {post.featured && (
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs"
                    >
                      ⭐ Featured
                    </Badge>
                  )}
                  {post.trending && (
                    <Badge variant="secondary" className="bg-red-500 text-white text-xs animate-pulse">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>

                {/* Category */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      isPrimary ? "bg-white/90 text-gray-800" : "bg-purple-900/90 text-purple-200"
                    }`}
                  >
                    {post.category}
                  </Badge>
                </div>

                {/* Read Time */}
                <div className="absolute bottom-3 right-3">
                  <div className="flex items-center space-x-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3
                  className={`font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors ${
                    isPrimary ? "text-gray-800" : "text-white"
                  }`}
                >
                  {post.title}
                </h3>

                <p className={`text-sm mb-3 line-clamp-3 ${isPrimary ? "text-gray-600" : "text-purple-200"}`}>
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {post.author[0]}
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${isPrimary ? "text-gray-800" : "text-white"}`}>
                        {post.author}
                      </span>
                      <div className={`text-xs ${isPrimary ? "text-gray-500" : "text-purple-300"}`}>
                        {formatTimeAgo(post.publishedAt)}
                      </div>
                    </div>
                  </div>
                  <ExternalLink
                    className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isPrimary ? "text-blue-600" : "text-pink-400"
                    }`}
                  />
                </div>

                {/* Engagement Stats */}
                <div
                  className={`flex items-center justify-between text-xs ${
                    isPrimary ? "text-gray-500" : "text-purple-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(post.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                  <span className="font-medium">Read More →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r ${
            isPrimary ? "from-gray-50 to-transparent" : "from-gray-900 to-transparent"
          } pointer-events-none`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l ${
            isPrimary ? "from-gray-50 to-transparent" : "from-gray-900 to-transparent"
          } pointer-events-none`}
        />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  )
}
