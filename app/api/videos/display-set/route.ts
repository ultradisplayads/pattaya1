import { type NextRequest, NextResponse } from "next/server"

// Mock video data that matches the widget interface
const mockVideos = [
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
    sponsorLogo: null,
    promotionEndDate: "2024-12-31T23:59:59Z"
  },
  {
    id: "2",
    videoId: "07JgDy7-zaM",
    title: "Best Street Food in Pattaya - Local Guide",
    description: "Discover the most delicious street food spots in Pattaya with our local food expert. From pad thai to mango sticky rice!",
    thumbnailUrl: "https://img.youtube.com/vi/07JgDy7-zaM/hqdefault.jpg",
    channelName: "Pattaya Food Tours",
    publishedAt: "2024-01-14T15:30:00Z",
    viewCount: 89234,
    duration: "18:22",
    isPromoted: false
  },
  {
    id: "3",
    videoId: "dQw4w9WgXcQ",
    title: "Pattaya Nightlife Guide 2024 - Top Bars & Clubs",
    description: "Experience the best of Pattaya's nightlife scene. From rooftop bars to beach clubs, we've got you covered!",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    channelName: "Pattaya Night Scene",
    publishedAt: "2024-01-13T20:00:00Z",
    viewCount: 156789,
    duration: "15:33",
    isPromoted: false
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
    sponsorLogo: null,
    promotionEndDate: "2024-11-30T23:59:59Z"
  },
  {
    id: "5",
    videoId: "xyz789ghi012",
    title: "Pattaya Hotel Review - Luxury Beachfront Resort",
    description: "Comprehensive review of the top luxury beachfront resort in Pattaya. See if it's worth the price!",
    thumbnailUrl: "https://img.youtube.com/vi/xyz789ghi012/hqdefault.jpg",
    channelName: "Travel Reviews Thailand",
    publishedAt: "2024-01-11T09:45:00Z",
    viewCount: 43567,
    duration: "22:17",
    isPromoted: false
  },
  {
    id: "6",
    videoId: "mno345pqr678",
    title: "Pattaya Cultural Sites - Temples & Museums",
    description: "Explore the rich cultural heritage of Pattaya beyond the beaches. Visit beautiful temples and fascinating museums.",
    thumbnailUrl: "https://img.youtube.com/vi/mno345pqr678/hqdefault.jpg",
    channelName: "Thailand Culture Guide",
    publishedAt: "2024-01-10T14:20:00Z",
    viewCount: 32145,
    duration: "16:52",
    isPromoted: false
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get("ids")
    
    let requestedIds: string[] = []
    
    if (idsParam) {
      try {
        requestedIds = JSON.parse(idsParam)
      } catch (error) {
        console.error("Failed to parse ids parameter:", error)
        requestedIds = []
      }
    }
    
    let filteredVideos = [...mockVideos]
    
    // If specific IDs are requested, filter and maintain order
    if (requestedIds.length > 0) {
      const videoMap = new Map(mockVideos.map(video => [video.videoId, video]))
      filteredVideos = requestedIds
        .map(id => videoMap.get(id))
        .filter(video => video !== undefined)
    }
    
    // Sort with promoted videos first
    filteredVideos.sort((a, b) => {
      if (a.isPromoted && !b.isPromoted) return -1
      if (!a.isPromoted && b.isPromoted) return 1
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

    return NextResponse.json({
      success: true,
      data: filteredVideos,
      meta: {
        total: filteredVideos.length,
        promoted: filteredVideos.filter(v => v.isPromoted).length
      }
    })
  } catch (error) {
    console.error("Display set API error:", error)
    return NextResponse.json({
      success: false,
      data: [],
      error: "Failed to fetch video display set"
    }, { status: 500 })
  }
}
