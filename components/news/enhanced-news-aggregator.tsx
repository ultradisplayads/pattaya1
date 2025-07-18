"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Newspaper,
  Clock,
  RefreshCw,
  Globe,
  MapPin,
  Search,
  Bell,
  TrendingUp,
  AlertTriangle,
  Eye,
  Share2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface NewsArticle {
  id: string
  title: string
  description: string
  link: string
  pubDate: string
  source: string
  category: "local" | "national" | "expat"
  language: "thai" | "english"
  articleCategory: string
  image: string
  isPattayaRelated: boolean
  isBreaking: boolean
  relevanceScore: number
  priority: number
  timestamp: string
}

interface NewsAggregatorProps {
  theme?: "primary" | "nightlife"
  compact?: boolean
}

export function EnhancedNewsAggregator({ theme = "primary", compact = false }: NewsAggregatorProps) {
  const isPrimary = theme === "primary"
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [pattayaOnly, setPattayaOnly] = useState(false)
  const [breakingOnly, setBreakingOnly] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [feedStatus, setFeedStatus] = useState<any>({})
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const loadNews = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(pattayaOnly && { pattaya: "true" }),
        ...(selectedLanguage !== "all" && { lang: selectedLanguage }),
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(breakingOnly && { breaking: "true" }),
      })

      const response = await fetch(`/api/news/rss-aggregator-enhanced?${params}`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
        setFeedStatus(data.feedStatus || {})
        setLastUpdated(data.lastUpdated || new Date().toISOString())

        // Check for breaking news
        if (data.breakingNews > 0 && notificationsEnabled) {
          showBreakingNewsNotification(data.articles.filter((a: NewsArticle) => a.isBreaking)[0])
        }
      }
    } catch (error) {
      console.error("Failed to load news:", error)
    } finally {
      setLoading(false)
    }
  }, [pattayaOnly, selectedLanguage, selectedCategory, breakingOnly, notificationsEnabled])

  useEffect(() => {
    loadNews()
  }, [loadNews])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadNews, 60000) // Update every 60 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh, loadNews])

  const showBreakingNewsNotification = (article: NewsArticle) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🚨 Breaking News - Pattaya1", {
        body: article.title,
        icon: "/icons/news-icon.png",
        tag: article.id,
      })
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === "granted")
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.source.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "local":
        return "bg-green-100 text-green-700"
      case "national":
        return "bg-blue-100 text-blue-700"
      case "expat":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getLanguageFlag = (language: string) => {
    return language === "thai" ? "🇹🇭" : "🇬🇧"
  }

  const shareArticle = async (article: NewsArticle) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.link,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(article.link)
    }
  }

  if (loading && articles.length === 0) {
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
      className={`transition-all duration-500 ${
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
            <span>Live News Feed</span>
            <Badge variant="secondary" className="bg-red-500 text-white animate-pulse">
              <MapPin className="h-3 w-3 mr-1" />
              Live
            </Badge>
            {articles.filter((a) => a.isBreaking).length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Breaking
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`h-6 w-6 ${isPrimary ? "hover:bg-orange-200" : "hover:bg-purple-700"}`}
            >
              <RefreshCw className={`h-3 w-3 ${autoRefresh ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadNews}
              disabled={loading}
              className={`h-6 w-6 ${isPrimary ? "hover:bg-orange-200" : "hover:bg-purple-700"}`}
            >
              <Globe className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={requestNotificationPermission}
              className={`h-6 w-6 ${isPrimary ? "hover:bg-orange-200" : "hover:bg-purple-700"}`}
            >
              <Bell className={`h-3 w-3 ${notificationsEnabled ? "text-green-500" : ""}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Enhanced Controls */}
        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-8 h-8 text-xs ${
                isPrimary ? "bg-white/60 border-orange-200" : "bg-purple-900/50 border-pink-400/30 text-white"
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
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

            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger
                className={`w-20 h-8 text-xs ${
                  isPrimary ? "bg-white/60 border-orange-200" : "bg-purple-900/50 border-pink-400/30 text-white"
                }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="english">🇬🇧 EN</SelectItem>
                <SelectItem value="thai">🇹🇭 TH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Switch id="pattaya-only" checked={pattayaOnly} onCheckedChange={setPattayaOnly} size="sm" />
              <Label htmlFor="pattaya-only" className={isPrimary ? "text-orange-700" : "text-white"}>
                Pattaya Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="breaking-only" checked={breakingOnly} onCheckedChange={setBreakingOnly} size="sm" />
              <Label htmlFor="breaking-only" className={isPrimary ? "text-orange-700" : "text-white"}>
                Breaking News
              </Label>
            </div>
          </div>
        </div>

        {/* News Articles */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredArticles.slice(0, compact ? 5 : 10).map((article) => (
            <div
              key={article.id}
              className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer ${
                isPrimary ? "bg-white/70 hover:bg-white/90" : "bg-purple-900/30 hover:bg-purple-900/50"
              } ${article.isBreaking ? "border-l-4 border-red-500" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                window.open(article.link, "_blank")
              }}
            >
              <div className="flex space-x-3">
                {/* Article Image */}
                {article.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getCategoryColor(article.category)}`}>{article.category}</Badge>
                      <span className="text-xs">{getLanguageFlag(article.language)}</span>
                      {article.isPattayaRelated && (
                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                          <MapPin className="h-2 w-2 mr-1" />
                          Pattaya
                        </Badge>
                      )}
                      {article.isBreaking && (
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          <TrendingUp className="h-2 w-2 mr-1" />
                          Breaking
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          shareArticle(article)
                        }}
                        className="h-5 w-5 p-0"
                      >
                        <Share2 className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>

                  <h4
                    className={`font-semibold text-xs mb-1 line-clamp-2 ${
                      isPrimary ? "text-orange-900" : "text-white"
                    }`}
                  >
                    {article.title}
                  </h4>

                  {!compact && (
                    <p className={`text-xs mb-2 line-clamp-2 ${isPrimary ? "text-orange-700" : "text-gray-300"}`}>
                      {article.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${isPrimary ? "text-orange-600" : "text-purple-300"}`}>
                        {article.source}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-2 w-2" />
                        <span className={isPrimary ? "text-orange-500" : "text-purple-400"}>
                          {formatTimeAgo(article.pubDate || article.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-2 w-2" />
                      <span className={isPrimary ? "text-orange-500" : "text-purple-400"}>
                        {Math.floor(article.relevanceScore)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-200/50">
          <div className={`flex items-center space-x-2 ${isPrimary ? "text-orange-600" : "text-purple-300"}`}>
            <span>{filteredArticles.length} articles</span>
            <span>•</span>
            <span>{articles.filter((a) => a.isPattayaRelated).length} Pattaya</span>
            <span>•</span>
            <span>{articles.filter((a) => a.isBreaking).length} breaking</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className={`text-xs ${isPrimary ? "text-orange-500" : "text-purple-400"}`}>
              Updated: {formatTimeAgo(lastUpdated)}
            </span>
            <div className="flex space-x-1">
              {Object.entries(feedStatus)
                .slice(0, 5)
                .map(([source, status]: [string, any], index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${status.status === "success" ? "bg-green-400" : "bg-red-400"}`}
                    title={`${source}: ${status.status}`}
                  />
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
