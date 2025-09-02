import { NextRequest, NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "10"

    let strapiUrl = buildApiUrl("forum-activities?populate=*&sort=LastActivity:desc")

    // Add category filter if specified
    if (category && category !== "all") {
      strapiUrl += `&filters[Category][$eq]=${encodeURIComponent(category)}`
    }

    // Add pagination
    strapiUrl += `&pagination[page]=${page}&pagination[pageSize]=${limit}`

    const response = await fetch(strapiUrl)

    if (!response.ok) {
      throw new Error("Failed to fetch forum topics")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Forum topics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch forum topics" },
      { status: 500 }
    )
  }
}
