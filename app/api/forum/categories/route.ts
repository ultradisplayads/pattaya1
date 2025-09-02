import { NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function GET() {
  try {
    const response = await fetch(buildApiUrl("forum-activities?populate=*"))

    if (!response.ok) {
      throw new Error("Failed to fetch forum categories")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Forum categories error:", error)
    return NextResponse.json(
      { error: "Failed to fetch forum categories" },
      { status: 500 }
    )
  }
}
