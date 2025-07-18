import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real implementation, this would aggregate from multiple news APIs
    // For now, we'll return mock data that represents aggregated news

    const articles = [
      {
        id: "1",
        title: "Pattaya Tourism Numbers Surge 40% This Quarter",
        summary:
          "International visitors continue to flock to Pattaya as travel restrictions ease globally. The city sees record-breaking numbers in hotel occupancy and tourist activities.",
        source: "Bangkok Post",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        url: "https://example.com/news/tourism-surge",
        image: "/placeholder.svg?height=200&width=300&text=Tourism+Surge",
        category: "tourism",
        trending: true,
        readTime: "3 min read",
      },
      {
        id: "2",
        title: "New High-Speed Rail Link to Pattaya Approved",
        summary:
          "Government approves major infrastructure project connecting Bangkok to Pattaya, expected to reduce travel time to 45 minutes.",
        source: "The Nation",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        url: "https://example.com/news/rail-link",
        image: "/placeholder.svg?height=200&width=300&text=Rail+Link",
        category: "infrastructure",
        trending: true,
        readTime: "5 min read",
      },
      {
        id: "3",
        title: "Pattaya Beach Restoration Project Completed",
        summary:
          "Major beach restoration brings pristine sand and improved facilities to central beach area, enhancing the visitor experience.",
        source: "Pattaya Mail",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        url: "https://example.com/news/beach-restoration",
        image: "/placeholder.svg?height=200&width=300&text=Beach+Restoration",
        category: "environment",
        trending: false,
        readTime: "4 min read",
      },
      {
        id: "4",
        title: "International Food Festival Returns to Pattaya",
        summary:
          "World-class chefs gather for the annual culinary celebration featuring global cuisines and local Thai specialties.",
        source: "Thaiger",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        url: "https://example.com/news/food-festival",
        image: "/placeholder.svg?height=200&width=300&text=Food+Festival",
        category: "events",
        trending: false,
        readTime: "2 min read",
      },
      {
        id: "5",
        title: "New Luxury Resort Opens on Jomtien Beach",
        summary:
          "Five-star resort brings world-class amenities and sustainable tourism practices to the popular beach destination.",
        source: "Travel Weekly",
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        url: "https://example.com/news/luxury-resort",
        image: "/placeholder.svg?height=200&width=300&text=Luxury+Resort",
        category: "hospitality",
        trending: false,
        readTime: "6 min read",
      },
      {
        id: "6",
        title: "Pattaya Implements Smart City Technology",
        summary:
          "New IoT sensors and smart traffic systems being deployed across the city to improve urban management and visitor experience.",
        source: "Tech in Asia",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        url: "https://example.com/news/smart-city",
        image: "/placeholder.svg?height=200&width=300&text=Smart+City",
        category: "technology",
        trending: true,
        readTime: "7 min read",
      },
      {
        id: "7",
        title: "Marine Conservation Efforts Show Positive Results",
        summary:
          "Coral reef restoration and marine protection initiatives in Pattaya waters showing significant improvement in biodiversity.",
        source: "Environmental News",
        publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
        url: "https://example.com/news/marine-conservation",
        image: "/placeholder.svg?height=200&width=300&text=Marine+Conservation",
        category: "environment",
        trending: false,
        readTime: "5 min read",
      },
      {
        id: "8",
        title: "Digital Nomad Visa Program Expands",
        summary:
          "Thailand extends digital nomad visa program with new benefits for remote workers choosing Pattaya as their base.",
        source: "Digital Nomad News",
        publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
        url: "https://example.com/news/digital-nomad",
        image: "/placeholder.svg?height=200&width=300&text=Digital+Nomad",
        category: "lifestyle",
        trending: true,
        readTime: "4 min read",
      },
    ]

    return NextResponse.json({
      articles,
      lastUpdated: new Date().toISOString(),
      sources: ["Bangkok Post", "The Nation", "Pattaya Mail", "Thaiger", "Travel Weekly"],
    })
  } catch (error) {
    console.error("Error fetching aggregated news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
