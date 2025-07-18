"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, ExternalLink, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BreakingNews {
  id: string
  title: string
  summary: string
  severity: "low" | "medium" | "high" | "critical"
  category: string
  timestamp: string
  source: string
  url: string
  isBreaking: boolean
}

interface Advertisement {
  id: string
  title: string
  content: string
  url: string
  imageUrl?: string
  sponsor: string
}

export function BreakingNewsWidget() {
  const [news, setNews] = useState<BreakingNews[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAds, setShowAds] = useState(true)

  useEffect(() => {
    loadBreakingNews()
    loadAdvertisements()

    // Auto-rotate every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const totalItems = news.length + (showAds ? advertisements.length : 0)
        return totalItems > 0 ? (prev + 1) % totalItems : 0
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [news.length, advertisements.length, showAds])

  const loadBreakingNews = async () => {
    try {
      const response = await fetch("/api/news/breaking")
      if (response.ok) {
        const data = await response.json()
        setNews(data.news || getFallbackNews())
      } else {
        setNews(getFallbackNews())
      }
    } catch (error) {
      console.error("Failed to load breaking news:", error)
      setNews(getFallbackNews())
    } finally {
      setLoading(false)
    }
  }

  const loadAdvertisements = async () => {
    try {
      const response = await fetch("/api/widgets/advertisements?widget=breaking-news")
      if (response.ok) {
        const data = await response.json()
        setAdvertisements(data.advertisements || [])
        setShowAds(data.enabled || false)
      }
    } catch (error) {
      console.error("Failed to load advertisements:", error)
      // Fallback ads for demo
      setAdvertisements([
        {
          id: "ad1",
          title: "Visit Pattaya Beach Resort",
          content: "Luxury beachfront accommodation with stunning ocean views. Book now for special rates!",
          url: "#",
          imageUrl: "/placeholder.svg?height=40&width=60&text=Resort",
          sponsor: "Pattaya Beach Resort",
        },
        {
          id: "ad2",
          title: "Best Thai Restaurant",
          content: "Authentic Thai cuisine in the heart of Pattaya. Fresh ingredients, traditional recipes.",
          url: "#",
          imageUrl: "/placeholder.svg?height=40&width=60&text=Food",
          sponsor: "Thai Garden Restaurant",
        },
      ])
    }
  }

  const getFallbackNews = (): BreakingNews[] => [
    {
      id: "1",
      title: "New Tourist Attraction Opens in Central Pattaya",
      summary:
        "State-of-the-art entertainment complex welcomes first visitors with grand opening ceremony featuring international performers and local cultural shows",
      severity: "medium",
      category: "Tourism",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      source: "Pattaya News",
      url: "#",
      isBreaking: true,
    },
    {
      id: "2",
      title: "Traffic Update: Beach Road Construction Phase 2",
      summary:
        "Major road improvements continue with temporary closures affecting main tourist areas. Alternative routes recommended for visitors",
      severity: "high",
      category: "Traffic",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      source: "City Hall",
      url: "#",
      isBreaking: false,
    },
    {
      id: "3",
      title: "Weather Alert: Heavy Rain Expected This Weekend",
      summary:
        "Monsoon conditions forecasted with potential flooding in low-lying areas. Tourists advised to plan indoor activities",
      severity: "medium",
      category: "Weather",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      source: "Weather Service",
      url: "#",
      isBreaking: false,
    },
    {
      id: "4",
      title: "New Underwater World Aquarium Grand Opening",
      summary:
        "Marine life sanctuary opens doors to public with interactive exhibits and educational programs for all ages",
      severity: "low",
      category: "Tourism",
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      source: "Tourism Board",
      url: "#",
      isBreaking: false,
    },
    {
      id: "5",
      title: "Festival Announcement: Songkran 2024 Celebrations",
      summary:
        "Traditional water festival dates confirmed with special events throughout the city including cultural performances",
      severity: "low",
      category: "Events",
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      source: "Cultural Department",
      url: "#",
      isBreaking: false,
    },
    {
      id: "6",
      title: "Public Transport Schedule Changes Effective Monday",
      summary: "New bus routes and extended operating hours to better serve tourist areas with improved connectivity",
      severity: "medium",
      category: "Transport",
      timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
      source: "Transport Authority",
      url: "#",
      isBreaking: false,
    },
    {
      id: "7",
      title: "Health Advisory: Dengue Prevention Campaign Launched",
      summary:
        "Health officials launch city-wide initiative to eliminate mosquito breeding sites and protect residents and tourists",
      severity: "high",
      category: "Health",
      timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      source: "Health Department",
      url: "#",
      isBreaking: false,
    },
    {
      id: "8",
      title: "Economic Update: Tourism Numbers Surge 25% This Month",
      summary:
        "Visitor arrivals show strong recovery with increased international bookings and positive economic indicators",
      severity: "low",
      category: "Economy",
      timestamp: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
      source: "Economic Bureau",
      url: "#",
      isBreaking: false,
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const allItems = [...news, ...(showAds ? advertisements : [])]
  const currentItem = allItems[currentIndex]
  const isAdvertisement = currentItem && "sponsor" in currentItem

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + allItems.length) % allItems.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allItems.length)
  }

  if (loading) {
    return (
      <Card className="top-row-widget">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Breaking News</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentItem) {
    return (
      <Card className="top-row-widget">
        <CardHeader>
          <CardTitle className="text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Breaking News</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-center text-gray-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
            <p className="text-sm">No news available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="top-row-widget breaking-news-widget">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Breaking News</span>
            <Badge className="bg-red-500 text-white text-xs animate-pulse">LIVE</Badge>
          </CardTitle>
          <div className="news-navigation">
            <Button variant="ghost" size="sm" onClick={goToPrevious} className="h-7 w-7 p-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-500 px-2">
              {currentIndex + 1}/{allItems.length}
            </span>
            <Button variant="ghost" size="sm" onClick={goToNext} className="h-7 w-7 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAdvertisement ? (
          <div className="advertisement-content">
            <div className="flex items-start justify-between mb-3">
              <Badge className="advertisement-badge">AD</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open((currentItem as Advertisement).url, "_blank")}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">{(currentItem as Advertisement).title}</h4>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{(currentItem as Advertisement).content}</p>
            <div className="text-xs text-gray-500">
              Sponsored by <span className="font-medium">{(currentItem as Advertisement).sponsor}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={`text-xs ${getSeverityColor((currentItem as BreakingNews).severity)}`}>
                  {(currentItem as BreakingNews).category}
                </Badge>
                {(currentItem as BreakingNews).isBreaking && (
                  <Badge className="bg-red-600 text-white text-xs animate-pulse">
                    <Zap className="w-2 h-2 mr-1" />
                    BREAKING
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo((currentItem as BreakingNews).timestamp)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open((currentItem as BreakingNews).url, "_blank")}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-relaxed">
              {(currentItem as BreakingNews).title}
            </h4>

            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {(currentItem as BreakingNews).summary}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>Source: {(currentItem as BreakingNews).source}</span>
              <span>
                {currentIndex + 1} of {allItems.length}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
