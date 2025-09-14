import { NextRequest, NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: topicId } = await params
    const strapiUrl = buildApiUrl(`forum-topics/${topicId}?populate=*`)

    const response = await fetch(strapiUrl)

    if (!response.ok) {
      throw new Error("Failed to fetch forum topic")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Forum topic error:", error)
    return NextResponse.json(
      { error: "Failed to fetch forum topic" },
      { status: 500 }
    )
  }
}
