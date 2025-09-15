import { NextRequest, NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.data?.content || !body.data?.topic) {
      return NextResponse.json(
        { error: "Content and topic are required" },
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

    // Forward the request to Strapi
    const strapiUrl = buildApiUrl("forum-posts")
    const response = await fetch(strapiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Strapi error:", errorData)
      return NextResponse.json(
        { error: "Failed to create forum post" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Forum post creation error:", error)
    return NextResponse.json(
      { error: "Failed to create forum post" },
      { status: 500 }
    )
  }
}