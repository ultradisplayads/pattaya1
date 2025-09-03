import { NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Send analytics data to Strapi
    const response = await fetch(buildApiUrl("analytics-events"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          action: body.action,
          category: body.category,
          label: body.label,
          value: body.value || 0,
          postId: body.postId,
          sponsorName: body.sponsorName,
          url: body.url,
          timestamp: body.timestamp,
          userAgent: body.userAgent,
          referrer: body.referrer,
          sessionId: body.sessionId || 'anonymous'
        }
      })
    })

    if (!response.ok) {
      console.error('Failed to save analytics to Strapi:', response.status)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
