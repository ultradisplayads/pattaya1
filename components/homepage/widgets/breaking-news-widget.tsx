"use client"

import { useState, useEffect } from "react"
import { Clock, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buildApiUrl } from "@/lib/strapi-config"

interface BreakingNews {
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
}

interface Advertisement {
  id: number
  attributes: {
    Tiltle: string
    Content: string
    URL: string
    Image?: {
      data: {
        id: number
        attributes: {
          url: string
          name: string
        }
      }
    }
    Sponsor: string
    WidgetTarget: string
    Active: boolean
    PublishedTimestamp: string
    createdAt: string
    updatedAt: string
  }
}

interface StrapiResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
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

    // Auto-rotate every 10 seconds for premium experience
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const totalItems = news.length + (showAds ? advertisements.length : 0)
        return totalItems > 0 ? (prev + 1) % totalItems : 0
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [news.length, advertisements.length, showAds])

  const loadBreakingNews = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl("breaking-news-plural?sort=PublishedTimestamp:desc&pagination[limit]=10"))
      if (response.ok) {
        const data: StrapiResponse<BreakingNews> = await response.json()
        setNews(data.data || [])
      } else {
        console.error("Failed to load breaking news:", response.status)
        setNews([])
      }
    } catch (error) {
      console.error("Failed to load breaking news:", error)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  const loadAdvertisements = async () => {
    try {
      const response = await fetch(buildApiUrl("advertisements?filters[WidgetTarget][$eq]=breaking-news&filters[Active][$eq]=true&sort=PublishedTimestamp:desc&pagination[limit]=5"))
      if (response.ok) {
        const data: StrapiResponse<Advertisement> = await response.json()
        setAdvertisements(data.data || [])
        setShowAds(data.data.length > 0)
      } else {
        console.error("Failed to load advertisements:", response.status)
        setAdvertisements([])
        setShowAds(false)
      }
    } catch (error) {
      console.error("Failed to load advertisements:", error)
      setAdvertisements([])
      setShowAds(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-600 border-red-200"
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
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
  const isAdvertisement = currentItem && "attributes" in currentItem && "Sponsor" in currentItem.attributes

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + allItems.length) % allItems.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allItems.length)
  }

  if (loading) {
    return (
      <Card className="top-row-widget bg-white/95 backdrop-blur-xl border-0 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-[15px] font-medium text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Breaking News</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-5 bg-gray-100 rounded-md animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded-md w-4/5 animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded-md w-3/5 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentItem) {
    return (
      <Card className="top-row-widget bg-white/95 backdrop-blur-xl border-0 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-[15px] font-medium text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span className="font-medium">Breaking News</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-8 h-8 bg-gray-100 rounded-full mx-auto mb-3 animate-pulse"></div>
            <p className="text-sm text-gray-500 font-medium">No news available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="top-row-widget breaking-news-widget bg-white/95 backdrop-blur-xl border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[15px] font-medium text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span className="font-medium">Breaking News</span>
            {allItems.some(item => 
              "Title" in item && 
              !("Sponsor" in item) && 
              (item as BreakingNews).IsBreaking
            ) && (
              <Badge className="bg-red-500/10 text-red-600 text-[11px] px-2 py-0.5 font-medium border border-red-200 rounded-full">
                Live
              </Badge>
            )}
          </CardTitle>
          
          {allItems.length > 1 && (
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToPrevious} 
                className="h-7 w-7 p-0 hover:bg-gray-100/80 transition-colors duration-200 rounded-full"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
              </Button>
              <span className="text-[11px] text-gray-400 px-2 py-1 bg-gray-50 rounded-full font-medium min-w-[2.5rem] text-center">
                {currentIndex + 1}/{allItems.length}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToNext} 
                className="h-7 w-7 p-0 hover:bg-gray-100/80 transition-colors duration-200 rounded-full"
              >
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isAdvertisement ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-500/10 text-blue-600 text-[11px] px-2 py-0.5 font-medium border border-blue-200 rounded-full">
                Sponsored
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open((currentItem as Advertisement).attributes.URL, "_blank")}
                className="h-7 w-7 p-0 hover:bg-gray-100/80 transition-colors duration-200 rounded-full"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </div>
            
            <div>
              <h4 className="text-[15px] font-semibold text-gray-900 leading-tight mb-2">
                {(currentItem as Advertisement).attributes.Tiltle}
              </h4>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {(currentItem as Advertisement).attributes.Content}
              </p>
            </div>
            
            <div className="text-[11px] text-gray-400 pt-3 border-t border-gray-100 font-medium">
              Sponsored by <span className="font-semibold text-gray-600">{(currentItem as Advertisement).attributes.Sponsor}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={`text-[11px] px-2 py-0.5 font-medium border rounded-full ${getSeverityColor((currentItem as BreakingNews).Severity)}`}>
                  {(currentItem as BreakingNews).Category}
                </Badge>
                {(currentItem as BreakingNews).IsBreaking && (
                  <Badge className="bg-red-500/10 text-red-600 text-[11px] px-2 py-0.5 font-medium border border-red-200 rounded-full">
                    Breaking
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo((currentItem as BreakingNews).PublishedTimestamp)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open((currentItem as BreakingNews).URL, "_blank")}
                  className="h-7 w-7 p-0 hover:bg-gray-100/80 transition-colors duration-200 rounded-full"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-[15px] font-semibold text-gray-900 leading-tight mb-2">
                {(currentItem as BreakingNews).Title}
              </h4>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {(currentItem as BreakingNews).Summary}
              </p>
            </div>

            <div className="text-[11px] text-gray-400 pt-3 border-t border-gray-100 font-medium">
              Source: <span className="font-semibold text-gray-600">{(currentItem as BreakingNews).Source}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
