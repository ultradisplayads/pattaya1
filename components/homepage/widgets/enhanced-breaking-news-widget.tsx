"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, ExternalLink, Zap, ChevronLeft, ChevronRight, Newspaper } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface StrapiBreakingNews {
  id: number
  Title: string
  Summary: string
  Severity: "low" | "medium" | "high" | "critical"
  Category: string
  Source: string
  URL: string
  IsBreaking: boolean
  PublishedTimestamp: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface StrapiAdvertisement {
  id: number
  Tiltle: string
  Content: string
  URL: string
  Image?: {
    id: number
    name: string
    url: string
    formats?: {
      thumbnail?: { url: string }
      small?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
  }
  Sponsor: string
  WidgetTarget: string
  Active: boolean
  PublishedTimestamp: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function EnhancedBreakingNewsWidget() {
  const [news, setNews] = useState<StrapiBreakingNews[]>([])
  const [advertisements, setAdvertisements] = useState<StrapiAdvertisement[]>([])
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
      // Call Strapi API directly
      const response = await fetch("http://localhost:1337/api/breaking-news-plural?sort=PublishedTimestamp:desc")
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          setNews(data.data)
        } else {
          setNews([])
        }
      } else {
        console.error("Failed to load breaking news from Strapi:", response.status)
        setNews([])
      }
    } catch (error) {
      console.error("Failed to load breaking news from Strapi:", error)
      setNews([])
    }
  }

  const loadAdvertisements = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/advertisements?filters[WidgetTarget][$eq]=breaking-news&filters[Active][$eq]=true&sort=PublishedTimestamp:desc")
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          setAdvertisements(data.data)
        } else {
          setAdvertisements([])
        }
      } else {
        console.error("Failed to load advertisements from Strapi:", response.status)
        setAdvertisements([])
      }
    } catch (error) {
      console.error("Failed to load advertisements from Strapi:", error)
      setAdvertisements([])
    } finally {
      setLoading(false)
    }
  }

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
  const isAdvertisement = currentItem && "Sponsor" in currentItem

  if (!currentItem) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="text-center text-gray-500 py-8">
            No breaking news available at the moment.
          </div>
        </CardContent>
      </Card>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + allItems.length) % allItems.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allItems.length)
  }

  const handleItemClick = () => {
    if (currentItem) {
      const url = isAdvertisement ? (currentItem as StrapiAdvertisement).URL : (currentItem as StrapiBreakingNews).URL
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
                  window.open((currentItem as StrapiAdvertisement).URL, "_blank")
                }}
                className="h-5 w-5 p-0"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex space-x-3">
              {(currentItem as StrapiAdvertisement).Image && (
                <img
                  src={`http://localhost:1337${(currentItem as StrapiAdvertisement).Image!.url}`}
                  alt={(currentItem as StrapiAdvertisement).Tiltle}
                  className="w-16 h-12 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {(currentItem as StrapiAdvertisement).Tiltle}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{(currentItem as StrapiAdvertisement).Content}</p>
                <div className="text-xs text-gray-500">
                  by <span className="font-medium">{(currentItem as StrapiAdvertisement).Sponsor}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={`text-xs ${getSeverityColor((currentItem as StrapiBreakingNews).Severity)}`}>
                  {(currentItem as StrapiBreakingNews).Category}
                </Badge>
                {(currentItem as StrapiBreakingNews).IsBreaking && (
                  <Badge className="bg-red-600 text-white text-xs animate-pulse">
                    <Zap className="w-2 h-2 mr-1" />
                    BREAKING
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo((currentItem as StrapiBreakingNews).PublishedTimestamp)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open((currentItem as StrapiBreakingNews).URL, "_blank")
                  }}
                  className="h-5 w-5 p-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {(currentItem as StrapiBreakingNews).Title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{(currentItem as StrapiBreakingNews).Summary}</p>
                <div className="text-xs text-gray-500">Source: {(currentItem as StrapiBreakingNews).Source}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
