import { type NextRequest, NextResponse } from "next/server"

// Mock promoted videos data
const promotedVideos = [
  {
    id: "1",
    videoId: "YIbbFLRd3cY",
    title: "Pattaya Beach Walk 2024 - Beautiful Sunset Views",
    description: "Take a relaxing walk along Pattaya Beach during golden hour. Experience the vibrant atmosphere and stunning sunset views.",
    thumbnailUrl: "https://img.youtube.com/vi/YIbbFLRd3cY/hqdefault.jpg",
    channelName: "Pattaya1 Official",
    publishedAt: "2024-01-15T10:00:00Z",
    viewCount: 125430,
    duration: "12:45",
    isPromoted: true,
    sponsorName: "Pattaya Beach Resort",
    sponsorLogo: "https://example.com/logos/beach-resort.png",
    promotionStartDate: "2024-01-01T00:00:00Z",
    promotionEndDate: "2025-12-31T23:59:59Z",
    promotionBudget: 5000,
    promotionType: "featured"
  },
  {
    id: "4",
    videoId: "abc123def456",
    title: "Pattaya Water Sports Adventure - Jet Ski & Parasailing",
    description: "Get your adrenaline pumping with exciting water sports activities in Pattaya. Perfect for thrill seekers!",
    thumbnailUrl: "https://img.youtube.com/vi/abc123def456/hqdefault.jpg",
    channelName: "Pattaya Adventures",
    publishedAt: "2024-01-12T12:15:00Z",
    viewCount: 67891,
    duration: "10:28",
    isPromoted: true,
    sponsorName: "Adventure Sports Pattaya",
    sponsorLogo: "https://example.com/logos/adventure-sports.png",
    promotionStartDate: "2024-01-01T00:00:00Z",
    promotionEndDate: "2025-11-30T23:59:59Z",
    promotionBudget: 3000,
    promotionType: "sponsored"
  },
  {
    id: "11",
    videoId: "bcd890efg123",
    title: "Luxury Spa Experience in Pattaya - Ultimate Relaxation",
    description: "Indulge in world-class spa treatments at Pattaya's most luxurious wellness centers. Perfect for couples and solo travelers.",
    thumbnailUrl: "https://img.youtube.com/vi/bcd890efg123/hqdefault.jpg",
    channelName: "Pattaya Wellness Guide",
    publishedAt: "2024-01-05T14:30:00Z",
    viewCount: 52341,
    duration: "16:42",
    isPromoted: true,
    sponsorName: "Serenity Spa Pattaya",
    sponsorLogo: "https://example.com/logos/serenity-spa.png",
    promotionStartDate: "2024-01-01T00:00:00Z",
    promotionEndDate: "2025-10-31T23:59:59Z",
    promotionBudget: 2500,
    promotionType: "premium"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("activeOnly") !== "false"
    const promotionType = searchParams.get("type") // featured, sponsored, premium
    
    let filteredVideos = [...promotedVideos]
    
    // Filter by active promotions only
    if (activeOnly) {
      const now = new Date()
      filteredVideos = filteredVideos.filter(video => {
        const startDate = new Date(video.promotionStartDate)
        const endDate = new Date(video.promotionEndDate)
        return now >= startDate && now <= endDate
      })
    }
    
    // Filter by promotion type if specified
    if (promotionType) {
      filteredVideos = filteredVideos.filter(video => 
        video.promotionType === promotionType
      )
    }
    
    // Sort by promotion budget (highest first) then by start date
    filteredVideos.sort((a, b) => {
      if (a.promotionBudget !== b.promotionBudget) {
        return b.promotionBudget - a.promotionBudget
      }
      return new Date(b.promotionStartDate).getTime() - new Date(a.promotionStartDate).getTime()
    })

    return NextResponse.json({
      success: true,
      data: filteredVideos,
      meta: {
        total: filteredVideos.length,
        activePromotions: filteredVideos.filter(v => {
          const now = new Date()
          const startDate = new Date(v.promotionStartDate)
          const endDate = new Date(v.promotionEndDate)
          return now >= startDate && now <= endDate
        }).length,
        totalBudget: filteredVideos.reduce((sum, v) => sum + v.promotionBudget, 0),
        promotionTypes: ["featured", "sponsored", "premium"]
      }
    })
  } catch (error) {
    console.error("Promoted videos API error:", error)
    return NextResponse.json({
      success: false,
      data: [],
      error: "Failed to fetch promoted videos"
    }, { status: 500 })
  }
}
