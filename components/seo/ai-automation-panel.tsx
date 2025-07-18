"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, Settings, RotateCcw, CheckCircle, AlertTriangle, Clock, Send, Globe } from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  description: string
  enabled: boolean
  trigger: string
  action: string
  lastRun: string
  nextRun: string
  status: "active" | "paused" | "error"
  runsCount: number
}

interface OptimizationTask {
  id: string
  type: "meta-title" | "meta-description" | "headings" | "schema" | "images"
  page: string
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  before: string
  after: string
  improvement: number
}

export function AIAutomationPanel() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [optimizationTasks, setOptimizationTasks] = useState<OptimizationTask[]>([])
  const [isRunningBulkOptimization, setIsRunningBulkOptimization] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(0)

  useEffect(() => {
    fetchAutomationData()
  }, [])

  const fetchAutomationData = async () => {
    // Simulate API call
    const mockRules: AutomationRule[] = [
      {
        id: "1",
        name: "Auto Meta Title Optimization",
        description: "Automatically optimize meta titles for better CTR",
        enabled: true,
        trigger: "New page created",
        action: "Generate optimized meta title",
        lastRun: "2024-01-15 10:30",
        nextRun: "2024-01-16 10:30",
        status: "active",
        runsCount: 45,
      },
      {
        id: "2",
        name: "Schema Markup Generator",
        description: "Add appropriate schema markup to pages",
        enabled: true,
        trigger: "Page content updated",
        action: "Generate and inject schema",
        lastRun: "2024-01-15 09:15",
        nextRun: "2024-01-16 09:15",
        status: "active",
        runsCount: 23,
      },
      {
        id: "3",
        name: "Image Alt Text Generator",
        description: "Generate SEO-friendly alt text for images",
        enabled: false,
        trigger: "Image uploaded",
        action: "Generate alt text",
        lastRun: "2024-01-14 16:45",
        nextRun: "Paused",
        status: "paused",
        runsCount: 67,
      },
      {
        id: "4",
        name: "Heading Structure Optimizer",
        description: "Optimize heading hierarchy for better SEO",
        enabled: true,
        trigger: "Content published",
        action: "Optimize heading structure",
        lastRun: "2024-01-15 14:20",
        nextRun: "2024-01-16 14:20",
        status: "active",
        runsCount: 12,
      },
    ]

    const mockTasks: OptimizationTask[] = [
      {
        id: "1",
        type: "meta-title",
        page: "/dining/restaurants",
        status: "completed",
        progress: 100,
        before: "Restaurants in Pattaya",
        after: "Best Pattaya Restaurants 2024 - Top Dining Guide",
        improvement: 15,
      },
      {
        id: "2",
        type: "meta-description",
        page: "/nightlife/bars",
        status: "running",
        progress: 65,
        before: "Bars in Pattaya for nightlife",
        after: "Discover the best bars in Pattaya for an unforgettable nightlife experience...",
        improvement: 0,
      },
      {
        id: "3",
        type: "schema",
        page: "/hotels/luxury",
        status: "pending",
        progress: 0,
        before: "No schema markup",
        after: "Hotel schema with ratings and amenities",
        improvement: 0,
      },
    ]

    setAutomationRules(mockRules)
    setOptimizationTasks(mockTasks)
  }

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    setAutomationRules((rules) =>
      rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled, status: enabled ? "active" : "paused" } : rule)),
    )
  }

  const runBulkOptimization = async () => {
    setIsRunningBulkOptimization(true)
    setBulkProgress(0)

    // Simulate bulk optimization progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setBulkProgress(i)
    }

    setIsRunningBulkOptimization(false)
    // Refresh tasks
    fetchAutomationData()
  }

  const submitToSearchEngines = async () => {
    // Simulate search engine submission
    console.log("Submitting to search engines...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "running":
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Brain className="w-12 h-12 text-purple-500 mx-auto" />
              <div>
                <h3 className="font-semibold">Bulk AI Optimization</h3>
                <p className="text-sm text-gray-600">Optimize all pages with AI</p>
              </div>
              <Button onClick={runBulkOptimization} disabled={isRunningBulkOptimization} className="w-full">
                {isRunningBulkOptimization ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Optimizing... {bulkProgress}%
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Start Optimization
                  </>
                )}
              </Button>
              {isRunningBulkOptimization && <Progress value={bulkProgress} className="w-full" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Send className="w-12 h-12 text-blue-500 mx-auto" />
              <div>
                <h3 className="font-semibold">Instant Indexing</h3>
                <p className="text-sm text-gray-600">Submit to search engines</p>
              </div>
              <Button onClick={submitToSearchEngines} variant="outline" className="w-full bg-transparent">
                <Globe className="w-4 h-4 mr-2" />
                Submit All Pages
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Settings className="w-12 h-12 text-gray-500 mx-auto" />
              <div>
                <h3 className="font-semibold">Automation Rules</h3>
                <p className="text-sm text-gray-600">{automationRules.filter((r) => r.enabled).length} active rules</p>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Manage Rules
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="tasks">Optimization Tasks</TabsTrigger>
          <TabsTrigger value="history">Action History</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Automation Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Switch checked={rule.enabled} onCheckedChange={(enabled) => toggleRule(rule.id, enabled)} />
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(rule.status)}>{rule.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Trigger:</span> {rule.trigger}
                      </div>
                      <div>
                        <span className="font-medium">Last Run:</span> {rule.lastRun}
                      </div>
                      <div>
                        <span className="font-medium">Total Runs:</span> {rule.runsCount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Current Optimization Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getTaskStatusIcon(task.status)}
                        <div>
                          <h4 className="font-medium capitalize">{task.type.replace("-", " ")} Optimization</h4>
                          <p className="text-sm text-gray-600">{task.page}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{task.status}</Badge>
                        {task.improvement > 0 && (
                          <div className="text-sm text-green-600 mt-1">+{task.improvement} SEO score</div>
                        )}
                      </div>
                    </div>
                    {task.status === "running" && <Progress value={task.progress} className="mb-3" />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Before:</span>
                        <p className="mt-1 p-2 bg-red-50 rounded text-red-800">{task.before}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">After:</span>
                        <p className="mt-1 p-2 bg-green-50 rounded text-green-800">{task.after}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RotateCcw className="w-5 h-5 mr-2" />
                Action History & Rollback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "1",
                    action: "Meta title optimization",
                    page: "/dining/restaurants",
                    timestamp: "2024-01-15 14:30",
                    user: "AI Automation",
                    canRollback: true,
                  },
                  {
                    id: "2",
                    action: "Schema markup added",
                    page: "/hotels/luxury",
                    timestamp: "2024-01-15 13:15",
                    user: "AI Automation",
                    canRollback: true,
                  },
                  {
                    id: "3",
                    action: "Heading structure optimized",
                    page: "/attractions/temples",
                    timestamp: "2024-01-15 12:00",
                    user: "Manual Edit",
                    canRollback: false,
                  },
                ].map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{action.action}</h4>
                      <p className="text-sm text-gray-600">{action.page}</p>
                      <p className="text-xs text-gray-500">
                        {action.timestamp} by {action.user}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {action.canRollback && (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Rollback
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
