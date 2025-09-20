"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TrendingUp, Hash, MapPin, Calendar, Building, Users, ArrowUp, ArrowDown, Minus, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SponsorshipBanner } from "@/components/widgets/sponsorship-banner"
import searchTracker from "@/lib/search-tracking"

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
    // Refresh every 30 seconds for more real-time updates
    const interval = setInterval(loadTrendingData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadTrendingData = async () => {
    try {
      setLoading(true)
      
      // Only load dynamic trending data from search analytics
      console.log('🔄 Loading dynamic trending data from search analytics...')
      const dynamicTrending = await searchTracker.getTrendingTopics({
        limit: 10,
        timeWindow: '24h'
      })
      
      console.log('📊 Dynamic trending response:', dynamicTrending)
      
      if (dynamicTrending.success && dynamicTrending.data && dynamicTrending.data.length > 0) {
        console.log('✅ Using dynamic trending data:', dynamicTrending.data)
        setTrendingItems(dynamicTrending.data)
      } else {
        console.log('📊 No trending data available yet - start searching to see trending topics!')
        setTrendingItems([])
      }
    } catch (error) {
      console.error("❌ Failed to load dynamic trending data:", error)
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

  const handleTrendingClick = async (item: StrapiTrendingTopic) => {
    try {
      // Track the trending topic click
      await searchTracker.trackSearchQuery(item.title, {
        category: item.category,
        source: 'trending-widget',
        component: 'trending-click'
      })
      
      // Navigate to search results
      if (item.url) {
        window.location.href = item.url
      } else {
        window.location.href = `/search?q=${encodeURIComponent(item.title)}`
      }
    } catch (error) {
      console.error('Error tracking trending click:', error)
      // Still navigate even if tracking fails
      if (item.url) {
        window.location.href = item.url
      } else {
        window.location.href = `/search?q=${encodeURIComponent(item.title)}`
      }
    }
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
          <div className="text-center text-gray-500 py-12">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm font-medium mb-2">No trending topics yet</p>
            <p className="text-xs text-gray-400">
              Start searching to see what's trending!<br/>
              Trending topics update every 15 minutes.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Global Sponsorship Banner */}
      <SponsorshipBanner widgetType="trending" />
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-base font-medium text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-gray-600" />
            Trending Now
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadTrendingData}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Refresh trending topics"
            >
              <RefreshCw className="h-3 w-3 text-gray-500" />
            </button>
            <Badge className="bg-green-50 text-green-700 text-xs font-medium border-0">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
              Live
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {trendingItems.map((item, index) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-gray-50/50 hover:bg-white transition-all duration-200 cursor-pointer group border border-transparent hover:border-gray-100"
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => handleTrendingClick(item)}
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

// Tailwind classes to add colorful glassmorphism background:
const glassGradientBg = `
  bg-gradient-to-tr
  from-red-400/20
  via-pink-400/20
  to-orange-400/20
  backdrop-blur-lg
  border
  border-white/30
  shadow-lg
  shadow-indigo-400/30
  rounded-3xl
  transition-shadow
  duration-500
  hover:shadow-indigo-500/50
`
