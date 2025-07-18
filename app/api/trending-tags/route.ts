import { type NextRequest, NextResponse } from "next/server"

interface TrendingTag {
  id: string
  tag: string
  count: number
  category: string
  trend: "up" | "down" | "stable"
  trendPercentage: number
  relatedTags: string[]
  lastUpdated: string
}

// Mock trending tags data - in production, this would come from analytics
const mockTrendingTags: TrendingTag[] = [
  {
    id: "1",
    tag: "#PattayaBeach",
    count: 15420,
    category: "tourism",
    trend: "up",
    trendPercentage: 23.5,
    relatedTags: ["#Thailand", "#Beach", "#Sunset", "#Travel"],
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    tag: "#StreetFood",
    count: 12890,
    category: "food",
    trend: "up",
    trendPercentage: 18.2,
    relatedTags: ["#ThaiFood", "#PadThai", "#MangoStickyRice", "#LocalEats"],
    lastUpdated: "2024-01-15T10:25:00Z",
  },
  {
    id: "3",
    tag: "#PattayaNightlife",
    count: 11567,
    category: "entertainment",
    trend: "stable",
    trendPercentage: 2.1,
    relatedTags: ["#Bars", "#Clubs", "#WalkingStreet", "#Nightout"],
    lastUpdated: "2024-01-15T10:20:00Z",
  },
  {
    id: "4",
    tag: "#WaterSports",
    count: 8934,
    category: "activities",
    trend: "up",
    trendPercentage: 31.7,
    relatedTags: ["#JetSki", "#Parasailing", "#Diving", "#Adventure"],
    lastUpdated: "2024-01-15T10:15:00Z",
  },
  {
    id: "5",
    tag: "#PattayaHotels",
    count: 7823,
    category: "accommodation",
    trend: "down",
    trendPercentage: -5.3,
    relatedTags: ["#Luxury", "#Beachfront", "#Resort", "#Booking"],
    lastUpdated: "2024-01-15T10:10:00Z",
  },
  {
    id: "6",
    tag: "#ThaiMassage",
    count: 6745,
    category: "wellness",
    trend: "up",
    trendPercentage: 12.8,
    relatedTags: ["#Spa", "#Relaxation", "#Traditional", "#Wellness"],
    lastUpdated: "2024-01-15T10:05:00Z",
  },
  {
    id: "7",
    tag: "#PattayaMarkets",
    count: 5892,
    category: "shopping",
    trend: "stable",
    trendPercentage: 1.2,
    relatedTags: ["#Shopping", "#Souvenirs", "#LocalMarket", "#Bargaining"],
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    id: "8",
    tag: "#TempleVisit",
    count: 4567,
    category: "culture",
    trend: "up",
    trendPercentage: 8.9,
    relatedTags: ["#Culture", "#Buddhism", "#Heritage", "#Spiritual"],
    lastUpdated: "2024-01-15T09:55:00Z",
  },
  {
    id: "9",
    tag: "#PattayaWeather",
    count: 3821,
    category: "weather",
    trend: "up",
    trendPercentage: 45.2,
    relatedTags: ["#Sunny", "#Tropical", "#RainySeason", "#Climate"],
    lastUpdated: "2024-01-15T09:50:00Z",
  },
  {
    id: "10",
    tag: "#TransportPattaya",
    count: 3456,
    category: "transport",
    trend: "stable",
    trendPercentage: -0.8,
    relatedTags: ["#Songthaew", "#Taxi", "#Motorbike", "#BusRoute"],
    lastUpdated: "2024-01-15T09:45:00Z",
  },
  {
    id: "11",
    tag: "#PattayaEvents",
    count: 2987,
    category: "events",
    trend: "up",
    trendPercentage: 67.3,
    relatedTags: ["#Festival", "#Concert", "#Exhibition", "#Community"],
    lastUpdated: "2024-01-15T09:40:00Z",
  },
  {
    id: "12",
    tag: "#BeachActivities",
    count: 2654,
    category: "activities",
    trend: "up",
    trendPercentage: 22.1,
    relatedTags: ["#Swimming", "#Sunbathing", "#BeachVolleyball", "#Relaxation"],
    lastUpdated: "2024-01-15T09:35:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category") || "all"
    const trend = searchParams.get("trend") || "all"
    const sortBy = searchParams.get("sortBy") || "count"

    let filteredTags = [...mockTrendingTags]

    // Filter by category
    if (category !== "all") {
      filteredTags = filteredTags.filter((tag) => tag.category === category)
    }

    // Filter by trend
    if (trend !== "all") {
      filteredTags = filteredTags.filter((tag) => tag.trend === trend)
    }

    // Sort tags
    switch (sortBy) {
      case "count":
        filteredTags.sort((a, b) => b.count - a.count)
        break
      case "trend":
        filteredTags.sort((a, b) => Math.abs(b.trendPercentage) - Math.abs(a.trendPercentage))
        break
      case "recent":
        filteredTags.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      default:
        filteredTags.sort((a, b) => b.count - a.count)
    }

    // Limit results
    const limitedTags = filteredTags.slice(0, limit)

    // Calculate statistics
    const totalMentions = limitedTags.reduce((sum, tag) => sum + tag.count, 0)
    const trendingUp = limitedTags.filter((tag) => tag.trend === "up").length
    const trendingDown = limitedTags.filter((tag) => tag.trend === "down").length
    const stable = limitedTags.filter((tag) => tag.trend === "stable").length

    const categories = [
      "all",
      "tourism",
      "food",
      "entertainment",
      "activities",
      "accommodation",
      "wellness",
      "shopping",
      "culture",
      "weather",
      "transport",
      "events",
    ]

    return NextResponse.json({
      tags: limitedTags,
      total: filteredTags.length,
      statistics: {
        totalMentions,
        trendingUp,
        trendingDown,
        stable,
        categories: categories.map((cat) => ({
          name: cat,
          count:
            cat === "all" ? mockTrendingTags.length : mockTrendingTags.filter((tag) => tag.category === cat).length,
        })),
      },
      filters: {
        categories,
        trends: ["all", "up", "down", "stable"],
        sortOptions: [
          { value: "count", label: "Most Mentioned" },
          { value: "trend", label: "Biggest Trend" },
          { value: "recent", label: "Most Recent" },
        ],
      },
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Trending tags API error:", error)
    return NextResponse.json({ error: "Failed to fetch trending tags" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, tagId, data } = body

    if (action === "track-click" && tagId) {
      // Track tag click - in production, this would update analytics
      const tag = mockTrendingTags.find((t) => t.id === tagId)
      if (tag) {
        tag.count += 1
        console.log(`Tag click tracked: ${tag.tag} - New count: ${tag.count}`)
      }
      return NextResponse.json({ success: true, message: "Click tracked" })
    }

    if (action === "add-tag" && data?.tag) {
      // Add new trending tag - in production, this would update the database
      const newTag: TrendingTag = {
        id: `${Date.now()}`,
        tag: data.tag,
        count: 1,
        category: data.category || "general",
        trend: "up",
        trendPercentage: 100,
        relatedTags: data.relatedTags || [],
        lastUpdated: new Date().toISOString(),
      }

      mockTrendingTags.push(newTag)
      console.log(`New tag added: ${newTag.tag}`)
      return NextResponse.json({ success: true, tag: newTag })
    }

    if (action === "report-tag" && tagId && data?.reason) {
      // Report inappropriate tag - in production, this would create a report
      console.log(`Tag ${tagId} reported for: ${data.reason}`)
      return NextResponse.json({ success: true, message: "Report submitted" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Trending tags action error:", error)
    return NextResponse.json({ error: "Failed to process trending tags action" }, { status: 500 })
  }
}
