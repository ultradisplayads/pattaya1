"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TrendingUp, Hash, MapPin, Calendar, Building, Users, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
      const response = await fetch("http://localhost:1337/api/trending-topics?populate=*")
      
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
      Tourism: "bg-blue-100 text-blue-800",
      Nightlife: "bg-purple-100 text-purple-800",
      Events: "bg-green-100 text-green-800",
      Shopping: "bg-pink-100 text-pink-800",
      Culture: "bg-orange-100 text-orange-800",
      Food: "bg-yellow-100 text-yellow-800",
      Business: "bg-indigo-100 text-indigo-800",
      Entertainment: "bg-red-100 text-red-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (trendingItems.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-center text-gray-500 py-8">
            No trending topics available at the moment.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
          Trending Now
          <Badge variant="secondary" className="ml-2 bg-red-500 text-white animate-pulse">
            <Users className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
          {trendingItems.map((item, index) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-white/70 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <div className="text-gray-600 group-hover:text-blue-600 transition-colors">{getIcon(item.type)}</div>
                  <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(item.growth)}
                  <span
                    className={`text-xs font-bold ${
                      item.growth > 0 ? "text-green-600" : item.growth < 0 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {Math.abs(item.growth).toFixed(1)}%
                  </span>
                </div>
              </div>

              <h4 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>

              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={`text-xs ${getCategoryColor(item.category)}`}>
                  {item.category}
                </Badge>
                <span className="text-xs text-gray-500 font-mono">{item.posts.toLocaleString()}</span>
              </div>

              {/* Growth bar */}
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    item.growth > 0 ? "bg-green-500" : item.growth < 0 ? "bg-red-500" : "bg-gray-400"
                  }`}
                  style={{ width: `${Math.min(Math.abs(item.growth), 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-center">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">View All Trending →</button>
        </div>
      </CardContent>
    </Card>
  )
}
