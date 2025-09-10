"use client"

import { useState, useEffect, useCallback } from "react"
import { Responsive, WidthProvider } from 'react-grid-layout';
import { InView } from 'react-intersection-observer';
import { Settings, BarChart3, Eye, EyeOff, ToggleLeft, ToggleRight, Activity, Sparkles, Save, RotateCcw, Move, Maximize2, X, GripVertical } from "lucide-react"
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

// Import CSS for react-grid-layout
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// ResponsiveGridLayout component with width provider
const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  id: string
  name: string
  type: string
  description: string
  size: "small" | "medium" | "large" | "xlarge"
  category: string
  isVisible: boolean
  isResizable: boolean
  allowUserResizingAndMoving: boolean
  isMandatory: boolean
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

interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  isDraggable?: boolean
  isResizable?: boolean
  static?: boolean
}

export function DynamicModularHomepage() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [layout, setLayout] = useState<LayoutItem[]>([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "business" | "user">("admin")
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<{id: string, name: string, content: string} | null>(null)

  /**
   * Mock API function to save user layout to backend
   */
  const saveLayoutToApi = useCallback(async (currentLayout: LayoutItem[]) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const simplifiedLayout = currentLayout.map(item => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h
      }));
      
      console.log('Saving layout to API:', simplifiedLayout);
      
      // Save to localStorage as fallback
      localStorage.setItem("pattaya1-dynamic-layout", JSON.stringify(simplifiedLayout));
      
      return { success: true, data: simplifiedLayout };
    } catch (error) {
      console.error('Failed to save layout:', error);
      return { success: false, error };
    }
  }, []);

  /**
   * Mock API function to load user's saved layout
   */
  const loadUserLayout = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Try to load from localStorage first
      const savedLayout = localStorage.getItem("pattaya1-dynamic-layout");
      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout);
        console.log('Loading user layout from localStorage:', parsedLayout);
        return { success: true, data: parsedLayout };
      }
      
      return { success: false, data: null };
    } catch (error) {
      console.error('Failed to load user layout:', error);
      return { success: false, error };
    }
  }, []);

  /**
   * Generate layout from widget configurations
   */
  const generateLayoutFromWidgets = useCallback((widgetConfigs: Widget[], savedLayout: any[] | null = null) => {
    return widgetConfigs.map((widget, index) => {
      // Check if there's a saved layout for this widget
      const savedItem = savedLayout?.find(item => item.i === widget.id);
      
      // Default grid positions based on original layout
      const defaultPositions: { [key: string]: { x: number, y: number, w: number, h: number } } = {
        "weather": { x: 0, y: 0, w: 3, h: 4 },
        "breaking-news": { x: 3, y: 0, w: 6, h: 3 },
        "radio": { x: 9, y: 0, w: 3, h: 4 },
        "hot-deals": { x: 3, y: 3, w: 6, h: 3 },
        "news-hero": { x: 0, y: 4, w: 6, h: 4 },
        "business-spotlight": { x: 6, y: 4, w: 6, h: 3 },
        "social-feed": { x: 6, y: 7, w: 3, h: 3 },
        "trending": { x: 9, y: 7, w: 3, h: 3 },
        "youtube": { x: 0, y: 8, w: 3, h: 3 },
        "events-calendar": { x: 3, y: 8, w: 3, h: 3 },
        "quick-links": { x: 9, y: 10, w: 3, h: 3 },
        "photo-gallery": { x: 0, y: 11, w: 6, h: 4 },
        "forum-activity": { x: 6, y: 10, w: 6, h: 3 },
        "google-reviews": { x: 6, y: 13, w: 3, h: 3 },
        "curator-social": { x: 9, y: 13, w: 3, h: 3 },
        "traffic": { x: 0, y: 15, w: 12, h: 3 },
      };
      
      const defaultPos = defaultPositions[widget.id] || { x: (index % 4) * 3, y: Math.floor(index / 4) * 4, w: 3, h: 3 };
      
      return {
        i: widget.id,
        x: savedItem?.x ?? defaultPos.x,
        y: savedItem?.y ?? defaultPos.y,
        w: savedItem?.w ?? defaultPos.w,
        h: savedItem?.h ?? defaultPos.h,
        isDraggable: widget.allowUserResizingAndMoving,
        isResizable: widget.allowUserResizingAndMoving,
        static: !widget.allowUserResizingAndMoving
      };
    });
  }, []);

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
      const existingScript = document.querySelector('script[src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  const initializeWidgets = async () => {
    try {
      console.log('Initializing dynamic widgets...')
      const defaultWidgets: Widget[] = [
        {
          id: "weather",
          name: "Weather Widget",
          type: "weather",
          description: "Current weather conditions",
          size: "medium",
          category: "Information",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: true,
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
          category: "News",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: true,
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
          category: "Entertainment",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Business",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: true,
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
          category: "News",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: true,
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
          category: "Business",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Social",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Social",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Entertainment",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Events",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Navigation",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Media",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Community",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Business",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Social",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true,
          isMandatory: false,
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
          category: "Information",
          isVisible: true,
          isResizable: true,
          allowUserResizingAndMoving: true, // Allow resizing and moving
          isMandatory: true,
          settings: {
            apiKeys: { google: process.env.GOOGLE_MAPS_API_KEY || "" },
            refreshInterval: 300000,
          },
        },
      ]

      // Load user's saved layout
      const userLayoutResult = await loadUserLayout();
      const savedLayout = userLayoutResult.success ? userLayoutResult.data : null;
      
      // Generate layout from configurations and saved data
      const generatedLayout = generateLayoutFromWidgets(defaultWidgets, savedLayout);
      
      setWidgets(defaultWidgets);
      setLayout(generatedLayout);
      
      console.log('Dynamic widgets initialized successfully')
      setLoading(false)
    } catch (error) {
      console.error('Error initializing dynamic widgets:', error)
      setLoading(false)
    }
  }

  const handleToggleWidget = (widgetId: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w)))
  }

  const handleSaveLayout = async () => {
    await saveLayoutToApi(layout);
    console.log("Layout saved!");
  }

  const handleResetLayout = () => {
    initializeWidgets()
    localStorage.removeItem("pattaya1-dynamic-layout")
  }

  /**
   * Handle layout changes (drag, resize)
   */
  const handleLayoutChange = useCallback((newLayout: LayoutItem[]) => {
    setLayout(newLayout);
  }, []);

  /**
   * Handle drag stop - save layout to API
   */
  const handleDragStop = useCallback(async (newLayout: LayoutItem[]) => {
    await saveLayoutToApi(newLayout);
  }, [saveLayoutToApi]);

  /**
   * Handle resize stop - save layout to API
   */
  const handleResizeStop = useCallback(async (newLayout: LayoutItem[]) => {
    await saveLayoutToApi(newLayout);
  }, [saveLayoutToApi]);

  /**
   * Handle widget deletion
   */
  const handleDeleteWidget = useCallback((widgetId: string) => {
    const updatedWidgets = widgets.filter(widget => widget.id !== widgetId);
    const updatedLayout = layout.filter(item => item.i !== widgetId);
    
    setWidgets(updatedWidgets);
    setLayout(updatedLayout);
    
    // Save the updated layout
    saveLayoutToApi(updatedLayout);
  }, [widgets, layout, saveLayoutToApi]);

  /**
   * Handle widget expansion
   */
  const handleExpandWidget = useCallback((widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    setModalContent({
      id: widgetId,
      name: widget?.name || 'Widget',
      content: `This is the expanded view of ${widget?.name || 'the widget'}. Here you would show detailed content like a 5-day weather forecast, full list of radio stations, etc.`
    });
    setIsModalOpen(true);
  }, [widgets]);

  /**
   * Close modal
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);

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

  /**
   * Render individual widget with lazy loading
   */
  const renderWidget = (widget: Widget) => {
    const layoutItem = layout.find(item => item.i === widget.id);
    if (!layoutItem) return null;

    const WidgetComponent = getWidgetComponent(widget.id);
    if (!WidgetComponent) return null;

    return (
      <div key={widget.id} className="widget-container bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
        <InView triggerOnce>
          {({ inView, ref }) => (
            <div ref={ref} className="widget-content h-full">
              {inView ? (
                <div className="widget-loaded h-full flex flex-col">
                  {/* Widget Header with Controls */}
                  <div className="widget-header bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex justify-between items-center">
                    <div className="widget-title-section flex items-center gap-2">
                      <h3 className="widget-title text-sm font-semibold truncate">{widget.name}</h3>
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                        {widget.category}
                      </Badge>
                    </div>
                    <div className="widget-actions flex gap-1">
                      {/* Drag Handle - Only show if widget is draggable */}
                      {widget.allowUserResizingAndMoving && (
                        <button
                          className="drag-handle p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors cursor-move"
                          title="Drag to move widget"
                        >
                          <GripVertical className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        className="expand-btn p-1.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
                        onClick={() => handleExpandWidget(widget.id)}
                        title="Expand widget"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                      {!widget.isMandatory && (
                        <button
                          className="delete-btn p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 transition-colors"
                          onClick={() => handleDeleteWidget(widget.id)}
                          title="Delete widget"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Widget Body */}
                  <div className="widget-body flex-1 p-0">
                    <div className="widget-inner-content h-full">
                      <WidgetComponent />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="widget-placeholder h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 p-4">
                  <div className="loading-spinner text-2xl mb-2 animate-spin">⏳</div>
                  <p className="text-sm text-center">Loading {widget.name}...</p>
                </div>
              )}
            </div>
          )}
        </InView>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans antialiased">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-600 font-medium">Loading dynamic dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Scrolling Marquee */}
      <ScrollingMarquee />

      {/* Control Header */}
      {isEditMode && (
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Dynamic Widget Layout Editor</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {visibleWidgets.length} Active Widgets
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleSaveLayout} className="text-xs sm:text-sm">
                <Save className="w-4 h-4 mr-2" />
                Save Layout
              </Button>

              <Button variant="outline" size="sm" onClick={handleResetLayout} className="text-xs sm:text-sm">
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
            className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Edit Layout</span>
            <span className="sm:hidden">Edit</span>
          </Button>
        </div>
      )}

      {/* Apple-style Widget Admin Panel */}
      {showAdmin && (
        <div className="bg-white/60 backdrop-blur-sm border-b border-gray-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
                      <h4 className="font-semibold text-sm mb-2 text-gray-900 line-clamp-2">{widget.name}</h4>
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

      {/* Dynamic Grid Layout */}
      <div className="p-2 sm:p-4">
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={50}
          width={1200}
          onLayoutChange={handleLayoutChange}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          isDraggable={false}
          isResizable={true}
          margin={[8, 8]}
          containerPadding={[8, 8]}
          draggableHandle=".drag-handle"
        >
          {widgets.map(renderWidget)}
        </ResponsiveGridLayout>
      </div>

      {/* Expand Modal */}
      {isModalOpen && modalContent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h2 className="text-xl font-semibold">{modalContent.name} - Expanded View</h2>
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" onClick={closeModal}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <p className="text-gray-700 mb-4">{modalContent.content}</p>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm"><strong>Widget ID:</strong> {modalContent.id}</p>
                <p className="text-sm"><strong>Features:</strong> Full-screen view, detailed content, enhanced functionality</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Footer */}
      <div className="text-center py-4 text-sm text-gray-500 border-t border-gray-200 bg-white/80">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span>Pattaya1 Dashboard - Dynamic Grid Layout</span>
          <Badge variant="secondary">V2.0 Dynamic</Badge>
          <span className="hidden sm:inline">•</span>
          <span>{widgets.length} Total Widgets</span>
          <span className="hidden sm:inline">•</span>
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
    </div>
  )
}
