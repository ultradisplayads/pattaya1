import { NextRequest, NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function POST(request: NextRequest) {
  try {
    console.log('🔥 Frontend API route called')
    console.log('🔥 Request headers:', Object.fromEntries(request.headers.entries()))
    
    const body = await request.json()
    console.log('🔥 Request body:', body)
    
    // Validate required fields
    if (!body.title || !body.content || !body.category) {
      console.log('🔥 Missing required fields')
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      )
    }

    // Get Firebase token from request headers
    const authHeader = request.headers.get('authorization')
    console.log('🔥 Auth header:', authHeader)
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🔥 No valid auth header found')
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const firebaseToken = authHeader.replace('Bearer ', '')
    console.log('🔥 Firebase token extracted:', firebaseToken.substring(0, 50) + '...')

    // Create new forum topic
    const strapiUrl = buildApiUrl("forum-topics")
    console.log('🔥 Strapi URL:', strapiUrl)
    
    const requestBody = {
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || body.content.substring(0, 200),
        category: body.category,
        // Don't send author - let the backend set it from the authenticated user
        tags: body.tags || [],
        attachments: body.attachments || []
      }
    }
    console.log('🔥 Request body to Strapi:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch(strapiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firebaseToken}`
      },
      body: JSON.stringify(requestBody)
    })

    console.log('🔥 Strapi response status:', response.status)
    console.log('🔥 Strapi response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorData = await response.json()
      console.log('🔥 Strapi error response:', errorData)
      return NextResponse.json(
        { error: errorData.message || "Failed to create topic" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error("Forum topic creation error:", error)
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    )
  }
}
