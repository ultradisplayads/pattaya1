"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Users, TrendingUp, Clock, Eye, ThumbsUp, MessageCircle, Star, Zap, Users2, Activity } from "lucide-react"
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
      <Card className="w-full bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/40 border-0 shadow-xl rounded-3xl overflow-hidden backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600/95 via-cyan-500/95 to-teal-500/95 border-0 p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-teal-500/20 animate-pulse"></div>
          <CardTitle className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
                <MessageSquare className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white drop-shadow-sm">🏖️ Pattaya Community</h3>
                <p className="text-sm text-blue-100 font-medium">Loading discussions...</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/90 backdrop-blur-sm rounded-xl shadow-lg border border-green-400/30">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-green-200 rounded-full absolute animate-pulse"></div>
              <span className="text-sm font-bold text-white drop-shadow-sm">LIVE</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 overflow-hidden">
            <div className="space-y-2 p-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-gray-100 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded-lg w-3/4"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/40 border-0 shadow-xl rounded-3xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600/95 via-cyan-500/95 to-teal-500/95 border-0 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-teal-500/20 animate-pulse"></div>
        <CardTitle className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
              <MessageSquare className="h-5 w-5 text-white drop-shadow-sm" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white drop-shadow-sm">🏖️ Pattaya Community</h3>
              <p className="text-sm text-blue-100 font-medium">Live discussions & local insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/90 backdrop-blur-sm rounded-xl shadow-lg border border-green-400/30">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-green-200 rounded-full absolute animate-pulse"></div>
            <span className="text-sm font-bold text-white drop-shadow-sm">LIVE</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-gray-50/80 via-white/60 to-blue-50/40 border-b border-gray-200/30 p-4 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/40 hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:bg-orange-50/80 group">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2.5 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-md group-hover:shadow-lg transform group-hover:scale-110 transition-all duration-200">
                  <Zap className="h-4 w-4 text-white drop-shadow-sm" />
                </div>
              </div>
              <div className="text-xl font-black text-gray-800 mb-1 group-hover:text-orange-600 transition-colors duration-200">{stats.hotTopics}</div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">🔥 Hot Topics</div>
            </div>
            <div className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/40 hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:bg-green-50/80 group">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-md group-hover:shadow-lg transform group-hover:scale-110 transition-all duration-200">
                  <Activity className="h-4 w-4 text-white drop-shadow-sm" />
                </div>
              </div>
              <div className="text-xl font-black text-gray-800 mb-1 group-hover:text-green-600 transition-colors duration-200">{stats.newPostsToday}</div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">⚡ New Today</div>
            </div>
            <div className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/40 hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:bg-blue-50/80 group">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2.5 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-md group-hover:shadow-lg transform group-hover:scale-110 transition-all duration-200">
                  <Users2 className="h-4 w-4 text-white drop-shadow-sm" />
                </div>
              </div>
              <div className="text-xl font-black text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200">{stats.activeUsers}</div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">👥 Active Users</div>
            </div>
            <div className="text-center p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/40 hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:bg-purple-50/80 group">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2.5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-md group-hover:shadow-lg transform group-hover:scale-110 transition-all duration-200">
                  <Star className="h-4 w-4 text-white drop-shadow-sm" />
                </div>
              </div>
              <div className="text-xl font-black text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-200">{stats.totalPosts}</div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">⭐ Total Posts</div>
            </div>
          </div>
        </div>

        <div className="min-h-48 max-h-64 md:max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50 hover:scrollbar-thumb-blue-400 transition-colors duration-200">
          <div className="space-y-2 p-4">
            {topics.length > 0 ? (
              topics.map((topic, index) => (
                <div 
                  key={topic.id} 
                  className="group animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-md hover:shadow-xl hover:border-blue-300/60 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
                    <ForumThreadItem topic={topic} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl mb-4 shadow-inner border border-gray-100 animate-bounce">
                  <MessageCircle className="h-12 w-12 text-blue-300" />
                </div>
                <p className="text-base font-bold text-gray-700 mb-2">🏝️ No discussions yet</p>
                <p className="text-sm text-gray-500 text-center max-w-xs">Be the first to start a conversation about Pattaya!</p>
                <div className="mt-6 flex gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {topics.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50/80 via-white/60 to-blue-50/40 backdrop-blur-sm border-t border-gray-200/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full absolute animate-pulse"></div>
                <span className="font-semibold ml-2">🔄 Live updates every 2 minutes</span>
              </div>
              <a
                href="/forum"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 border border-blue-400/50"
              >
                <TrendingUp className="h-4 w-4" />
                Explore Pattaya Forum
              </a>
            </div>
          </div>
        )}
      </CardContent>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgb(59 130 246 / 0.6);
        }
      `}</style>
    </Card>
  )
}