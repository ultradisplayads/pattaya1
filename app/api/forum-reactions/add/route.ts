import { NextRequest, NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function POST(request: NextRequest) {
  try {
    const { type, postId, topicId } = await request.json()

    if (!type || (!postId && !topicId)) {
      return NextResponse.json(
        { error: "Reaction type and target (post or topic) are required" },
        { status: 400 }
      )
    }

    const validTypes = ['like', 'love', 'laugh', 'wow', 'sad', 'angry']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      )
    }

    // Get the authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      )
    }

    // Forward request to Strapi backend
    const strapiUrl = buildApiUrl('forum-reactions/add')
    
    const response = await fetch(strapiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        type,
        postId,
        topicId
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || "Failed to add reaction" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error("Forum reaction error:", error)
    return NextResponse.json(
      { error: "Failed to add reaction" },
      { status: 500 }
    )
  }
}
