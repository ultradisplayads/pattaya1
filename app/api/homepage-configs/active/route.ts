import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock homepage configuration data
    const config = {
      success: true,
      data: {
        id: "default-config",
        name: "Default Homepage Configuration",
        layout: "dynamic-grid",
        widgets: {
          enabled: [
            "weather",
            "breaking-news", 
            "hot-deals",
            "news-hero",
            "business-spotlight",
            "social-feed",
            "trending",
            "youtube",
            "events-calendar",
            "quick-links",
            "photo-gallery",
            "forum-activity",
            "google-reviews",
            "curator-social",
            "currency-converter",
            "traffic",
            "radio"
          ],
          positions: {},
          settings: {
            allowUserCustomization: true,
            enableDragDrop: true,
            enableResize: true
          }
        },
        theme: {
          primaryColor: "#3b82f6",
          backgroundColor: "#f9fafb",
          borderRadius: "8px"
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      meta: {
        source: "fallback",
        message: "Using default configuration - Strapi backend not available"
      }
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching homepage config:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch homepage configuration',
        data: null 
      },
      { status: 500 }
    )
  }
}
