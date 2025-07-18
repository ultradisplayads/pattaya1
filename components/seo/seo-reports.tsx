"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import {
  Download,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Search,
  AlertTriangle,
} from "lucide-react"

interface ReportData {
  period: string
  impressions: number
  clicks: number
  ctr: number
  position: number
  indexedPages: number
  keywords: number
}

export function SEOReports() {
  const [reportPeriod, setReportPeriod] = useState("30d")
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  useEffect(() => {
    // Sample report data
    const sampleData: ReportData[] = [
      { period: "Week 1", impressions: 45200, clicks: 3420, ctr: 7.6, position: 8.2, indexedPages: 145, keywords: 320 },
      { period: "Week 2", impressions: 48100, clicks: 3680, ctr: 7.7, position: 7.9, indexedPages: 148, keywords: 325 },
      { period: "Week 3", impressions: 52300, clicks: 4150, ctr: 7.9, position: 7.5, indexedPages: 152, keywords: 335 },
      { period: "Week 4", impressions: 56800, clicks: 4720, ctr: 8.3, position: 7.1, indexedPages: 156, keywords: 347 },
    ]
    setReportData(sampleData)
  }, [])

  const keywordPerformance = [
    { keyword: "pattaya restaurants", impressions: 15420, clicks: 1928, ctr: 12.5, position: 3 },
    { keyword: "jomtien beach hotels", impressions: 9840, clicks: 807, ctr: 8.2, position: 7 },
    { keyword: "pattaya nightlife", impressions: 7650, clicks: 612, ctr: 8.0, position: 5 },
    { keyword: "things to do pattaya", impressions: 28400, clicks: 4317, ctr: 15.2, position: 5 },
    { keyword: "pattaya weather", impressions: 22100, clicks: 4177, ctr: 18.9, position: 2 },
  ]

  const pagePerformance = [
    { page: "/dining/restaurants", impressions: 18500, clicks: 2220, ctr: 12.0, position: 4.2 },
    { page: "/accommodation/hotels", impressions: 12300, clicks: 1107, ctr: 9.0, position: 6.1 },
    { page: "/nightlife", impressions: 9800, clicks: 882, ctr: 9.0, position: 5.8 },
    { page: "/weather", impressions: 22100, clicks: 4177, ctr: 18.9, position: 2.0 },
    { page: "/events", impressions: 8900, clicks: 623, ctr: 7.0, position: 8.2 },
  ]

  const issuesData = [
    { type: "Missing Meta Descriptions", count: 8, severity: "high" },
    { type: "Duplicate Title Tags", count: 5, severity: "medium" },
    { type: "Missing Alt Text", count: 23, severity: "low" },
    { type: "Slow Loading Pages", count: 12, severity: "high" },
    { type: "Broken Internal Links", count: 3, severity: "medium" },
  ]

  const generateReport = async () => {
    setIsGeneratingReport(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false)
      // Download report
      console.log("Report generated and downloaded")
    }, 2000)
  }

  const scheduleReport = () => {
    // Schedule weekly/monthly reports
    console.log("Report scheduled")
  }

  const emailReport = () => {
    // Email current report
    console.log("Report emailed")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">SEO Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive SEO performance analysis and reporting</p>
        </div>
        <div className="flex space-x-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={emailReport}>
            <Mail className="w-4 h-4 mr-2" />
            Email Report
          </Button>
          <Button variant="outline" onClick={scheduleReport}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button onClick={generateReport} disabled={isGeneratingReport}>
            <Download className="w-4 h-4 mr-2" />
            {isGeneratingReport ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold">202.4K</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% vs last period
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold">15.97K</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.2% vs last period
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average CTR</p>
                <p className="text-2xl font-bold">7.9%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.3% vs last period
                </p>
              </div>
              <Search className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Position</p>
                <p className="text-2xl font-bold">7.7</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -0.5 vs last period
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="indexing">Indexing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="impressions"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="clicks"
                        stackId="2"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CTR & Position Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="ctr" stroke="#F59E0B" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="position" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Indexing Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="indexedPages" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordPerformance.map((keyword, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{keyword.keyword}</h3>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-gray-600">Impressions:</span>
                            <div className="font-medium">{keyword.impressions.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Clicks:</span>
                            <div className="font-medium">{keyword.clicks.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">CTR:</span>
                            <div className="font-medium">{keyword.ctr}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Position:</span>
                            <div className="font-medium">#{keyword.position}</div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          keyword.position <= 3
                            ? "bg-green-100 text-green-800"
                            : keyword.position <= 10
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        Rank #{keyword.position}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pagePerformance.map((page, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{page.page}</h3>
                        <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-gray-600">Impressions:</span>
                            <div className="font-medium">{page.impressions.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Clicks:</span>
                            <div className="font-medium">{page.clicks.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">CTR:</span>
                            <div className="font-medium">{page.ctr}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg. Position:</span>
                            <div className="font-medium">{page.position}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                SEO Issues & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issuesData.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{issue.type}</h3>
                          <Badge className={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{issue.count} pages affected</p>
                      </div>
                      <Button size="sm">Fix Issues</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indexing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Indexing Status Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-gray-600">Pages Indexed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="indexedPages" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
