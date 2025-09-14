import { NextRequest, NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = searchParams.get("limit") || "5"

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] })
    }

    // Search users in Strapi
    const strapiUrl = buildApiUrl(`users?filters[username][$containsi]=${encodeURIComponent(query)}&pagination[limit]=${limit}`)

    const response = await fetch(strapiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error("Failed to search users")
    }

    const data = await response.json()
    
    // Transform Strapi user data to our format
    const users = data.data?.map((user: any) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar?.url || null
    })) || []

    return NextResponse.json({ users })

  } catch (error) {
    console.error("User search error:", error)
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    )
  }
}
