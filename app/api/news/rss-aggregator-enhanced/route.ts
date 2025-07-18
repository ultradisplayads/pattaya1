import { NextResponse } from "next/server"

const NEWS_API_KEY = "05cfa3f64bc348e493861e66edb6eb89"

interface RSSFeed {
  name: string
  url: string
  language: "thai" | "english"
  category: "local" | "national" | "expat"
  priority: number
}

const RSS_FEEDS: RSSFeed[] = [
  // High Priority Local Sources
  {
    name: "Pattaya Mail",
    url: "https://www.pattayamail.com/feed",
    language: "english",
    category: "local",
    priority: 10,
  },

  // English National Sources
  {
    name: "Bangkok Post",
    url: "https://www.bangkokpost.com/rss/data/most-recent.xml",
    language: "english",
    category: "national",
    priority: 9,
  },
  {
    name: "The Nation",
    url: "https://www.nationthailand.com/rss",
    language: "english",
    category: "national",
    priority: 9,
  },
  {
    name: "The Thaiger",
    url: "https://thethaiger.com/news/feed",
    language: "english",
    category: "expat",
    priority: 8,
  },
  {
    name: "Khaosod English",
    url: "https://www.khaosodenglish.com/feed/",
    language: "english",
    category: "national",
    priority: 8,
  },
  {
    name: "ASEAN NOW",
    url: "https://www.aseannow.com/forum/discover/8.xml/",
    language: "english",
    category: "expat",
    priority: 7,
  },
  {
    name: "Coconuts Bangkok",
    url: "https://coconuts.co/bangkok/feed/",
    language: "english",
    category: "expat",
    priority: 7,
  },

  // Thai National Sources
  {
    name: "Thairath",
    url: "https://www.thairath.co.th/rss/news",
    language: "thai",
    category: "national",
    priority: 8,
  },
  {
    name: "Khaosod",
    url: "https://www.khaosod.co.th/feed",
    language: "thai",
    category: "national",
    priority: 8,
  },
  {
    name: "Daily News",
    url: "https://www.dailynews.co.th/feed/",
    language: "thai",
    category: "national",
    priority: 7,
  },
  {
    name: "Matichon",
    url: "https://www.matichon.co.th/feed",
    language: "thai",
    category: "national",
    priority: 7,
  },
  {
    name: "The Standard",
    url: "https://thestandard.co/feed/",
    language: "thai",
    category: "national",
    priority: 7,
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
  "หาดพัทยา",
  "หาดจอมเทียน",
]

const BREAKING_NEWS_KEYWORDS = [
  "breaking",
  "urgent",
  "alert",
  "emergency",
  "accident",
  "fire",
  "flood",
  "storm",
  "ด่วน",
  "เร่งด่วน",
  "แจ้งเหตุ",
  "เหตุฉุกเฉิน",
  "อุบัติเหตุ",
  "ไฟไหม้",
  "น้ำท่วม",
]

async function fetchRSSFeed(feed: RSSFeed) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(feed.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Pattaya1Bot/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()
    const items = parseRSSItems(xmlText, feed)

    return {
      feed: feed.name,
      status: "success",
      items: items.slice(0, 15), // Limit to 15 items per feed
      lastUpdated: new Date().toISOString(),
      priority: feed.priority,
    }
  } catch (error) {
    console.error(`Failed to fetch ${feed.name}:`, error)
    return {
      feed: feed.name,
      status: "error",
      error: error.message,
      items: [],
      lastUpdated: new Date().toISOString(),
      priority: feed.priority,
    }
  }
}

