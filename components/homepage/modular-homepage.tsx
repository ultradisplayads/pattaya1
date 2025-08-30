"use client"

import { useState, useEffect } from "react"
import { Settings, BarChart3, Eye, EyeOff, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Import all widgets
import { EnhancedBreakingNewsWidget } from "./widgets/enhanced-breaking-news-widget"
import { WeatherWidget } from "./widgets/weather-widget"
import { RadioWidget } from "./widgets/radio-widget"
import { YouTubeWidget } from "./widgets/youtube-widget"
import { LiveEventsWidget } from "./widgets/live-events-widget"
import { BusinessSpotlightWidget } from "./widgets/business-spotlight-widget"
import { PhotoGalleryWidget } from "./widgets/photo-gallery-widget"
import { QuickLinksWidget } from "./widgets/quick-links-widget"
import { SocialFeedWidget } from "./widgets/social-feed-widget"
import { TrendingWidget } from "./widgets/trending-widget"
import { ForumActivityWidget } from "./widgets/forum-activity-widget"
import { EventsCalendarWidget } from "./widgets/events-calendar-widget"
import { TrafficWidget } from "./widgets/traffic-widget"
import { NewsHeroWidget } from "./widgets/news-hero-widget"
import { GoogleReviewsWidget } from "../widgets/google-reviews-widget"
import { CuratorSocialWidget } from "../widgets/curator-social-widget"
import { EnhancedHotDealsWidget } from "./widgets/enhanced-hot-deals-widget"
import { ScrollingMarquee } from "./scrolling-marquee"

interface Widget {
  id: string
  name: string
  type: string
  description: string
  size: "small" | "medium" | "large" | "xlarge"
  position: { row: number; col: number; rowSpan: number; colSpan: number }
  isVisible: boolean
  settings: {
    apiKeys?: Record<string, string>
    refreshInterval?: number
    customContent?: any
    advertisements?: {
      enabled: boolean
      slots: number
      content: any[]
    }
  }
}

export function ModularHomepage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "business" | "user">("admin")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeWidgets()
  }, [])

  const initializeWidgets = () => {
    const defaultWidgets: Widget[] = [
      {
        id: "breaking-news",
        name: "Breaking News",
        type: "news",
        description: "Live breaking news and alerts",
        size: "small",
        position: { row: 1, col: 1, rowSpan: 1, colSpan: 1 },
        isVisible: true,
        settings: {
          refreshInterval: 300000,
          advertisements: { enabled: true, slots: 2, content: [] },
        },
      },
      {
        id: "weather",
        name: "Weather Widget",
        type: "weather",
        description: "Current weather conditions",
        size: "small",
        position: { row: 1, col: 2, rowSpan: 1, colSpan: 1 },
        isVisible: true,
        settings: {
          apiKeys: { openweather: process.env.OPENWEATHER_API_KEY || "" },
          refreshInterval: 600000,
        },
      },
      {
        id: "radio",
        name: "Radio Player",
        type: "media",
        description: "Live radio streaming",
        size: "small",
        position: { row: 1, col: 3, rowSpan: 1, colSpan: 1 },
        isVisible: true,
        settings: {
          refreshInterval: 30000,
        },
      },
      {
        id: "hot-deals",
        name: "Hot Deals",
        type: "business",
        description: "Latest deals and promotions with Groupon integration",
        size: "small",
        position: { row: 1, col: 4, rowSpan: 1, colSpan: 1 },
        isVisible: true,
        settings: {
          refreshInterval: 1800000,
          advertisements: { enabled: true, slots: 3, content: [] },
        },
      },
      {
        id: "news-hero",
        name: "News Hero",
        type: "news",
        description: "Featured news stories",
        size: "large",
        position: { row: 2, col: 1, rowSpan: 2, colSpan: 3 },
        isVisible: true,
        settings: {
          refreshInterval: 300000,
        },
      },
      {
        id: "youtube",
        name: "YouTube Videos",
        type: "media",
        description: "Featured YouTube content",
        size: "medium",
        position: { row: 2, col: 4, rowSpan: 3, colSpan: 1 },
        isVisible: true,
        settings: {
          apiKeys: { youtube: process.env.YOUTUBE_API_KEY || "" },
          refreshInterval: 900000,
        },
      },
      {
        id: "social-feed",
        name: "Social Media Feed",
        type: "social",
        description: "Live social media updates",
        size: "medium",
        position: { row: 4, col: 1, rowSpan: 2, colSpan: 2 },
        isVisible: true,
        settings: {
          refreshInterval: 120000,
        },
      },
      {
        id: "trending",
        name: "Trending Topics",
        type: "social",
        description: "What's trending now",
        size: "small",
        position: { row: 4, col: 3, rowSpan: 2, colSpan: 1 },
        isVisible: true,
        settings: {
          refreshInterval: 300000,
        },
      },
      {
        id: "business-spotlight",
        name: "Business Spotlight",
        type: "business",
        description: "Featured local businesses",
        size: "large",
        position: { row: 6, col: 1, rowSpan: 2, colSpan: 3 },
        isVisible: true,
        settings: {
          refreshInterval: 3600000,
          advertisements: { enabled: true, slots: 1, content: [] },
        },
      },
      {
        id: "google-reviews",
        name: "Google Reviews",
        type: "reviews",
        description: "Latest Google reviews",
        size: "small",
        position: { row: 5, col: 4, rowSpan: 2, colSpan: 1 },
        isVisible: true,
        settings: {
          apiKeys: { google: process.env.GOOGLE_MAPS_API_KEY || "" },
          refreshInterval: 1800000,
        },
      },
      {
        id: "events-calendar",
        name: "Events Calendar",
        type: "events",
        description: "Upcoming events",
        size: "medium",
        position: { row: 8, col: 1, rowSpan: 2, colSpan: 2 },
        isVisible: true,
        settings: {
          refreshInterval: 1800000,
        },
      },
      {
        id: "forum-activity",
        name: "Forum Activity",
        type: "community",
        description: "Latest forum discussions",
        size: "small",
        position: { row: 8, col: 3, rowSpan: 2, colSpan: 1 },
        isVisible: true,
        settings: {
          refreshInterval: 300000,
        },
      },
      {
        id: "photo-gallery",
        name: "Photo Gallery",
        type: "media",
        description: "Community photos",
        size: "small",
        position: { row: 7, col: 4, rowSpan: 2, colSpan: 1 },
        isVisible: true,
        settings: {
          refreshInterval: 600000,
        },
      },
      {
        id: "curator-social",
        name: "Curated Social Feed",
        type: "social",
        description: "Curated social media content",
        size: "medium",
        position: { row: 10, col: 1, rowSpan: 2, colSpan: 2 },
        isVisible: true,
        settings: {
          refreshInterval: 300000,
        },
      },
      {
        id: "live-events",
        name: "Live Events",
        type: "events",
        description: "Currently happening events",
        size: "small",
        position: { row: 10, col: 3, rowSpan: 2, colSpan: 1 },
        isVisible: true,
        settings: {
          refreshInterval: 60000,
        },
      },
      {
        id: "quick-links",
        name: "Quick Links",
        type: "navigation",
        description: "Popular page shortcuts",
        size: "small",
        position: { row: 9, col: 4, rowSpan: 2, colSpan: 1 },
        isVisible: true,
        settings: {},
      },
      {
        id: "traffic",
        name: "Traffic Information",
        type: "transport",
        description: "Live traffic updates",
        size: "xlarge",
        position: { row: 12, col: 1, rowSpan: 1, colSpan: 4 },
        isVisible: true,
        settings: {
          apiKeys: { google: process.env.GOOGLE_MAPS_API_KEY || "" },
          refreshInterval: 300000,
        },
      },
    ]

    setWidgets(defaultWidgets)
    setLoading(false)
  }

  const handleToggleWidget = (widgetId: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w)))
  }

  const visibleWidgets = widgets.filter((w) => w.isVisible)

  const getWidgetComponent = (widgetId: string) => {
    const componentMap: { [key: string]: any } = {
      "breaking-news": EnhancedBreakingNewsWidget,
      weather: WeatherWidget,
      radio: RadioWidget,
      "google-reviews": GoogleReviewsWidget,
      "news-hero": NewsHeroWidget,
      youtube: YouTubeWidget,
      "social-feed": SocialFeedWidget,
      trending: TrendingWidget,
      "business-spotlight": BusinessSpotlightWidget,
      "hot-deals": EnhancedHotDealsWidget,
      "events-calendar": EventsCalendarWidget,
      "forum-activity": ForumActivityWidget,
      "photo-gallery": PhotoGalleryWidget,
      "curator-social": CuratorSocialWidget,
      "live-events": LiveEventsWidget,
      "quick-links": QuickLinksWidget,
      traffic: TrafficWidget,
    }
    return componentMap[widgetId] || null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading widgets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Scrolling Marquee */}
      <ScrollingMarquee />

      {/* Admin Controls */}
      <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                Active: {visibleWidgets.length}/{widgets.length}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Pattaya1 Dashboard v0.5
              </Badge>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdmin(!showAdmin)}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>{showAdmin ? "Hide" : "Show"} Admin</span>
                {showAdmin ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open("/analytics", "_blank")}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Widget Admin Panel */}
      {showAdmin && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Widget Management Dashboard</span>
                  <Badge variant="outline">Admin Mode</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:scale-105 ${
                        widget.isVisible
                          ? "border-green-300 bg-green-50 shadow-md"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => handleToggleWidget(widget.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={widget.isVisible ? "default" : "secondary"} className="text-xs">
                          {widget.size}
                        </Badge>
                        {widget.isVisible ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <h4 className="font-medium text-sm mb-1">{widget.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{widget.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {widget.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Navigate to widget settings
                            window.open(`/admin/widgets/${widget.id}`, "_blank")
                          }}
                          className="h-5 w-5 p-0"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Widget Grid */}
      <div className="p-4 lg:p-6">
        <div className="enhanced-widget-grid">
          {/* Row 1: Breaking News, Weather, Radio, Hot Deals */}
          <div className="widget-container widget-small" style={{ gridArea: "1 / 1 / 2 / 2" }}>
            <EnhancedBreakingNewsWidget />
          </div>
          <div className="widget-container widget-small" style={{ gridArea: "1 / 2 / 2 / 3" }}>
            <WeatherWidget />
          </div>
          <div className="widget-container widget-small" style={{ gridArea: "1 / 3 / 2 / 4" }}>
            <RadioWidget />
          </div>
          <div className="widget-container widget-small" style={{ gridArea: "1 / 4 / 2 / 5" }}>
            <EnhancedHotDealsWidget />
          </div>

          {/* Row 2: News Hero (spans 2 columns) */}
          <div className="widget-container widget-medium" style={{ gridArea: "2 / 1 / 3 / 3" }}>
            <NewsHeroWidget />
          </div>

          {/* Row 2-4: YouTube (spans 3 rows, 2 columns) */}
          <div className="widget-container widget-large" style={{ gridArea: "2 / 3 / 5 / 5" }}>
            <YouTubeWidget />
          </div>

          {/* Row 3: Social Feed, Trending */}
          <div className="widget-container widget-small" style={{ gridArea: "3 / 1 / 4 / 2" }}>
            <SocialFeedWidget />
          </div>
          <div className="widget-container widget-small" style={{ gridArea: "3 / 2 / 4 / 3" }}>
            <TrendingWidget />
          </div>

          {/* Row 4: Business Spotlight (spans 2 columns) */}
          <div className="widget-container widget-medium" style={{ gridArea: "4 / 1 / 5 / 3" }}>
            <BusinessSpotlightWidget />
          </div>

          {/* Row 5: Events Calendar, Forum Activity, Photo Gallery */}
          <div className="widget-container widget-small" style={{ gridArea: "5 / 1 / 6 / 2" }}>
            <EventsCalendarWidget />
          </div>
          <div className="widget-container widget-small" style={{ gridArea: "5 / 2 / 6 / 3" }}>
            <ForumActivityWidget />
          </div>
          <div className="widget-container widget-small" style={{ gridArea: "5 / 3 / 6 / 4" }}>
            <PhotoGalleryWidget />
          </div>

          {/* Row 6: Google Reviews, Live Events, Quick Links */}
          <div className="widget-container widget-small" style={{ gridArea: "6 / 1 / 7 / 2" }}>
            <GoogleReviewsWidget />
          </div>
          <div className="widget-container widget-small" style={{ gridArea: "6 / 2 / 7 / 3" }}>
            <LiveEventsWidget />
          </div>
          <div className="widget-container widget-small" style={{ gridArea: "6 / 3 / 7 / 4" }}>
            <QuickLinksWidget />
          </div>

          {/* Row 7: Curator Social (spans 2 columns) */}
          <div className="widget-container widget-medium" style={{ gridArea: "7 / 1 / 8 / 3" }}>
            <CuratorSocialWidget />
          </div>

          {/* Row 8: Traffic (full width) */}
          <div className="widget-container widget-xlarge" style={{ gridArea: "8 / 1 / 9 / 5" }}>
            <TrafficWidget />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-sm text-gray-500 border-t bg-white/50">
        <div className="flex items-center justify-center space-x-4">
          <span>Pattaya1 Dashboard v0.5 - Compact Layout</span>
          <span>•</span>
          <span>Active Widgets: {visibleWidgets.length}</span>
          <span>•</span>
          <Button
            variant="link"
            size="sm"
            onClick={() => window.open("/admin", "_blank")}
            className="text-xs p-0 h-auto"
          >
            Admin Panel
          </Button>
        </div>
      </div>
    </div>
  )
}
