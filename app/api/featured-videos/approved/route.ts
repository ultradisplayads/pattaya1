import { type NextRequest, NextResponse } from "next/server"

// Mock approved videos data
const approvedVideos = [
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
    approvalStatus: "approved",
    approvedAt: "2024-01-15T08:00:00Z"
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
    isPromoted: false,
    approvalStatus: "approved",
    approvedAt: "2024-01-14T14:00:00Z"
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
    isPromoted: false,
    approvalStatus: "approved",
    approvedAt: "2024-01-13T18:00:00Z"
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
    approvalStatus: "approved",
    approvedAt: "2024-01-12T10:00:00Z"
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
    isPromoted: false,
    approvalStatus: "approved",
    approvedAt: "2024-01-11T08:00:00Z"
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
    isPromoted: false,
    approvalStatus: "approved",
    approvedAt: "2024-01-10T12:00:00Z"
  },
  {
    id: "7",
    videoId: "def567ghi890",
    title: "Pattaya Shopping Guide - Best Markets & Malls",
    description: "Complete shopping guide to Pattaya's best markets, malls, and local shops. Find the best deals and unique items!",
    thumbnailUrl: "https://img.youtube.com/vi/def567ghi890/hqdefault.jpg",
    channelName: "Pattaya Shopping Guide",
    publishedAt: "2024-01-09T16:30:00Z",
    viewCount: 28456,
    duration: "14:18",
    isPromoted: false,
    approvalStatus: "approved",
    approvedAt: "2024-01-09T14:00:00Z"
  },
  {
    id: "8",
    videoId: "jkl012mno345",
    title: "Pattaya Floating Market Tour - Traditional Thai Experience",
    description: "Experience authentic Thai culture at Pattaya's floating market. Traditional food, crafts, and boat rides!",
    thumbnailUrl: "https://img.youtube.com/vi/jkl012mno345/hqdefault.jpg",
    channelName: "Thai Culture Explorer",
    publishedAt: "2024-01-08T11:20:00Z",
    viewCount: 45678,
    duration: "19:45",
    isPromoted: false,
    approvalStatus: "approved",
    approvedAt: "2024-01-08T09:00:00Z"
  },
  {
    id: "9",
    videoId: "pqr678stu901",
    title: "Pattaya Fitness & Wellness Centers - Stay Healthy on Vacation",
    description: "Maintain your fitness routine while in Pattaya. Review of the best gyms, spas, and wellness centers.",
    thumbnailUrl: "https://img.youtube.com/vi/pqr678stu901/hqdefault.jpg",
    channelName: "Healthy Travel Thailand",
    publishedAt: "2024-01-07T13:45:00Z",
    viewCount: 19234,
    duration: "11:32",
    isPromoted: false,
    approvalStatus: "approved",
    approvedAt: "2024-01-07T11:00:00Z"
  },
  {
    id: "10",
    videoId: "vwx234yza567",
    title: "Pattaya Transportation Guide - Getting Around Like a Local",
    description: "Master Pattaya's transportation system. From songthaews to motorbike taxis, learn the best ways to get around!",
    thumbnailUrl: "https://img.youtube.com/vi/vwx234yza567/hqdefault.jpg",
    channelName: "Pattaya Travel Tips",
    publishedAt: "2024-01-06T15:10:00Z",
    viewCount: 37892,
    duration: "13:27",
    isPromoted: false,
    approvalStatus: "approved",
    approvedAt: "2024-01-06T13:00:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "12")
    const category = searchParams.get("category") || "all"
    
    let filteredVideos = [...approvedVideos]
    
    // Filter by category if specified
    if (category !== "all") {
      filteredVideos = filteredVideos.filter(video =>
        video.title.toLowerCase().includes(category.toLowerCase()) ||
        video.description.toLowerCase().includes(category.toLowerCase())
      )
    }
    
    // Sort by approval date (newest first)
    filteredVideos.sort((a, b) => new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime())
    
    // Pagination
    const total = filteredVideos.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedVideos,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error("Approved videos API error:", error)
    return NextResponse.json({
      success: false,
      data: [],
      error: "Failed to fetch approved videos"
    }, { status: 500 })
  }
}
