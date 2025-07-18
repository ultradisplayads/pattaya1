"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Users, TrendingUp, Clock, Eye, ThumbsUp, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ForumPost {
  id: string
  title: string
  author: {
    name: string
    avatar: string
    reputation: number
  }
  category: string
  replies: number
  views: number
  likes: number
  lastActivity: string
  isHot: boolean
  isPinned: boolean
}

interface ForumStats {
  totalPosts: number
  activeUsers: number
  newPostsToday: number
  hotTopics: number
}

export function ForumActivityWidget() {
  const [posts, setPosts] = useState<ForumPost[]>([])
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
      // Simulate API call - replace with actual forum data
      const mockPosts: ForumPost[] = [
        {
          id: "1",
          title: "Best rooftop bars in Pattaya with ocean views?",
          author: {
            name: "TravelMike",
            avatar: "/placeholder.svg?height=32&width=32&text=TM",
            reputation: 1250,
          },
          category: "Nightlife",
          replies: 23,
          views: 456,
          likes: 18,
          lastActivity: "5 minutes ago",
          isHot: true,
          isPinned: false,
        },
        {
          id: "2",
          title: "Visa extension process at Jomtien Immigration",
          author: {
            name: "ExpatLife",
            avatar: "/placeholder.svg?height=32&width=32&text=EL",
            reputation: 2890,
          },
          category: "Visa & Legal",
          replies: 67,
          views: 1234,
          likes: 45,
          lastActivity: "12 minutes ago",
          isHot: true,
          isPinned: true,
        },
        {
          id: "3",
          title: "Motorcycle taxi rates from Walking Street",
          author: {
            name: "BudgetTraveler",
            avatar: "/placeholder.svg?height=32&width=32&text=BT",
            reputation: 567,
          },
          category: "Transportation",
          replies: 15,
          views: 289,
          likes: 8,
          lastActivity: "25 minutes ago",
          isHot: false,
          isPinned: false,
        },
        {
          id: "4",
          title: "Songkran 2024 - Best places to celebrate?",
          author: {
            name: "FestivalFan",
            avatar: "/placeholder.svg?height=32&width=32&text=FF",
            reputation: 890,
          },
          category: "Events",
          replies: 34,
          views: 678,
          likes: 29,
          lastActivity: "1 hour ago",
          isHot: true,
          isPinned: false,
        },
        {
          id: "5",
          title: "Reliable internet providers in Jomtien area",
          author: {
            name: "DigitalNomad",
            avatar: "/placeholder.svg?height=32&width=32&text=DN",
            reputation: 1456,
          },
          category: "Living",
          replies: 19,
          views: 345,
          likes: 12,
          lastActivity: "2 hours ago",
          isHot: false,
          isPinned: false,
        },
      ]

      const mockStats: ForumStats = {
        totalPosts: 15847,
        activeUsers: 234,
        newPostsToday: 67,
        hotTopics: 12,
      }

      setPosts(mockPosts)
      setStats(mockStats)
    } catch (error) {
      console.error("Failed to load forum data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
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
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback className="text-xs">{post.author.name.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
                      {post.isPinned && "📌 "}
                      {post.title}
                      {post.isHot && <TrendingUp className="inline w-3 h-3 ml-1 text-red-500 flex-shrink-0" />}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className={`text-xs ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </Badge>
                    <span className="text-xs text-gray-500 truncate">by {post.author.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {post.author.reputation}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{post.replies}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{formatNumber(post.views)}</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="truncate">{post.lastActivity}</span>
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
