"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Users, TrendingUp, Clock, Eye, ThumbsUp, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StrapiForumActivity {
  id: number
  Title: string
  AuthorName: string
  AuthorAvatar?: {
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
  AuthorReputation: number
  Category: string
  Replies: number
  Views: number
  Likes: number
  LastActivity: string
  IsHot: boolean
  IsPinned: boolean
  IsActive: boolean
  Featured: boolean
  Content?: string
  Tags?: string[]
  URL?: string
  LastUpdated: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface ForumStats {
  totalPosts: number
  activeUsers: number
  newPostsToday: number
  hotTopics: number
}

export function ForumActivityWidget() {
  const [posts, setPosts] = useState<StrapiForumActivity[]>([])
  const [stats, setStats] = useState<ForumStats>({
    totalPosts: 0,
    activeUsers: 0,
    newPostsToday: 0,
    hotTopics: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadForumData()
    const interval = setInterval(loadForumData, 180000) // Refresh every 3 minutes
    return () => clearInterval(interval)
  }, [])

  const loadForumData = async () => {
    try {
      setLoading(true)
      console.log('Fetching forum activities from Strapi...')
      const response = await fetch("http://localhost:1337/api/forum-activities?populate=*&sort=LastActivity:desc")
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          // Transform Strapi data to match our interface
          const transformedPosts = data.data.map((item: any) => ({
            id: item.id,
            Title: item.Title,
            AuthorName: item.AuthorName,
            AuthorAvatar: item.AuthorAvatar ? {
              id: item.AuthorAvatar.id,
              name: item.AuthorAvatar.name,
              url: item.AuthorAvatar.url,
              formats: item.AuthorAvatar.formats
            } : undefined,
            AuthorReputation: item.AuthorReputation,
            Category: item.Category,
            Replies: item.Replies,
            Views: item.Views,
            Likes: item.Likes,
            LastActivity: item.LastActivity,
            IsHot: item.IsHot,
            IsPinned: item.IsPinned,
            IsActive: item.IsActive,
            Featured: item.Featured,
            Content: item.Content,
            Tags: item.Tags,
            URL: item.URL,
            LastUpdated: item.LastUpdated,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            publishedAt: item.publishedAt
          }))
          
          setPosts(transformedPosts)
          
          // Calculate stats from the data
          const totalPosts = transformedPosts.length
          const activeUsers = new Set(transformedPosts.map((post: StrapiForumActivity) => post.AuthorName)).size
          const newPostsToday = transformedPosts.filter((post: StrapiForumActivity) => {
            const postDate = new Date(post.LastActivity)
            const today = new Date()
            return postDate.toDateString() === today.toDateString()
          }).length
          const hotTopics = transformedPosts.filter((post: StrapiForumActivity) => post.IsHot).length
          
          setStats({
            totalPosts,
            activeUsers,
            newPostsToday,
            hotTopics,
          })
        } else {
          setPosts([])
          setStats({
            totalPosts: 0,
            activeUsers: 0,
            newPostsToday: 0,
            hotTopics: 0,
          })
        }
      } else {
        console.error("Failed to load forum data from Strapi:", response.status)
        setPosts([])
      }
    } catch (error) {
      console.error("Failed to load forum data:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Nightlife: "bg-purple-100 text-purple-800",
      "Visa & Legal": "bg-blue-100 text-blue-800",
      Transportation: "bg-green-100 text-green-800",
      Events: "bg-orange-100 text-orange-800",
      Living: "bg-indigo-100 text-indigo-800",
      "Food & Dining": "bg-red-100 text-red-800",
      Accommodation: "bg-yellow-100 text-yellow-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
            Forum Activity
          </div>
          <Badge variant="secondary" className="bg-indigo-500 text-white animate-pulse">
            <Users className="h-3 w-3 mr-1" />
            {stats.activeUsers}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Forum Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/70 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-indigo-600">{formatNumber(stats.totalPosts)}</div>
            <div className="text-xs text-gray-600">Total Posts</div>
          </div>
          <div className="bg-white/70 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-green-600">{stats.newPostsToday}</div>
            <div className="text-xs text-gray-600">Today</div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="p-3 rounded-lg bg-white/70 hover:bg-white border border-gray-100 hover:shadow-sm transition-all duration-200 cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={post.AuthorAvatar?.url || "/placeholder.svg"} alt={post.AuthorName} />
                  <AvatarFallback className="text-xs">{post.AuthorName.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
                      {post.IsPinned && "📌 "}
                      {post.Title}
                      {post.IsHot && <TrendingUp className="inline w-3 h-3 ml-1 text-red-500 flex-shrink-0" />}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className={`text-xs ${getCategoryColor(post.Category)}`}>
                      {post.Category}
                    </Badge>
                    <span className="text-xs text-gray-500 truncate">by {post.AuthorName}</span>
                    <Badge variant="outline" className="text-xs">
                      {post.AuthorReputation}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{post.Replies}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{formatNumber(post.Views)}</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{post.Likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="truncate">{formatTimeAgo(post.LastActivity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
            View All Forum Activity →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
