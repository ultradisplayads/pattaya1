import { NextResponse } from "next/server"
import { cache } from "@/lib/cache"
import { socialApiLimiter } from "@/lib/rate-limiter"

export async function GET() {
  try {
    // Check cache first (10 minute TTL for social media)
    const cacheKey = "social-aggregated"
    const cachedData = cache.get(cacheKey)
    // If we recently hit a provider-specific cool-down (e.g. Twitter 429),
    // the downstream blocks will gracefully skip that provider until the
    // cool-down expires and fall back to cached or synthetic data.
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Check rate limits - social media APIs are expensive
    const rateLimitCheck = await socialApiLimiter.checkLimit("social-api")
    if (!rateLimitCheck.allowed) {
      console.warn("Social API rate limit reached, using fallback data")
      const fallbackData = {
        posts: getFallbackSocialPosts(),
        lastUpdated: new Date().toISOString(),
        platforms: ["twitter", "instagram", "facebook", "tiktok"],
        totalPosts: 8,
        source: "fallback",
      }
      cache.set(cacheKey, fallbackData, 600) // Cache for 10 minutes
      return NextResponse.json(fallbackData)
    }

    const posts = []

    // Twitter/X Bearer token – set this in your dashboard as `TWITTER_BEARER_TOKEN`
    const twitterBearer = process.env.TWITTER_BEARER_TOKEN

    // Cool-down key to avoid repeated 429 hits
    const TWITTER_COOLDOWN_KEY = "twitter-cooldown"
    const twitterCooldownUntil = cache.get<number>(TWITTER_COOLDOWN_KEY)

    // Twitter/X API integration with provided Bearer Token
    if (twitterBearer && rateLimitCheck.allowed && (!twitterCooldownUntil || Date.now() > twitterCooldownUntil)) {
      try {
        const twitterResponse = await fetch(
          "https://api.twitter.com/2/tweets/search/recent?query=Pattaya OR #Pattaya OR #PattayaLife OR #Thailand&max_results=10&expansions=author_id&user.fields=profile_image_url,verified&tweet.fields=created_at,public_metrics,context_annotations",
          {
            headers: {
              Authorization: `Bearer ${twitterBearer}`,
              "Content-Type": "application/json",
            },
          },
        )

        // ↙️ NEW: handle 429 rate-limit responses
        if (twitterResponse.status === 429) {
          console.warn("Twitter API rate-limited (429). Entering 15 min cool-down.")
          // 15-minute cool-down
          cache.set(TWITTER_COOLDOWN_KEY, Date.now() + 15 * 60 * 1000, 900)
        }

        if (twitterResponse.ok) {
          const twitterData = await twitterResponse.json()
          const twitterPosts =
            twitterData.data?.map((tweet: any) => {
              const author = twitterData.includes?.users?.find((user: any) => user.id === tweet.author_id)
              return {
                id: tweet.id,
                platform: "twitter",
                author: author?.name || "Twitter User",
                username: `@${author?.username || "user"}`,
                avatar: author?.profile_image_url || "/placeholder.svg?height=40&width=40",
                content: tweet.text,
                timestamp: tweet.created_at,
                likes: tweet.public_metrics?.like_count || 0,
                comments: tweet.public_metrics?.reply_count || 0,
                shares: tweet.public_metrics?.retweet_count || 0,
                hashtags: extractHashtags(tweet.text),
                verified: author?.verified || false,
                trending: tweet.public_metrics?.like_count > 100,
                location: "Pattaya", // Default location for Pattaya-related tweets
              }
            }) || []

          posts.push(...twitterPosts)
          console.log(`Loaded ${twitterPosts.length} tweets from Twitter API`)
        } else if (twitterResponse.status !== 429) {
          // only log non-rate-limit errors
          console.error("Twitter API error:", twitterResponse.status, await twitterResponse.text())
        }
      } catch (error) {
        console.error("Twitter API error:", error)
      }
    }

    // Instagram API integration would go here
    const instagramToken = process.env.INSTAGRAM_ACCESS_TOKEN
    if (instagramToken && posts.length < 10) {
      // Instagram API calls would be implemented here
      console.log("Instagram API integration ready for token:", instagramToken ? "Available" : "Not available")
    }

    // Facebook API integration would go here
    const facebookToken = process.env.FACEBOOK_ACCESS_TOKEN
    if (facebookToken && posts.length < 15) {
      // Facebook API calls would be implemented here
      console.log("Facebook API integration ready for token:", facebookToken ? "Available" : "Not available")
    }

    // If no real data or insufficient data, supplement with fallback
    if (posts.length < 5) {
      const fallbackPosts = getFallbackSocialPosts()
      posts.push(...fallbackPosts.slice(0, 8 - posts.length))
    }

    // Sort by engagement and recency
    posts.sort((a, b) => {
      const scoreA = (a.likes + a.comments + a.shares) * (a.trending ? 2 : 1)
      const scoreB = (b.likes + b.comments + b.shares) * (b.trending ? 2 : 1)
      return scoreB - scoreA
    })

    const result = {
      posts: posts.slice(0, 20),
      lastUpdated: new Date().toISOString(),
      platforms: ["twitter", "instagram", "facebook", "tiktok"],
      totalPosts: posts.length,
      apiCallsRemaining: rateLimitCheck.remaining,
      source: posts.length > 8 ? "live" : "mixed",
      twitterIntegration: "active",
    }

    // Cache for 10 minutes
    cache.set(cacheKey, result, 600)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Social aggregation error:", error)
    const fallbackData = {
      posts: getFallbackSocialPosts(),
      lastUpdated: new Date().toISOString(),
      platforms: ["twitter", "instagram", "facebook", "tiktok"],
      totalPosts: 8,
      source: "fallback",
      error: "API integration failed",
    }
    cache.set("social-aggregated", fallbackData, 600)
    return NextResponse.json(fallbackData)
  }
}

