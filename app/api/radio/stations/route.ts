import { NextResponse } from "next/server"

const mockStations = [
  {
    _id: "1",
    name: "Pattaya FM 103.5",
    streamUrl: "https://stream.example.com/pattaya-fm",
    logoUrl: "/placeholder.svg?height=50&width=50&text=PFM",
    description: "Local Pattaya radio station with news and music",
    genre: "Mixed",
    isActive: true,
    isFeatured: true,
    displayOrder: 1,
    analytics: {
      totalListens: 1250,
      avgListens: 85,
    },
  },
  {
    _id: "2",
    name: "Beach Radio 95.7",
    streamUrl: "https://stream.example.com/beach-radio",
    logoUrl: "/placeholder.svg?height=50&width=50&text=BR",
    description: "Chill beach vibes and tropical sounds",
    genre: "Chill",
    isActive: true,
    isFeatured: false,
    displayOrder: 2,
    analytics: {
      totalListens: 890,
      avgListens: 62,
    },
  },
  {
    _id: "3",
    name: "Thai Pop Radio",
    streamUrl: "https://stream.example.com/thai-pop",
    logoUrl: "/placeholder.svg?height=50&width=50&text=TPR",
    description: "Latest Thai pop hits and classics",
    genre: "Pop",
    isActive: true,
    isFeatured: false,
    displayOrder: 3,
    analytics: {
      totalListens: 2100,
      avgListens: 145,
    },
  },
  {
    _id: "4",
    name: "International Mix",
    streamUrl: "https://stream.example.com/international",
    logoUrl: "/placeholder.svg?height=50&width=50&text=IM",
    description: "International hits from around the world",
    genre: "International",
    isActive: true,
    isFeatured: true,
    displayOrder: 4,
    analytics: {
      totalListens: 1680,
      avgListens: 112,
    },
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Simulate pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedStations = mockStations.slice(startIndex, endIndex)

    return NextResponse.json(paginatedStations)
  } catch (error) {
    console.error("Error fetching radio stations:", error)
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In a real app, you would save to database
    const newStation = {
      _id: Date.now().toString(),
      ...body,
      analytics: {
        totalListens: 0,
        avgListens: 0,
      },
    }

    return NextResponse.json(newStation, { status: 201 })
  } catch (error) {
    console.error("Error creating radio station:", error)
    return NextResponse.json({ error: "Failed to create station" }, { status: 500 })
  }
}
