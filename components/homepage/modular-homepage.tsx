"use client"

import { useState, useEffect } from "react"
import { Settings, BarChart3, Eye, EyeOff, ToggleLeft, ToggleRight, Activity, Sparkles, Save, RotateCcw, Move } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

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
  gridArea: string
  category: string
  isVisible: boolean
  isResizable: boolean
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
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    initializeWidgets()
  }, [])

  // Load DMCA script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://images.dmca.com/Badges/DMCABadgeHelper.min.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  // Load saved configuration
  useEffect(() => {
    const saved = localStorage.getItem("pattaya1-widget-config")
    if (saved) {
      try {
        const savedConfig = JSON.parse(saved)
        setWidgets((prev) =>
          prev.map((widget) => {
            const savedWidget = savedConfig.find((s: any) => s.id === widget.id)
            return savedWidget ? { ...widget, ...savedWidget } : widget
          }),
        )
      } catch (error) {
        console.error("Failed to load widget configuration:", error)
      }
    }
  }, [])

  const initializeWidgets = () => {
    try {
      console.log('Initializing widgets...')
      const defaultWidgets: Widget[] = [
        {
          id: "weather",
          name: "Weather Widget",
          type: "weather",
          description: "Current weather conditions",
          size: "medium",
          gridArea: "1 / 1 / 3 / 2",
          category: "Information",
          isVisible: true,
          isResizable: true,
          settings: {
            apiKeys: { openweather: process.env.OPENWEATHER_API_KEY || "" },
            refreshInterval: 600000,
          },
        },
        {
          id: "breaking-news",
          name: "Breaking News",
          type: "news",
          description: "Live breaking news and alerts",
          size: "medium",
          gridArea: "1 / 2 / 2 / 4",
          category: "News",
          isVisible: true,
          isResizable: true,
          settings: {
            refreshInterval: 300000,
            advertisements: { enabled: true, slots: 2, content: [] },
          },
        },
        {
          id: "radio",
          name: "Radio Player",
          type: "media",
          description: "Live radio streaming",
          size: "medium",
          gridArea: "1 / 4 / 3 / 5",
          category: "Entertainment",
          isVisible: true,
          isResizable: true,
          settings: {
            refreshInterval: 30000,
          },
        },
        {
          id: "hot-deals",
          name: "Hot Deals",
          type: "business",
          description: "Latest deals and promotions with Groupon integration",
          size: "medium",
          gridArea: "2 / 2 / 3 / 4",
          category: "Business",
          isVisible: true,
          isResizable: true,
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
          gridArea: "3 / 1 / 5 / 3",
          category: "News",
          isVisible: true,
          isResizable: true,
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
          gridArea: "3 / 3 / 4 / 5",
          category: "Business",
          isVisible: true,
          isResizable: true,
          settings: {
            refreshInterval: 600000,
          },
        },
        {
          id: "social-feed",
          name: "Social Media Feed",
          type: "social",
          description: "Real-time social media updates",
          size: "small",
          gridArea: "4 / 3 / 6 / 4",
          category: "Social",
          isVisible: true,
          isResizable: true,
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
          gridArea: "4 / 4 / 5 / 5",
          category: "Social",
          isVisible: true,
          isResizable: true,
          settings: {
            refreshInterval: 300000,
          },
        },
        {
          id: "youtube",
          name: "YouTube Videos",
          type: "media",
          description: "Featured YouTube content",
          size: "small",
          gridArea: "5 / 1 / 6 / 2",
          category: "Entertainment",
          isVisible: true,
          isResizable: true,
          settings: {
            apiKeys: { youtube: process.env.YOUTUBE_API_KEY || "" },
            refreshInterval: 900000,
          },
        },
        {
          id: "events-calendar",
          name: "Events Calendar",
          type: "events",
          description: "Upcoming events and activities",
          size: "small",
          gridArea: "5 / 2 / 6 / 3",
          category: "Events",
          isVisible: true,
          isResizable: true,
          settings: {
            refreshInterval: 300000,
          },
        },
        {
          id: "quick-links",
          name: "Quick Links",
          type: "navigation",
          description: "Quick access to popular sections",
          size: "small",
          gridArea: "5 / 4 / 6 / 5",
          category: "Navigation",
          isVisible: true,
          isResizable: true,
          settings: {
            refreshInterval: 3600000,
          },
        },
        {
          id: "photo-gallery",
          name: "Photo Gallery",
          type: "media",
          description: "User-submitted photos",
          size: "medium",
          gridArea: "6 / 1 / 8 / 3",
          category: "Media",
          isVisible: true,
          isResizable: true,
          settings: {
            refreshInterval: 600000,
          },
        },
        {
          id: "forum-activity",
          name: "Forum Activity",
          type: "social",
          description: "Latest forum discussions",
          size: "medium",
          gridArea: "6 / 3 / 7 / 5",
          category: "Community",
          isVisible: true,
          isResizable: true,
          settings: {
            refreshInterval: 180000,
          },
        },
        {
          id: "google-reviews",
          name: "Google Reviews",
          type: "business",
          description: "Latest Google reviews",
          size: "small",
          gridArea: "7 / 3 / 8 / 4",
          category: "Business",
          isVisible: true,
          isResizable: true,
          settings: {
            refreshInterval: 900000,
          },
        },
        {
          id: "curator-social",
          name: "Curator Social",
          type: "social",
          description: "Curated social media content",
          size: "small",
          gridArea: "7 / 4 / 8 / 5",
          category: "Social",
          isVisible: true,
          isResizable: true,
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
          gridArea: "8 / 1 / 9 / 5",
          category: "Information",
          isVisible: true,
          isResizable: true,
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

  const handleSaveLayout = () => {
    const configToSave = widgets.map(({ ...widget }) => widget)
    localStorage.setItem("pattaya1-widget-config", JSON.stringify(configToSave))
    console.log("Layout saved!")
  }

  const handleResetLayout = () => {
    initializeWidgets()
    localStorage.removeItem("pattaya1-widget-config")
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

      {/* Control Header */}
      {isEditMode && (
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Widget Layout Editor</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {visibleWidgets.length} Active Widgets
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleSaveLayout}>
                <Save className="w-4 h-4 mr-2" />
                Save Layout
              </Button>

              <Button variant="outline" size="sm" onClick={handleResetLayout}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>

              <div className="flex items-center gap-2">
                <Switch checked={isEditMode} onCheckedChange={setIsEditMode} id="edit-mode" />
                <label htmlFor="edit-mode" className="text-sm font-medium">
                  Edit Mode
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Edit Mode Button (when not in edit mode) */}
      {!isEditMode && (
        <div className="fixed top-20 right-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditMode(true)}
            className="bg-white/90 backdrop-blur-sm shadow-lg"
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit Layout
          </Button>
        </div>
      )}

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

      {/* Widget Grid */}
      <div className="p-4">
        <div className={`static-widget-grid ${isEditMode ? "admin-mode" : ""}`}>
          {widgets.map((widget) => {
            const WidgetComponent = getWidgetComponent(widget.id)

            if (!widget.isVisible || !WidgetComponent) return null

            return (
              <div key={widget.id} className="widget-container" style={{ gridArea: widget.gridArea }}>
                {/* Edit Mode Overlay */}
                {isEditMode && (
                  <div className="admin-overlay">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 bg-white/90 backdrop-blur-sm"
                        onClick={() => handleToggleWidget(widget.id)}
                      >
                        {widget.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 bg-white/90 backdrop-blur-sm cursor-move"
                      >
                        <Move className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Widget Content */}
                <Card className="h-full w-full">
                  <div className="widget-content">
                    <WidgetComponent />
                  </div>
                </Card>

                {/* Widget Label in Edit Mode */}
                {isEditMode && (
                  <div className="absolute -bottom-6 left-0 right-0 text-center">
                    <Badge variant="secondary" className="text-xs">
                      {widget.name}
                    </Badge>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Footer */}
      <div className="text-center py-4 text-sm text-gray-500 border-t border-gray-200 bg-white/80">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span>Pattaya1 Dashboard - Static Grid Layout</span>
          <Badge variant="secondary">V0.1 Stable</Badge>
          <span>•</span>
          <span>{widgets.length} Total Widgets</span>
          <span>•</span>
          <span>{visibleWidgets.length} Visible</span>
        </div>
        
        {/* DMCA Protection Badge */}
        <div className="mt-3 flex justify-center">
          <a 
            href="//www.dmca.com/Protection/Status.aspx?ID=21b30fa5-25de-439b-9c20-c5a88c0f9f12" 
            title="DMCA.com Protection Status" 
            className="dmca-badge hover:opacity-80 transition-opacity duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src="https://images.dmca.com/Badges/DMCA_badge_grn_60w.png?ID=21b30fa5-25de-439b-9c20-c5a88c0f9f12" 
              alt="DMCA.com Protection Status"
              className="h-6 w-auto"
            />
          </a>
        </div>
      </div>

      {/* CSS Grid Styles */}
      <style jsx>{`
        .static-widget-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(8, minmax(200px, auto));
          gap: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
          align-items: start;
          justify-items: stretch;
        }

        .widget-container {
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

        .widget-container:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }

        .widget-content {
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .admin-overlay {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .admin-mode .widget-container:hover .admin-overlay {
          opacity: 1;
        }

        .admin-mode .widget-container {
          border: 2px dashed rgba(59, 130, 246, 0.3);
        }

        .admin-mode .widget-container:hover {
          border-color: rgba(59, 130, 246, 0.6);
        }

        /* Responsive breakpoints */
        @media (max-width: 1400px) {
          .static-widget-grid {
            max-width: 1200px;
            gap: 1.25rem;
          }
        }

        @media (max-width: 1200px) {
          .static-widget-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(10, minmax(180px, auto));
            gap: 1rem;
          }
        }

        @media (max-width: 900px) {
          .static-widget-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(15, minmax(160px, auto));
            gap: 0.875rem;
          }
        }

        @media (max-width: 768px) {
          .static-widget-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(20, minmax(140px, auto));
            gap: 0.75rem;
            padding: 0 0.75rem;
            padding-bottom: 6rem;
          }
        }

        @media (max-width: 480px) {
          .static-widget-grid {
            gap: 0.5rem;
            padding: 0 0.5rem;
            padding-bottom: 7rem;
          }
        }
      `}</style>
    </div>
  )
}
