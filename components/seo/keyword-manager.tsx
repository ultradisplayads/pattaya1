"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Plus, TrendingUp, TrendingDown, Target, Download, Trash2, Edit, BarChart3 } from "lucide-react"

interface Keyword {
  id: string
  keyword: string
  currentRank: number
  previousRank: number
  searchVolume: number
  difficulty: number
  ctr: number
  impressions: number
  clicks: number
  url: string
  lastUpdated: string
  opportunity: "high" | "medium" | "low"
}

export function KeywordManager() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOpportunity, setFilterOpportunity] = useState("all")
  const [sortBy, setSortBy] = useState("currentRank")
  const [isAddingKeywords, setIsAddingKeywords] = useState(false)
  const [newKeywords, setNewKeywords] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchKeywords()
  }, [])

  const fetchKeywords = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockKeywords: Keyword[] = [
        {
          id: "1",
          keyword: "pattaya restaurants",
          currentRank: 3,
          previousRank: 5,
          searchVolume: 8100,
          difficulty: 65,
          ctr: 12.5,
          impressions: 45000,
          clicks: 5625,
          url: "/dining/restaurants",
          lastUpdated: "2024-01-15",
          opportunity: "high",
        },
        {
          id: "2",
          keyword: "best hotels pattaya",
          currentRank: 7,
          previousRank: 8,
          searchVolume: 12000,
          difficulty: 78,
          ctr: 8.2,
          impressions: 32000,
          clicks: 2624,
          url: "/hotels",
          lastUpdated: "2024-01-15",
          opportunity: "medium",
        },
        {
          id: "3",
          keyword: "pattaya nightlife guide",
          currentRank: 12,
          previousRank: 15,
          searchVolume: 3200,
          difficulty: 45,
          ctr: 4.1,
          impressions: 18000,
          clicks: 738,
          url: "/nightlife",
          lastUpdated: "2024-01-15",
          opportunity: "high",
        },
        {
          id: "4",
          keyword: "things to do pattaya",
          currentRank: 5,
          previousRank: 4,
          searchVolume: 15000,
          difficulty: 72,
          ctr: 15.8,
          impressions: 67000,
          clicks: 10586,
          url: "/attractions",
          lastUpdated: "2024-01-15",
          opportunity: "medium",
        },
        {
          id: "5",
          keyword: "pattaya weather today",
          currentRank: 2,
          previousRank: 2,
          searchVolume: 6700,
          difficulty: 35,
          ctr: 18.9,
          impressions: 89000,
          clicks: 16821,
          url: "/weather",
          lastUpdated: "2024-01-15",
          opportunity: "low",
        },
      ]

      setKeywords(mockKeywords)
    } catch (error) {
      console.error("Failed to fetch keywords:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredKeywords = keywords.filter((keyword) => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOpportunity = filterOpportunity === "all" || keyword.opportunity === filterOpportunity
    return matchesSearch && matchesOpportunity
  })

  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    switch (sortBy) {
      case "currentRank":
        return a.currentRank - b.currentRank
      case "searchVolume":
        return b.searchVolume - a.searchVolume
      case "opportunity":
        const opportunityOrder = { high: 3, medium: 2, low: 1 }
        return opportunityOrder[b.opportunity] - opportunityOrder[a.opportunity]
      case "clicks":
        return b.clicks - a.clicks
      default:
        return 0
    }
  })

  const handleAddKeywords = async () => {
    if (!newKeywords.trim()) return

    const keywordList = newKeywords
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean)

    // Simulate API call to add keywords
    console.log("Adding keywords:", keywordList)
    setNewKeywords("")
    setIsAddingKeywords(false)
    // Refresh keywords list
    fetchKeywords()
  }

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current
    if (change > 0) {
      return { direction: "up", value: change, color: "text-green-600" }
    } else if (change < 0) {
      return { direction: "down", value: Math.abs(change), color: "text-red-600" }
    }
    return { direction: "same", value: 0, color: "text-gray-600" }
  }

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
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
        <div className="flex gap-2">
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="currentRank">Current Rank</SelectItem>
              <SelectItem value="searchVolume">Search Volume</SelectItem>
              <SelectItem value="opportunity">Opportunity</SelectItem>
              <SelectItem value="clicks">Clicks</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddingKeywords} onOpenChange={setIsAddingKeywords}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Keywords
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Keywords</DialogTitle>
                <DialogDescription>
                  Enter keywords to track, one per line. We'll automatically fetch ranking data and metrics.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Textarea
                    id="keywords"
                    placeholder="pattaya restaurants&#10;best hotels pattaya&#10;things to do pattaya"
                    value={newKeywords}
                    onChange={(e) => setNewKeywords(e.target.value)}
                    rows={6}
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
      </div>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Keyword Performance ({sortedKeywords.length} keywords)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Current Rank</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Search Volume</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Opportunity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedKeywords.map((keyword) => {
                const rankChange = getRankChange(keyword.currentRank, keyword.previousRank)
                return (
                  <TableRow key={keyword.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{keyword.keyword}</div>
                        <div className="text-sm text-gray-500">{keyword.url}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        #{keyword.currentRank}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center ${rankChange.color}`}>
                        {rankChange.direction === "up" && <TrendingUp className="w-4 h-4 mr-1" />}
                        {rankChange.direction === "down" && <TrendingDown className="w-4 h-4 mr-1" />}
                        {rankChange.value > 0 ? rankChange.value : "-"}
                      </div>
                    </TableCell>
                    <TableCell>{keyword.searchVolume.toLocaleString()}/mo</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          keyword.difficulty >= 70
                            ? "border-red-200 text-red-700"
                            : keyword.difficulty >= 40
                              ? "border-yellow-200 text-yellow-700"
                              : "border-green-200 text-green-700"
                        }
                      >
                        {keyword.difficulty}%
                      </Badge>
                    </TableCell>
                    <TableCell>{keyword.ctr}%</TableCell>
                    <TableCell>{keyword.clicks.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getOpportunityColor(keyword.opportunity)}>{keyword.opportunity}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{keywords.filter((k) => k.currentRank <= 3).length}</p>
              <p className="text-sm text-gray-600">Top 3 Rankings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{keywords.filter((k) => k.currentRank <= 10).length}</p>
              <p className="text-sm text-gray-600">Top 10 Rankings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {keywords.filter((k) => k.opportunity === "high").length}
              </p>
              <p className="text-sm text-gray-600">High Opportunities</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {keywords.reduce((sum, k) => sum + k.clicks, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Monthly Clicks</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
