import { NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

interface FeedItem {
  type: 'news' | 'sponsored';
  id: string;
  [key: string]: any;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    // Fetch articles from Strapi
    let articlesQuery = `articles?populate=*&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${Math.ceil(limit * 0.8)}`
    if (category && category !== 'all') {
      articlesQuery += `&filters[category][slug][$eq]=${category}`
    }
    if (search) {
      articlesQuery += `&filters[$or][0][title][$containsi]=${search}&filters[$or][1][description][$containsi]=${search}`
    }
    
    // Fetch sponsored posts from Strapi
    let sponsoredQuery = `sponsored-posts?populate=*&filters[Active][$eq]=true&sort=createdAt:desc&pagination[pageSize]=${Math.ceil(limit * 0.2)}`
    
    const [articlesResponse, sponsoredResponse] = await Promise.all([
      fetch(buildApiUrl(articlesQuery)),
      fetch(buildApiUrl(sponsoredQuery))
    ])
    
    const articlesData = articlesResponse.ok ? await articlesResponse.json() : { data: [], meta: { pagination: { total: 0 } } }
    const sponsoredData = sponsoredResponse.ok ? await sponsoredResponse.json() : { data: [], meta: { pagination: { total: 0 } } }
    
    // Transform articles to feed format
    const newsItems = articlesData.data?.map((article: any) => ({
      type: 'news',
      id: article.id.toString(),
      title: article.attributes?.title || article.title,
      summary: article.attributes?.description || article.description,
      content: article.attributes?.content || article.content,
      url: `/articles/${article.attributes?.slug || article.id}`,
      image: article.attributes?.cover?.data?.attributes?.url,
      author: article.attributes?.author?.data?.attributes?.name,
      category: article.attributes?.category?.data?.attributes?.name,
      publishedAt: article.attributes?.publishedAt || article.publishedAt,
      createdAt: article.attributes?.createdAt || article.createdAt
    })) || []
    
    // Transform sponsored posts to feed format
    const sponsoredItems = sponsoredData.data?.map((post: any) => ({
      type: 'sponsored',
      id: post.id.toString(),
      title: post.attributes?.Title || post.Title,
      summary: post.attributes?.Content || post.Content,
      content: post.attributes?.Content || post.Content,
      url: post.attributes?.URL || post.URL,
      sponsorName: post.attributes?.Sponsor || post.Sponsor,
      image: post.attributes?.Image?.data?.attributes?.url,
      sponsorLogo: post.attributes?.SponsorLogo?.data?.attributes?.url,
      logo: post.attributes?.Logo?.data?.attributes?.url,
      callToAction: post.attributes?.CallToAction || post.CallToAction || 'Learn More',
      category: post.attributes?.Category || post.Category || 'Sponsored',
      publishedAt: post.attributes?.PublishedTimestamp || post.attributes?.createdAt,
      createdAt: post.attributes?.createdAt || post.createdAt,
      impressions: post.attributes?.impressions || 0,
      clicks: post.attributes?.clicks || 0
    })) || []
    
    // Merge and shuffle the content (maintain some sponsored distribution)
    const mixedFeed: FeedItem[] = []
    const newsCount = newsItems.length
    const sponsoredCount = sponsoredItems.length
    
    // Add news items
    newsItems.forEach((item: any, index: number) => {
      mixedFeed.push(item)
      
      // Insert sponsored content every 3-4 news items
      if (sponsoredItems.length > 0 && (index + 1) % 3 === 0) {
        const sponsoredIndex = Math.floor((index / 3) % sponsoredItems.length)
        if (sponsoredItems[sponsoredIndex]) {
          mixedFeed.push(sponsoredItems[sponsoredIndex])
        }
      }
    })
    
    // Add any remaining sponsored items at the end
    const usedSponsoredCount = Math.floor(newsCount / 3)
    if (usedSponsoredCount < sponsoredCount) {
      sponsoredItems.slice(usedSponsoredCount).forEach((item: any) => {
        mixedFeed.push(item)
      })
    }
    
    // Limit to requested amount
    const limitedFeed = mixedFeed.slice(0, limit)
    
    const response = {
      data: limitedFeed,
      meta: {
        newsCount,
        sponsoredCount,
        total: limitedFeed.length,
        pagination: {
          page,
          pageSize: limit,
          pageCount: Math.ceil((newsCount + sponsoredCount) / limit),
          total: newsCount + sponsoredCount
        }
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Mixed feed API error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch mixed feed",
      data: [],
      meta: { newsCount: 0, sponsoredCount: 0, total: 0 }
    }, { status: 500 })
  }
}
