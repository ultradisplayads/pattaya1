import { NextResponse } from "next/server"

interface GrouponDeal {
  id: string
  title: string
  description: string
  merchant: {
    name: string
    websiteUrl: string
    address?: string
  }
  dealUrl: string
  price: {
    formattedAmount: string
    amount: number
    currency: string
  }
  value: {
    formattedAmount: string
    amount: number
    currency: string
  }
  discount: {
    percent: number
    formattedAmount: string
  }
  images: {
    small: string
    medium: string
    large: string
  }[]
  category: string
  expiresAt: string
  soldQuantity: number
  isLimitedQuantity: boolean
  location: {
    city: string
    country: string
    lat?: number
    lng?: number
  }
  tags: string[]
  rating?: number
  reviewCount?: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "pattaya"
    const category = searchParams.get("category") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Mock Groupon-style deals for Pattaya
    const mockDeals: GrouponDeal[] = [
      {
        id: "deal-1",
        title: "50% Off Traditional Thai Massage at Luxury Spa",
        description:
          "Relax and rejuvenate with an authentic Thai massage experience. Includes aromatherapy oils and herbal compress treatment.",
        merchant: {
          name: "Royal Thai Spa & Wellness",
          websiteUrl: "https://royalthaispa-pattaya.com",
          address: "123 Beach Road, Central Pattaya",
        },
        dealUrl: "#",
        price: {
          formattedAmount: "฿500",
          amount: 500,
          currency: "THB",
        },
        value: {
          formattedAmount: "฿1,000",
          amount: 1000,
          currency: "THB",
        },
        discount: {
          percent: 50,
          formattedAmount: "฿500",
        },
        images: [
          {
            small: "/placeholder.svg?height=100&width=150&text=Thai+Massage",
            medium: "/placeholder.svg?height=200&width=300&text=Thai+Massage",
            large: "/placeholder.svg?height=400&width=600&text=Thai+Massage",
          },
        ],
        category: "Health & Beauty",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        soldQuantity: 234,
        isLimitedQuantity: true,
        location: {
          city: "Pattaya",
          country: "Thailand",
          lat: 12.9236,
          lng: 100.8825,
        },
        tags: ["spa", "massage", "wellness", "relaxation"],
        rating: 4.8,
        reviewCount: 156,
      },
      {
        id: "deal-2",
        title: "Buy 1 Get 1 Free Seafood Buffet Dinner",
        description:
          "All-you-can-eat seafood buffet featuring fresh lobster, crab, prawns, and local Thai specialties with ocean views.",
        merchant: {
          name: "Ocean View Restaurant",
          websiteUrl: "https://oceanview-pattaya.com",
          address: "456 Jomtien Beach Road, Jomtien",
        },
        dealUrl: "#",
        price: {
          formattedAmount: "฿899",
          amount: 899,
          currency: "THB",
        },
        value: {
          formattedAmount: "฿1,798",
          amount: 1798,
          currency: "THB",
        },
        discount: {
          percent: 50,
          formattedAmount: "฿899",
        },
        images: [
          {
            small: "/placeholder.svg?height=100&width=150&text=Seafood+Buffet",
            medium: "/placeholder.svg?height=200&width=300&text=Seafood+Buffet",
            large: "/placeholder.svg?height=400&width=600&text=Seafood+Buffet",
          },
        ],
        category: "Food & Drink",
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        soldQuantity: 89,
        isLimitedQuantity: false,
        location: {
          city: "Pattaya",
          country: "Thailand",
          lat: 12.8642,
          lng: 100.9056,
        },
        tags: ["seafood", "buffet", "dining", "ocean view"],
        rating: 4.6,
        reviewCount: 203,
      },
      {
        id: "deal-3",
        title: "30% Off Coral Island Day Trip with Lunch",
        description:
          "Full day excursion to Coral Island including speedboat transfer, snorkeling equipment, and Thai lunch buffet.",
        merchant: {
          name: "Pattaya Adventure Tours",
          websiteUrl: "https://pattaya-adventures.com",
          address: "789 Bali Hai Pier, South Pattaya",
        },
        dealUrl: "#",
        price: {
          formattedAmount: "฿1,050",
          amount: 1050,
          currency: "THB",
        },
        value: {
          formattedAmount: "฿1,500",
          amount: 1500,
          currency: "THB",
        },
        discount: {
          percent: 30,
          formattedAmount: "฿450",
        },
        images: [
          {
            small: "/placeholder.svg?height=100&width=150&text=Coral+Island",
            medium: "/placeholder.svg?height=200&width=300&text=Coral+Island",
            large: "/placeholder.svg?height=400&width=600&text=Coral+Island",
          },
        ],
        category: "Travel & Tourism",
        expiresAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        soldQuantity: 145,
        isLimitedQuantity: true,
        location: {
          city: "Pattaya",
          country: "Thailand",
          lat: 12.9236,
          lng: 100.8825,
        },
        tags: ["island", "snorkeling", "tour", "adventure"],
        rating: 4.7,
        reviewCount: 98,
      },
      {
        id: "deal-4",
        title: "40% Off Premium Golf Package at Championship Course",
        description:
          "18-hole round of golf at award-winning championship course including cart, caddy, and clubhouse lunch.",
        merchant: {
          name: "Pattaya Country Club & Resort",
          websiteUrl: "https://pattayacountryclub.com",
          address: "321 Golf Course Road, East Pattaya",
        },
        dealUrl: "#",
        price: {
          formattedAmount: "฿1,800",
          amount: 1800,
          currency: "THB",
        },
        value: {
          formattedAmount: "฿3,000",
          amount: 3000,
          currency: "THB",
        },
        discount: {
          percent: 40,
          formattedAmount: "฿1,200",
        },
        images: [
          {
            small: "/placeholder.svg?height=100&width=150&text=Golf+Course",
            medium: "/placeholder.svg?height=200&width=300&text=Golf+Course",
            large: "/placeholder.svg?height=400&width=600&text=Golf+Course",
          },
        ],
        category: "Sports & Recreation",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        soldQuantity: 67,
        isLimitedQuantity: false,
        location: {
          city: "Pattaya",
          country: "Thailand",
          lat: 12.95,
          lng: 100.9167,
        },
        tags: ["golf", "sports", "luxury", "resort"],
        rating: 4.9,
        reviewCount: 124,
      },
    ]

    // Filter by category if specified
    const filteredDeals =
      category === "all"
        ? mockDeals
        : mockDeals.filter((deal) => deal.category.toLowerCase().includes(category.toLowerCase()))

    return NextResponse.json({
      success: true,
      deals: filteredDeals.slice(0, limit),
      totalDeals: filteredDeals.length,
      location,
      category,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching Groupon deals:", error)

    return NextResponse.json(
      {
        success: false,
        deals: [],
        error: "Failed to fetch deals",
      },
      { status: 500 },
    )
  }
}
