"use client"

import { useState, useEffect } from "react"
import { Calendar, Eye, MessageCircle, Heart, TrendingUp, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  publishedAt: string
  readTime: string
  category: string
  image: string
  views: number
  comments: number
  likes: number
  featured: boolean
  trending: boolean
  tags: string[]
}

export function EnhancedEventsMarquee() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      const response = await fetch("/api/blog-posts/recent")
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(data || [])
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (loading) {
    return (
      <div className="w-full overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 py-6">
        <div className="flex animate-pulse space-x-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 h-48 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  // Duplicate posts for infinite scroll effect
  const duplicatedPosts = [...blogPosts, ...blogPosts, ...blogPosts]

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Latest from Pattaya
        </h2>
        <p className="text-gray-600">Stay updated with the latest news, events, and stories from around the city</p>
      </div>

      <div
        className={`flex space-x-6 ${isPaused ? "" : "animate-marquee"}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          width: `${duplicatedPosts.length * 320}px`,
        }}
      >
        {duplicatedPosts.map((post, index) => (
          <Card
            key={`${post.id}-${index}`}
            className="flex-shrink-0 w-80 h-auto cursor-pointer group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg"
            onClick={() => window.open(`/blog/${post.id}`, "_blank")}
          >
            <div className="relative">
              <img
                src={post.image || "/placeholder.svg?height=160&width=320"}
                alt={post.title}
                className="w-full h-40 object-cover rounded-t-lg group-hover:brightness-110 transition-all duration-300"
              />
              <div className="absolute top-3 left-3 flex space-x-2">
                {post.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {post.trending && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-black/70 text-white border-0">
                  {post.readTime}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  {post.category}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {post.author[0]}
                  </div>
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Eye className="h-3 w-3" />
                    <span>{formatNumber(post.views)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MessageCircle className="h-3 w-3" />
                    <span>{formatNumber(post.comments)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Heart className="h-3 w-3" />
                    <span>{formatNumber(post.likes)}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 h-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`/blog/${post.id}`, "_blank")
                  }}
                >
                  Read More
                </Button>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="outline"
                      className="text-xs bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${blogPosts.length * 320}px);
          }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
