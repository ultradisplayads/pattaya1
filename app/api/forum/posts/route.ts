import { NextRequest, NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic")
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "20"

    let strapiUrl = buildApiUrl("forum-posts?populate=*&sort=createdAt:asc")

    // Add topic filter if specified
    if (topic) {
      strapiUrl += `&filters[topic][$eq]=${encodeURIComponent(topic)}`
    }

    // Add pagination
    strapiUrl += `&pagination[page]=${page}&pagination[pageSize]=${limit}`

    const response = await fetch(strapiUrl)

    if (!response.ok) {
      throw new Error("Failed to fetch forum posts")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Forum posts error:", error)
    return NextResponse.json(
      { error: "Failed to fetch forum posts" },
      { status: 500 }
    )
  }
}