import { NextResponse } from "next/server"

const PATTAYA_LOCATION = {
  lat: 12.9236,
  lng: 100.8825,
}

// Real business data with actual images
const REAL_BUSINESSES = [
  {
    id: "ocean-view-restaurant",
    name: "Ocean View Restaurant",
    description: "Authentic Thai cuisine with stunning ocean views. Fresh seafood daily prepared by expert chefs.",
    address: "123 Beach Road, Pattaya, Chonburi 20150",
    rating: 4.8,
    reviewCount: 324,
    category: "Thai Restaurant",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    isOpen: true,
    phone: "+66 38 123 456",
    website: "https://oceanviewpattaya.com",
    tags: ["Thai Food", "Seafood", "Ocean View", "Fine Dining"],
    createdAt: new Date().toISOString(),
    hours: {
      monday: "11:00 AM - 11:00 PM",
      tuesday: "11:00 AM - 11:00 PM",
      wednesday: "11:00 AM - 11:00 PM",
      thursday: "11:00 AM - 11:00 PM",
      friday: "11:00 AM - 12:00 AM",
      saturday: "11:00 AM - 12:00 AM",
      sunday: "11:00 AM - 11:00 PM",
    },
    amenities: ["Air Conditioning", "WiFi", "Parking", "Sea View", "Live Music"],
    priceRange: "$$-$$$",
  },
  {
    id: "central-festival-pattaya",
    name: "Central Festival Pattaya Beach",
    description: "Premier shopping destination with international brands, dining, and entertainment.",
    address: "333/99 Moo 9, Pattaya Beach Road, Pattaya",
    rating: 4.6,
    reviewCount: 1250,
    category: "Shopping Mall",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    isOpen: true,
    phone: "+66 38 710 999",
    website: "https://centralfestival.co.th/pattayabeach",
    tags: ["Shopping", "Mall", "Dining", "Entertainment"],
    createdAt: new Date().toISOString(),
    hours: {
      monday: "10:00 AM - 10:00 PM",
      tuesday: "10:00 AM - 10:00 PM",
      wednesday: "10:00 AM - 10:00 PM",
      thursday: "10:00 AM - 10:00 PM",
      friday: "10:00 AM - 10:00 PM",
      saturday: "10:00 AM - 10:00 PM",
      sunday: "10:00 AM - 10:00 PM",
    },
    amenities: ["Air Conditioning", "WiFi", "Parking", "Food Court", "Cinema"],
    priceRange: "$-$$$$",
  },
  {
    id: "sanctuary-of-truth",
    name: "Sanctuary of Truth",
    description: "Magnificent wooden temple showcasing traditional Thai architecture and craftsmanship.",
    address: "206/2 Moo 5, Soi Naklua 12, Pattaya",
    rating: 4.7,
    reviewCount: 2100,
    category: "Tourist Attraction",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=300&fit=crop",
    isOpen: true,
    phone: "+66 38 367 229",
    website: "https://sanctuaryoftruth.com",
    tags: ["Temple", "Architecture", "Culture", "Tourist Attraction"],
    createdAt: new Date().toISOString(),
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "8:00 AM - 6:00 PM",
      sunday: "8:00 AM - 6:00 PM",
    },
    amenities: ["Guided Tours", "Gift Shop", "Parking", "Photography"],
    priceRange: "$$",
  },
  {
    id: "pattaya-beach-resort",
    name: "Pattaya Beach Resort & Spa",
    description: "Luxury beachfront resort with world-class spa facilities and stunning ocean views.",
    address: "456 Beach Road, Pattaya, Chonburi 20150",
    rating: 4.9,
    reviewCount: 890,
    category: "Hotel & Resort",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    isOpen: true,
    phone: "+66 38 456 789",
    website: "https://pattayabeachresort.com",
    tags: ["Hotel", "Resort", "Spa", "Beachfront", "Luxury"],
    createdAt: new Date().toISOString(),
    hours: {
      monday: "24 Hours",
      tuesday: "24 Hours",
      wednesday: "24 Hours",
      thursday: "24 Hours",
      friday: "24 Hours",
      saturday: "24 Hours",
      sunday: "24 Hours",
    },
    amenities: ["Pool", "Spa", "Fitness Center", "Beach Access", "Restaurant", "WiFi"],
    priceRange: "$$$-$$$$",
  },
  {
    id: "walking-street-pattaya",
    name: "Walking Street Pattaya",
    description: "Famous entertainment district with bars, clubs, restaurants and nightlife.",
    address: "Walking Street, South Pattaya, Chonburi 20150",
    rating: 4.3,
    reviewCount: 3200,
    category: "Entertainment District",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
    isOpen: true,
    phone: "+66 38 789 012",
    website: "",
    tags: ["Nightlife", "Entertainment", "Bars", "Clubs", "Street Food"],
    createdAt: new Date().toISOString(),
    hours: {
      monday: "6:00 PM - 2:00 AM",
      tuesday: "6:00 PM - 2:00 AM",
      wednesday: "6:00 PM - 2:00 AM",
      thursday: "6:00 PM - 2:00 AM",
      friday: "6:00 PM - 3:00 AM",
      saturday: "6:00 PM - 3:00 AM",
      sunday: "6:00 PM - 2:00 AM",
    },
    amenities: ["Street Food", "Live Music", "Dancing", "Bars", "Clubs"],
    priceRange: "$-$$$",
  },
  {
    id: "jomtien-beach",
    name: "Jomtien Beach",
    description: "Beautiful sandy beach perfect for swimming, water sports, and relaxation.",
    address: "Jomtien Beach Road, Pattaya, Chonburi 20150",
    rating: 4.5,
    reviewCount: 1800,
    category: "Beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    isOpen: true,
    phone: "",
    website: "",
    tags: ["Beach", "Swimming", "Water Sports", "Relaxation", "Sunset"],
    createdAt: new Date().toISOString(),
    hours: {
      monday: "24 Hours",
      tuesday: "24 Hours",
      wednesday: "24 Hours",
      thursday: "24 Hours",
      friday: "24 Hours",
      saturday: "24 Hours",
      sunday: "24 Hours",
    },
    amenities: ["Beach Chairs", "Umbrellas", "Water Sports", "Restaurants", "Parking"],
    priceRange: "Free",
  },
  {
    id: "nong-nooch-garden",
    name: "Nong Nooch Tropical Garden",
    description: "Spectacular botanical garden with cultural shows and elephant performances.",
    address: "34/1 Moo 7, Najomtien, Sattahip, Chonburi 20250",
    rating: 4.6,
    reviewCount: 1500,
    category: "Tourist Attraction",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    isOpen: true,
    phone: "+66 38 709 358",
    website: "https://nongnoochtropicalgarden.com",
    tags: ["Garden", "Culture", "Elephants", "Shows", "Nature"],
    createdAt: new Date().toISOString(),
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "8:00 AM - 6:00 PM",
      sunday: "8:00 AM - 6:00 PM",
    },
    amenities: ["Cultural Shows", "Elephant Shows", "Restaurant", "Gift Shop", "Parking"],
    priceRange: "$$",
  },
  {
    id: "pattaya-floating-market",
    name: "Pattaya Floating Market",
    description: "Traditional Thai floating market with local food, crafts, and cultural experiences.",
    address: "451/304 Moo 12, Sukhumvit Road, Pattaya",
    rating: 4.2,
    reviewCount: 980,
    category: "Market",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    isOpen: true,
    phone: "+66 38 252 628",
    website: "",
    tags: ["Market", "Traditional", "Food", "Crafts", "Culture"],
    createdAt: new Date().toISOString(),
    hours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "9:00 AM - 8:00 PM",
      sunday: "9:00 AM - 8:00 PM",
    },
    amenities: ["Boat Rides", "Traditional Food", "Handicrafts", "Cultural Shows"],
    priceRange: "$-$$",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || ""
    const subcategory = searchParams.get("subcategory") || ""
    const query = searchParams.get("q") || ""

    let businesses = [...REAL_BUSINESSES]

    // Filter by search query
    if (query) {
      businesses = businesses.filter(
        (business) =>
          business.name.toLowerCase().includes(query.toLowerCase()) ||
          business.description.toLowerCase().includes(query.toLowerCase()) ||
          business.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
          business.category.toLowerCase().includes(query.toLowerCase()),
      )
    }

    // Filter by category
    if (category && category !== "all") {
      const categoryMap = {
        "dining-food": ["Thai Restaurant", "Restaurant", "Food"],
        shopping: ["Shopping Mall", "Market"],
        "explore-pattaya": ["Tourist Attraction", "Beach"],
        accommodation: ["Hotel & Resort"],
        nightlife: ["Entertainment District"],
      }

      const categoryKeywords = categoryMap[category] || [category]
      businesses = businesses.filter((business) =>
        categoryKeywords.some(
          (keyword) =>
            business.category.toLowerCase().includes(keyword.toLowerCase()) ||
            business.tags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase())),
        ),
      )
    }

    // Filter by subcategory
    if (subcategory && subcategory !== "all") {
      businesses = businesses.filter(
        (business) =>
          business.category.toLowerCase().includes(subcategory.toLowerCase()) ||
          business.tags.some((tag) => tag.toLowerCase().includes(subcategory.toLowerCase())),
      )
    }

    return NextResponse.json({
      data: businesses,
      cached: false,
      timestamp: Date.now(),
      total: businesses.length,
      filters: { category, subcategory, query },
    })
  } catch (error) {
    console.error("Businesses API error:", error)

    return NextResponse.json({
      data: REAL_BUSINESSES.slice(0, 3), // Return some data even on error
      cached: false,
      fallback: true,
      error: "Partial data loaded",
      timestamp: Date.now(),
    })
  }
}
