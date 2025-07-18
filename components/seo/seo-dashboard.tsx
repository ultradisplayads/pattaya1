"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, AlertTriangle, CheckCircle, Globe, Target, FileText, Brain, RefreshCw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface SEOMetrics {
  totalPages: number
  indexedPages: number
  seoScore: number
  criticalIssues: number
  warnings: number
  keywordsTracked: number
  topRankings: number
  recentChanges: number
}

interface RankingData {
  date: string
  position: number
  clicks: number
  impressions: number
}

export function SEODashboard() {
  const [metrics, setMetrics] = useState<SEOMetrics>({
    totalPages: 0,
    indexedPages: 0,
    seoScore: 0,
    criticalIssues: 0,
    warnings: 0,
    keywordsTracked: 0,
    topRankings: 0,
    recentChanges: 0,
  })

  const [rankingData, setRankingData] = useState<RankingData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMetrics({
        totalPages: 156,
        indexedPages: 142,
        seoScore: 85,
        criticalIssues: 3,
        warnings: 12,
        keywordsTracked: 347,
        topRankings: 89,
        recentChanges: 15,
      })

      setRankingData([
        { date: "Jan 1", position: 12, clicks: 450, impressions: 8900 },
        { date: "Jan 8", position: 10, clicks: 520, impressions: 9200 },
        { date: "Jan 15", position: 8, clicks: 680, impressions: 10500 },
        { date: "Jan 22", position: 6, clicks: 890, impressions: 12300 },
        { date: "Jan 29", position: 5, clicks: 1200, impressions: 15600 },
        { date: "Feb 5", position: 4, clicks: 1450, impressions: 18900 },
        { date: "Feb 12", position: 3, clicks: 1680, impressions: 21200 },
      ])
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const indexationRate = Math.round((metrics.indexedPages / metrics.totalPages) * 100)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SEO Health Score</p>
                <p className="text-3xl font-bold text-green-600">{metrics.seoScore}/100</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={metrics.seoScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pages Indexed</p>
                <p className="text-3xl font-bold text-blue-600">
                  {metrics.indexedPages}/{metrics.totalPages}
                </p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <Progress value={indexationRate} className="flex-1" />
              <span className="ml-2 text-sm text-gray-600">{indexationRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600">{metrics.criticalIssues}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">{metrics.warnings} warnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Keywords Tracked</p>
                <p className="text-3xl font-bold text-purple-600">{metrics.keywordsTracked}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">{metrics.topRankings} in top 10</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Ranking Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rankingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis reversed domain={[1, 20]} />
                <Tooltip />
                <Line type="monotone" dataKey="position" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Click Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rankingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent SEO Activities
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchDashboardData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "AI Optimization",
                page: "Pattaya Restaurants Guide",
                time: "2 hours ago",
                status: "completed",
                improvement: "+12 SEO score",
              },
              {
                action: "Schema Added",
                page: "Weather Widget",
                time: "4 hours ago",
                status: "completed",
                improvement: "+5 SEO score",
              },
              {
                action: "Meta Description Updated",
                page: "Nightlife Guide",
                time: "6 hours ago",
                status: "completed",
                improvement: "+3 SEO score",
              },
              {
                action: "Keyword Research",
                page: "Beach Activities",
                time: "1 day ago",
                status: "pending",
                improvement: "In progress",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Brain className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.page}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{activity.time}</p>
                  <Badge variant={activity.status === "completed" ? "default" : "secondary"} className="mt-1">
                    {activity.improvement}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
