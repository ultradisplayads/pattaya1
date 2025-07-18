import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { action, location, content } = await request.json()

    // Simulate Gemini AI moderation for Pattaya content
    const moderationResult = {
      action,
      location,
      timestamp: new Date().toISOString(),
      status: "active",
      filtered: 0,
      approved: 0,
      locationRelevant: true,
    }

    switch (action) {
      case "initialize":
        moderationResult.status = "initialized"
        moderationResult.approved = 100
        break

      case "refresh":
        moderationResult.filtered = Math.floor(Math.random() * 5)
        moderationResult.approved = Math.floor(Math.random() * 20) + 10
        break

      case "moderate":
        // Check if content is relevant to Pattaya/Jomtien/Chonburi
        const pattayaKeywords = [
          "pattaya",
          "jomtien",
          "chonburi",
          "walking street",
          "beach road",
          "central festival",
          "sanctuary of truth",
          "nong nooch",
          "floating market",
          "thailand",
          "thai",
        ]

        const isRelevant = pattayaKeywords.some((keyword) => content?.toLowerCase().includes(keyword.toLowerCase()))

        moderationResult.locationRelevant = isRelevant
        moderationResult.approved = isRelevant ? 1 : 0
        moderationResult.filtered = isRelevant ? 0 : 1
        break
    }

    return NextResponse.json({
      success: true,
      moderation: moderationResult,
    })
  } catch (error) {
    console.error("Gemini moderation error:", error)
    return NextResponse.json({ success: false, error: "Moderation failed" }, { status: 500 })
  }
}
