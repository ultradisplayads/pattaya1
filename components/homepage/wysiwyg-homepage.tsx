"use client"

import { useState, useEffect, useCallback } from "react"
import { Save, Undo, Redo, Grid, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ResizableWidgetWrapper } from "./resizable-widget-wrapper"
import type { WidgetDimensions } from "@/lib/widget-resize"

// Import all widgets
import { WeatherWidget } from "./widgets/weather-widget"
import { LiveEventsWidget } from "./widgets/live-events-widget"
import { NewsHeroWidget } from "./widgets/news-hero-widget"
import { QuickLinksWidget } from "./widgets/quick-links-widget"
import { TrendingWidget } from "./widgets/trending-widget"
import { BusinessSpotlightWidget } from "./widgets/business-spotlight-widget"
import { SocialFeedWidget } from "./widgets/social-feed-widget"
import { DealsWidget } from "./widgets/deals-widget"
import { EventsCalendarWidget } from "./widgets/events-calendar-widget"
import { ForumActivityWidget } from "./widgets/forum-activity-widget"
import { PhotoGalleryWidget } from "./widgets/photo-gallery-widget"
import { TrafficWidget } from "./widgets/traffic-widget"
import { CuratorSocialWidget } from "../widgets/curator-social-widget"
import { GoogleReviewsWidget } from "../widgets/google-reviews-widget"

interface Widget {
  id: string
  type: string
  title: string
  dimensions: WidgetDimensions
  visible: boolean
  zIndex: number
}

const widgetComponents = {
  weather: WeatherWidget,
  liveEvents: LiveEventsWidget,
  newsHero: NewsHeroWidget,
  quickLinks: QuickLinksWidget,
  trending: TrendingWidget,
  businessSpotlight: BusinessSpotlightWidget,
  socialFeed: SocialFeedWidget,
  deals: DealsWidget,
  eventsCalendar: EventsCalendarWidget,
  forumActivity: ForumActivityWidget,
  photoGallery: PhotoGalleryWidget,
  traffic: TrafficWidget,
  curatorSocial: CuratorSocialWidget,
  googleReviews: GoogleReviewsWidget,
}

const widgetTitles = {
  weather: "Weather",
  liveEvents: "Live Events",
  newsHero: "News Hero",
  quickLinks: "Quick Links",
  trending: "Trending",
  businessSpotlight: "Business Spotlight",
  socialFeed: "Social Feed",
  deals: "Deals",
  eventsCalendar: "Events Calendar",
  forumActivity: "Forum Activity",
  photoGallery: "Photo Gallery",
  traffic: "Traffic",
  curatorSocial: "Curator Social",
  googleReviews: "Google Reviews",
}