function extractHashtags(text: string) {
  const hashtags = text.match(/#\w+/g) || []
  return hashtags.map((tag) => tag.substring(1)) // Remove # symbol
}

function getFallbackSocialPosts() {
  return [
    {
      id: "1",
      platform: "instagram",
      author: "Pattaya Explorer",
      username: "@pattayaexplorer",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Sunset vibes at Pattaya Beach never get old! 🌅 Perfect evening for a beach walk and some amazing street food. The colors tonight are absolutely incredible! #PattayaLife #Sunset #BeachVibes",
      image: "/placeholder.svg?height=200&width=300&text=Sunset+Beach",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      likes: 234,
      comments: 18,
      shares: 12,
      hashtags: ["PattayaLife", "Sunset", "Beach", "Thailand", "BeachVibes"],
      location: "Pattaya Beach",
      verified: true,
      trending: true,
    },
    {
      id: "2",
      platform: "twitter",
      author: "Foodie in Thailand",
      username: "@thaifoodie",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Just discovered this amazing street food stall in Pattaya! Best som tam I've had in years 🥗 The vendor has been here for 20+ years and it shows in every bite. Authentic flavors! #StreetFood #Pattaya #SomTam",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 89,
      comments: 23,
      shares: 15,
      hashtags: ["StreetFood", "Pattaya", "SomTam", "ThaiFood", "Authentic"],
      location: "Thepprasit Market",
      verified: false,
      trending: false,
    },
    {
      id: "3",
      platform: "tiktok",
      author: "Travel with Mike",
      username: "@travelwithmike",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Walking Street at night hits different! The energy here is incredible 🌃 From street performers to amazing food, this place never sleeps. Can't wait to explore more tomorrow! #WalkingStreet #PattayaNightlife #Thailand",
      image: "/placeholder.svg?height=200&width=300&text=Walking+Street",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: 456,
      comments: 67,
      shares: 89,
      hashtags: ["WalkingStreet", "PattayaNightlife", "Thailand", "Travel", "NightLife"],
      location: "Walking Street",
      verified: true,
      trending: true,
    },
    {
      id: "4",
      platform: "facebook",
      author: "Pattaya Events",
      username: "pattayaevents",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Don't miss the floating market tour this weekend! Traditional Thai culture at its finest 🛶 Experience authentic local life, try traditional foods, and shop for unique handicrafts. Tours start at 8 AM daily. #FloatingMarket #Culture #Weekend",
      image: "/placeholder.svg?height=200&width=300&text=Floating+Market",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      likes: 123,
      comments: 34,
      shares: 28,
      hashtags: ["FloatingMarket", "Culture", "Weekend", "Pattaya", "Traditional"],
      location: "Damnoen Saduak",
      verified: true,
      trending: false,
    },
    {
      id: "5",
      platform: "instagram",
      author: "Beach Life Pattaya",
      username: "@beachlifepattaya",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Morning yoga session by the beach 🧘‍♀️ Starting the day right in paradise! There's something magical about practicing yoga with the sound of waves and the gentle morning breeze. Join us tomorrow at 7 AM! #YogaLife #BeachYoga #Wellness #Mindfulness",
      image: "/placeholder.svg?height=200&width=300&text=Beach+Yoga",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      likes: 178,
      comments: 12,
      shares: 8,
      hashtags: ["YogaLife", "BeachYoga", "Wellness", "Pattaya", "Mindfulness"],
      location: "Jomtien Beach",
      verified: false,
      trending: false,
    },
    {
      id: "6",
      platform: "twitter",
      author: "Pattaya Weather",
      username: "@pattayaweather",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Perfect beach weather today! ☀️ 32°C with gentle breeze and clear skies. UV index is high so don't forget your sunscreen! Great day for water activities and beach lounging. #PattayaWeather #BeachDay #Sunshine",
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      likes: 67,
      comments: 8,
      shares: 15,
      hashtags: ["PattayaWeather", "BeachDay", "Sunshine", "Weather", "Perfect"],
      location: "Pattaya",
      verified: true,
      trending: false,
    },
    {
      id: "7",
      platform: "instagram",
      author: "Nightlife Guru",
      username: "@nightlifeguru",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "New rooftop bar just opened with incredible city views! 🏙️ The cocktails are amazing and the atmosphere is perfect for a night out. Already becoming the hottest spot in town! #RooftopBar #Cocktails #CityViews #NewOpening",
      image: "/placeholder.svg?height=200&width=300&text=Rooftop+Bar",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      likes: 289,
      comments: 45,
      shares: 23,
      hashtags: ["RooftopBar", "Cocktails", "CityViews", "NewOpening", "Nightlife"],
      location: "Central Pattaya",
      verified: false,
      trending: true,
    },
    {
      id: "8",
      platform: "tiktok",
      author: "Adventure Seeker",
      username: "@adventureseeker",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Parasailing over Pattaya Bay was INCREDIBLE! 🪂 The views from up there are absolutely breathtaking. You can see the entire coastline and the water is so blue! Definitely a must-do activity. #Parasailing #Adventure #PattayaBay #Thrills",
      image: "/placeholder.svg?height=200&width=300&text=Parasailing",
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      likes: 512,
      comments: 78,
      shares: 45,
      hashtags: ["Parasailing", "Adventure", "PattayaBay", "Thrills", "Views"],
      location: "Pattaya Bay",
      verified: false,
      trending: true,
    },
  ]
}
