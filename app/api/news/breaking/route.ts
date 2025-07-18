import { NextResponse } from "next/server"

const mockBreakingNews = [
  {
    id: "1",
    title: "New Beach Safety Measures Implemented in Pattaya",
    summary:
      "Pattaya Beach introduces enhanced safety protocols including new lifeguard stations and warning systems for tourist safety.",
    category: "Safety",
    severity: "medium" as const,
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    source: "Pattaya News",
    url: "https://example.com/news/beach-safety",
  },
  {
    id: "2",
    title: "Traffic Alert: Walking Street Temporary Closure",
    summary:
      "Walking Street will be temporarily closed for emergency maintenance work until 6 PM today. Alternative routes available.",
    category: "Traffic",
    severity: "high" as const,
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
    source: "Traffic Authority",
    url: "https://example.com/news/walking-street-closure",
  },
  {
    id: "3",
    title: "Weather Warning: Heavy Rain Expected",
    summary:
      "Meteorological department issues warning for heavy rainfall in Pattaya area this evening. Residents advised to take precautions.",
    category: "Weather",
    severity: "high" as const,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    source: "Weather Service",
    url: "https://example.com/news/weather-warning",
  },
  {
    id: "4",
    title: "New Tourist Information Center Opens",
    summary:
      "A new state-of-the-art tourist information center has opened near Central Festival, offering multilingual support.",
    category: "Tourism",
    severity: "low" as const,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    source: "Tourism Board",
    url: "https://example.com/news/tourist-center",
  },
  {
    id: "5",
    title: "Festival Announcement: Pattaya Music Festival 2024",
    summary: "Annual Pattaya Music Festival announced for next month featuring international and local artists.",
    category: "Events",
    severity: "low" as const,
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    source: "Event Organizers",
    url: "https://example.com/news/music-festival",
  },
]

export async function GET() {
  try {
    // Sort by timestamp (newest first)
    const sortedNews = mockBreakingNews.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return NextResponse.json(sortedNews)
  } catch (error) {
    console.error("Error fetching breaking news:", error)
    return NextResponse.json({ error: "Failed to fetch breaking news" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newNews = {
      id: Date.now().toString(),
      ...body,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(newNews, { status: 201 })
  } catch (error) {
    console.error("Error creating breaking news:", error)
    return NextResponse.json({ error: "Failed to create news item" }, { status: 500 })
  }
}
