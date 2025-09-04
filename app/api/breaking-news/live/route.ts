import { NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isBreaking = searchParams.get('IsBreaking')
    
    // Fetch breaking news
    let newsQuery = "breaking-news-plural?populate=*&sort=PublishedTimestamp:desc"
    if (isBreaking === 'true') {
      newsQuery += "&filters[IsBreaking][$eq]=true"
    }
    
    console.log('Fetching breaking news from:', buildApiUrl(newsQuery))
    
    const newsResponse = await fetch(buildApiUrl(newsQuery))
    let newsData = []
    
    if (newsResponse.ok) {
      const newsResult = await newsResponse.json()
      newsData = newsResult.data?.map((item: any) => ({
        id: item.id.toString(),
        title: item.Title,
        summary: item.Summary,
        category: item.Category,
        severity: item.Severity?.toLowerCase() || 'medium',
        timestamp: item.PublishedTimestamp || item.publishedAt,
        source: item.Source,
        url: item.URL,
        isBreaking: item.IsBreaking || false,
        type: item.SponsoredPost ? 'sponsored' : 'news',
        ...(item.SponsoredPost && {
          sponsorName: item.SponsorName || 'Sponsored',
          sponsorLogo: item.SponsorLogo,
          displayPosition: item.DisplayPosition || 'position-3'
        })
      })) || []
    }
    
    // Create sponsored posts with proper sponsor names
    let sponsoredData = []
    try {
      const sponsoredResponse = await fetch(buildApiUrl("sponsored-posts?populate=*&filters[IsActive][$eq]=true"))
      if (sponsoredResponse.ok) {
        const sponsoredResult = await sponsoredResponse.json()
        sponsoredData = sponsoredResult.data?.map((item: any) => ({
          id: item.id.toString(),
          title: item.Title,
          summary: item.Summary,
          category: "Sponsored",
          severity: 'medium',
          timestamp: item.publishedAt,
          source: item.Sponsor || item.SponsorName || 'Sponsored Content',
          url: item.URL || '#',
          isBreaking: false,
          type: 'sponsored',
          sponsorName: item.Sponsor || item.SponsorName || 'Sponsored',
          sponsorLogo: item.SponsorLogo,
          displayPosition: item.DisplayPosition || 'position-3',
          impressionCount: item.ImpressionCount || 0,
          clickCount: item.ClickCount || 0
        })) || []
      }
    } catch (error) {
      // Sponsored posts not available
    }
    
    
    // Mix content based on display positions
    const mixedContent = [...newsData]
    
    // Insert sponsored posts at specified positions
    sponsoredData.forEach((sponsoredPost: any) => {
      const position = sponsoredPost.displayPosition
      if (position === 'top') {
        mixedContent.unshift(sponsoredPost)
      } else if (position === 'bottom') {
        mixedContent.push(sponsoredPost)
      } else if (position.startsWith('position-')) {
        const pos = parseInt(position.split('-')[1]) - 1
        if (pos >= 0 && pos < mixedContent.length) {
          mixedContent.splice(pos, 0, sponsoredPost)
        } else {
          mixedContent.push(sponsoredPost)
        }
      }
    })
    
    // Calculate metadata
    const newsCount = mixedContent.filter(item => item.type === 'news').length
    const sponsoredCount = mixedContent.filter(item => item.type === 'sponsored').length
    const breakingCount = mixedContent.filter(item => item.isBreaking).length
    
    const response = {
      data: mixedContent,
      meta: {
        total: mixedContent.length,
        newsCount,
        sponsoredCount,
        breakingCount
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching mixed content:", error)
    return NextResponse.json({ error: "Failed to fetch mixed content" }, { status: 500 })
  }
}