function parseRSSItems(xmlText: string, feed: RSSFeed) {
  const items = []

  // Enhanced regex patterns for better parsing
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
  const titleRegex = /<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i
  const linkRegex = /<link[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/i
  const descRegex = /<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i
  const pubDateRegex = /<pubDate[^>]*>(.*?)<\/pubDate>/i
  const categoryRegex = /<category[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/i
  const imageRegex = /<enclosure[^>]*url="([^"]*)"[^>]*type="image\/[^"]*"|<media:thumbnail[^>]*url="([^"]*)"/i

  let match
  while ((match = itemRegex.exec(xmlText)) !== null && items.length < 20) {
    const itemContent = match[1]

    const titleMatch = titleRegex.exec(itemContent)
    const linkMatch = linkRegex.exec(itemContent)
    const descMatch = descRegex.exec(itemContent)
    const pubDateMatch = pubDateRegex.exec(itemContent)
    const categoryMatch = categoryRegex.exec(itemContent)
    const imageMatch = imageRegex.exec(itemContent)

    const title = titleMatch ? cleanText(titleMatch[1]) : ""
    const link = linkMatch ? linkMatch[1].trim() : ""
    const description = descMatch ? cleanText(descMatch[1]) : ""
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : ""
    const category = categoryMatch ? cleanText(categoryMatch[1]) : ""
    const image = imageMatch ? imageMatch[1] || imageMatch[2] : ""

    if (title && link) {
      const content = `${title} ${description}`.toLowerCase()
      const isPattayaRelated = PATTAYA_KEYWORDS.some((keyword) => content.includes(keyword.toLowerCase()))
      const isBreaking = BREAKING_NEWS_KEYWORDS.some((keyword) => content.includes(keyword.toLowerCase()))

      const relevanceScore = calculateRelevanceScore(content, isBreaking, feed.priority)

      items.push({
        id: `${feed.name}-${Date.now()}-${Math.random()}`,
        title,
        link,
        description: description.substring(0, 300),
        pubDate,
        source: feed.name,
        language: feed.language,
        category: feed.category,
        articleCategory: category,
        image: image || generatePlaceholderImage(title),
        isPattayaRelated,
        isBreaking,
        relevanceScore,
        priority: feed.priority,
        timestamp: new Date().toISOString(),
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

function calculateRelevanceScore(content: string, isBreaking: boolean, priority: number): number {
  let score = priority

  // Breaking news gets highest priority
  if (isBreaking) score += 50

  // Pattaya-specific content scoring
  if (content.includes("pattaya") || content.includes("พัทยา")) score += 30
  if (content.includes("jomtien") || content.includes("จอมเทียน")) score += 25
  if (content.includes("walking street") || content.includes("วอล์กกิ้งสตรีท")) score += 20
  if (content.includes("chonburi") || content.includes("ชลบุรี")) score += 15
  if (content.includes("eastern seaboard")) score += 10

  // Tourism and business keywords
  if (content.includes("tourism") || content.includes("tourist")) score += 10
  if (content.includes("hotel") || content.includes("resort")) score += 8
  if (content.includes("restaurant") || content.includes("food")) score += 5

  return score
}

function generatePlaceholderImage(title: string): string {
  const keywords = title.toLowerCase()
  if (keywords.includes("pattaya")) return "/placeholder.svg?height=200&width=300&text=Pattaya+News"
  if (keywords.includes("tourism")) return "/placeholder.svg?height=200&width=300&text=Tourism+News"
  if (keywords.includes("business")) return "/placeholder.svg?height=200&width=300&text=Business+News"
  return "/placeholder.svg?height=200&width=300&text=Thailand+News"
}

async function checkBreakingNews(articles: any[]) {
  const breakingArticles = articles.filter((article) => article.isBreaking)

  if (breakingArticles.length > 0) {
    // Here you would implement push notification logic
    console.log(`Found ${breakingArticles.length} breaking news articles`)

    // For now, we'll just log the breaking news
    breakingArticles.forEach((article) => {
      console.log(`BREAKING: ${article.title} - ${article.source}`)
    })
  }

  return breakingArticles
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pattayaOnly = searchParams.get("pattaya") === "true"
    const language = searchParams.get("lang") || "all"
    const category = searchParams.get("category") || "all"
    const breakingOnly = searchParams.get("breaking") === "true"

    console.log("Starting enhanced RSS aggregation...")

    // Filter feeds based on parameters
    let feedsToFetch = RSS_FEEDS

    if (language !== "all") {
      feedsToFetch = feedsToFetch.filter((feed) => feed.language === language)
    }

    if (category !== "all") {
      feedsToFetch = feedsToFetch.filter((feed) => feed.category === category)
    }

    // Fetch all feeds concurrently with timeout
    const feedPromises = feedsToFetch.map((feed) => fetchRSSFeed(feed))
    const feedResults = await Promise.allSettled(feedPromises)

    // Process results
    let allArticles = []
    const feedStatus = {}

    feedResults.forEach((result, index) => {
      const feedName = feedsToFetch[index].name

      if (result.status === "fulfilled" && result.value.status === "success") {
        allArticles = allArticles.concat(result.value.items)
        feedStatus[feedName] = {
          status: "success",
          itemCount: result.value.items.length,
          lastUpdated: result.value.lastUpdated,
        }
      } else {
        feedStatus[feedName] = {
          status: "failed",
          error: result.status === "fulfilled" ? result.value.error : "Promise rejected",
          itemCount: 0,
        }
      }
    })

    console.log(`Parsed ${allArticles.length} total articles`)

    // Apply filters
    if (pattayaOnly) {
      allArticles = allArticles.filter((article) => article.isPattayaRelated)
    }

    if (breakingOnly) {
      allArticles = allArticles.filter((article) => article.isBreaking)
    }

    // Sort by relevance score and recency
    allArticles.sort((a, b) => {
      if (Math.abs(a.relevanceScore - b.relevanceScore) > 5) {
        return b.relevanceScore - a.relevanceScore
      }
      return new Date(b.pubDate || b.timestamp).getTime() - new Date(a.pubDate || a.timestamp).getTime()
    })

    // Check for breaking news and trigger notifications
    const breakingNews = await checkBreakingNews(allArticles)

    const response = {
      success: true,
      totalArticles: allArticles.length,
      pattayaRelated: allArticles.filter((article) => article.isPattayaRelated).length,
      breakingNews: breakingNews.length,
      articles: allArticles.slice(0, 100), // Return top 100 articles
      feedStatus,
      lastUpdated: new Date().toISOString(),
      filters: {
        pattayaOnly,
        language,
        category,
        breakingOnly,
      },
      sources: RSS_FEEDS.map((feed) => ({
        name: feed.name,
        language: feed.language,
        category: feed.category,
        priority: feed.priority,
      })),
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
      },
    })
  } catch (error) {
    console.error("Enhanced RSS aggregation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to aggregate RSS feeds",
        details: error.message,
        articles: [],
        feedStatus: {},
      },
      { status: 500 },
    )
  }
}
