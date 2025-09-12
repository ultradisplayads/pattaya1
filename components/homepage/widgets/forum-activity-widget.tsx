"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Users, TrendingUp, Clock, Eye, ThumbsUp, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buildApiUrl } from "@/lib/strapi-config"
import { ForumThreadItem } from "./forum-thread-item"

interface EnhancedForumTopic {
  id: string | number
  title: string
  url: string
  category_id: number
  author: {
    username: string
    name: string
    avatar_template?: string
  }
  reply_count: number
  view_count: number
  like_count: number
  last_activity: string
  created_at: string
  is_hot: boolean
  is_pinned: boolean
  tags: string[]
  excerpt: string
  category_info: {
    name: string
    icon: string
    color: string
  }
  avatar_url?: string | null
}

interface ForumStats {
  totalPosts: number
  activeUsers: number
  newPostsToday: number
  hotTopics: number
}

export function ForumActivityWidget() {
  const [topics, setTopics] = useState<EnhancedForumTopic[]>([])
  const [stats, setStats] = useState<ForumStats>({
    totalPosts: 0,
    activeUsers: 0,
    newPostsToday: 0,
    hotTopics: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadForumData()
    const interval = setInterval(loadForumData, 120000) // Refresh every 2 minutes
    return () => clearInterval(interval)
  }, [])

  const loadForumData = async () => {
    try {
      setLoading(true)
      console.log('Fetching enhanced forum activities from Strapi...')
      
      // Use the new enhanced endpoint
      const response = await fetch(buildApiUrl("forum-activity/enhanced?limit=5"))
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          setTopics(data.data)
          
          // Calculate stats from the data
          const totalPosts = data.data.length
          const activeUsers = new Set(data.data.map((topic: EnhancedForumTopic) => topic.author.username)).size
          const newPostsToday = data.data.filter((topic: EnhancedForumTopic) => {
            const postDate = new Date(topic.last_activity)
            const today = new Date()
            return postDate.toDateString() === today.toDateString()
          }).length
          const hotTopics = data.data.filter((topic: EnhancedForumTopic) => topic.is_hot).length
          
          setStats({
            totalPosts,
            activeUsers,
            newPostsToday,
            hotTopics,
          })
        } else {
          setTopics([])
          setStats({
            totalPosts: 0,
            activeUsers: 0,
            newPostsToday: 0,
            hotTopics: 0,
          })
        }
      } else {
        console.error('Failed to fetch forum activities:', response.status)
        setTopics([])
      }
    } catch (error) {
      console.error('Error loading forum data:', error)
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Forum Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Forum Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.hotTopics}</div>
            <div className="text-sm text-blue-500">Hot Topics</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.newPostsToday}</div>
            <div className="text-sm text-green-500">New Today</div>
          </div>
        </div>

        {/* Forum Threads */}
        <div className="space-y-3">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <ForumThreadItem key={topic.id} topic={topic} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No forum activity available</p>
              <p className="text-sm">Check back later for new discussions</p>
            </div>
          )}
        </div>

        {/* View All Link */}
        {topics.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <a
              href="/forum"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              View all discussions
              <TrendingUp className="h-4 w-4" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}