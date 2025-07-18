"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Globe,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  Target,
  Brain,
  Send,
} from "lucide-react"
import { SEODashboard } from "@/components/seo/seo-dashboard"
import { PageSEOEditor } from "@/components/seo/page-seo-editor"
import { KeywordManager } from "@/components/seo/keyword-manager"
import { ContentBriefGenerator } from "@/components/seo/content-brief-generator"
import { SEOReports } from "@/components/seo/seo-reports"
import { AIAutomationPanel } from "@/components/seo/ai-automation-panel"

export default function SEOManagementPanel() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [seoHealth, setSeoHealth] = useState({
    score: 85,
    issues: 12,
    indexed: 156,
    total: 180,
    recentActions: 8,
  })

  const [keywordStats, setKeywordStats] = useState({
    total: 347,
    ranking: 289,
    improved: 45,
    declined: 23,
    topKeywords: [
      { keyword: "pattaya restaurants", position: 3, change: 2, volume: 8100 },
      { keyword: "jomtien beach hotels", position: 7, change: -1, volume: 5400 },
      { keyword: "pattaya nightlife guide", position: 12, change: 5, volume: 3200 },
      { keyword: "things to do pattaya", position: 5, change: 1, volume: 12000 },
      { keyword: "pattaya weather today", position: 2, change: 0, volume: 6700 },
    ],
  })

  const quickActions = [
    {
      title: "Auto-Optimize All",
      description: "AI optimize all pages",
      icon: Brain,
      action: "optimize",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Submit to Google",
      description: "Instant indexing",
      icon: Send,
      action: "submit",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Generate Report",
      description: "Weekly SEO report",
      icon: FileText,
      action: "report",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Keyword Research",
      description: "Find new opportunities",
      icon: Target,
      action: "research",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case "optimize":
        // Trigger AI optimization
        console.log("Starting AI optimization...")
        break
      case "submit":
        // Submit to search engines
        console.log("Submitting to search engines...")
        break
      case "report":
        // Generate report
        console.log("Generating SEO report...")
        break
      case "research":
        // Open keyword research
        setActiveTab("keywords")
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SEO Management Panel</h1>
              <p className="text-gray-600">AI-powered SEO optimization for Pattaya1</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                Health Score: {seoHealth.score}/100
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">SEO Health</p>
                  <p className="text-2xl font-bold text-green-600">{seoHealth.score}/100</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgent Issues</p>
                  <p className="text-2xl font-bold text-red-600">{seoHealth.issues}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pages Indexed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {seoHealth.indexed}/{seoHealth.total}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Keywords Tracked</p>
                  <p className="text-2xl font-bold text-purple-600">{keywordStats.total}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Actions</p>
                  <p className="text-2xl font-bold text-orange-600">{seoHealth.recentActions}</p>
                </div>
                <Brain className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 justify-start bg-white hover:bg-gray-50"
              onClick={() => handleQuickAction(action.action)}
            >
              <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-sm text-gray-500">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Top Keywords Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Top Performing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keywordStats.topKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{keyword.keyword}</div>
                    <div className="text-sm text-gray-500">Volume: {keyword.volume.toLocaleString()}/month</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">#{keyword.position}</div>
                      <div className="text-xs text-gray-500">Position</div>
                    </div>
                    <div className="flex items-center">
                      {keyword.change > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : keyword.change < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      ) : (
                        <div className="w-4 h-4 mr-1" />
                      )}
                      <span
                        className={`text-sm ${keyword.change > 0 ? "text-green-600" : keyword.change < 0 ? "text-red-600" : "text-gray-500"}`}
                      >
                        {keyword.change > 0 ? `+${keyword.change}` : keyword.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="pages">Pages/Blocks</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="content">Content Brief</TabsTrigger>
            <TabsTrigger value="automation">AI Automation</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SEODashboard />
          </TabsContent>

          <TabsContent value="pages">
            <PageSEOEditor />
          </TabsContent>

          <TabsContent value="keywords">
            <KeywordManager />
          </TabsContent>

          <TabsContent value="content">
            <ContentBriefGenerator />
          </TabsContent>

          <TabsContent value="automation">
            <AIAutomationPanel />
          </TabsContent>

          <TabsContent value="reports">
            <SEOReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
