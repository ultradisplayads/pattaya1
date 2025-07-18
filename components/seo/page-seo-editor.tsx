"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Search, Plus, Trash2, Brain, ImageIcon, Smartphone, Monitor, ArrowUpDown } from "lucide-react"

interface SEOPage {
  id: string
  type: "page" | "widget" | "block"
  title: string
  url: string
  metaTitle: string
  metaDescription: string
  seoScore: number
  indexed: boolean
  lastModified: string
  keywords: string[]
  headings: { tag: string; text: string }[]
  schema: any[]
  openGraph: {
    title: string
    description: string
    image: string
  }
  twitterCard: {
    title: string
    description: string
    image: string
  }
  canonicalUrl: string
  robots: string
}

export function PageSEOEditor() {
  const [pages, setPages] = useState<SEOPage[]>([])
  const [selectedPage, setSelectedPage] = useState<SEOPage | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("seoScore")
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop")

  // Sample data - replace with API calls
  useEffect(() => {
    const samplePages: SEOPage[] = [
      {
        id: "1",
        type: "page",
        title: "Pattaya Restaurants Guide",
        url: "/dining/restaurants",
        metaTitle: "Best Pattaya Restaurants 2024 - Complete Dining Guide",
        metaDescription:
          "Discover the best restaurants in Pattaya with our comprehensive guide. From street food to fine dining, find your perfect meal.",
        seoScore: 85,
        indexed: true,
        lastModified: "2024-01-15",
        keywords: ["pattaya restaurants", "best dining pattaya", "pattaya food guide"],
        headings: [
          { tag: "h1", text: "Best Pattaya Restaurants 2024" },
          { tag: "h2", text: "Top Fine Dining Restaurants" },
          { tag: "h2", text: "Best Street Food Spots" },
        ],
        schema: [{ type: "Restaurant", json: {} }],
        openGraph: {
          title: "Best Pattaya Restaurants 2024 - Complete Dining Guide",
          description: "Discover the best restaurants in Pattaya with our comprehensive guide.",
          image: "/images/pattaya-restaurants-og.jpg",
        },
        twitterCard: {
          title: "Best Pattaya Restaurants 2024",
          description: "Discover the best restaurants in Pattaya with our comprehensive guide.",
          image: "/images/pattaya-restaurants-twitter.jpg",
        },
        canonicalUrl: "https://pattaya1.com/dining/restaurants",
        robots: "index, follow",
      },
      {
        id: "2",
        type: "widget",
        title: "Weather Widget",
        url: "/widgets/weather",
        metaTitle: "Pattaya Weather Today - Live Updates",
        metaDescription:
          "Get real-time weather updates for Pattaya. Current temperature, forecast, and weather conditions.",
        seoScore: 72,
        indexed: true,
        lastModified: "2024-01-14",
        keywords: ["pattaya weather", "weather today pattaya", "pattaya forecast"],
        headings: [
          { tag: "h2", text: "Current Weather in Pattaya" },
          { tag: "h3", text: "7-Day Forecast" },
        ],
        schema: [{ type: "WeatherForecast", json: {} }],
        openGraph: {
          title: "Pattaya Weather Today - Live Updates",
          description: "Get real-time weather updates for Pattaya.",
          image: "/images/pattaya-weather-og.jpg",
        },
        twitterCard: {
          title: "Pattaya Weather Today",
          description: "Get real-time weather updates for Pattaya.",
          image: "/images/pattaya-weather-twitter.jpg",
        },
        canonicalUrl: "https://pattaya1.com/weather",
        robots: "index, follow",
      },
    ]
    setPages(samplePages)
  }, [])

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || page.type === filterType
    return matchesSearch && matchesType
  })

  const sortedPages = [...filteredPages].sort((a, b) => {
    switch (sortBy) {
      case "seoScore":
        return b.seoScore - a.seoScore
      case "title":
        return a.title.localeCompare(b.title)
      case "lastModified":
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      default:
        return 0
    }
  })

  const handleEditPage = (page: SEOPage) => {
    setSelectedPage({ ...page })
    setIsEditing(true)
  }

  const handleSavePage = async () => {
    if (selectedPage) {
      // API call to save page
      const updatedPages = pages.map((p) => (p.id === selectedPage.id ? selectedPage : p))
      setPages(updatedPages)
      setIsEditing(false)
      setSelectedPage(null)
    }
  }

  const handleAIOptimize = async (pageId: string) => {
    // AI optimization logic
    console.log("AI optimizing page:", pageId)
  }

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search pages, widgets, or blocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="page">Pages</SelectItem>
                <SelectItem value="widget">Widgets</SelectItem>
                <SelectItem value="block">Blocks</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seoScore">SEO Score</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="lastModified">Last Modified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pages & Widgets SEO Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>SEO Score</TableHead>
                <TableHead>Indexed</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{page.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{page.url}</TableCell>
                  <TableCell>
                    <Badge className={getSEOScoreColor(page.seoScore)}>
                      {page.seoScore}/100
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {page.indexed ? (
                      <Badge className="bg-green-100 text-green-800">Indexed</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Not Indexed</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {page.keywords.slice(0, 2).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {page.keywords.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{page.keywords.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditPage(page)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAIOptimize(page.id)}>
                        <Brain className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SEO Editor Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit SEO Settings: {selectedPage?.title}</DialogTitle>
            <DialogDescription>
              Optimize your page for search engines with AI-powered suggestions
            </DialogDescription>
          </DialogHeader>

          {selectedPage && (
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic SEO</TabsTrigger>
                <TabsTrigger value="headings">Headings</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="schema">Schema</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={selectedPage.metaTitle}
                      onChange={(e) =>
                        setSelectedPage({ ...selectedPage, metaTitle: e.target.value })
                      }
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedPage.metaTitle.length}/60 characters
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="canonicalUrl">Canonical URL</Label>
                    <Input
                      id="canonicalUrl"
                      value={selectedPage.canonicalUrl}
                      onChange={(e) =>
                        setSelectedPage({ ...selectedPage, canonicalUrl: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={selectedPage.metaDescription}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, metaDescription: e.target.value })
                    }
                    rows={3}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedPage.metaDescription.length}/160 characters
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="robots">Robots</Label>
                    <Select
                      value={selectedPage.robots}
                      onValueChange={(value) =>
                        setSelectedPage({ ...selectedPage, robots: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index, follow">Index, Follow</SelectItem>
                        <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                        <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                        <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="keywords">Target Keywords</Label>
                    <Input
                      id="keywords"
                      value={selectedPage.keywords.join(", ")}
                      onChange={(e) =>
                        setSelectedPage({
                          ...selectedPage,
                          keywords: e.target.value.split(", ").filter(Boolean),
                        })
                      }
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="headings" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Heading Structure</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Heading
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedPage.headings.map((heading, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded">
                      <Select
                        value={heading.tag}
                        onValueChange={(value) => {
                          const newHeadings = [...selectedPage.headings]
                          newHeadings[index].tag = value
                          setSelectedPage({ ...selectedPage, headings: newHeadings })
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="h1">H1</SelectItem>
                          <SelectItem value="h2">H2</SelectItem>
                          <SelectItem value="h3">H3</SelectItem>
                          <SelectItem value="h4">H4</SelectItem>
                          <SelectItem value="h5">H5</SelectItem>
                          <SelectItem value="h6">H6</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={heading.text}
                        onChange={(e) => {
                          const newHeadings = [...selectedPage.headings]
                          newHeadings[index].text = e.target.value
                          setSelectedPage({ ...selectedPage, headings: newHeadings })
                        }}
                        className="flex-1"
                      />
                      <Button size="sm" variant="outline">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Open Graph (Facebook)</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="ogTitle">OG Title</Label>
                        <Input
                          id="ogTitle"
                          value={selectedPage.openGraph.title}
                          onChange={(e) =>
                            setSelectedPage({
                              ...selectedPage,
                              openGraph: { ...selectedPage.openGraph, title: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="ogDescription">OG Description</Label>
                        <Textarea
                          id="ogDescription"
                          value={selectedPage.openGraph.description}
                          onChange={(e) =>
                            setSelectedPage({
                              ...selectedPage,
                              openGraph: { ...selectedPage.openGraph, description: e.target.value },
                            })
                          }
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ogImage">OG Image URL</Label>
                        <Input
                          id="ogImage"
                          value={selectedPage.openGraph.image}
                          onChange={(e) =>
                            setSelectedPage({
                              ...selectedPage,
                              openGraph: { ...selectedPage.openGraph, image: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Twitter Card</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="twitterTitle">Twitter Title</Label>
                        <Input
                          id="twitterTitle"
                          value={selectedPage.twitterCard.title}
                          onChange={(e) =>
                            setSelectedPage({
                              ...selectedPage,
                              twitterCard: { ...selectedPage.twitterCard, title: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitterDescription">Twitter Description</Label>
                        <Textarea
                          id="twitterDescription"
                          value={selectedPage.twitterCard.description}
                          onChange={(e) =>
                            setSelectedPage({
                              ...selectedPage,
                              twitterCard: { ...selectedPage.twitterCard, description: e.target.value },
                            })
                          }
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitterImage">Twitter Image URL</Label>
                        <Input
                          id="twitterImage"
                          value={selectedPage.twitterCard.image}
                          onChange={(e) =>
                            setSelectedPage({
                              ...selectedPage,
                              twitterCard: { ...selectedPage.twitterCard, image: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schema" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Schema Markup</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Schema
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedPage.schema.map((schema, index) => (
                    <div key={index} className="border rounded p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>{schema.type}</Badge>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={JSON.stringify(schema.json, null, 2)}
                        onChange={(e) => {
                          try {
                            const newSchema = [...selectedPage.schema]
                            newSchema[index].json = JSON.parse(e.target.value)
                            setSelectedPage({ ...selectedPage, schema: newSchema })
                          } catch (error) {
                            // Handle JSON parse error
                          }
                        }}
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">SERP & Social Preview</h3>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={previewDevice === "desktop" ? "default" : "outline"}
                      onClick={() => setPreviewDevice("desktop")}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={previewDevice === "mobile" ? "default" : "outline"}
                      onClick={() => setPreviewDevice("mobile")}
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Google SERP Preview */}
                  <div>
                    <h4 className="font-medium mb-2">Google Search Result</h4>
                    <div className="border rounded p-4 bg-white">
                      <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {selectedPage.metaTitle}
                      </div>
                      <div className="text-green-600 text-sm">{selectedPage.canonicalUrl}</div>
                      <div className="text-gray-600 text-sm mt-1">{selectedPage.metaDescription}</div>
                    </div>
                  </div>

                  {/* Facebook Preview */}
                  <div>
                    <h4 className="font-medium mb-2">Facebook Share Preview</h4>
                    <div className="border rounded overflow-hidden bg-white max-w-md">
                      <div className="h-32 bg-gray-200 flex items-center justify-center">
                        {selectedPage.openGraph.image ? (
                          <img
                            src={selectedPage.openGraph.image || "/placeholder.svg"}
                            alt="OG Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="font-medium text-sm">{selectedPage.openGraph.title}</div>
                        <div className="text-gray-600 text-xs mt-1">{selectedPage.openGraph.description}</div>
                        <div className="text-gray-500 text-xs mt-1">{selectedPage.canonicalUrl}</div>
                      </div>
                    </div>
                  </div>

                  {/* Twitter Preview */}
                  <div>
                    <h4 className="font-medium mb-2">Twitter Card Preview</h4>
                    <div className="border rounded overflow-hidden bg-white max-w-md">
                      <div className="h-32 bg-gray-200 flex items-center justify-center">
                        {selectedPage.twitterCard.image ? (
                          <img
                            src={selectedPage.twitterCard.image || "/placeholder.svg"}
                            alt="Twitter Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="font-medium text-sm">{selectedPage.twitterCard.title}</div>
                        <div className="text-gray-600 text-xs mt-1">{selectedPage.twitterCard.description}</div>
                        <div className="text-gray-500 text-xs mt-1">{selectedPage.canonicalUrl}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
\
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleAIOptimize(selectedPage.id)} variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                AI Optimize
              </Button>
              <Button onClick={handleSavePage}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
