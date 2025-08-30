"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, ExternalLink, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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
      const response = await fetch("http://localhost:1337/api/breaking-news-plural?sort=PublishedTimestamp:desc&pagination[limit]=10")
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
      const response = await fetch("http://localhost:1337/api/advertisements?filters[WidgetTarget][$eq]=breaking-news&filters[Active][$eq]=true&sort=PublishedTimestamp:desc&pagination[limit]=5")
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
        return "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm"
      case "high":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm"
      case "medium":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm"
      default:
        return "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-sm"
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
      <Card className="top-row-widget bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse shadow-sm"></div>
            <span className="tracking-wide">BREAKING NEWS</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md animate-pulse"></div>
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-4/5 animate-pulse"></div>
            <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-md w-3/5 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentItem) {
    return (
      <Card className="top-row-widget bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"></div>
            <span className="tracking-wide">BREAKING NEWS</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full mx-auto mb-4 animate-pulse"></div>
            <p className="text-sm text-slate-500 font-medium">No news available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="top-row-widget breaking-news-widget bg-white/90 backdrop-blur-sm border border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-3 tracking-wide">
            <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"></div>
            <span>BREAKING NEWS</span>
            {            allItems.some(item => 
              "Title" in item && 
              !("Sponsor" in item) && 
              (item as BreakingNews).IsBreaking
            ) && (
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 font-bold shadow-sm">
                LIVE
              </Badge>
            )}
          </CardTitle>
          
          {allItems.length > 1 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToPrevious} 
                className="h-8 w-8 p-0 hover:bg-slate-100/80 transition-colors duration-200 rounded-full"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </Button>
              <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100/60 rounded-full font-medium min-w-[3rem] text-center">
                {currentIndex + 1}/{allItems.length}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToNext} 
                className="h-8 w-8 p-0 hover:bg-slate-100/80 transition-colors duration-200 rounded-full"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isAdvertisement ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 shadow-sm">
                SPONSORED
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open((currentItem as Advertisement).attributes.URL, "_blank")}
                className="h-8 w-8 p-0 hover:bg-slate-100/80 transition-colors duration-200 rounded-full"
              >
                <ExternalLink className="w-4 h-4 text-slate-600" />
              </Button>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight mb-3">
                {(currentItem as Advertisement).attributes.Tiltle}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {(currentItem as Advertisement).attributes.Content}
              </p>
            </div>
            
            <div className="text-xs text-slate-500 pt-3 border-t border-slate-200/60 font-medium">
              Sponsored by <span className="font-bold text-slate-700">{(currentItem as Advertisement).attributes.Sponsor}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                              <Badge className={`text-xs font-bold px-3 py-1 ${getSeverityColor((currentItem as BreakingNews).Severity)}`}>
                {(currentItem as BreakingNews).Category}
              </Badge>
              {(currentItem as BreakingNews).IsBreaking && (
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 shadow-sm">
                    <Zap className="w-3 h-3 mr-1" />
                    BREAKING
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo((currentItem as BreakingNews).PublishedTimestamp)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open((currentItem as BreakingNews).URL, "_blank")}
                  className="h-8 w-8 p-0 hover:bg-slate-100/80 transition-colors duration-200 rounded-full"
                >
                  <ExternalLink className="w-4 h-4 text-slate-600" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight mb-3">
                {(currentItem as BreakingNews).Title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {(currentItem as BreakingNews).Summary}
              </p>
            </div>

            <div className="text-xs text-slate-500 pt-3 border-t border-slate-200/60 font-medium">
              Source: <span className="font-bold text-slate-700">{(currentItem as BreakingNews).Source}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
