"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TrendingUp, Hash, MapPin, Calendar, Building, Users, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buildApiUrl } from "@/lib/strapi-config"

interface StrapiTrendingTopic {
  id: number
  title: string
  type: string
  posts: number
  growth: number
  category: string
  icon: string
  description: string
  url: string | null
}

export function TrendingWidget() {
  const [trendingItems, setTrendingItems] = useState<StrapiTrendingTopic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrendingData()
    const interval = setInterval(loadTrendingData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const loadTrendingData = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl("trending-topics?populate=*"))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Trending data received:', data)
      
      if (data.data && Array.isArray(data.data)) {
        const mappedData = data.data.map((item: any) => ({
          id: item.id,
          title: item.Title,
          type: item.Type,
          posts: item.Posts,
          growth: item.Growth,
          category: item.Category,
          icon: item.Icon,
          description: item.Description,
          url: item.URL,
        }))
        setTrendingItems(mappedData)
      } else {
        console.warn('No trending data found or invalid format')
        setTrendingItems([])
      }
    } catch (error) {
      console.error("Failed to load trending data from Strapi:", error)
      setTrendingItems([])
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'hashtag': return <Hash className="w-3 h-3" />
      case 'location': return <MapPin className="w-3 h-3" />
      case 'event': return <Calendar className="w-3 h-3" />
      case 'business': return <Building className="w-3 h-3" />
      case 'topic': return <TrendingUp className="w-3 h-3" />
      default: return <Hash className="w-3 h-3" />
    }
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp className="w-3 h-3 text-green-500" />
    if (growth < 0) return <ArrowDown className="w-3 h-3 text-red-500" />
    return <Minus className="w-3 h-3 text-gray-400" />
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 20) return "bg-green-500"
    if (growth > 10) return "bg-yellow-500"
    if (growth > 0) return "bg-blue-500"
    return "bg-red-500"
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Tourism: "bg-blue-50 text-blue-700",
      Nightlife: "bg-purple-50 text-purple-700",
      Events: "bg-green-50 text-green-700",
      Shopping: "bg-pink-50 text-pink-700",
      Culture: "bg-orange-50 text-orange-700",
      Food: "bg-yellow-50 text-yellow-700",
      Business: "bg-indigo-50 text-indigo-700",
      Entertainment: "bg-red-50 text-red-700",
    }
    return colors[category] || "bg-gray-50 text-gray-700"
  }

  if (loading) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-100 rounded-full w-32"></div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-50 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (trendingItems.length === 0) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader className="pb-4 px-6 pt-6">
          <CardTitle className="text-base font-medium text-gray-900 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-gray-600" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="text-center text-gray-400 py-12">
            <p className="text-sm font-medium">No trending topics available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-base font-medium text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-gray-600" />
            Trending Now
          </div>
          <Badge className="bg-green-50 text-green-700 text-xs font-medium border-0">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {trendingItems.map((item, index) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-gray-50/50 hover:bg-white transition-all duration-200 cursor-pointer group border border-transparent hover:border-gray-100"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-gray-500 group-hover:text-gray-700 transition-colors">{getIcon(item.type)}</div>
                  <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(item.growth)}
                  <span
                    className={`text-xs font-medium ${
                      item.growth > 0 ? "text-green-600" : item.growth < 0 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {Math.abs(item.growth).toFixed(1)}%
                  </span>
                </div>
              </div>

              <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                {item.title}
              </h4>

              <div className="flex items-center justify-between mb-3">
                <Badge className={`text-xs ${getCategoryColor(item.category)} border-0 font-medium`}>
                  {item.category}
                </Badge>
                <span className="text-xs text-gray-400 font-medium">{item.posts.toLocaleString()}</span>
              </div>

              {/* Growth bar */}
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    item.growth > 0 ? "bg-green-500" : item.growth < 0 ? "bg-red-500" : "bg-gray-300"
                  }`}
                  style={{ width: `${Math.min(Math.abs(item.growth), 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-xs text-gray-600 hover:text-gray-800 font-medium transition-colors">
            View All Trending →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
