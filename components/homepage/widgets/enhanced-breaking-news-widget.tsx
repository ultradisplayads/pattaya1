"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, ExternalLink, Zap, ChevronLeft, ChevronRight, Newspaper } from "lucide-react"
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
  imageUrl?: string
}

interface Advertisement {
  id: string
  title: string
  content: string
  url: string
  imageUrl?: string
  sponsor: string
}

export function EnhancedBreakingNewsWidget() {
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
          url: "/business/pattaya-beach-resort",
          imageUrl: "/placeholder.svg?height=40&width=60&text=Resort",
          sponsor: "Pattaya Beach Resort",
        },
        {
          id: "ad2",
          title: "Best Thai Restaurant",
          content: "Authentic Thai cuisine in the heart of Pattaya. Fresh ingredients, traditional recipes.",
          url: "/business/thai-garden-restaurant",
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
      url: "/news/new-tourist-attraction-opens",
      isBreaking: true,
      imageUrl: "/placeholder.svg?height=80&width=120&text=Attraction",
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
      url: "/news/beach-road-construction-update",
      isBreaking: false,
      imageUrl: "/placeholder.svg?height=80&width=120&text=Traffic",
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
      url: "/weather/heavy-rain-alert",
      isBreaking: false,
      imageUrl: "/placeholder.svg?height=80&width=120&text=Weather",
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
      url: "/attractions/underwater-world-aquarium",
      isBreaking: false,
      imageUrl: "/placeholder.svg?height=80&width=120&text=Aquarium",
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
      url: "/events/songkran-2024-celebrations",
      isBreaking: false,
      imageUrl: "/placeholder.svg?height=80&width=120&text=Festival",
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

  const handleItemClick = () => {
    if (currentItem) {
      const url = isAdvertisement ? (currentItem as Advertisement).url : (currentItem as BreakingNews).url
      window.open(url, "_blank")
    }
  }

  if (loading) {
    return (
      <Card className="top-row-widget h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Breaking News</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentItem) {
    return (
      <Card className="top-row-widget h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Breaking News</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500">
            <Newspaper className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No news available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="top-row-widget h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleItemClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Breaking News</span>
            <Badge className="bg-red-500 text-white text-xs animate-pulse">LIVE</Badge>
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <span className="text-xs text-gray-500 px-1">
              {currentIndex + 1}/{allItems.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isAdvertisement ? (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <Badge className="bg-blue-100 text-blue-800 text-xs">SPONSORED</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open((currentItem as Advertisement).url, "_blank")
                }}
                className="h-5 w-5 p-0"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex space-x-3">
              {(currentItem as Advertisement).imageUrl && (
                <img
                  src={(currentItem as Advertisement).imageUrl || "/placeholder.svg"}
                  alt={(currentItem as Advertisement).title}
                  className="w-16 h-12 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {(currentItem as Advertisement).title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{(currentItem as Advertisement).content}</p>
                <div className="text-xs text-gray-500">
                  by <span className="font-medium">{(currentItem as Advertisement).sponsor}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
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
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open((currentItem as BreakingNews).url, "_blank")
                  }}
                  className="h-5 w-5 p-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-3">
              {(currentItem as BreakingNews).imageUrl && (
                <img
                  src={(currentItem as BreakingNews).imageUrl || "/placeholder.svg"}
                  alt={(currentItem as BreakingNews).title}
                  className="w-16 h-12 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {(currentItem as BreakingNews).title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{(currentItem as BreakingNews).summary}</p>
                <div className="text-xs text-gray-500">Source: {(currentItem as BreakingNews).source}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
