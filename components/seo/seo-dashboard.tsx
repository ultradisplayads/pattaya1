"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Eye, Globe, AlertTriangle, Clock, Zap } from "lucide-react"

export function SEODashboard() {
  const [timeRange, setTimeRange] = useState("30d")
  const [loading, setLoading] = useState(false)

  // Sample data - replace with real API calls
  const performanceData = [
    { date: "2024-01-01", impressions: 12500, clicks: 890, position: 8.2 },
    { date: "2024-01-02", impressions: 13200, clicks: 920, position: 7.8 },
    { date: "2024-01-03", impressions: 11800, clicks: 850, position: 8.5 },
    { date: "2024-01-04", impressions: 14100, clicks: 1020, position: 7.2 },
    { date: "2024-01-05", impressions: 15300, clicks: 1150, position: 6.8 },
    { date: "2024-01-06", impressions: 16200, clicks: 1280, position: 6.4 },
    { date: "2024-01-07", impressions: 17500, clicks: 1420, position: 5.9 },
  ]

  const keywordDistribution = [
    { name: "Top 3", value: 45, color: "#10B981" },
    { name: "4-10", value: 89, color: "#3B82F6" },
    { name: "11-20", value: 67, color: "#F59E0B" },
    { name: "21-50", value: 98, color: "#EF4444" },
    { name: "51+", value: 48, color: "#6B7280" },
  ]

  const recentIssues = [
    {
      type: "error",
      title: "Missing Meta Descriptions",
      count: 8,
      pages: ["Beach Hotels Page", "Restaurant Directory", "Events Calendar"],
      priority: "high",
    },
    {
      type: "warning",
      title: "Duplicate Title Tags",
      count: 5,
      pages: ["Nightlife Guide", "Shopping Centers"],
      priority: "medium",
    },
    {
      type: "info",
      title: "Missing Alt Text",
      count: 23,
      pages: ["Photo Gallery", "Business Listings"],
      priority: "low",
    },
  ]

  const recentAIActions = [
    {
      action: "Optimized meta description",
      page: "Pattaya Restaurants Guide",
      time: "2 minutes ago",
      impact: "+12% CTR predicted",
    },
    {
      action: "Generated schema markup",
      page: "Jomtien Beach Hotels",
      time: "15 minutes ago",
      impact: "Rich snippets enabled",
    },
    {
      action: "Updated heading structure",
      page: "Things to Do in Pattaya",
      time: "1 hour ago",
      impact: "Better content hierarchy",
    },
    {
      action: "Auto-submitted to Google",
      page: "New Event: Pattaya Music Festival",
      time: "2 hours ago",
      impact: "Indexed in 5 minutes",
    },
  ]

  const indexationStatus = {
    total: 180,
    indexed: 156,
    pending: 12,
    errors: 12,
    lastUpdate: "2 hours ago",
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Performance</span>
              <div className="flex space-x-2">
                {["7d", "30d", "90d"].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="position" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keyword Position Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={keywordDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {keywordDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {keywordDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              SEO Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIssues.map((issue, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {issue.type === "error" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {issue.type === "warning" && <Clock className="w-4 h-4 text-yellow-500" />}
                      {issue.type === "info" && <Eye className="w-4 h-4 text-blue-500" />}
                      <span className="font-medium">{issue.title}</span>
                    </div>
                    <Badge
                      variant={
                        issue.priority === "high"
                          ? "destructive"
                          : issue.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {issue.count} pages
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Affected: {issue.pages.join(", ")}
                    {issue.pages.length > 2 && "..."}
                  </div>
                  <Button size="sm" className="mt-2">
                    Fix Issues
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-500" />
              Recent AI Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAIActions.map((action, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{action.action}</div>
                      <div className="text-sm text-gray-600">{action.page}</div>
                      <div className="text-xs text-gray-500 mt-1">{action.time}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {action.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indexation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-500" />
            Indexation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{indexationStatus.indexed}</div>
              <div className="text-sm text-gray-600">Indexed</div>
              <Progress value={(indexationStatus.indexed / indexationStatus.total) * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{indexationStatus.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
              <Progress value={(indexationStatus.pending / indexationStatus.total) * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{indexationStatus.errors}</div>
              <div className="text-sm text-gray-600">Errors</div>
              <Progress value={(indexationStatus.errors / indexationStatus.total) * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{indexationStatus.total}</div>
              <div className="text-sm text-gray-600">Total Pages</div>
              <div className="text-xs text-gray-500 mt-2">Updated {indexationStatus.lastUpdate}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
