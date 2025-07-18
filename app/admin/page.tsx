"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Users,
  BarChart3,
  Globe,
  Zap,
  Shield,
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export default function AdminDashboard() {
  const [stats] = useState({
    totalUsers: 1247,
    activeWidgets: 16,
    apiCalls: 45230,
    uptime: 99.8,
    dailyVisitors: 3421,
    errorRate: 0.2,
  })

  const quickActions = [
    {
      title: "Widget Management",
      description: "Configure and manage homepage widgets",
      icon: Settings,
      href: "/admin/widgets",
      color: "blue",
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      href: "/admin/users",
      color: "green",
    },
    {
      title: "Analytics Dashboard",
      description: "View detailed analytics and reports",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "purple",
    },
    {
      title: "API Management",
      description: "Configure API keys and integrations",
      icon: Globe,
      href: "/admin/api",
      color: "orange",
    },
    {
      title: "System Health",
      description: "Monitor system performance and health",
      icon: Activity,
      href: "/admin/health",
      color: "red",
    },
    {
      title: "Security Settings",
      description: "Configure security and access controls",
      icon: Shield,
      href: "/admin/security",
      color: "indigo",
    },
  ]

  const recentActivity = [
    { action: "Widget updated", item: "Breaking News Widget", time: "2 minutes ago", type: "info" },
    { action: "User registered", item: "john.doe@email.com", time: "5 minutes ago", type: "success" },
    { action: "API error", item: "YouTube API rate limit", time: "12 minutes ago", type: "warning" },
    { action: "Widget created", item: "Hot Deals Widget", time: "1 hour ago", type: "info" },
    { action: "System backup", item: "Database backup completed", time: "2 hours ago", type: "success" },
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-500 hover:bg-blue-600",
      green: "bg-green-500 hover:bg-green-600",
      purple: "bg-purple-500 hover:bg-purple-600",
      orange: "bg-orange-500 hover:bg-orange-600",
      red: "bg-red-500 hover:bg-red-600",
      indigo: "bg-indigo-500 hover:bg-indigo-600",
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Pattaya1 platform</p>
            </div>
            <Badge variant="outline" className="text-sm">
              Pattaya1 v0.5
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Widgets</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeWidgets}</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-600">All systems operational</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">API Calls Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.apiCalls.toLocaleString()}</p>
                </div>
                <Database className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-600">Within rate limits</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.uptime}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-600">Excellent performance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 justify-start bg-transparent"
                      onClick={() => window.open(action.href, "_blank")}
                    >
                      <div className={`p-2 rounded-lg ${getColorClasses(action.color)} mr-3`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-500">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`p-1 rounded-full ${
                          activity.type === "success"
                            ? "bg-green-100"
                            : activity.type === "warning"
                              ? "bg-yellow-100"
                              : "bg-blue-100"
                        }`}
                      >
                        {activity.type === "warning" ? (
                          <AlertTriangle className="h-3 w-3 text-yellow-600" />
                        ) : (
                          <Activity
                            className={`h-3 w-3 ${activity.type === "success" ? "text-green-600" : "text-blue-600"}`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500 truncate">{activity.item}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
