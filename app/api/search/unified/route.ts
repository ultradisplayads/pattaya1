import { NextResponse } from "next/server"

interface SearchHit {
  title: string
  content: string
  source: string
  category: string
  url: string
  contentType: string
  publishedAt: string
  featuredImage?: string
  isBreaking?: boolean
  severity?: string
  sponsorName?: string
  type?: string
}

// All supported content types
const CONTENT_TYPES = [
  // News & Content
  'breaking-news', 'news-article', 'sponsored-post', 'social-media-post',
  
  // Business & Commerce  
  'business', 'business-spotlight', 'deal', 'advertisement', 'review', 'google-review',
  
  // Events & Entertainment
  'event', 'event-calendar', 'live-event', 'radio-station', 'youtube-video',
  
  // Travel & Local
  'booking', 'traffic-incident', 'traffic-route', 'weather', 'weather-activity-suggestion',
  
  // Content Organization
  'author', 'category', 'photo-gallery', 'trending-topic',
  
  // System & Configuration
  'about', 'global', 'global-sponsorship', 'quick-link', 'widget-control',
  
  // Community
  'forum-activity'
]

// Map content types to Strapi collection names
const STRAPI_COLLECTIONS = {
  'breaking-news': 'breaking-news-plural',
  'sponsored-post': 'sponsored-posts',
  'business': 'businesses',
  'event': 'events',
  'review': 'reviews',
  'deal': 'deals',
  'booking': 'bookings',
  'photo-gallery': 'photo-galleries',
  'youtube-video': 'youtube-videos',
  'radio-station': 'radio-stations',
  'live-event': 'live-events',
  'traffic-incident': 'traffic-incidents',
  'weather': 'weather-data',
  'forum-activity': 'forum-activities',
  'google-review': 'google-reviews',
  'quick-link': 'quick-links',
  'trending-topic': 'trending-topics'
}

async function fetchFromStrapi(collection: string, contentType: string): Promise<any[]> {
  try {
    const response = await fetch(`http://localhost:1337/api/${collection}?populate=*&pagination[limit]=100`, {
      headers: { 'Accept': 'application/json' }
    })
    
    if (!response.ok) return []
    
    const result = await response.json()
    return result.data?.map((item: any) => normalizeItem(item, contentType)) || []
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error)
    return []
  }
}

function normalizeItem(item: any, contentType: string): SearchHit {
  const attrs = item.attributes || item
  
  // Common field mappings
  const baseItem = {
    title: attrs.Title || attrs.Name || attrs.title || attrs.name || 'Untitled',
    content: attrs.Summary || attrs.Content || attrs.Description || attrs.content || '',
    source: attrs.Source || attrs.Sponsor || attrs.Author || attrs.source || 'Unknown',
    category: attrs.Category || attrs.Type || attrs.category || contentType,
    url: attrs.URL || attrs.Link || attrs.url || '#',
    contentType,
    publishedAt: attrs.PublishedTimestamp || attrs.createdAt || attrs.publishedAt || new Date().toISOString(),
    featuredImage: attrs.ImageURL || attrs.Image?.url || attrs.featuredImage || attrs.image,
    type: contentType
  }

  // Content-type specific mappings
  switch (contentType) {
    case 'breaking-news':
      return {
        ...baseItem,
        isBreaking: attrs.IsBreaking || false,
        severity: attrs.Severity || 'medium'
      }
    case 'sponsored-post':
      return {
        ...baseItem,
        sponsorName: attrs.Sponsor || attrs.sponsorName,
        severity: 'low'
      }
    case 'business':
      return {
        ...baseItem,
        content: attrs.Description || attrs.Summary || '',
        category: 'Business'
      }
    case 'event':
      return {
        ...baseItem,
        content: attrs.Description || attrs.Summary || '',
        category: 'Event'
      }
    default:
      return baseItem
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const page = parseInt(searchParams.get("page") || "0")
    const hitsPerPage = parseInt(searchParams.get("hitsPerPage") || "20")
    const filters = searchParams.get("filters") || ""
    const contentTypeFilter = searchParams.get("contentType") || ""
    
    if (!query) {
      return NextResponse.json({ 
        error: "Query parameter is required" 
      }, { status: 400 })
    }

    // Determine which content types to search
    let contentTypesToSearch = CONTENT_TYPES
    if (contentTypeFilter && CONTENT_TYPES.includes(contentTypeFilter)) {
      contentTypesToSearch = [contentTypeFilter]
    }

    // Fetch data from all relevant Strapi collections
    const allData: SearchHit[] = []
    
    for (const contentType of contentTypesToSearch) {
      const collection = STRAPI_COLLECTIONS[contentType as keyof typeof STRAPI_COLLECTIONS]
      if (collection) {
        const data = await fetchFromStrapi(collection, contentType)
        allData.push(...data)
      }
    }

    // Filter based on query (simple text search with highlighting)
    const filteredData = allData.filter(item => {
      const searchableText = `${item.title} ${item.content} ${item.source} ${item.category}`.toLowerCase()
      return searchableText.includes(query.toLowerCase())
    })

    // Apply additional filters if provided
    let finalData = filteredData
    if (filters) {
      const filterPairs = filters.split(',').map(f => f.split(':'))
      finalData = filteredData.filter(item => {
        return filterPairs.every(([key, value]) => {
          switch (key.toLowerCase()) {
            case 'severity':
              return item.severity?.toLowerCase() === value.toLowerCase()
            case 'category':
              return item.category?.toLowerCase() === value.toLowerCase()
            case 'contenttype':
              return item.contentType?.toLowerCase() === value.toLowerCase()
            case 'source':
              return item.source?.toLowerCase().includes(value.toLowerCase())
            default:
              return true
          }
        })
      })
    }

    // Add highlighting to content and title
    const highlightedData = finalData.map(item => ({
      ...item,
      title: highlightText(item.title, query),
      content: highlightText(item.content, query)
    }))

    // Apply pagination
    const startIndex = page * hitsPerPage
    const endIndex = startIndex + hitsPerPage
    const paginatedData = highlightedData.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedData,
      meta: {
        pagination: {
          page,
          pageSize: hitsPerPage,
          pageCount: Math.ceil(highlightedData.length / hitsPerPage),
          total: highlightedData.length
        },
        processingTimeMS: 1
      }
    })

  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ 
      error: "Search failed" 
    }, { status: 500 })
  }
}

function highlightText(text: string, query: string): string {
  if (!text || !query) return text
  
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
