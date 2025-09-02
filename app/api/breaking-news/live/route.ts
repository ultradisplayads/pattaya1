import { NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isBreaking = searchParams.get('IsBreaking')
    
    // Build Strapi query
    let query = "breaking-news-plural?populate=*&sort=PublishedTimestamp:desc"
    if (isBreaking === 'true') {
      query += "&filters[IsBreaking][$eq]=true"
    }
    
    console.log('Fetching breaking news from:', buildApiUrl(query))
    
    const response = await fetch(buildApiUrl(query))
    
    if (!response.ok) {
      console.error('Strapi breaking news API failed:', response.status)
      return NextResponse.json({ error: "Failed to fetch breaking news" }, { status: 500 })
    }
    
    const data = await response.json()
    console.log('Breaking news response:', data)
    
    // Transform Strapi data to expected format
    const transformedNews = data.data?.map((item: any) => ({
      id: item.id.toString(),
      title: item.Title,
      summary: item.Summary,
      category: item.Category,
      severity: item.Severity?.toLowerCase() || 'medium',
      timestamp: item.PublishedTimestamp || item.publishedAt,
      source: item.Source,
      url: item.URL,
      isBreaking: item.IsBreaking || false
    })) || []
    
    return NextResponse.json(transformedNews)
  } catch (error) {
    console.error("Error fetching breaking news:", error)
    return NextResponse.json({ error: "Failed to fetch breaking news" }, { status: 500 })
  }
}
