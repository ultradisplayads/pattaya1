import { type NextRequest, NextResponse } from "next/server"

// Sample keyword data - replace with database queries
const sampleKeywords = [
  {
    id: "1",
    keyword: "pattaya restaurants",
    currentRank: 3,
    previousRank: 5,
    volume: 8100,
    difficulty: 65,
    ctr: 12.5,
    impressions: 15420,
    clicks: 1928,
    url: "/dining/restaurants",
    lastUpdated: "2024-01-15",
    trend: "up",
    opportunity: "high",
  },
  {
    id: "2",
    keyword: "jomtien beach hotels",
    currentRank: 7,
    previousRank: 6,
    volume: 5400,
    difficulty: 58,
    ctr: 8.2,
    impressions: 9840,
    clicks: 807,
    url: "/accommodation/jomtien",
    lastUpdated: "2024-01-15",
    trend: "down",
    opportunity: "medium",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const rank = searchParams.get("rank")
    const opportunity = searchParams.get("opportunity")

    let filteredKeywords = sampleKeywords

    if (search) {
      filteredKeywords = filteredKeywords.filter((keyword) =>
        keyword.keyword.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (rank && rank !== "all") {
      switch (rank) {
        case "top10":
          filteredKeywords = filteredKeywords.filter((k) => k.currentRank <= 10)
          break
        case "top20":
          filteredKeywords = filteredKeywords.filter((k) => k.currentRank <= 20)
          break
        case "below20":
          filteredKeywords = filteredKeywords.filter((k) => k.currentRank > 20)
          break
      }
    }

    if (opportunity && opportunity !== "all") {
      filteredKeywords = filteredKeywords.filter((k) => k.opportunity === opportunity)
    }

    return NextResponse.json({
      success: true,
      data: filteredKeywords,
      total: filteredKeywords.length,
      stats: {
        totalKeywords: sampleKeywords.length,
        topTen: sampleKeywords.filter((k) => k.currentRank <= 10).length,
        highOpportunity: sampleKeywords.filter((k) => k.opportunity === "high").length,
        totalClicks: sampleKeywords.reduce((sum, k) => sum + k.clicks, 0),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch keywords" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keywords } = body

    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json({ success: false, error: "Keywords array is required" }, { status: 400 })
    }

    // Process and add keywords to tracking
    const newKeywords = keywords.map((keyword: string) => ({
      id: Date.now().toString() + Math.random(),
      keyword: keyword.trim(),
      currentRank: 0,
      previousRank: 0,
      volume: 0,
      difficulty: 0,
      ctr: 0,
      impressions: 0,
      clicks: 0,
      url: "",
      lastUpdated: new Date().toISOString().split("T")[0],
      trend: "stable",
      opportunity: "medium",
    }))

    // Save to database and start tracking

    return NextResponse.json({
      success: true,
      data: newKeywords,
      message: `${newKeywords.length} keywords added to tracking`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add keywords" }, { status: 500 })
  }
}
