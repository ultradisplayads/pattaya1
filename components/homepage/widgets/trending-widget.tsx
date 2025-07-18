"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TrendingUp, Hash, MapPin, Calendar, Building, Users, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TrendingItem {
  id: string
  title: string
  type: "hashtag" | "location" | "event" | "business" | "topic"
  posts: number
  growth: number
  category: string
  icon: React.ReactNode
}

export function TrendingWidget() {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrendingData()
    const interval = setInterval(loadTrendingData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const loadTrendingData = async () => {
    try {
      // Simulate API call - replace with actual trending data
      const mockData: TrendingItem[] = [
        {
          id: "1",
          title: "#PattayaBeach",
          type: "hashtag",
          posts: 2847,
          growth: 23.5,
          category: "Tourism",
          icon: <Hash className="w-3 h-3" />,
        },
        {
          id: "2",
          title: "Walking Street",
          type: "location",
          posts: 1923,
          growth: 18.2,
          category: "Nightlife",
          icon: <MapPin className="w-3 h-3" />,
        },
        {
          id: "3",
          title: "Songkran Festival",
          type: "event",
          posts: 3421,
          growth: 45.7,
          category: "Events",
          icon: <Calendar className="w-3 h-3" />,
        },
        {
          id: "4",
          title: "Terminal 21 Pattaya",
          type: "business",
          posts: 892,
          growth: 12.3,
          category: "Shopping",
          icon: <Building className="w-3 h-3" />,
        },
        {
          id: "5",
          title: "#JomtienBeach",
          type: "hashtag",
          posts: 1567,
          growth: 31.8,
          category: "Tourism",
          icon: <Hash className="w-3 h-3" />,
        },
        {
          id: "6",
          title: "Sanctuary of Truth",
          type: "location",
          posts: 1234,
          growth: 8.9,
          category: "Culture",
          icon: <MapPin className="w-3 h-3" />,
        },
        {
          id: "7",
          title: "Pattaya Music Festival",
          type: "event",
          posts: 2156,
          growth: 67.4,
          category: "Events",
          icon: <Calendar className="w-3 h-3" />,
        },
        {
          id: "8",
          title: "Floating Market",
          type: "business",
          posts: 743,
          growth: -5.2,
          category: "Tourism",
          icon: <Building className="w-3 h-3" />,
        },
        {
          id: "9",
          title: "#PattayaNightlife",
          type: "hashtag",
          posts: 3892,
          growth: 28.6,
          category: "Nightlife",
          icon: <Hash className="w-3 h-3" />,
        },
        {
          id: "10",
          title: "Nong Nooch Garden",
          type: "location",
          posts: 1089,
          growth: 15.7,
          category: "Tourism",
          icon: <MapPin className="w-3 h-3" />,
        },
      ]

      setTrendingItems(mockData)
    } catch (error) {
      console.error("Failed to load trending data:", error)
    } finally {
      setLoading(false)
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
    const colors = {
      Tourism: "bg-blue-100 text-blue-800",
      Nightlife: "bg-purple-100 text-purple-800",
      Events: "bg-green-100 text-green-800",
      Shopping: "bg-pink-100 text-pink-800",
      Culture: "bg-orange-100 text-orange-800",
      Food: "bg-yellow-100 text-yellow-800",
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
                  <div className="text-gray-600 group-hover:text-blue-600 transition-colors">{item.icon}</div>
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
                  className={`h-1 rounded-full transition-all duration-500 ${getGrowthColor(item.growth)}`}
                  style={{ width: `${Math.min(Math.abs(item.growth), 100)}%` }}
                />
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
