"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Search, Lightbulb, Target, TrendingUp, Users, Globe, ImageIcon, Video, HelpCircle } from "lucide-react"

interface ContentBrief {
  keyword: string
  searchVolume: number
  difficulty: number
  intent: string
  lsiKeywords: string[]
  questions: string[]
  headings: string[]
  competitors: {
    url: string
    title: string
    wordCount: number
    rank: number
  }[]
  recommendations: {
    wordCount: number
    readingLevel: string
    tone: string
    images: number
    videos: number
  }
  schema: string[]
}

export function ContentBriefGenerator() {
  const [targetKeyword, setTargetKeyword] = useState("")
  const [contentType, setContentType] = useState("article")
  const [isGenerating, setIsGenerating] = useState(false)
  const [brief, setBrief] = useState<ContentBrief | null>(null)
  const [generatedContent, setGeneratedContent] = useState("")

  const generateBrief = async () => {
    if (!targetKeyword.trim()) return

    setIsGenerating(true)

    // Simulate API call - replace with actual AI service
    setTimeout(() => {
      const mockBrief: ContentBrief = {
        keyword: targetKeyword,
        searchVolume: 8100,
        difficulty: 65,
        intent: "informational",
        lsiKeywords: [
          "best pattaya restaurants",
          "pattaya dining guide",
          "top restaurants pattaya",
          "pattaya food scene",
          "restaurant recommendations pattaya",
          "fine dining pattaya",
          "street food pattaya",
          "seafood restaurants pattaya",
        ],
        questions: [
          "What are the best restaurants in Pattaya?",
          "Where to eat in Pattaya for tourists?",
          "What is the best Thai food in Pattaya?",
          "Are there good vegetarian restaurants in Pattaya?",
          "What are the most expensive restaurants in Pattaya?",
          "Where can I find authentic Thai cuisine in Pattaya?",
          "What restaurants have the best view in Pattaya?",
          "Are there 24-hour restaurants in Pattaya?",
        ],
        headings: [
          "Best Pattaya Restaurants 2024: Complete Dining Guide",
          "Top Fine Dining Restaurants in Pattaya",
          "Best Street Food Spots in Pattaya",
          "Authentic Thai Restaurants",
          "International Cuisine Options",
          "Beachfront Dining Experiences",
          "Budget-Friendly Restaurant Options",
          "Vegetarian and Vegan Restaurants",
          "Late Night Dining in Pattaya",
          "Restaurant Booking Tips",
        ],
        competitors: [
          {
            url: "tripadvisor.com/restaurants-pattaya",
            title: "THE 10 BEST Restaurants in Pattaya",
            wordCount: 2500,
            rank: 1,
          },
          {
            url: "timeout.com/pattaya/restaurants",
            title: "Best restaurants in Pattaya",
            wordCount: 1800,
            rank: 2,
          },
          {
            url: "lonelyplanet.com/pattaya/restaurants",
            title: "Where to eat in Pattaya",
            wordCount: 2200,
            rank: 4,
          },
        ],
        recommendations: {
          wordCount: 2800,
          readingLevel: "Grade 8-10",
          tone: "Informative and engaging",
          images: 15,
          videos: 2,
        },
        schema: ["Article", "Restaurant", "Review", "FAQPage"],
      }
      setBrief(mockBrief)
      setIsGenerating(false)
    }, 2000)
  }

  const generateContent = async (section: string) => {
    setIsGenerating(true)

    // Simulate AI content generation
    setTimeout(() => {
      const mockContent = `# ${section}

Pattaya's culinary scene offers an incredible diversity of dining experiences, from world-class fine dining establishments to authentic street food vendors. Whether you're seeking traditional Thai flavors or international cuisine, this vibrant coastal city has something to satisfy every palate and budget.

## What Makes Pattaya's Restaurant Scene Special

The city's unique position as both a tourist destination and local community creates a dynamic food culture where traditional Thai cooking meets international influences. Local chefs have perfected the art of balancing authentic flavors with presentations that appeal to global tastes.

### Key Features:
- Fresh seafood caught daily from the Gulf of Thailand
- Traditional family recipes passed down through generations  
- International chefs bringing global techniques to local ingredients
- Diverse price points from street food to luxury dining

This combination creates an unparalleled dining landscape that continues to evolve and surprise visitors year after year.`

      setGeneratedContent(mockContent)
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Content Brief Generator</h2>
        <p className="text-gray-600">Generate AI-powered content briefs and writing assistance</p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Generate Content Brief
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="keyword">Target Keyword</Label>
              <Input
                id="keyword"
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
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="listicle">Listicle</SelectItem>
                  <SelectItem value="landing-page">Landing Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={generateBrief} disabled={isGenerating || !targetKeyword.trim()} className="mt-4">
            <Brain className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating Brief..." : "Generate Content Brief"}
          </Button>
        </CardContent>
      </Card>

      {/* Content Brief Results */}
      {brief && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="writer">AI Writer</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Search Volume</p>
                      <p className="text-2xl font-bold">{brief.searchVolume.toLocaleString()}</p>
                    </div>
                    <Search className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Difficulty</p>
                      <p className="text-2xl font-bold">{brief.difficulty}/100</p>
                    </div>
                    <Target className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Search Intent</p>
                      <p className="text-2xl font-bold capitalize">{brief.intent}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Content Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Content Specifications</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Target Word Count:</span>
                        <Badge>{brief.recommendations.wordCount} words</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Reading Level:</span>
                        <Badge variant="outline">{brief.recommendations.readingLevel}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Tone:</span>
                        <Badge variant="outline">{brief.recommendations.tone}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Media Requirements</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <ImageIcon className="w-4 h-4 mr-1" />
                          Images:
                        </span>
                        <Badge>{brief.recommendations.images}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center">
                          <Video className="w-4 h-4 mr-1" />
                          Videos:
                        </span>
                        <Badge>{brief.recommendations.videos}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Schema Types:</span>
                        <div className="flex space-x-1">
                          {brief.schema.map((schema, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {schema}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>LSI Keywords & Related Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-3">Primary LSI Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {brief.lsiKeywords.slice(0, 4).map((keyword, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Secondary Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {brief.lsiKeywords.slice(4).map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Keyword Usage Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Use primary keyword in title, first paragraph, and conclusion</li>
                    <li>Distribute LSI keywords naturally throughout the content</li>
                    <li>Include keywords in headings (H2, H3) where relevant</li>
                    <li>Maintain keyword density between 1-2% for primary keyword</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  People Also Ask Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {brief.questions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{question}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Consider creating a dedicated section or FAQ entry for this question
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => generateContent(question)}>
                          <Brain className="w-4 h-4 mr-1" />
                          Generate Answer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Content Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {brief.headings.map((heading, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index === 0 ? "H1" : index < 3 ? "H2" : "H3"}</Badge>
                        <span className="font-medium">{heading}</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => generateContent(heading)}>
                        <Brain className="w-4 h-4 mr-1" />
                        Write Section
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brief.competitors.map((competitor, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className="bg-blue-100 text-blue-800">Rank #{competitor.rank}</Badge>
                            <span className="font-medium">{competitor.title}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{competitor.url}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span>Word Count: {competitor.wordCount.toLocaleString()}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Globe className="w-4 h-4 mr-1" />
                          Analyze
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="writer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Content Writer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contentPrompt">Content Prompt</Label>
                    <Textarea id="contentPrompt" placeholder="Describe what you want to write about..." rows={3} />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => generateContent("Custom Content")} disabled={isGenerating}>
                      <Brain className="w-4 h-4 mr-2" />
                      {isGenerating ? "Generating..." : "Generate Content"}
                    </Button>
                    <Button variant="outline">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Rewrite
                    </Button>
                    <Button variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Optimize
                    </Button>
                  </div>
                  {generatedContent && (
                    <div className="mt-4">
                      <Label>Generated Content</Label>
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        rows={15}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
