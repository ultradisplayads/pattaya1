import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter required" }, { status: 400 })
    }

    // In a real implementation, you would check the actual stream status
    // For now, we'll simulate a response
    const isOnline = Math.random() > 0.1 // 90% chance of being online

    return NextResponse.json({
      status: isOnline ? "online" : "offline",
      url: url,
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error checking stream status:", error)
    return NextResponse.json(
      {
        status: "offline",
        error: "Failed to check stream status",
      },
      { status: 500 },
    )
  }
}
