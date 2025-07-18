import { type NextRequest, NextResponse } from "next/server"

interface GrouponDeal {
  id: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
  category: string
  vendor: {
    name: string
    rating: number
    reviewCount: number
  }
  image: string
  location: string
  validUntil: string
  soldCount: number
  maxQuantity: number
  highlights: string[]
  tags: string[]
  isFlashDeal: boolean
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Mock Groupon-style deals data
    const mockDeals: GrouponDeal[] = [
      {
        id: "groupon-1",
        title: "Luxury Spa Day Package - 4 Hours of Bliss",
        description:
          "Indulge in a complete spa experience with massage, facial, body wrap, and access to all facilities.",
        originalPrice: 4500,
        discountedPrice: 1999,
        discountPercentage: 56,
        category: "spa",
        vendor: {
          name: "Royal Spa Pattaya",
          rating: 4.7,
          reviewCount: 1834,
        },
        image: "/placeholder.svg?height=300&width=400",
        location: "Central Pattaya",
        validUntil: "2024-02-15T23:59:59Z",
        soldCount: 234,
        maxQuantity: 500,
        highlights: ["4-Hour Package", "Full Body Massage", "Facial Treatment", "Body Wrap"],
        tags: ["luxury", "spa", "relaxation", "wellness"],
        isFlashDeal: true,
      },
      {
        id: "groupon-2",
        title: "Premium Seafood Buffet for 2 People",
        description:
          "All-you-can-eat seafood buffet featuring fresh lobster, crab, prawns, sushi, and international cuisine.",
        originalPrice: 3600,
        discountedPrice: 1799,
        discountPercentage: 50,
        category: "restaurant",
        vendor: {
          name: "Ocean Pearl Restaurant",
          rating: 4.5,
          reviewCount: 2156,
        },
        image: "/placeholder.svg?height=300&width=400",
        location: "Pattaya Beach Road",
        validUntil: "2024-02-20T23:59:59Z",
        soldCount: 456,
        maxQuantity: 800,
        highlights: ["For 2 People", "Fresh Seafood", "International Buffet", "Ocean View"],
        tags: ["seafood", "buffet", "couples", "dining"],
        isFlashDeal: false,
      },
      {
        id: "groupon-3",
        title: "Island Hopping Tour with Lunch & Snorkeling",
        description:
          "Full-day island hopping adventure visiting 3 beautiful islands with snorkeling, lunch, and transfers.",
        originalPrice: 2800,
        discountedPrice: 1399,
        discountPercentage: 50,
        category: "tour",
        vendor: {
          name: "Pattaya Island Tours",
          rating: 4.6,
          reviewCount: 987,
        },
        image: "/placeholder.svg?height=300&width=400",
        location: "Bali Hai Pier",
        validUntil: "2024-02-25T23:59:59Z",
        soldCount: 123,
        maxQuantity: 300,
        highlights: ["3 Islands", "Snorkeling Gear", "Lunch Included", "Hotel Transfer"],
        tags: ["adventure", "islands", "snorkeling", "tour"],
        isFlashDeal: false,
      },
      {
        id: "groupon-4",
        title: "Deluxe Hotel Room - 2 Nights with Breakfast",
        description: "Stay in a deluxe room at a 4-star hotel with daily breakfast, pool access, and city views.",
        originalPrice: 6000,
        discountedPrice: 2999,
        discountPercentage: 50,
        category: "hotel",
        vendor: {
          name: "Grand Plaza Hotel",
          rating: 4.4,
          reviewCount: 1567,
        },
        image: "/placeholder.svg?height=300&width=400",
        location: "Central Pattaya",
        validUntil: "2024-03-01T23:59:59Z",
        soldCount: 89,
        maxQuantity: 200,
        highlights: ["2 Nights", "Daily Breakfast", "Pool Access", "City View"],
        tags: ["hotel", "accommodation", "breakfast", "pool"],
        isFlashDeal: false,
      },
      {
        id: "groupon-5",
        title: "Thai Cooking Class with Market Tour",
        description: "Learn authentic Thai cooking with a professional chef, including market tour and recipe book.",
        originalPrice: 2200,
        discountedPrice: 1099,
        discountPercentage: 50,
        category: "activity",
        vendor: {
          name: "Thai Culinary School",
          rating: 4.8,
          reviewCount: 743,
        },
        image: "/placeholder.svg?height=300&width=400",
        location: "Naklua Market",
        validUntil: "2024-02-28T23:59:59Z",
        soldCount: 167,
        maxQuantity: 250,
        highlights: ["Market Tour", "5 Dishes", "Recipe Book", "Certificate"],
        tags: ["cooking", "cultural", "authentic", "learning"],
        isFlashDeal: true,
      },
    ]

    // Filter by category if specified
    let filteredDeals = mockDeals
    if (category && category !== "all") {
      filteredDeals = mockDeals.filter((deal) => deal.category === category)
    }

    // Limit results
    const limitedDeals = filteredDeals.slice(0, limit)

    return NextResponse.json({
      success: true,
      deals: limitedDeals,
      total: filteredDeals.length,
      categories: ["spa", "restaurant", "tour", "hotel", "activity"],
    })
  } catch (error) {
    console.error("Groupon API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch deals",
        deals: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dealId, quantity = 1, userEmail } = body

    if (!dealId || !userEmail) {
      return NextResponse.json({ success: false, error: "Deal ID and user email are required" }, { status: 400 })
    }

    // Mock purchase processing
    const purchaseId = `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      purchaseId,
      message: "Deal purchased successfully",
      dealId,
      quantity,
      userEmail,
      confirmationCode: `CONF${Date.now()}`,
    })
  } catch (error) {
    console.error("Purchase error:", error)
    return NextResponse.json({ success: false, error: "Failed to process purchase" }, { status: 500 })
  }
}
