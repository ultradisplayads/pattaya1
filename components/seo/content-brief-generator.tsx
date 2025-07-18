"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Brain, FileText, Lightbulb, Copy, Download, RefreshCw } from "lucide-react"

interface ContentBrief {
  id: string
  title: string
  targetKeyword: string
  wordCount: number
  targetAudience: string
  contentType: string
  outline: string[]
  lsiKeywords: string[]
  competitorAnalysis: {
    url: string
    title: string
    wordCount: number
    headings: number
  }[]
  peopleAlsoAsk: string[]
  metaTitle: string
  metaDescription: string
  status: "draft" | "in-progress" | "completed"
}

export function ContentBriefGenerator() {
  const [targetKeyword, setTargetKeyword] = useState("")
  const [contentType, setContentType] = useState("blog-post")
  const [targetAudience, setTargetAudience] = useState("tourists")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBrief, setGeneratedBrief] = useState<ContentBrief | null>(null)
  const [generatedContent, setGeneratedContent] = useState("")

  const handleGenerateBrief = async () => {
    if (!targetKeyword.trim()) return

    setIsGenerating(true)
    try {
      // Simulate AI API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockBrief: ContentBrief = {
        id: "1",
        title: `Complete Guide to ${targetKeyword}`,
        targetKeyword,
        wordCount: 2500,
        targetAudience,
        contentType,
        outline: [
          "Introduction to " + targetKeyword,
          "Why " + targetKeyword + " is Important",
          "Top 10 " + targetKeyword + " Options",
          "How to Choose the Best " + targetKeyword,
          "Expert Tips and Recommendations",
          "Frequently Asked Questions",
          "Conclusion and Next Steps",
        ],
        lsiKeywords: [
          targetKeyword + " guide",
          "best " + targetKeyword,
          targetKeyword + " tips",
          targetKeyword + " recommendations",
          "top " + targetKeyword,
          targetKeyword + " reviews",
          targetKeyword + " comparison",
          "how to " + targetKeyword,
        ],
        competitorAnalysis: [
          {
            url: "competitor1.com",
            title: "Best " + targetKeyword + " Guide 2024",
            wordCount: 3200,
            headings: 12,
          },
          {
            url: "competitor2.com",
            title: "Ultimate " + targetKeyword + " Resource",
            wordCount: 2800,
            headings: 15,
          },
          {
            url: "competitor3.com",
            title: targetKeyword + " Complete Guide",
            wordCount: 2100,
            headings: 8,
          },
        ],
        peopleAlsoAsk: [
          "What is the best " + targetKeyword + "?",
          "How much does " + targetKeyword + " cost?",
          "Where can I find " + targetKeyword + "?",
          "When is the best time for " + targetKeyword + "?",
          "Why should I choose " + targetKeyword + "?",
        ],
        metaTitle: `Best ${targetKeyword} Guide 2024 - Complete Resource`,
        metaDescription: `Discover everything you need to know about ${targetKeyword}. Our comprehensive guide covers tips, recommendations, and expert advice.`,
        status: "draft",
      }

      setGeneratedBrief(mockBrief)
    } catch (error) {
      console.error("Failed to generate brief:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateContent = async () => {
    if (!generatedBrief) return

    setIsGenerating(true)
    try {
      // Simulate AI content generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const mockContent = `# ${generatedBrief.title}

## Introduction

Welcome to the ultimate guide on ${generatedBrief.targetKeyword}. Whether you're a first-time visitor or a seasoned traveler, this comprehensive resource will help you make the most of your experience.

## Why ${generatedBrief.targetKeyword} is Important

${generatedBrief.targetKeyword} plays a crucial role in enhancing your travel experience. Here's why it matters:

- **Enhanced Experience**: Understanding ${generatedBrief.targetKeyword} helps you make informed decisions
- **Cost Savings**: Proper planning can save you money and time
- **Safety**: Knowledge of ${generatedBrief.targetKeyword} ensures a safer experience
- **Cultural Appreciation**: Deeper understanding leads to better cultural immersion

## Top 10 ${generatedBrief.targetKeyword} Options

Based on extensive research and user reviews, here are the top options:

1. **Option 1**: Premium choice with excellent reviews
2. **Option 2**: Budget-friendly alternative
3. **Option 3**: Best for families
4. **Option 4**: Luxury experience
5. **Option 5**: Adventure seekers' favorite

[Content continues...]

## Expert Tips and Recommendations

Our team of experts has compiled these essential tips:

- **Tip 1**: Plan ahead for better deals
- **Tip 2**: Consider seasonal variations
- **Tip 3**: Read recent reviews
- **Tip 4**: Compare multiple options
- **Tip 5**: Book with reputable providers

## Conclusion

${generatedBrief.targetKeyword} offers incredible opportunities for memorable experiences. By following this guide, you'll be well-prepared to make the most of your adventure.

*This content was generated using AI and should be reviewed and edited before publication.*`

      setGeneratedContent(mockContent)
    } catch (error) {
      console.error("Failed to generate content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="space-y-6">
      {/* Content Brief Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Content Brief Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="targetKeyword">Target Keyword</Label>
              <Input
                id="targetKeyword"
                placeholder="e.g., pattaya restaurants"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="guide">Complete Guide</SelectItem>
                  <SelectItem value="listicle">Listicle</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourists">Tourists</SelectItem>
                  <SelectItem value="locals">Locals</SelectItem>
                  <SelectItem value="business-travelers">Business Travelers</SelectItem>
                  <SelectItem value="families">Families</SelectItem>
                  <SelectItem value="backpackers">Backpackers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleGenerateBrief} disabled={isGenerating || !targetKeyword.trim()}>
            {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
            Generate Content Brief
          </Button>
        </CardContent>
      </Card>

      {/* Generated Brief */}
      {generatedBrief && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Content Brief: {generatedBrief.title}
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(generatedBrief, null, 2))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Brief
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="outline">Outline</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Content Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target Keyword:</span>
                        <Badge variant="outline">{generatedBrief.targetKeyword}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Word Count:</span>
                        <span>{generatedBrief.wordCount.toLocaleString()} words</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Content Type:</span>
                        <span className="capitalize">{generatedBrief.contentType.replace("-", " ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target Audience:</span>
                        <span className="capitalize">{generatedBrief.targetAudience}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">People Also Ask</h4>
                    <div className="space-y-1">
                      {generatedBrief.peopleAlsoAsk.map((question, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="outline" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Content Outline</h4>
                  <div className="space-y-2">
                    {generatedBrief.outline.map((section, index) => (
                      <div key={index} className="flex items-center p-3 border rounded-lg">
                        <span className="font-mono text-sm text-gray-500 mr-3">H{index === 0 ? "1" : "2"}</span>
                        <span>{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">LSI Keywords & Related Terms</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedBrief.lsiKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="competitors" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Competitor Analysis</h4>
                  <div className="space-y-3">
                    {generatedBrief.competitorAnalysis.map((competitor, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{competitor.title}</h5>
                          <Badge variant="outline">{competitor.url}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>Word Count: {competitor.wordCount.toLocaleString()}</div>
                          <div>Headings: {competitor.headings}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input id="metaTitle" value={generatedBrief.metaTitle} readOnly />
                    <div className="text-xs text-gray-500 mt-1">{generatedBrief.metaTitle.length}/60 characters</div>
                  </div>
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea id="metaDescription" value={generatedBrief.metaDescription} readOnly rows={3} />
                    <div className="text-xs text-gray-500 mt-1">
                      {generatedBrief.metaDescription.length}/160 characters
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* AI Content Writer */}
      {generatedBrief && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              AI Content Writer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Generate full content based on your brief</p>
              <Button onClick={handleGenerateContent} disabled={isGenerating}>
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4 mr-2" />
                )}
                Generate Content
              </Button>
            </div>

            {generatedContent && (
              <div className="space-y-4">
                <Separator />
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Generated Content</h4>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Content
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
