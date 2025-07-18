"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Brain, Zap, CheckCircle, Send, Globe, Undo, Settings } from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  type: "meta" | "headings" | "schema" | "indexing"
  enabled: boolean
  trigger: string
  action: string
  lastRun: string
  status: "active" | "paused" | "error"
}

interface AutomationHistory {
  id: string
  timestamp: string
  action: string
  page: string
  type: "optimization" | "submission" | "rollback"
  status: "success" | "failed" | "pending"
  details: string
}

export function AIAutomationPanel() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([])
  const [automationHistory, setAutomationHistory] = useState<AutomationHistory[]>([])
  const [isRunningBulkOptimization, setIsRunningBulkOptimization] = useState(false)
  const [selectedPages, setSelectedPages] = useState<string[]>([])

  useEffect(() => {
    // Sample automation rules
    const sampleRules: AutomationRule[] = [
      {
        id: "1",
        name: "Auto-optimize meta descriptions",
        type: "meta",
        enabled: true,
        trigger: "On page publish/update",
        action: "Generate and update meta description if missing or too short",
        lastRun: "2024-01-15 14:30",
        status: "active",
      },
      {
        id: "2",
        name: "Auto-generate schema markup",
        type: "schema",
        enabled: true,
        trigger: "On content type detection",
        action: "Add appropriate schema.org markup based on content type",
        lastRun: "2024-01-15 12:15",
        status: "active",
      },
      {
        id: "3",
        name: "Instant Google indexing",
        type: "indexing",
        enabled: true,
        trigger: "On page publish",
        action: "Submit to Google Indexing API immediately",
        lastRun: "2024-01-15 16:45",
        status: "active",
      },
      {
        id: "4",
        name: "Heading structure optimization",
        type: "headings",
        enabled: false,
        trigger: "Weekly scan",
        action: "Optimize H1-H6 structure for better SEO",
        lastRun: "2024-01-10 09:00",
        status: "paused",
      },
    ]

    const sampleHistory: AutomationHistory[] = [
      {
        id: "1",
        timestamp: "2024-01-15 16:45:23",
        action: "Auto-optimized meta description",
        page: "Pattaya Restaurants Guide",
        type: "optimization",
        status: "success",
        details: "Generated 155-character meta description with target keywords",
      },
      {
        id: "2",
        timestamp: "2024-01-15 16:44:12",
        action: "Submitted to Google Indexing API",
        page: "New Event: Pattaya Music Festival",
        type: "submission",
        status: "success",
        details: "Successfully submitted URL for immediate indexing",
      },
      {
        id: "3",
        timestamp: "2024-01-15 15:30:45",
        action: "Generated schema markup",
        page: "Jomtien Beach Hotels",
        type: "optimization",
        status: "success",
        details: "Added Hotel and Review schema markup",
      },
      {
        id: "4",
        timestamp: "2024-01-15 14:22:18",
        action: "Optimized heading structure",
        page: "Things to Do in Pattaya",
        type: "optimization",
        status: "success",
        details: "Restructured headings for better hierarchy (H1→H2→H3)",
      },
      {
        id: "5",
        timestamp: "2024-01-15 13:15:33",
        action: "Bulk meta optimization",
        page: "Multiple pages (15)",
        type: "optimization",
        status: "success",
        details: "Optimized meta titles and descriptions for 15 pages",
      },
    ]

    setAutomationRules(sampleRules)
    setAutomationHistory(sampleHistory)
  }, [])

  const toggleRule = (ruleId: string) => {
    setAutomationRules((rules) =>
      rules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled, status: !rule.enabled ? "active" : "paused" } : rule,
      ),
    )
  }

  const runBulkOptimization = async () => {
    setIsRunningBulkOptimization(true)
    // Simulate bulk optimization
    setTimeout(() => {
      setIsRunningBulkOptimization(false)
      // Add to history
      const newHistoryItem: AutomationHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        action: "Bulk AI optimization",
        page: "All pages",
        type: "optimization",
        status: "success",
        details: "Optimized meta tags, headings, and schema for all pages",
      }
      setAutomationHistory((prev) => [newHistoryItem, ...prev])
    }, 3000)
  }

  const submitToSearchEngines = async () => {
    // Submit all pages to search engines
    console.log("Submitting all pages to search engines...")
  }

  const rollbackAction = (historyId: string) => {
    // Rollback specific action
    console.log("Rolling back action:", historyId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "success":
        return "bg-green-100 text-green-800"
      case "paused":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "error":
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meta":
        return <Settings className="w-4 h-4" />
      case "headings":
        return <Brain className="w-4 h-4" />
      case "schema":
        return <Zap className="w-4 h-4" />
      case "indexing":
        return <Send className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">AI Automation & Instant Submission</h2>
          <p className="text-gray-600">Automate SEO optimizations and search engine submissions</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={runBulkOptimization} disabled={isRunningBulkOptimization}>
            <Brain className="w-4 h-4 mr-2" />
            {isRunningBulkOptimization ? "Optimizing..." : "Bulk Optimize"}
          </Button>
          <Button onClick={submitToSearchEngines} variant="outline">
            <Send className="w-4 h-4 mr-2" />
            Submit All to Google
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">{automationRules.filter((r) => r.enabled).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actions Today</p>
                <p className="text-2xl font-bold text-blue-600">
                  {automationHistory.filter((h) => h.timestamp.startsWith("2024-01-15")).length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">98.5%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pages Indexed</p>
                <p className="text-2xl font-bold text-orange-600">156/180</p>
              </div>
              <Globe className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="history">Action History</TabsTrigger>
          <TabsTrigger value="indexing">Instant Indexing</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getTypeIcon(rule.type)}
                          <h3 className="font-semibold">{rule.name}</h3>
                          <Badge className={getStatusColor(rule.status)}>{rule.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Trigger:</strong> {rule.trigger}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Action:</strong> {rule.action}
                        </p>
                        <p className="text-xs text-gray-500">Last run: {rule.lastRun}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
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
              <CardTitle>Automation History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automationHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-sm">{item.timestamp}</TableCell>
                      <TableCell className="font-medium">{item.action}</TableCell>
                      <TableCell className="text-sm">{item.page}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => rollbackAction(item.id)}>
                          <Undo className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indexing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Instant Search Engine Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-500" />
                      Google Indexing API
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">Submit URLs directly to Google for immediate indexing</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Daily Quota:</span>
                        <span>200/200</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate:</span>
                        <span className="text-green-600">98.5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. Index Time:</span>
                        <span>5 minutes</span>
                      </div>
                    </div>
                    <Button className="w-full mt-3">
                      <Send className="w-4 h-4 mr-2" />
                      Submit New URLs
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-orange-500" />
                      Bing Webmaster API
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">Submit URLs to Bing for indexing</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Daily Quota:</span>
                        <span>100/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate:</span>
                        <span className="text-green-600">95.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. Index Time:</span>
                        <span>2 hours</span>
                      </div>
                    </div>
                    <Button className="w-full mt-3 bg-transparent" variant="outline">
                      <Send className="w-4 h-4 mr-2" />
                      Submit to Bing
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Recent Submissions</h3>
                  <div className="space-y-2">
                    {automationHistory
                      .filter((item) => item.type === "submission")
                      .slice(0, 5)
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium text-sm">{item.page}</div>
                            <div className="text-xs text-gray-500">{item.timestamp}</div>
                          </div>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
