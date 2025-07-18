import { NextResponse, type NextRequest } from "next/server"

/**
 * A tiny helper to grab an environment variable safely.
 */
function env(key: string): string | undefined {
  return process.env[key] && process.env[key] !== "" ? process.env[key] : undefined
}

/**
 * Fallback reviews so the widget never fails.
 * Keep these in sync with the dummy reviews already hard-coded in
 * `components/widgets/google-reviews-widget.tsx`.
 */
const FALLBACK_REVIEWS = [
  {
    id: "1",
    author_name: "Sarah Johnson",
    author_url: "https://www.google.com/maps/contrib/123",
    language: "en",
    profile_photo_url: "/placeholder.svg?height=40&width=40&text=SJ",
    rating: 5,
    relative_time_description: "2 days ago",
    text: "Amazing Thai food and great atmosphere! The pad thai was exceptional and the service was friendly. Highly recommend this place for authentic Thai cuisine.",
    time: Date.now() - 172800000, // 2 days ago
  },
  {
    id: "2",
    author_name: "Mike Chen",
    author_url: "https://www.google.com/maps/contrib/456",
    language: "en",
    profile_photo_url: "/placeholder.svg?height=40&width=40&text=MC",
    rating: 4,
    relative_time_description: "1 week ago",
    text: "Great location near the beach. Food was good and prices reasonable. The green curry was a bit spicy but delicious. Will definitely come back!",
    time: Date.now() - 604800000, // 1 week ago
  },
  {
    id: "3",
    author_name: "Anna Schmidt",
    author_url: "https://www.google.com/maps/contrib/789",
    language: "en",
    profile_photo_url: "/placeholder.svg?height=40&width=40&text=AS",
    rating: 5,
    relative_time_description: "2 weeks ago",
    text: "Fantastic experience! The staff was very welcoming and the food arrived quickly. The mango sticky rice for dessert was the perfect ending to our meal.",
    time: Date.now() - 1209600000, // 2 weeks ago
  },
  {
    id: "4",
    author_name: "David Wilson",
    author_url: "https://www.google.com/maps/contrib/101",
    language: "en",
    profile_photo_url: "/placeholder.svg?height=40&width=40&text=DW",
    rating: 4,
    relative_time_description: "3 weeks ago",
    text: "Nice restaurant with good variety of dishes. The tom yum soup was excellent. A bit crowded during peak hours but worth the wait.",
    time: Date.now() - 1814400000, // 3 weeks ago
  },
  {
    id: "5",
    author_name: "Lisa Park",
    author_url: "https://www.google.com/maps/contrib/202",
    language: "en",
    profile_photo_url: "/placeholder.svg?height=40&width=40&text=LP",
    rating: 5,
    relative_time_description: "1 month ago",
    text: "Outstanding service and delicious food! This has become our go-to place for Thai food in Pattaya. The massaman curry is a must-try!",
    time: Date.now() - 2592000000, // 1 month ago
  },
]

/**
 * GET /api/google/reviews/latest
 *
 * 1. If GOOGLE_MAPS_API_KEY is configured, attempt to fetch real reviews
 *    (pseudo-implementation left as TODO for production use).
 * 2. Otherwise, immediately fall back to static sample data so the client
 *    widget never receives a non-200 response.
 */
export async function GET(_req: NextRequest) {
  const GOOGLE_KEY = env("GOOGLE_MAPS_API_KEY")

  // No key → always return fallback
  if (!GOOGLE_KEY) {
    return NextResponse.json(
      {
        success: true,
        data: FALLBACK_REVIEWS,
        source: "mock_data",
        message: "Using sample reviews (Google API key not configured)",
      },
      { status: 200 },
    )
  }

  try {
    // --- 👉 TODO: Replace this block with a real Google Places API call ----
    // For demonstration, respond with fallback but indicate it is “live”.
    // const placeId = 'ChIJ8VvIOwFjUDARqnxzjBNyQX4' // example place_id
    // const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=review,rating,user_ratings_total,name,formatted_address&key=${GOOGLE_KEY}`
    // const res = await fetch(url)
    // const json = await res.json()
    // Map the Google response into your own shape…
    // return NextResponse.json(mappedResults, { status: 200 })
    // ----------------------------------------------------------------------

    const mockReviews = [
      {
        id: "1",
        author_name: "Sarah Johnson",
        author_url: "https://www.google.com/maps/contrib/123",
        language: "en",
        profile_photo_url: "/placeholder.svg?height=40&width=40&text=SJ",
        rating: 5,
        relative_time_description: "2 days ago",
        text: "Amazing Thai food and great atmosphere! The pad thai was exceptional and the service was friendly.",
        time: Date.now() - 172800000,
      },
      {
        id: "2",
        author_name: "Mike Chen",
        author_url: "https://www.google.com/maps/contrib/456",
        language: "en",
        profile_photo_url: "/placeholder.svg?height=40&width=40&text=MC",
        rating: 4,
        relative_time_description: "1 week ago",
        text: "Great location near the beach. Food was good and prices reasonable. The green curry was delicious!",
        time: Date.now() - 604800000,
      },
    ]

    return NextResponse.json(
      {
        success: true,
        data: mockReviews,
        source: "mock_data",
        message: "Using sample reviews",
      },
      { status: 200 },
    )
  } catch (err) {
    console.error("Google Reviews API error:", err)
    // Even on error, respond with fallback so the widget works
    return NextResponse.json(
      {
        success: true,
        data: [],
        source: "error_fallback",
        message: "Unable to load reviews at this time",
      },
      { status: 200 },
    )
  }
}
