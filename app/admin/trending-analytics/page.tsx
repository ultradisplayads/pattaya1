"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, BarChart3, RefreshCw, Eye, Users, Search, Clock } from "lucide-react"
import searchTracker from "@/lib/search-tracking"

interface TrendingTopic {
  id: number
  title: string
  type: string
  posts: number
  growth: number
  category: string
  icon: string
  description: string
  url: string
  trendingScore: number
  trendingRank: number
  lastSearched: string
  timeWindow: any
}

interface AnalyticsStats {
  totalSearches: number
  trendingCount: number
  categoryStats: Array<{ category: string; searchCount: number }>
  recentTrending: TrendingTopic[]
  timeWindow: string
}

export default function TrendingAnalyticsPage() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("trending")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load trending topics
      const trendingResponse = await searchTracker.getTrendingTopics({
        limit: 20,
        timeWindow: '24h'
      })

      if (trendingResponse.success) {
        setTrendingTopics(trendingResponse.data || [])
      }

      // Load analytics stats
      const statsResponse = await searchTracker.getAnalyticsStats()
      if (statsResponse.success) {
        setAnalyticsStats(statsResponse.data)
      }
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    try {
      await loadData()
    } finally {
      setRefreshing(false)
    }
  }

  const calculateTrending = async () => {
    setRefreshing(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.pattaya1.com'
      const response = await fetch(`${API_BASE}/api/search-analytics/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        await loadData() // Reload data after calculation
      }
    } catch (error) {
      console.error('Error calculating trending:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'News': 'bg-red-100 text-red-700',
      'Events': 'bg-blue-100 text-blue-700',
      'Business': 'bg-green-100 text-green-700',
      'Tourism': 'bg-purple-100 text-purple-700',
      'Food': 'bg-orange-100 text-orange-700',
      'Nightlife': 'bg-pink-100 text-pink-700',
      'Entertainment': 'bg-yellow-100 text-yellow-700',
      'Shopping': 'bg-indigo-100 text-indigo-700',
      'General': 'bg-gray-100 text-gray-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 20) return "text-green-600"
    if (growth > 10) return "text-yellow-600"
    if (growth > 0) return "text-blue-600"
    return "text-gray-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trending analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-8 w-8 mr-3 text-blue-600" />
                Trending Analytics
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor search trends and manage dynamic trending topics
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={refreshData}
                disabled={refreshing}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={calculateTrending}
                disabled={refreshing}
                className="flex items-center"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Calculate Trending
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {analyticsStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Search className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Searches</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsStats.totalSearches.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Trending Topics</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsStats.trendingCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Categories</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsStats.categoryStats.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Time Window</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsStats.timeWindow}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trending">Trending Topics</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Current Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trendingTopics.length > 0 ? (
                  <div className="space-y-4">
                    {trendingTopics.map((topic, index) => (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                            {topic.trendingRank || index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{topic.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`text-xs ${getCategoryColor(topic.category)}`}>
                                {topic.category}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {topic.posts.toLocaleString()} searches
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className={`text-sm font-medium ${getGrowthColor(topic.growth)}`}>
                              {topic.growth > 0 ? '+' : ''}{topic.growth.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Score: {topic.trendingScore?.toFixed(1) || 'N/A'}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(topic.url, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No trending topics available</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Search queries will appear here as they become trending
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analyticsStats && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Category Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analyticsStats.categoryStats.map((stat, index) => (
                        <div
                          key={stat.category}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <Badge className={getCategoryColor(stat.category)}>
                            {stat.category}
                          </Badge>
                          <span className="font-medium text-gray-900">
                            {stat.searchCount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analyticsStats.recentTrending.length > 0 ? (
                      <div className="space-y-3">
                        {analyticsStats.recentTrending.map((topic) => (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{topic.title}</p>
                              <p className="text-sm text-gray-500">
                                Last searched: {new Date(topic.lastSearched).toLocaleString()}
                              </p>
                            </div>
                            <Badge className={getCategoryColor(topic.category)}>
                              {topic.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No recent trending activity
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
