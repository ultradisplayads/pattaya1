"use client"

import { useState, useEffect } from "react"
import { Newspaper, ExternalLink, Clock, TrendingUp, RefreshCw } from "lucide-react"
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
      }, 5000) // Change article every 5 seconds
      return () => clearInterval(interval)
    }
  }, [articles])

  const loadNews = async () => {
    try {
      const response = await fetch("/api/news/aggregated")
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || getFallbackNews())
      }
    } catch (error) {
      console.error("Failed to load news:", error)
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
      image: "/placeholder.svg?height=200&width=300&text=Pattaya+Tourism",
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
      image: "/placeholder.svg?height=200&width=300&text=Floating+Market",
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
      image: "/placeholder.svg?height=200&width=300&text=Jomtien+Award",
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
        return "bg-blue-100 text-blue-700"
      case "culture":
        return "bg-purple-100 text-purple-700"
      case "environment":
        return "bg-green-100 text-green-700"
      case "business":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <Card className="h-full bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-red-200 rounded"></div>
            <div className="h-32 bg-red-100 rounded"></div>
            <div className="h-4 bg-red-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (articles.length === 0) return null

  const currentArticle = articles[currentIndex]

  return (
    <Card className="h-full bg-gradient-to-br from-red-50 to-orange-50 border-red-200 hover:shadow-xl hover:shadow-red-200/50 transition-all duration-500 hover:scale-105">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg text-red-800">
          <div className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>Breaking News</span>
            <Badge variant="secondary" className="bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse">
              Live
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={loadNews}
              disabled={loading}
              className="h-6 w-6 hover:bg-red-200"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open("/news", "_blank")}
              className="h-6 w-6 hover:bg-red-200"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Article */}
        <div
          className="cursor-pointer transition-all duration-300 hover:scale-105"
          onClick={() => window.open(currentArticle.url, "_blank")}
        >
          <div className="relative mb-3">
            <img
              src={currentArticle.image || "/placeholder.svg"}
              alt={currentArticle.title}
              className="w-full h-32 object-cover rounded-lg"
            />
            {currentArticle.trending && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge className={`text-xs ${getCategoryColor(currentArticle.category)}`}>
                {currentArticle.category}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-red-600">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(currentArticle.timestamp)}</span>
              </div>
            </div>

            <h3 className="font-bold text-red-900 text-sm leading-tight line-clamp-2">{currentArticle.title}</h3>

            <p className="text-xs text-red-700 line-clamp-2">{currentArticle.summary}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-red-600 font-medium">{currentArticle.source}</span>
              <ExternalLink className="h-3 w-3 text-red-500" />
            </div>
          </div>
        </div>

        {/* Article Navigation */}
        <div className="flex items-center justify-center space-x-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-red-500 w-4" : "bg-red-300 hover:bg-red-400"
              }`}
            />
          ))}
        </div>

        {/* Quick Headlines */}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-red-800 mb-2">Other Headlines</h4>
          {articles
            .filter((_, index) => index !== currentIndex)
            .slice(0, 2)
            .map((article) => (
              <div
                key={article.id}
                className="p-2 bg-white/60 rounded cursor-pointer hover:bg-white/80 transition-colors"
                onClick={() => window.open(article.url, "_blank")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-800 font-medium line-clamp-1 flex-1">{article.title}</span>
                  <span className="text-xs text-red-600 ml-2">{formatTimeAgo(article.timestamp)}</span>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
