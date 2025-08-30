"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  MessageCircle,
  Users,
  TrendingUp,
  Pin,
  Clock,
  Eye,
  ThumbsUp,
  Search,
  Plus,
  Utensils,
  Calendar,
  Plane,
  Heart,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/* --- NEW: icon resolver -------------------------------------- */
const iconMap: Record<string, React.ElementType> = {
  "message-circle": MessageCircle,
  utensils: Utensils,
  calendar: Calendar,
  plane: Plane,
  heart: Heart,
  home: Home,
}
/* -------------------------------------------------------------- */

export function ForumPage() {
  const [topics, setTopics] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    loadForumData()
  }, [])

  const loadForumData = async () => {
    try {
      setLoading(true)
      const [topicsRes, categoriesRes] = await Promise.all([
        fetch("/api/forum/topics"), 
        fetch("/api/forum/categories")
      ])

      if (topicsRes.ok && categoriesRes.ok) {
        const topicsData = await topicsRes.json()
        const categoriesData = await categoriesRes.json()
        
        if (topicsData.error) {
          console.error("Topics API error:", topicsData.error)
        }
        if (categoriesData.error) {
          console.error("Categories API error:", categoriesData.error)
        }
        
        setTopics(topicsData.data || [])
        setCategories(categoriesData.data || [])
      } else {
        console.error("Failed to load forum data:", {
          topics: topicsRes.status,
          categories: categoriesRes.status
        })
      }
    } catch (error) {
      console.error("Failed to load forum data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      !searchTerm ||
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = activeCategory === "all" || topic.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const stats = {
    totalTopics: topics.length,
    totalPosts: topics.reduce((sum, topic) => sum + topic.replies, 0),
    activeUsers: 1247,
    onlineNow: 89,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h1>
              <p className="text-gray-600">Connect with locals and travelers in Pattaya</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Topic
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalTopics}</div>
                <div className="text-sm text-gray-600">Topics</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalPosts}</div>
                <div className="text-sm text-gray-600">Posts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.activeUsers}</div>
                <div className="text-sm text-gray-600">Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.onlineNow}</div>
                <div className="text-sm text-gray-600">Online Now</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory("all")}
                >
                  All Topics
                </Button>
                {categories.map((category) => {
                  /* NEW: pick the correct icon component or a default */
                  const Icon = iconMap[category.icon] ?? MessageCircle

                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.slug ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(category.slug)}
                    >
                      {/* use Icon component instead of category.icon */}
                      <Icon className="h-4 w-4 mr-2" />
                      {category.name}
                      <Badge variant="secondary" className="ml-auto">
                        {category.topicCount}
                      </Badge>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Online Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Online Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                        <AvatarFallback>U{i + 1}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">User{i + 1}</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="recent" className="space-y-6">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="pinned">Pinned</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                {filteredTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </TabsContent>

              <TabsContent value="trending" className="space-y-4">
                {filteredTopics
                  .filter((topic) => topic.trending)
                  .map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
              </TabsContent>

              <TabsContent value="pinned" className="space-y-4">
                {filteredTopics
                  .filter((topic) => topic.pinned)
                  .map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopicCard({ topic }: { topic: any }) {
  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={topic.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{topic.author.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {topic.pinned && <Pin className="h-4 w-4 text-blue-600" />}
                {topic.trending && <TrendingUp className="h-4 w-4 text-orange-500" />}
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {topic.title}
                </h3>
              </div>
              <Badge variant="outline">{topic.category}</Badge>
            </div>

            <p className="text-gray-600 mb-3 line-clamp-2">{topic.content}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{topic.replies}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{topic.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{topic.likes}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span>by {topic.author.name}</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{topic.lastActivity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
