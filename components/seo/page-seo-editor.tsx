"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Save,
  RefreshCw,
  Eye,
  Search,
  ImageIcon,
  Code,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react"

interface PageSEO {
  id: string
  url: string
  title: string
  metaDescription: string
  metaKeywords: string
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  schema: string
  robotsMeta: string
  hreflang: Array<{
    lang: string
    url: string
  }>
  seoScore: number
  issues: Array<{
    type: "error" | "warning" | "info"
    message: string
    suggestion: string
  }>
  lastUpdated: string
}

export function PageSEOEditor() {
  const [selectedPage, setSelectedPage] = useState<string>("")
  const [pageSEO, setPageSEO] = useState<PageSEO | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [previewMode, setPreviewMode] = useState<"google" | "facebook" | "twitter">("google")

  const pages = [
    { value: "/", label: "Homepage" },
    { value: "/dining/restaurants", label: "Restaurants" },
    { value: "/nightlife/bars", label: "Nightlife" },
    { value: "/weather", label: "Weather" },
    { value: "/events", label: "Events" },
    { value: "/hotels", label: "Hotels" },
  ]

  useEffect(() => {
    if (selectedPage) {
      fetchPageSEO(selectedPage)
    }
  }, [selectedPage])

  const fetchPageSEO = async (url: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockPageSEO: PageSEO = {
        id: "1",
        url,
        title: url === "/" ? "Pattaya1 - Your Complete Guide to Pattaya" : `${url.split("/").pop()} - Pattaya1`,
        metaDescription: `Discover the best ${url.split("/").pop()} in Pattaya. Complete guide with reviews, recommendations, and insider tips.`,
        metaKeywords: `pattaya, ${url.split("/").pop()}, thailand, travel, guide`,
        canonicalUrl: `https://pattaya1.com${url}`,
        ogTitle: `${url.split("/").pop()} in Pattaya - Complete Guide`,
        ogDescription: `Everything you need to know about ${url.split("/").pop()} in Pattaya. Expert recommendations and reviews.`,
        ogImage: "https://pattaya1.com/og-image.jpg",
        twitterTitle: `${url.split("/").pop()} in Pattaya`,
        twitterDescription: `Discover the best ${url.split("/").pop()} in Pattaya with our complete guide.`,
        twitterImage: "https://pattaya1.com/twitter-image.jpg",
        schema: JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${url.split("/").pop()} - Pattaya1`,
            description: `Complete guide to ${url.split("/").pop()} in Pattaya`,
          },
          null,
          2,
        ),
        robotsMeta: "index, follow",
        hreflang: [
          { lang: "en", url: `https://pattaya1.com${url}` },
          { lang: "th", url: `https://pattaya1.com/th${url}` },
        ],
        seoScore: Math.floor(Math.random() * 30) + 70,
        issues: [
          {
            type: "warning",
            message: "Meta description is too short",
            suggestion: "Expand to 150-160 characters for better SERP display",
          },
          {
            type: "info",
            message: "Consider adding FAQ schema",
            suggestion: "FAQ schema can help capture featured snippets",
          },
        ],
        lastUpdated: "2024-01-15T10:30:00Z",
      }

      setPageSEO(mockPageSEO)
    } catch (error) {
      console.error("Failed to fetch page SEO:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!pageSEO) return

    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Saving page SEO:", pageSEO)
    } catch (error) {
      console.error("Failed to save page SEO:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAIOptimize = async () => {
    if (!pageSEO) return

    setIsOptimizing(true)
    try {
      // Simulate AI optimization
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setPageSEO((prev) => {
        if (!prev) return null
        return {
          ...prev,
          title: `Best ${prev.url.split("/").pop()} in Pattaya 2024 - Complete Guide`,
          metaDescription: `Discover the top ${prev.url.split("/").pop()} in Pattaya with our comprehensive 2024 guide. Expert reviews, insider tips, and everything you need for an amazing experience.`,
          seoScore: Math.min(prev.seoScore + 15, 100),
          issues: prev.issues.filter((issue) => issue.type !== "warning"),
        }
      })
    } catch (error) {
      console.error("Failed to optimize with AI:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const updateField = (field: keyof PageSEO, value: string) => {
    if (!pageSEO) return
    setPageSEO({ ...pageSEO, [field]: value })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <Lightbulb className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  if (!selectedPage) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Select a Page to Edit</h3>
          <p className="text-gray-600 mb-4">Choose a page from the dropdown to start editing its SEO settings</p>
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-64 mx-auto">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.value} value={page.value}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    )
  }

  if (isLoading || !pageSEO) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Selector & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.value} value={page.value}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">SEO Score:</span>
            <span className={`text-2xl font-bold ${getScoreColor(pageSEO.seoScore)}`}>{pageSEO.seoScore}/100</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleAIOptimize} disabled={isOptimizing}>
            {isOptimizing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
            AI Optimize
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* SEO Score & Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(pageSEO.seoScore)}`}>{pageSEO.seoScore}/100</div>
              <p className="text-gray-600 mb-4">SEO Health Score</p>
              <Progress value={pageSEO.seoScore} className="mb-4" />
              <div className="text-sm text-gray-500">
                Last updated: {new Date(pageSEO.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              SEO Issues & Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pageSEO.issues.length === 0 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>No SEO issues found!</span>
                </div>
              ) : (
                pageSEO.issues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <p className="font-medium">{issue.message}</p>
                      <p className="text-sm text-gray-600 mt-1">{issue.suggestion}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Editor Tabs */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic SEO</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={pageSEO.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Enter page title"
                />
                <div className="text-xs text-gray-500 mt-1">{pageSEO.title.length}/60 characters</div>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={pageSEO.metaDescription}
                  onChange={(e) => updateField("metaDescription", e.target.value)}
                  placeholder="Enter meta description"
                  rows={3}
                />
                <div className="text-xs text-gray-500 mt-1">{pageSEO.metaDescription.length}/160 characters</div>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={pageSEO.metaKeywords}
                  onChange={(e) => updateField("metaKeywords", e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={pageSEO.canonicalUrl}
                  onChange={(e) => updateField("canonicalUrl", e.target.value)}
                  placeholder="https://example.com/page"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Open Graph (Facebook)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ogTitle">OG Title</Label>
                  <Input
                    id="ogTitle"
                    value={pageSEO.ogTitle}
                    onChange={(e) => updateField("ogTitle", e.target.value)}
                    placeholder="Facebook title"
                  />
                </div>
                <div>
                  <Label htmlFor="ogDescription">OG Description</Label>
                  <Textarea
                    id="ogDescription"
                    value={pageSEO.ogDescription}
                    onChange={(e) => updateField("ogDescription", e.target.value)}
                    placeholder="Facebook description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    value={pageSEO.ogImage}
                    onChange={(e) => updateField("ogImage", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Twitter Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="twitterTitle">Twitter Title</Label>
                  <Input
                    id="twitterTitle"
                    value={pageSEO.twitterTitle}
                    onChange={(e) => updateField("twitterTitle", e.target.value)}
                    placeholder="Twitter title"
                  />
                </div>
                <div>
                  <Label htmlFor="twitterDescription">Twitter Description</Label>
                  <Textarea
                    id="twitterDescription"
                    value={pageSEO.twitterDescription}
                    onChange={(e) => updateField("twitterDescription", e.target.value)}
                    placeholder="Twitter description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="twitterImage">Twitter Image URL</Label>
                  <Input
                    id="twitterImage"
                    value={pageSEO.twitterImage}
                    onChange={(e) => updateField("twitterImage", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="robotsMeta">Robots Meta Tag</Label>
                <Select value={pageSEO.robotsMeta} onValueChange={(value) => updateField("robotsMeta", value)}>
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
                <Label>Hreflang Tags</Label>
                <div className="space-y-2">
                  {pageSEO.hreflang.map((hreflang, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        value={hreflang.lang}
                        onChange={(e) => {
                          const newHreflang = [...pageSEO.hreflang]
                          newHreflang[index].lang = e.target.value
                          updateField("hreflang", newHreflang as any)
                        }}
                        placeholder="Language code"
                        className="w-32"
                      />
                      <Input
                        value={hreflang.url}
                        onChange={(e) => {
                          const newHreflang = [...pageSEO.hreflang]
                          newHreflang[index].url = e.target.value
                          updateField("hreflang", newHreflang as any)
                        }}
                        placeholder="URL"
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Schema Markup (JSON-LD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="schema">Schema JSON</Label>
                <Textarea
                  id="schema"
                  value={pageSEO.schema}
                  onChange={(e) => updateField("schema", e.target.value)}
                  placeholder="Enter JSON-LD schema markup"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              <Button
                variant={previewMode === "google" ? "default" : "outline"}
                onClick={() => setPreviewMode("google")}
              >
                <Search className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button
                variant={previewMode === "facebook" ? "default" : "outline"}
                onClick={() => setPreviewMode("facebook")}
              >
                Facebook
              </Button>
              <Button
                variant={previewMode === "twitter" ? "default" : "outline"}
                onClick={() => setPreviewMode("twitter")}
              >
                Twitter
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                {previewMode === "google" && "Google Search Preview"}
                {previewMode === "facebook" && "Facebook Share Preview"}
                {previewMode === "twitter" && "Twitter Card Preview"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {previewMode === "google" && (
                <div className="border rounded-lg p-4 bg-white">
                  <div className="text-blue-600 text-lg hover:underline cursor-pointer">{pageSEO.title}</div>
                  <div className="text-green-700 text-sm mt-1">{pageSEO.canonicalUrl}</div>
                  <div className="text-gray-600 text-sm mt-2">{pageSEO.metaDescription}</div>
                </div>
              )}

              {previewMode === "facebook" && (
                <div className="border rounded-lg overflow-hidden bg-white max-w-md">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-gray-900 mb-1">{pageSEO.ogTitle}</div>
                    <div className="text-gray-600 text-sm mb-2">{pageSEO.ogDescription}</div>
                    <div className="text-gray-500 text-xs uppercase">{new URL(pageSEO.canonicalUrl).hostname}</div>
                  </div>
                </div>
              )}

              {previewMode === "twitter" && (
                <div className="border rounded-lg overflow-hidden bg-white max-w-md">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-gray-900 mb-1">{pageSEO.twitterTitle}</div>
                    <div className="text-gray-600 text-sm mb-2">{pageSEO.twitterDescription}</div>
                    <div className="text-gray-500 text-xs">{new URL(pageSEO.canonicalUrl).hostname}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PageSEOEditor
