"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, ExternalLink, Zap, ChevronLeft, ChevronRight, Newspaper } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"
import { useStrapiArticles } from '@/hooks/use-strapi-articles'

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
  
  // Use Strapi articles as fallback
  const { articles: strapiArticles } = useStrapiArticles()

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

  // Re-run when Strapi articles are loaded
  useEffect(() => {
    if (strapiArticles.length > 0 && news.length === 0 && !loading) {
      loadBreakingNews()
    }
  }, [strapiArticles.length, news.length, loading])

  const loadBreakingNews = async () => {
    try {
      setLoading(true)
      const response = await fetch(buildApiUrl("breaking-news-plural?sort=PublishedTimestamp:desc"))
      if (response.ok) {
        const data = await response.json()
        
        if (data.data && data.data.length > 0) {
          setNews(data.data)
        } else {
          // Fallback to Strapi articles if no breaking news found
          if (strapiArticles.length > 0) {
            const transformedArticles = strapiArticles.slice(0, 5).map(article => ({
              id: article.id,
              Title: article.title || 'Untitled Article',
              Summary: article.description || '',
              Severity: 'medium' as const,
              Category: article.category?.name || 'News',
              Source: article.author?.name || 'Pattaya1',
              URL: `/articles/${article.slug || article.id}`,
              IsBreaking: false,
              PublishedTimestamp: article.publishedAt || article.createdAt,
              createdAt: article.createdAt,
              updatedAt: article.updatedAt,
              publishedAt: article.publishedAt
            }));
            setNews(transformedArticles);
          } else {
            setNews([])
          }
        }
      } else {
        console.error("Failed to load breaking news from Strapi:", response.status)
        // Fallback to Strapi articles if breaking news fails
        if (strapiArticles.length > 0) {
          const transformedArticles = strapiArticles.slice(0, 5).map(article => ({
            id: article.id,
            Title: article.title || 'Untitled Article',
            Summary: article.description || '',
            Severity: 'medium' as const,
            Category: article.category?.name || 'News',
            Source: article.author?.name || 'Pattaya1',
            URL: `/articles/${article.slug || article.id}`,
            IsBreaking: false,
            PublishedTimestamp: article.publishedAt || article.createdAt,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            publishedAt: article.publishedAt
          }));
          setNews(transformedArticles);
        } else {
          setNews([])
        }
      }
    } catch (error) {
      console.error("Failed to load breaking news from Strapi:", error)
      // Fallback to Strapi articles
      if (strapiArticles.length > 0) {
        const transformedArticles = strapiArticles.slice(0, 5).map(article => ({
          id: article.id,
          Title: article.title || 'Untitled Article',
          Summary: article.description || '',
          Severity: 'medium' as const,
          Category: article.category?.name || 'News',
          Source: article.author?.name || 'Pattaya1',
          URL: `/articles/${article.slug || article.id}`,
          IsBreaking: false,
          PublishedTimestamp: article.publishedAt || article.createdAt,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          publishedAt: article.publishedAt
        }));
        setNews(transformedArticles);
      } else {
        setNews([])
      }
    } finally {
      setLoading(false)
    }
  }

  const loadAdvertisements = async () => {
    try {
      const response = await fetch(buildApiUrl("advertisements?filters[WidgetTarget][$eq]=breaking-news&filters[Active][$eq]=true&sort=PublishedTimestamp:desc"))
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
        return "bg-red-500/10 text-red-600 border-red-200"
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200"
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-200"
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
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0_0_0_/0.1),0_1px_2px_-1px_rgb(0_0_0_/0.1)] rounded-2xl">
        <CardContent className="p-4">
          <div className="text-center text-gray-400 py-8">
            <Newspaper className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No news available</p>
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
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0_0_0_/0.1),0_1px_2px_-1px_rgb(0_0_0_/0.1)] rounded-2xl">
        <CardHeader className="pb-3 px-5 pt-5">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-900">Breaking News</span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-100 rounded-lg w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded-lg w-1/2"></div>
            <div className="h-3 bg-gray-100 rounded-lg w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgb(0_0_0_/0.1),0_1px_2px_-1px_rgb(0_0_0_/0.1)] rounded-2xl cursor-pointer hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/0.1),0_2px_4px_-2px_rgb(0_0_0_/0.1)] transition-all duration-300" 
      onClick={handleItemClick}
    >
      <CardHeader className="pb-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-900">Breaking News</span>
            <Badge className="bg-red-500/10 text-red-600 text-xs font-medium border border-red-200 rounded-full px-2 py-0.5">
              LIVE
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-3 h-3 text-gray-500" />
            </Button>
            <span className="text-xs text-gray-400 px-1 font-medium">
              {currentIndex + 1}/{allItems.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-3 h-3 text-gray-500" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5">
        {isAdvertisement ? (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <Badge className="bg-blue-50 text-blue-600 text-xs font-medium border border-blue-200 rounded-full px-2 py-0.5">
                SPONSORED
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open((currentItem as StrapiAdvertisement).URL, "_blank")
                }}
                className="h-5 w-5 p-0 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </Button>
            </div>

            <div className="flex space-x-3">
              {(currentItem as StrapiAdvertisement).Image && (
                <img
                  src={buildStrapiUrl((currentItem as StrapiAdvertisement).Image!.url)}
                  alt={(currentItem as StrapiAdvertisement).Tiltle}
                  className="w-16 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 leading-tight">
                  {(currentItem as StrapiAdvertisement).Tiltle}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                  {(currentItem as StrapiAdvertisement).Content}
                </p>
                <div className="text-xs text-gray-500 font-medium">
                  by <span className="text-gray-700">{(currentItem as StrapiAdvertisement).Sponsor}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={`text-xs font-medium border rounded-full px-2 py-0.5 ${getSeverityColor((currentItem as StrapiBreakingNews).Severity)}`}>
                  {(currentItem as StrapiBreakingNews).Category}
                </Badge>
                {(currentItem as StrapiBreakingNews).IsBreaking && (
                  <Badge className="bg-red-500/10 text-red-600 text-xs font-medium border border-red-200 rounded-full px-2 py-0.5 animate-pulse">
                    <Zap className="w-2 h-2 mr-1" />
                    BREAKING
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-400 font-medium">
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
                  className="h-5 w-5 p-0 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                {(currentItem as StrapiBreakingNews).Title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {(currentItem as StrapiBreakingNews).Summary}
              </p>
              <div className="text-xs text-gray-500 font-medium">
                Source: <span className="text-gray-700">{(currentItem as StrapiBreakingNews).Source}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
