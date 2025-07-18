import { type NextRequest, NextResponse } from "next/server"

const RSS_FEEDS = [
  // Thai News Sources
  {
    name: "Thairath",
    url: "https://www.thairath.co.th/rss/news",
    language: "th",
    category: "general",
  },
  {
    name: "Khaosod",
    url: "https://www.khaosod.co.th/feed",
    language: "th",
    category: "general",
  },
  {
    name: "Daily News",
    url: "https://www.dailynews.co.th/feed/",
    language: "th",
    category: "general",
  },
  {
    name: "Matichon",
    url: "https://www.matichon.co.th/feed",
    language: "th",
    category: "general",
  },
  {
    name: "The Standard",
    url: "https://thestandard.co/feed/",
    language: "th",
    category: "general",
  },
  // English News Sources
  {
    name: "The Thaiger",
    url: "https://thethaiger.com/news/feed",
    language: "en",
    category: "expat",
  },
  {
    name: "Khaosod English",
    url: "https://www.khaosodenglish.com/feed/",
    language: "en",
    category: "general",
  },
  {
    name: "ASEAN NOW",
    url: "https://www.aseannow.com/forum/discover/8.xml/",
    language: "en",
    category: "expat",
  },
  {
    name: "Coconuts Bangkok",
    url: "https://coconuts.co/bangkok/feed/",
    language: "en",
    category: "lifestyle",
  },
  {
    name: "Pattaya Mail",
    url: "https://www.pattayamail.com/feed",
    language: "en",
    category: "local",
  },
  {
    name: "Bangkok Post",
    url: "https://www.bangkokpost.com/rss/data/most-recent.xml",
    language: "en",
    category: "general",
  },
  {
    name: "The Nation",
    url: "https://www.nationthailand.com/rss",
    language: "en",
    category: "general",
  },
  {
    name: "Thai PBS World",
    url: "https://www.thaipbsworld.com/feed/",
    language: "en",
    category: "general",
  },
]

const PATTAYA_KEYWORDS = [
  "pattaya",
  "jomtien",
  "walking street",
  "central pattaya",
  "north pattaya",
  "south pattaya",
  "pattaya beach",
  "jomtien beach",
  "chonburi",
  "rayong",
  "eastern seaboard",
  "pattaya city",
  "พัทยา",
  "จอมเทียน",
  "ชลบุรี",
  "ระยอง",
  "วอล์กกิ้งสตรีท",
]

async function fetchRSSFeed(feed: any) {
  try {
    const response = await fetch(feed.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Pattaya1Bot/1.0)",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()

    // Basic XML parsing for RSS feeds
    const items = parseRSSItems(xmlText, feed)

    return {
      feed: feed.name,
      status: "success",
      items: items.slice(0, 10), // Limit to 10 items per feed
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error fetching ${feed.name}:`, error)
    return {
      feed: feed.name,
      status: "error",
      error: error.message,
      items: [],
      lastUpdated: new Date().toISOString(),
    }
  }
}

function parseRSSItems(xmlText: string, feed: any) {
  const items = []

  // Simple regex-based XML parsing (for production, use a proper XML parser)
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
  const titleRegex = /<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i
  const linkRegex = /<link[^>]*>(.*?)<\/link>/i
  const descRegex = /<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i
  const pubDateRegex = /<pubDate[^>]*>(.*?)<\/pubDate>/i

  let match
  while ((match = itemRegex.exec(xmlText)) !== null && items.length < 20) {
    const itemXml = match[1]

    const titleMatch = titleRegex.exec(itemXml)
    const linkMatch = linkRegex.exec(itemXml)
    const descMatch = descRegex.exec(itemXml)
    const pubDateMatch = pubDateRegex.exec(itemXml)

    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || "").trim() : ""
    const link = linkMatch ? linkMatch[1].trim() : ""
    const description = descMatch ? (descMatch[1] || descMatch[2] || "").trim() : ""
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : ""

    // Check if content is Pattaya/Jomtien related
    const content = `${title} ${description}`.toLowerCase()
    const isPattayaRelated = PATTAYA_KEYWORDS.some((keyword) => content.includes(keyword.toLowerCase()))

    if (title && link) {
      items.push({
        title: cleanText(title),
        link: link,
        description: cleanText(description),
        pubDate: pubDate,
        source: feed.name,
        language: feed.language,
        category: feed.category,
        isPattayaRelated,
        relevanceScore: isPattayaRelated ? calculateRelevanceScore(content) : 0,
      })
    }
  }

  return items.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&[^;]+;/g, " ") // Remove HTML entities
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
}

function calculateRelevanceScore(content: string): number {
  let score = 0

  // Higher scores for more specific Pattaya keywords
  if (content.includes("pattaya") || content.includes("พัทยา")) score += 10
  if (content.includes("jomtien") || content.includes("จอมเทียน")) score += 8
  if (content.includes("walking street") || content.includes("วอล์กกิ้งสตรีท")) score += 6
  if (content.includes("chonburi") || content.includes("ชลบุรี")) score += 4
  if (content.includes("eastern seaboard")) score += 3

  return score
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pattayaOnly = searchParams.get("pattaya") === "true"
    const language = searchParams.get("lang") || "all"
    const category = searchParams.get("category") || "all"

    // Filter feeds based on parameters
    let feedsToFetch = RSS_FEEDS

    if (language !== "all") {
      feedsToFetch = feedsToFetch.filter((feed) => feed.language === language)
    }

    if (category !== "all") {
      feedsToFetch = feedsToFetch.filter((feed) => feed.category === category)
    }

    // Fetch all feeds concurrently
    const feedPromises = feedsToFetch.map((feed) => fetchRSSFeed(feed))
    const feedResults = await Promise.all(feedPromises)

    // Combine all items
    let allItems = []
    const feedStatus = {}

    feedResults.forEach((result) => {
      feedStatus[result.feed] = {
        status: result.status,
        itemCount: result.items.length,
        lastUpdated: result.lastUpdated,
        error: result.error || null,
      }

      if (result.status === "success") {
        allItems = allItems.concat(result.items)
      }
    })

    // Filter for Pattaya-related content if requested
    if (pattayaOnly) {
      allItems = allItems.filter((item) => item.isPattayaRelated)
    }

    // Sort by relevance score and publication date
    allItems.sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore
      }
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    })

    return NextResponse.json({
      success: true,
      totalItems: allItems.length,
      pattayaRelated: allItems.filter((item) => item.isPattayaRelated).length,
      items: allItems.slice(0, 50), // Limit to 50 items
      feedStatus,
      lastUpdated: new Date().toISOString(),
      filters: {
        pattayaOnly,
        language,
        category,
      },
    })
  } catch (error) {
    console.error("RSS aggregation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch RSS feeds",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
