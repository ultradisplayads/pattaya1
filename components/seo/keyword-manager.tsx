"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Upload,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  Target,
  Brain,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface Keyword {
  id: string
  keyword: string
  currentRank: number
  previousRank: number
  volume: number
  difficulty: number
  ctr: number
  impressions: number
  clicks: number
  url: string
  lastUpdated: string
  trend: "up" | "down" | "stable"
  opportunity: "high" | "medium" | "low"
}

export function KeywordManager() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRank, setFilterRank] = useState("all")
  const [filterOpportunity, setFilterOpportunity] = useState("all")
  const [isAddingKeywords, setIsAddingKeywords] = useState(false)
  const [newKeywords, setNewKeywords] = useState("")
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false)

  // Sample data - replace with API calls
  useEffect(() => {
    const sampleKeywords: Keyword[] = [
      {
        id: "1",
        keyword: "pattaya restaurants",
        currentRank: 3,
        previousRank: 5,
        volume: 8100,
        difficulty: 65,
        ctr: 12.5,
        impressions: 15420,
        clicks: 1928,
        url: "/dining/restaurants",
        lastUpdated: "2024-01-15",
        trend: "up",
        opportunity: "high",
      },
      {
        id: "2",
        keyword: "jomtien beach hotels",
        currentRank: 7,
        previousRank: 6,
        volume: 5400,
        difficulty: 58,
        ctr: 8.2,
        impressions: 9840,
        clicks: 807,
        url: "/accommodation/jomtien",
        lastUpdated: "2024-01-15",
        trend: "down",
        opportunity: "medium",
      },
      {
        id: "3",
        keyword: "pattaya nightlife guide",
        currentRank: 12,
        previousRank: 17,
        volume: 3200,
        difficulty: 42,
        ctr: 5.8,
        impressions: 4560,
        clicks: 264,
        url: "/nightlife",
        lastUpdated: "2024-01-15",
        trend: "up",
        opportunity: "high",
      },
      {
        id: "4",
        keyword: "things to do pattaya",
        currentRank: 5,
        previousRank: 4,
        volume: 12000,
        difficulty: 72,
        ctr: 15.2,
        impressions: 28400,
        clicks: 4317,
        url: "/explore",
        lastUpdated: "2024-01-15",
        trend: "down",
        opportunity: "low",
      },
      {
        id: "5",
        keyword: "pattaya weather today",
        currentRank: 2,
        previousRank: 2,
        volume: 6700,
        difficulty: 35,
        ctr: 18.9,
        impressions: 22100,
        clicks: 4177,
        url: "/weather",
        lastUpdated: "2024-01-15",
        trend: "stable",
        opportunity: "medium",
      },
    ]
    setKeywords(sampleKeywords)
  }, [])

  const filteredKeywords = keywords.filter((keyword) => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRank =
      filterRank === "all" ||
      (filterRank === "top10" && keyword.currentRank <= 10) ||
      (filterRank === "top20" && keyword.currentRank <= 20) ||
      (filterRank === "below20" && keyword.currentRank > 20)
    const matchesOpportunity = filterOpportunity === "all" || keyword.opportunity === filterOpportunity
    return matchesSearch && matchesRank && matchesOpportunity
  })

  const handleBulkImport = (file: File) => {
    // Handle CSV/Excel import
    console.log("Importing keywords from file:", file.name)
  }

  const handleBulkExport = () => {
    // Export keywords to CSV
    const csv = keywords
      .map((k) => `${k.keyword},${k.currentRank},${k.volume},${k.difficulty},${k.ctr},${k.url}`)
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "keywords.csv"
    a.click()
  }

  const handleAddKeywords = () => {
    const keywordList = newKeywords.split("\n").filter((k) => k.trim())
    // Add keywords to tracking
    console.log("Adding keywords:", keywordList)
    setNewKeywords("")
    setIsAddingKeywords(false)
  }

  const generateAIKeywords = async () => {
    setIsGeneratingKeywords(true)
    // AI keyword generation logic
    setTimeout(() => {
      setIsGeneratingKeywords(false)
      // Add generated keywords to the list
    }, 2000)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRankColor = (rank: number) => {
    if (rank <= 3) return "text-green-600 font-bold"
    if (rank <= 10) return "text-blue-600 font-semibold"
    if (rank <= 20) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Keyword Manager</h2>
          <p className="text-gray-600">Track and optimize your keyword rankings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleBulkExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setIsAddingKeywords(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Keywords
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleBulkImport(e.target.files[0])}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Keywords</p>
                <p className="text-2xl font-bold">{keywords.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top 10 Rankings</p>
                <p className="text-2xl font-bold text-green-600">
                  {keywords.filter((k) => k.currentRank <= 10).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Opportunities</p>
                <p className="text-2xl font-bold text-orange-600">
                  {keywords.filter((k) => k.opportunity === "high").length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-purple-600">
                  {keywords.reduce((sum, k) => sum + k.clicks, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRank} onValueChange={setFilterRank}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranks</SelectItem>
                <SelectItem value="top10">Top 10</SelectItem>
                <SelectItem value="top20">Top 20</SelectItem>
                <SelectItem value="below20">Below 20</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterOpportunity} onValueChange={setFilterOpportunity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by opportunity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Opportunities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateAIKeywords} disabled={isGeneratingKeywords}>
              <Brain className="w-4 h-4 mr-2" />
              {isGeneratingKeywords ? "Generating..." : "AI Suggestions"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Current Rank</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Opportunity</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeywords.map((keyword) => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell className={getRankColor(keyword.currentRank)}>#{keyword.currentRank}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(keyword.trend)}
                      <span
                        className={
                          keyword.trend === "up"
                            ? "text-green-600"
                            : keyword.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                        }
                      >
                        {keyword.currentRank - keyword.previousRank !== 0 &&
                          (keyword.currentRank - keyword.previousRank > 0 ? "+" : "") +
                            (keyword.currentRank - keyword.previousRank)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{keyword.volume.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        keyword.difficulty > 70 ? "destructive" : keyword.difficulty > 50 ? "default" : "secondary"
                      }
                    >
                      {keyword.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>{keyword.ctr}%</TableCell>
                  <TableCell>{keyword.clicks.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getOpportunityColor(keyword.opportunity)}>{keyword.opportunity}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{keyword.url}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Keywords Modal */}
      <Dialog open={isAddingKeywords} onOpenChange={setIsAddingKeywords}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Keywords to Track</DialogTitle>
            <DialogDescription>Enter keywords one per line to start tracking their performance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="keywords">Keywords (one per line)</Label>
              <Textarea
                id="keywords"
                placeholder="pattaya hotels&#10;best restaurants pattaya&#10;jomtien beach activities"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                rows={10}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingKeywords(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddKeywords}>Add Keywords</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
