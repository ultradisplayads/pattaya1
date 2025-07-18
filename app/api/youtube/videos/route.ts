import { type NextRequest, NextResponse } from "next/server"

const YOUTUBE_API_KEY = "AIzaSyBkmjNnDGPAC1q84BILQyCbdEBUSzgiVGs"

interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  viewCount: string
  duration: string
  url: string
}

// Mock YouTube video data - in production, this would use the YouTube API
const mockVideos: YouTubeVideo[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Pattaya Beach Walk 2024 - Beautiful Sunset Views",
    description:
      "Take a relaxing walk along Pattaya Beach during golden hour. Experience the vibrant atmosphere and stunning sunset views.",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Beach+Walk",
    channelTitle: "Pattaya1 Official",
    publishedAt: "2024-01-15T10:00:00Z",
    viewCount: "125,430",
    duration: "12:45",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "abc123def456",
    title: "Best Street Food in Pattaya - Local Guide",
    description:
      "Discover the most delicious street food spots in Pattaya with our local food expert. From pad thai to mango sticky rice!",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Street+Food",
    channelTitle: "Pattaya Food Tours",
    publishedAt: "2024-01-14T15:30:00Z",
    viewCount: "89,234",
    duration: "18:22",
    url: "https://youtube.com/watch?v=abc123def456",
  },
  {
    id: "xyz789ghi012",
    title: "Pattaya Nightlife Guide 2024 - Top Bars & Clubs",
    description:
      "Experience the best of Pattaya's nightlife scene. From rooftop bars to beach clubs, we've got you covered!",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Nightlife",
    channelTitle: "Pattaya Night Scene",
    publishedAt: "2024-01-13T20:00:00Z",
    viewCount: "156,789",
    duration: "15:33",
    url: "https://youtube.com/watch?v=xyz789ghi012",
  },
  {
    id: "mno345pqr678",
    title: "Pattaya Water Sports Adventure - Jet Ski & Parasailing",
    description:
      "Get your adrenaline pumping with exciting water sports activities in Pattaya. Perfect for thrill seekers!",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Water+Sports",
    channelTitle: "Pattaya Adventures",
    publishedAt: "2024-01-12T12:15:00Z",
    viewCount: "67,891",
    duration: "10:28",
    url: "https://youtube.com/watch?v=mno345pqr678",
  },
  {
    id: "stu901vwx234",
    title: "Pattaya Hotel Review - Luxury Beachfront Resort",
    description: "Comprehensive review of the top luxury beachfront resort in Pattaya. See if it's worth the price!",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Hotel+Review",
    channelTitle: "Travel Reviews Thailand",
    publishedAt: "2024-01-11T09:45:00Z",
    viewCount: "43,567",
    duration: "22:17",
    url: "https://youtube.com/watch?v=stu901vwx234",
  },
  {
    id: "def567ghi890",
    title: "Pattaya Cultural Sites - Temples & Museums",
    description:
      "Explore the rich cultural heritage of Pattaya beyond the beaches. Visit beautiful temples and fascinating museums.",
    thumbnail: "/placeholder.svg?height=180&width=320&text=Culture",
    channelTitle: "Thailand Culture Guide",
    publishedAt: "2024-01-10T14:20:00Z",
    viewCount: "32,145",
    duration: "16:52",
    url: "https://youtube.com/watch?v=def567ghi890",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "6")
    const category = searchParams.get("category") || "all"
    const channelId = searchParams.get("channelId")

    let filteredVideos = [...mockVideos]

    // Filter by channel if specified
    if (channelId) {
      filteredVideos = filteredVideos.filter((video) =>
        video.channelTitle.toLowerCase().includes(channelId.toLowerCase()),
      )
    }

    // Filter by category if specified
    if (category !== "all") {
      filteredVideos = filteredVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(category.toLowerCase()) ||
          video.description.toLowerCase().includes(category.toLowerCase()),
      )
    }

    // Sort by published date (newest first)
    filteredVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    // Limit results
    const limitedVideos = filteredVideos.slice(0, limit)

    return NextResponse.json({
      videos: limitedVideos,
      total: filteredVideos.length,
      hasMore: filteredVideos.length > limit,
      categories: ["all", "beach", "food", "nightlife", "adventure", "culture", "hotels"],
      channels: [
        { id: "pattaya1", name: "Pattaya1 Official", subscribers: "125K" },
        { id: "food-tours", name: "Pattaya Food Tours", subscribers: "89K" },
        { id: "night-scene", name: "Pattaya Night Scene", subscribers: "156K" },
        { id: "adventures", name: "Pattaya Adventures", subscribers: "67K" },
        { id: "travel-reviews", name: "Travel Reviews Thailand", subscribers: "234K" },
        { id: "culture-guide", name: "Thailand Culture Guide", subscribers: "98K" },
      ],
    })
  } catch (error) {
    console.error("YouTube API error:", error)
    return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, videoId, data } = body

    if (action === "track-view" && videoId) {
      // Track video view - in production, this would update analytics
      console.log(`Video view tracked: ${videoId}`)
      return NextResponse.json({ success: true, message: "View tracked" })
    }

    if (action === "add-to-playlist" && videoId && data?.playlistId) {
      // Add video to playlist - in production, this would update the database
      console.log(`Video ${videoId} added to playlist ${data.playlistId}`)
      return NextResponse.json({ success: true, message: "Added to playlist" })
    }

    if (action === "report" && videoId && data?.reason) {
      // Report video - in production, this would create a report record
      console.log(`Video ${videoId} reported for: ${data.reason}`)
      return NextResponse.json({ success: true, message: "Report submitted" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("YouTube API action error:", error)
    return NextResponse.json({ error: "Failed to process YouTube action" }, { status: 500 })
  }
}
