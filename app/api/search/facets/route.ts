import { NextResponse } from "next/server"

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

export async function GET() {
  try {
    const categories = new Set<string>()
    const sources = new Set<string>()
    const contentTypes = new Set<string>()
    const severities = new Set<string>()

    // Fetch data from all available Strapi collections
    for (const contentType of CONTENT_TYPES) {
      const collection = STRAPI_COLLECTIONS[contentType as keyof typeof STRAPI_COLLECTIONS]
      if (!collection) continue

      try {
        const response = await fetch(`http://localhost:1337/api/${collection}?populate=*&pagination[limit]=50`, {
          headers: { 'Accept': 'application/json' }
        })
        
        if (response.ok) {
          const result = await response.json()
          const data = result.data || []
          
          data.forEach((item: any) => {
            const attrs = item.attributes || item
            
            // Extract categories
            const category = attrs.Category || attrs.Type || attrs.category || contentType
            if (category) categories.add(category)
            
            // Extract sources
            const source = attrs.Source || attrs.Sponsor || attrs.Author || attrs.source
            if (source) sources.add(source)
            
            // Extract severities
            const severity = attrs.Severity || attrs.Priority || attrs.severity
            if (severity) severities.add(severity)
          })
          
          // Add the content type itself
          contentTypes.add(contentType)
        }
      } catch (error) {
        console.log(`Collection ${collection} not available:`, (error as Error).message)
        // Still add the content type even if collection doesn't exist
        contentTypes.add(contentType)
      }
    }

    // Add default values if collections are empty
    if (categories.size === 0) {
      categories.add('News')
      categories.add('Business')
      categories.add('Events')
      categories.add('Sponsored')
    }

    if (sources.size === 0) {
      sources.add('The Pattaya News')
      sources.add('Bangkok Post')
      sources.add('Local Guide')
    }

    if (severities.size === 0) {
      severities.add('high')
      severities.add('medium')
      severities.add('low')
    }

    return NextResponse.json({
      data: {
        categories: Array.from(categories).sort(),
        sources: Array.from(sources).sort(),
        contentTypes: Array.from(contentTypes).sort(),
        severities: Array.from(severities).sort()
      }
    })

  } catch (error) {
    console.error("Facets error:", error)
    return NextResponse.json({ 
      error: "Facets retrieval failed" 
    }, { status: 500 })
  }
}