export function WysiwygHomepage() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [history, setHistory] = useState<Widget[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [gridSize, setGridSize] = useState(12)
  const [showGrid, setShowGrid] = useState(false)
  const [canvasWidth, setCanvasWidth] = useState(1200)
  const [canvasHeight, setCanvasHeight] = useState(800)

  useEffect(() => {
    // Initialize widgets with dynamic positioning
    const initialWidgets: Widget[] = [
      {
        id: "newsHero",
        type: "newsHero",
        title: "News Hero",
        dimensions: { width: 600, height: 300, x: 50, y: 50, minWidth: 400, minHeight: 200 },
        visible: true,
        zIndex: 1,
      },
      {
        id: "weather",
        type: "weather",
        title: "Weather",
        dimensions: { width: 300, height: 200, x: 700, y: 50, minWidth: 250, minHeight: 150 },
        visible: true,
        zIndex: 1,
      },
      {
        id: "googleReviews",
        type: "googleReviews",
        title: "Google Reviews",
        dimensions: { width: 300, height: 200, x: 1050, y: 50, minWidth: 250, minHeight: 150 },
        visible: true,
        zIndex: 1,
      },
      {
        id: "curatorSocial",
        type: "curatorSocial",
        title: "Curator Social",
        dimensions: { width: 400, height: 250, x: 50, y: 400, minWidth: 300, minHeight: 200 },
        visible: true,
        zIndex: 1,
      },
      {
        id: "trending",
        type: "trending",
        title: "Trending",
        dimensions: { width: 350, height: 250, x: 500, y: 400, minWidth: 300, minHeight: 200 },
        visible: true,
        zIndex: 1,
      },
      {
        id: "businessSpotlight",
        type: "businessSpotlight",
        title: "Business Spotlight",
        dimensions: { width: 450, height: 300, x: 900, y: 300, minWidth: 350, minHeight: 250 },
        visible: true,
        zIndex: 1,
      },
      {
        id: "deals",
        type: "deals",
        title: "Deals",
        dimensions: { width: 300, height: 200, x: 50, y: 700, minWidth: 250, minHeight: 150 },
        visible: true,
        zIndex: 1,
      },
      {
        id: "photoGallery",
        type: "photoGallery",
        title: "Photo Gallery",
        dimensions: { width: 300, height: 200, x: 400, y: 700, minWidth: 250, minHeight: 150 },
        visible: true,
        zIndex: 1,
      },
      {
        id: "eventsCalendar",
        type: "eventsCalendar",
        title: "Events Calendar",
        dimensions: { width: 500, height: 350, x: 750, y: 650, minWidth: 400, minHeight: 300 },
        visible: true,
        zIndex: 1,
      },
    ]

    setWidgets(initialWidgets)
    setHistory([initialWidgets])
    setHistoryIndex(0)
  }, [])

  const saveToHistory = useCallback(
    (newWidgets: Widget[]) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...newWidgets])
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex],
  )

  const handleWidgetResize = useCallback(
    (widgetId: string, dimensions: WidgetDimensions) => {
      setWidgets((prev) => {
        const updated = prev.map((widget) => (widget.id === widgetId ? { ...widget, dimensions } : widget))
        saveToHistory(updated)
        return updated
      })
    },
    [saveToHistory],
  )

  const handleWidgetMove = useCallback((widgetId: string, position: { x: number; y: number }) => {
    setWidgets((prev) => {
      const updated = prev.map((widget) =>
        widget.id === widgetId ? { ...widget, dimensions: { ...widget.dimensions, ...position } } : widget,
      )
      return updated
    })
  }, [])

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets((prev) => {
      const updated = prev.map((widget) => (widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget))
      saveToHistory(updated)
      return updated
    })
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setWidgets(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setWidgets(history[historyIndex + 1])
    }
  }

  const resetLayout = () => {
    if (history.length > 0) {
      setWidgets(history[0])
      saveToHistory(history[0])
    }
  }

  const autoArrange = () => {
    const arranged = [...widgets].map((widget, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      return {
        ...widget,
        dimensions: {
          ...widget.dimensions,
          x: col * 400 + 50,
          y: row * 300 + 50,
        },
      }
    })
    setWidgets(arranged)
    saveToHistory(arranged)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* WYSIWYG Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-800">Pattaya1 WYSIWYG Editor</h1>
            <div className="flex items-center space-x-2">
              <Switch checked={isEditMode} onCheckedChange={setIsEditMode} id="edit-mode" />
              <label htmlFor="edit-mode" className="text-sm font-medium">
                Edit Mode
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isEditMode && (
              <>
                <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                  <Undo className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                  <Redo className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={autoArrange}>
                  Auto Arrange
                </Button>
                <Button variant="outline" size="sm" onClick={resetLayout}>
                  Reset
                </Button>
              </>
            )}
            <Button variant="default" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Layout
            </Button>
          </div>
        </div>

        {/* Widget Controls */}
        {isEditMode && (
          <div className="border-t border-gray-200 px-6 py-2">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Grid Size:</span>
                <Slider
                  value={[gridSize]}
                  onValueChange={(value) => setGridSize(value[0])}
                  max={24}
                  min={8}
                  step={4}
                  className="w-20"
                />
                <span className="text-xs text-gray-500">{gridSize}px</span>
              </div>

              <div className="flex items-center space-x-4">
                {widgets.map((widget) => (
                  <div key={widget.id} className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleWidgetVisibility(widget.id)}
                      className="h-6 px-2"
                    >
                      {widget.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <span className="text-xs">{widgetTitles[widget.type as keyof typeof widgetTitles]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div
        className="relative overflow-auto"
        style={{
          minHeight: `${canvasHeight}px`,
          backgroundImage: showGrid
            ? `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `
            : "none",
          backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : "auto",
        }}
      >
        {/* Widgets */}
        {widgets
          .filter((widget) => widget.visible)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((widget) => {
            const WidgetComponent = widgetComponents[widget.type as keyof typeof widgetComponents]
            if (!WidgetComponent) return null

            return (
              <ResizableWidgetWrapper
                key={widget.id}
                widgetId={widget.id}
                initialDimensions={widget.dimensions}
                onResize={(dimensions) => handleWidgetResize(widget.id, dimensions)}
                onMove={(position) => handleWidgetMove(widget.id, position)}
                isEditMode={isEditMode}
                title={widget.title}
                className="shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <WidgetComponent />
              </ResizableWidgetWrapper>
            )
          })}

        {/* Canvas Size Indicator */}
        {isEditMode && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs px-3 py-2 rounded">
            Canvas: {canvasWidth} × {canvasHeight}
          </div>
        )}
      </div>
    </div>
  )
}
