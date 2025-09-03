"use client"

import { useState, useEffect } from "react"
import { Newspaper, ExternalLink, Clock, TrendingUp, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { buildApiUrl, buildStrapiUrl } from "@/lib/strapi-config"

interface NewsArticle {
  id: string
  title: string
  summary: string
  image: string
  source: string
  timestamp: string
  category: string
  trending: boolean
  url: string
}

interface StrapiArticle {
  id: number
  documentId: string
  Title: string
  Summary: string
  Content?: string
  Image: {
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
  Source: string
  URL: string
  Culture: string
  Trending: boolean
  PublishedTimestamp: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export function NewsHeroWidget() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNews()
    const interval = setInterval(loadNews, 120000) // Update every 2 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (articles.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length)
      }, 8000) // Change article every 8 seconds
      return () => clearInterval(interval)
    }
  }, [articles])

  const loadNews = async () => {
    try {
      setLoading(true)
      console.log('Fetching news articles from Strapi...')
      
      // Call Strapi API to get regular articles
      const response = await fetch(buildApiUrl("articles?populate=*&sort=publishedAt:desc&pagination[limit]=10"))
      
      if (response.ok) {
        const data = await response.json()
        console.log('Strapi news articles response:', data)
        
        if (data.data && data.data.length > 0) {
          console.log('Raw articles data:', data.data);
          // Transform Strapi v5 data to match component interface
          const transformedArticles: NewsArticle[] = data.data.map((article: any) => {
            console.log('Processing article:', article);
            // Get image URL with fallback
            let imageUrl = "/placeholder.svg?height=300&width=450&text=News"
            if (article.attributes?.cover?.data?.attributes?.url) {
              imageUrl = buildStrapiUrl(article.attributes.cover.data.attributes.url)
            }

            const transformed = {
              id: article.id.toString(),
              title: article.attributes?.title || 'Untitled Article',
              summary: article.attributes?.description || '',
              image: imageUrl,
              source: article.attributes?.author?.data?.attributes?.name || 'Pattaya1',
              timestamp: article.attributes?.publishedAt || article.attributes?.createdAt,
              category: article.attributes?.category?.data?.attributes?.name || 'News',
              trending: article.attributes?.trending || false,
              url: `/articles/${article.attributes?.slug || article.id}`,
            };
            console.log('Transformed article:', transformed);
            return transformed;
          })
          
          console.log('Transformed news articles:', transformedArticles)
          setArticles(transformedArticles)
        } else {
          console.log('No news articles found, using fallback data')
          // Use fallback data if no articles found
          const fallbackArticles = getFallbackNews()
          setArticles(fallbackArticles)
        }
      } else {
        console.error("Failed to fetch news articles from Strapi:", response.status)
        // Use fallback data on error
        const fallbackArticles = getFallbackNews()
        setArticles(fallbackArticles)
      }
    } catch (error) {
      console.error("Failed to load news articles:", error)
      // Use fallback data on error
      const fallbackArticles = getFallbackNews()
      setArticles(fallbackArticles)
    } finally {
      setLoading(false)
    }
  }

  const getFallbackNews = (): NewsArticle[] => [
    {
      id: "1",
      title: "Pattaya Tourism Reaches Record High This Season",
      summary:
        "International visitors flock to Pattaya beaches as tourism industry shows strong recovery with new attractions and improved infrastructure.",
      image: "/placeholder.svg?height=300&width=450&text=Pattaya+Tourism",
      source: "Pattaya News",
      timestamp: "2024-01-15T18:30:00Z",
      category: "Tourism",
      trending: true,
      url: "/news/pattaya-tourism-record",
    },
    {
      id: "2",
      title: "New Floating Market Opens in Chonburi",
      summary:
        "Traditional Thai floating market brings authentic cultural experience to visitors with local crafts, food, and boat tours.",
      image: "/placeholder.svg?height=300&width=450&text=Floating+Market",
      source: "Thailand Today",
      timestamp: "2024-01-15T16:45:00Z",
      category: "Culture",
      trending: false,
      url: "/news/floating-market-chonburi",
    },
    {
      id: "3",
      title: "Jomtien Beach Wins Environmental Award",
      summary:
        "Jomtien Beach recognized for outstanding environmental conservation efforts and sustainable tourism practices.",
      image: "/placeholder.svg?height=300&width=450&text=Jomtien+Award",
      source: "Environmental News",
      timestamp: "2024-01-15T14:20:00Z",
      category: "Environment",
      trending: true,
      url: "/news/jomtien-environmental-award",
    },
  ]

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "tourism":
        return "bg-blue-50 text-blue-700"
      case "culture":
        return "bg-purple-50 text-purple-700"
      case "environment":
        return "bg-emerald-50 text-emerald-700"
      case "business":
        return "bg-amber-50 text-amber-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const nextArticle = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
  }

  const prevArticle = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
  }

  if (loading) {
    return (
      <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-gray-200 rounded-full w-24"></div>
              <div className="h-5 bg-gray-200 rounded-full w-5"></div>
            </div>
            <div className="h-32 bg-gray-100 rounded-xl"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-full w-20"></div>
              <div className="h-4 bg-gray-200 rounded-full w-full"></div>
              <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (articles.length === 0) return null

  const currentArticle = articles[currentIndex]

  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] rounded-2xl hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-900 tracking-tight">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Newspaper className="h-4 w-4 text-white" />
            </div>
            <span>Latest News</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-red-600">Live</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadNews}
            disabled={loading}
            className="h-8 w-8 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6 space-y-6">
        {/* Main Article */}
        <div className="relative group">
          <div
            className="cursor-pointer transition-all duration-300"
            onClick={() => window.open(currentArticle.url, "_blank")}
          >
            <div className="relative mb-4 overflow-hidden rounded-xl">
              <img
                src={currentArticle.image || "/placeholder.svg"}
                alt={currentArticle.title}
                className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
              {currentArticle.trending && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-orange-500" />
                    <span className="text-xs font-semibold text-gray-900">Trending</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(currentArticle.category)}`}>
                  {currentArticle.category}
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-500 font-medium">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(currentArticle.timestamp)}</span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors tracking-tight">
                {currentArticle.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">{currentArticle.summary}</p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-700 font-semibold">{currentArticle.source}</span>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevArticle}
              className="h-8 w-8 p-0 hover:bg-gray-50 rounded-lg border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextArticle}
              className="h-8 w-8 p-0 hover:bg-gray-50 rounded-lg border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1.5">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? "w-6 h-1.5 bg-blue-500" 
                    : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Headlines */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 tracking-tight">More Headlines</h4>
          <div className="space-y-2">
            {articles
              .filter((_, index) => index !== currentIndex)
              .slice(0, 2)
              .map((article) => (
                <div
                  key={article.id}
                  className="p-3 bg-gray-50/50 rounded-xl cursor-pointer hover:bg-gray-100/50 transition-all duration-200 group border border-gray-100"
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-800 font-semibold line-clamp-1 flex-1 group-hover:text-blue-600 transition-colors tracking-tight">
                      {article.title}
                    </span>
                    <span className="text-xs text-gray-500 ml-3 flex-shrink-0 font-medium">
                      {formatTimeAgo(article.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}