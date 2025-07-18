import { type NextRequest, NextResponse } from "next/server"

interface Advertisement {
  id: string
  title: string
  content: string
  url: string
  imageUrl?: string
  sponsor: string
  widgetType: string
  isActive: boolean
  priority: number
  startDate: string
  endDate: string
  targetAudience?: string[]
  clickCount: number
  impressionCount: number
}

// Mock advertisement data - in production, this would come from a database
const advertisements: Advertisement[] = [
  {
    id: "ad1",
    title: "Visit Pattaya Beach Resort",
    content: "Luxury beachfront accommodation with stunning ocean views. Book now and save 20%!",
    url: "https://pattayabeachresort.com",
    imageUrl: "/placeholder.svg?height=40&width=60&text=Resort",
    sponsor: "Pattaya Beach Resort",
    widgetType: "breaking-news",
    isActive: true,
    priority: 1,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    targetAudience: ["tourists", "travelers"],
    clickCount: 245,
    impressionCount: 12500,
  },
  {
    id: "ad2",
    title: "Best Thai Restaurant in Pattaya",
    content: "Authentic Thai cuisine in the heart of Pattaya. Try our signature dishes!",
    url: "https://thaigardenrestaurant.com",
    imageUrl: "/placeholder.svg?height=40&width=60&text=Food",
    sponsor: "Thai Garden Restaurant",
    widgetType: "breaking-news",
    isActive: true,
    priority: 2,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    targetAudience: ["food-lovers", "tourists"],
    clickCount: 189,
    impressionCount: 8900,
  },
  {
    id: "ad3",
    title: "Pattaya Nightlife Tours",
    content: "Experience the best of Pattaya's nightlife with our guided tours",
    url: "https://pattayanightlifetours.com",
    imageUrl: "/placeholder.svg?height=40&width=60&text=Night",
    sponsor: "Pattaya Night Tours",
    widgetType: "breaking-news",
    isActive: true,
    priority: 3,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    targetAudience: ["nightlife", "entertainment"],
    clickCount: 156,
    impressionCount: 7200,
  },
  {
    id: "ad4",
    title: "Scuba Diving Adventures",
    content: "Explore the underwater world around Pattaya with certified instructors",
    url: "https://pattayascubadiving.com",
    imageUrl: "/placeholder.svg?height=40&width=60&text=Dive",
    sponsor: "Pattaya Scuba Center",
    widgetType: "breaking-news",
    isActive: true,
    priority: 4,
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    targetAudience: ["adventure", "water-sports"],
    clickCount: 98,
    impressionCount: 4500,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const widgetType = searchParams.get("widget")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Filter advertisements by widget type if specified
    let filteredAds = advertisements.filter((ad) => ad.isActive)

    if (widgetType) {
      filteredAds = filteredAds.filter((ad) => ad.widgetType === widgetType)
    }

    // Sort by priority
    filteredAds.sort((a, b) => a.priority - b.priority)

    // Limit results
    const limitedAds = filteredAds.slice(0, limit)

    // Check if advertisements are enabled for this widget
    const adSettings = {
      enabled: true, // This would come from widget configuration
      frequency: 3, // Show ad every 3 news items
      maxAdsPerSession: 5,
    }

    return NextResponse.json({
      advertisements: limitedAds,
      enabled: adSettings.enabled,
      settings: adSettings,
      total: filteredAds.length,
    })
  } catch (error) {
    console.error("Advertisement API error:", error)
    return NextResponse.json({ error: "Failed to fetch advertisements" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, adId } = body

    if (action === "click" && adId) {
      // Track click - in production, this would update the database
      const ad = advertisements.find((a) => a.id === adId)
      if (ad) {
        ad.clickCount++
        console.log(`Ad click tracked: ${adId} - ${ad.title}`)
      }

      return NextResponse.json({ success: true, message: "Click tracked" })
    }

    if (action === "impression" && adId) {
      // Track impression - in production, this would update the database
      const ad = advertisements.find((a) => a.id === adId)
      if (ad) {
        ad.impressionCount++
      }

      return NextResponse.json({ success: true, message: "Impression tracked" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Advertisement tracking error:", error)
    return NextResponse.json({ error: "Failed to track advertisement interaction" }, { status: 500 })
  }
}
