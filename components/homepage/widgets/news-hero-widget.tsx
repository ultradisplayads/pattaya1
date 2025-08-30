"use client"

import { useState, useEffect } from "react"
import { Newspaper, ExternalLink, Clock, TrendingUp, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
      // Call Strapi API directly
      const response = await fetch("http://localhost:1337/api/news-articles?populate=*&sort=PublishedTimestamp:desc")
      if (response.ok) {
        const data = await response.json()
        
        // Transform Strapi data to match component interface
        const transformedArticles: NewsArticle[] = data.data.map((strapiArticle: StrapiArticle) => {
          // Get image URL with fallback
          let imageUrl = "/placeholder.svg?height=300&width=450&text=News"
          if (strapiArticle.Image) {
            imageUrl = `http://localhost:1337${strapiArticle.Image.url}`
          }

          return {
            id: strapiArticle.id.toString(),
            title: strapiArticle.Title,
            summary: strapiArticle.Summary,
            image: imageUrl,
            source: strapiArticle.Source,
            timestamp: strapiArticle.PublishedTimestamp || strapiArticle.publishedAt,
            category: strapiArticle.Culture,
            trending: strapiArticle.Trending || false,
            url: strapiArticle.URL,
          }
        })

        setArticles(transformedArticles.length > 0 ? transformedArticles : getFallbackNews())
      } else {
        console.error("Failed to load news from Strapi:", response.status)
        setArticles(getFallbackNews())
      }
    } catch (error) {
      console.error("Failed to load news from Strapi:", error)
      setArticles(getFallbackNews())
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
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "culture":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "environment":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "business":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
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
      <Card className="h-full bg-white border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-slate-200 rounded w-24"></div>
              <div className="h-5 bg-slate-200 rounded w-5"></div>
            </div>
            <div className="h-40 bg-slate-100 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-20"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (articles.length === 0) return null

  const currentArticle = articles[currentIndex]

  return (
    <Card className="h-full bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-900">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
              <Newspaper className="h-3 w-3 text-white" />
            </div>
            <span>Latest News</span>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium">
              Live
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadNews}
            disabled={loading}
            className="h-6 w-6 hover:bg-slate-100"
          >
            <RefreshCw className={`h-3 w-3 text-slate-500 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Article */}
        <div className="relative group">
          <div
            className="cursor-pointer transition-all duration-300"
            onClick={() => window.open(currentArticle.url, "_blank")}
          >
            <div className="relative mb-3 overflow-hidden rounded-lg">
              <img
                src={currentArticle.image || "/placeholder.svg"}
                alt={currentArticle.title}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              {currentArticle.trending && (
                <Badge className="absolute top-2 left-2 bg-white/90 text-slate-900 border-0 shadow-sm text-xs">
                  <TrendingUp className="h-2 w-2 mr-1" />
                  Trending
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`text-xs font-medium ${getCategoryColor(currentArticle.category)}`}>
                  {currentArticle.category}
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Clock className="h-2 w-2" />
                  <span>{formatTimeAgo(currentArticle.timestamp)}</span>
                </div>
              </div>

              <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                {currentArticle.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{currentArticle.summary}</p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-700 font-medium">{currentArticle.source}</span>
                <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={prevArticle}
              className="h-6 w-6 p-0 hover:bg-slate-50"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextArticle}
              className="h-6 w-6 p-0 hover:bg-slate-50"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? "bg-blue-500 w-4" 
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Headlines */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-slate-900">More Headlines</h4>
          <div className="space-y-1">
            {articles
              .filter((_, index) => index !== currentIndex)
              .slice(0, 2)
              .map((article) => (
                <div
                  key={article.id}
                  className="p-2 bg-slate-50 rounded-md cursor-pointer hover:bg-slate-100 transition-colors group"
                  onClick={() => window.open(article.url, "_blank")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-800 font-medium line-clamp-1 flex-1 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </span>
                    <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
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
