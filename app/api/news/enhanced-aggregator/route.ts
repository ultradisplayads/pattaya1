import { NextResponse } from "next/server"

interface NewsSource {
  id: string
  name: string
  url: string
  rssUrl: string
  language: string
  enabled: boolean
}

interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  image?: string
  images?: string[]
  publishedAt: string
  source: {
    name: string
    url: string
    language: string
    status: "active" | "error" | "loading"
  }
  category?: string
  isBreaking: boolean
  priority: number
  sentiment?: "positive" | "negative" | "neutral"
  tags: string[]
  relevanceScore: number
}

const NEWS_SOURCES: NewsSource[] = [
  {
    id: "pattaya-mail",
    name: "Pattaya Mail",
    url: "https://www.pattayamail.com",
    rssUrl: "https://www.pattayamail.com/feed",
    language: "en",
    enabled: true,
  },
  {
    id: "pattaya-news",
    name: "The Pattaya News",
    url: "https://thepattayanews.com",
    rssUrl: "https://thepattayanews.com/feed/",
    language: "en",
    enabled: true,
  },
  {
    id: "pattaya-blatt",
    name: "Pattaya Blatt",
    url: "https://www.pattayamail.com/pattayablatt",
    rssUrl: "https://www.pattayamail.com/pattayablatt/feed",
    language: "de",
    enabled: true,
  },
  {
    id: "bangkok-post",
    name: "Bangkok Post",
    url: "https://www.bangkokpost.com",
    rssUrl: "https://www.bangkokpost.com/rss",
    language: "en",
    enabled: true,
  },
  {
    id: "thai-pbs",
    name: "Thai PBS World",
    url: "https://www.thaipbsworld.com",
    rssUrl: "https://www.thaipbsworld.com/feed/",
    language: "en",
    enabled: true,
  },
  {
    id: "the-nation",
    name: "The Nation",
    url: "https://www.nationthailand.com",
    rssUrl: "https://www.nationthailand.com/rss",
    language: "en",
    enabled: true,
  },
]

export async function GET() {
  try {
    // For now, return mock data to prevent errors
    // In production, this would fetch from actual RSS feeds
    const mockArticles: NewsArticle[] = [
      {
        id: "1",
        title: "New High-Speed Rail Link to Pattaya Approved",
        description:
          "Government approves major infrastructure project connecting Bangkok to Pattaya, expected to reduce travel time to 45 minutes.",
        url: "#",
        images: [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IQg6qT35otB6g7iZSmbzZqySi3c3R7.png",
          "/placeholder.svg?height=200&width=300&text=Rail+Construction",
          "/placeholder.svg?height=200&width=300&text=Pattaya+Station",
        ],
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: {
          name: "The Nation",
          url: "https://www.nationthailand.com",
          language: "en",
          status: "active",
        },
        category: "Infrastructure",
        isBreaking: true,
        priority: 10,
        sentiment: "positive",
        tags: ["infrastructure", "transportation", "bangkok", "pattaya"],
        relevanceScore: 95,
      },
      {
        id: "2",
        title: "Pattaya Tourism Numbers Surge 40% This Quarter",
        description:
          "International visitor arrivals show strong recovery with European and Asian markets leading the growth.",
        url: "#",
        images: [
          "/placeholder.svg?height=200&width=300&text=Tourism+Growth",
          "/placeholder.svg?height=200&width=300&text=Beach+Visitors",
        ],
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: {
          name: "Pattaya Mail",
          url: "https://www.pattayamail.com",
          language: "en",
          status: "active",
        },
        category: "Tourism",
        isBreaking: false,
        priority: 8,
        sentiment: "positive",
        tags: ["tourism", "economy", "recovery"],
        relevanceScore: 88,
      },
      {
        id: "3",
        title: "Pattaya Beach Restoration Project Completed",
        description:
          "Major beach restoration and improvement project finished ahead of schedule, enhancing the coastline for visitors.",
        url: "#",
        images: ["/placeholder.svg?height=200&width=300&text=Beach+Restoration"],
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: {
          name: "The Pattaya News",
          url: "https://thepattayanews.com",
          language: "en",
          status: "active",
        },
        category: "Environment",
        isBreaking: false,
        priority: 7,
        sentiment: "positive",
        tags: ["environment", "beach", "restoration"],
        relevanceScore: 82,
      },
      {
        id: "4",
        title: "New Shopping Mall Opens in Central Pattaya",
        description:
          "State-of-the-art shopping complex featuring international brands and local retailers opens to the public.",
        url: "#",
        images: [
          "/placeholder.svg?height=200&width=300&text=Shopping+Mall",
          "/placeholder.svg?height=200&width=300&text=Mall+Interior",
        ],
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        source: {
          name: "Pattaya Mail",
          url: "https://www.pattayamail.com",
          language: "en",
          status: "active",
        },
        category: "Business",
        isBreaking: true,
        priority: 6,
        sentiment: "positive",
        tags: ["business", "shopping", "retail"],
        relevanceScore: 75,
      },
    ]

    const sourceStatus = NEWS_SOURCES.reduce(
      (acc, source) => {
        acc[source.id] = {
          status: "active" as const,
          count: Math.floor(Math.random() * 10) + 1,
          lastUpdated: new Date().toISOString(),
        }
        return acc
      },
      {} as Record<string, { status: "active" | "error" | "loading"; count: number; lastUpdated: string }>,
    )

    return NextResponse.json({
      success: true,
      articles: mockArticles,
      sources: sourceStatus,
      totalArticles: mockArticles.length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in enhanced news aggregator:", error)

    return NextResponse.json(
      {
        success: false,
        articles: [],
        sources: {},
        error: "Failed to fetch news",
      },
      { status: 500 },
    )
  }
}
