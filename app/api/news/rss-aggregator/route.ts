import { NextResponse } from "next/server"
import { cache } from "@/lib/cache"
import { dailyLimiter, hourlyLimiter } from "@/lib/rate-limiter"

export async function GET() {
  try {
    // Check cache first (30 minute TTL for news)
    const cacheKey = "news-aggregated"
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Check rate limits
    if (!dailyLimiter.canMakeCall() || !hourlyLimiter.canMakeCall()) {
      console.warn("Rate limit reached, using fallback news")
      const fallbackData = {
        articles: getFallbackNews(),
        feedStatus: [{ name: "Fallback", status: "active" }],
        lastUpdated: new Date().toISOString(),
      }
      cache.set(cacheKey, fallbackData, 1800) // Cache for 30 minutes
      return NextResponse.json(fallbackData)
    }

    const feeds = [
      {
        name: "Bangkok Post",
        url: "https://www.bangkokpost.com/rss/data/news.xml",
        category: "national",
        language: "english",
      },
      {
        name: "The Nation Thailand",
        url: "https://www.nationthailand.com/rss/news.xml",
        category: "national",
        language: "english",
      },
      {
        name: "Thai PBS News",
        url: "https://www.thaipbsworld.com/feed/",
        category: "national",
        language: "english",
      },
    ]

    const articles = []
    const feedStatus = []

    // Limit to 3 feeds to conserve API calls
    for (const feed of feeds.slice(0, 3)) {
      try {
        if (!dailyLimiter.canMakeCall()) break

        const response = await fetch(feed.url, {
          headers: {
            "User-Agent": "Pattaya1-News-Aggregator/1.0",
          },
        })

        dailyLimiter.recordCall()
        hourlyLimiter.recordCall()

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const xmlText = await response.text()
        const feedArticles = parseRSSContent(xmlText, feed.name, feed.category, feed.language)

        feedStatus.push({ name: feed.name, status: "success", count: feedArticles.length })
        articles.push(...feedArticles)
      } catch (error) {
        console.error(`Failed to fetch ${feed.name}:`, error)
        feedStatus.push({ name: feed.name, status: "error", error: error.message })
      }
    }

    // Filter for Pattaya-related content
    const pattayaArticles = articles.filter((article) => {
      const title = article.title.toLowerCase()
      const description = article.description.toLowerCase()
      return (
        title.includes("pattaya") ||
        description.includes("pattaya") ||
        title.includes("chonburi") ||
        description.includes("chonburi") ||
        title.includes("eastern") ||
        title.includes("tourism") ||
        title.includes("beach")
      )
    })

    // Sort by publication date (newest first)
    pattayaArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    const result = {
      articles: pattayaArticles.length > 0 ? pattayaArticles.slice(0, 20) : getFallbackNews(),
      feedStatus,
      lastUpdated: new Date().toISOString(),
      apiCallsRemaining: dailyLimiter.getRemainingCalls(),
    }

    // Cache for 30 minutes
    cache.set(cacheKey, result, 1800)
    return NextResponse.json(result)
  } catch (error) {
    console.error("RSS aggregation error:", error)
    const fallbackData = {
      articles: getFallbackNews(),
      feedStatus: [{ name: "Fallback", status: "active" }],
      lastUpdated: new Date().toISOString(),
    }
    cache.set("news-aggregated", fallbackData, 1800)
    return NextResponse.json(fallbackData)
  }
}

function parseRSSContent(xmlContent: string, feedName: string, category: string, language: string) {
  const items = []
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi
  const titleRegex = /<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i
  const descRegex = /<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i
  const linkRegex = /<link[^>]*>(.*?)<\/link>/i
  const pubDateRegex = /<pubDate[^>]*>(.*?)<\/pubDate>/i

  let match
  while ((match = itemRegex.exec(xmlContent)) !== null && items.length < 10) {
    const itemContent = match[1]

    const titleMatch = titleRegex.exec(itemContent)
    const descMatch = descRegex.exec(itemContent)
    const linkMatch = linkRegex.exec(itemContent)
    const dateMatch = pubDateRegex.exec(itemContent)

    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || "").trim() : ""
    const description = descMatch ? (descMatch[1] || descMatch[2] || "").trim() : ""
    const link = linkMatch ? linkMatch[1].trim() : ""
    const pubDate = dateMatch ? dateMatch[1].trim() : ""

    if (title && link) {
      items.push({
        title: title.replace(/<[^>]*>/g, ""), // Strip HTML tags
        description: description.replace(/<[^>]*>/g, "").substring(0, 200),
        link,
        pubDate,
        source: feedName,
        category,
        language,
      })
    }
  }

  return items
}

function getFallbackNews() {
  return [
    {
      title: "Pattaya Tourism Numbers Surge 40% This Quarter",
      description:
        "International visitors continue to flock to Pattaya as travel restrictions ease globally. The city sees record-breaking numbers in hotel occupancy and tourist activities.",
      link: "https://example.com/news/tourism-surge",
      pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: "Bangkok Post",
      category: "local",
      language: "english",
    },
    {
      title: "New High-Speed Rail Link to Pattaya Approved",
      description:
        "Government approves major infrastructure project connecting Bangkok to Pattaya, expected to reduce travel time to 45 minutes.",
      link: "https://example.com/news/rail-link",
      pubDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: "The Nation",
      category: "national",
      language: "english",
    },
    {
      title: "Pattaya Beach Restoration Project Completed",
      description:
        "Major beach restoration brings pristine sand and improved facilities to central beach area, enhancing the visitor experience.",
      link: "https://example.com/news/beach-restoration",
      pubDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: "Pattaya Mail",
      category: "local",
      language: "english",
    },
    {
      title: "Floating Market Opens New Cultural Experience",
      description:
        "Traditional floating market brings authentic Thai culture to visitors with boat tours, local crafts, and traditional food vendors.",
      link: "https://example.com/news/floating-market",
      pubDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: "Thai PBS",
      category: "culture",
      language: "english",
    },
    {
      title: "Pattaya International Music Festival Announced",
      description:
        "Annual music festival returns with international artists and local performers. Three-day event expected to draw thousands of visitors.",
      link: "https://example.com/news/music-festival",
      pubDate: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      source: "Bangkok Post",
      category: "entertainment",
      language: "english",
    },
  ]
}
