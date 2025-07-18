import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    // AI-powered suggestions based on Pattaya area
    const allSuggestions = [
      { id: "1", text: "Restaurants in Pattaya Beach", type: "category", icon: "🍽️" },
      { id: "2", text: "Jomtien Beach activities", type: "location", icon: "🏖️" },
      { id: "3", text: "Walking Street nightlife", type: "location", icon: "🌃" },
      { id: "4", text: "Central Festival shopping", type: "business", icon: "🛍️" },
      { id: "5", text: "Sanctuary of Truth tours", type: "business", icon: "🏛️" },
      { id: "6", text: "Thai massage in Pattaya", type: "category", icon: "💆" },
      { id: "7", text: "Floating market Chonburi", type: "location", icon: "🛶" },
      { id: "8", text: "Nong Nooch Garden", type: "business", icon: "🌺" },
      { id: "9", text: "Hotels near Beach Road", type: "category", icon: "🏨" },
      { id: "10", text: "Pattaya viewpoints", type: "category", icon: "🏔️" },
      { id: "11", text: "Seafood restaurants Jomtien", type: "category", icon: "🦐" },
      { id: "12", text: "Cabaret shows Pattaya", type: "category", icon: "🎭" },
    ]

    // Filter suggestions based on query
    const filteredSuggestions = query
      ? allSuggestions.filter((suggestion) => suggestion.text.toLowerCase().includes(query.toLowerCase()))
      : allSuggestions.slice(0, 6)

    return NextResponse.json({
      success: true,
      suggestions: filteredSuggestions.slice(0, 8),
      query,
    })
  } catch (error) {
    console.error("Suggestions error:", error)
    return NextResponse.json({ success: false, error: "Failed to load suggestions" }, { status: 500 })
  }
}
