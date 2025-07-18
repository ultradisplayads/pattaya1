"use client"

import { useState, useEffect } from "react"
import { Newspaper, ExternalLink, Clock, RefreshCw, Globe, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewsAggregatorProps {
  theme: "primary" | "nightlife"
}

interface NewsArticle {
  title: string
  description: string
  link: string
  pubDate: string
  source: string
  category: "local" | "national" | "expat"
  language: "thai" | "english"
}

export function NewsAggregator({ theme }: NewsAggregatorProps) {
  const isPrimary = theme === "primary"
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [autoRotate, setAutoRotate] = useState(true)
  const [feedStatus, setFeedStatus] = useState<any[]>([])

  useEffect(() => {
    loadNews()
    const interval = setInterval(loadNews, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (autoRotate && articles.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.min(articles.length, 10))
      }, 5000) // Rotate every 5 seconds
      return () => clearInterval(interval)
    }
  }, [autoRotate, articles.length])

  const loadNews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/news/rss-aggregator")
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
        setFeedStatus(data.feedStatus || [])
      }
    } catch (error) {
      console.error("Failed to load news:", error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const displayArticles = filteredArticles.slice(0, 10)
  const currentArticle = displayArticles[currentIndex] || displayArticles[0]

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "local":
        return "bg-green-500"
      case "national":
        return "bg-blue-500"
      case "expat":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLanguageIcon = (language: string) => {
    return language === "thai" ? "🇹🇭" : "🇬🇧"
  }

  if (loading) {
    return (
      <Card
        className={`transition-all duration-300 ${
          isPrimary
            ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
            : "bg-gradient-to-br from-purple-800 to-pink-800 border-pink-500/30"
        }`}
      >
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className={`h-6 rounded ${isPrimary ? "bg-orange-200" : "bg-purple-600"}`}></div>
            <div className={`h-32 rounded ${isPrimary ? "bg-orange-100" : "bg-purple-700"}`}></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-4 rounded ${isPrimary ? "bg-orange-100" : "bg-purple-700"}`}></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`transition-all duration-500 hover:scale-105 cursor-pointer ${
        isPrimary
          ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-xl hover:shadow-orange-200/50"
          : "bg-gradient-to-br from-purple-800 to-pink-800 border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/30"
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className={`flex items-center justify-between text-lg ${isPrimary ? "text-orange-800" : "text-white"}`}
        >
          <div className="flex items-center space-x-2">
            <Newspaper className="h-5 w-5" />
            <span>Pattaya News</span>
            <Badge variant="secondary" className="bg-red-500 text-white animate-pulse">
              <MapPin className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setAutoRotate(!autoRotate)
              }}
              className={`h-6 w-6 ${isPrimary ? "hover:bg-orange-200" : "hover:bg-purple-700"}`}
            >
              <RefreshCw className={`h-3 w-3 ${autoRotate ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                loadNews()
              }}
              className={`h-6 w-6 ${isPrimary ? "hover:bg-orange-200" : "hover:bg-purple-700"}`}
            >
              <Globe className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <Input
            placeholder="Search Pattaya news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 h-8 text-xs ${
              isPrimary ? "bg-white/60 border-orange-200" : "bg-purple-900/50 border-pink-400/30 text-white"
            }`}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger
              className={`w-24 h-8 text-xs ${
                isPrimary ? "bg-white/60 border-orange-200" : "bg-purple-900/50 border-pink-400/30 text-white"
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="expat">Expat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Article with Rotation */}
        {currentArticle && (
          <div className={`relative rounded-lg overflow-hidden ${isPrimary ? "bg-white/70" : "bg-purple-900/50"}`}>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex space-x-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getCategoryColor(currentArticle.category)} text-white`}
                  >
                    {currentArticle.category}
                  </Badge>
                  <span className="text-xs">{getLanguageIcon(currentArticle.language)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(currentArticle.pubDate)}</span>
                </div>
              </div>

              <h4 className={`font-semibold text-sm mb-2 line-clamp-2 ${isPrimary ? "text-gray-800" : "text-white"}`}>
                {currentArticle.title}
              </h4>

              <p className={`text-xs mb-2 line-clamp-2 ${isPrimary ? "text-gray-600" : "text-gray-300"}`}>
                {currentArticle.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${isPrimary ? "text-orange-600" : "text-purple-300"}`}>
                  {currentArticle.source}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(currentArticle.link, "_blank")
                  }}
                  className="h-6 text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Read
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Article List */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {displayArticles.slice(1, 4).map((article, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer ${
                isPrimary ? "bg-white/50 hover:bg-white/70" : "bg-purple-900/30 hover:bg-purple-900/50"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                window.open(article.link, "_blank")
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h5 className={`font-medium text-xs line-clamp-2 ${isPrimary ? "text-orange-900" : "text-white"}`}>
                    {article.title}
                  </h5>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <div className="flex items-center space-x-2">
                      <span className={getCategoryColor(article.category)} />
                      <span className={isPrimary ? "text-orange-600" : "text-purple-300"}>{article.source}</span>
                      <span>{getLanguageIcon(article.language)}</span>
                    </div>
                    <span className={isPrimary ? "text-orange-500" : "text-purple-400"}>
                      {formatTimeAgo(article.pubDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feed Status Indicator */}
        <div className="flex justify-between items-center text-xs">
          <span className={isPrimary ? "text-orange-600" : "text-purple-300"}>
            {articles.length} Pattaya articles found
          </span>
          <div className="flex space-x-1">
            {feedStatus.slice(0, 5).map((status, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${status.status === "success" ? "bg-green-400" : "bg-red-400"}`}
                title={`${status.name}: ${status.status}`}
              />
            ))}
          </div>
        </div>

        {/* Rotation Indicators */}
        <div className="flex justify-center space-x-1">
          {displayArticles.slice(0, Math.min(5, displayArticles.length)).map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? isPrimary
                    ? "bg-orange-500"
                    : "bg-pink-400"
                  : isPrimary
                    ? "bg-orange-200"
                    : "bg-purple-600"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
