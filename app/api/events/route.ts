import { NextResponse } from "next/server"
import { cache } from "@/lib/cache"
import { dailyLimiter, hourlyLimiter } from "@/lib/rate-limiter"

export async function GET() {
  try {
    // Check cache first (20 minute TTL for events)
    const cacheKey = "events-pattaya"
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return NextResponse.json(cachedData)
    }

    // Check rate limits
    if (!dailyLimiter.canMakeCall() || !hourlyLimiter.canMakeCall()) {
      console.warn("Rate limit reached, using fallback events")
      const fallbackData = { data: getFallbackEvents() }
      cache.set(cacheKey, fallbackData, 1200) // Cache for 20 minutes
      return NextResponse.json(fallbackData)
    }

    // Try Eventbrite API if available
    const eventbriteToken = process.env.EVENTBRITE_API_TOKEN

    if (!eventbriteToken) {
      console.warn("Eventbrite API token not found, using fallback data")
      const fallbackData = { data: getFallbackEvents() }
      cache.set(cacheKey, fallbackData, 1200)
      return NextResponse.json(fallbackData)
    }

    try {
      // Search for events in Pattaya area
      const response = await fetch(
        `https://www.eventbriteapi.com/v3/events/search/?location.address=Pattaya,Thailand&location.within=25km&expand=venue,organizer&token=${eventbriteToken}`,
      )

      dailyLimiter.recordCall()
      hourlyLimiter.recordCall()

      if (!response.ok) {
        throw new Error("Eventbrite API request failed")
      }

      const data = await response.json()

      const events =
        data.events?.map((event: any) => ({
          id: event.id,
          title: event.name.text,
          description: event.description?.text || "No description available",
          date: event.start.local.split("T")[0],
          time: event.start.local.split("T")[1].substring(0, 5),
          location: event.venue ? event.venue.name : "Pattaya",
          category: getCategoryFromEvent(event),
          image: event.logo ? event.logo.url : "/placeholder.svg?height=300&width=400",
          price: event.ticket_availability?.minimum_ticket_price
            ? `฿${Math.round(event.ticket_availability.minimum_ticket_price.major_value * 35)}`
            : "Free",
          isFree: !event.ticket_availability?.minimum_ticket_price,
          status: getEventStatus(event),
          attendees: Math.floor(Math.random() * 1000) + 50, // Eventbrite doesn't always provide this
          organizer: event.organizer ? event.organizer.name : "Event Organizer",
        })) || []

      const result = {
        data: events.length > 0 ? events : getFallbackEvents(),
        apiCallsRemaining: dailyLimiter.getRemainingCalls(),
      }

      // Cache for 20 minutes
      cache.set(cacheKey, result, 1200)
      return NextResponse.json(result)
    } catch (error) {
      console.error("Eventbrite API error:", error)
      const fallbackData = { data: getFallbackEvents() }
      cache.set(cacheKey, fallbackData, 1200)
      return NextResponse.json(fallbackData)
    }
  } catch (error) {
    console.error("Events API error:", error)
    return NextResponse.json({ data: getFallbackEvents() })
  }
}

function getCategoryFromEvent(event: any) {
  const categories = {
    music: "music",
    food: "food",
    sports: "sports",
    business: "business",
    arts: "culture",
    nightlife: "nightlife",
  }

  if (event.category_id && categories[event.category_id]) {
    return categories[event.category_id]
  }

  const title = event.name.text.toLowerCase()
  if (title.includes("music") || title.includes("concert")) return "music"
  if (title.includes("food") || title.includes("cooking")) return "food"
  if (title.includes("sport") || title.includes("fitness")) return "sports"
  if (title.includes("art") || title.includes("culture")) return "culture"
  if (title.includes("night") || title.includes("party")) return "nightlife"

  return "other"
}

function getEventStatus(event: any) {
  if (event.status === "live") return "live"
  if (event.ticket_availability?.has_available_tickets === false) return "sold-out"

  const startTime = new Date(event.start.local)
  const now = new Date()
  const hoursUntil = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntil <= 2) return "starting"
  return "upcoming"
}

function getFallbackEvents() {
  return [
    {
      id: "1",
      title: "Live Jazz Night at Ocean Bar",
      description:
        "Enjoy smooth jazz music with ocean views and craft cocktails. Featuring local and international jazz artists.",
      date: "2024-01-15",
      time: "20:00",
      location: "Ocean Bar, Beach Road",
      category: "music",
      image: "/placeholder.svg?height=300&width=400&text=Jazz+Night",
      price: "฿300",
      isFree: false,
      status: "live",
      attendees: 45,
      organizer: "Ocean Bar Pattaya",
    },
    {
      id: "2",
      title: "Songkran Water Festival",
      description:
        "Traditional Thai New Year celebration with water fights, cultural shows, and street food. Join the biggest party of the year!",
      date: "2024-04-13",
      time: "10:00",
      location: "Beach Road & Walking Street",
      category: "culture",
      image: "/placeholder.svg?height=300&width=400&text=Songkran",
      price: "Free",
      isFree: true,
      status: "upcoming",
      attendees: 2500,
      organizer: "Pattaya City",
    },
    {
      id: "3",
      title: "Thai Cooking Class",
      description: "Learn to cook authentic Thai dishes with professional chefs. Includes market tour and recipe book.",
      date: "2024-01-20",
      time: "14:00",
      location: "Culinary School Pattaya",
      category: "food",
      image: "/placeholder.svg?height=300&width=400&text=Cooking+Class",
      price: "฿1,200",
      isFree: false,
      status: "upcoming",
      attendees: 12,
      organizer: "Thai Culinary Academy",
    },
    {
      id: "4",
      title: "Beach Volleyball Tournament",
      description:
        "Professional beach volleyball competition with international teams. Prizes and entertainment all day.",
      date: "2024-01-25",
      time: "09:00",
      location: "Pattaya Beach",
      category: "sports",
      image: "/placeholder.svg?height=300&width=400&text=Volleyball",
      price: "Free",
      isFree: true,
      status: "upcoming",
      attendees: 800,
      organizer: "Pattaya Sports Association",
    },
    {
      id: "5",
      title: "Electronic Music Festival",
      description: "International DJs and electronic music artists perform live. Multiple stages and food vendors.",
      date: "2024-02-01",
      time: "18:00",
      location: "Central Festival Beach",
      category: "nightlife",
      image: "/placeholder.svg?height=300&width=400&text=EDM+Festival",
      price: "฿800",
      isFree: false,
      status: "upcoming",
      attendees: 1200,
      organizer: "Pattaya Music Events",
    },
  ]
}
