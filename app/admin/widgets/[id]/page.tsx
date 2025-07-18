"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, RefreshCw, Settings, Key, Rss, DollarSign } from "lucide-react"

interface WidgetConfig {
  id: string
  name: string
  type: string
  description: string
  size: "small" | "medium" | "large" | "xlarge"
  isVisible: boolean
  settings: {
    apiKeys?: Record<string, string>
    refreshInterval?: number
    customContent?: string
    advertisements?: {
      enabled: boolean
      slots: number
      content: string[]
    }
    rssFeeds?: string[]
  }
}

export default function WidgetAdminPage() {
  const params = useParams()
  const router = useRouter()
  const widgetId = params.id as string

  const [widget, setWidget] = useState<WidgetConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadWidget()
  }, [widgetId])

  const loadWidget = async () => {
    setIsLoading(true)
    try {
      // Simulate API call - in real app, fetch from backend
      const mockWidgets: Record<string, WidgetConfig> = {
        youtube: {
          id: "youtube",
          name: "YouTube Videos",
          type: "media",
          description: "Featured YouTube content with API integration",
          size: "medium",
          isVisible: true,
          settings: {
            apiKeys: {
              youtube: process.env.YOUTUBE_API_KEY || "",
            },
            refreshInterval: 900000,
            customContent: "Pattaya travel videos and local content",
            advertisements: {
              enabled: true,
              slots: 2,
              content: ["Video ad slot 1", "Video ad slot 2"],
            },
          },
        },
        weather: {
          id: "weather",
          name: "Weather Widget",
          type: "weather",
          description: "Current weather conditions for Pattaya",
          size: "small",
          isVisible: true,
          settings: {
            apiKeys: {
              openweather: process.env.OPENWEATHER_API_KEY || "",
            },
            refreshInterval: 600000,
            customContent: "Pattaya weather with UV index and marine conditions",
          },
        },
        "breaking-news": {
          id: "breaking-news",
          name: "Breaking News",
          type: "news",
          description: "Live breaking news and alerts",
          size: "small",
          isVisible: true,
          settings: {
            refreshInterval: 300000,
            rssFeeds: [
              "https://feeds.bbci.co.uk/news/world/asia/rss.xml",
              "https://www.bangkokpost.com/rss/data/news.xml",
            ],
            advertisements: {
              enabled: true,
              slots: 2,
              content: ["News sponsor banner", "Breaking news ad"],
            },
          },
        },
        radio: {
          id: "radio",
          name: "Radio Player",
          type: "media",
          description: "Live radio streaming from Pattaya stations",
          size: "small",
          isVisible: true,
          settings: {
            refreshInterval: 30000,
            customContent: "Local Pattaya radio stations and international streams",
          },
        },
      }

      const widgetData = mockWidgets[widgetId]
      if (widgetData) {
        setWidget(widgetData)
      } else {
        // Create default widget config
        setWidget({
          id: widgetId,
          name: `${widgetId.charAt(0).toUpperCase() + widgetId.slice(1)} Widget`,
          type: "general",
          description: "Widget configuration",
          size: "medium",
          isVisible: true,
          settings: {
            refreshInterval: 300000,
          },
        })
      }
    } catch (error) {
      console.error("Failed to load widget:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!widget) return

    setIsSaving(true)
    try {
      // Simulate API call to save widget config
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Saving widget config:", widget)
      alert("Widget configuration saved successfully!")
    } catch (error) {
      console.error("Failed to save widget:", error)
      alert("Failed to save widget configuration")
    } finally {
      setIsSaving(false)
    }
  }

  const updateWidget = (updates: Partial<WidgetConfig>) => {
    if (!widget) return
    setWidget({ ...widget, ...updates })
  }

  const updateSettings = (settingUpdates: Partial<WidgetConfig["settings"]>) => {
    if (!widget) return
    setWidget({
      ...widget,
      settings: { ...widget.settings, ...settingUpdates },
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading widget configuration...</p>
        </div>
      </div>
    )
  }

  if (!widget) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-bold mb-2">Widget Not Found</h2>
            <p className="text-gray-600 mb-4">The widget "{widgetId}" could not be found.</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{widget.name}</h1>
                <p className="text-gray-600">{widget.description}</p>
              </div>
              <Badge variant="outline">{widget.type}</Badge>
              <Badge variant={widget.isVisible ? "default" : "secondary"}>
                {widget.isVisible ? "Visible" : "Hidden"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={loadWidget}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="ads">Advertisements</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>General Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Widget Name</Label>
                    <Input id="name" value={widget.name} onChange={(e) => updateWidget({ name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="type">Widget Type</Label>
                    <Input id="type" value={widget.type} onChange={(e) => updateWidget({ type: e.target.value })} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={widget.description}
                    onChange={(e) => updateWidget({ description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size">Widget Size</Label>
                    <select
                      id="size"
                      value={widget.size}
                      onChange={(e) => updateWidget({ size: e.target.value as any })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">Extra Large</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={widget.isVisible}
                      onCheckedChange={(checked) => updateWidget({ isVisible: checked })}
                    />
                    <Label>Widget Visible</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="refresh">Refresh Interval (ms)</Label>
                  <Input
                    id="refresh"
                    type="number"
                    value={widget.settings.refreshInterval || 300000}
                    onChange={(e) => updateSettings({ refreshInterval: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">How often the widget updates (300000 = 5 minutes)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>API Keys Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(widget.settings.apiKeys || {}).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={key}>{key.toUpperCase()} API Key</Label>
                    <Input
                      id={key}
                      type="password"
                      value={value}
                      onChange={(e) =>
                        updateSettings({
                          apiKeys: { ...widget.settings.apiKeys, [key]: e.target.value },
                        })
                      }
                      placeholder={`Enter ${key} API key`}
                    />
                  </div>
                ))}

                {widget.id === "youtube" && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">YouTube API Setup</h4>
                    <p className="text-sm text-gray-600 mb-2">Get your YouTube API key from Google Cloud Console</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open("https://console.cloud.google.com/apis/credentials", "_blank")}
                    >
                      Get API Key
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Rss className="w-5 h-5" />
                  <span>Content Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-content">Custom Content</Label>
                  <Textarea
                    id="custom-content"
                    value={widget.settings.customContent || ""}
                    onChange={(e) => updateSettings({ customContent: e.target.value })}
                    rows={4}
                    placeholder="Enter custom content or configuration..."
                  />
                </div>

                {widget.settings.rssFeeds && (
                  <div>
                    <Label>RSS Feeds</Label>
                    <div className="space-y-2">
                      {widget.settings.rssFeeds.map((feed, index) => (
                        <Input
                          key={index}
                          value={feed}
                          onChange={(e) => {
                            const newFeeds = [...widget.settings.rssFeeds!]
                            newFeeds[index] = e.target.value
                            updateSettings({ rssFeeds: newFeeds })
                          }}
                          placeholder="RSS feed URL"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Advertisement Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={widget.settings.advertisements?.enabled || false}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        advertisements: { ...widget.settings.advertisements, enabled: checked },
                      })
                    }
                  />
                  <Label>Enable Advertisements</Label>
                </div>

                {widget.settings.advertisements?.enabled && (
                  <>
                    <div>
                      <Label htmlFor="ad-slots">Number of Ad Slots</Label>
                      <Input
                        id="ad-slots"
                        type="number"
                        value={widget.settings.advertisements?.slots || 0}
                        onChange={(e) =>
                          updateSettings({
                            advertisements: {
                              ...widget.settings.advertisements,
                              slots: Number.parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Advertisement Content</Label>
                      <div className="space-y-2">
                        {(widget.settings.advertisements?.content || []).map((content, index) => (
                          <Textarea
                            key={index}
                            value={content}
                            onChange={(e) => {
                              const newContent = [...(widget.settings.advertisements?.content || [])]
                              newContent[index] = e.target.value
                              updateSettings({
                                advertisements: {
                                  ...widget.settings.advertisements,
                                  content: newContent,
                                },
                              })
                            }}
                            rows={2}
                            placeholder={`Advertisement content ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium mb-2">Widget ID</h4>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{widget.id}</code>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium mb-2 text-red-800">Danger Zone</h4>
                  <p className="text-sm text-red-600 mb-3">These actions cannot be undone. Please be careful.</p>
                  <Button variant="destructive" size="sm">
                    Reset Widget to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
