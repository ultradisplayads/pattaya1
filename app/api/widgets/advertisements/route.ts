import { type NextRequest, NextResponse } from "next/server"

interface Advertisement {
  id: string
  title: string
  description: string
  image: string
  url: string
  type: "banner" | "card" | "native" | "video"
  category: string
  priority: number
  isActive: boolean
  impressions: number
  clicks: number
  ctr: number
  budget: number
  spent: number
  startDate: string
  endDate: string
  targetAudience: {
    location: string[]
    interests: string[]
    ageRange: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const position = searchParams.get("position")
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    // Mock advertisement data
    const mockAds: Advertisement[] = [
      {
        id: "ad-1",
        title: "Luxury Beach Resort - Special Offer",
        description: "Book now and save 40% on your dream vacation at our 5-star beachfront resort.",
        image: "/placeholder.svg?height=300&width=600",
        url: "https://example-resort.com/special-offer",
        type: "banner",
        category: "hotels",
        priority: 10,
        isActive: true,
        impressions: 15420,
        clicks: 234,
        ctr: 1.52,
        budget: 50000,
        spent: 12500,
        startDate: "2024-01-01T00:00:00Z",
        endDate: "2024-02-29T23:59:59Z",
        targetAudience: {
          location: ["Thailand", "Southeast Asia"],
          interests: ["travel", "luxury", "beaches"],
          ageRange: "25-55",
        },
      },
      {
        id: "ad-2",
        title: "Best Thai Restaurant in Pattaya",
        description: "Authentic Thai cuisine with fresh ingredients. Try our signature dishes today!",
        image: "/placeholder.svg?height=200&width=300",
        url: "https://example-restaurant.com",
        type: "card",
        category: "restaurants",
        priority: 8,
        isActive: true,
        impressions: 8930,
        clicks: 156,
        ctr: 1.75,
        budget: 25000,
        spent: 8750,
        startDate: "2024-01-15T00:00:00Z",
        endDate: "2024-03-15T23:59:59Z",
        targetAudience: {
          location: ["Pattaya", "Bangkok"],
          interests: ["food", "dining", "thai cuisine"],
          ageRange: "20-65",
        },
      },
      {
        id: "ad-3",
        title: "Adventure Tours & Activities",
        description: "Discover Pattaya's best adventures! Island hopping, water sports, and cultural tours.",
        image: "/placeholder.svg?height=250&width=400",
        url: "https://example-tours.com",
        type: "native",
        category: "activities",
        priority: 7,
        isActive: true,
        impressions: 12340,
        clicks: 198,
        ctr: 1.6,
        budget: 35000,
        spent: 15400,
        startDate: "2024-01-10T00:00:00Z",
        endDate: "2024-04-10T23:59:59Z",
        targetAudience: {
          location: ["Global"],
          interests: ["adventure", "tours", "activities"],
          ageRange: "18-50",
        },
      },
      {
        id: "ad-4",
        title: "Premium Spa & Wellness Center",
        description: "Relax and rejuvenate with our world-class spa treatments and wellness programs.",
        image: "/placeholder.svg?height=300&width=500",
        url: "https://example-spa.com",
        type: "banner",
        category: "wellness",
        priority: 6,
        isActive: true,
        impressions: 6780,
        clicks: 89,
        ctr: 1.31,
        budget: 20000,
        spent: 6200,
        startDate: "2024-01-20T00:00:00Z",
        endDate: "2024-03-20T23:59:59Z",
        targetAudience: {
          location: ["Thailand", "Asia"],
          interests: ["wellness", "spa", "relaxation"],
          ageRange: "25-60",
        },
      },
      {
        id: "ad-5",
        title: "Nightlife & Entertainment Guide",
        description: "Experience Pattaya's vibrant nightlife! Bars, clubs, and entertainment venues.",
        image: "/placeholder.svg?height=200&width=350",
        url: "https://example-nightlife.com",
        type: "card",
        category: "nightlife",
        priority: 5,
        isActive: true,
        impressions: 9560,
        clicks: 145,
        ctr: 1.52,
        budget: 15000,
        spent: 4800,
        startDate: "2024-01-05T00:00:00Z",
        endDate: "2024-02-05T23:59:59Z",
        targetAudience: {
          location: ["Global"],
          interests: ["nightlife", "entertainment", "bars"],
          ageRange: "21-45",
        },
      },
    ]

    // Filter advertisements based on query parameters
    let filteredAds = mockAds.filter((ad) => ad.isActive)

    if (type) {
      filteredAds = filteredAds.filter((ad) => ad.type === type)
    }

    if (category) {
      filteredAds = filteredAds.filter((ad) => ad.category === category)
    }

    // Sort by priority (higher priority first)
    filteredAds.sort((a, b) => b.priority - a.priority)

    // Limit results
    const limitedAds = filteredAds.slice(0, limit)

    // Track impressions (in a real app, you'd update the database)
    const adsWithTracking = limitedAds.map((ad) => ({
      ...ad,
      impressions: ad.impressions + 1,
    }))

    return NextResponse.json({
      success: true,
      advertisements: adsWithTracking,
      total: filteredAds.length,
      metadata: {
        types: ["banner", "card", "native", "video"],
        categories: ["hotels", "restaurants", "activities", "wellness", "nightlife"],
        positions: ["header", "sidebar", "content", "footer"],
      },
    })
  } catch (error) {
    console.error("Advertisement API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch advertisements",
        advertisements: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adId, action, userId } = body

    if (!adId || !action) {
      return NextResponse.json({ success: false, error: "Ad ID and action are required" }, { status: 400 })
    }

    // Track ad interactions
    const trackingData = {
      adId,
      action, // 'click', 'view', 'conversion'
      userId: userId || "anonymous",
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    }

    // In a real app, you'd save this to a database
    console.log("Ad tracking:", trackingData)

    return NextResponse.json({
      success: true,
      message: "Ad interaction tracked successfully",
      trackingId: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    })
  } catch (error) {
    console.error("Ad tracking error:", error)
    return NextResponse.json({ success: false, error: "Failed to track ad interaction" }, { status: 500 })
  }
}
