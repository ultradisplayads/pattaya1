"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Users, TrendingUp, Clock, Eye, ThumbsUp, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buildApiUrl } from "@/lib/strapi-config"

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

export function ForumActivityWidget({ isExpanded = false, onToggleExpand }: { isExpanded?: boolean; onToggleExpand?: () => void }) {
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
      const response = await fetch(buildApiUrl("forum-activities?populate=*&sort=LastActivity:desc"))
      
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
      Nightlife: "bg-purple-50 text-purple-700 border-purple-200",
      "Visa & Legal": "bg-blue-50 text-blue-700 border-blue-200",
      Transportation: "bg-green-50 text-green-700 border-green-200",
      Events: "bg-orange-50 text-orange-700 border-orange-200",
      Living: "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Food & Dining": "bg-red-50 text-red-700 border-red-200",
      Accommodation: "bg-yellow-50 text-yellow-700 border-yellow-200",
    }
    return colors[category] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  if (loading) {
    return (
      <Card className="h-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-100 rounded-full w-32"></div>
            <div className="h-4 bg-gray-100 rounded-full w-12"></div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-gray-100 rounded-xl"></div>
              <div className="h-16 bg-gray-100 rounded-xl"></div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {!isExpanded ? (
        // Compact Forum Activity View
        <Card className="h-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 px-6 pt-6">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-3 text-indigo-500" />
            Forum Activity
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500 text-white text-xs font-medium rounded-full border-0">
              <Users className="h-3 w-3 mr-2" />
              {stats.activeUsers}
            </Badge>
            {onToggleExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleExpand()
                }}
                className="h-8 px-3 text-xs font-medium bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105 shadow-sm rounded-lg border"
                title="Expand widget"
              >
                {isExpanded ? 'Less' : 'More'}
              </button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {/* Forum Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <div className="text-lg font-bold text-indigo-600">{formatNumber(stats.totalPosts)}</div>
            <div className="text-xs text-gray-600 font-medium">Total Posts</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
            <div className="text-lg font-bold text-green-600">{stats.newPostsToday}</div>
            <div className="text-xs text-gray-600 font-medium">Today</div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="p-4 rounded-xl bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-sm transition-all duration-200 cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex space-x-4">
                <Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-gray-100">
                  <AvatarImage src={post.AuthorAvatar?.url || "/placeholder.svg"} alt={post.AuthorName} />
                  <AvatarFallback className="text-xs font-medium">{post.AuthorName.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
                      {post.IsPinned && "📌 "}
                      {post.Title}
                      {post.IsHot && <TrendingUp className="inline w-3 h-3 ml-2 text-red-500 flex-shrink-0" />}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-3 mb-3">
                    <Badge variant="outline" className={`text-xs font-medium border ${getCategoryColor(post.Category)}`}>
                      {post.Category}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium truncate">by {post.AuthorName}</span>
                    <Badge variant="outline" className="text-xs font-medium bg-gray-50 text-gray-700 border-gray-200">
                      {post.AuthorReputation}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center font-medium">
                        <MessageCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span>{post.Replies}</span>
                      </div>
                      <div className="flex items-center font-medium">
                        <Eye className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span>{formatNumber(post.Views)}</span>
                      </div>
                      <div className="flex items-center font-medium">
                        <ThumbsUp className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span>{post.Likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0 font-medium">
                      <Clock className="w-3 h-3 mr-2" />
                      <span className="truncate">{formatTimeAgo(post.LastActivity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
            View All Forum Activity →
          </button>
        </div>
      </CardContent>
        </Card>
      ) : (
        // Expanded Forum Activity View
        <Card className="h-full bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-3 text-indigo-500" />
                Forum Activity - Full View
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-500 text-white text-xs font-medium rounded-full border-0">
                  <Users className="h-3 w-3 mr-2" />
                  {stats.activeUsers}
                </Badge>
                {onToggleExpand && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleExpand()
                    }}
                    className="h-8 px-3 text-xs font-medium bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-105 shadow-sm rounded-lg border"
                    title="Collapse widget"
                  >
                    Less
                  </button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {/* Enhanced Forum Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 text-center border border-indigo-100">
                <div className="text-xl font-bold text-indigo-600">{formatNumber(stats.totalPosts)}</div>
                <div className="text-sm text-gray-600 font-medium">Total Posts</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-100">
                <div className="text-xl font-bold text-green-600">{stats.newPostsToday}</div>
                <div className="text-sm text-gray-600 font-medium">New Today</div>
              </div>
            </div>

            {/* All Posts with Enhanced Details */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="p-6 rounded-xl bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex space-x-6">
                    <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-gray-100">
                      <AvatarImage src={post.AuthorAvatar?.url || "/placeholder.svg"} alt={post.AuthorName} />
                      <AvatarFallback className="text-sm font-medium">{post.AuthorName.slice(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
                          {post.IsPinned && "📌 "}
                          {post.Title}
                          {post.IsHot && <TrendingUp className="inline w-4 h-4 ml-2 text-red-500 flex-shrink-0" />}
                        </h3>
                      </div>

                      {post.Content && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {post.Content}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 mb-4">
                        <Badge variant="outline" className={`text-sm font-medium border ${getCategoryColor(post.Category)}`}>
                          {post.Category}
                        </Badge>
                        <span className="text-sm text-gray-500 font-medium">by {post.AuthorName}</span>
                        <Badge variant="outline" className="text-sm font-medium bg-gray-50 text-gray-700 border-gray-200">
                          Rep: {post.AuthorReputation}
                        </Badge>
                      </div>

                      {post.Tags && post.Tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.Tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center font-medium">
                            <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{post.Replies} replies</span>
                          </div>
                          <div className="flex items-center font-medium">
                            <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{formatNumber(post.Views)} views</span>
                          </div>
                          <div className="flex items-center font-medium">
                            <ThumbsUp className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{post.Likes} likes</span>
                          </div>
                        </div>
                        <div className="flex items-center flex-shrink-0 font-medium">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="truncate">{formatTimeAgo(post.LastActivity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50">
                View All Forum Activity →
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
