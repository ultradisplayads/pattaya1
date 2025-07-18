import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { query, location, useAI } = await request.json()

    // Simulate Gemini AI-powered search results for Pattaya area
    const allResults = [
      {
        id: "ocean-view-restaurant",
        title: "Ocean View Restaurant",
        description: "Authentic Thai cuisine with stunning ocean views and fresh seafood",
        category: "Restaurant",
        location: "Pattaya Beach Road",
        rating: 5,
        image: "/placeholder.svg?height=200&width=300&text=Ocean+View+Restaurant",
        distance: 0.5,
        isOpen: true,
        verified: true,
        relevanceScore: 0.95,
      },
      {
        id: "sanctuary-of-truth",
        title: "Sanctuary of Truth",
        description: "Magnificent wooden temple showcasing traditional Thai architecture",
        category: "Tourist Attraction",
        location: "Naklua, Pattaya",
        rating: 5,
        image: "/placeholder.svg?height=200&width=300&text=Sanctuary+of+Truth",
        distance: 8.2,
        isOpen: true,
        verified: true,
        relevanceScore: 0.92,
      },
      {
        id: "jomtien-beach",
        title: "Jomtien Beach",
        description: "Peaceful beach perfect for families with clean water and great restaurants",
        category: "Beach",
        location: "Jomtien, Pattaya",
        rating: 4,
        image: "/placeholder.svg?height=200&width=300&text=Jomtien+Beach",
        distance: 5.1,
        isOpen: true,
        verified: true,
        relevanceScore: 0.88,
      },
      {
        id: "central-festival",
        title: "Central Festival Pattaya",
        description: "Premier shopping destination with international brands and dining",
        category: "Shopping Mall",
        location: "Beach Road, Pattaya",
        rating: 4,
        image: "/placeholder.svg?height=200&width=300&text=Central+Festival",
        distance: 1.8,
        isOpen: true,
        verified: true,
        relevanceScore: 0.85,
      },
      {
        id: "walking-street",
        title: "Walking Street",
        description: "Famous entertainment district with vibrant nightlife and dining",
        category: "Entertainment",
        location: "South Pattaya",
        rating: 4,
        image: "/placeholder.svg?height=200&width=300&text=Walking+Street",
        distance: 2.3,
        isOpen: true,
        verified: true,
        relevanceScore: 0.82,
      },
      {
        id: "nong-nooch-garden",
        title: "Nong Nooch Tropical Garden",
        description: "Beautiful botanical garden with cultural shows and elephant performances",
        category: "Tourist Attraction",
        location: "Chonburi",
        rating: 5,
        image: "/placeholder.svg?height=200&width=300&text=Nong+Nooch+Garden",
        distance: 15.7,
        isOpen: true,
        verified: true,
        relevanceScore: 0.78,
      },
    ]

    // AI-powered filtering based on query relevance
    let filteredResults = allResults

    if (query && query.trim()) {
      const queryLower = query.toLowerCase()
      filteredResults = allResults
        .filter((result) => {
          const searchText = `${result.title} ${result.description} ${result.category} ${result.location}`.toLowerCase()
          return searchText.includes(queryLower)
        })
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
    }

    // Ensure results are from Pattaya/Jomtien/Chonburi area
    const locationKeywords = ["pattaya", "jomtien", "chonburi", "naklua"]
    filteredResults = filteredResults.filter((result) =>
      locationKeywords.some((keyword) => result.location.toLowerCase().includes(keyword)),
    )

    return NextResponse.json({
      success: true,
      results: filteredResults.slice(0, 10),
      query,
      location,
      aiProcessed: useAI,
      totalResults: filteredResults.length,
    })
  } catch (error) {
    console.error("AI search error:", error)
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 })
  }
}
