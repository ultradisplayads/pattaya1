"use client"

import { useState, useEffect } from "react"
import { Settings, BarChart3, Eye, EyeOff, ToggleLeft, ToggleRight, Activity, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Import all widgets
import { EnhancedBreakingNewsWidget } from "./widgets/enhanced-breaking-news-widget"
import { EnhancedWeatherWidget } from "../widgets/enhanced-weather-widget"
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
    try {
      console.log('Initializing widgets...')
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
          description: "Real-time social media updates",
          size: "small",
          position: { row: 3, col: 1, rowSpan: 1, colSpan: 1 },
          isVisible: true,
          settings: {
            refreshInterval: 120000,
          },
        },
        {
          id: "trending",
          name: "Trending Topics",
          type: "social",
          description: "Hot trending topics and hashtags",
          size: "small",
          position: { row: 3, col: 2, rowSpan: 1, colSpan: 1 },
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
          size: "medium",
          position: { row: 4, col: 1, rowSpan: 1, colSpan: 2 },
          isVisible: true,
          settings: {
            refreshInterval: 600000,
          },
        },
        {
          id: "events-calendar",
          name: "Events Calendar",
          type: "events",
          description: "Upcoming events and activities",
          size: "small",
          position: { row: 5, col: 1, rowSpan: 1, colSpan: 1 },
          isVisible: true,
          settings: {
            refreshInterval: 300000,
          },
        },
        {
          id: "forum-activity",
          name: "Forum Activity",
          type: "social",
          description: "Latest forum discussions",
          size: "small",
          position: { row: 5, col: 2, rowSpan: 1, colSpan: 1 },
          isVisible: true,
          settings: {
            refreshInterval: 180000,
          },
        },
        {
          id: "photo-gallery",
          name: "Photo Gallery",
          type: "media",
          description: "User-submitted photos",
          size: "small",
          position: { row: 5, col: 3, rowSpan: 1, colSpan: 1 },
          isVisible: true,
          settings: {
            refreshInterval: 600000,
          },
        },
        {
          id: "google-reviews",
          name: "Google Reviews",
          type: "business",
          description: "Latest Google reviews",
          size: "small",
          position: { row: 6, col: 1, rowSpan: 1, colSpan: 1 },
          isVisible: true,
          settings: {
            refreshInterval: 900000,
          },
        },
        {
          id: "live-events",
          name: "Live Events",
          type: "events",
          description: "Currently happening events",
          size: "small",
          position: { row: 6, col: 2, rowSpan: 1, colSpan: 1 },
          isVisible: true,
          settings: {
            refreshInterval: 60000,
          },
        },
        {
          id: "quick-links",
          name: "Quick Links",
          type: "navigation",
          description: "Quick access to popular sections",
          size: "small",
          position: { row: 6, col: 3, rowSpan: 1, colSpan: 1 },
          isVisible: true,
          settings: {
            refreshInterval: 3600000,
          },
        },
        {
          id: "curator-social",
          name: "Curator Social",
          type: "social",
          description: "Curated social media content",
          size: "medium",
          position: { row: 7, col: 1, rowSpan: 1, colSpan: 2 },
          isVisible: true,
          settings: {
            refreshInterval: 300000,
          },
        },
        {
          id: "traffic",
          name: "Traffic Updates",
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
      console.log('Widgets initialized successfully')
      setLoading(false)
    } catch (error) {
      console.error('Error initializing widgets:', error)
      setLoading(false)
    }
  }

  const handleToggleWidget = (widgetId: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w)))
  }

  const visibleWidgets = widgets.filter((w) => w.isVisible)

  const getWidgetComponent = (widgetId: string) => {
    const componentMap: { [key: string]: any } = {
      "breaking-news": EnhancedBreakingNewsWidget,
      weather: EnhancedWeatherWidget,
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
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-sans antialiased">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans antialiased">
      {/* Scrolling Marquee */}
      <ScrollingMarquee />

      {/* Apple-style Admin Controls */}
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                </div>
                <Badge variant="outline" className="text-sm font-medium bg-white/50 border-gray-200">
                  {visibleWidgets.length} Active
                </Badge>
              </div>
              <Badge variant="secondary" className="text-sm font-medium bg-blue-50 text-blue-700 border-blue-200">
                <Sparkles className="w-3 h-3 mr-1" />
                v0.5
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdmin(!showAdmin)}
                className="h-9 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showAdmin ? "Hide" : "Show"} Admin
                {showAdmin ? <ToggleRight className="w-4 h-4 ml-2" /> : <ToggleLeft className="w-4 h-4 ml-2" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.open("/analytics", "_blank")}
                className="h-9 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Apple-style Widget Admin Panel */}
      {showAdmin && (
        <div className="bg-white/60 backdrop-blur-sm border-b border-gray-100/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Card className="border-gray-100/50 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Widget Management</span>
                  <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                    <Activity className="w-3 h-3 mr-1" />
                    Admin Mode
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                        widget.isVisible
                          ? "border-blue-200 bg-blue-50/50 shadow-sm"
                          : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50"
                      }`}
                      onClick={() => handleToggleWidget(widget.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          variant={widget.isVisible ? "default" : "secondary"} 
                          className={`text-xs font-medium ${
                            widget.isVisible 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {widget.size}
                        </Badge>
                        {widget.isVisible ? (
                          <Eye className="h-4 w-4 text-blue-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <h4 className="font-semibold text-sm mb-2 text-gray-900">{widget.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{widget.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs font-medium bg-white/50 border-gray-200 text-gray-600">
                          {widget.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`/admin/widgets/${widget.id}`, "_blank")
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
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

      {/* Main Widget Grid - Apple-style Layout */}
      <div className="p-6 lg:p-8">
        <div 
          className="widget-grid-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gridAutoRows: 'minmax(250px, auto)',
            gap: '1.5rem',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '1.5rem',
            alignItems: 'start',
            justifyItems: 'stretch'
          }}
        >
          {/* Row 1: Small widgets - Auto-fit in first row */}
          <div className="widget-item widget-small" style={{ minHeight: '250px', maxHeight: '350px', overflow: 'hidden' }}>
            <EnhancedBreakingNewsWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '250px', maxHeight: '350px', overflow: 'hidden' }}>
            <EnhancedWeatherWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '250px', maxHeight: '350px', overflow: 'hidden' }}>
            <RadioWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '250px', maxHeight: '350px', overflow: 'hidden' }}>
            <EnhancedHotDealsWidget />
          </div>

          {/* Row 2: Large widget + Medium widget */}
          <div className="widget-item widget-large" style={{ 
            gridColumn: 'span 2', 
            minHeight: '400px', 
            maxHeight: '500px', 
            overflow: 'hidden' 
          }}>
            <NewsHeroWidget />
          </div>
          <div className="widget-item widget-medium" style={{ 
            minHeight: '400px', 
            maxHeight: '500px', 
            overflow: 'hidden' 
          }}>
            <YouTubeWidget />
          </div>

          {/* Row 3: Medium widgets */}
          <div className="widget-item widget-medium" style={{ 
            gridColumn: 'span 2', 
            minHeight: '300px', 
            maxHeight: '400px', 
            overflow: 'hidden' 
          }}>
            <BusinessSpotlightWidget />
          </div>
          <div className="widget-item widget-medium" style={{ 
            gridColumn: 'span 2', 
            minHeight: '300px', 
            maxHeight: '400px', 
            overflow: 'hidden' 
          }}>
            <CuratorSocialWidget />
          </div>

          {/* Row 4: Small widgets - Auto-fit */}
          <div className="widget-item widget-small" style={{ minHeight: '200px', maxHeight: '300px', overflow: 'hidden' }}>
            <SocialFeedWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '200px', maxHeight: '300px', overflow: 'hidden' }}>
            <TrendingWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '200px', maxHeight: '300px', overflow: 'hidden' }}>
            <EventsCalendarWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '200px', maxHeight: '300px', overflow: 'hidden' }}>
            <ForumActivityWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '200px', maxHeight: '300px', overflow: 'hidden' }}>
            <PhotoGalleryWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '200px', maxHeight: '300px', overflow: 'hidden' }}>
            <GoogleReviewsWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '200px', maxHeight: '300px', overflow: 'hidden' }}>
            <LiveEventsWidget />
          </div>
          <div className="widget-item widget-small" style={{ minHeight: '200px', maxHeight: '300px', overflow: 'hidden' }}>
            <QuickLinksWidget />
          </div>

          {/* Row 5: Extra large widget - Full width */}
          <div className="widget-item widget-xlarge" style={{ 
            gridColumn: '1 / -1', 
            minHeight: '300px', 
            maxHeight: '400px', 
            overflow: 'hidden' 
          }}>
            <TrafficWidget />
          </div>
        </div>
      </div>

      {/* Apple-style Footer */}
      <div className="text-center py-6 text-sm text-gray-500 border-t border-gray-100/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-6">
          <span className="font-medium">Pattaya1 Dashboard v0.5</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>Active Widgets: {visibleWidgets.length}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <Button
            variant="link"
            size="sm"
            onClick={() => window.open("/admin", "_blank")}
            className="text-xs p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
          >
            Admin Panel
          </Button>
        </div>
      </div>

      {/* Apple-style CSS for widget grid */}
      <style jsx>{`
        .widget-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          grid-auto-rows: minmax(250px, auto);
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
          align-items: start;
          justify-items: stretch;
        }

        .widget-item {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 1rem;
          background: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .widget-item:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }

        .widget-item > * {
          height: 100%;
          width: 100%;
        }

        .widget-small {
          min-height: 200px;
          max-height: 350px;
        }

        .widget-medium {
          min-height: 300px;
          max-height: 400px;
        }

        .widget-large {
          min-height: 400px;
          max-height: 500px;
        }

        .widget-xlarge {
          min-height: 300px;
          max-height: 400px;
        }

        /* Responsive breakpoints */
        @media (max-width: 1400px) {
          .widget-grid-container {
            max-width: 1200px;
            gap: 1.25rem;
          }
        }

        @media (max-width: 1200px) {
          .widget-grid-container {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
          }
        }

        @media (max-width: 900px) {
          .widget-grid-container {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 0.875rem;
          }
        }

        @media (max-width: 768px) {
          .widget-grid-container {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.75rem;
            padding: 0 0.75rem;
            padding-bottom: 6rem;
          }

          .widget-small,
          .widget-medium,
          .widget-large {
            min-height: 160px;
          }

          .widget-small {
            max-height: 180px;
          }

          .widget-medium {
            max-height: 200px;
          }

          .widget-large {
            max-height: 250px;
          }

          .widget-xlarge {
            max-height: 300px;
          }
        }

        @media (max-width: 480px) {
          .widget-grid-container {
            grid-template-columns: 1fr;
            gap: 0.5rem;
            padding: 0 0.5rem;
            padding-bottom: 7rem;
          }

          .widget-small,
          .widget-medium,
          .widget-large,
          .widget-xlarge {
            min-height: 140px;
          }

          .widget-small {
            max-height: 300px;
          }

          .widget-medium {
            max-height: 350px;
          }

          .widget-large {
            max-height: 400px;
          }

          .widget-xlarge {
            max-height: 350px;
          }
        }
      `}</style>
    </div>
  )
}
